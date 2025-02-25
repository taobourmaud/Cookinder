import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {supabase} from "./supabase";

interface AuthContextType {
  isLoggedIn: boolean;
  loading: boolean;
  userId: string | null;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      setIsLoggedIn(!!userToken);
      setLoading(false);
    };
    checkLoginStatus();
  }, []);

  const signIn = async (token: string) => {
    await AsyncStorage.setItem('userToken', token);
    const { data } = await supabase.auth.getSession();
    if (data?.session?.user?.id) {
      setUserId(data.session.user.id);
    } else {
      setUserId(null);
    }
    setIsLoggedIn(true);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('userToken');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading, userId, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
