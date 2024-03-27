import { createReducer, on } from '@ngrx/store'
import { User } from '../model/user.model'
import { AuthActions } from './action-types'

export interface AuthState {
  user: User
}

export const initialAuthState: AuthState = {
  user: undefined,
}

export const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.login, (state, { username, password }) => {
    return {
      user: undefined,
    }
  }),

  on(AuthActions.loginSuccess, (state, { user }) => {
    return {
      user: user,
    }
  }),

  on(AuthActions.logout, (state, action) => {
    return {
      user: undefined,
    }
  }),
)
