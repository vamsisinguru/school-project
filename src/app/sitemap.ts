import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/about', '/academics', '/facilities', '/admissions', '/gallery', '/events', '/contact', '/login'];
  const baseUrl = 'https://srichaitanya.edu.in';

  return routes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route === '/admissions' ? 0.9 : 0.7,
  }));
}
