// src/controllers/groupController.ts
import { z } from 'zod';
import { t } from '../utils/trpc';
import db from '../db';

export const groupController = t.router({
  listGroups: t.procedure.query(async () => {
    return await db.selectFrom('groups').selectAll().execute();
  }),
  createGroup: t.procedure.input(z.object({ name: z.string(), description: z.string().optional() })).mutation(async ({ input }) => {
    await db.insertInto('groups').values(input).execute();
  }),
  joinGroup: t.procedure.input(z.object({ userId: z.number(), groupId: z.number() })).mutation(async ({ input }) => {
    await db.insertInto('user_groups').values(input).execute();
  }),
});
