import axios from "axios";

// Define the API URL
const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/auth`;

interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  message: string;
}

// Login service
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/login`, { 
      email, 
      password
    }, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Register service
export const registerUser = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/register`, { name, email, password }, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Logout service
export const logoutUser = async () => {
  try {
    await axios.post(`${API_URL}/logout`, {}, {
      withCredentials: true
    });
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

// Password reset request service
export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    // For demo purposes - this would normally call your backend
    if (email) {
      return Promise.resolve();
    }
    
    // Uncomment when connecting to real backend
    // await axios.post(`${API_URL}/forgot-password`, { email });
    
    throw new Error("Password reset request failed");
  } catch (error) {
    console.error("Password reset request error:", error);
    throw error;
  }
};

// Verify authentication
export const verifyAuth = async (): Promise<AuthResponse> => {
  try {
    const response = await axios.get(`${API_URL}/verify`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Auth verification error:", error);
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    await verifyAuth();
    return true;
  } catch (error) {
    return false;
  }
};

// Get the authenticated user
export const getAuthenticatedUser = async () => {
  try {
    const response = await verifyAuth();
    return response.user;
  } catch (error: any) {
    // If it's a 401 error, just return null (user not authenticated)
    if (error.response?.status === 401) {
      return null;
    }
    // For other errors, log them and return null
    console.error("Get user error:", error);
    return null;
  }
};
