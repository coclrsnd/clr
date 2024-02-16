import { Component, Inject, OnInit, SecurityContext } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { APP_CONSTANTS } from 'src/app/app-constants';
import { equalValidators } from 'src/app/shared/directives/validatorDate';
import { UserService } from 'src/app/login/user-service';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-changepassword-dialog',
  templateUrl: './changepassword-dialog.component.html',
  styleUrls: ['./changepassword-dialog.component.scss'],
})
export class ChangepasswordDialogComponent implements OnInit {
  public changePasswordForm: UntypedFormGroup;
  public submittedChangePwd: boolean = false;

  constructor(
    public formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<ChangepasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private auth: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.initializeChangePasswordForm();
  }

  public initializeChangePasswordForm(): void {
    this.changePasswordForm = this.formBuilder.group({
      CurrentPassword: [APP_CONSTANTS.emptyString, Validators.required],
        NewPassword: [APP_CONSTANTS.emptyString, {
        validators:[Validators.required, Validators.minLength(8),Validators.pattern(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*<>`~;:{}+=-_(),.])[a-zA-Z0-9!@#$%^&*<>`~;:{}+=-_(),.]{8,}$/)],
        updateOn: 'blur',
        asyncValidators: []
      }],
      ConfirmPassword: [APP_CONSTANTS.emptyString, {
        validators:[Validators.required, Validators.minLength(8)],
        updateOn: 'blur',
        asyncValidators: []
      }]
    },{ validator: Validators.compose([
      equalValidators.fieldEqual('NewPassword', 'ConfirmPassword', { 'isFieldEqual': true })
    ])});
   }

  get change() {
    return this.changePasswordForm.controls;
  }

  public onSubmitChangePassword(): void {
    this.submittedChangePwd = true;
    if (this.changePasswordForm.invalid) {
      return;
    }
    const emailId = ApiService.EmailId;
    this.changePasswordForm.addControl('EmailId', this.formBuilder.control(emailId));
    this.userService.ChangePassword(this.changePasswordForm.value).subscribe(
      (response) => {
        this.dialogRef.close();
        this.router.navigate(['../login']).then(() => {
          this.toastr.success('Password updated successfully!','',{tapToDismiss:true});
        });
      },
      (error) => {
      }
    );
  }
}
