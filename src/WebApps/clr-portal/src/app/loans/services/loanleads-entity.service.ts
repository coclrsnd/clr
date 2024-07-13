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

  

  FIND_LOAN_LEAD_BY_ORG = `query GetLoanLeads($organizationCode:String!){
    loanLeads(where: {
          or: [
            { organizationCode: { contains: $organizationCode } }
            
          ]
        }){
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
      leadStatus
      leadStatusRemarks
    }
  }
  `;
  

  getWithOrganization(organizationCode: string): Observable<LoanLead[]> {
    return this.http
      .post<{
        data: { loanlead: LoanLead[] };
      }>(environment.apiUrl, {
        query: this.FIND_LOAN_LEAD_BY_ORG,
        variables: { organizationCode: organizationCode },
      })
      .pipe(
        tap((response) => {
          if (response?.data?.loanlead) {
            this.addAllToCache(response?.data?.loanlead);
          }
        }),
        map((response) => {
          if (response.data.loanlead) {
            console.log(response.data.loanlead);
            return response.data.loanlead;
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
