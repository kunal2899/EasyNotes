import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APP_URL, AUTH_HEADERS, CORS_HEADERS } from 'src/app.constants';
import { map } from 'rxjs/operators';

export class User{
  constructor(
    public name:string,
    public email:string,
    public uname:string,
    public pass:string
  ){}
}

export class model{
  constructor(
    public id: number,
    public first_name:string,
    public last_name:string,
    public username: string,
    public email: string
  ){
  }
}

export const AUTHENTICATED_USER = 'authenticatedUser';
export const TOKEN = 'token';
export const USER_ID = 'userId';
export const TOKEN_EXPIRY = 'expiry';

export class AuthResponse {
  constructor(public userId: number,public token:string, public expiry:string, public first_name:string) { }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  findUserById(uid){
    return this.http.get<User>(`${APP_URL}/user/uid/${uid}`);
  }
  
  findUserByUsername(uname){
    return this.http.get<any>(`${APP_URL}/user/uname/${uname}`);
  }

  addUser(u){
    return this.http.post(`${APP_URL}/user/add`,u);
  }

  authenticate(username:string,password:string){
    return this.http.post<AuthResponse>(`${APP_URL}/user/login`, { username, password }).pipe(
      map(
        data => {
          sessionStorage.setItem(TOKEN_EXPIRY, data.expiry);
          sessionStorage.setItem(USER_ID, "" + data.userId);
          sessionStorage.setItem(AUTHENTICATED_USER, username);
          sessionStorage.setItem(TOKEN, `Token ${data.token}`);
          sessionStorage.setItem('name',data.first_name);
          return data;
        }
      )
    );
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem(AUTHENTICATED_USER);
    return !(user == null);
  }
  
  logout() {
    return this.http.post(`${APP_URL}/user/logout`,{})
  }
  
  getAuthenticatedUserId(): number {
    return parseInt(sessionStorage.getItem(USER_ID));
  }
  
  getAuthenticatedUser() {
    return sessionStorage.getItem(AUTHENTICATED_USER);
  }
  
  getAuthenticatedToken() {
    if (this.getAuthenticatedUser())
      return sessionStorage.getItem(TOKEN);
  }
}
