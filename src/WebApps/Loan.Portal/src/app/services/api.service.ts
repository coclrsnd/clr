import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse, HttpBackend, HttpErrorResponse, HttpParams } from '@angular/common/http';
/*import { Observable } from 'rxjs/Observable';*/
//import { catchError, map, tap } from 'rxjs/operators';

//import { ErrorObservable } from "rxjs/observable/ErrorObservable";
/*import { environment } from "../../../environments/environment";*/
//import { EntityModel } from "../../modules/ots/shared/models/EntityModel";
import { JwtHelperService } from "@auth0/angular-jwt";
//import { ErrorMessageService } from "./errormessage.service";
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AppConfigService } from './app-config.service';
import { APP_CONSTANTS } from '../app-constants';
import { MatDialog } from '@angular/material/dialog';
/*import { AppConfigService } from "./app-config.service";*/


@Injectable()
export class ApiService<T>
{
  private baseUrl = environment.apiUrl;
  private httpBackendClient: HttpClient;
  public static UserId: string = '';
  public static EmailId: string = '';
  public static Token: string = '';
  public static RoleName: string = '';
  public static Name: string = '';
  public static OrganizationId: string = '';
  public static LogoPath: string = '';
  public static TenantId: string = '';
  public static CurrentRole: string = '';
  public static LastActivityTime: Date = new Date();
  alive: boolean = true;
  public responseType: any;
  openedNavigationKey: string = 'openedNavigation';

  constructor(
    private httpClient: HttpClient,
    //private errorService: ErrorMessageService,
    private dialogRef: MatDialog,
    private router: Router,
    private appConfigService: AppConfigService,
    private backendHandler: HttpBackend) {
    this.getRefreshTokenAsynchronously();
    this.httpBackendClient = new HttpClient(this.backendHandler);
  }
  storageKey: string = 'Token';
  //storageShortKey: string = 'ShortToken';

  httpOptions = {
    headers: this.getHttpHeaders()
  };

  getHttpHeaders() {
    return new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`,
        //'UserId': `${ApiService.UserId}`,
        //'RoleName': ApiService.RoleName,
        //'UserIdentifier': `${ApiService.userIdentifier}`,
        //'EmailId': `${ApiService.EmailId}`,
        //'OrganizationId': `${ApiService.OrganizationId}`,
        //'SecurityString': `${ApiService.securityString}`,
        'RefreshToken': `${this.getToken()}`,
        //'TimeZoneName': `${ApiService.timezoneName}`
      })
  }

  getToken() {
    return localStorage.getItem(this.storageKey);
  }

  get(url: string): Observable<T[]> {
    this.isCurrentSessionExpired(url)
    return this.httpClient.get<T[]>(`${this.baseUrl}/${url}`, this.httpOptions);
  }

  getEntity(url: string): Observable<T> {
    this.isCurrentSessionExpired(url)
    return this.httpClient.get<T>(`${this.baseUrl}/${url}`, this.httpOptions);
  }

  //getByPaging(url: string): Observable<EntityModel<T>> {
  //  //this.isCurrentSessionExpired(url)
  //  return this.httpClient.get<EntityModel<T>>(`${this.baseUrl}/${url}`, this.httpOptions);
  //}

  //getByPagingWithPost(url: string, model: T): Observable<EntityModel<T>> {
  //  //this.isCurrentSessionExpired(url)
  //  return this.httpClient.post<EntityModel<T>>(`${this.baseUrl}/${url}`, model, this.httpOptions);
  //}

  getById(url: string): Observable<T[]> {
    this.isCurrentSessionExpired(url)
    return this.httpClient.get<T[]>(`${this.baseUrl}/${url}`, this.httpOptions);
  }

  getSingleObjectById(url: string): Observable<T> {
    this.isCurrentSessionExpired(url)
    return this.httpClient.get<T>(`${this.baseUrl}/${url}`, this.httpOptions);
  }

  getDataWithPost(url: string, model: T): Observable<T[]> {
    this.isCurrentSessionExpired(url)
    return this.httpClient.post<T[]>(`${this.baseUrl}/${url}`, model, this.httpOptions);
  }

  post(url: string, model: T): Observable<T> {
    this.isCurrentSessionExpired(url)
    this.httpOptions.headers = this.getHttpHeaders();
    return this.httpClient.post<T>(`${this.baseUrl}`, model, this.httpOptions);
  }


  postWithoutModel(url: string): Observable<T> {
    this.isCurrentSessionExpired(url)
    return this.httpClient.post<T>(`${this.baseUrl}/${url}`, null, this.httpOptions);
  }

  postWithoutModelBackend(url: string): Observable<T> {
    this.isCurrentSessionExpired(url)
    return this.httpBackendClient.post<T>(`${this.baseUrl}/${url}`, null, this.httpOptions);
  }

  postArrayOfModel(url: string, model: T[]): Observable<T> {
    this.isCurrentSessionExpired(url)
    return this.httpClient.post<T>(`${this.baseUrl}/${url}`, model, this.httpOptions);
  }

  postArray(url: string, model: T[]): Observable<T[]> {
    this.isCurrentSessionExpired(url)
    return this.httpClient.post<T[]>(`${this.baseUrl}/${url}`, model, this.httpOptions);
  }

  put(url: string, model: T): Observable<T> {
    this.isCurrentSessionExpired(url)
    return this.httpClient.put<T>(`${this.baseUrl}/${url}`, model, this.httpOptions);
  }

  putArrayOfModel(url: string, model: T[]): Observable<T> {
    this.isCurrentSessionExpired(url)
    return this.httpClient.put<T>(`${this.baseUrl}/${url}`, model, this.httpOptions);
  }

  isValid(url: string): Observable<boolean> {
    this.isCurrentSessionExpired(url)
    return this.httpClient.get<boolean>(`${this.baseUrl}/${url}`, this.httpOptions);
  }
  delete(url: string): Observable<T> {
    this.isCurrentSessionExpired(url)
    return this.httpClient.delete<T>(`${this.baseUrl}/${url}`, this.httpOptions);
  }

  // public handleError(err: HttpErrorResponse): ErrorObservable {
  //  let errorMessage: string;
  //  if (err.error instanceof Error) {
  //    errorMessage = `An error occurred: ${err.error.message}`;
  //  } else {
  //    errorMessage = `Backend returned code ${err.status}, body was: ${err.error}`;
  //  }
  //  return new ErrorObservable(errorMessage);
  // }

  postFile(url: string, model: T, response:string): Observable<T> {
    this.isCurrentSessionExpired(url);
    switch (response) {
      case 'blob':
        this.responseType = 'blob' as 'json'
        break;
      default:
        this.responseType = ''
        break;
    }
    let httpOptions = {
      headers: new HttpHeaders(
        {
          'Authorization': `Bearer ${this.getToken()}`,
          'RefreshToken': `${this.getToken()}`,
        }),
      responseType: this.responseType,
    };
    return this.httpClient.post<T>(`${this.baseUrl}/${url}`, model, httpOptions);
  }

  //postFile(url: string, model: T): Observable<T> {
  //  //this.isCurrentSessionExpired(url)
  //  let httpOptions = {
  //    headers: new HttpHeaders(
  //      {
  //        'Authorization': `Bearer ${this.getToken()}`,
  //        'UserId': `${ApiService.userId}`,
  //        'RoleName': ApiService.roleName,
  //        'UserIdentifier': `${ApiService.userIdentifier}`,
  //        'Locale': `${ApiService.Locale}`,
  //        'Organization': `${ApiService.organization}`,
  //        'SecurityString': `${ApiService.securityString}`,
  //        'RefreshToken': `${this.getToken()}`,
  //        'TimeZoneName': `${ApiService.timezoneName}`
  //      }),
  //    responseType: 'blob' as 'json',
  //  };
  //  return this.httpClient.post<T>(`${this.baseUrl}/${url}`, model, httpOptions);
  //}

  getFile(url: string): Observable<any> {
    //this.isCurrentSessionExpired(url)
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      //'UserId': `${ApiService.userId}`,
      //'RoleName': ApiService.roleName,
      //'UserIdentifier': `${ApiService.userIdentifier}`,
      //'Locale': `${ApiService.Locale}`,
      //'Organization': `${ApiService.organization}`,
      //'SecurityString': `${ApiService.securityString}`,
      'RefreshToken': `${this.getToken()}`,
      //'TimeZoneName': `${ApiService.timezoneName}`
    });
    return this.httpClient.get(`${this.baseUrl}/${url}`, { headers, responseType: 'blob' });
  }

  //postBlobFile(url: string, model: T): Observable<T> {
  //  //this.isCurrentSessionExpired(url)
  //  let headers = new HttpHeaders({
  //    'Authorization': `Bearer ${this.getToken()}`,
  //    'UserId': `${ApiService.userId}`,
  //    'RoleName': ApiService.roleName,
  //    'UserIdentifier': `${ApiService.userIdentifier}`,
  //    'Locale': `${ApiService.Locale}`,
  //    'Organization': `${ApiService.organization}`,
  //    'SecurityString': `${ApiService.securityString}`,
  //    'RefreshToken': `${this.getToken()}`,
  //    'TimeZoneName': `${ApiService.timezoneName}`
  //  });
  //  return this.httpClient.post<T>(`${this.baseUrl}/${url}`, model, { headers, responseType: 'blob' as 'json' });
  //}

  setLastActivity() {
    ApiService.LastActivityTime = new Date();
  }

  isCurrentSessionExpired(url: string) {
    //if (!url.includes("GetInAppNotificationsByUserId") && !url.includes("GetInAppNotificationsCount")) {
    if (this.isTimeOut()) {
      localStorage.removeItem(this.storageKey);
      //localStorage.removeItem(this.storageShortKey);
      //this.errorService.setErrorMessage("", 10223);
      this.router.navigate(['/error']);
      return false;
    }
    this.setLastActivity();
    //}
    this.httpOptions.headers = this.getHttpHeaders();
  }

  getRefreshToken() {

    let currentTime = new Date().toString();
    let jwtHelper: JwtHelperService = new JwtHelperService();
    let decodedToken = jwtHelper.decodeToken(this.getToken());
    if (decodedToken != undefined) {
      let numericExpTime = new Date(0).setSeconds(decodedToken.exp);
      let TokenExpTime = new Date(numericExpTime).toString();

      let diffInMs: number = Date.parse(TokenExpTime) - Date.parse(currentTime);
      let diffInminute: number = diffInMs / 1000 / 60;

      if (diffInminute < this.appConfigService.config.TokenExpCheckTime) {

        this.getNewToken().
          subscribe({
            next: (s) => {
              let refreshtoken = s.Token as string;
              localStorage.removeItem(this.storageKey);
              localStorage.setItem(this.storageKey, refreshtoken);
            },
            error: (error) => {
              localStorage.removeItem('Token');
              this.router.navigate([APP_CONSTANTS.login]);
              //toaster message.
            },
          });



        //  this.getNewToken().subscribe(s => {
        //    let refreshtoken = s.Token as string;
        //    //let shortToken = s.ShortToken as string;
        //    localStorage.removeItem(this.storageKey);
        //    localStorage.setItem(this.storageKey, refreshtoken);
        //    //localStorage.setItem(this.storageShortKey, shortToken);
        //  });
      }

    }
  }


  getNewToken(): Observable<any> {
    let url: string = "api/user/GetRefreshToken";
    return this.httpClient.get(`${this.baseUrl}/${url}`, this.httpOptions);
  }

  getBoolean(url: string): Observable<boolean> {
    this.isCurrentSessionExpired(url)
    return this.httpClient.get<boolean>(`${this.baseUrl}/${url}`, this.httpOptions);
  }

  isTokenExpired() {
    if (!this.isTimeOut()) {
      if (this.getToken() != undefined) {
        this.getRefreshToken();
      }
    }
    else {
      this.logout();
    }
  }

  isTimeOut(): boolean {
    let currentTime = new Date().toString();
    let lastActivityTime = ApiService.LastActivityTime.toString();
    let diffInTime = Date.parse(currentTime) - Date.parse(lastActivityTime);
    let diffinActivity = diffInTime / 1000 / 60;
    if (diffinActivity < this.appConfigService.config.SessionTimeOutTime) {
      return false;
    }
    else {
      return true;
    }
  }

  async getRefreshTokenAsynchronously() {
    while (this.alive) {
      this.isTokenExpired();
      await this.sleep(this.appConfigService.config.RefreshTokenUpdateCheckFrequency);
    }
  }
  sleep(interval: number) {
    return new Promise(resolve => setTimeout(resolve, interval));
  }

  ngOnDestroy() {
    this.alive = false;
  }

  logout() {
    let navData: any = [];
    localStorage.setItem('openedNavigation', navData);
    localStorage.removeItem(this.storageKey);
    this.router.navigate(['/']);
    this.dialogRef.closeAll();
    this.alive = false;
  }
}




