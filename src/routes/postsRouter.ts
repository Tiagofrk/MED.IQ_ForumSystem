import { t } from '../trpc';
import db from '../db';
import { z } from 'zod';

export const postRouter = t.router({
  // Criação de postagem
  createPost: t.procedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        userId: z.number() // ID do usuário logado
      })
    )
    .mutation(async ({ input }) => {
      const { title, content, userId } = input;
      
      await db.insertInto('posts').values({
        title, content, user_id: userId
      }).execute();

      return { success: true, message: 'Post created successfully' };
    }),
  
  // Listagem de postagens
  listPosts: t.procedure
    .query(async () => {
      const posts = await db.selectFrom('posts')
        .selectAll()
        .execute();

      return posts;
    }),

  // Criação de comentário
  addComment: t.procedure
    .input(
      z.object({
        postId: z.number(),
        userId: z.number(),
        content: z.string().min(1)
      })
    )
    .mutation(async ({ input }) => {
      const { postId, userId, content } = input;
      
      await db.insertInto('comments').values({
        post_id: postId,
        user_id: userId,
        content
      }).execute();

      return { success: true, message: 'Comment added successfully' };
    }),
});
