import { AuthProvider } from "@refinedev/core";
import axios from "axios";

const API_URL = "http://localhost:3000/api";

axios.defaults.withCredentials = true;

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      console.log('Attempting login for:', email);
      
      const { data } = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      console.log('Login response:', data);

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log('Login successful, user stored');
        
        return {
          success: true,
          redirectTo: "/",
        };
      }

      console.error('Login failed:', data.message);
      
      return {
        success: false,
        error: {
          name: "LoginError",
          message: "Invalid email or password",
        },
      };
    } catch (error: any) {
      console.error('Login error:', {
        message: error?.response?.data?.message,
        status: error?.response?.status,
        data: error?.response?.data
      });
      
      return {
        success: false,
        error: {
          name: "LoginError",
          message: error?.response?.data?.message || "Invalid email or password",
        },
      };
    }
  },

  logout: async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (error) {
      console.error("Logout error:", error);
    }
    
    localStorage.removeItem("user");
    
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    const user = localStorage.getItem("user");
    
    if (user) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
      logout: false,
    };
  },

  getPermissions: async () => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.role || null;
    }
    return null;
  },

  getIdentity: async () => {
    const user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }
    return null;
  },

  onError: async (error) => {
    if (error.status === 401 || error.status === 403) {
      return {
        logout: true,
        redirectTo: "/login",
        error,
      };
    }

    return { error };
  },
};
