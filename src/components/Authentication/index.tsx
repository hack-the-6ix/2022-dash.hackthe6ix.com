import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import {
  TokenController,
  useRequest,
  ServerResponse,
} from '../../utils/useRequest';
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
  >(() => {
    const { refreshToken, token } = TokenController.get();
    if (refreshToken && token) {
      return {
        isAuthenticating: true,
        isAuthenticated: false,
        isRefreshing: false,
        refreshToken,
        token,
      };
    } else {
      return {
        isAuthenticating: false,
        isAuthenticated: false,
        isRefreshing: false,
      };
    }
  });

  const { makeRequest: refresh } = useRequest<
    ServerResponse<{
      refreshToken: string;
      token: string;
    }>
  >(`/auth/${process.env.REACT_APP_API_AUTH_PROVIDER}/refresh`, {
    useLocalStorage: true,
  });
  const { makeRequest: logout } = useRequest(
    `/auth/${process.env.REACT_APP_API_AUTH_PROVIDER}/logout`,
    { useLocalStorage: true }
  );
  const { makeRequest: getProfile, abort: cancelGetProfile } = useRequest(
    '/api/action/profile',
    { useLocalStorage: true }
  );
  const _state = useRef(state);
  _state.current = state;

  useEffect(() => {
    if (!state.isAuthenticating) return;
    let mounted = true;

    // TODO: Add fetch request for user
    getProfile().then((res) => {
      console.log(res);
      if (!mounted) return;
      // @ts-ignore
      setState((_state) => ({
        ..._state,
        isAuthenticating: false,
        isAuthenticated: true,
        user: {},
      }));
    });
    return () => {
      mounted = false;
    };
  }, [getProfile, state.isAuthenticating]);

  const revokeAuth = useCallback(async () => {
    if (_state.current.isAuthenticating) {
      console.warn('User authentication in progress. Cancelling...');
      cancelGetProfile();
    }

    if (_state.current.isAuthenticated) {
      await logout({
        method: 'POST',
        body: JSON.stringify({
          refreshToken: _state.current.refreshToken,
        }),
      });
    }

    TokenController.clear();
    setState({
      isAuthenticating: false,
      isAuthenticated: false,
      isRefreshing: false,
    });
  }, [cancelGetProfile, logout]);

  const setAuth = useCallback(
    async (token: string, refreshToken: string) => {
      if (_state.current.isAuthenticated) return;
      if (_state.current.isAuthenticating) await await revokeAuth();

      TokenController.set({ token, refreshToken });
      setState({
        isAuthenticating: true,
        isAuthenticated: false,
        isRefreshing: false,
        refreshToken,
        token,
      });
    },
    [revokeAuth]
  );

  const refreshAuth = useCallback(async () => {
    if (_state.current.isAuthenticating) {
      console.warn('User authentication in progress. Is this a mistake?');
      return;
    }

    if (!_state.current.isAuthenticated) {
      console.warn('User is not authenticated. There is nothing to refresh...');
      return;
    }

    const res = await refresh({
      method: 'POST',
      body: JSON.stringify({
        refreshToken: _state.current?.refreshToken,
      }),
    });

    if (res?.status !== 200) {
      console.warn('Unable to refresh auth. Logging user out');
      await revokeAuth();
      return;
    }

    TokenController.set(res.message);
    setState((_state) => ({ ..._state, ...res.message }));
    return res.message;
  }, [refresh, revokeAuth]);

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
