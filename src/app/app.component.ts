import { Component } from '@angular/core';
import { AUTHENTICATED_USER, AuthService, model, TOKEN, TOKEN_EXPIRY, USER_ID } from './service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'EasyNotes';
}
