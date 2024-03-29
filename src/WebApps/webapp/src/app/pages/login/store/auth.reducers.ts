import { createReducer, on } from '@ngrx/store'
import { User } from '../model/user.model'
import { login, loginError, loginSuccess, logout } from './auth.actions'

export interface AuthState {
  user: User
  errorOnLogin?: boolean
}

export const initialAuthState: AuthState = {
  user: undefined,
}

export const authReducer = createReducer(
  initialAuthState,

  on(login, (state, { userName: username, password }) => ({
    user: null,
  })),

  on(loginSuccess, (state, { user }) => ({
    user: user,
  })),

  on(loginError, (state, { errorOnLogin }) => {
    return {
      ...state,
      user: undefined,
      errorOnLogin: errorOnLogin,
    }
  }),

  on(logout, (state, action) => ({
    user: undefined,
    errorOnLogin: undefined,
  })),
)
