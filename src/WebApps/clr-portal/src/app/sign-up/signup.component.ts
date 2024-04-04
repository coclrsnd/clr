import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { SignupService } from "./services/signup.service";
import { map, startWith, switchMap, tap } from "rxjs/operators";
import { Organization } from "./model/organization";
import { Store, select } from "@ngrx/store";
import { SignupComponentStore } from "./signup.component.store";

@Component({
  selector: "app-signup",
  styleUrls: ["signup.component.scss"],
  templateUrl: "signup.component.html",
  providers: [SignupComponentStore],
})
export class SignupComponent implements OnInit {
  userForm: FormGroup;
  filteredOrganizations$: Observable<Organization[]>;
  signupSuccess$: Observable<boolean>;
  signupFailed$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private signupStore: SignupComponentStore,
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      phoneNumber: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
      organizationCode: ["", Validators.required],
    });

    this.filteredOrganizations$ = this.signupStore.filteredOrganizations$;
    this.userForm
      .get("organizationCode")
      .valueChanges.pipe(
        startWith(""),
        tap((value) => this.signupStore.filterOrganizations(value)),
      )
      .subscribe();

    this.signupSuccess$ = this.signupStore.isUserCreated$;
    this.signupFailed$ = this.signupStore.errorOnSignup$;
  }

  displayOrganizationFn(organization?: any): string | undefined {
    return organization ? organization.name : undefined;
  }

  onSubmit(): void {
    var signupRequestModel = this.userForm.getRawValue();
    signupRequestModel.organizationCode =
      signupRequestModel.organizationCode["code"];
    this.signupStore.signup(signupRequestModel);
  }
}
