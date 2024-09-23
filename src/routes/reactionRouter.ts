import { initTRPC } from '@trpc/server';
import { reactionController } from '../controllers/reactionController';

const t = initTRPC.create();
export const reactionRouter = t.router({
  reaction: reactionController,
});