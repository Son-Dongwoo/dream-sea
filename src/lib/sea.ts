/** Prefix local routes/assets with Astro's configured deployment base. */
export function seaUrl(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  return `${base}${path.replace(/^\/+/, '')}`;
}
