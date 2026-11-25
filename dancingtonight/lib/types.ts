// The four dance styles Dancing Tonight covers.
export const GENRES = ["salsa", "bachata", "kizomba", "zouk"] as const;
export type Genre = (typeof GENRES)[number];

// 0 = Sunday ... 6 = Saturday (same as JavaScript's Date.getDay()).
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface City {
  slug: string; // used in the URL, e.g. "seoul"
  name: string;
  country: string;
  timezone: string; // IANA zone, e.g. "Asia/Seoul"
}

// Where a piece of information came from, so visitors can check it.
export interface Source {
  url: string;
  label: string; // e.g. "Salsa Vida listing", "Organizer Instagram"
  // "listing" = found on a third party page, not yet confirmed by the organizer.
  // "organizer" = confirmed or posted by the organizer (after a Claim).
  kind: "listing" | "organizer";
  checkedOn: string; // YYYY-MM-DD, the day we last looked at the source
}

// A social that repeats every week. Stored once, shown every week.
export interface RecurringSocial {
  id: string;
  type: "social";
  name: string;
  citySlug: string;
  venue: string;
  area?: string;
  address?: string;
  genres: Genre[];
  weekdays: Weekday[];
  startTime?: string; // "21:00" in the city's local time
  endTime?: string;
  price?: string;
  note?: string;
  source: Source;
}

// A school or a regular class.
export interface School {
  id: string;
  type: "school";
  name: string;
  citySlug: string;
  area?: string;
  genres: Genre[];
  schedule?: string;
  price?: string;
  note?: string;
  source: Source;
}

// A festival or congress: happens on specific dates.
export interface Festival {
  id: string;
  type: "festival";
  name: string;
  city: string; // shown as text, the festival town may not have a city page
  country: string;
  citySlug?: string;
  genres: Genre[];
  startDate: string; // YYYY-MM-DD
  endDate: string;
  source: Source;
}
