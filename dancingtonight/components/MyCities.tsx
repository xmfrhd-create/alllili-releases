"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { track } from "@/components/Tracker";

interface Trip {
  slug: string;
  name: string;
  from?: string;
  to?: string;
}

const KEY = "dancingtonight.mycities";

// Saved in this browser only, until login exists.
export function MyCities({ cities }: { cities: { slug: string; name: string }[] }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [slug, setSlug] = useState(cities[0]?.slug ?? "");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    try {
      setTrips(JSON.parse(localStorage.getItem(KEY) ?? "[]"));
    } catch {
      setTrips([]);
    }
  }, []);

  function save(next: Trip[]) {
    setTrips(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage blocked: keep it in memory only */
    }
  }

  function add(e: React.FormEvent) {
    e.preventDefault();
    const city = cities.find((c) => c.slug === slug);
    if (!city) return;
    track("add_city", { city: slug });
    save([...trips.filter((t) => t.slug !== slug), { slug, name: city.name, from: from || undefined, to: to || undefined }]);
  }

  return (
    <section className="mycities">
      <h2 style={{ marginTop: 0 }}>My cities</h2>
      {trips.length === 0 ? (
        <p className="empty">Add the city you live in and the cities you are traveling to.</p>
      ) : (
        <ul>
          {trips.map((t) => (
            <li key={t.slug}>
              <Link href={`/city/${t.slug}`}>{t.name}</Link>
              {t.from && ` · ${t.from}${t.to ? ` to ${t.to}` : ""}`}
              <button className="linkbtn" onClick={() => save(trips.filter((x) => x.slug !== t.slug))} aria-label={`Remove ${t.name}`}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={add}>
        <select value={slug} onChange={(e) => setSlug(e.target.value)} aria-label="City">
          {cities.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="From" />
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} aria-label="To" />
        <button type="submit">Add</button>
      </form>
    </section>
  );
}
