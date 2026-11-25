import { query } from "@/lib/db";

// All numbers the admin dashboard shows, computed straight from the events table.

export interface Overview {
  visitors1: number;
  visitors7: number;
  visitors30: number;
  pageviews30: number;
  returningRate30: number; // share of 30 day visitors active on 2 or more different days
  outbound30: number;
  addCity30: number;
}

export async function overview(): Promise<Overview> {
  const [r] = await query<Record<string, string>>(`
    WITH v AS (
      SELECT visitor_id, COUNT(DISTINCT ts::date) AS days
      FROM events WHERE ts > now() - interval '30 days' GROUP BY visitor_id
    )
    SELECT
      (SELECT COUNT(DISTINCT visitor_id) FROM events WHERE ts > now() - interval '1 day') AS visitors1,
      (SELECT COUNT(DISTINCT visitor_id) FROM events WHERE ts > now() - interval '7 days') AS visitors7,
      (SELECT COUNT(*) FROM v) AS visitors30,
      (SELECT COUNT(*) FROM events WHERE event = 'pageview' AND ts > now() - interval '30 days') AS pageviews30,
      (SELECT COUNT(*) FILTER (WHERE days >= 2) FROM v) AS returning30,
      (SELECT COUNT(*) FROM events WHERE event = 'outbound' AND ts > now() - interval '30 days') AS outbound30,
      (SELECT COUNT(*) FROM events WHERE event = 'add_city' AND ts > now() - interval '30 days') AS addcity30
  `);
  const visitors30 = Number(r.visitors30);
  return {
    visitors1: Number(r.visitors1),
    visitors7: Number(r.visitors7),
    visitors30,
    pageviews30: Number(r.pageviews30),
    returningRate30: visitors30 ? Number(r.returning30) / visitors30 : 0,
    outbound30: Number(r.outbound30),
    addCity30: Number(r.addcity30),
  };
}

export interface DailyRow {
  day: string;
  visitors: number;
  newVisitors: number;
  pageviews: number;
}

export async function daily(days = 30): Promise<DailyRow[]> {
  const rows = await query<Record<string, string>>(
    `WITH first_seen AS (SELECT visitor_id, MIN(ts::date) AS d FROM events GROUP BY visitor_id),
     series AS (SELECT generate_series(current_date - ($1::int - 1), current_date, interval '1 day')::date AS day)
     SELECT to_char(s.day, 'YYYY-MM-DD') AS day,
       COUNT(DISTINCT e.visitor_id) AS visitors,
       COUNT(DISTINCT e.visitor_id) FILTER (WHERE f.d = s.day) AS new_visitors,
       COUNT(e.id) FILTER (WHERE e.event = 'pageview') AS pageviews
     FROM series s
     LEFT JOIN events e ON e.ts::date = s.day
     LEFT JOIN first_seen f ON f.visitor_id = e.visitor_id
     GROUP BY s.day ORDER BY s.day`,
    [days],
  );
  return rows.map((r) => ({
    day: r.day,
    visitors: Number(r.visitors),
    newVisitors: Number(r.new_visitors),
    pageviews: Number(r.pageviews),
  }));
}

export interface CohortRow {
  week: string; // Monday of the week the visitors first came
  size: number;
  week1: number | null; // share that came back 1 to 7 days after their first day
  week4: number | null; // share that came back 8 to 30 days after their first day
}

// Retention: of the people who first came in a given week, how many came back?
export async function cohorts(): Promise<CohortRow[]> {
  const rows = await query<Record<string, string>>(`
    WITH first_seen AS (SELECT visitor_id, MIN(ts) AS first_ts FROM events GROUP BY visitor_id),
    returns AS (
      SELECT f.visitor_id, date_trunc('week', f.first_ts) AS week, f.first_ts,
        BOOL_OR(e.ts::date BETWEEN f.first_ts::date + 1 AND f.first_ts::date + 7) AS w1,
        BOOL_OR(e.ts::date BETWEEN f.first_ts::date + 8 AND f.first_ts::date + 30) AS w4
      FROM first_seen f JOIN events e USING (visitor_id)
      GROUP BY f.visitor_id, f.first_ts
    )
    SELECT to_char(week, 'YYYY-MM-DD') AS week, COUNT(*) AS size,
      COUNT(*) FILTER (WHERE w1) AS w1,
      COUNT(*) FILTER (WHERE w4) AS w4,
      MAX(first_ts) AS last_first
    FROM returns
    WHERE week > now() - interval '12 weeks'
    GROUP BY week ORDER BY week DESC
  `);
  const now = Date.now();
  return rows.map((r) => {
    const size = Number(r.size);
    const ageDays = (now - new Date(r.week).getTime()) / 86400000;
    return {
      week: r.week,
      size,
      // A cohort is only "complete" once enough time has passed to measure it.
      week1: ageDays >= 14 ? Number(r.w1) / size : null,
      week4: ageDays >= 37 ? Number(r.w4) / size : null,
    };
  });
}

export interface CountRow {
  label: string;
  count: number;
}

async function top(sql: string): Promise<CountRow[]> {
  const rows = await query<{ label: string | null; count: string }>(sql);
  return rows.map((r) => ({ label: r.label ?? "(none)", count: Number(r.count) }));
}

export const topCities = () =>
  top(`SELECT city AS label, COUNT(DISTINCT visitor_id) AS count FROM events
       WHERE event = 'pageview' AND city IS NOT NULL AND ts > now() - interval '30 days'
       GROUP BY city ORDER BY count DESC LIMIT 15`);

export const topReferrers = () =>
  top(`SELECT COALESCE(referrer_host, 'Direct or unknown') AS label, COUNT(DISTINCT visitor_id) AS count FROM events
       WHERE event = 'pageview' AND ts > now() - interval '30 days'
       GROUP BY label ORDER BY count DESC LIMIT 10`);

export const topCountries = () =>
  top(`SELECT COALESCE(country, 'Unknown') AS label, COUNT(DISTINCT visitor_id) AS count FROM events
       WHERE ts > now() - interval '30 days' GROUP BY label ORDER BY count DESC LIMIT 10`);

export const topOutbound = () =>
  top(`SELECT target AS label, COUNT(*) AS count FROM events
       WHERE event = 'outbound' AND ts > now() - interval '30 days'
       GROUP BY target ORDER BY count DESC LIMIT 10`);
