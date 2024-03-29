import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { User } from '../model/user.model'

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
      logoPath
      roleId
      roleName
      userId
    }
  }`

  login(loginRequest: {
    userName: string
    password: string
  }): Observable<User> {
    return this.http.post<User>('https://localhost:55148/graphql/', {
      query: this.LOGINQUERY,
      variables: { loginRequest: loginRequest },
    })
  }
}
