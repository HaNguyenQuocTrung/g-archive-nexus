import type { MetadataRoute } from "next";

import { getCharactersFromDatabase } from "@/lib/data/getCharactersFromDatabase";
import { getMobileSuitsFromDatabase } from "@/lib/data/getMobileSuitsFromDatabase";
import { getAllSeriesFromDatabase } from "@/lib/data/getSeriesFromDatabase";
import { getTimelinesFromDatabase } from "@/lib/data/getTimelinesFromDatabase";
import { siteConfig } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [timelines, seriesRecords, characters, mobileSuits] = await Promise.all(
    [
      getTimelinesFromDatabase(),
      getAllSeriesFromDatabase(),
      getCharactersFromDatabase(),
      getMobileSuitsFromDatabase(),
    ],
  );
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
      url: `${siteConfig.url}/movies`,
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

  const timelineRoutes = timelines.map((timeline) => ({
    url: `${siteConfig.url}/timelines/` + timeline.id,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const seriesRoutes = seriesRecords.map((series) => ({
    url: `${siteConfig.url}/series/` + series.id,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const characterRoutes = characters.map((character) => ({
    url: `${siteConfig.url}/characters/` + character.id,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const mobileSuitRoutes = mobileSuits.map((mobileSuit) => ({
    url: `${siteConfig.url}/mobile-suits/` + mobileSuit.id,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...timelineRoutes,
    ...seriesRoutes,
    ...characterRoutes,
    ...mobileSuitRoutes,
  ];
}
