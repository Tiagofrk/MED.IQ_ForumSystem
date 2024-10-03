"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const server_1 = require("@trpc/server");
const userRouter_1 = require("../routes/userRouter");
const postsRouter_1 = require("../routes/postsRouter");
const reactionRouter_1 = require("../routes/reactionRouter");
const groupRouter_1 = require("../routes/groupRouter");
const adminRouter_1 = require("../routes/adminRouter");
const t = server_1.initTRPC.create();
exports.appRouter = t.router({
    users: userRouter_1.userRouter,
    posts: postsRouter_1.postRouter,
    reactions: reactionRouter_1.reactionRouter,
    groups: groupRouter_1.groupRouter,
    admin: adminRouter_1.adminRouter,
});
