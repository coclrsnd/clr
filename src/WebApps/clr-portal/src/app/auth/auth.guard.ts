import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { select, Store } from "@ngrx/store";
import { tap } from "rxjs/operators";
import { stat } from "fs";
import { AppState } from "../reducers";
import { isLoggedIn } from "./auth.selectors";

@Injectable()
export class AuthGuard {
  constructor(
    private store: Store<AppState>,
    private router: Router,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.store.pipe(
      select(isLoggedIn),
      tap((loggedIn) => {
        if (!loggedIn) {
          this.router.navigateByUrl("/login");
        } else
          if (state.url === "/login" || state.url === "/" || state.url === "") {
            this.router.navigate["loans"];
          }
          else {
            return true;
          }
      }),
    );
  }
}
