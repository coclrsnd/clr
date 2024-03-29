import { ModuleWithProviders, NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { SignupComponent } from './signup.component'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { signupReducer } from './store/signup.reducer'
import { SignupEffects } from './store/signup.effect'
import { SignupService } from './services/signup.service'
import { AuthGuard } from '../login/gaurds/auth.guard'

@NgModule({
  declarations: [SignupComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: SignupComponent }]),
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    StoreModule.forFeature('signUp', signupReducer),
    EffectsModule.forFeature([SignupEffects]),
  ],
})
export class SignupModule {
  static forRoot(): ModuleWithProviders<SignupModule> {
    return {
      ngModule: SignupModule,
      providers: [SignupService, AuthGuard],
    }
  }
}
