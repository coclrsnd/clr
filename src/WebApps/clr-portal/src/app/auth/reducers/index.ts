import { createReducer, on } from "@ngrx/store";
import { User } from "../model/user.model";
import { AuthActions } from "../action-types";
export const AUTH_KEY = "auth";
export interface AuthState {
  user: User;
  errorOnLogin?: boolean;
}

export const initialAuthState: AuthState = {
  user: undefined,
};

export const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.login, (state, { userName: username, password }) => ({
    ...state,
    user: null,
    errorOnLogin: undefined,
  })),

  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user: user,
  })),

  on(AuthActions.loginError, (state, { errorOnLogin }) => {
    return {
      ...state,
      user: undefined,
      errorOnLogin: errorOnLogin,
    };
  }),

  on(AuthActions.logout, (state, action) => ({
    user: undefined,
    errorOnLogin: undefined,
  })),
);
