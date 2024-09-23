import React from 'react';
import { adminRouter } from '../routes/adminRouter';

export default function AdminPanel() {
  const { data: users } = adminRouter.admin.listUsers.useQuery();

  const handleBlockUser = async (userId: number) => {
    await adminRouter.admin.blockUser.mutate({ userId });
    alert('User blocked successfully!');
  };

  const handleDeletePost = async (postId: number) => {
    await adminRouter.admin.deletePost.mutate({ postId });
    alert('Post deleted successfully!');
  };

  return (
    <div>
      <h2>User Management</h2>
      {users?.map((user) => (
        <div key={user.id}>
          <p>{user.username}</p>
          <button onClick={() => handleBlockUser(user.id)}>Block User</button>
        </div>
      ))}

      <h2>Post Management</h2>
      <PostListWithDelete />
    </div>
  );
}

function PostListWithDelete() {
  const { data: posts } = adminRouter.posts.listPosts.useQuery();

  const handleDeletePost = async (postId: number) => {
    await adminRouter.admin.deletePost.mutate({ postId });
  };

  return (
    <div>
      {posts?.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <button onClick={() => handleDeletePost(post.id)}>Delete Post</button>
        </div>
      ))}
    </div>
  );
}
