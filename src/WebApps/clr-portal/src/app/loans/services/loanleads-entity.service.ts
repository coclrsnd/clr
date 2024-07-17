import { Injectable } from "@angular/core";
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from "@ngrx/data";
import { LoanLead } from "../model/loanlead";
import { Observable, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";
import { environment } from "../../../environments/environment";

@Injectable()
export class LoanLeadEntityService extends EntityCollectionServiceBase<LoanLead> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    private http: HttpClient,
  ) {
    super("LoanLead", serviceElementsFactory);
  }

  FIND_LOAN_LEAD_BY_ORG = `query GetLoanLeads($organizationCode: String!) {
  loanLeads(
    where: {
      and: [
        { organizationCode: { contains: $organizationCode } }
        {
          or: [
            { leadStatus: { eq: "Pending" } }
            { leadStatus: { eq: "NotApproved" } }
          ]
        }
      ]
    }
  ) {
    loanDate
    lastModifiedBy
    lastModifiedDate
    __typename
    loanBorrower
    adharNumber
    organizationCode
    loanType
    id
    createdBy
    leadStage
    amount
    leadStatus
    leadStatusRemarks
  }
}
  `;

  getWithOrganization(organizationCode: string): Observable<LoanLead[]> {
    return this.http
      .post<{
        data: { loanLeads: LoanLead[] };
      }>(environment.apiUrl, {
        query: this.FIND_LOAN_LEAD_BY_ORG,
        variables: { organizationCode: organizationCode },
      })
      .pipe(
        tap((response) => {
          if (response?.data?.loanLeads) {
            this.addAllToCache(response?.data?.loanLeads);
          }
        }),
        map((response) => {
          if (response.data.loanLeads) {
            console.log(response.data.loanLeads);
            return response.data.loanLeads;
          } else {
            throw new Error("something went wrong");
          }
        }),
        catchError((error) => {
          return throwError(error);
        }),
      );
  }


  FIND_LOAN_LEAD_BY_ADHAR = `query GetLoanLeads($adharNumber: String!) {
    loanLeads(
      where: {
        and: [
          { adharNumber: { contains: $adharNumber } }
          {
            or: [
              { leadStatus: { eq: "Pending" } }
              { leadStatus: { eq: "NotApproved" } }
            ]
          }
        ]
      }
    ) {
      loanDate
      lastModifiedBy
      lastModifiedDate
      __typename
      loanBorrower
      adharNumber
      organizationCode
      loanType
      id
      createdBy
      leadStage
      amount
      leadStatus
      leadStatusRemarks
    }
  }
    `;

    getWithAdhar(adharNumber: string): Observable<LoanLead[]> {
      return this.http
        .post<{
          data: { loanLeads: LoanLead[] };
        }>(environment.apiUrl, {
          query: this.FIND_LOAN_LEAD_BY_ADHAR,
          variables: { adharNumber: adharNumber },
        })
        .pipe(
          tap((response) => {
            if (response?.data?.loanLeads) {
              this.addAllToCache(response?.data?.loanLeads);
            }
          }),
          map((response) => {
            if (response.data.loanLeads) {
              console.log(response.data.loanLeads);
              return response.data.loanLeads;
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
