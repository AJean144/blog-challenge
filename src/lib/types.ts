export interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: number;
  text: string;
  createdAt: string;
}

export interface Observer {
  update: (eventType: BlogEventType, data: any) => void;
  id?: string;
}

export type BlogEventType = 
  | 'POST_ADDED' 
  | 'POST_LIKED' 
  | 'COMMENT_ADDED' 
  | 'POST_DELETED'
  | 'POSTS_LOADED';

export interface Activity {
  id: number;
  text: string;
  timestamp: string;
  type: BlogEventType;
}