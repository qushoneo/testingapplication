"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Add the useRouter for redirection
import { User } from "@/types/User";

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
  const router = useRouter(); // Use router for redirection

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        return;
      }

      try {
        const response = await axios.get("/api/validate_user", {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        });
        setUser(response.data.user);
      } catch {
        setUser(null); // In case of an error, set user to null (e.g. invalid token)
      }
    };

    fetchUser();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<SignupResponse> => {
    try {
      const response = await axios.post<SignupResponse>("/api/login", {
        email,
        password,
      });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      setUser(user);

      return response.data;
    } catch (error) {
      throw new Error("Login failed");
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    jobTitle: string
  ): Promise<SignupResponse> => {
    try {
      const response = await axios.post<SignupResponse>("/api/signup", {
        email,
        password,
        name,
        jobTitle,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      setUser(user);

      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error("Signup failed");
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(undefined);
    router.push("/login");
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
