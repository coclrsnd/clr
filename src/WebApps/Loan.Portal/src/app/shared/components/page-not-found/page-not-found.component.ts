import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APP_CONSTANTS } from 'src/app/app-constants';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  constructor(private router: Router, private authService:AuthService) { }

  ngOnInit(): void {
    const isUserLoggedIn = this.authService.isLoggedIn();
    if(!isUserLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  public onDashboard(): void {
    this.router.navigate([APP_CONSTANTS.dashboard]);
  }

}
