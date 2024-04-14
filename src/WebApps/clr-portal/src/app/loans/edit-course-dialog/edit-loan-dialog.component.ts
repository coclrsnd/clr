import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Loan } from "../model/loan";
import {
  FormBuilder,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormControl,
  FormGroupDirective,
  NgForm
} from "@angular/forms";
import { Observable } from "rxjs";
import { LoanEntityService } from "../services/loan-entity.service";
import { User } from "../../auth/model/user.model";
import { AppState } from "../../reducers";
import { Store } from "@ngrx/store";
import { selectUserDetails } from "../../auth/auth.selectors";
import {ErrorStateMatcher} from '@angular/material/core';


@Component({
  selector: "Loan-dialog",
  templateUrl: "./edit-loan-dialog.component.html",
  styleUrls: ["./edit-loan-dialog.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditLoanDialogComponent implements OnInit {
  dialogTitle: string;
  loan: Loan;
  mode: "create" | "update";
  loading$: Observable<boolean>;
  loanForm: FormGroup;
  loanTypes: string[] = ["Surity Loan","Mortgage Loan","Business Loan", "Vehicle Loan","Loan on Fixed Deposite","Loan on Pigme","Pledge Loan","Housing Loan","Gold Purchase Loan"];
  loanStatuType: string[] = ["Active","In-Active","Closed"];
  userDetails$: Observable<User>;
  dialogSaveStatus$: Observable<boolean>;
  disableAdhar: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditLoanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private loansService: LoanEntityService,
    private store: Store<AppState>,
  ) {
    this.dialogTitle = data.dialogTitle;
    this.loan = data.Loan;
    this.mode = data.mode;
    this.disableAdhar = data.disableAdhar ||false; // Default to false if not provided


    this.loanForm = this.fb.group({
      id: [0],
      amount: ["", [Validators.required, Validators.pattern(/^[0-9]{1,8}$/)]],
      status: ["", Validators.required],
      organizationCode: ["", Validators.required],
      adharNumber: ["", [Validators.required, Validators.pattern(/^(?!0{12})[0-9]{12}$/)]],
      loanDate: ["", Validators.required],
      loanBorrower: ["", [Validators.required, Validators.pattern((/^(?=.{1,30}$)[A-Za-z]+(?:[ .][A-Za-z]+)*$/
    )), Validators.maxLength(30)]],
      loanType: ["", Validators.required],
    });

    if (this.mode == "update") {
      this.loanForm.patchValue({ ...data.Loan, disableAdhar:false  });
    }
  }
  ngOnInit(): void {
    this.store.select(selectUserDetails).subscribe((user) => {
      this.loanForm.get("organizationCode").patchValue(user.organizationCode);
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  onSave() {
    const Loan: Loan = {
      ...this.loan,
      ...this.loanForm.value, 
    };

    if (this.mode == "update") {
      this.loansService.update(Loan);

      this.dialogRef.close();
    } else if (this.mode == "create") {
      this.loansService.add(Loan).subscribe((newLoan) => {
        console.log("New Loan", newLoan);

        this.dialogRef.close();
      });
    }
  }
  
}
