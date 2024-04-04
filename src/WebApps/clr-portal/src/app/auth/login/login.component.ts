import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
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

  constructor(
    private fb: UntypedFormBuilder,
    private auth: AuthService,
    private router: Router,
    private store: Store<AppState>,
  ) {
    this.form = fb.group({
      email: ["", [Validators.required, Validators.email]],
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
