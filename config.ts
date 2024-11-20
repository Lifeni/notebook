import { defineCollection, z } from 'astro:content'

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    subtitle: z.string().optional(),
    id: z.string(),
    cover: z.object({
      caption: z.string(),
      image: z.string(),
    }),
    star: z.boolean().optional(),
    draft: z.boolean().optional(),
    hide: z.boolean().optional(),
    group: z.boolean().optional(),
    license: z.string(),
    tags: z.array(z.string()),
    date: z.object({
      created: z.date(),
      updated: z.date(),
    }),
  }),
})

const stories = articles

const archives = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    name: z.string(),
    'create-date': z.date(),
    date: z.date(),
    license: z.string(),
    star: z.boolean().optional(),
  }),
})

export const collections = {
  文章: articles,
  专题: stories,
  存档: archives,
}
