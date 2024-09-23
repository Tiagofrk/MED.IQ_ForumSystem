// src/index.ts
import { Hono } from 'hono';
import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import { adminRouter } from './routes/adminRouter';
import { groupRouter } from './routes/groupRouter';
import { postRouter } from './routes/postsRouter';
import { userRouter } from './routes/usersRouter';
import { reactionRouter } from './routes/reactionRouter';
import 'reflect-metadata';

const app = new Hono();

app.use('/trpc/admin', createHTTPHandler({ router: adminRouter }));
app.use('/trpc/group', createHTTPHandler({ router: groupRouter }));
app.use('/trpc/post', createHTTPHandler({ router: postRouter }));
app.use('/trpc/user', createHTTPHandler({ router: userRouter }));
app.use('/trpc/reaction', createHTTPHandler({ router: reactionRouter }));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
