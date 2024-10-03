"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupRouter = void 0;
// src/routes/groupRouter.ts
const server_1 = require("@trpc/server");
const groupController_1 = require("../controllers/groupController");
const t = server_1.initTRPC.create();
exports.groupRouter = t.router({
    listUserGroups: groupController_1.groupParticipationController.listUserGroups,
    listGroupMembers: groupController_1.groupParticipationController.listGroupMembers,
    addMember: groupController_1.groupParticipationController.addMemberToGroup,
    removeMember: groupController_1.groupParticipationController.removeMemberFromGroup,
    deleteGroup: groupController_1.groupParticipationController.deleteGroup,
});
