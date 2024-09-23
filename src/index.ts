import { Hono } from 'hono';
import { createTRPCHandler } from '@trpc/server/adapters/standalone';
import { userRouter } from '../src/routes/usersRouter';
import { serve } from '@hono/node-server'; // para rodar localmente

const app = new Hono();

// Cria o handler do tRPC
const trpcHandler = createTRPCHandler({
  router: userRouter,
});

// Converte o handler do tRPC para o formato do Hono
app.all('/trpc', async (c) => {
  // Adaptar a requisição/response do Hono para o formato esperado pelo tRPC
  const req = c.req;
  const res = await trpcHandler({
    method: req.method,
    headers: req.headers,
    body: await req.text(),
    query: new URLSearchParams(req.query()),
  });
  
  c.res.status = res.status;
  for (const [key, value] of Object.entries(res.headers)) {
    c.header(key, value as string);
  }

  return c.body(res.body);
});

serve(app, { port: 3000 });

console.log('Server running on http://localhost:3000');
