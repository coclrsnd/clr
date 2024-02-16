import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { SecurityContext } from '../shared/models/SecurityContext';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  storageKey: string = 'token';
  openedNavigationKey: string = 'openedNavigation';
  private baseUrl = environment.apiUrl;
  authSecurityContext: SecurityContext = new SecurityContext();
  public static securityContext: SecurityContext;
  public isValidSecurityToken: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  options: any;
  headers: any;

  constructor(public router: Router){}

  initialize(securityContext: SecurityContext) {
    // Store token in local storage
    localStorage.setItem(this.storageKey, securityContext.token);

    if (securityContext.userId != undefined && securityContext.userId != "") {
      // Initialize UserContext
      ApiService.UserId = securityContext.userId;
      ApiService.RoleName = securityContext.roleName;
      ApiService.LogoPath = securityContext.logoPath;
      ApiService.Token = securityContext.token;
      ApiService.EmailId = securityContext.emailId;
      ApiService.TenantId = securityContext.tenantId;
      ApiService.OrganizationId=securityContext.organizationId;
      ApiService.Name = securityContext.name;
      ApiService.CurrentRole=securityContext.currentRole;
      AuthService.securityContext = securityContext;
      this.isValidSecurityToken.next(true);
    }
  }

 public hasPermission(permission :string): boolean{
    let jwtHelper: JwtHelperService = new JwtHelperService();
    let decodedToken = jwtHelper.decodeToken(localStorage.getItem(this.storageKey));
    if (decodedToken != undefined) {
    let features = decodedToken["Features"];
      if(features.includes(permission)){
        return true;
      }
      else{
        return false;
      }
    }
  }

  public GetOnboardLink():string{
    this.getUserId();
    if(ApiService.CurrentRole.startsWith('Vendor')){
      return 'on-board/vendor/create';
    }
    else{
      return 'on-board/customer/create';
    }
  }

  public GetSearchLink():string{
    this.getUserId();
    if(ApiService.CurrentRole.startsWith('Vendor')){
      return 'search/rider';
    }
    else{
      return 'search/facility';
    }
  }

  public getUserId():number{
    if(ApiService.UserId==''){
      let jwtHelper: JwtHelperService = new JwtHelperService();
      let decodedToken = jwtHelper.decodeToken(localStorage.getItem(this.storageKey));
      if (decodedToken != undefined) {
        var userClaim = decodedToken["UserId"];
        if(userClaim!=undefined && userClaim!=''){
          let claims = userClaim.split('|');
          ApiService.UserId = claims[0];
          ApiService.OrganizationId=claims[1];
          ApiService.TenantId=claims[2];
          ApiService.EmailId=claims[3];
          ApiService.Name=claims[4];
        }

        var userRole = decodedToken["role"];
        if(userRole != undefined && userRole.length !=''){
          ApiService.RoleName=userRole;
        }

        var currentRole = decodedToken["CurrentRole"];
        if(currentRole != undefined && currentRole.length !=''){
          ApiService.CurrentRole=currentRole;
        }
      }
      return +ApiService.UserId;
    }
  }

  // getCurrentRole(userRole:string):string{
  //     let roles = userRole.split(',');
  //     if(roles.length>1)
  //     {
  //       if(roles.includes('Customer')){
  //         return 'Customer';
  //       }
  //       else{
  //         return roles[0];
  //       }
  //     }
  //     else{
  //       return roles[0];
  //     }
  // }


  getToken() {
    return localStorage.getItem(this.storageKey);
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }
}
