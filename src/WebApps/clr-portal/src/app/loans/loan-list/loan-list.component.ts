import { Component, OnInit } from "@angular/core";
import { Loan } from "../model/loan";
import { MatDialog } from "@angular/material/dialog";
import { defaultDialogConfig } from "../shared/default-dialog-config";
import { LoanEntityService } from "../services/loan-entity.service";
import { EditLoanDialogComponent } from "../edit-course-dialog/edit-loan-dialog.component";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { User } from "../../auth/model/user.model";
import { AppState } from "../../reducers";
import { Store, select } from "@ngrx/store";
import { selectUserDetails } from "../../auth/auth.selectors";

@Component({
  selector: "loan-list",
  templateUrl: "./loan-list.component.html",
  styleUrls: ["./loan-list.component.css"],
})
export class LoanListComponent implements OnInit {
  loans$: Observable<Loan[]>;
  loading$: Observable<boolean>;
  displayedColumns: string[] = [
    "amount",
    "status",
    "adharNumber",
    "loanDate",
    "organizationName",
    "loanBorrower",
    "loanType",
    "actions",
  ];
  userDetails$: Observable<User>;
  showCurrentOrgsLoans: boolean;

  constructor(
    private dialog: MatDialog,
    private loanService: LoanEntityService,
    private route: ActivatedRoute,
    private store: Store<AppState>,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((param) => {
        this.loans$ = this.loanService.getWithAdhar(param["adharNumber"]);
    });

    this.userDetails$ = this.store.pipe(select(selectUserDetails));
  }

  editLoan(loan: Loan) {
    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle: "Edit Loan",
      Loan: loan,
      mode: "update",
    };

    this.dialog
      .open(EditLoanDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((response) => {
        console.log(response);
      });
  }

  addLoan() {
    const dialogConfig = defaultDialogConfig();
    dialogConfig.data = {
      dialogTitle: "Edit Loan",
      loan: null,
      mode: "create",
    };

    this.dialog
      .open(EditLoanDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((response) => {
        console.log(response);
      });
  }
}
