import React from 'react';
import { trpc } from '../utils/trpc';

export default function AdminPanel() {
  // Query para listar usuários
  const { data: users, isLoading: isLoadingUsers, isError: isErrorUsers, error: usersError } = trpc.listUsers.useQuery();

  // Mutação para bloquear usuário
  const blockUserMutation = trpc.blockUser.useMutation();

  const handleBlockUser = async (userId: number) => {
    try {
      await blockUserMutation.mutateAsync({ userId });
      alert('Usuário bloqueado com sucesso!');
    } catch (error) {
      alert('Erro ao bloquear o usuário: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  return (
    <div>
      <h2>Gerenciamento de Usuários</h2>
      {isLoadingUsers && <p>Carregando usuários...</p>}
      {isErrorUsers && <p>Erro ao carregar usuários: {usersError?.message}</p>}
      {users?.map((user) => (
        <div key={user.id}>
          <p>{user.username}</p>
          <button onClick={() => handleBlockUser(user.id)} disabled={blockUserMutation.isLoading}>
            {blockUserMutation.isLoading ? 'Bloqueando...' : 'Bloquear Usuário'}
          </button>
        </div>
      ))}

      <h2>Gerenciamento de Postagens</h2>
      <PostListWithDelete />
    </div>
  );
}

function PostListWithDelete() {
  // Query para listar postagens
  const { data: posts, isLoading: isLoadingPosts, isError: isErrorPosts, error: postsError } = trpc.listPosts.useQuery();

  // Mutação para excluir postagens
  const deletePostMutation = trpc.deletePost.useMutation();

  const handleDeletePost = async (postId: number) => {
    try {
      await deletePostMutation.mutateAsync({ postId });
      alert('Postagem excluída com sucesso!');
    } catch (error) {
      alert('Erro ao excluir a postagem: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  return (
    <div>
      {isLoadingPosts && <p>Carregando postagens...</p>}
      {isErrorPosts && <p>Erro ao carregar postagens: {postsError?.message}</p>}
      {posts?.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <button onClick={() => handleDeletePost(post.id)} disabled={deletePostMutation.isLoading}>
            {deletePostMutation.isLoading ? 'Excluindo...' : 'Excluir Postagem'}
          </button>
        </div>
      ))}
    </div>
  );
}
