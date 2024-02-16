import { Injectable } from '@angular/core';
import { Observable, map, retry, tap } from 'rxjs';
import { ApiService } from '../services/api.service';
import { ChangePassword } from './changepassword.model';
import { LoginModel } from './LoginModel';
import { UserModel } from './UserModel';
import { LOGIN_GRAPHQL, USER_BY_ID } from './login.graphql';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserService {
  UsersApiRoutePrefix: string = 'api/User';
  graphQLURL = environment.apiUrl;

  constructor(
    private apiSignUpService: ApiService<UserModel>,
    private apiLoginService: ApiService<LoginModel>,
    private apiUserService: ApiService<any>,
    private apiUserProfileService: ApiService<ChangePassword>,
    private httpClient: HttpClient
  ) {}

  SignUp(model: UserModel): Observable<UserModel> {
    //let route: string = this.UsersApiRoutePrefix.concat(`/SignUp`);
    let route: string = 'api/Accounts/register';
    return this.apiSignUpService.post(route, model).pipe(
      retry(0)
      //catchError(this.handleError)
    );
  }

  Login(model: LoginModel): Observable<any> {
    model.organizationCode = 'ORG1';
    const body = {
      query: LOGIN_GRAPHQL,
      variables: {
        loginInfo: model,
      },
    };
    return this.httpClient.post(this.graphQLURL, body);
  }

  // To get users list
  GetUserList(): Observable<UserModel[]> {
    let route: string = this.UsersApiRoutePrefix.concat(`/GetUserDetails`);
    return this.apiUserService.get(route).pipe(
      retry(0)
      //catchError(this.handleError)
    );
  }

  // Get user by ID to view or edit
  GetUserByID(id: number): Observable<any> {
    const body = {
      query: USER_BY_ID,
      variables: {
        id: Number(id),
      },
    };
    return this.apiUserService.post('', body).pipe(retry(0));
  }

  // Update user detail
  UpdateUserDetail(model: UserModel): Observable<any> {
    let route: string = this.UsersApiRoutePrefix.concat(`/UpdateUserDetail`);
    return this.apiUserService.put(route, model).pipe(retry(0));
  }

  ChangePassword(model: ChangePassword): Observable<any> {
    let route: string = this.UsersApiRoutePrefix.concat(`/ChangePassword`);
    return this.apiUserProfileService.post(route, model).pipe(retry(0));
  }
}
