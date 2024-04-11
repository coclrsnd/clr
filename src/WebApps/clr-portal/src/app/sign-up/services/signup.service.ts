import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { response } from "express";
import { Observable, of, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { Organization } from "../model/organization";
import { SignUp } from "../model/signup";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: "root" })
export class SignupService {
  constructor(private httpClient: HttpClient) {}

  ORGQUERY = `query Login($name: String) {
    organization(where: { name: { contains: $name } }) {
      name
      code
      id
    }
  }
  `;

  SIGNUPQUERY = `mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      boolean
    }
  }
  `;

  searchOrganizations(filterValue: string): Observable<Organization[]> {
    return this.httpClient
      .post<any>(environment.apiUrl, {
        query: this.ORGQUERY,
        variables: { name: filterValue },
      })
      .pipe(
        map((response) => {
          return response?.data?.organization ?? [];
        }),
      );
  }

  signup(signupRequest: SignUp): Observable<boolean> {
    return this.httpClient
      .post<any>(environment.apiUrl, {
        query: this.SIGNUPQUERY,
        variables: {
          input: {
            userSignupRequestInput: signupRequest
          }
        },
      })
      .pipe(
        map((response) => {
          if (response?.data?.createUser?.boolean) {
            return response.data?.createUser?.boolean;
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
