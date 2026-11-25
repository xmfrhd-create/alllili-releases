import type { Metadata } from "next";
import { FestivalCard } from "@/components/Cards";
import { upcomingFestivals } from "@/lib/data";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Latin dance festivals and congresses worldwide",
  description: "Upcoming salsa, bachata, kizomba and zouk festivals and congresses around the world.",
  alternates: { canonical: "/festivals" },
};

export default function FestivalsPage() {
  const list = upcomingFestivals();
  const jsonLd = list.map((f) => ({
    "@context": "https://schema.org",
    "@type": "DanceEvent",
    name: f.name,
    startDate: f.startDate,
    endDate: f.endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: f.city, address: `${f.city}, ${f.country}` },
    url: f.source.url,
  }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1>Upcoming festivals</h1>
      {list.map((f) => (
        <FestivalCard key={f.id} f={f} />
      ))}
      <p className="disclaimer">Dates come from public listings. Confirm with the organizer before booking travel.</p>
    </>
  );
}
