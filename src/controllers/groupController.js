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
exports.groupParticipationController = void 0;
const zod_1 = require("zod");
const server_1 = require("../trpc/server");
const db_1 = __importDefault(require("../db"));
exports.groupParticipationController = server_1.t.router({
    // Listar grupos de um usuário específico
    listUserGroups: server_1.t.procedure
        .input(zod_1.z.object({ userId: zod_1.z.number() }))
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        const { userId } = input;
        try {
            const userGroups = yield db_1.default
                .selectFrom('user_groups')
                .innerJoin('groups', 'groups.id', 'user_groups.group_id')
                .select(['groups.id', 'groups.name', 'groups.description', 'groups.created_at'])
                .where('user_groups.user_id', '=', userId)
                .execute();
            return userGroups;
        }
        catch (error) {
            console.error('Erro ao listar grupos do usuário:', error);
            throw new Error('Não foi possível listar os grupos do usuário.');
        }
    })),
    // Listar membros de um grupo específico
    listGroupMembers: server_1.t.procedure
        .input(zod_1.z.object({ groupId: zod_1.z.number() }))
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        const { groupId } = input;
        try {
            const groupMembers = yield db_1.default
                .selectFrom('user_groups')
                .innerJoin('users', 'users.id', 'user_groups.user_id')
                .select(['users.id', 'users.username', 'users.email', 'users.role', 'users.created_at'])
                .where('user_groups.group_id', '=', groupId)
                .execute();
            return groupMembers;
        }
        catch (error) {
            console.error('Erro ao listar membros do grupo:', error);
            throw new Error('Não foi possível listar os membros do grupo.');
        }
    })),
    // Adicionar um membro a um grupo
    addMemberToGroup: server_1.t.procedure
        .input(zod_1.z.object({ groupId: zod_1.z.number(), userId: zod_1.z.number() }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        const { groupId, userId } = input;
        try {
            yield db_1.default.insertInto('user_groups')
                .values({
                group_id: groupId,
                user_id: userId,
            })
                .execute();
            return { success: true, message: 'Membro adicionado ao grupo com sucesso.' };
        }
        catch (error) {
            console.error('Erro ao adicionar membro ao grupo:', error);
            throw new Error('Não foi possível adicionar o membro ao grupo.');
        }
    })),
    // Remover um membro de um grupo
    removeMemberFromGroup: server_1.t.procedure
        .input(zod_1.z.object({ groupId: zod_1.z.number(), userId: zod_1.z.number() }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        const { groupId, userId } = input;
        try {
            const affectedRows = yield db_1.default.deleteFrom('user_groups')
                .where('group_id', '=', groupId)
                .where('user_id', '=', userId)
                .execute();
            if (affectedRows.length === 0) {
                return { success: false, message: 'Membro não encontrado no grupo.' };
            }
            return { success: true, message: 'Membro removido do grupo com sucesso.' };
        }
        catch (error) {
            console.error('Erro ao remover membro do grupo:', error);
            throw new Error('Não foi possível remover o membro do grupo.');
        }
    })),
    // Excluir um grupo
    deleteGroup: server_1.t.procedure
        .input(zod_1.z.object({ groupId: zod_1.z.number() }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        const { groupId } = input;
        try {
            const affectedRows = yield db_1.default.deleteFrom('groups')
                .where('id', '=', groupId)
                .execute();
            if (affectedRows.length === 0) {
                return { success: false, message: 'Grupo não encontrado.' };
            }
            return { success: true, message: 'Grupo excluído com sucesso.' };
        }
        catch (error) {
            console.error('Erro ao excluir grupo:', error);
            throw new Error('Não foi possível excluir o grupo.');
        }
    })),
});
