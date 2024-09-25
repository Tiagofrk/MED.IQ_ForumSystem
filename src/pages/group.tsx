import React, { useState } from 'react';
import { trpc } from '../utils/trpc';

export default function GroupList() {
  const { data: groups, isLoading, isError, error } = trpc.listGroups.useQuery();
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');

  // Usar useMutation para criação de grupos
  const createGroupMutation = trpc.createGroup.useMutation();
  
  // Usar useMutation para adicionar membro ao grupo (equivalente a "entrar" no grupo)
  const addMemberMutation = trpc.addMember.useMutation();

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGroupMutation.mutateAsync({ name: groupName, description });
      alert('Grupo criado com sucesso!');
      setGroupName('');
      setDescription('');
    } catch (error) {
      alert('Erro ao criar grupo: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const handleJoinGroup = async (groupId: number) => {
    try {
      // Aqui estou assumindo que você tem o `userId` de algum lugar, como o contexto de autenticação.
      const userId = 1; // Substitua isso pelo userId real do contexto
      await addMemberMutation.mutateAsync({ groupId, userId });
      alert('Entrou no grupo com sucesso!');
    } catch (error) {
      alert('Erro ao entrar no grupo: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  if (isLoading) return <p>Carregando grupos...</p>;
  if (isError) return <p>Erro ao carregar grupos: {error.message}</p>;

  return (
    <div>
      <h2>Criar um Novo Grupo</h2>
      <form onSubmit={handleCreateGroup}>
        <input 
          value={groupName} 
          onChange={(e) => setGroupName(e.target.value)} 
          placeholder="Nome do Grupo" 
          required 
        />
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Descrição" 
        />
        <button type="submit" disabled={createGroupMutation.isLoading}>
          {createGroupMutation.isLoading ? 'Criando...' : 'Criar Grupo'}
        </button>
      </form>

      <h2>Grupos Disponíveis</h2>
      {groups?.map((group) => (
        <div key={group.id}>
          <h3>{group.name}</h3>
          <p>{group.description}</p>
          <button 
            onClick={() => handleJoinGroup(group.id)} 
            disabled={addMemberMutation.isLoading}
          >
            {addMemberMutation.isLoading ? 'Entrando...' : 'Entrar no Grupo'}
          </button>
        </div>
      ))}
    </div>
  );
}
