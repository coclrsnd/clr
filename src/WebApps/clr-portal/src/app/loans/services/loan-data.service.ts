import { Injectable } from "@angular/core";
import { DefaultDataService, HttpUrlGenerator } from "@ngrx/data";
import { Loan } from "../model/loan";
import { HttpClient } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import {
  HttpOptions,
  QueryParams,
} from "@ngrx/data/src/dataservices/interfaces";
import { Update } from "@ngrx/entity";
import { environment } from "../../../environments/environment";

@Injectable()
export class LoansDataService extends DefaultDataService<Loan> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super("Loan", http, httpUrlGenerator);
  }

  CREATE_LOAN_QUERY = `mutation SaveLoan($loanRequest:SaveLoanInput!){
    saveLoan(input: $loanRequest){
      int
    }
  }
  `;

  add(entity: Loan, options?: HttpOptions): Observable<Loan> {
    return this.http.post<Loan>(environment.apiUrl, {
      query: this.CREATE_LOAN_QUERY,
      variables: {
        loanRequest: {
          loanRequestInput: entity
        }
      },
    });
  }
  
  update(update: Update<Loan>, options?: HttpOptions): Observable<Loan> {
    return this.http.post<Loan>(environment.apiUrl, {
      query: this.CREATE_LOAN_QUERY,
      variables: {
        loanRequest: {
          loanRequestInput: update.changes
        }
      }
    });
  }
}
