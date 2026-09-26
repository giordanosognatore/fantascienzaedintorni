const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(path = ''): string {
  const normalizedPath = path.replace(/^\//, '');
  return normalizedPath ? `${base}/${normalizedPath}` : `${base}/`;
}

export function blogUrl(id: string): string {
  return withBase(`blog/${id}/`);
}

export function authorUrl(slug: string): string {
  return withBase(`autori/${slug}/`);
}

export function categoryId(category: string): string {
  return category
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
