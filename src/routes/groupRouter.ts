// src/routes/groupRouter.ts
import { initTRPC } from '@trpc/server';
import { groupParticipationController } from '../controllers/groupController';

const t = initTRPC.create();

export const groupRouter = t.router({
  listUserGroups: groupParticipationController.listUserGroups,
  listGroupMembers: groupParticipationController.listGroupMembers,
  addMember: groupParticipationController.addMemberToGroup, 
  removeMember: groupParticipationController.removeMemberFromGroup, 
  deleteGroup: groupParticipationController.deleteGroup,
});
