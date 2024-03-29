import { createAction, props } from '@ngrx/store'
import { SignUp } from '../model/signup.model'

export const signup = createAction(
  '[Sign Up] Signup new user',
  props<{ signupRequest: SignUp }>(),
)

export const signupSuccess = createAction('[Sign Up] Signup new user success')

export const signupError = createAction('[Sign Up] Signup new user error')
