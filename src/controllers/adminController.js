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
exports.adminController = void 0;
const zod_1 = require("zod");
const server_1 = require("../trpc/server");
const index_1 = __importDefault(require("../db/index"));
exports.adminController = server_1.t.router({
    // Listar usuários
    listUsers: server_1.t.procedure.query(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield index_1.default;
            index_1.default.selectFrom('users') // Usa a referência da tabela
                .select(['id', 'username', 'email', 'role', 'created_at'])
                .execute();
            return users;
        }
        catch (error) {
            console.error('Erro ao listar usuários:', error);
            throw new Error('Não foi possível listar os usuários.');
        }
    })),
    // Bloquear usuário
    blockUser: server_1.t.procedure
        .input(zod_1.z.object({ userId: zod_1.z.number() }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        const { userId } = input;
        yield index_1.default.updateTable('users')
            .set({ role: 'blocked' })
            .where('id', '=', userId)
            .execute();
        return { success: true, message: 'Usuário bloqueado com sucesso.' };
    })),
    // Excluir postagem
    deletePost: server_1.t.procedure
        .input(zod_1.z.object({ postId: zod_1.z.number() }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        const { postId } = input;
        const affectedRows = yield index_1.default.deleteFrom('posts')
            .where('id', '=', postId)
            .execute();
        if (affectedRows.length === 0) {
            return { success: false, message: 'Postagem não encontrada.' };
        }
        return { success: true, message: 'Postagem excluída com sucesso.' };
    })),
});
