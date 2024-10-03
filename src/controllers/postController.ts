import { z } from 'zod';
import { t } from '../trpc/server';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

export const postController = t.router({
  // Criar nova postagem
  createPost: t.procedure
    .input(z.object({ title: z.string().min(1), content: z.string().min(1), userId: z.number() }))
    .mutation(async ({ input }) => {
      const { title, content, userId } = input;

      try {
        const newPost = await db
          .insertInto('posts')
          .values({
            id: parseInt(uuidv4()),
            title: title,
            content: content,
            user_id: userId,
            created_at: new Date()
          })
          .returning(['id', 'title', 'content', 'user_id', 'created_at'])
          .executeTakeFirstOrThrow();

        return newPost;
      } catch (error) {
        console.error('Erro ao criar postagem:', error);
        throw new Error('Não foi possível criar a postagem.');
      }
    }),

  // Listar postagens
  listPosts: t.procedure.query(async () => {
    try {
      const posts = await db
        .selectFrom('posts')
        .innerJoin('users', 'users.id', 'posts.user_id') // Junta com a tabela de usuários para obter informações do autor
        .select(['posts.id', 'posts.title', 'posts.content', 'posts.created_at', 'users.username'])
        .execute();

      return posts;
    } catch (error) {
      console.error('Erro ao listar postagens:', error);
      throw new Error('Não foi possível listar as postagens.');
    }
  }),
});
