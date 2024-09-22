import { t } from '../trpc/';
import db from '../db';
import bcrypt from 'bcrypt';
import { z } from 'zod';

export const userRouter = t.router({
  // Cadastro de usuário
  createUser: t.procedure
    .input(
      z.object({
        username: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(6)
      })
    )
    .mutation(async ({ input }) => {
      const { username, email, password } = input;

      // Verifica se o email já está em uso
      const userExists = await db.selectFrom('users')
        .selectAll()
        .where('email', '=', email)
        .executeTakeFirst();
      
      if (userExists) {
        throw new Error('Email already registered.');
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criação do usuário
      await db.insertInto('users').values({
        username, email, password: hashedPassword
      }).execute();

      return { success: true, message: 'User created successfully' };
    }),
  
  // Validação de login
  validateLogin: t.procedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6)
      })
    )
    .mutation(async ({ input }) => {
      const { email, password } = input;

      // Busca usuário
      const user = await db.selectFrom('users')
        .selectAll()
        .where('email', '=', email)
        .executeTakeFirst();

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Validação da senha
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      return { success: true, userId: user.id, role: user.role };
    }),
});
