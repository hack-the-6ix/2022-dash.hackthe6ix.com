import { createContext, useContext } from 'react';

// TODO: User typing as needed
export type User = any;

export type BaseAuthContext = {
  setAuth: (token: string, refreshToken: string) => Promise<void>;
  refreshAuth: () => Promise<string | void>;
  revokeAuth: () => Promise<void>;
  isReady: boolean;
};

export type UnAuthenticatedAuthContext = {
  isAuthenticated: false;
  isRefreshing: boolean;
} & (
  | {
      isAuthenticating: true;
      refreshToken: string;
      token: string;
    }
  | {
      isAuthenticating: false;
    }
);

export type AuthenticatedAuthContext = {
  isAuthenticating: false;
  isAuthenticated: true;
  isRefreshing: boolean;
  refreshToken: string;
  token: string;
  user: User;
};

export type AuthContext = BaseAuthContext &
  (AuthenticatedAuthContext | UnAuthenticatedAuthContext);

export const AuthenticationContext = createContext<AuthContext>({
  refreshAuth: async () => {},
  revokeAuth: async () => {},
  setAuth: async () => {},
  isAuthenticating: false,
  isAuthenticated: false,
  isRefreshing: false,
  isReady: false,
});

export function useAuth() {
  return useContext(AuthenticationContext);
}

export default useAuth;
