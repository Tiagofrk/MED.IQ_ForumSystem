import React, { useState } from 'react';
import { trpc } from '../utils/trpc';

export default function PostList() {
  const { data: posts, isLoading, error } = trpc.listPostsWithReactions.useQuery();
  const addReactionMutation = trpc.addReaction.useMutation();

  const [selectedReaction, setSelectedReaction] = useState<{ [key: number]: 'like' | 'dislike' | '' }>({});

  const handleReaction = async (postId: number, reaction: 'like' | 'dislike') => {
    try {
      await addReactionMutation.mutateAsync({ postId, type: reaction });
      setSelectedReaction((prev) => ({ ...prev, [postId]: reaction }));
      alert('Reação registrada com sucesso!');
    } catch (error) {
      alert('Erro ao registrar reação: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar postagens</p>;

  return (
    <div>
      {posts?.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>Reações: {post.reactions_count}</p>
          <button
            onClick={() => handleReaction(post.id, 'like')}
            disabled={selectedReaction[post.id] === 'like'}
          >
            Like
          </button>
          <button
            onClick={() => handleReaction(post.id, 'dislike')}
            disabled={selectedReaction[post.id] === 'dislike'}
          >
            Dislike
          </button>
        </div>
      ))}
    </div>
  );
}
