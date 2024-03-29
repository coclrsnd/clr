import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatMenuModule } from '@angular/material/menu'
import { MatIconModule } from '@angular/material/icon'

import { MatListModule } from '@angular/material/list'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatToolbarModule } from '@angular/material/toolbar'
import { HttpClientModule } from '@angular/common/http'

import { RouterModule, Routes } from '@angular/router'
import { StoreModule } from '@ngrx/store'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { environment } from '../environments/environment'
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store'

import { EffectsModule } from '@ngrx/effects'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { metaReducers, reducers } from './reducers'
import { EntityDataModule } from '@ngrx/data'
import { LoginModule } from './pages/login/login.module'
import { AuthGuard } from './pages/login/gaurds/auth.guard'
import { SignupModule } from './pages/sign-up/signup.module'
import { DashboardModule } from './pages/dashboard/dashboard.module'

const routes: Routes = [
  {
    path: 'courses',
    loadChildren: () =>
      import('./courses/courses.module').then((m) => m.CoursesModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./pages/sign-up/signup.module').then((m) => m.SignupModule),
  },
  {
    path: '**',
    redirectTo: '/',
  },
]

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, {}),
    HttpClientModule,
    MatMenuModule,
    MatIconModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatToolbarModule,
    DashboardModule,
    LoginModule.forRoot(),
    SignupModule.forRoot(),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictActionSerializability: true,
        strictStateSerializability: true,
      },
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
      connectInZone: true,
    }),
    EffectsModule.forRoot([]),
    EntityDataModule.forRoot({}),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
      routerState: RouterState.Minimal,
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}