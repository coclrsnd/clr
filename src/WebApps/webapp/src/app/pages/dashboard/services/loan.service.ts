import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Loan } from '../loans/store/loan.reducer'
import { HttpClient } from '@angular/common/http'

@Injectable({ providedIn: 'root' })
export class LoanService {
  constructor(private httpClient: HttpClient) {}

  FIND_LOANS_BY_ADHAR_QUERY = ``

  findLoans(adharNumber: string): Observable<Loan[]> {
    return this.httpClient.post<Loan[]>('https://localhost:55148/graphql/', {
      query: this.FIND_LOANS_BY_ADHAR_QUERY,
      variables: { adharNumber: adharNumber },
    })
  }
}
