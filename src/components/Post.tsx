'use client';

import { useState } from 'react';
import { useBlogObserver } from '@/hooks/useBlogObserver';
import { BlogPost } from '@/lib/types';

interface PostProps {
  post: BlogPost;
}

export default function Post({ post }: PostProps) {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const { likePost, addComment } = useBlogObserver();

  const handleLike = () => {
    likePost(post.id);
  };

  const handleComment = () => {
    if (commentText.trim()) {
      addComment(post.id, commentText);
      setCommentText('');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <article className="post">
      <h2>{post.title}</h2>
      <div className="post-meta">
        <span className="author">By {post.author}</span>
        <span className="date">{formatDate(post.createdAt)}</span>
      </div>
      <p className="post-content">{post.content}</p>
      
      <div className="post-actions">
        <button onClick={handleLike} className="like-btn">
          ❤️ {post.likes}
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="comment-btn"
        >
          💬 {post.comments.length} Comments
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <div className="comment-form">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button onClick={handleComment}>Post</button>
          </div>
          
          <div className="comments">
            {post.comments.map(comment => (
              <div key={comment.id} className="comment">
                <p>{comment.text}</p>
                <small>{formatDate(comment.createdAt)}</small>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <style jsx>{`
        .post {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .post:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .post h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 1.5rem;
          line-height: 1.3;
        }
        
        .post-meta {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
          color: #666;
          font-size: 0.9rem;
        }
        
        .author {
          font-weight: 600;
          color: #5a67d8;
        }
        
        .date {
          color: #888;
        }
        
        .post-content {
          color: #555;
          line-height: 1.6;
          margin-bottom: 20px;
          font-size: 1rem;
        }
        
        .post-actions {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .like-btn,
        .comment-btn {
          background: #f8f9ff;
          border: 2px solid #e2e8f0;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .like-btn:hover {
          background: #ffe6e6;
          border-color: #f56565;
          transform: translateY(-1px);
        }
        
        .comment-btn:hover {
          background: #f0fff4;
          border-color: #48bb78;
          transform: translateY(-1px);
        }
        
        .comments-section {
          border-top: 2px solid #f7fafc;
          padding-top: 20px;
        }
        
        .comment-form {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .comment-form input {
          flex: 1;
          padding: 10px 15px;
          border: 2px solid #e2e8f0;
          border-radius: 20px;
          font-size: 0.9rem;
          transition: border-color 0.2s ease;
        }
        
        .comment-form input:focus {
          outline: none;
          border-color: #5a67d8;
        }
        
        .comment-form button {
          background: #48bb78;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        
        .comment-form button:hover {
          background: #38a169;
          transform: translateY(-1px);
        }
        
        .comments {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .comment {
          background: #f8f9ff;
          padding: 15px;
          border-radius: 10px;
          border-left: 4px solid #5a67d8;
        }
        
        .comment p {
          margin: 0 0 5px 0;
          color: #333;
          line-height: 1.4;
        }
        
        .comment small {
          color: #666;
          font-size: 0.8rem;
        }
        
        @media (max-width: 768px) {
          .post {
            padding: 20px;
          }
          
          .post-meta {
            flex-direction: column;
            gap: 5px;
          }
          
          .post-actions {
            flex-direction: column;
            gap: 10px;
          }
          
          .comment-form {
            flex-direction: column;
          }
        }
      `}</style>
    </article>
  );
}
