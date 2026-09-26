import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { categories } from './utils/taxonomy';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z
    .object({
      title: z.string().min(1),
      description: z.string().min(1),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      author: reference('authors'),
      category: z.enum(categories),
      tags: z.array(z.string().min(1)).default([]),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      cover: z.string().min(1).optional(),
      coverAlt: z.string().min(1).optional(),
    })
    .superRefine((data, context) => {
      if (data.cover && !data.coverAlt) {
        context.addIssue({
          code: 'custom',
          path: ['coverAlt'],
          message: 'coverAlt è obbligatorio quando è presente cover',
        });
      }
    }),
});

const authors = defineCollection({
  loader: glob({ base: './src/content/authors', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    name: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    bio: z.string().min(1),
    website: z.url().optional(),
    avatar: z.string().min(1).optional(),
    email: z.email().optional(),
  }),
});

export const collections = { blog, authors };
