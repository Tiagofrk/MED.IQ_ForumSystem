import { z } from 'zod';
import { t } from '../trpc/server';
import db from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const userController = t.router({
  register: t.procedure
    .input(userSchema)
    .mutation(async ({ input }) => {
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const newUser = await db.insertInto('users').values({
        ...input,
        password: hashedPassword,
      }).returning('id').executeTakeFirst();
      return newUser;
    }),
  login: t.procedure
    .input(loginSchema)
    .mutation(async ({ input }) => {
      const user = await db.selectFrom('users')
        .selectAll()
        .where('email', '=', input.email)
        .executeTakeFirst();
      if (!user || !(await bcrypt.compare(input.password, user.password))) {
        throw new Error('Credenciais inválidas.');
      }
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
      return { token };
    }),
});
