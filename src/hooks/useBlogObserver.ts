/**
 * This directive ensures the hook runs on the client side only,
 * preventing server-side rendering issues with React hooks
 */
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import blogSubject, { initializeBlog } from '@/lib/blogObserver'; // Import the singleton blog observer subject and init function
import { BlogPost, Activity, Observer, BlogEventType } from '@/lib/types';

/**
 * Custom React hook that implements the Observer pattern to manage blog state
 * This hook provides a clean interface for components to interact with the blog system
 * while automatically handling subscriptions and state updates
 */
export function useBlogObserver() {
  // State to store all blog posts - updates when posts are added, deleted, or modified
  const [posts, setPosts] = useState<BlogPost[]>([]);
  
  // State to store activity feed - tracks all user actions like posts, likes, comments
  const [activities, setActivities] = useState<Activity[]>([]);
  
  // Loading state to show spinners/skeletons while initial data is being fetched
  const [isLoading, setIsLoading] = useState(true);
  
  // Ref to store the observer instance - needed for proper cleanup on unmount
  // Using ref ensures the observer reference persists across re-renders
  const observerRef = useRef<Observer | null>(null);

  // Create stable observer instance
  const observer = useCallback((): Observer => ({
    update: (eventType: BlogEventType, data: any) => {
      console.log(`Component received ${eventType}:`, data);
      
      // Update posts state
      setPosts(blogSubject.getPosts());
      setActivities(blogSubject.getActivities());
      
      // Handle loading state
      if (eventType === 'POSTS_LOADED') {
        setIsLoading(false);
      }
    }
  }), []);

  useEffect(() => {
    const observerInstance = observer();
    observerRef.current = observerInstance;
    
    // Initialize blog data (only happens once, only on client)
    initializeBlog();
    
    // Subscribe to blog updates
    blogSubject.subscribe(observerInstance);
    
    // Set initial state from current blog data
    setPosts(blogSubject.getPosts());
    setActivities(blogSubject.getActivities());
    setIsLoading(false);

    // Cleanup subscription
    return () => {
      if (observerRef.current) {
        blogSubject.unsubscribe(observerRef.current);
      }
    };
  }, [observer]);

  // Blog operations
  const addPost = useCallback((postData: { title: string; content: string; author: string }) => {
    return blogSubject.addPost(postData);
  }, []);

  const likePost = useCallback((postId: number) => {
    blogSubject.likePost(postId);
  }, []);

  const addComment = useCallback((postId: number, comment: string) => {
    blogSubject.addComment(postId, comment);
  }, []);

  const deletePost = useCallback((postId: number) => {
    blogSubject.deletePost(postId);
  }, []);

  const stats = blogSubject.getStats();

  return {
    posts,
    activities,
    stats,
    isLoading,
    addPost,
    likePost,
    addComment,
    deletePost
  };
}