import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { login, loginError, loginSuccess, logout } from "./auth.actions";
import { of } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      switchMap((action) =>
        this.authService
          .login({ userName: action.userName, password: action.password })
          .pipe(
            map((user) => loginSuccess({ user })),
            catchError((error) => of(loginError({ errorOnLogin: true }))),
          ),
      ),
    ),
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap((action) => {
          localStorage.setItem("user", JSON.stringify(action.user));
          if (localStorage.getItem("user")) {
            localStorage.setItem("Token", JSON.stringify(action.user.token));
          }
          if (this.router.routerState.snapshot.url === "/login") {
            this.router.navigate(["loans"]);
          }
        }),
      ),
    { dispatch: false },
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap((action) => {
          localStorage.removeItem("user");
          this.router.navigateByUrl("/login");
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}
}
