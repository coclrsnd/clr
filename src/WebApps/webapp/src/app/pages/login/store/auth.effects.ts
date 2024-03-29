import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, switchMap, tap } from 'rxjs/operators'
import { Router } from '@angular/router'
import { Injectable } from '@angular/core'
import { AuthService } from '../services/auth.service'
import { login, loginError, loginSuccess, logout } from './auth.actions'
import { of } from 'rxjs'

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
  )

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap((action) => {
          localStorage.setItem('user', JSON.stringify(action.user))
          this.router.navigateByUrl('/courses')
        }),
      ),
    { dispatch: false },
  )

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap((action) => {
          localStorage.removeItem('user')
          this.router.navigateByUrl('/login')
        }),
      ),
    { dispatch: false },
  )

  constructor(
    private actions$: Actions,
    private router: Router,
    private authService: AuthService,
  ) {}
}
