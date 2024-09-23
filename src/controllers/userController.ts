// src/controllers/userController.ts
import { z } from 'zod';
import { t } from '../utils/trpc';
import db from '../db';

export const userController = t.router({
  register: t.procedure.input(z.object({ username: z.string(), email: z.string(), password: z.string() })).mutation(async ({ input }) => {
    await db.insertInto('users').values(input).execute();
  }),
  listUsers: t.procedure.query(async () => {
    return await db.selectFrom('users').selectAll().execute();
  }),
});
