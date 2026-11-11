import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/api/client';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [initialized, setInitialized] = useState(false);

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: User }>('/auth/me');
      return data.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!isLoading) {
      setInitialized(true);
    }
  }, [isLoading]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post<{ success: boolean; data: { user: User } }>('/auth/login', {
      email,
      password,
    });
    queryClient.setQueryData(['auth', 'me'], data.data.user);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      queryClient.setQueryData(['auth', 'me'], null);
      queryClient.clear();
    }
  };

  const value: AuthContextType = {
    user: isError ? null : user ?? null,
    isLoading: !initialized || isLoading,
    isAuthenticated: !!user && !isError,
    login,
    logout,
    refetchUser: () => refetch(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
