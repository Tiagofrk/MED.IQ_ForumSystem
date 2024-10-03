"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.default = GroupList;
const react_1 = __importStar(require("react"));
const trpc_1 = require("../utils/trpc");
function GroupList() {
    const { data: groups, isLoading, isError, error } = trpc_1.trpc.listGroups.useQuery();
    const [groupName, setGroupName] = (0, react_1.useState)('');
    const [description, setDescription] = (0, react_1.useState)('');
    // Usar useMutation para criação de grupos
    const createGroupMutation = trpc_1.trpc.createGroup.useMutation();
    // Usar useMutation para adicionar membro ao grupo (equivalente a "entrar" no grupo)
    const addMemberMutation = trpc_1.trpc.addMember.useMutation();
    const handleCreateGroup = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        try {
            yield createGroupMutation.mutateAsync({ name: groupName, description });
            alert('Grupo criado com sucesso!');
            setGroupName('');
            setDescription('');
        }
        catch (error) {
            alert('Erro ao criar grupo: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
        }
    });
    const handleJoinGroup = (groupId) => __awaiter(this, void 0, void 0, function* () {
        try {
            // Aqui estou assumindo que você tem o `userId` de algum lugar, como o contexto de autenticação.
            const userId = 1; // Substitua isso pelo userId real do contexto
            yield addMemberMutation.mutateAsync({ groupId, userId });
            alert('Entrou no grupo com sucesso!');
        }
        catch (error) {
            alert('Erro ao entrar no grupo: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
        }
    });
    if (isLoading)
        return <p>Carregando grupos...</p>;
    if (isError)
        return <p>Erro ao carregar grupos: {error.message}</p>;
    return (<div>
      <h2>Criar um Novo Grupo</h2>
      <form onSubmit={handleCreateGroup}>
        <input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Nome do Grupo" required/>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição"/>
        <button type="submit" disabled={createGroupMutation.isLoading}>
          {createGroupMutation.isLoading ? 'Criando...' : 'Criar Grupo'}
        </button>
      </form>

      <h2>Grupos Disponíveis</h2>
      {groups === null || groups === void 0 ? void 0 : groups.map((group) => (<div key={group.id}>
          <h3>{group.name}</h3>
          <p>{group.description}</p>
          <button onClick={() => handleJoinGroup(group.id)} disabled={addMemberMutation.isLoading}>
            {addMemberMutation.isLoading ? 'Entrando...' : 'Entrar no Grupo'}
          </button>
        </div>))}
    </div>);
}
