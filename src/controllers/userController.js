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
exports.userController = void 0;
const zod_1 = require("zod");
const server_1 = require("../trpc/server");
const db_1 = __importDefault(require("../db"));
const uuid_1 = require("uuid");
exports.userController = server_1.t.router({
    // Registrar usuário
    registerUser: server_1.t.procedure
        .input(zod_1.z.object({
        username: zod_1.z.string().min(1),
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6),
    }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        const { username, email, password } = input;
        try {
            // Insere o novo usuário no banco de dados
            const newUser = yield db_1.default
                .insertInto('users')
                .values({
                id: parseInt((0, uuid_1.v4)()),
                username,
                email,
                password, // Considere aplicar hashing na senha antes de armazenar
                role: 'user', // Define o papel padrão como 'user'
                created_at: new Date(), // Adiciona a data de criação
            })
                .returning(['id', 'username', 'email', 'role', 'created_at'])
                .executeTakeFirstOrThrow();
            return { success: true, user: newUser };
        }
        catch (error) {
            console.error('Erro ao registrar usuário:', error);
            throw new Error('Não foi possível registrar o usuário.');
        }
    })),
    // Bloquear usuário
    blockUser: server_1.t.procedure
        .input(zod_1.z.object({ userId: zod_1.z.number() }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        const { userId } = input;
        try {
            yield db_1.default.updateTable('users')
                .set({ role: 'blocked' })
                .where('id', '=', userId)
                .execute();
            return { success: true, message: 'Usuário bloqueado com sucesso.' };
        }
        catch (error) {
            console.error('Erro ao bloquear usuário:', error);
            throw new Error('Não foi possível bloquear o usuário.');
        }
    })),
});
