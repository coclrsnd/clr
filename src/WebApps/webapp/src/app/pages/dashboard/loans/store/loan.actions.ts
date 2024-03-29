import { createAction, props } from '@ngrx/store'
import { Loan } from './loan.reducer'

export const findLoans = createAction(
  '[Dashboard page] Find loan by adhar',
  props<{ adharNumbe: string }>(),
)

export const findLoansSuccess = createAction(
  '[Dashboard page] Find loan by adhar Success',
  props<{ loans: Loan[] }>(),
)

export const findLoansFailure = createAction(
  '[Dashboard page] Find loan by adhar Success',
  props<{ error: any }>(),
)
