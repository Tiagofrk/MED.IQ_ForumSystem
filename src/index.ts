import { Hono } from 'hono';
import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import { initTRPC } from '@trpc/server';
import { adminRouter } from './routes/adminRouter';
import { groupRouter } from './routes/groupRouter';
import { postRouter } from './routes/postsRouter';
import { userRouter } from './routes/userRouter';
import { reactionRouter } from './routes/reactionRouter';
import 'reflect-metadata';
import http, { IncomingMessage, ServerResponse } from 'http';

// Inicializando tRPC
const t = initTRPC.create();

// Combinando os routers do tRPC
const appRouter = t.mergeRouters(
  adminRouter,
  groupRouter,
  postRouter,
  userRouter,
  reactionRouter
);

// Criando o handler do tRPC
const handler = createHTTPHandler({
  router: appRouter,
  createContext: () => ({}), // Aqui você pode definir o contexto do tRPC
});

// Inicializando o app Hono
const app = new Hono({
  strict: true, // Modo estrito ativado
  getPath: (req) =>
    '/' + req.headers.get('host') + req.url.replace(/^https?:\/\/[^/]+(\/[^?]*)/, '$1'),
});

// Definindo uma rota GET simples no Hono
app.get('/hello', (c) => c.text('Hello World!'));

// Tratamento de erros do Hono
app.onError((err, c) => {
  console.error(err);
  return c.text('Internal Server Error', 500);
});

// Definindo uma rota 404 no Hono
app.notFound((c) => c.text('Not Found', 404));

// Iniciando o servidor
const PORT = process.env.PORT || 3000;

// Função para converter IncomingMessage em Request
function toFetchRequest(req: IncomingMessage | undefined): Request {
  const headers = new Headers(req?.headers as any); // Conversão para Headers

  // Transformando IncomingMessage em ReadableStream para o body
  const body =
    req && req.method !== 'GET' && req.method !== 'HEAD'
      ? new ReadableStream({
          start(controller) {
            req.on('data', (chunk) => {
              controller.enqueue(chunk);
            });
            req.on('end', () => {
              controller.close();
            });
            req.on('error', (err) => {
              controller.error(err);
            });
          },
        })
      : null; // Se o método for GET ou HEAD, o body será nulo

  return new Request(`http://localhost:${PORT}${req?.url}`, {
    method: req?.method,
    headers,
    body,
  });
}

// Criando o servidor HTTP
const server = http.createServer(async (req, res) => {
  const url = req?.url ?? '';

  // Processando requisições tRPC
  if (url.startsWith('/trpc/')) {
    try {
      // Passando tanto `req` quanto `res` para o handler do tRPC
      handler(req, res);
    } catch (error) {
      console.error('Erro tRPC:', error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
    return;
  }

  // Processando requisições Hono
  const honoResponse = await app.fetch(toFetchRequest(req));

  // Enviando a resposta Hono
  res.writeHead(honoResponse.status, { 'Content-Type': 'text/plain' });
  res.end(await honoResponse.text());
});

// Servidor ouvindo na porta definida
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
