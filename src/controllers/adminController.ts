import { z } from 'zod';
import { t } from '../trpc/server';
import db from '../db/index';

export const adminController = t.router({
  // Listar usuários
  listUsers: t.procedure.query(async () => {
    try {
      const users = await db
        .selectFrom(db.tables.users) // Usa a referência da tabela
        .select(['id', 'username', 'email', 'role', 'created_at'])
        .execute();

      return users;
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      throw new Error('Não foi possível listar os usuários.');
    }
  }),

  // Bloquear usuário
  blockUser: t.procedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      const { userId } = input;

      await db.updateTable('users')
        .set({ role: 'blocked' })
        .where('id', '=', userId)
        .execute();

      return { success: true, message: 'Usuário bloqueado com sucesso.' };
    }),

  // Excluir postagem
  deletePost: t.procedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ input }) => {
      const { postId } = input;

      const affectedRows = await db.deleteFrom('posts')
        .where('id', '=', postId)
        .execute();

      if (affectedRows.numDeleted === 0) {
        return { success: false, message: 'Postagem não encontrada.' };
      }

      return { success: true, message: 'Postagem excluída com sucesso.' };
    }),
});
