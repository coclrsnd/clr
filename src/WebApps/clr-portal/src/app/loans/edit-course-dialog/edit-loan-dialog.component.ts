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
} from "@angular/forms";
import { Observable } from "rxjs";
import { LoanEntityService } from "../services/loan-entity.service";
import { User } from "../../auth/model/user.model";
import { AppState } from "../../reducers";
import { Store } from "@ngrx/store";
import { selectUserDetails } from "../../auth/auth.selectors";

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
  loanTypes: string[] = ["Personal", "Vehicle"];
  loanStatuType: string[] = ["Open", "Closed", "Pending"];
  userDetails$: Observable<User>;
  dialogSaveStatus$: Observable<boolean>;

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

    this.loanForm = this.fb.group({
      id: [0],
      amount: ["", Validators.required],
      status: ["", Validators.required],
      organizationCode: ["", Validators.required],
      adharNumber: ["", Validators.required],
      loanDate: ["", Validators.required],
      loanBorrower: ["", Validators.required],
      loanType: ["", Validators.required],
    });

    if (this.mode == "update") {
      this.loanForm.patchValue({ ...data.Loan });
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
