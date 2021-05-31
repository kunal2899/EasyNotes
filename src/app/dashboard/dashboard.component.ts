import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $('.create').on('click',function(){
      $('.main').addClass('blur');
      $('.add').addClass('active');
    })
    $('.add .controls .close').on('click',function(){
      $('.main').removeClass('blur');
      $('.add').removeClass('active');
    })
  }

}
