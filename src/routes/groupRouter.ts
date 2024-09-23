// src/routes/groupRouter.ts
import { initTRPC } from '@trpc/server';
import { groupController } from '../controllers/groupController';

const t = initTRPC.create();
export const groupRouter = t.router({
  group: groupController,
});
