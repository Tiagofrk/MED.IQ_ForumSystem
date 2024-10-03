"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.t = void 0;
const server_1 = require("@trpc/server");
const t = server_1.initTRPC.create();
exports.t = t;
