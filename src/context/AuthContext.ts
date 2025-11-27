import { createContext, type Dispatch } from "react";
import type { User } from "firebase/auth";

export type AuthState = {
  user: User | null;
  authIsReady: boolean;
};

export type AuthAction =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "AUTH_IS_READY"; payload: User | null };

export type AuthContextType = AuthState & {
  dispatch: Dispatch<AuthAction>;
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "AUTH_IS_READY":
      return { user: action.payload, authIsReady: true };
    default:
      return state;
  }
}
export const AuthContext = createContext<AuthContextType | null>(null);
