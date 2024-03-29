import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { findLoans, findLoansFailure, findLoansSuccess } from './loan.actions'
import { catchError, map, switchMap } from 'rxjs/operators'
import { LoanService } from '../../services/loan.service'
import { error } from 'console'
import { of } from 'rxjs'

@Injectable()
class LoanEffect {
  loand$ = createEffect(() =>
    this.action$.pipe(
      ofType(findLoans),
      switchMap((action) => {
        return this.loanService.findLoans(action.adharNumbe).pipe(
          map((loans) => findLoansSuccess({ loans: loans })),
          catchError((error) => of(findLoansFailure({ error: error }))),
        )
      }),
    ),
  )

  /**
   *
   */
  constructor(
    private action$: Actions,
    private loanService: LoanService,
  ) {}
}
