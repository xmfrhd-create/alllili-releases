import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityView } from "@/components/CityView";
import { GENRES } from "@/lib/types";
import {
  MIN_LISTINGS_TO_INDEX,
  allCities,
  genreLabel,
  getCity,
  isGenre,
  schoolsIn,
  socialsIn,
} from "@/lib/data";

export const revalidate = 3600;

export function generateStaticParams() {
  return allCities().flatMap((c) => GENRES.map((genre) => ({ slug: c.slug, genre })));
}

type Props = { params: Promise<{ slug: string; genre: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, genre } = await params;
  const city = getCity(slug);
  if (!city || !isGenre(genre)) return {};
  const count = socialsIn(slug, genre).length + schoolsIn(slug, genre).length;
  return {
    title: `${genreLabel(genre)} in ${city.name} this week`,
    description: `Where to dance ${genre} in ${city.name}: socials, classes and festivals.`,
    alternates: { canonical: `/city/${slug}/${genre}` },
    robots: count >= MIN_LISTINGS_TO_INDEX ? undefined : { index: false },
  };
}

export default async function CityGenrePage({ params }: Props) {
  const { slug, genre } = await params;
  const city = getCity(slug);
  if (!city || !isGenre(genre)) notFound();
  return <CityView city={city} genre={genre} />;
}
