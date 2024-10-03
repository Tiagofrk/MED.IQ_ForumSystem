"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactionRouter = void 0;
const server_1 = require("@trpc/server");
const reactionController_1 = require("../controllers/reactionController");
const t = server_1.initTRPC.create();
exports.reactionRouter = t.router({
    listPostsWithReactions: reactionController_1.reactionController.listPostsWithReactions,
    addReaction: reactionController_1.reactionController.addReaction,
});
