import { z } from 'zod';
import { t } from '../trpc/server';
import db from '../db';

export const groupParticipationController = t.router({
  // Listar grupos de um usuário específico
  listUserGroups: t.procedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const { userId } = input;

      try {
        const userGroups = await db
          .selectFrom('user_groups')
          .innerJoin('groups', 'groups.id', 'user_groups.group_id')
          .select(['groups.id', 'groups.name', 'groups.description', 'groups.created_at'])
          .where('user_groups.user_id', '=', userId)
          .execute();

        return userGroups;
      } catch (error) {
        console.error('Erro ao listar grupos do usuário:', error);
        throw new Error('Não foi possível listar os grupos do usuário.');
      }
    }),

  // Listar membros de um grupo específico
  listGroupMembers: t.procedure
    .input(z.object({ groupId: z.number() }))
    .query(async ({ input }) => {
      const { groupId } = input;

      try {
        const groupMembers = await db
          .selectFrom('user_groups')
          .innerJoin('users', 'users.id', 'user_groups.user_id')
          .select(['users.id', 'users.username', 'users.email', 'users.role', 'users.created_at'])
          .where('user_groups.group_id', '=', groupId)
          .execute();

        return groupMembers;
      } catch (error) {
        console.error('Erro ao listar membros do grupo:', error);
        throw new Error('Não foi possível listar os membros do grupo.');
      }
    }),

  // Adicionar um membro a um grupo
  addMemberToGroup: t.procedure
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
        console.error('Erro ao adicionar membro ao grupo:', error);
        throw new Error('Não foi possível adicionar o membro ao grupo.');
      }
    }),

  // Remover um membro de um grupo
  removeMemberFromGroup: t.procedure
    .input(z.object({ groupId: z.number(), userId: z.number() }))
    .mutation(async ({ input }) => {
      const { groupId, userId } = input;

      try {
        const affectedRows = await db.deleteFrom('user_groups')
          .where('group_id', '=', groupId)
          .where('user_id', '=', userId)
          .execute();

        if (affectedRows.length  === 0) {
          return { success: false, message: 'Membro não encontrado no grupo.' };
        }

        return { success: true, message: 'Membro removido do grupo com sucesso.' };
      } catch (error) {
        console.error('Erro ao remover membro do grupo:', error);
        throw new Error('Não foi possível remover o membro do grupo.');
      }
    }),

  // Excluir um grupo
  deleteGroup: t.procedure
    .input(z.object({ groupId: z.number() }))
    .mutation(async ({ input }) => {
      const { groupId } = input;

      try {
        const affectedRows = await db.deleteFrom('groups')
          .where('id', '=', groupId)
          .execute();

        if (affectedRows.length  === 0) {
          return { success: false, message: 'Grupo não encontrado.' };
        }

        return { success: true, message: 'Grupo excluído com sucesso.' };
      } catch (error) {
        console.error('Erro ao excluir grupo:', error);
        throw new Error('Não foi possível excluir o grupo.');
      }
    }),
});
