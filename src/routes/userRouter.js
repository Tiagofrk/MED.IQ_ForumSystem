"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
// src/routes/userRouter.ts
const server_1 = require("@trpc/server");
const userController_1 = require("../controllers/userController");
const t = server_1.initTRPC.create();
exports.userRouter = t.router({
    registerUser: userController_1.userController.registerUser,
    listUsers: userController_1.userController.listUsers,
    blockUser: userController_1.userController.blockUser,
});
