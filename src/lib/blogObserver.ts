import { BlogPost, Comment, Observer, BlogEventType, Activity } from './types';

/**
 * BlogSubject class implements the Subject part of the Observer pattern
 * This class manages the global blog state and notifies all registered observers
 * when state changes occur. It acts as a centralized state management system.
 */
class BlogSubject {
  // Set ensures each observer is registered only once and provides O(1) operations
  private observers = new Set<Observer>();
  
  // Array of all blog posts - the primary data store
  private posts: BlogPost[] = [];
  
  // Activity feed to track user actions for better UX
  private activities: Activity[] = [];

  // Observer Pattern Methods
  /**
   * Registers a new observer to receive notifications about blog state changes
   * Immediately sends current state to new observer for synchronization
   * @param observer - The observer object with an update method
   */
  subscribe(observer: Observer): void {
    this.observers.add(observer);
    console.log(`Observer subscribed. Total: ${this.observers.size}`);
    
    // Immediately notify new observer of current state to keep it synchronized
    // This ensures components don't start with stale/empty data
    observer.update('POSTS_LOADED', this.posts);
  }

  /**
   * Removes an observer from the notification list
   * Essential for preventing memory leaks when components unmount
   * @param observer - The observer to remove
   */
  unsubscribe(observer: Observer): void {
    this.observers.delete(observer);
    console.log(`Observer unsubscribed. Total: ${this.observers.size}`);
  }

  /**
   * Central notification method that updates all registered observers
   * Also handles activity logging and error handling for observer updates
   * @param eventType - Type of event that occurred (POST_ADDED, POST_LIKED, etc.)
   * @param data - Event-specific data to pass to observers
   */
  private notify(eventType: BlogEventType, data: any): void {
    console.log(`Notifying ${this.observers.size} observers of ${eventType}`);
    
    // Add to activity log for user feedback
    this.addActivity(eventType, data);
    
    // Notify all observers with error handling to prevent one broken observer
    // from affecting others
    this.observers.forEach(observer => {
      try {
        observer.update(eventType, data);
      } catch (error) {
        console.error('Observer update failed:', error);
      }
    });
  }

  /**
   * Creates human-readable activity entries for the activity feed
   * Converts technical events into user-friendly messages with emojis
   * @param eventType - The type of blog event that occurred
   * @param data - Event-specific data containing details like post title, author, etc.
   */
  private addActivity(eventType: BlogEventType, data: any): void {
    let activityText = '';
    
    // Convert technical event types into user-friendly messages
    switch(eventType) {
      case 'POST_ADDED':
        activityText = `📝 New post: "${data.title}" by ${data.author}`;
        break;
      case 'POST_LIKED':
        activityText = `❤️ Post received a like (${data.likes} total)`;
        break;
      case 'COMMENT_ADDED':
        activityText = `💬 New comment added`;
        break;
      case 'POST_DELETED':
        activityText = `🗑️ Post deleted`;
        break;
      default:
        // Skip activity creation for events like POSTS_LOADED (system events)
        return;
    }

    const activity: Activity = {
      id: Date.now(), // Simple ID generation using timestamp
      text: activityText,
      timestamp: new Date().toISOString(),
      type: eventType
    };

    // Add to beginning of array for newest-first ordering
    this.activities.unshift(activity);
    // Keep only last 10 activities to prevent memory bloat
    this.activities = this.activities.slice(0, 10);
  }

  // Blog Operations - Public methods for modifying blog state
  /**
   * Creates a new blog post and notifies all observers
   * Uses Omit utility type to ensure caller doesn't provide auto-generated fields
   * @param postData - Post data with title, content, and author
   * @returns The complete BlogPost object with generated fields
   */
  addPost(postData: Omit<BlogPost, 'id' | 'createdAt' | 'likes' | 'comments'>): BlogPost {
    // Create complete post object with auto-generated fields
    const newPost: BlogPost = {
      id: Date.now(), // Simple ID generation - timestamp ensures uniqueness
      ...postData, // Spread user-provided data
      createdAt: new Date().toISOString(), // ISO timestamp for consistency
      likes: 0, // New posts start with 0 likes
      comments: [] // New posts start with empty comments array
    };

    // Add to beginning of posts array for newest-first ordering
    this.posts.unshift(newPost);
    
    // Notify all observers that a new post was added
    this.notify('POST_ADDED', newPost);
    
    // Persist to localStorage for data persistence across browser sessions
    // Check window exists to avoid SSR issues
    if (typeof window !== 'undefined') {
      this.savePosts();
    }
    
    return newPost;
  }

  /**
   * Increments the like count for a specific post
   * Finds post by ID, updates like count, and notifies observers
   * @param postId - The ID of the post to like
   */
  likePost(postId: number): void {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.likes++; // Increment like counter
      
      // Notify observers with comprehensive data for UI updates
      this.notify('POST_LIKED', { postId, likes: post.likes, post });
      
      // Persist changes to localStorage
      if (typeof window !== 'undefined') {
        this.savePosts();
      }
    }
  }

  /**
   * Adds a new comment to a specific post
   * Creates comment object with auto-generated fields and adds to post
   * @param postId - The ID of the post to comment on
   * @param commentText - The text content of the comment
   */
  addComment(postId: number, commentText: string): void {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      // Create new comment with auto-generated metadata
      const newComment: Comment = {
        id: Date.now(), // Unique ID using timestamp
        text: commentText,
        createdAt: new Date().toISOString()
      };
      
      // Add comment to the end of the comments array (chronological order)
      post.comments.push(newComment);
      
      // Notify observers with comment and post data
      this.notify('COMMENT_ADDED', { postId, comment: newComment, post });
      
      // Persist changes to localStorage
      if (typeof window !== 'undefined') {
        this.savePosts();
      }
    }
  }

  /**
   * Removes a post from the blog entirely
   * Finds post by ID, removes from array, and notifies observers
   * @param postId - The ID of the post to delete
   */
  deletePost(postId: number): void {
    const postIndex = this.posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
      // Remove post from array and get reference to deleted post
      const deletedPost = this.posts.splice(postIndex, 1)[0];
      
      // Notify observers with deletion details
      this.notify('POST_DELETED', { postId, post: deletedPost });
      
      // Persist changes to localStorage
      if (typeof window !== 'undefined') {
        this.savePosts();
      }
    }
  }

  // Data Access - Public methods for reading blog state
  /**
   * Returns a copy of all blog posts to prevent direct mutation
   * Uses spread operator to create shallow copy for immutability
   * @returns Array of all blog posts
   */
  getPosts(): BlogPost[] {
    return [...this.posts];
  }

  /**
   * Returns a copy of all activities for the activity feed
   * Uses spread operator to prevent external mutation of internal state
   * @returns Array of recent activities
   */
  getActivities(): Activity[] {
    return [...this.activities];
  }

  /**
   * Calculates and returns aggregate statistics about the blog
   * Useful for dashboard displays and analytics
   * @returns Object containing totalPosts, totalLikes, and totalComments
   */
  getStats() {
    const totalPosts = this.posts.length;
    // Sum all likes across all posts using reduce
    const totalLikes = this.posts.reduce((acc, post) => acc + post.likes, 0);
    // Sum all comments across all posts using reduce
    const totalComments = this.posts.reduce((acc, post) => acc + post.comments.length, 0);
    
    return { totalPosts, totalLikes, totalComments };
  }

  // Persistence (Client-side only) - Methods for data persistence across sessions
  /**
   * Saves current posts to localStorage for persistence across browser sessions
   * Private method called automatically after state changes
   * Includes error handling for quota exceeded or other localStorage issues
   */
  private savePosts(): void {
    try {
      // Serialize posts array to JSON string for localStorage storage
      localStorage.setItem('blog-posts', JSON.stringify(this.posts));
    } catch (error) {
      // Handle cases like quota exceeded, privacy mode, etc.
      console.error('Failed to save posts:', error);
    }
  }

  /**
   * Loads saved posts from localStorage and notifies observers
   * Called during initialization to restore previous session data
   * Public method to allow manual refresh of data
   */
  loadPosts(): void {
    // Guard against SSR - localStorage only exists in browser
    if (typeof window === 'undefined') return;
    
    try {
      const saved = localStorage.getItem('blog-posts');
      if (saved) {
        // Parse JSON string back to posts array
        this.posts = JSON.parse(saved);
        // Notify observers that posts have been loaded
        this.notify('POSTS_LOADED', this.posts);
      }
    } catch (error) {
      // Handle corrupted data, JSON parse errors, etc.
      console.error('Failed to load posts:', error);
    }
  }

  // Development helpers - Methods to assist with development and testing
  /**
   * Adds sample blog posts for development and demonstration purposes
   * Creates educational content that explains the system architecture
   * Only used in development or when no existing posts are found
   */
  addSampleData(): void {
    const samplePosts = [
      {
        title: "Welcome to Systems Thinking Blog",
        content: "This blog demonstrates the Observer pattern in action. Every component automatically updates when the blog state changes, creating a responsive and maintainable system.",
        author: "System Admin"
      },
      {
        title: "Understanding Design Patterns",
        content: "Design patterns are reusable solutions to common programming problems. The Observer pattern is particularly useful for creating loosely coupled systems where multiple components need to react to state changes.",
        author: "Developer"
      }
    ];

    // Add each sample post using the standard addPost method
    // This ensures proper notification and persistence behavior
    samplePosts.forEach(post => this.addPost(post));
  }
}

/**
 * Singleton instance of BlogSubject - ensures single source of truth
 * Using singleton pattern guarantees all components share the same blog state
 * and observer notifications work consistently across the application
 */
const blogSubject = new BlogSubject();

/**
 * Initialization flag to ensure setup only happens once
 * Prevents multiple components from triggering initialization
 */
let isInitialized = false;

/**
 * Initialize the blog observer with data
 * Called by the useBlogObserver hook to ensure proper timing
 * Only runs once and only on the client side
 */
export function initializeBlog() {
  if (isInitialized || typeof window === 'undefined') {
    return;
  }
  
  isInitialized = true;
  
  // First, try to load any existing posts from localStorage
  blogSubject.loadPosts();
  
  // If no posts exist (new user or cleared storage), add sample data
  // This provides a good initial experience for development and demos
  if (blogSubject.getPosts().length === 0 && process.env.NODE_ENV === 'development') {
    blogSubject.addSampleData();
  }
}

// Export the singleton instance as the default export
// This ensures all imports get the same instance
export default blogSubject;