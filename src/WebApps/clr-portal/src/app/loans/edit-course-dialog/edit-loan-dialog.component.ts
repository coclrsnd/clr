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
import { of } from "rxjs";
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

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
  disableAdhar: boolean=false;
  result:string='';
  btnname:string='';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditLoanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private loansService: LoanEntityService,
    private store: Store<AppState>,
    private _snackBar: MatSnackBar,
    
  ) {
    this.dialogTitle = data.dialogTitle;
    this.loan = data.Loan;
    this.mode = data.mode;
    this.disableAdhar = data.disableAdhar ||false; // Default to false if not provided
    this.btnname = this.mode === 'create' ? 'Save' : 'Update';

    this.loanForm = this.fb.group({
      id: [0],
      amount: ["", [Validators.required, Validators.pattern(/^[0-9]{1,8}$/)]],
      status: ["", Validators.required],
      organizationCode: ["", Validators.required],
      adharNumber: [{value:"",disabled:this.disableAdhar}, [Validators.required,Validators.pattern(/^(?!0|1)[0-9]{12}$/)]],
      loanDate: ["", Validators.required],
      loanBorrower: ["", [Validators.required, Validators.pattern((/^(?=.{1,}$)[A-Za-z]+(?:[ .][A-Za-z]+)*$/
    )), Validators.maxLength(30)]],
      loanType: ["", Validators.required],
    });
    
   
    if (this.mode === "update") {
      this.loanForm.patchValue({ ...data.Loan });
      this.loanForm.get('adharNumber').disable(); // Disable the adharNumber control
    }
    
    
  }

  numericOnly(event): boolean {
    let pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar) && event.charCode !== 0) {
      // If not a number, prevent the keypress
      event.preventDefault();
      return false;
    }
    return true;
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
      ...this.loanForm.value
    }; 
  
    if (this.mode == "update") {
      this.loansService.update(Loan)
        .subscribe(() => {
          this.result = "Updated successfully!";
          this.btnname = "update";
          this.dialogSaveStatus$ = of(true); // Update save status to true
          this.dialogRef.close();
  
          // Show a toast message for successful update
          this._snackBar.open('Updated successfully!', 'Close', {
            duration: 3000, // Duration in milliseconds
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['successsnackbar'] // Add custom CSS class for success
          });
        }, error => {
          this.result = "Update failed!";
          this.btnname = "update";
          this.dialogSaveStatus$ = of(false); // Update save status to false
          this.dialogRef.close();
  
          // Show a toast message for update failure
          this._snackBar.open('Update failed! Please try again.', 'Close', {
            duration: 3000, // Duration in milliseconds
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['errorsnackbar'] // Add custom CSS class for error
          });
        });
    } else if (this.mode == "create") {
      this.btnname = "save";
      this.loansService.add(Loan).subscribe((newLoan) => {
        console.log("New Loan", newLoan);
        this.result = "Created successfully!"
        this.dialogSaveStatus$ = of(true); // Update save status to true
        this.dialogRef.close();
      });
    }
  }   
}