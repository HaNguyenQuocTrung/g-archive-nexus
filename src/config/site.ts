const vercelProductionHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL;

const fallbackUrl = vercelProductionHost
  ? `https://${vercelProductionHost}`
  : "http://localhost:3000";

const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  fallbackUrl;

export const siteConfig = {
  name: "G-Archive Nexus",
  description:
    "A fan-made Mobile Suit intelligence database.",
  tagline:
    "Every timeline. Every pilot. Every Mobile Suit.",
  url: configuredSiteUrl.replace(/\/$/, ""),
  author: "Hạ Nguyễn Quốc Trung",
};