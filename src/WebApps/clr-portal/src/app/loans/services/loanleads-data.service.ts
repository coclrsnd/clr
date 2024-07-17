import { Injectable } from "@angular/core";
import { DefaultDataService, HttpUrlGenerator } from "@ngrx/data";
import { LoanLead } from "../model/loanlead";
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
export class LoanLeadDataService extends DefaultDataService<LoanLead> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super("LoanLead", http, httpUrlGenerator);
  }

  CREATE_LOAN_LEAD_QUERY = `mutation SaveLoanLead($input:SaveLoanLeadInput!){
    saveLoanLead(input:$input)
    {
        int
    }
}
  `;

  add(entity: LoanLead, options?: HttpOptions): Observable<LoanLead> {
    delete entity["organizationName"];
    return this.http.post<LoanLead>(environment.apiUrl, {
      query: this.CREATE_LOAN_LEAD_QUERY,
      variables: {
        input: {
          loanLeadRequestInput: entity,
        },
      },
    });
  }

  update(
    update: Update<LoanLead>,
    options?: HttpOptions,
  ): Observable<LoanLead> {
    const loan = update.changes;
    return this.http.post<LoanLead>(environment.apiUrl, {
      query: this.CREATE_LOAN_LEAD_QUERY,
      variables: {
        input: {
          loanLeadRequestInput: loan,
        },
      },
    });
  }
}
