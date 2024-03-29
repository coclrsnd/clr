import { createReducer, on } from '@ngrx/store'
import { signup, signupError, signupSuccess } from './signup.actions'
import { SignUp } from '../model/signup.model'

export interface SignupState {
  signupUser: SignUp
  isUserCreated: boolean
  errorOnSignup: boolean
}

export const initialSignupState: SignupState = {
  signupUser: undefined,
  isUserCreated: false,
  errorOnSignup: false,
}

export const signupReducer = createReducer(
  initialSignupState,
  on(signup, (state, { signupRequest }) => ({
    ...state,
    signupUser: signupRequest,
  })),

  on(signupSuccess, (state, action) => {
    // Check if the action type is signupSuccess
    return {
      ...state,
      isUserCreated: true,
      errorOnSignup: false,
    }
  }),

  on(signupError, (state, action) => {
    // Check if the action type is signupError
    return {
      ...state,
      isUserCreated: false,
      errorOnSignup: true,
    }
  }),
)
