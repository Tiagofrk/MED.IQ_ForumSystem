import { t } from '../trpc';
import db from '../db';
import { z } from 'zod';

export const groupRouter = t.router({
  // Criação de grupo (apenas moderadores)
  createGroup: t.procedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string(),
        moderatorId: z.number() // ID do moderador
      })
    )
    .mutation(async ({ input }) => {
      const { name, description, moderatorId } = input;

      // Apenas moderadores podem criar grupos
      const moderator = await db.selectFrom('users')
        .select('role')
        .where('id', '=', moderatorId)
        .executeTakeFirst();

      if (moderator?.role !== 'moderator') {
        throw new Error('Only moderators can create groups');
      }

      await db.insertInto('groups').values({
        name, description
      }).execute();

      return { success: true, message: 'Group created' };
    }),
  
  // Participação em grupo
  joinGroup: t.procedure
    .input(
      z.object({
        userId: z.number(),
        groupId: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const { userId, groupId } = input;

      await db.insertInto('user_groups').values({
        user_id: userId,
        group_id: groupId
      }).execute();

      return { success: true, message: 'Joined group' };
    }),
});
