import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  config => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  response => {
    console.log(`API Response: ${response.status} for ${response.config.url}`);
    return response;
  },
  error => {
    console.error('API Response Error:', error);
    return Promise.reject(error);
  }
);

export const getStats = async () => {
  const response = await apiClient.get('/stats');
  return response.data;
};

export const getPosts = async () => {
  const response = await apiClient.get('/posts');
  return response.data;
};

export const getComments = async () => {
  const response = await apiClient.get('/comments');
  return response.data;
};

export const deletePost = async (id: number) => {
  const response = await apiClient.delete(`/posts/${id}`);
  return response.data;
};

export const deleteComment = async (id: number) => {
  const response = await apiClient.delete(`/comments/${id}`);
  return response.data;
};

export default apiClient;
