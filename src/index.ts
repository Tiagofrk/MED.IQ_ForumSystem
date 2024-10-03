import { ExecutionContext, Hono } from 'hono';
import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import { initTRPC } from '@trpc/server';
import { adminRouter } from './routes/adminRouter';
import { groupRouter } from './routes/groupRouter';
import { postRouter } from './routes/postsRouter';
import { userRouter } from './routes/userRouter';
import { reactionRouter } from './routes/reactionRouter';
import 'reflect-metadata';

const t = initTRPC.create();

// Criando o appRouter combinando os routers
const appRouter = t.mergeRouters(
  adminRouter,
  groupRouter,
  postRouter,
  userRouter,
  reactionRouter
);

const app = new Hono({
  strict: true, // Modo estrito ativado
  getPath: (req) => '/' + req.headers.get('host') + req.url.replace(/^https?:\/\/[^/]+(\/[^?]*)/, '$1'),
});

// Definindo uma rota GET
app.get('/hello', (c) => c.text('Hello World!'));

// Tratando erros
app.onError((err, c) => {
  console.error(err);
  return c.text('Internal Server Error', 500);
});

// Definindo uma rota padrão 404
app.notFound((c) => c.text('Not Found', 404));

// Iniciando o servidor
const PORT = process.env.PORT || 3000;
app.fetch = (request: Request, env?: any, ctx?: ExecutionContext) => {
  return app.fetch(request, env, ctx);
};

// Se você estiver em um ambiente como Cloudflare Workers
app.fire(); // Adiciona um ouvinte global para eventos de fetch

export type AppRouter = typeof appRouter;
