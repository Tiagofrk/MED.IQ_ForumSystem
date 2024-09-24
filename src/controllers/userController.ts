import { z } from 'zod';
import { t } from '../trpc';
import db from '../db';
import bcrypt from 'bcrypt';

export const userController = t.router({
  // Cadastro de usuários
  registerUser: t.procedure
    .input(
      z.object({
        username: z.string().min(3).max(50),
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      const { username, email, password } = input;

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      try {
        const newUser = await db
          .insertInto('users')
          .values({
            username,
            email,
            password: hashedPassword,
            role: 'user',
          })
          .returning(['id', 'username', 'email', 'role', 'created_at'])
          .executeTakeFirstOrThrow();

        return newUser;
      } catch (error: any) {
        if (error.code === '23505') { // Violação de unicidade
          throw new Error('Username ou email já existente.');
        }
        throw new Error('Erro ao registrar usuário.');
      }
    }),

  // Listar usuários
  listUsers: t.procedure.query(async () => {
    const users = await db.selectFrom('users')
      .select(['id', 'username', 'email', 'role', 'created_at'])
      .execute();

    return users;
  }),

  // Bloquear usuário (excluir ou alterar status)
  blockUser: t.procedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      const { userId } = input;

      // Exemplo: Atualizar o role para 'blocked' se houver essa opção
      // Caso contrário, você pode excluir o usuário ou implementar outra lógica
      try {
        await db.updateTable('users')
          .set({ role: 'user_blocked' }) // Supondo que 'user_blocked' seja uma role válida
          .where('id', '=', userId)
          .execute();

        return { success: true, message: 'Usuário bloqueado com sucesso.' };
      } catch (error) {
        return { success: false, message: 'Erro ao bloquear usuário.' };
      }
    }),
});
