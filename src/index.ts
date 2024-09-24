import { Hono } from 'hono';
import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import { initTRPC } from '@trpc/server';
import { adminRouter } from './routes/adminRouter';
import { groupRouter } from './routes/groupRouter';
import { postRouter } from './routes/postsRouter';
import { userRouter } from './routes/userRouter';
import { reactionRouter } from './routes/reactionRouter';
import 'reflect-metadata';

const t = initTRPC.create();

const appRouter = t.mergeRouters(
  adminRouter,
  groupRouter,
  postRouter,
  userRouter,
  reactionRouter
);

const app = new Hono();

app.use('/trpc', createHTTPHandler({
  router: appRouter,
  createContext: () => ({}),
}));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

export type AppRouter = typeof appRouter;
