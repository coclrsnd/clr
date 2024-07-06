import { Injectable } from "@angular/core";
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from "@ngrx/data";
import { Loan } from "../model/loan";
import { Observable, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";
import { environment } from "../../../environments/environment";

@Injectable()
export class LoanLeadEntityService extends EntityCollectionServiceBase<Loan> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    private http: HttpClient,
  ) {
    super("LoanLead", serviceElementsFactory);
  }

  

  FIND_LOAN_LEAD_BY_ORG = `query FindLoansByAdhar($organizationCode: String!) {
    loans(
      where: {
        or: [
          { organizationCode: { contains: $organizationCode } }
        ]
      }
    ) {
      amount
      status
      organizationCode
      organizationName
      adharNumber
      loanDate
      loanBorrower
      loanType
      repaymentStatus
      remarks
      id
      securityReports
      vehicleNo
      suretyholder1Adhar
      suretyholder2Adhar
      suretyholder1
      suretyholder2
    }
  }
  `;
  

  getWithOrganization(organizationCode: string): Observable<Loan[]> {
    return this.http
      .post<{
        data: { loans: Loan[] };
      }>(environment.apiUrl, {
        query: this.FIND_LOAN_LEAD_BY_ORG,
        variables: { organizationCode: organizationCode },
      })
      .pipe(
        tap((response) => {
          if (response?.data?.loans) {
            this.addAllToCache(response?.data?.loans);
          }
        }),
        map((response) => {
          if (response.data.loans) {
            console.log(response.data.loans);
            return response.data.loans;
          } else {
            throw new Error("something went wrong");
          }
        }),
        catchError((error) => {
          return throwError(error);
        }),
      );
  }
}
