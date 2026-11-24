import Link from "next/link";
import { FestivalCard, SchoolCard, SocialCard } from "@/components/Cards";
import { GENRES, type City, type Genre } from "@/lib/types";
import { SITE_URL, genreLabel, schoolsIn, upcomingFestivals, weekPlan } from "@/lib/data";

export function CityView({ city, genre }: { city: City; genre?: Genre }) {
  const days = weekPlan(city, genre);
  const schools = schoolsIn(city.slug, genre);
  const festivals = upcomingFestivals(genre).filter((f) => f.country === city.country).slice(0, 6);
  const title = genre ? `${genreLabel(genre)} in ${city.name}` : `Latin dance in ${city.name}`;

  // Structured data so Google can show these nights as events in search.
  const jsonLd = days.flatMap((d) =>
    d.socials.map((s) => ({
      "@context": "https://schema.org",
      "@type": "DanceEvent",
      name: s.name,
      startDate: s.startTime ? `${d.date}T${s.startTime}` : d.date,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: s.venue,
        address: s.address ?? [s.area, city.name, city.country].filter(Boolean).join(", "),
      },
      url: `${SITE_URL}/city/${city.slug}`,
    })),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="city-head">
        <p className="eyebrow">{city.country}</p>
        <h1>{title} this week</h1>
        <nav className="chips" aria-label="Filter by style">
          <Link href={`/city/${city.slug}`} className={`chip ${!genre ? "chip-on" : ""}`}>
            All
          </Link>
          {GENRES.map((g) => (
            <Link key={g} href={`/city/${city.slug}/${g}`} className={`chip chip-${g} ${genre === g ? "chip-on" : ""}`}>
              {genreLabel(g)}
            </Link>
          ))}
        </nav>
      </header>

      <section>
        <h2>Socials</h2>
        {days.map((d) => (
          <div key={d.date} className="day">
            <h3 className="day-label">
              {d.label} <span>{d.date}</span>
            </h3>
            {d.socials.length ? (
              d.socials.map((s) => <SocialCard key={s.id} s={s} />)
            ) : (
              <p className="empty">Nothing listed yet.</p>
            )}
          </div>
        ))}
      </section>

      <section>
        <h2>Classes and schools</h2>
        {schools.length ? schools.map((s) => <SchoolCard key={s.id} s={s} />) : <p className="empty">Nothing listed yet.</p>}
      </section>

      {festivals.length > 0 && (
        <section>
          <h2>Festivals in {city.country}</h2>
          {festivals.map((f) => (
            <FestivalCard key={f.id} f={f} />
          ))}
        </section>
      )}

      <p className="disclaimer">
        Listings are gathered from public sources and may be out of date. Always check with the organizer before you go.
      </p>
    </>
  );
}
