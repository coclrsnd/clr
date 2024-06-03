import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";

import { Store, select } from "@ngrx/store";

import { AuthService } from "../auth.service";
import { tap } from "rxjs/operators";
import { Observable, noop } from "rxjs";
import { Router } from "@angular/router";
import { AppState } from "../../reducers";
import { login } from "../auth.actions";
import { AuthActions } from "../action-types";
import { errorOnLogin } from "../auth.selectors";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  form: UntypedFormGroup;
  errorOnLogin$: Observable<boolean>;
  phoneNumber: string = '9019775970';
  constructor(
    private fb: UntypedFormBuilder,
    private auth: AuthService,
    private router: Router,
    private store: Store<AppState>,
  ) {
    this.form = fb.group({
      email: ["", [Validators.required, Validators.email,customEmailValidator]],
      password: ["", [Validators.required]],
    });
  }

  ngOnInit() {
    this.errorOnLogin$ = this.store.pipe(select(errorOnLogin));
  }

  login() {
    const val = this.form.value;
    this.store.dispatch(login({ userName: val.email, password: val.password }));
  }
}
export function customEmailValidator(control: AbstractControl): { [key: string]: any } | null {
  const emailPattern = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)*(\.[a-zA-Z]{2,})$/;
  const valid = emailPattern.test(control.value);
  return valid ? null : { invalidEmail: { value: control.value } };
}