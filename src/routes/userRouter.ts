import { initTRPC } from '@trpc/server';
import { userController } from '../controllers/userController';

const t = initTRPC.create();

export const userRouter = t.router({
  registerUser: userController.registerUser,
});
