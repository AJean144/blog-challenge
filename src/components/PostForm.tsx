'use client';

import { useState } from 'react';
import { useBlogObserver } from '@/hooks/useBlogObserver';

export default function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addPost } = useBlogObserver();

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !author.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      addPost({ title: title.trim(), content: content.trim(), author: author.trim() });
      
      // Reset form
      setTitle('');
      setContent('');
      setAuthor('');
    } catch (error) {
      console.error('Failed to add post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="post-form">
      <h3>Create New Post</h3>
      <input
        type="text"
        placeholder="Post title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isSubmitting}
      />
      <input
        type="text"
        placeholder="Author name..."
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        disabled={isSubmitting}
      />
      <textarea
        placeholder="Write your content here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isSubmitting}
        rows={4}
      />
      <button 
        onClick={handleSubmit}
        disabled={isSubmitting || !title.trim() || !content.trim() || !author.trim()}
      >
        {isSubmitting ? 'Publishing...' : 'Publish Post'}
      </button>
      
      <style jsx>{`
        .post-form {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }
        
        .post-form h3 {
          margin: 0 0 20px 0;
          color: #333;
          font-size: 1.4rem;
        }
        
        .post-form input,
        .post-form textarea {
          width: 100%;
          padding: 12px;
          margin: 0 0 15px 0;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
          font-family: inherit;
        }
        
        .post-form input:focus,
        .post-form textarea:focus {
          outline: none;
          border-color: #5a67d8;
        }
        
        .post-form input:disabled,
        .post-form textarea:disabled {
          background-color: #f7fafc;
          cursor: not-allowed;
        }
        
        .post-form button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
          font-size: 1rem;
        }
        
        .post-form button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .post-form button:disabled {
          background: #cbd5e0;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>
    </div>
  );
}