import { NextResponse, type NextRequest } from "next/server";
import { hasDatabase, query } from "@/lib/db";

const ALLOWED_EVENTS = new Set(["pageview", "outbound", "add_city"]);
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse/i;
const COOKIE = "lw_vid";

function clip(v: unknown, max = 300) {
  return typeof v === "string" && v.length ? v.slice(0, max) : null;
}

// Receives one activity event from the browser and stores it.
export async function POST(req: NextRequest) {
  if (!hasDatabase() || BOT.test(req.headers.get("user-agent") ?? "")) {
    return new NextResponse(null, { status: 204 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  const event = clip(body.event, 30);
  if (!event || !ALLOWED_EVENTS.has(event)) return new NextResponse(null, { status: 400 });

  const path = clip(body.path);
  if (path?.startsWith("/admin")) return new NextResponse(null, { status: 204 });

  // Anonymous visitor id: a random value in a first party cookie, no personal data.
  let visitorId = req.cookies.get(COOKIE)?.value;
  const isNew = !visitorId;
  if (!visitorId) visitorId = crypto.randomUUID();

  let referrerHost: string | null = null;
  try {
    const ref = clip(body.referrer);
    if (ref) {
      const host = new URL(ref).host;
      if (host !== req.nextUrl.host) referrerHost = host;
    }
  } catch {
    /* ignore malformed referrer */
  }

  try {
    await query(
      `INSERT INTO events (visitor_id, event, path, city, target, referrer_host, country)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        visitorId,
        event,
        path,
        clip(body.city, 60),
        clip(body.target),
        referrerHost,
        req.headers.get("x-vercel-ip-country"),
      ],
    );
  } catch (err) {
    console.error("track failed", err);
  }

  const res = new NextResponse(null, { status: 204 });
  if (isNew) {
    res.cookies.set(COOKIE, visitorId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }
  return res;
}
