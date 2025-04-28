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
  profilePicture?: string; // Added profilePicture property
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
  signInWithProvider: (provider: string) => Promise<void>;
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
      // Check if it's the first app launch
      checkInitialLaunch();
    }
  }, [user, isInitialized]);

  // Check if this is the first time launching the app
  const checkInitialLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem("@app_has_launched");

      if (!hasLaunched) {
        // First time user, show onboarding
        console.log("First launch, redirecting to onboarding");
        router.replace("/onboarding/welcome");
        return;
      }

      if (!user) {
        // No user, go to sign-in
        console.log("No user authenticated, redirecting to sign-in");
        router.replace("/auth/signin");
      } else if (user && !user.isVerified) {
        // User needs verification
        console.log("User needs verification, redirecting");
        router.replace("/auth/verification");
      } else if (user && user.isVerified) {
        // User is verified, check if they've completed onboarding
        const hasCompletedOnboarding = await AsyncStorage.getItem(
          "@has_completed_onboarding"
        );

        if (hasCompletedOnboarding === "true") {
          // User has completed onboarding, go to main app
          console.log(
            "User authenticated and completed onboarding, redirecting to main app"
          );
          router.replace("/(tabs)");
        } else {
          // User needs to complete onboarding
          console.log("User authenticated but needs to complete onboarding");
          router.replace("/onboarding/interests");
        }
      }
    } catch (error) {
      console.error("Error checking initial launch:", error);
      // Default to sign-in on error
      router.replace("/auth/signin");
    }
  };

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

        // Check if user has completed onboarding
        const hasCompletedOnboarding = await AsyncStorage.getItem(
          "@has_completed_onboarding"
        );
        if (hasCompletedOnboarding !== "true") {
          // If user hasn't completed onboarding, send them there
          router.replace("/onboarding/interests");
        }
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

  const signInWithProvider = async (provider: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // This is a mock implementation. In a real app, you'd integrate with Firebase, Auth0, etc.
      console.log(`Signing in with ${provider}...`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful login
      setUser({
        id: 'social-user-123',
        email: `user_${Math.random().toString(36).substring(2, 8)}@example.com`,
        fullName: 'Social User',
        isVerified: true,
        profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
      });
      
      // Store authentication token
      await AsyncStorage.setItem('@auth_token', 'social_mock_token');
    } catch (err) {
      setError(`Failed to sign in with ${provider}. Please try again.`);
      console.error(err);
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
    signInWithProvider,
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
