import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { isTelegram } from '@/lib/api';

export interface TelegramLoginData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface AuthState {
  token: string | null;
  user: TelegramLoginData | null;
}

interface AuthContextValue {
  token: string | null;
  user: TelegramLoginData | null;
  isAuthenticated: boolean;
  login: (data: TelegramLoginData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'web_auth_token';
const USER_KEY = 'web_auth_user';

function loadState(): AuthState {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(USER_KEY);
    const user = raw ? JSON.parse(raw) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(loadState);

  useEffect(() => {
    if (state.token) {
      localStorage.setItem(TOKEN_KEY, state.token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    if (state.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(state.user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [state]);

  const login = useCallback(async (data: TelegramLoginData) => {
    const WEB_URL = import.meta.env.VITE_API_WEB_URL;
    const response = await fetch(`${WEB_URL}/auth/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(body.message || 'Login failed');
    }

    const json = await response.json();
    const result = json.data ?? json;
    setState({ token: result.token, user: data });
  }, []);

  const logout = useCallback(() => {
    setState({ token: null, user: null });
  }, []);

  const isAuthenticated = isTelegram() || !!state.token;

  return (
    <AuthContext.Provider value={{ token: state.token, user: state.user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function getWebToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
