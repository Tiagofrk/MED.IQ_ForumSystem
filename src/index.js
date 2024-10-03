"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const standalone_1 = require("@trpc/server/adapters/standalone");
const server_1 = require("@trpc/server");
const adminRouter_1 = require("./routes/adminRouter");
const groupRouter_1 = require("./routes/groupRouter");
const postsRouter_1 = require("./routes/postsRouter");
const userRouter_1 = require("./routes/userRouter");
const reactionRouter_1 = require("./routes/reactionRouter");
require("reflect-metadata");
const t = server_1.initTRPC.create();
const appRouter = t.mergeRouters(adminRouter_1.adminRouter, groupRouter_1.groupRouter, postsRouter_1.postRouter, userRouter_1.userRouter, reactionRouter_1.reactionRouter);
const app = new hono_1.Hono();
// Criando o manipulador para TRPC
const handler = (0, standalone_1.createHTTPHandler)({
    router: appRouter,
    createContext: () => ({}), // Crie o contexto necessário aqui
});
// Adicionando as rotas do TRPC ao Hono
app.post('/trpc/*', (c) => __awaiter(void 0, void 0, void 0, function* () { return handler(c.req, c.res); }));
app.get('/trpc/*', (c) => __awaiter(void 0, void 0, void 0, function* () { return handler(c.req, c.res); }));
// Adicionando uma rota de teste
app.get('/', (c) => c.text('Hello Hono!'));
// Iniciando o servidor
app.fire({ port: 3000 }).then(() => {
    console.log('Server is running on http://localhost:3000');
}).catch((err) => {
    console.error('Failed to start server:', err);
});
