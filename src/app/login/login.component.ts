import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { AUTHENTICATED_USER, AuthService, TOKEN, TOKEN_EXPIRY, User, USER_ID } from '../service/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  username:string = '';
  lmsg = ""
  password:string = '';
  invalidCredentials:boolean;
  serror:boolean;
  msg = '';
  running = false;
  rrunning = false;

  u:User = new User('','','','');

  constructor(private us:AuthService, private router:Router) { 
      this.invalidCredentials = false;
      this.serror = false;
   }

   untouch(form) {
    Object.keys(form.controls).forEach(key => {
      form.get(key).markAsUntouched();
    });
  }

   signIn(form:FormGroup) {
    if(form.valid){
      this.running = true;
      this.us.authenticate(this.username,this.password).subscribe(
        data => {
          this.running = false;
          sessionStorage.setItem(TOKEN_EXPIRY, data.expiry);
          sessionStorage.setItem(USER_ID, "" + data.userId);
          sessionStorage.setItem(AUTHENTICATED_USER, this.username);
          sessionStorage.setItem(TOKEN, `Token ${data.token}`);
          this.router.navigate(['dashboard']);
        },
        error => {
          console.log(error);
          this.invalidCredentials = true;
          this.running = false;
          setTimeout(()=>{
            this.invalidCredentials = false;
          },2000)
        }
      )
    }
    else{
      form.markAllAsTouched()
      setTimeout(()=>{
        this.untouch(form);
      },3000)
    }
  }


  signUp(form:FormGroup){
    if(form.valid){
      this.rrunning = true;
      let user ={}
      let n = this.u.name.split(" ")
      if(n.length == 1){
        user["first_name"] = n[0]
        user["last_name"] = ""
      }
      else if(n.length == 2){
        user["first_name"] = n[0]
        user["last_name"] = n[1]
      }
      else{
        user["first_name"] = n[0]
        let s = ""
        for(var i = 1;i<n.length;i++){
          s += n[i]+" "
        }
        user["last_name"] = s.trim()
      }
      user["email"] = this.u.email
      user["username"] = this.u.uname
      user["password"] = this.u.pass
      this.us.addUser(user).subscribe(
        response => {
          // alert("Your account is created, please login to continue.");
          this.lmsg= "Your account is created, login to continue"
          this.rrunning = false;
          setTimeout(()=>{this.lmsg = ''},3000)
          form.reset()
          $('.register').css('transform','translateX(calc(100%))').css('opacity',0);
          $('.login').css('transform','translateX(calc(50%))').css('opacity',1);
          // this.router.navigate(['login'])
        },
        error => {
          // console.log(error);
          this.serror = true;
          this.rrunning = false;
          if(error.error.username){
            this.msg = "Username already exists"
            setTimeout(()=>{this.serror = false
            this.msg = ''},3000)
          }else{
            this.msg = "Some error occurred, please try again later"
            setTimeout(()=>{this.serror = false
            this.msg = ''},3000)
          }
          
        }
      )
    }
    else{
      form.markAllAsTouched()
      setTimeout(()=>{
        this.untouch(form);
      },3000)
    }
  }

  ngOnInit(): void {

    $('.register .panel button').on('click',function(){
      $('.register').css('transform','translateX(calc(100%))').css('opacity',0);
      $('.login').css('transform','translateX(calc(50%))').css('opacity',1);
    })

    $('.login .panel button').on('click',function(){
      $('.login').css('transform','translateX(calc(-100%))').css('opacity',0);
      $('.register').css('transform','translateX(calc(-50%))').css('opacity',1);
    })
    
  }

}
