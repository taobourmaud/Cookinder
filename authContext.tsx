import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {supabase} from "./supabase";

interface UserMetadata {
  display_name?: string;
  [key: string]: any;
}

interface User {
  id: string;
  email: string | undefined;
  userMetadata: UserMetadata;
}

interface AuthContextType {
  isLoggedIn: boolean;
  loading: boolean;
  userData: User | null;
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
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user?.id) {
        setUserData({
          id: data.session.user.id,
          email: data.session.user.email,
          userMetadata: data.session.user.user_metadata,
        });
      }
      setIsLoggedIn(!!userToken);
      setLoading(false);
    };
    checkLoginStatus();
  }, []);

  const signIn = async (token: string) => {
    await AsyncStorage.setItem('userToken', token);
    const { data } = await supabase.auth.getSession();
    if (data?.session?.user?.id) {
      setUserData({
        id: data.session.user.id,
        email: data.session.user.email,
        userMetadata: data.session.user.user_metadata,
      });
    }
    setIsLoggedIn(true);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('userToken');
    setUserData(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading, userData, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
