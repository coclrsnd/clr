import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { User } from "./model/user.model";
import { catchError, concatMap, map } from "rxjs/operators";

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}

  LOGINQUERY = `query Login($loginRequest: LoginRequestInput!) {
    login(loginRequestInput: $loginRequest) {
      userName
      name
      emailId
      phoneNumber
      token
      organizationId
      organizationCode
      logoPath
      roleId
      roleName
      userId
    }
  }`;

  login(loginRequest: {
    userName: string;
    password: string;
  }): Observable<User> {
    return this.http
      .post<any>("https://localhost:55148/graphql/", {
        query: this.LOGINQUERY,
        variables: { loginRequest: loginRequest },
      })
      .pipe(
        map((response) => {
          if (response?.data?.login) {
            return response.data.login;
          } else {
            throw new Error("Error while creating");
          }
        }),
        catchError((error) => {
          // Handle any additional error processing here if needed
          return throwError(error);
        }),
      );
  }
}
