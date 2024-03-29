import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Observable } from 'rxjs'
import { SignupService } from './services/signup.service'
import { map, startWith, switchMap } from 'rxjs/operators'
import { Organization } from './model/organization.model'
import { signUpSuccessfull, signupFalied } from './store/signup.selectors'
import { Store, select } from '@ngrx/store'
import { SignupState } from './store/signup.reducer'
import { signup } from './store/signup.actions'

@Component({
  selector: 'app-signup',
  styleUrls: ['signup.component.scss'],
  templateUrl: 'signup.component.html',
})
export class SignupComponent implements OnInit {
  userForm: FormGroup
  filteredOrganizations$: Observable<Organization[]>
  signupSuccess$: Observable<boolean>
  signupFailed$: Observable<boolean>

  constructor(
    private fb: FormBuilder,
    private signupService: SignupService,
    private store: Store<SignupState>,
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      organizationCode: ['', Validators.required],
    })

    this.filteredOrganizations$ = this.userForm
      .get('organizationCode')
      .valueChanges.pipe(
        startWith(''),
        map((value: Organization) =>
          typeof value === 'string' ? value : value.name,
        ),
        switchMap((name: string) =>
          name ? this._filterOrganizations(name) : [],
        ),
      )
    this.signupSuccess$ = this.store.pipe(select(signUpSuccessfull))
    this.signupFailed$ = this.store.pipe(select(signupFalied))
  }

  private _filterOrganizations(value: string): Observable<Organization[]> {
    const filterValue = value
    return this.signupService.searchOrganizations(filterValue)
  }

  displayOrganizationFn(organization?: any): string | undefined {
    return organization ? organization.name : undefined
  }

  onSubmit(): void {
    this.store.dispatch(signup({ signupRequest: this.userForm.getRawValue() }))
  }
}
