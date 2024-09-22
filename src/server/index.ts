import { Hono } from 'hono';
import { createTRPCHandler } from 'hono-trpc';
import { appRouter } from '../trpc/routes';

const app = new Hono();

// Integração do Hono com tRPC
app.route('/trpc', createTRPCHandler({
  router: appRouter
}));

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
