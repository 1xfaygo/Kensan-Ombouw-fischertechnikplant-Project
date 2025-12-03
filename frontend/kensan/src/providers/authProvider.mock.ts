import { AuthProvider } from "@refinedev/core";

/**
 * MOCK AUTH PROVIDER - Voor testen zonder backend
 * 
 * Deze versie accepteert elke email/wachtwoord combinatie
 * Verander later naar authProvider.ts wanneer je een echte backend hebt
 */

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    if (email && password) {
      const mockUser = {
        id: 1,
        name: email.split('@')[0],
        email: email,
        role: 'admin'
      };
      
      localStorage.setItem("auth_token", "mock-token-" + Date.now());
      localStorage.setItem("user", JSON.stringify(mockUser));
      
      return {
        success: true,
        redirectTo: "/",
      };
    }
    
    return {
      success: false,
      error: {
        name: "LoginError",
        message: "Vul email en wachtwoord in",
      },
    };
  },

  logout: async () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    const token = localStorage.getItem("auth_token");
    
    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
      logout: true,
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
    console.error("Auth error:", error);
    return { error };
  },
};
