import { z } from 'zod';
import { t } from '../trpc/server';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

export const userController = t.router({
  // Registrar usuário
  registerUser: t.procedure
    .input(z.object({
      username: z.string().min(1),
      email: z.string().email(),
      password: z.string().min(6),
    }))
    .mutation(async ({ input }) => {
      const { username, email, password } = input;

      try {
        // Insere o novo usuário no banco de dados
        const newUser = await db
          .insertInto('users')
          .values({
            id: parseInt(uuidv4()),
            username,
            email,
            password, // Considere aplicar hashing na senha antes de armazenar
            role: 'user', // Define o papel padrão como 'user'
            created_at: new Date(), // Adiciona a data de criação
          })
          .returning(['id', 'username', 'email', 'role', 'created_at'])
          .executeTakeFirstOrThrow();

        return { success: true, user: newUser };
      } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        throw new Error('Não foi possível registrar o usuário.');
      }
    }),

  // Listar usuários
  listUsers: t.procedure.query(async () => {
    try {
      const users = await db
        .selectFrom('users')
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

      try {
        await db.updateTable('users')
          .set({ role: 'blocked' })
          .where('id', '=', userId)
          .execute();

        return { success: true, message: 'Usuário bloqueado com sucesso.' };
      } catch (error) {
        console.error('Erro ao bloquear usuário:', error);
        throw new Error('Não foi possível bloquear o usuário.');
      }
    }),
});