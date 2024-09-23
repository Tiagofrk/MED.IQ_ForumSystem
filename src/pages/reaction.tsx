import React from 'react';
import { reactionRouter } from '../routes/reactionRouter';

export default function PostList() {
  const { data: posts } = reactionRouter.posts.listPosts.useQuery();

  const handleReaction = async (postId: number, reaction: 'like' | 'dislike') => {
    await reactionRouter.reactions.addReaction.mutate({ postId, type: reaction });
  };

  return (
    <div>
      {posts?.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <button onClick={() => handleReaction(post.id, 'like')}>Like</button>
          <button onClick={() => handleReaction(post.id, 'dislike')}>Dislike</button>
        </div>
      ))}
    </div>
  );
}
