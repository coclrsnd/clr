import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { UntypedFormBuilder, UntypedFormControl, FormGroup } from "@angular/forms";
import { APP_CONSTANTS } from "src/app/app-constants";
import { DashboardService } from "src/app/dashboard/dashboard-service";


class Loan {
  id: string;
  name: string;
  loanType: string;
  Date: Date;
}

@Component({
  selector: 'app-loan-search',
  templateUrl: './loan-search.html',
  styleUrls: ['./loan-search.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoanSearchComponent implements OnInit{
  public displayedColumns = ['id', 'loanDate', 'loanType', 'amount'];

  public searchLoanControl = new UntypedFormControl('');
  public submittedRatesDetails: boolean = false;
  public dataSource = [];
  public loanSearchForm = this.formBuilder.group({
    adharNumber: [APP_CONSTANTS.emptyString]
  });


  constructor(private dashboardService :DashboardService,public formBuilder: UntypedFormBuilder) {
  }
  ngOnInit(): void {
    console.log("ngOnInit");
  }

  searchLoansByAdhar(){
    this.dashboardService.GetLoansByAdhar(this.loanSearchForm.controls['adharNumber'].value).subscribe(res=>{
      this.dataSource = res.data.loans;
    })
  }

  onLoanEdit(Id){
    console.log(Id);
  }

}
