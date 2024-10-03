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
});