import { createAction, props } from '@ngrx/store'
import { User } from '../model/user.model'

export const login = createAction(
  '[Login Page] User Login',
  props<{ username: string; password: string }>(),
)

export const loginSuccess = createAction(
  '[Login Page] User Login Success',
  props<{ user: User }>(),
)

export const loginError = createAction(
  '[Login Page] User Login Failure',
  props<{ error: any }>(),
)

export const logout = createAction('[Top Menu] Logout')
