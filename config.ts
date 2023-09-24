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
    draft: z.boolean(),
    license: z.string(),
    tags: z.array(z.string()),
    date: z.object({
      created: z.date(),
      updated: z.date(),
    }),
  }),
})

const stories = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    id: z.string(),
    cover: z.object({
      caption: z.string(),
      image: z.string(),
    }),
    draft: z.boolean(),
    license: z.string(),
    date: z.object({
      created: z.date(),
      updated: z.date(),
    }),
  }),
})

const archives = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    name: z.string(),
    'create-date': z.date(),
    date: z.date(),
    license: z.string(),
  }),
})

export const collections = {
  文章: articles,
  专题: stories,
  存档: archives,
}
