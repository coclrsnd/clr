import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import { Loan_Query } from '../shared/components/Loan/queries';

@Injectable()
export class DashboardService {
  reportApiRoutePrefix: string = 'api/Loan';

  constructor(private apiReportService: ApiService<any>) {}

  GetLoansByAdhar(adharNumber: string): Observable<any> {
    const body = {
      query: Loan_Query,
      variables: {
        adharNumber: adharNumber.toString(),
      },
    };
    return this.apiReportService.post('',body);
  }


}
