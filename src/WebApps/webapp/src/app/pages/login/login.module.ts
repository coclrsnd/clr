import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatInputModule } from '@angular/material/input'
import { RouterModule } from '@angular/router'
import { StoreModule } from '@ngrx/store'
import { LoginComponent } from './login.component'
import { authReducer } from './store/auth.reducers'
import { EffectsModule } from '@ngrx/effects'
import { AuthEffects } from './store/auth.effects'
import { ModuleWithProviders, NgModule } from '@angular/core'
import { AuthService } from './services/auth.service'
import { AuthGuard } from './gaurds/auth.guard'

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    RouterModule.forChild([{ path: '', component: LoginComponent }]),
    StoreModule.forFeature('auth', authReducer),
    EffectsModule.forFeature([AuthEffects]),
  ],
  declarations: [LoginComponent],
  exports: [LoginComponent],
})
export class LoginModule {
  static forRoot(): ModuleWithProviders<LoginModule> {
    return {
      ngModule: LoginModule,
      providers: [AuthService, AuthGuard],
    }
  }
}
