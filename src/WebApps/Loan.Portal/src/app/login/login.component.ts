import {
  ActivatedRoute,
  NavigationEnd,
  PRIMARY_OUTLET,
  Router,
  UrlSegment,
  UrlSegmentGroup,
  UrlTree,
} from '@angular/router';
import { APP_CONSTANTS } from './../app-constants';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserModel } from './UserModel';
import { UserService } from './user-service';
import { AuthService } from '../services/auth.service';
import { LoginModel } from './LoginModel';
import { filter } from 'rxjs/operators';
import { equalValidators } from '../shared/directives/validatorDate';
import { AccountService } from '../services/account.service';
import { SharedService } from '../shared/shared.service';
import { ApiService } from '../services/api.service';

export enum TokenStatus {
  Validating,
  Valid,
  Invalid
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  // Variable declearations
  public isTermsAccepted: boolean = false;
  public value = 'ok';
  public registerForm: UntypedFormGroup;
  public loginForm: UntypedFormGroup;
  public forgotPasswordForm: UntypedFormGroup;
  public resetPasswordForm: UntypedFormGroup;
  public selectedTabIndex = 1;
  public loading: boolean = false;
  public submittedReg: boolean = false;
  public submittedLogin: boolean = false;
  public submittedForgo: boolean = false;
  public submittedResetPwd: boolean = false;
  public showSignupSubmitScreen: boolean = false;
  public showLoginSignupScreen: boolean = true;
  public showResetPasswordScreen: boolean = false;
  public resetEmailValid: boolean = false; // Set false if validating
  public showForgotPasswordScreen: boolean = false;
  public forgotEmailValid: boolean = true; // Set false if validating
  public showResetPasswordSubmitScreen: boolean = false;
  public showForgotPasswordSubmitScreen: boolean = false;
  public showVerifyEmailScreen: boolean = false;
  public verifyEmailValid: boolean = true; // Set false if validating
  public emailVerificationStatus: boolean = false;
  public TokenStatus = TokenStatus;
  public tokenStatus = TokenStatus.Invalid;
  public designOption = APP_CONSTANTS.dropdownData;
  public userModel = new UserModel();
  public loginModel = new LoginModel();
  public token : string;
  public currentRoute: string = APP_CONSTANTS.emptyString;
  public resetPasswordMessage: string = APP_CONSTANTS.emptyString;
  public isEmailValidOnReset: boolean = false;
  public isEmailInValidOnReset: boolean = false;
  public isLoadRequired: any;

  constructor(
    public formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public userService: UserService,
    public router: Router,
    public route: ActivatedRoute,
    public toastr: ToastrService,
    public authService: AuthService,
    private accountService: AccountService,
    private sharedService: SharedService) {
      router.events.pipe(
            filter(event => event instanceof NavigationEnd)).subscribe(event => {
            this.currentRoute = event['url'];
            this.isLoadRequired = router.getCurrentNavigation()?.extras.state;
            const treeStructure: UrlTree = router.parseUrl(event['url']);
            const segmentGroup: UrlSegmentGroup = treeStructure.root.children[PRIMARY_OUTLET];
            const segment: UrlSegment[] = segmentGroup?.segments;
            const pathName = segment ? segment[0].path : APP_CONSTANTS.login;
             // returns 'team'
            if (segment) {
            switch ('/'+pathName) {
              case APP_CONSTANTS.loginPage:
              this.selectedTabIndex = 1;
              break;
              case APP_CONSTANTS.signUpPage:
              this.selectedTabIndex = 0;
              break;
              case APP_CONSTANTS.forgotPasswordPage:
              this.onForgotPassword();
              break;
              case APP_CONSTANTS.resetPasswordPage:
                if(this.sharedService.CheckIfEmptyOrNull(this.isLoadRequired) === APP_CONSTANTS.emptyString
                && (this.isLoadRequired?.isLoadRequired === undefined ||
                  this.isLoadRequired?.isLoadRequired === APP_CONSTANTS.null ||
                  this.isLoadRequired?.isLoadRequired === APP_CONSTANTS.false)) {
                  this.onResetPasswordPage()
                }
              break;
              case APP_CONSTANTS.verifyEmail:
                if(this.sharedService.CheckIfEmptyOrNull(this.isLoadRequired) === APP_CONSTANTS.emptyString
                && (this.isLoadRequired?.isLoadRequired === undefined ||
                  this.isLoadRequired?.isLoadRequired === APP_CONSTANTS.null ||
                  this.isLoadRequired?.isLoadRequired === APP_CONSTANTS.false)) {
                    this.onVerifyEmailPage();
                }
              break;
            }
            }
        });
     }

  ngOnInit(): void {
    this.initializeRegForm();
    this.loginRegForm();
  }

  /**
   * function to Initilize Register form
   */

  public initializeRegForm(): void {
    this.registerForm = this.formBuilder.group({
      FirstName: [APP_CONSTANTS.emptyString, Validators.required],
      LastName: [APP_CONSTANTS.emptyString, Validators.required],
      CompanyName: [APP_CONSTANTS.emptyString, [Validators.required, Validators.pattern(/^[a-zA-Z0-9-&. ]*$/)]],
      Designation: [APP_CONSTANTS.emptyString],
      EmailId: [APP_CONSTANTS.emptyString, [Validators.required, Validators.email, Validators.pattern]],
      ContactNo: [APP_CONSTANTS.emptyString, Validators.pattern(/^[0-9 +()-]*$/)],
      AgreeTermsAndConditions: [APP_CONSTANTS.false],
      IsApproved: [APP_CONSTANTS.false],
      StatusId: 0,
    });
  }

  /**
   * function to Initilize Login form
   */

  public loginRegForm(): void {
    this.loginForm = this.formBuilder.group({
      userName: [APP_CONSTANTS.emptyString, Validators.required],
      password: [
        APP_CONSTANTS.emptyString,
        [Validators.required, Validators.minLength(8)],
      ],
    });
  }

  /**
   * function to Initilize Forgot Password form
   */

 public initializeForgotPasswordForm(): void {
  this.forgotPasswordForm = this.formBuilder.group({
    EmailId: [APP_CONSTANTS.emptyString, [Validators.required, Validators.email]]
  });
 }

  /**
   * function to Initilize Reset Password form
   */

  public initializeResetPasswordForm(): void {
    this.resetPasswordForm = this.formBuilder.group({
      Password: [APP_CONSTANTS.emptyString, {
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
      equalValidators.fieldEqual('Password', 'ConfirmPassword', { 'isFieldEqual': true })
    ])});
   }

  /**
   * function to convenience getter for easy access to login and signup form fields
   */

  get signup() {
    return this.registerForm.controls;
  }
  get login() {
    return this.loginForm.controls;
  }
  get forgot() {
    return this.forgotPasswordForm.controls;
  }
  get reset() {
    return this.resetPasswordForm.controls;
  }

  /**
   * function to submit registration form
   */

  public onSubmitRegForm(): void {
    this.submittedReg = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;
    this.userModel = Object.assign(this.registerForm.value);
        // convert mobile/phone number (numeric value) to string because we have used numeric directive.
        this.userModel.ContactNo = this.sharedService.CheckIfEmptyOrNull(this.registerForm.value.ContactNo);
    //call service
    this.userService.SignUp(this.userModel).subscribe(
      (result) => {
        this.showLoginSignupScreen = false;
        this.showSignupSubmitScreen = true;
        this.toastr.success(
          'Click on the verification link sent to your email address.'
        );
      },
      (error) => {
        this.toastr.error(
          'Sign up failed. Please contact support.'
        );
      }
    );
  }

  /**
   * function to submit login form
   */

  public onSubmitLoginForm(): void {
    this.submittedLogin = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.loginModel = Object.assign(this.loginForm.value);
    //call service
    this.userService.Login(this.loginModel).subscribe(
      (result) => {
        if(result?.data?.login){
          this.authService.initialize(result?.data?.login);
          ApiService.LastActivityTime=new Date();
          this.router.navigate([APP_CONSTANTS.dashboard]);
        }
      },
      (error) => {
        this.loginForm.get('username')?.setErrors({ 'incorrect': true});
      }
    );
  }

  /**
   * function to open terms and conditions dialogue model popup
   */

  public openDialog(): void {
    const dialogRef = this.dialog.open(TermsAndConditionsDialog);
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== APP_CONSTANTS.undefined) {
        this.registerForm.patchValue({
          AgreeTermsAndConditions: result
        });
      }
    });
  }

  public onForgotPassword(): void {
    this.showLoginSignupScreen = false;
    // this.currentRoute !== APP_CONSTANTS.emptyString ? this.router.navigate([this.currentRoute]) :
    this.router.navigate([APP_CONSTANTS.forgotPassword]);
    this.initializeForgotPasswordForm();
    this.showForgotPasswordScreen = true;
  }

  public onSubmitForgotPassword(): void {
    this.submittedForgo = true;
    // stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    this.accountService
      .forgotPassword(this.forgotPasswordForm.value.EmailId)
      .subscribe({
        next: () => {
          this.showForgotPasswordScreen = false;
          this.showForgotPasswordSubmitScreen = true;
        },
        error: (error) => ({}),
      });
  }

  public onBackToLogin(): void {
    this.router.navigate([APP_CONSTANTS.login]);
    this.showLoginSignupScreen = true;
    this.showForgotPasswordScreen = false;
  }

  public onResetPasswordPage(): void {
    this.initializeResetPasswordForm();
    this.showLoginSignupScreen = false;

    this.resetEmailValid = true;
    this.showResetPasswordScreen = true;
    this.tokenStatus = TokenStatus.Validating;
    this.isEmailValidOnReset = true;
    setTimeout(()=> {
      const token = this.route.snapshot.queryParams['token'];
      if (!token) {
        this.tokenStatus = TokenStatus.Invalid;
        this.isEmailValidOnReset = false;
        return;
      }
      // remove token from url to prevent http referer leakage
      this.router.navigate([], { relativeTo: this.route, replaceUrl: true, state: {isLoadRequired: true} },);
      this.accountService.validateResetToken(token).subscribe(
        {
        next: () => {
          this.tokenStatus = TokenStatus.Valid;
          this.token = token;
          this.resetEmailValid = false;
        },
        error: (error) => {
          this.tokenStatus = TokenStatus.Invalid;
          this.isEmailValidOnReset = false;
        },
        complete: () => {
        }
      });
    }, 1000)
  }



  public onVerifyEmailPage(): void {
    this.showLoginSignupScreen = false;
    this.showVerifyEmailScreen = true;
    const token = this.route.snapshot.queryParams['token'];
    if (!token) {
      this.verifyEmailValid = false;
      this.emailVerificationStatus = false;
      return;
    }
    // remove token from url to prevent http referer leakage
    this.router.navigate([], { relativeTo: this.route, replaceUrl: true, state: {isLoadRequired: true} });
    this.accountService.verifyEmail(token).subscribe(
      (result) => {
        this.verifyEmailValid = false;
        this.emailVerificationStatus = true;
      },
      (error) => {
        this.verifyEmailValid = false;
        this.emailVerificationStatus = false;
      }
    );
  }

  public onSubmitResetPassword(): void {
    this.showResetPasswordScreen = false;
    this.showResetPasswordSubmitScreen = true;
    this.submittedResetPwd = true;
    if (this.resetPasswordForm.invalid) {
      return;
    }
    this.accountService
      .resetPassword(
        this.token,
       this.resetPasswordForm.value.Password,
       this.resetPasswordForm.value.ConfirmPassword
      )
      .subscribe(
        {
        next: () => {
          this.resetPasswordMessage = 'Your password reset is successful. Please login with new password.';
          this.router.navigate(['../login'], { relativeTo: this.route }).then(() => {
            this.toastr.success('Password reset successful!','',{tapToDismiss:true});
          });
        },
        error: (error) => {
          this.resetPasswordMessage = 'Your password reset has failed. Please contact <a style="color: #0d6efd;" href="mailto:rclsupport@standardrail.com?Subject=Railcar Lounge: ">support.</a>';
          this.loading = false;
        },
      });
  }

  public selectedTabChange(event): void {
    if (event.index === 0) {
      this.router.navigate([APP_CONSTANTS.signUp]);
    } else {
      this.router.navigate([APP_CONSTANTS.login]);
    }
  }

  public checkUserIncorrect(): void {
    if (this.loginForm.get('username')?.hasError('incorrect')) {
      this.loginForm.get('username')?.setErrors(null);
    }
  }
}

@Component({
  selector: 'terms-and-conditions-dialogue',
  templateUrl: 'terms-and-conditions-dialogue.html',
})
export class TermsAndConditionsDialog {
  public todayDate: Date = new Date();
}
