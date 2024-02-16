import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private storageKey: string = 'Token';
  private baseUrl = environment.apiUrl;
  private AccountApiRouterPrefix: string = 'api/Accounts';

  constructor(private httpClient: HttpClient) {}

  verifyEmail(token: string) {
    let url: string = this.AccountApiRouterPrefix.concat(`/verify-email`);
    let route: string = `${this.baseUrl}/${url}`;
    return this.httpClient.post(route, { token }, this.httpOptions);
  }

  forgotPassword(email: string) {
    let url: string = this.AccountApiRouterPrefix.concat(`/forgot-password`);
    let route: string = `${this.baseUrl}/${url}`;
    return this.httpClient.post(route, { email }, this.httpOptions);
  }

  validateResetToken(token: string) {
    let url: string = this.AccountApiRouterPrefix.concat(
      `/validate-reset-token`
    );
    let route: string = `${this.baseUrl}/${url}`;
    return this.httpClient.post(route, { token }, this.httpOptions);
  }

  resetPassword(token: string, password: string, confirmPassword: string) {
    let url: string = this.AccountApiRouterPrefix.concat(
      `/reset-password`
    );
    let route: string = `${this.baseUrl}/${url}`;
    return this.httpClient.post(route, { token, password, confirmPassword }, this.httpOptions);
  }

  httpOptions = {
    headers: this.getHttpHeaders(),
  };

  getHttpHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getToken()}`,
    });
  }

  getToken() {
    return localStorage.getItem(this.storageKey);
  }
}
