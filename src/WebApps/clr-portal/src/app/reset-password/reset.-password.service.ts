import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResetPasswordRequestInput } from './reset-password.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, switchMap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { selectUserDetails } from '../auth/auth.selectors';

@Injectable()
export class ResetPasswordService {
  constructor(private httpClient: HttpClient, private store: Store<AppState>) { }


  RESETPASSWORD = `mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      boolean
    }
  }
  `;

  resetPassword(resetPasswordRequest: ResetPasswordRequestInput): Observable<boolean> {
    delete resetPasswordRequest['confirmPassword'];
    return this.store.pipe(
      select(selectUserDetails),
      switchMap(user => {
        resetPasswordRequest.userName = user.userName;
        return this.httpClient
          .post<any>(environment.apiUrl, {
            query: this.RESETPASSWORD,
            variables: {
              input: {
                resetPasswordRequest: resetPasswordRequest
              }
            },
          })
          .pipe(
            map((response) => {
              return response?.data?.resetPassword?.boolean ?? false;
            }),
          );
      })
    )
  }
}
