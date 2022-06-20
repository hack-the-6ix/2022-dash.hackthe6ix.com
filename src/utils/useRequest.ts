import { useCallback, useRef, useState } from 'react';
import { useAuth } from '../components/Authentication/context';

export function request(path: string, payload?: RequestInit) {
  return fetch(`${process.env.REACT_APP_API_URL}${path ?? ''}`, {
    ...payload,
    headers: {
      ...payload?.headers,
      'content-type': 'application/json',
    },
  });
}

type UseRequestOptions<T> = {
  payload?: RequestInit;
  debounce?: boolean;
  initData?: T;
};

/**
 * API hook for making requests. ONE REQUEST PER HOOK as we have additional
 * logic for dealing with making requests which are already outbound
 * @param path string - The endpoint of the api (Host set by ENV)
 * @param payload RequestInit - Default request stuff
 */
export function useRequest<T>(
  path: string,
  options: UseRequestOptions<T> = {}
) {
  const { initData, payload, debounce = true } = options;
  const controller = useRef<AbortController>();
  const authContext = useAuth();

  const [state, setState] = useState<{ data?: T; isLoading: boolean }>({
    isLoading: false,
    data: initData,
  });

  const makeRequest = useCallback(
    async (_payload?: RequestInit) => {
      // Clean up stuff
      if (state.isLoading) {
        console.warn(`Request to ${path} is already in progress`);
        if (debounce) return;
        controller.current?.abort();
      }

      // Setup request overhead stuff
      controller.current = new AbortController();
      setState({ isLoading: true });

      // Make request
      const res = await request(path, {
        ...payload,
        ..._payload,
        headers: {
          ...payload?.headers,
          ..._payload?.headers,
          ...(authContext.isAuthenticated
            ? {
                authorization: `bearer ${authContext.token}`,
              }
            : {}),
        },
        signal: controller.current.signal,
      });

      // Done
      setState({
        data: await res.json(),
        isLoading: false,
      });
    },
    [state.isLoading, authContext.isAuthenticated]
  );

  return {
    makeRequest,
  };
}
