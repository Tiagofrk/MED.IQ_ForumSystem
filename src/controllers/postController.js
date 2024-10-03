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
exports.postController = void 0;
const zod_1 = require("zod");
const server_1 = require("../trpc/server");
const db_1 = __importDefault(require("../db"));
const uuid_1 = require("uuid");
exports.postController = server_1.t.router({
    // Criar nova postagem
    createPost: server_1.t.procedure
        .input(zod_1.z.object({ title: zod_1.z.string().min(1), content: zod_1.z.string().min(1), userId: zod_1.z.number() }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        const { title, content, userId } = input;
        try {
            const newPost = yield db_1.default
                .insertInto('posts')
                .values({
                id: parseInt((0, uuid_1.v4)()),
                title: title,
                content: content,
                user_id: userId,
                created_at: new Date()
            })
                .returning(['id', 'title', 'content', 'user_id', 'created_at'])
                .executeTakeFirstOrThrow();
            return newPost;
        }
        catch (error) {
            console.error('Erro ao criar postagem:', error);
            throw new Error('Não foi possível criar a postagem.');
        }
    })),
    // Listar postagens
    listPosts: server_1.t.procedure.query(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const posts = yield db_1.default
                .selectFrom('posts')
                .innerJoin('users', 'users.id', 'posts.user_id') // Junta com a tabela de usuários para obter informações do autor
                .select(['posts.id', 'posts.title', 'posts.content', 'posts.created_at', 'users.username'])
                .execute();
            return posts;
        }
        catch (error) {
            console.error('Erro ao listar postagens:', error);
            throw new Error('Não foi possível listar as postagens.');
        }
    })),
});
