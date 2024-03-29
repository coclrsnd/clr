import { Component, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router'
import { AppState } from './reducers'
import { login, logout } from './pages/login/store/auth.actions'
import { isLoggedIn, isLoggedOut } from './pages/login/store/auth.selectors'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  loading = true

  isLoggedIn$: Observable<boolean>

  isLoggedOut$: Observable<boolean>

  constructor(
    private router: Router,
    private store: Store<AppState>,
  ) {}

  ngOnInit() {
    const userProfile = localStorage.getItem('user')

    if (userProfile) {
      this.store.dispatch(
        login({
          userName: JSON.parse(userProfile).username,
          password: JSON.parse(userProfile).password,
        }),
      )
    }

    this.router.events.subscribe((event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true
          break
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false
          break
        }
        default: {
          break
        }
      }
    })

    this.isLoggedIn$ = this.store.pipe(select(isLoggedIn))

    this.isLoggedOut$ = this.store.pipe(select(isLoggedOut))
  }

  logout() {
    this.store.dispatch(logout())
  }
}