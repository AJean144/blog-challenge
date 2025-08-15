'use client';

import { useBlogObserver } from '@/hooks/useBlogObserver';

export default function ActivityFeed() {
  const { activities } = useBlogObserver();

  return (
    <div className="activity-feed">
      <h3>🔴 Live Activity Feed</h3>
      {activities.length === 0 ? (
        <p className="no-activity">No recent activity</p>
      ) : (
        <ul>
          {activities.map(activity => (
            <li key={activity.id}>
              <span className="activity-text">{activity.text}</span>
              <span className="activity-time">
                {new Date(activity.timestamp).toLocaleTimeString()}
              </span>
            </li>
          ))}
        </ul>
      )}
      
      <style jsx>{`
        .activity-feed {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }
        
        .activity-feed h3 {
          margin: 0 0 20px 0;
          color: #333;
          font-size: 1.3rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .activity-feed ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .activity-feed li {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 12px 0;
          border-bottom: 1px solid #f7fafc;
          animation: fadeIn 0.3s ease-in;
        }
        
        .activity-feed li:last-child {
          border-bottom: none;
        }
        
        .activity-feed li:first-child {
          background: linear-gradient(90deg, #f0fff4 0%, transparent 100%);
          margin: 0 -15px;
          padding: 12px 15px;
          border-radius: 8px;
        }
        
        .activity-text {
          color: #333;
          font-size: 0.9rem;
          flex: 1;
          line-height: 1.4;
        }
        
        .activity-time {
          color: #666;
          font-size: 0.8rem;
          white-space: nowrap;
          margin-left: 10px;
          font-weight: 500;
        }
        
        .no-activity {
          color: #666;
          font-style: italic;
          text-align: center;
          padding: 30px 20px;
          background: #f8f9ff;
          border-radius: 8px;
          margin: 0;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          .activity-feed li {
            flex-direction: column;
            gap: 5px;
          }
          
          .activity-time {
            margin-left: 0;
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
}