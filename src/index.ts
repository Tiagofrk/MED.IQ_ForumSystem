import { Hono } from 'hono';
import { createTRPCHandler } from '@trpc/server/adapters/standalone';
import { userRouter } from './routes/user';

const app = new Hono();
const trpcHandler = createTRPCHandler({ router: userRouter });
app.route('/trpc', trpcHandler);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
