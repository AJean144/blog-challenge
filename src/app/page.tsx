'use client';

import Header from '@/components/Header';
import PostForm from '@/components/PostForm';
import PostsList from '@/components/PostsList';
import ActivityFeed from '@/components/ActivityFeed';
import NoSSR from '@/components/NoSSR';

export default function HomePage() {
  return (
    <div className="blog-container">
      <NoSSR fallback={
        <div className="loading-container">
          <h1>Systems Thinking Blog</h1>
          <p>Loading...</p>
        </div>
      }>
        <Header />
        
        <div className="blog-layout">
          <main className="main-content">
            <PostForm />
            <PostsList />
          </main>
          
          <aside className="sidebar">
            <ActivityFeed />
            
            <div className="pattern-info">
            <h3>🔍 Observer Pattern in Next.js</h3>
            <p>This Next.js blog demonstrates the Observer pattern with:</p>
            <ul>
              <li><strong>TypeScript:</strong> Type-safe observer implementation</li>
              <li><strong>Persistence:</strong> localStorage integration</li>
              <li><strong>Performance:</strong> Optimized re-renders</li>
              <li><strong>Real-time:</strong> Live activity updates</li>
              <li><strong>Responsive:</strong> Mobile-friendly design</li>
            </ul>
            
            <div className="systems-thinking">
              <h4>🌍 Systems Thinking Applied:</h4>
              <p><strong>Structure:</strong> Observer-subject relationships</p>
              <p><strong>Function:</strong> Event-driven state flow</p>
              <p><strong>Purpose:</strong> Responsive blog ecosystem</p>
            </div>
          </div>
        </aside>
      </div>
      </NoSSR>
      
      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          text-align: center;
        }
        
        .loading-container h1 {
          color: #333;
          margin-bottom: 1rem;
        }
        
        .loading-container p {
          color: #666;
          font-size: 1.1rem;
        }
        
        .pattern-info {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        }
        
        .pattern-info h3 {
          margin: 0 0 15px 0;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .pattern-info p {
          margin: 0 0 15px 0;
          opacity: 0.95;
          line-height: 1.5;
        }
        
        .pattern-info ul {
          list-style: none;
          padding: 0;
          margin: 0 0 20px 0;
        }
        
        .pattern-info li {
          padding: 6px 0;
          opacity: 0.9;
          font-size: 0.9rem;
          line-height: 1.4;
        }
        
        .pattern-info strong {
          color: #ffd700;
          font-weight: 600;
        }
        
        .systems-thinking {
          background: rgba(255, 255, 255, 0.1);
          padding: 15px;
          border-radius: 10px;
          margin-top: 15px;
        }
        
        .systems-thinking h4 {
          margin: 0 0 10px 0;
          font-size: 1rem;
          color: #ffd700;
        }
        
        .systems-thinking p {
          margin: 5px 0;
          font-size: 0.85rem;
          opacity: 0.9;
        }
        
        @media (max-width: 768px) {
          .pattern-info {
            padding: 20px;
          }
          
          .pattern-info h3 {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
}
