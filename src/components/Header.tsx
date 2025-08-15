'use client';

import { useBlogObserver } from '@/hooks/useBlogObserver';

export default function Header() {
  const { stats, isLoading } = useBlogObserver();

  if (isLoading) {
    return (
      <header className="header loading">
        <h1>Systems Thinking Blog</h1>
        <p>Loading...</p>
      </header>
    );
  }

  return (
    <header className="header">
      <h1>Systems Thinking Blog</h1>
      <p>Observer Pattern Implementation with Next.js</p>
      <div className="stats">
        <span className="stat">{stats.totalPosts} Posts</span>
        <span className="stat">{stats.totalLikes} Total Likes</span>
        <span className="stat">{stats.totalComments} Comments</span>
      </div>
      
      <style jsx>{`
        .header {
          text-align: center;
          background: white;
          border-radius: 15px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .header h1 {
          color: #333;
          margin: 0 0 10px 0;
          font-size: 2.5rem;
        }
        
        .header p {
          color: #666;
          margin: 0 0 20px 0;
          font-size: 1.1rem;
        }
        
        .stats {
          display: flex;
          justify-content: center;
          gap: 30px;
          flex-wrap: wrap;
        }
        
        .stat {
          background: #f8f9ff;
          padding: 10px 20px;
          border-radius: 25px;
          font-weight: 600;
          color: #5a67d8;
          border: 2px solid #e2e8f0;
        }
        
        .loading {
          color: white;
        }
        
        @media (max-width: 768px) {
          .stats {
            flex-direction: column;
            align-items: center;
          }
          
          .header h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </header>
  );
}