import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityView } from "@/components/CityView";
import { MIN_LISTINGS_TO_INDEX, allCities, getCity, listingCount } from "@/lib/data";

// Rebuild the page at most once an hour so "Tonight" stays correct.
export const revalidate = 3600;

export function generateStaticParams() {
  return allCities().map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = getCity((await params).slug);
  if (!city) return {};
  return {
    title: `Salsa, bachata, kizomba and zouk in ${city.name} this week`,
    description: `Latin dance socials, classes and festivals in ${city.name}, ${city.country}, updated weekly.`,
    alternates: { canonical: `/city/${city.slug}` },
    robots: listingCount(city.slug) >= MIN_LISTINGS_TO_INDEX ? undefined : { index: false },
  };
}

export default async function CityPage({ params }: Props) {
  const city = getCity((await params).slug);
  if (!city) notFound();
  return <CityView city={city} />;
}
