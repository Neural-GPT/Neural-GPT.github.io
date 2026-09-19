/**
 * Single-page site, so the sitemap is one entry. Next writes this out as
 * a static sitemap.xml during `next build` with output: 'export'.
 *
 * Change SITE to your deployed URL (include the base path if your repo
 * is a project repo rather than <username>.github.io).
 */
const SITE = "https://neural-gpt.github.io";

export default function sitemap() {
  return [
    {
      url: SITE,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
