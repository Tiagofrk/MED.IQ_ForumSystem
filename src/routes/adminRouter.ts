// src/routes/adminRouter.ts
import { initTRPC } from '@trpc/server';
import { adminController } from '../controllers/adminController';

const t = initTRPC.create();
export const adminRouter = t.router({
  admin: adminController,
});
