import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AUTH_KEY, AuthState } from "./reducers";

export const selectAuthState = createFeatureSelector<AuthState>(AUTH_KEY);

export const isLoggedIn = createSelector(
  selectAuthState,
  (state) => !!state.user,
);

export const selectUserDetails = createSelector(
  selectAuthState,
  (state) => state.user,
);

export const isLoggedOut = createSelector(isLoggedIn, (loggedIn) => !loggedIn);

export const isDevSupport = createSelector(
  selectAuthState,
  (state) => state.user.roleName.toLocaleUpperCase() === "devsupport",
);

export const errorOnLogin = createSelector(
  selectAuthState,
  (state) => !!state.errorOnLogin,
);
