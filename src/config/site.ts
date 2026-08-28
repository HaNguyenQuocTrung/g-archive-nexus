const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "http://localhost:3000";

export const siteConfig = {
  name: "G-Archive Nexus",
  description:
    "A fan-made Mobile Suit intelligence database.",
  tagline:
    "Every timeline. Every pilot. Every Mobile Suit.",
  url: configuredSiteUrl.replace(/\/$/, ""),
  author: "Hạ Nguyễn Quốc Trung",
};