"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const server_1 = require("@trpc/server");
const adminController_1 = require("../controllers/adminController");
const t = server_1.initTRPC.create();
exports.adminRouter = t.router({
    listUsers: adminController_1.adminController.listUsers,
    blockUser: adminController_1.adminController.blockUser,
    deletePost: adminController_1.adminController.deletePost,
});
