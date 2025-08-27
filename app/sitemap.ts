// File: app/sitemap.ts

import { MetadataRoute } from 'next'

const APP_URL = "https://handoverplan.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: APP_URL,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${APP_URL}/login`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]
}