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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
const http_1 = __importDefault(require("http"));
// Inicializando tRPC
const t = server_1.initTRPC.create();
// Combinando os routers do tRPC
const appRouter = t.mergeRouters(adminRouter_1.adminRouter, groupRouter_1.groupRouter, postsRouter_1.postRouter, userRouter_1.userRouter, reactionRouter_1.reactionRouter);
// Criando o handler do tRPC
const handler = (0, standalone_1.createHTTPHandler)({
    router: appRouter,
    createContext: () => ({}), // Aqui você pode definir o contexto do tRPC
});
// Inicializando o app Hono
const app = new hono_1.Hono({
    strict: true, // Modo estrito ativado
    getPath: (req) => '/' + req.headers.get('host') + req.url.replace(/^https?:\/\/[^/]+(\/[^?]*)/, '$1'),
});
// Definindo uma rota GET simples no Hono
app.get('/hello', (c) => c.text('Hello World!'));
// Tratamento de erros do Hono
app.onError((err, c) => {
    console.error(err);
    return c.text('Internal Server Error', 500);
});
// Definindo uma rota 404 no Hono
app.notFound((c) => c.text('Not Found', 404));
// Iniciando o servidor
const PORT = process.env.PORT || 3000;
// Função para converter IncomingMessage em Request
function toFetchRequest(req) {
    const headers = new Headers(req === null || req === void 0 ? void 0 : req.headers); // Conversão para Headers
    // Transformando IncomingMessage em ReadableStream para o body
    const body = req && req.method !== 'GET' && req.method !== 'HEAD'
        ? new ReadableStream({
            start(controller) {
                req.on('data', (chunk) => {
                    controller.enqueue(chunk);
                });
                req.on('end', () => {
                    controller.close();
                });
                req.on('error', (err) => {
                    controller.error(err);
                });
            },
        })
        : null; // Se o método for GET ou HEAD, o body será nulo
    return new Request(`http://localhost:${PORT}${req === null || req === void 0 ? void 0 : req.url}`, {
        method: req === null || req === void 0 ? void 0 : req.method,
        headers,
        body,
    });
}
// Criando o servidor HTTP
const server = http_1.default.createServer((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const url = (_a = req === null || req === void 0 ? void 0 : req.url) !== null && _a !== void 0 ? _a : '';
    // Processando requisições tRPC
    if (url.startsWith('/trpc/')) {
        try {
            // Passando tanto `req` quanto `res` para o handler do tRPC
            handler(req, res);
        }
        catch (error) {
            console.error('Erro tRPC:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
        return;
    }
    // Processando requisições Hono
    const honoResponse = yield app.fetch(toFetchRequest(req));
    // Enviando a resposta Hono
    res.writeHead(honoResponse.status, { 'Content-Type': 'text/plain' });
    res.end(yield honoResponse.text());
}));
// Servidor ouvindo na porta definida
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
