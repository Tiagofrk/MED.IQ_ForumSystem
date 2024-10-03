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
exports.reactionController = void 0;
const zod_1 = require("zod");
const server_1 = require("../trpc/server");
const db_1 = __importDefault(require("../db"));
const uuid_1 = require("uuid");
exports.reactionController = server_1.t.router({
    // Listar postagens com reações
    listPostsWithReactions: server_1.t.procedure.query(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const postsWithReactions = yield db_1.default
                .selectFrom('posts')
                .innerJoin('reactions', 'reactions.post_id', 'posts.id') // Junta com a tabela de reações
                .innerJoin('users', 'users.id', 'posts.user_id') // Junta com a tabela de usuários para obter informações do autor
                .select(['posts.id', 'posts.title', 'posts.content', 'posts.created_at', 'users.username', 'reactions.type'])
                .execute();
            return postsWithReactions;
        }
        catch (error) {
            console.error('Erro ao listar postagens com reações:', error);
            throw new Error('Não foi possível listar as postagens com reações.');
        }
    })),
    // Adicionar reação a uma postagem
    addReaction: server_1.t.procedure
        .input(zod_1.z.object({ postId: zod_1.z.number(), userId: zod_1.z.number(), type: zod_1.z.string().min(1) })) // Tipo da reação deve ser uma string não vazia
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        const { postId, userId, type } = input;
        try {
            // Verifica se a reação já existe para evitar duplicatas
            const existingReaction = yield db_1.default
                .selectFrom('reactions')
                .where('post_id', '=', postId)
                .where('user_id', '=', userId)
                .execute();
            if (existingReaction.length > 0) {
                return { success: false, message: 'Reação já adicionada a esta postagem.' };
            }
            // Adiciona nova reação
            const newReaction = yield db_1.default
                .insertInto('reactions')
                .values({
                id: parseInt((0, uuid_1.v4)()),
                post_id: postId,
                user_id: userId,
                type: 'like',
                created_at: new Date()
            })
                .returning(['id', 'post_id', 'user_id', 'type'])
                .executeTakeFirstOrThrow();
            return { success: true, message: 'Reação adicionada com sucesso.', reaction: newReaction };
        }
        catch (error) {
            console.error('Erro ao adicionar reação:', error);
            throw new Error('Não foi possível adicionar a reação.');
        }
    })),
});
