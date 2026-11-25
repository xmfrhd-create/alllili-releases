import { cities } from "@/data/cities";
import { festivals, schools as baseSchools, socials as baseSocials } from "@/data/listings";
import { worldSchools, worldSocials } from "@/data/world";

const socials = [...baseSocials, ...worldSocials];
const schools = [...baseSchools, ...worldSchools];
import { GENRES, type City, type Genre, type RecurringSocial, type Weekday } from "@/lib/types";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dancingtonight.vercel.app";

// A city page is shown to Google only when it has real content.
// Thin pages hurt the whole site in Google's ranking (scaled content policy).
export const MIN_LISTINGS_TO_INDEX = 3;

export function isGenre(value: string): value is Genre {
  return (GENRES as readonly string[]).includes(value);
}

export function getCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

export function allCities(): City[] {
  return [...cities].sort((a, b) => a.name.localeCompare(b.name));
}

export function socialsIn(citySlug: string, genre?: Genre) {
  return socials.filter((s) => s.citySlug === citySlug && (!genre || s.genres.includes(genre)));
}

export function schoolsIn(citySlug: string, genre?: Genre) {
  return schools.filter((s) => s.citySlug === citySlug && (!genre || s.genres.includes(genre)));
}

export function listingCount(citySlug: string) {
  return socialsIn(citySlug).length + schoolsIn(citySlug).length;
}

// Today's date (YYYY-MM-DD) as seen in the given time zone.
export function todayIn(timezone: string, now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: timezone }).format(now);
}

export function upcomingFestivals(genre?: Genre, now = new Date()) {
  const today = todayIn("UTC", now);
  return festivals
    .filter((f) => f.endDate >= today && (!genre || f.genres.includes(genre)))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export interface DayPlan {
  date: string; // YYYY-MM-DD
  weekday: Weekday;
  label: string; // "Tonight", "Tomorrow", "Thu, Nov 27"
  socials: RecurringSocial[];
}

// Turns the stored "every Tuesday" rules into a concrete 7 day calendar
// starting today in the city's own time zone.
export function weekPlan(city: City, genre?: Genre, now = new Date()): DayPlan[] {
  const start = todayIn(city.timezone, now);
  const base = new Date(`${start}T12:00:00Z`);
  const list = socialsIn(city.slug, genre);
  const days: DayPlan[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setUTCDate(base.getUTCDate() + i);
    const weekday = d.getUTCDay() as Weekday;
    const label =
      i === 0
        ? "Tonight"
        : i === 1
          ? "Tomorrow"
          : d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
    days.push({
      date: d.toISOString().slice(0, 10),
      weekday,
      label,
      socials: list
        .filter((s) => s.weekdays.includes(weekday))
        .sort((a, b) => (a.startTime ?? "99").localeCompare(b.startTime ?? "99")),
    });
  }
  return days;
}

export function genreLabel(g: Genre) {
  return g.charAt(0).toUpperCase() + g.slice(1);
}

export function formatDateRange(start: string, end: string) {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", timeZone: "UTC" };
  const s = new Date(`${start}T00:00:00Z`);
  const e = new Date(`${end}T00:00:00Z`);
  const year = e.getUTCFullYear();
  return `${s.toLocaleDateString("en-US", opts)} to ${e.toLocaleDateString("en-US", opts)}, ${year}`;
}
