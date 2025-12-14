import axios from "axios";

// Get API URL from environment or use default
const getApiUrl = () => {
  // Check for VITE_API_URL first (Vite environment variable)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.endsWith('/api') 
      ? import.meta.env.VITE_API_URL 
      : `${import.meta.env.VITE_API_URL}/api`;
  }
  
  // Fallback for production - try to detect if we're on a deployed frontend
  // If window.location exists, we can construct the API URL
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // If it's localhost, use local backend
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5001/api';
    }
    // Otherwise, try to construct from current origin (for same-domain deployments)
    // Or use a default production URL
    return `${window.location.protocol}//${hostname}/api`;
  }
  
  // Final fallback
  return 'http://localhost:5001/api';
};

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout
});

api.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Better error handling
    if (error.response) {
      // Server responded with error
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("last_recommendations");
        // Only redirect if we're not already on login page
        if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
          window.location.href = "/login";
        }
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network error - no response from server:", error.request);
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
