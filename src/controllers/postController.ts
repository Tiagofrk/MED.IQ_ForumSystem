// src/controllers/postController.ts
import { z } from 'zod';
import { t } from '../utils/trpc';
import db from '../db';

export const postController = t.router({
  listPosts: t.procedure.query(async () => {
    return await db.selectFrom('posts').selectAll().execute();
  }),
  createPost: t.procedure.input(z.object({ title: z.string(), content: z.string(), userId: z.number() })).mutation(async ({ input }) => {
    await db.insertInto('posts').values(input).execute();
  }),
  deletePost: t.procedure.input(z.object({ postId: z.number() })).mutation(async ({ input }) => {
    await db.deleteFrom('posts').where('id', '=', input.postId).execute();
  }),
});
