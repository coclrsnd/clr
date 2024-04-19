import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";

import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";

import { RouterModule, Routes } from "@angular/router";
import { AuthModule } from "./auth/auth.module";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { environment } from "../environments/environment";
import { RouterState, StoreRouterConnectingModule } from "@ngrx/router-store";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { EffectsModule } from "@ngrx/effects";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { metaReducers, reducers } from "./reducers";
import { AuthGuard } from "./auth/auth.guard";
import { EntityDataModule } from "@ngrx/data";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "./shared/shared.module";
import { ApiInterceptor } from "./shared/services/api.interceptor";
import { ToastrModule } from "ngx-toastr";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./loans/loans.module").then((m) => m.LoansModule),
    canActivate: [AuthGuard],
  },
  {
    path: "sign-up",
    loadChildren: () =>
      import("./sign-up/signup.module").then((m) => m.SignupModule),
  },
  {
    path: "upload",
    loadChildren: () =>
      import("./uploadfile/upload.modules").then((m) => m.UploadModule),
  },
  {
    path: "**",
    redirectTo: "/",
  },
];

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
    MatInputModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    SharedModule,
    AuthModule.forRoot(),
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
      stateKey: "router",
      routerState: RouterState.Minimal,
    }),
    ToastrModule.forRoot(),
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
  ],
})
export class AppModule {}
