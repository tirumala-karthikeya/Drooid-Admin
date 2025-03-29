
import { toast } from '@/hooks/use-toast';
import apiClient from './apiClient';

// Create a mechanism to test the connection to the API server
const testConnection = async () => {
  try {
    await apiClient.get('/stats');
    console.log('API server connection successful');
    return true;
  } catch (error) {
    console.error('Failed to connect to API server:', error);
    toast({
      title: 'Connection Error',
      description: 'Failed to connect to the API server',
      variant: 'destructive'
    });
    return false;
  }
};

// Initialize connection test on service start
testConnection();

export default {
  testConnection
};
