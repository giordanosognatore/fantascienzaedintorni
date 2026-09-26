import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { blogUrl, withBase } from '../utils/urls';

export async function GET(context) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  return rss({
    title: 'Passione Fantascienza',
    description: 'Articoli su libri, cinema, serie TV, scienza e immaginari del futuro.',
    site: new URL(withBase(), context.site),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: new URL(blogUrl(post.id), context.site).toString(),
      categories: [...new Set([post.data.category, ...post.data.tags])],
    })),
    customData: '<language>it-IT</language>',
  });
}
