'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { User } from '@/types/User';

interface SignupResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  user: User | null | undefined;
  login: (email: string, password: string) => Promise<SignupResponse>;
  signup: (
    email: string,
    password: string,
    name: string,
    jobTitle: string
  ) => Promise<SignupResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setUser(null);
        return;
      }

      await axios
        .get('/api/validate_user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data.user);
        })
        .catch((e) => {
          setUser(null);
          // localStorage.removeItem('token');
        });
    };

    fetchUser();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<SignupResponse> => {
    return axios
      .post<SignupResponse>('/api/login', {
        email,
        password,
      })
      .then((response) => {
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        setUser(user);

        return response.data;
      });
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    jobTitle: string
  ): Promise<SignupResponse> => {
    return axios
      .post<SignupResponse>('/api/signup', {
        email,
        password,
        name,
        jobTitle,
      })
      .then((response) => {
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        setUser(user);

        return response.data;
      });
  };

  const logout = () => {
    // localStorage.removeItem("token");
    setUser(undefined);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
