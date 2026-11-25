import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, timingSafeEqual } from "node:crypto";
import { hasDatabase } from "@/lib/db";
import {
  cohorts,
  daily,
  overview,
  topCities,
  topCountries,
  topOutbound,
  topReferrers,
  type CountRow,
} from "@/lib/analytics";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

const COOKIE = "lw_admin";

function token() {
  return createHash("sha256").update(`dancingtonight-admin:${process.env.ADMIN_PASSWORD}`).digest("hex");
}

async function isAuthed() {
  if (!process.env.ADMIN_PASSWORD) return false;
  const got = (await cookies()).get(COOKIE)?.value ?? "";
  const want = token();
  return got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

async function login(formData: FormData) {
  "use server";
  const pw = String(formData.get("password") ?? "");
  const real = process.env.ADMIN_PASSWORD ?? "";
  const ok =
    real.length > 0 && pw.length === real.length && timingSafeEqual(Buffer.from(pw), Buffer.from(real));
  if (ok) {
    (await cookies()).set(COOKIE, token(), {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 14,
      path: "/admin",
    });
  }
  redirect(ok ? "/admin" : "/admin?error=1");
}

const pct = (v: number | null) => (v === null ? "Not yet" : `${Math.round(v * 100)}%`);

function Table({ title, rows, unit }: { title: string; rows: CountRow[]; unit: string }) {
  return (
    <div className="admin-box">
      <h3>{title}</h3>
      {rows.length === 0 ? (
        <p className="empty">No data yet.</p>
      ) : (
        <table>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label}>
                <td>{r.label}</td>
                <td className="num">
                  {r.count} {unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (!process.env.ADMIN_PASSWORD) {
    return (
      <div className="admin">
        <h1>Admin</h1>
        <p>Set the ADMIN_PASSWORD environment variable in Vercel to turn on this page.</p>
      </div>
    );
  }

  if (!(await isAuthed())) {
    const { error } = await searchParams;
    return (
      <div className="admin">
        <h1>Admin</h1>
        <form action={login} className="admin-login">
          <input type="password" name="password" placeholder="Password" aria-label="Password" required />
          <button type="submit">Sign in</button>
        </form>
        {error && <p className="empty">Wrong password.</p>}
      </div>
    );
  }

  if (!hasDatabase()) {
    return (
      <div className="admin">
        <h1>Admin</h1>
        <p>No database yet. In Vercel: Storage, Create Database, Neon (Postgres), connect it to this project. DATABASE_URL is then set automatically.</p>
      </div>
    );
  }

  const [o, days, weeks, cities, refs, countries, outbound] = await Promise.all([
    overview(),
    daily(30),
    cohorts(),
    topCities(),
    topReferrers(),
    topCountries(),
    topOutbound(),
  ]);
  const max = Math.max(1, ...days.map((d) => d.visitors));

  const tiles = [
    { label: "Visitors today", value: o.visitors1 },
    { label: "Visitors, 7 days", value: o.visitors7 },
    { label: "Visitors, 30 days", value: o.visitors30 },
    { label: "Page views, 30 days", value: o.pageviews30 },
    { label: "Came back on another day", value: pct(o.returningRate30), hint: "share of 30 day visitors" },
    { label: "Source link clicks, 30 days", value: o.outbound30, hint: "visitors opening an organizer link" },
    { label: "Cities saved, 30 days", value: o.addCity30 },
  ];

  return (
    <div className="admin">
      <h1>Admin</h1>

      <div className="tiles">
        {tiles.map((t) => (
          <div key={t.label} className="tile">
            <span className="tile-label">{t.label}</span>
            <strong>{t.value}</strong>
            {t.hint && <small>{t.hint}</small>}
          </div>
        ))}
      </div>

      <div className="admin-box">
        <h3>Daily visitors, last 30 days</h3>
        <div className="bars" role="img" aria-label="Daily visitors bar chart; the table below has the same numbers">
          {days.map((d) => (
            <div key={d.day} className="bar-slot" title={`${d.day}: ${d.visitors} visitors (${d.newVisitors} new), ${d.pageviews} page views`}>
              <div className="bar" style={{ height: `${(d.visitors / max) * 100}%` }} />
            </div>
          ))}
        </div>
        <div className="bars-axis">
          <span>{days[0]?.day}</span>
          <span>{days[days.length - 1]?.day}</span>
        </div>
        <details>
          <summary>Show as table</summary>
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th className="num">Visitors</th>
                <th className="num">New</th>
                <th className="num">Page views</th>
              </tr>
            </thead>
            <tbody>
              {[...days].reverse().map((d) => (
                <tr key={d.day}>
                  <td>{d.day}</td>
                  <td className="num">{d.visitors}</td>
                  <td className="num">{d.newVisitors}</td>
                  <td className="num">{d.pageviews}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </div>

      <div className="admin-box">
        <h3>Retention by first visit week</h3>
        <p className="empty">Of the people who first came in a week, the share that returned. Shows &quot;Not yet&quot; until enough time has passed.</p>
        <table>
          <thead>
            <tr>
              <th>First week</th>
              <th className="num">New visitors</th>
              <th className="num">Back within 7 days</th>
              <th className="num">Back on day 8 to 30</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((w) => (
              <tr key={w.week}>
                <td>{w.week}</td>
                <td className="num">{w.size}</td>
                <td className="num">{pct(w.week1)}</td>
                <td className="num">{pct(w.week4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-grid">
        <Table title="Most viewed cities" rows={cities} unit="visitors" />
        <Table title="Where visitors come from" rows={refs} unit="visitors" />
        <Table title="Visitor countries" rows={countries} unit="visitors" />
        <Table title="Most clicked source links" rows={outbound} unit="clicks" />
      </div>
    </div>
  );
}
