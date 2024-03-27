import { Actions, createEffect, ofType } from '@ngrx/effects'
import { AuthActions } from './action-types'
import { tap } from 'rxjs/operators'
import { Router } from '@angular/router'
import { Injectable } from '@angular/core'
import { AuthService } from '../services/auth.service'

@Injectable()
export class AuthEffects {
  login$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.login),
        tap((action) => {
          this.authService
            .login(action.username, action.password)
            .pipe()
            .subscribe(
              (response) => {
                AuthActions.loginSuccess({ user: response })
              },
              (error) => {
                AuthActions.loginError({ error: error })
              },
            )
        }),
      ),
    { dispatch: false },
  )

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap((action) =>
          localStorage.setItem('user', JSON.stringify(action.user)),
        ),
      ),
    { dispatch: false },
  )

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
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
