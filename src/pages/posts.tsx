import React, { useState } from 'react';
import { postsRouter } from '../routes/postsRouter';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await postsRouter.posts.createPost.mutate({ title, content });
    alert('Post created successfully!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" />
      <button type="submit">Create Post</button>
    </form>
  );
}
