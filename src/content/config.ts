import { defineCollection, z } from 'astro:content';

const lessons = defineCollection({
  type: 'content',
  schema: z.object({
    chapterId: z.string(),
    lessonId: z.string(),
    title: z.string(),
    level: z.string(),
    duration: z.string(),
    tags: z.array(z.string()),
    number: z.string(),
    chapterTitle: z.string(),
    chapterNumber: z.string(),
  }),
});

export const collections = { lessons };
