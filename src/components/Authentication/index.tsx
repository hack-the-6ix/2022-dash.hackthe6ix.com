import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import {
  AuthenticatedAuthContext,
  UnAuthenticatedAuthContext,
  AuthenticationContext,
} from './context';

export interface AuthenticationProviderProps {
  children: ReactNode;
}

export default function AuthenticationProvider({
  children,
}: AuthenticationProviderProps) {
  const [state, setState] = useState<
    AuthenticatedAuthContext | UnAuthenticatedAuthContext
  >({
    isAuthenticating: false,
    isAuthenticated: false,
    isRefreshing: true,
  });
  // const refreshController = useRef<AbortController>();
  const authController = useRef<AbortController>();

  useEffect(() => {
    if (!state.isAuthenticating) return;
    authController.current = new AbortController();
    let mounted = true;

    // TODO: Add fetch request for user
    if (!mounted) return;
    setState({
      ...state,
      isAuthenticating: false,
      isAuthenticated: true,
      user: {},
    });

    return () => {
      authController.current?.abort();
      mounted = false;
    };
  }, [state]);

  const revokeAuth = useCallback(async () => {
    if (state.isAuthenticating) {
      console.warn('User authentication in progress. Cancelling...');
    }

    if (!state.isAuthenticated) {
      console.warn('User is not authenticated. Is this a mistake?');
    }

    setState({
      isAuthenticating: false,
      isAuthenticated: false,
      isRefreshing: false,
    });
  }, [state.isAuthenticating, state.isAuthenticated]);

  const setAuth = useCallback(
    async (token: string, refreshToken: string) => {
      if (state.isAuthenticating) await revokeAuth();

      if (state.isAuthenticated) {
        console.warn(
          'User is already authenticated. Replacing authentication...'
        );
      }

      setState({
        isAuthenticating: true,
        isAuthenticated: false,
        isRefreshing: false,
        refreshToken,
        token,
      });
    },
    [state.isAuthenticating, state.isAuthenticated, revokeAuth]
  );

  const refreshAuth = useCallback(async () => {
    if (state.isAuthenticating) {
      console.warn('User authentication in progress. Is this a mistake?');
      return;
    }

    if (!state.isAuthenticated) {
      console.warn('User is not authenticated. Is this a mistake?');
      return;
    }

    // TODO: Add token refresh logic here
    // setState(_state => ({ ..._state, isRefreshing: true }));
  }, [state.isAuthenticating, state.isAuthenticated]);

  return (
    <AuthenticationContext.Provider
      value={{
        ...state,
        isReady: !state.isAuthenticating && !state.isRefreshing,
        refreshAuth,
        revokeAuth,
        setAuth,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
