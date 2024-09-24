import { z } from 'zod';
import { t } from '../trpc';
import db from '../db';

export const groupController = t.router({
  // Criar grupo
  createGroup: t.procedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        description: z.string().optional(),
        members: z.array(z.number()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { name, description, members } = input;

      try {
        const newGroup = await db
          .insertInto('groups')
          .values({
            name,
            description,
          })
          .returning(['id', 'name', 'description', 'created_at'])
          .executeTakeFirstOrThrow();

        if (members && members.length > 0) {
          const userGroups = members.map(userId => ({
            user_id: userId,
            group_id: newGroup.id,
          }));

          await db.insertInto('user_groups')
            .values(userGroups)
            .execute();
        }

        return newGroup;
      } catch (error) {
        throw new Error('Erro ao criar grupo.');
      }
    }),

  // Listar grupos
  listGroups: t.procedure.query(async () => {
    const groups = await db.selectFrom('groups')
      .select(['id', 'name', 'description', 'created_at'])
      .execute();

    return groups;
  }),

  // Adicionar membro ao grupo
  addMember: t.procedure
    .input(z.object({ groupId: z.number(), userId: z.number() }))
    .mutation(async ({ input }) => {
      const { groupId, userId } = input;

      try {
        await db.insertInto('user_groups')
          .values({
            group_id: groupId,
            user_id: userId,
          })
          .execute();

        return { success: true, message: 'Membro adicionado ao grupo com sucesso.' };
      } catch (error) {
        throw new Error('Erro ao adicionar membro ao grupo.');
      }
    }),

  // Remover membro do grupo
  removeMember: t.procedure
    .input(z.object({ groupId: z.number(), userId: z.number() }))
    .mutation(async ({ input }) => {
      const { groupId, userId } = input;

      try {
        const affectedRows = await db.deleteFrom('user_groups')
          .where('group_id', '=', groupId)
          .where('user_id', '=', userId)
          .execute();

        if (affectedRows.numDeleted === 0) {
          return { success: false, message: 'Membro não encontrado no grupo.' };
        }

        return { success: true, message: 'Membro removido do grupo com sucesso.' };
      } catch (error) {
        throw new Error('Erro ao remover membro do grupo.');
      }
    }),
});
