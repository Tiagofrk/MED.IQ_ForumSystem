import { z } from 'zod';
import { t } from '../trpc';
import db from '../db';

export const postController = t.router({
  // Criação de postagens
  createPost: t.procedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        content: z.string().min(1),
        userId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { title, content, userId } = input;

      try {
        const newPost = await db
          .insertInto('posts')
          .values({
            title,
            content,
            user_id: userId,
          })
          .returning(['id', 'title', 'content', 'user_id', 'created_at'])
          .executeTakeFirstOrThrow();

        return newPost;
      } catch (error) {
        throw new Error('Erro ao criar postagem.');
      }
    }),

  // Listar postagens
  listPosts: t.procedure.query(async () => {
    const posts = await db.selectFrom('posts')
      .select(['id', 'title', 'content', 'user_id', 'created_at'])
      .execute();

    return posts;
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
