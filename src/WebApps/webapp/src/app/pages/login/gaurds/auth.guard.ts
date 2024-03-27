import { Injectable } from '@angular/core'
import { Store, select } from '@ngrx/store'
import { AppState } from '../../../reducers'
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router'
import { Observable } from 'rxjs'
import { isLoggedIn } from '../store/auth.selectors'
import { tap } from 'rxjs/operators'

@Injectable()
export class AuthGuard {
  constructor(
    private store: Store<AppState>,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.store.pipe(
      select(isLoggedIn),
      tap((loggedIn) => {
        if (!loggedIn) {
          this.router.navigateByUrl('/login')
        }
      }),
    )
  }
}
