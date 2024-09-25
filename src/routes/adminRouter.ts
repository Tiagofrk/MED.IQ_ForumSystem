import { initTRPC } from '@trpc/server';
import { adminController } from '../controllers/adminController';

const t = initTRPC.create();

export const adminRouter = t.router({
  listUsers: adminController.listUsers,
  blockUser: adminController.blockUser,
  deletePost: adminController.deletePost,
});
