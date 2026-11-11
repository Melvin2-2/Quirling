/** Hängt den Basis-Pfad (GitHub Pages: /Quirling/) an interne Links. */
export function url(path = '/'): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

/** Vergleicht den aktuellen Pfad mit einem Navigationsziel. */
export function isActive(current: string, href: string): boolean {
  const target = url(href.split('#')[0] || '/');
  if (href.startsWith('/#')) return false; // Anker auf der Startseite markiert keinen Menüpunkt
  if (href === '/') return current === target;
  return current.startsWith(target);
}
