// src/routes/groupRouter.ts
import { initTRPC } from '@trpc/server';
import { groupController } from '../controllers/groupController';

const t = initTRPC.create();

export const groupRouter = t.router({
  createGroup: groupController.createGroup,
  listGroups: groupController.listGroups,
  addMember: groupController.addMember,
  removeMember: groupController.removeMember,
});
