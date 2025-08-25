import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/sitemap.xml'],
      disallow: ['/dashboard/', '/login/', '/callback/'],
    },
    sitemap: 'https://handoverplan.com/sitemap.xml',
  }
}