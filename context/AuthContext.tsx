
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '../types';
import * as authService from '../services/authService';

// Make Google and jwt_decode available from the window object after loading from CDN
declare global {
    interface Window { 
        google: any;
        jwt_decode: (token: string) => any;
    }
}

interface IAuthContext {
  user: User | null;
  token: string | null; // Token for authenticating API calls
  signIn: () => void;
  signOut: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

// Your Google Client ID
const GOOGLE_CLIENT_ID = "474815569807-bdronvmnbcu4aghsslr0esjoeq6d38uq.apps.googleusercontent.com";


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleGoogleCredentialResponse = useCallback((response: any) => {
    try {
      const idToken = response.credential;
      const decoded: any = window.jwt_decode(idToken);
      
      const newUser: User = {
        id: decoded.sub, // 'sub' is the user's unique Google ID
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture,
        tier: 'free', // All new sign-ups start on the free tier
      };

      // Store the user profile for UI persistence across reloads
      authService.setStoredUser(newUser);
      setUser(newUser);
      // Store the live token in state for immediate use in API calls
      setToken(idToken);
      console.log("Google Sign-In successful.");

    } catch (error) {
        console.error("Error decoding Google credential or setting user:", error);
    }
  }, []);

  useEffect(() => {
    // Check for a stored user session on initial load for faster UI display
    const storedUser = authService.getStoredUser();
    if (storedUser) {
        setUser(storedUser);
    }
    
    // Initialize Google Sign-In
    const initializeGSI = () => {
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleCredentialResponse,
                auto_select: true, // Attempts to sign in user automatically if they have a previous session
                use_fedcm_for_prompt: false, // Fix for FedCM NotAllowedError
            });
            setIsLoading(false);
        } else {
            // Retry if the script hasn't loaded yet
            setTimeout(initializeGSI, 100);
        }
    };
    
    initializeGSI();

  }, [handleGoogleCredentialResponse]);

  const signIn = useCallback(() => {
    if (window.google) {
      // This triggers the Google One Tap pop-up
      window.google.accounts.id.prompt();
    } else {
        console.error("Google Sign-In is not initialized.");
    }
  }, []);

  const signOut = useCallback(() => {
    if (window.google) {
        // Disables auto-login for the user on next visit
        window.google.accounts.id.disableAutoSelect();
    }
    authService.signOut();
    setUser(null);
    setToken(null); // Clear the token from state
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};