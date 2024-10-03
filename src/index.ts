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

// Criando o manipulador para TRPC
const handler = createHTTPHandler({
  router: appRouter,
  createContext: () => ({}), // Crie o contexto necessário aqui
});

// Adicionando as rotas do TRPC ao Hono
app.post('/trpc/*', async (c) => handler(c.req as any, c.res as any));
app.get('/trpc/*', async (c) => handler(c.req as any, c.res as any));

// Adicionando uma rota de teste
app.get('/', (c) => c.text('Hello Hono!'));

// Iniciando o servidor
app.fire({ port: 3000 }).then(() => {
  console.log('Server is running on http://localhost:3000');
}).catch((err) => {
  console.error('Failed to start server:', err);
});

export type AppRouter = typeof appRouter;
