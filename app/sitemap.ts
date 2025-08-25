import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const APP_URL = "https://handoverplan.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Fetch all published plans to include in the sitemap
  const { data: plans } = await supabase
    .from('plans')
    .select('public_link_id, updated_at')
    .eq('status', 'published');

  const planUrls = plans?.map(({ public_link_id, updated_at }) => ({
    url: `${APP_URL}/${public_link_id}`,
    lastModified: new Date(updated_at).toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  })) ?? [];

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
    ...planUrls,
  ]
}