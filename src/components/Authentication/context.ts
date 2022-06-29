import { createContext, useContext } from 'react';

// TODO: User typing as needed
export type User = {
  computedApplicationDeadline: number;
  computedRSVPDeadline: number;
  created: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  hackerApplication: any; // TODO: Typing for this
  roles: {
    hacker: boolean;
    admin: boolean;
    organizer: boolean;
    volunteer: boolean;
  };
  status: {
    textStatus: string;
    accepted: boolean;
    applicationExpired: boolean;
    applied: boolean;
    canAmendTeam: boolean;
    canApply: boolean;
    canRSVP: boolean;
    checkedIn: boolean;
    confirmed: boolean;
    declined: boolean;
    isRSVPOpen: boolean;
    rejected: boolean;
    rsvpExpired: boolean;
    waitlisted: boolean;
  };
  _id: string;
};

export type BaseAuthContext = {
  setAuth: (token: string, refreshToken: string) => Promise<void>;
  refreshAuth: () => Promise<{ token: string; refreshToken: string } | void>;
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
  isReady: true,
});

export function useAuth() {
  return useContext(AuthenticationContext);
}

export default useAuth;
