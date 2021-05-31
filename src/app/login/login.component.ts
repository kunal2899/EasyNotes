import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    $('.register .panel button').on('click',function(){
      $('.register').css('transform','translateX(calc(100% - 25px))').css('opacity',0);
      $('.login').css('transform','translateX(calc(50% - 25px))').css('opacity',1);
    })

    $('.login .panel button').on('click',function(){
      $('.login').css('transform','translateX(calc(-100% - 25px))').css('opacity',0);
      $('.register').css('transform','translateX(calc(-50% -  25px))').css('opacity',1);
    })
    
  }

}
