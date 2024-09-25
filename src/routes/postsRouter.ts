// src/routes/postRouter.ts
import { initTRPC } from '@trpc/server';
import { postController } from '../controllers/postController';

const t = initTRPC.create();

export const postRouter = t.router({
  createPost: postController.createPost,
  listPosts: postController.listPosts,
  deletePost: postController.deletePost,
});
