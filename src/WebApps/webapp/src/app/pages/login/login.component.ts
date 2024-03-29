import { Component, OnInit } from '@angular/core'
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { AuthService } from './services/auth.service'
import { Router } from '@angular/router'
import { AppState } from '../../reducers'
import { Store, select } from '@ngrx/store'
import { login } from './store/auth.actions'
import { errorOnLogin } from './store/auth.selectors'
import { Observable } from 'rxjs'
import { AuthState } from './store/auth.reducers'

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: UntypedFormGroup
  errorOnLogin$: Observable<boolean>

  constructor(
    private fb: UntypedFormBuilder,
    private store: Store<AuthState>,
  ) {
    this.form = fb.group({
      email: ['test@angular-university.io', [Validators.required]],
      password: ['test', [Validators.required]],
    })
  }

  ngOnInit() {
    this.errorOnLogin$ = this.store.pipe(select(errorOnLogin))
  }

  login() {
    this.store.dispatch(
      login({
        userName: this.form.controls['email'].value,
        password: this.form.controls['password'].value,
      }),
    )
  }
}
