import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { APP_CONSTANTS } from '../app-constants';
import { UserService } from '../login/user-service';
import { UserModel } from '../login/UserModel';
import { ToastrService } from 'ngx-toastr';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ChangepasswordDialogComponent } from './changepassword-dialog/changepassword-dialog.component';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})

export class UserSettingsComponent implements OnInit {
  public currentTitle: string = '';
  @Output() titleChange = new EventEmitter<any>();
  public userForm: UntypedFormGroup;
  public isUserDetailSubmitted: boolean = false;
  public initials: string = 'SC';
  public selectedFiles: any;
  public userModel: UserModel = new UserModel();
  public profileName: string = '';
  public isViewMode: boolean = true;
  public userId:number;
  constructor(
    public formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private sharedService: SharedService,
    protected authService: AuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initilizeUserSettingsForm();
    this.loadUserDetail();
  }

  // Initilize User/profile settings form
  public initilizeUserSettingsForm(): void {
    this.userForm = this.formBuilder.group({
      FirstName: [APP_CONSTANTS.emptyString, Validators.required],
      LastName: [APP_CONSTANTS.emptyString, Validators.required],
      CompanyName: [APP_CONSTANTS.emptyString, [Validators.required, Validators.pattern(/^[a-zA-Z0-9-&. ]*$/)]],
      Designation: [APP_CONSTANTS.emptyString],
      MobileNo: [APP_CONSTANTS.emptyString, Validators.pattern(/^[0-9 +()-]*$/)],
      ContactNo: [APP_CONSTANTS.emptyString, [Validators.pattern(/^[0-9 +()-]*$/)]],
      EmailId: [APP_CONSTANTS.emptyString, [Validators.required, Validators.email]],
      Address: [APP_CONSTANTS.emptyString]
    });
    this.userForm.controls['EmailId'].disable();
  }

  selectFile(event) {
    this.selectedFiles = (event.target as HTMLInputElement).files;
  }

  /** Load current loggedIn user detail
   * @method loadUserDetail
   */
  public loadUserDetail(): void {
    this.authService.getUserId();
    this.userService.GetUserByID(+ApiService.UserId).subscribe((response: any) => {
      this.userForm.patchValue(response);
      this.userId=response.Id;
      // get user profile name
      this.profileName = this.sharedService.getProfileName(
        response?.FirstName,
        response?.LastName
      );
    });
  }

  /** on update customer form data
   * @method onUpdateCustomerForm
   */
  public onUpdateUsersDetail(): void {
    this.isUserDetailSubmitted = true;
    // stop here if form is invalid
    if (this.userForm.invalid) {
      return;
    }

    this.userModel = Object.assign(this.userForm.getRawValue());
    this.userModel.Id=this.userId;
    // convert mobile/phone number (numeric value) to string because we have used numeric directive.
    this.userModel.MobileNo = this.sharedService.CheckIfEmptyOrNull(this.userForm.value.MobileNo);
    this.userModel.ContactNo = this.sharedService.CheckIfEmptyOrNull(this.userForm.value.ContactNo);

    this.userService.UpdateUserDetail(this.userModel).subscribe(
      (response) => {
        this.toastr.success('The information was updated successfully.');
        this.loadUserDetail();
        this.isViewMode = true;
      },
      (error) => {
        this.toastr.error('Failed to update user detail.');
      }
    );
  }

    /** Get Current user form-control
   * @method userFormControl
   */
     get userFormControl() {
      return this.userForm.controls;
    }

    public onChangePassword(): void {
      const dialogRef = this.dialog.open(ChangepasswordDialogComponent,{
        data:{
          title: 'Change Password',
          buttonText: {
            confirmText: 'Update'
          }
        }
      });


      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        this.isViewMode = true;
        if (confirmed) {
        }
      });
    }

    public onResetUserDetails(): void {
      // this.userForm.reset();
      this.userForm.patchValue({
        FirstName: APP_CONSTANTS.emptyString,
        LastName: APP_CONSTANTS.emptyString,
        CompanyName: APP_CONSTANTS.emptyString,
        Designation: APP_CONSTANTS.emptyString,
        MobileNo: APP_CONSTANTS.emptyString,
        ContactNo: APP_CONSTANTS.emptyString,
        Address: APP_CONSTANTS.emptyString
      });
    }

    public onUpdateDetails(): void {
      this.isViewMode = false;
    }

}
