import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { ResetPassword } from "../model/resetpassword";

import { environment } from "../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class ResetpasswordService {

  constructor(private httpClient: HttpClient) { }
  RESETPASSWORDQUERY = `mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      boolean
    }
  }
  `;
  resetpassword(resetpasswordRequest: ResetPassword): Observable<boolean> {
    return this.httpClient
      .post<any>(environment.apiUrl, {
        query: this.RESETPASSWORDQUERY,
        variables: {
          input: {
            email: resetpasswordRequest.email,
            currentPassword: resetpasswordRequest.currentPassword,
            newPassword: resetpasswordRequest.newPassword
          },
        },
      })
      .pipe(
        map((response) => {
          if (response?.data?.resetPassword?.success) {
            return true; // Reset password successful
          } else {
            throw new Error('Incorrect password');
          }
        }),
        catchError((error) => {
          return throwError(error); // Handle error
        })
      );
  }
}
