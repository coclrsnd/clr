import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  ChangeDetectorRef,
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
import { ToastrService } from "ngx-toastr";

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
  loanTypes: string[] = ["Surety Loan","Mortgage Loan","Business Loan", "Vehicle Loan","Loan on Fixed Deposite","Loan on Pigme","Pledge Loan","Housing Loan","Gold Purchase Loan"];
  loanStatuType: string[] = ["Active","In-Active","Closed","OTS"];
  userDetails$: Observable<User>;
  loanrepaymentstatus:string[] = ["Poor","Healthy"];
  dialogSaveStatus$: Observable<boolean>;
  disableAdhar: boolean=false;
  result:string='';
  btnname:string='';
  mortagefield:boolean= false;
  vehicalfield:boolean=false;
  pancard:string='';
  voterid:string='';
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditLoanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private loansService: LoanEntityService,
    private store: Store<AppState>,
    private _snackBar: MatSnackBar,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,

  ) {
    this.dialogTitle = data.dialogTitle;
    this.loan = data.Loan;
    this.mode = data.mode;
    this.disableAdhar = data.disableAdhar ||false; // Default to false if not provided
    this.btnname = this.mode === 'create' ? 'Save' : 'Update';
    this.initializeForm(data.Loan);

    this.loanForm = this.fb.group({
      id: [0],
      amount: ["", [Validators.required, Validators.pattern(/^[0-9]{1,8}$/)]],
      status: ["", Validators.required],
      organizationCode: ["", Validators.required],
      adharNumber: [{value:"",disabled:this.disableAdhar}, [Validators.required,Validators.pattern(/^[0-9]{12}$/)]],
      loanDate: ["", Validators.required],
      loanBorrower: ["", [Validators.required, Validators.pattern((/^(?=.{1,}$)[A-Za-z]+(?:[ .][A-Za-z]+)*$/
      )), Validators.maxLength(30)]],
      suretyholder1: ["", [Validators.required, Validators.pattern((/^(?=.{1,}$)[A-Za-z]+(?:[ .][A-Za-z]+)*$/
      )), Validators.maxLength(30)]],
      suretyholder1Adhar: [{value:"",disabled:this.disableAdhar}, [Validators.required,Validators.pattern(/^[0-9]{12}$/)]],
      suretyholder2: ["", [Validators.required, Validators.pattern((/^(?=.{1,}$)[A-Za-z]+(?:[ .][A-Za-z]+)*$/
      )), Validators.maxLength(30)]],
      suretyholder2Adhar: [{value:"",disabled:this.disableAdhar}, [Validators.required,Validators.pattern(/^[0-9]{12}$/)]],
      loanType: ["", Validators.required],
      repaymentStatus: [""],
      remarks:[""],
      securityReports:[""],
      vehicleNo:[""],
      
      pancard:["", Validators.pattern(/^[A-Z0-9]{10}$/)],
      voterid:["",[Validators.required, Validators.pattern(/^[A-Z0-9]{10}$/)]]

    });


    if (this.mode === "update") {
      const statusdata = { status: 'Active' };
      this.loanForm.patchValue({ ...data.Loan,...statusdata });
      this.loanForm.get('adharNumber').disable();
      if (data.Loan.suretyholder1Adhar && data.Loan.suretyholder1Adhar.trim() !== '') {
        this.loanForm.get('suretyholder1Adhar').disable();
      } else {
        this.loanForm.get('suretyholder1Adhar').enable(); // Enable if empty
      }
      if (data.Loan.suretyholder2Adhar && data.Loan.suretyholder2Adhar.trim() !== '') {
        this.loanForm.get('suretyholder2Adhar').disable();
      } else {
        this.loanForm.get('suretyholder2Adhar').enable(); // Enable if empty
      }

      this.loanForm.get('status').enable();
    }
    else{
      this.loanForm.get('status').disable();
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
          this.dialogSaveStatus$ = of(true);
          this.dialogRef.close();
          this.toastr.success("Updated Successfully!","Success");

        }, error => {
          this.result = "Update failed!";
          this.btnname = "update";
          this.dialogSaveStatus$ = of(false); // Update save status to false
          this.dialogRef.close();

          this.toastr.error('Update failed! Please try again.','Error');

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
  toastrclick(){
    this.toastr.success("add successfully",'Success');
  }

   // Initialize form and field visibility directly in the constructor
  initializeForm(loanData: Loan) {
    this.loanForm = this.fb.group({
      loanType: [loanData?.loanType || '', Validators.required],
      // Set up additional form controls here
    });

    // Immediately determine field visibility based on existing data
    this.determineFieldVisibility(loanData?.loanType);
  }

  determineFieldVisibility(loanType: string | undefined) {
    this.mortagefield = loanType === 'Mortgage Loan';
    this.vehicalfield = loanType === 'Vehicle Loan';
  }

  onStatusChange(value: string) {
    if (value === 'Mortgage Loan') {
      this.mortagefield = true;
      this.vehicalfield = false;
    } else if (value === 'Vehicle Loan') {
      this.vehicalfield = true;
      this.mortagefield = false;
      }
      else{
        this.vehicalfield = false;
        this.mortagefield = false;
      }
      this.determineFieldVisibility(value);
    this.cdr.detectChanges();
  }

  convertToUpperCase(event: any): void{
    const input= event.target;
    input.value= input.value.toUpperCase();
  }
}
