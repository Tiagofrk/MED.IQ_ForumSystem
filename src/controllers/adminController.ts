import { z } from 'zod';
import { t } from '../trpc';
import db from '../db';

export const adminController = t.router({
  // Listar usuários
  listUsers: t.procedure.query(async () => {
    const users = await db.selectFrom('users')
      .select(['id', 'username', 'email', 'role', 'created_at'])
      .execute();

    return users;
  }),

  // Bloquear usuário
  blockUser: t.procedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      const { userId } = input;

      try {
        // Exemplo: Atualizar o role para 'blocked' se houver essa opção
        await db.updateTable('users')
          .set({ role: 'blocked' }) // Assegure-se de que 'blocked' seja uma role válida ou ajuste conforme necessário
          .where('id', '=', userId)
          .execute();

        return { success: true, message: 'Usuário bloqueado com sucesso.' };
      } catch (error) {
        return { success: false, message: 'Erro ao bloquear usuário.' };
      }
    }),

  // Excluir postagem
  deletePost: t.procedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ input }) => {
      const { postId } = input;

      try {
        const affectedRows = await db.deleteFrom('posts')
          .where('id', '=', postId)
          .execute();

        if (affectedRows.numDeleted === 0) {
          return { success: false, message: 'Postagem não encontrada.' };
        }

        return { success: true, message: 'Postagem excluída com sucesso.' };
      } catch (error) {
        return { success: false, message: 'Erro ao excluir postagem.' };
      }
    }),
});
