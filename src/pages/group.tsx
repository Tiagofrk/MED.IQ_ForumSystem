import React, { useState } from 'react';
import { trpc } from '../utils/trpc';

export default function GroupList() {
  const { data: groups } = trpc.group.listGroups.useQuery();
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    await trpc.group.createGroup.mutate({ name: groupName, description });
    alert('Group created successfully!');
  };

  const handleJoinGroup = async (groupId: number) => {
    await trpc.group.joinGroup.mutate({ groupId });
    alert('Joined group successfully!');
  };

  return (
    <div>
      <h2>Create a New Group</h2>
      <form onSubmit={handleCreateGroup}>
        <input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Group Name" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <button type="submit">Create Group</button>
      </form>

      <h2>Available Groups</h2>
      {groups?.map((group) => (
        <div key={group.id}>
          <h3>{group.name}</h3>
          <button onClick={() => handleJoinGroup(group.id)}>Join Group</button>
        </div>
      ))}
    </div>
  );
}
