import { initTRPC } from '@trpc/server';
import { userRouter } from '../routes/userRouter';
import { postRouter } from '../routes/postsRouter';
import { reactionRouter } from '../routes/reactionRouter';
import { groupRouter } from '../routes/groupRouter';
import { adminRouter } from '../routes/adminRouter';

const t = initTRPC.create();

export const appRouter = t.router({
  users: userRouter,
  posts: postRouter,
  reactions: reactionRouter,
  groups: groupRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;