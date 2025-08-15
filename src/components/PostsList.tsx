'use client';

import { useBlogObserver } from '@/hooks/useBlogObserver';
import Post from './Post';

export default function PostsList() {
  const { posts, isLoading } = useBlogObserver();

  if (isLoading) {
    return (
      <div className="posts-list-loading">
        <p>Loading posts...</p>
        <style jsx>{`
          .posts-list-loading {
            text-align: center;
            padding: 40px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          }
          .posts-list-loading p {
            color: #666;
            font-size: 1.1rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="posts-list">
      {posts.length === 0 ? (
        <div className="empty-state">
          <h3>No posts yet</h3>
          <p>Create your first post to get started!</p>
        </div>
      ) : (
        posts.map(post => <Post key={post.id} post={post} />)
      )}
      
      <style jsx>{`
        .posts-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
        
        .empty-state h3 {
          color: #333;
          margin: 0 0 10px 0;
          font-size: 1.3rem;
        }
        
        .empty-state p {
          color: #666;
          margin: 0;
        }
      `}</style>
    </div>
  );
}