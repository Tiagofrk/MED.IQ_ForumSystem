import React, { useState } from 'react';
import { trpc } from '../utils/trpc';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Usar o hook useMutation para criar a postagem
  const createPostMutation = trpc.createPost.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createPostMutation.mutateAsync({ title, content });
      alert('Postagem criada com sucesso!');
      setTitle(''); // Limpar o título após criar o post
      setContent(''); // Limpar o conteúdo após criar o post
    } catch (error) {
      alert('Erro ao criar postagem: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Conteúdo"
        required
      />
      <button type="submit" disabled={createPostMutation.isLoading}>
        {createPostMutation.isLoading ? 'Criando...' : 'Criar Postagem'}
      </button>
      {createPostMutation.isError && (
        <p style={{ color: 'red' }}>Erro: {createPostMutation.error.message}</p>
      )}
    </form>
  );
}
