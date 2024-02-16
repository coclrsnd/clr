import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public router: Router, public authService: AuthService) {

  }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      var permission = route.data["permission"]; 

      if(permission==true)
      {
        return true;
      }

      if (permission === null || !this.authService.hasPermission(permission)) { 
        this.router.navigate(["../components/page-not-found/app-page-not-found"]);
        return false;
      }
  
      return true;
  }
  
}
