import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpIntercepterBasicAuthService implements HttpInterceptor {

  constructor(private us: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {

    let basicAuthHeaderString = this.us.getAuthenticatedToken();
    let username = this.us.getAuthenticatedUser();
    if (basicAuthHeaderString && username) {
      request = request.clone({
        setHeaders: {
          Authorization : basicAuthHeaderString
          // 'Access-Control-Allow-Origin' : '*',
          // 'Access-Control-Allow-Methods' : 'GET,POST,OPTIONS,DELETE,PUT'
        }
      })
    }
    return next.handle(request);
  }
}
