import { createReducer, on } from '@ngrx/store'
import { findLoans, findLoansFailure, findLoansSuccess } from './loan.actions'

export interface LoanState {
  loans: Loan[]
  isloading: boolean
  organizationId: number
}

export interface Loan {
  amount: number
  status: number
  organizationCode: string
  adharNumber: string
  loanDate: Date
  loanBorrower: string
  loanType: string
  id: number
  createdBy: String
  createdDate: Date
  lastModifiedBy: String
  lastModifiedDate: Date
}

const intialLoanstate: LoanState = {
  isloading: false,
  loans: undefined,
  organizationId: 0,
}

export const loanReducer = createReducer(
  intialLoanstate,
  on(findLoans, (state, { adharNumbe }) => ({
    ...state,
    isloading: true,
    loans: state.loans,
    organizationId: state.organizationId,
  })),
  on(findLoansSuccess, (state, { loans }) => ({
    ...state,
    isloading: false,
    loans: loans,
  })),
  on(findLoansFailure, (state, { error }) => ({
    ...state,
    isloading: false,
    loans: undefined,
  })),
)
