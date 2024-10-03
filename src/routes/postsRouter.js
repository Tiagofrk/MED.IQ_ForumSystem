"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
// src/routes/postRouter.ts
const server_1 = require("@trpc/server");
const postController_1 = require("../controllers/postController");
const t = server_1.initTRPC.create();
exports.postRouter = t.router({
    createPost: postController_1.postController.createPost,
    listPosts: postController_1.postController.listPosts,
    deletePost: postController_1.postController.deletePost,
});
