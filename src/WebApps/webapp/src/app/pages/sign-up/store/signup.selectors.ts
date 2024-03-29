import { createFeatureSelector, createSelector } from '@ngrx/store'
import { SignupState } from './signup.reducer'

export const selectAuthState = createFeatureSelector<SignupState>('signUp')

export const signUpSuccessfull = createSelector(
  selectAuthState,
  (signup) => signup.isUserCreated,
)

export const signupFalied = createSelector(
  selectAuthState,
  (signup) => signup.errorOnSignup,
)
