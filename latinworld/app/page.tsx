import Link from "next/link";
import { headers } from "next/headers";
import { MyCities } from "@/components/MyCities";
import { FestivalCard } from "@/components/Cards";
import { allCities, listingCount, upcomingFestivals } from "@/lib/data";

export default async function Home() {
  // On Vercel, this header tells us which city the visitor is in (from their IP).
  const h = await headers();
  const rawCity = h.get("x-vercel-ip-city");
  const visitorCity = rawCity ? decodeURIComponent(rawCity).toLowerCase() : null;

  const cities = allCities();
  const here = cities.find((c) => c.name.toLowerCase() === visitorCity);
  const festivals = upcomingFestivals().slice(0, 4);

  return (
    <>
      <section className="hero">
        <h1>Where to dance Latin, in any city, any week.</h1>
        <p>Salsa, bachata, kizomba and zouk socials, festivals and classes. Only for the cities you care about.</p>
        {here && (
          <p>
            Looks like you are in <strong>{here.name}</strong>.{" "}
            <Link href={`/city/${here.slug}`}>See this week in {here.name} →</Link>
          </p>
        )}
      </section>

      <MyCities cities={cities.map(({ slug, name }) => ({ slug, name }))} />

      <section>
        <h2>Cities</h2>
        <div className="city-grid">
          {cities.map((c) => (
            <Link key={c.slug} href={`/city/${c.slug}`} className="city-link">
              <strong>{c.name}</strong>
              <small>
                {c.country} · {listingCount(c.slug)} listings
              </small>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2>Upcoming festivals</h2>
        {festivals.map((f) => (
          <FestivalCard key={f.id} f={f} />
        ))}
        <p>
          <Link href="/festivals">All festivals →</Link>
        </p>
      </section>
    </>
  );
}
