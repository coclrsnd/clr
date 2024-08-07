import { Component, OnInit, ViewChild } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from "@angular/router";
import { AppState } from "./reducers";
import {
  isLoggedIn,
  isLoggedOut,
  selectUserDetails,
} from "./auth/auth.selectors";
import { login, loginSuccess, logout } from "./auth/auth.actions";
import { User } from "./auth/model/user.model";
import { FormBuilder } from "@angular/forms";
import { NavigationExtras } from "@angular/router";
import { EventbusService } from "./eventbus.service";
import { MatSidenav } from "@angular/material/sidenav";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  @ViewChild("sidenav") sidenav: MatSidenav;
  loading = true;

  isLoggedIn$: Observable<boolean>;

  isLoggedOut$: Observable<boolean>;
  userDetails$: Observable<User>;
  currentRoute: string;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private eventBus: EventbusService,
  ) {
    this.eventBus.sidenavClose.subscribe(() => {
      this.sidenav.close();
    });
  }

  ngOnInit() {
    const userProfile = JSON.parse(localStorage.getItem("user")) as User;
    if (userProfile) {
      this.store.dispatch(loginSuccess({ user: userProfile }));
    }

    this.router.events.subscribe((event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });

    this.isLoggedIn$ = this.store.pipe(select(isLoggedIn));
    this.userDetails$ = this.store.pipe(select(selectUserDetails));
    this.isLoggedOut$ = this.store.pipe(select(isLoggedOut));
  }

  logout() {
    this.store.dispatch(logout());
  }

  refreshData() {
    location.reload();
  }
}
