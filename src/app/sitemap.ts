import type { MetadataRoute } from "next";

import { getCharacters } from "@/lib/data/getCharacters";
import { getMobileSuits } from "@/lib/data/getMobileSuits";
import { getAllSeries } from "@/lib/data/getSeries";
import { getTimelines } from "@/lib/data/getTimelines";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    {
      url: siteConfig.url,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${siteConfig.url}/timelines`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/series`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/characters`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/mobile-suits`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/search`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}/about`,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
  ];

  const timelineRoutes = getTimelines().map(
    (timeline) => ({
      url:
        `${siteConfig.url}/timelines/` +
        timeline.id,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }),
  );

  const seriesRoutes = getAllSeries().map(
    (series) => ({
      url:
        `${siteConfig.url}/series/` +
        series.id,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }),
  );

  const characterRoutes = getCharacters().map(
    (character) => ({
      url:
        `${siteConfig.url}/characters/` +
        character.id,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }),
  );

  const mobileSuitRoutes = getMobileSuits().map(
    (mobileSuit) => ({
      url:
        `${siteConfig.url}/mobile-suits/` +
        mobileSuit.id,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }),
  );

  return [
    ...staticRoutes,
    ...timelineRoutes,
    ...seriesRoutes,
    ...characterRoutes,
    ...mobileSuitRoutes,
  ];
}
