import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

// Define User type
type User = {
  id: string;
  email: string;
  fullName?: string;
  isVerified: boolean;
  createdAt?: string;
};

// Auth context type definition
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  verifyOTP: (code: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Storage keys
const USER_STORAGE_KEY = "user_data";

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved user data when component mounts
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    loadUser();
  }, []);

  // Handle auth state changes for routing
  useEffect(() => {
    // Only handle routing after the initial load is complete
    if (isInitialized) {
      if (!user) {
        // No user, go to sign-in
        console.log("No user authenticated, redirecting to sign-in");
        router.replace("/auth/signin");
      } else if (user && !user.isVerified) {
        // User needs verification
        console.log("User needs verification, redirecting");
        router.replace("/auth/verification");
      } else if (user && user.isVerified) {
        // User is fully authenticated
        console.log("User authenticated, redirecting to main app");
        router.replace("/(tabs)");
      }
    }
  }, [user, isInitialized]);

  // Save user data to storage
  const saveUser = async (userData: User | null) => {
    try {
      if (userData) {
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      } else {
        await AsyncStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Failed to save user data:", error);
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // For demo purposes, we're simulating a successful login
      if (email && password) {
        const userData: User = {
          id: "12345",
          email,
          isVerified: false, // Set to false to trigger verification flow
          fullName: "Demo User",
        };

        await saveUser(userData);
        setUser(userData);
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // For demo purposes, we're simulating a successful registration
      if (email && password && name) {
        const userData: User = {
          id: "12345",
          email,
          fullName: name,
          isVerified: false,
          createdAt: new Date().toISOString(),
        };

        await saveUser(userData);
        setUser(userData);
      } else {
        throw new Error("Please fill all required fields");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function - updated with proper navigation
  const signOut = async () => {
    setIsLoading(true);
    try {
      // Clear user data
      await saveUser(null);
      setUser(null);
      // Navigation will be handled by the useEffect
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP function
  const verifyOTP = async (code: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API verification
      if (user && code === "1234") {
        // Demo code for testing
        const verifiedUser = { ...user, isVerified: true };
        await saveUser(verifiedUser);
        setUser(verifiedUser);
      } else {
        throw new Error("Invalid verification code");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      if (!email) {
        throw new Error("Please enter your email");
      }

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Success - in a real app, no need to do anything else here
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const contextValue: AuthContextType = {
    user,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    verifyOTP,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook for using auth
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
