import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    featured: z.boolean().optional(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    authors: z.array(z.string()),
  }),
});

const labNotes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lab-notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['open', 'resolved', 'superseded']),
    tags: z.array(z.string()),
    pubDate: z.coerce.date().optional(),
    project: z.object({ label: z.string(), href: z.string() }).optional(),
  }),
});

export const collections = { blog, labNotes };
