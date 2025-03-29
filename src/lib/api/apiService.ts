import { Post, Comment } from '@/types';
import { toast } from '@/hooks/use-toast';
import apiClient from './apiClient';

// Posts API
export const postsApi = {
  // Get all posts from MS SQL database via API
  getAllPosts: async (): Promise<Post[]> => {
    try {
      console.log('Fetching posts from server...');
      const response = await apiClient.get('/posts');
      console.log('Posts response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      toast({
        title: 'API Error',
        description: 'Failed to fetch posts from server',
        variant: 'destructive'
      });
      throw error;
    }
  },
  
  // Search posts by various criteria
  searchPosts: async (searchQuery: string, searchField?: string): Promise<Post[]> => {
    try {
      console.log('Searching posts with query:', searchQuery, 'field:', searchField);
      const params = new URLSearchParams();
      params.append('q', searchQuery);
      if (searchField) {
        params.append('field', searchField);
      }
      const response = await apiClient.get(`/posts/search?${params.toString()}`);
      console.log('Search response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to search posts:', error);
      toast({
        title: 'API Error',
        description: 'Failed to search posts from server',
        variant: 'destructive'
      });
      throw error;
    }
  },
  
  // Delete a post from MS SQL database via API
  deletePost: async (id: number): Promise<boolean> => {
    try {
      console.log('Deleting post:', id);
      const response = await apiClient.delete(`/posts/${id}`);
      const result = response.data;
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Post deleted successfully',
        });
        return true;
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to delete post',
          variant: 'destructive'
        });
        return false;
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast({
        title: 'API Error',
        description: 'Failed to delete post from server',
        variant: 'destructive'
      });
      return false;
    }
  }
};

// Comments API
export const commentsApi = {
  // Get all comments from MS SQL database via API
  getAllComments: async (): Promise<Comment[]> => {
    try {
      console.log('Fetching comments from server...');
      const response = await apiClient.get('/comments');
      console.log('Comments response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      toast({
        title: 'API Error',
        description: 'Failed to fetch comments from server',
        variant: 'destructive'
      });
      return [];
    }
  },
  
  // Delete a comment from MS SQL database via API
  deleteComment: async (id: number): Promise<boolean> => {
    try {
      console.log('Deleting comment:', id);
      const response = await apiClient.delete(`/comments/${id}`);
      const result = response.data;
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Comment deleted successfully',
        });
        return true;
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to delete comment',
          variant: 'destructive'
        });
        return false;
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast({
        title: 'API Error',
        description: 'Failed to delete comment from server',
        variant: 'destructive'
      });
      return false;
    }
  }
};
