import React, { useState } from 'react';
import { trpc } from '../utils/trpc'; 

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Usar o hook useMutation para registrar a mutação
  const registerUserMutation = trpc.registerUser.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await registerUserMutation.mutateAsync({ username, email, password });
      alert('User created successfully!');
    } catch (error) {
      alert('Error creating user: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
      <button type="submit">Register</button>
    </form>
  );
}
