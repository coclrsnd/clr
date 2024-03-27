import { Component, OnInit } from '@angular/core'
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { AuthService } from './services/auth.service'
import { Router } from '@angular/router'
import { AppState } from '../../reducers'
import { Store } from '@ngrx/store'
import { login } from './store/auth.actions'

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: UntypedFormGroup

  constructor(
    private fb: UntypedFormBuilder,
    private auth: AuthService,
    private router: Router,
    private store: Store<AppState>,
  ) {
    this.form = fb.group({
      email: ['test@angular-university.io', [Validators.required]],
      password: ['test', [Validators.required]],
    })
  }

  ngOnInit() {}

  login() {
    this.store.dispatch(
      login({
        username: this.form.controls['email'].value,
        password: this.form.controls['email'].value,
      }),
    )
  }
}
