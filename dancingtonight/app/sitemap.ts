import type { MetadataRoute } from "next";
import { GENRES } from "@/lib/types";
import { MIN_LISTINGS_TO_INDEX, SITE_URL, allCities, listingCount, schoolsIn, socialsIn } from "@/lib/data";

// Only pages with real content go into the sitemap.
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily" },
    { url: `${SITE_URL}/festivals`, changeFrequency: "weekly" },
  ];
  for (const c of allCities()) {
    if (listingCount(c.slug) >= MIN_LISTINGS_TO_INDEX) {
      pages.push({ url: `${SITE_URL}/city/${c.slug}`, changeFrequency: "daily" });
    }
    for (const g of GENRES) {
      if (socialsIn(c.slug, g).length + schoolsIn(c.slug, g).length >= MIN_LISTINGS_TO_INDEX) {
        pages.push({ url: `${SITE_URL}/city/${c.slug}/${g}`, changeFrequency: "daily" });
      }
    }
  }
  return pages;
}
