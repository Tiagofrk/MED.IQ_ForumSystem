// src/controllers/adminController.ts
import { z } from 'zod';
import { t } from '../utils/trpc';
import db from '../db';

export const adminController = t.router({
  listUsers: t.procedure.query(async () => {
    return await db.selectFrom({users}).selectAll().execute();
  }),
  blockUser: t.procedure.input(z.object({ userId: z.number() })).mutation(async ({ input }) => {
    await db.updateTable('users').set({ role: 'blocked' }).where('id', '=', input.userId).execute();
  }),
  deletePost: t.procedure.input(z.object({ postId: z.number() })).mutation(async ({ input }) => {
    await db.deleteFrom('posts').where('id', '=', input.postId).execute();
  }),
});
