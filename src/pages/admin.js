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
exports.default = AdminPanel;
const react_1 = __importDefault(require("react"));
const trpc_1 = require("../utils/trpc");
function AdminPanel() {
    // Query para listar usuários
    const { data: users, isLoading: isLoadingUsers, isError: isErrorUsers, error: usersError } = trpc_1.trpc.listUsers.useQuery();
    // Mutação para bloquear usuário
    const blockUserMutation = trpc_1.trpc.blockUser.useMutation();
    const handleBlockUser = (userId) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield blockUserMutation.mutateAsync({ userId });
            alert('Usuário bloqueado com sucesso!');
        }
        catch (error) {
            alert('Erro ao bloquear o usuário: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
        }
    });
    return (<div>
      <h2>Gerenciamento de Usuários</h2>
      {isLoadingUsers && <p>Carregando usuários...</p>}
      {isErrorUsers && <p>Erro ao carregar usuários: {usersError === null || usersError === void 0 ? void 0 : usersError.message}</p>}
      {users === null || users === void 0 ? void 0 : users.map((user) => (<div key={user.id}>
          <p>{user.username}</p>
          <button onClick={() => handleBlockUser(user.id)} disabled={blockUserMutation.isLoading}>
            {blockUserMutation.isLoading ? 'Bloqueando...' : 'Bloquear Usuário'}
          </button>
        </div>))}

      <h2>Gerenciamento de Postagens</h2>
      <PostListWithDelete />
    </div>);
}
function PostListWithDelete() {
    // Query para listar postagens
    const { data: posts, isLoading: isLoadingPosts, isError: isErrorPosts, error: postsError } = trpc_1.trpc.listPosts.useQuery();
    // Mutação para excluir postagens
    const deletePostMutation = trpc_1.trpc.deletePost.useMutation();
    const handleDeletePost = (postId) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield deletePostMutation.mutateAsync({ postId });
            alert('Postagem excluída com sucesso!');
        }
        catch (error) {
            alert('Erro ao excluir a postagem: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
        }
    });
    return (<div>
      {isLoadingPosts && <p>Carregando postagens...</p>}
      {isErrorPosts && <p>Erro ao carregar postagens: {postsError === null || postsError === void 0 ? void 0 : postsError.message}</p>}
      {posts === null || posts === void 0 ? void 0 : posts.map((post) => (<div key={post.id}>
          <h2>{post.title}</h2>
          <button onClick={() => handleDeletePost(post.id)} disabled={deletePostMutation.isLoading}>
            {deletePostMutation.isLoading ? 'Excluindo...' : 'Excluir Postagem'}
          </button>
        </div>))}
    </div>);
}
