import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { select, Store } from "@ngrx/store";
import { tap } from "rxjs/operators";
import { AppState } from "../reducers";
import { isDevSupport, selectUserDetails } from "../auth/auth.selectors";

@Injectable()
export class SignGuard {
  constructor(
    private store: Store<AppState>,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.store.pipe(
      select(isDevSupport),
      tap((devSupport) => {
        if (devSupport) {
          return true;
        }
        else {
          return false;
        }
      }),
    );
  }
}
