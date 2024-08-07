import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  ChangeDetectorRef,
} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
// import { Loan } from "../model/loan";
import {
  FormBuilder,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormControl,
  FormGroupDirective,
  NgForm,
  ReactiveFormsModule,
} from "@angular/forms";
import { Observable } from "rxjs";
// import { LoanEntityService } from "../services/loan-entity.service";
import { User } from "../../auth/model/user.model";
import { AppState } from "../../reducers";
import { Store, UPDATE } from "@ngrx/store";
import { selectUserDetails } from "../../auth/auth.selectors";
import { ErrorStateMatcher } from "@angular/material/core";
import { of } from "rxjs";
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from "@angular/material/snack-bar";
import { ToastrService } from "ngx-toastr";
import { CommonModule } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { MaterialModule } from "../../material.module";
import { LoanLead } from "../model/loanlead";
import { LoanLeadEntityService } from "../services/loanleads-entity.service";

@Component({
  selector: "leadsform",

  templateUrl: "./leadsform.component.html",
  styleUrl: "./leadsform.component.css",
})
export class LeadsformComponent implements OnInit {
  dialogTitle: string;
  loanlead: LoanLead;
  mode: "create" | "update";
  loading$: Observable<boolean>;
  loanleadForm: FormGroup;
  loanTypes: string[] = [
    "Surety Loan",
    "Mortgage Loan",
    "Business Loan",
    "Vehicle Loan",
    "Loan on Fixed Deposite",
    "Loan on Pigme",
    "Pledge Loan",
    "Housing Loan",
    "Gold Purchase Loan",
  ];
  loanStatuType: string[] = ["Active", "In-Active", "Closed", "OTS"];
  userDetails$: Observable<User>;
  loanrepaymentstatus: string[] = ["Poor", "Healthy"];
  dialogSaveStatus$: Observable<boolean>;
  disableAdhar: boolean = false;
  result: string = "";
  btnname: string = "";
  mortagefield: boolean = false;
  vehicalfield: boolean = false;
  todayDate: string;
  
  leadStatus: string[] = ["Disbursed", "NotApproved", "Pending"];
  leadStatusRemarks: any = "";
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LeadsformComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private loanLeadService: LoanLeadEntityService,
    private store: Store<AppState>,
    private _snackBar: MatSnackBar,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {
    this.dialogTitle = data.dialogTitle;
    this.loanlead = data.LoanLead;
    this.mode = data.mode;
    this.disableAdhar = data.disableAdhar || false; // Default to false if not provided
    this.btnname = this.mode === "create" ? "AddLead" : "Update";
    this.initializeForm(data.LoanLead);

    if (this.mode === "update") {
      this.loanleadForm.patchValue({ ...data.LoanLead });
      this.loanleadForm.get("adharNumber").disable();
    }

    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0];
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
      this.loanleadForm
        .get("organizationCode")
        .patchValue(user.organizationCode);
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.mode === "update") {
      const loanLead: LoanLead = {
        ...this.loanleadForm.value,
        adharNumber: this.loanleadForm.get("adharNumber").value,
      };

      this.loanLeadService.update(loanLead).subscribe(
        () => {
          this.result = "Updated successfully!";
          this.dialogSaveStatus$ = of(true);
          this.dialogRef.close();
          this.toastr.success("Updated Successfully!", "Success");
        },
        (error) => {
          this.result = "Update failed!";
          this.dialogSaveStatus$ = of(false);
          this.dialogRef.close();
          this.toastr.error("Update failed! Please try again.", "Error");
        }
      );
    } else if (this.mode === "create") {
      const loanLead: LoanLead = {
        ...this.loanlead,
        ...this.loanleadForm.value,
        loanDate: new Date(this.loanleadForm.get("loanDate").value).toISOString(),
      };

      this.loanLeadService.add(loanLead).subscribe(
        (newLoanLead) => {
          console.log("New Loan", newLoanLead);
          this.result = "Created successfully!";
          this.dialogSaveStatus$ = of(true);
          this.dialogRef.close();
          this.toastr.success("Created Successfully!", "Success");
          
        },
        (error) => {
          this.result = "Creation failed!";
          this.dialogSaveStatus$ = of(false);
          this.dialogRef.close();
          this.toastr.error("Creation failed! Please try again.", "Error");
        }
        
      );
    }
  }

  toastrclick() {
    this.toastr.success("added successfully", "Success");
  }

  // Initialize form and field visibility directly in the constructor

  initializeForm(loanleadData: LoanLead) {
    // Initialize the form with common fields
    this.loanleadForm = this.fb.group({
      id: [loanleadData?.id || 0],
      amount: [
        loanleadData?.amount || "",
        [Validators.required, Validators.pattern(/^[0-9]{1,8}$/)],
      ],
      adharNumber: [
        { value: loanleadData?.adharNumber || "", disabled: this.disableAdhar },
        [Validators.required, Validators.pattern(/^[0-9]{12}$/)],
      ],
      loanDate: [this.todayDate, Validators.required],
      loanBorrower: [
        loanleadData?.loanBorrower || "",
        [
          Validators.required,
          Validators.pattern(/^(?=.{1,}$)[A-Za-z]+(?:[ .][A-Za-z]+)*$/),
          Validators.maxLength(30),
        ],
      ],
      loanType: [loanleadData?.loanType || "", Validators.required],
      organizationCode: ["", Validators.required],
    });

    // Add fields conditionally if the mode is 'update'
    if (this.mode === "update") {
      this.loanleadForm.addControl(
        "leadStage",
        this.fb.control(loanleadData?.leadStage || "", Validators.required),
      );
      this.loanleadForm.addControl(
        "leadStatus",
        this.fb.control(loanleadData?.leadStatus || ""),
      );
      this.loanleadForm.addControl(
        "leadStatusRemarks",
        this.fb.control(loanleadData?.leadStatusRemarks || ""),
      );
    }

    // Immediately determine field visibility based on existing data
    this.determineFieldVisibility(loanleadData?.loanType);
  }

  determineFieldVisibility(loanType: string | undefined) {
    this.mortagefield = loanType === "Mortgage Loan";
    this.vehicalfield = loanType === "Vehicle Loan";
  }

  onStatusChange(value: string) {
    if (value === "Mortgage Loan") {
      this.mortagefield = true;
      this.vehicalfield = false;
    } else if (value === "Vehicle Loan") {
      this.vehicalfield = true;
      this.mortagefield = false;
    } else {
      this.vehicalfield = false;
      this.mortagefield = false;
    }
    this.determineFieldVisibility(value);
    this.cdr.detectChanges();
  }
}
