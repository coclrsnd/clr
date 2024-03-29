import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, switchMap } from 'rxjs/operators'
import { of } from 'rxjs'
import { signup, signupError, signupSuccess } from './signup.actions'
import { SignupService } from '../services/signup.service'

@Injectable()
export class SignupEffects {
  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signup),
      switchMap((action) =>
        this.signupService.signup(action.signupRequest).pipe(
          map((user) => signupSuccess()),
          catchError((error) => of(signupError())),
        ),
      ),
    ),
  )

  constructor(
    private actions$: Actions,
    private signupService: SignupService,
  ) {}
}
