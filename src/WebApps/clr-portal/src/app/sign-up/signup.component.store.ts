import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable } from "rxjs";
import { catchError, switchMap, tap } from "rxjs/operators";
import { SignUp } from "./model/signup";
import { SignupService } from "./services/signup.service";
import { Organization } from "./model/organization";

export interface SignupState {
  signupUser: SignUp;
  isUserCreated: boolean;
  errorOnSignup: boolean;
  filteredOrganizations: Organization[];
}

export const initialSignupState: SignupState = {
  signupUser: undefined,
  isUserCreated: false,
  errorOnSignup: false,
  filteredOrganizations: undefined,
};

@Injectable()
export class SignupComponentStore extends ComponentStore<SignupState> {
  constructor(private signupService: SignupService) {
    super(initialSignupState);
  }

  readonly signupUser$ = this.select((state) => state.signupUser);
  readonly isUserCreated$ = this.select((state) => state.isUserCreated);
  readonly errorOnSignup$ = this.select((state) => state.errorOnSignup);
  readonly filteredOrganizations$ = this.select(
    (state) => state.filteredOrganizations,
  );

  readonly signup = this.effect((signupRequest$: Observable<SignUp>) =>
    signupRequest$.pipe(
      tap((_) => {
        this.patchState((state) => ({
          errorOnSignup: undefined,
        }));
      }),
      switchMap((signupRequest) =>
        this.signupService.signup(signupRequest).pipe(
          tap(() => this.signupSuccess()),
          catchError(() => {
            this.signupError();
            return [];
          }),
        ),
      ),
    ),
  );

  readonly filterOrganizations = this.effect(
    (searchTerm$: Observable<string>) =>
      searchTerm$.pipe(
        switchMap((searchTerm) =>
          this.signupService.searchOrganizations(searchTerm).pipe(
            tap((organizations) =>
              this.setFilteredOrganizations(organizations),
            ),
            catchError(() => {
              this.setFilteredOrganizations([]);
              return [];
            }),
          ),
        ),
      ),
  );

  private signupSuccess() {
    this.setState((state) => ({
      ...state,
      isUserCreated: true,
      errorOnSignup: false,
    }));
  }

  private signupError() {
    this.setState((state) => ({
      ...state,
      isUserCreated: false,
      errorOnSignup: true,
    }));
  }

  private setFilteredOrganizations(organizations: Organization[]) {
    this.setState((state) => ({
      ...state,
      filteredOrganizations: organizations,
    }));
  }
}
