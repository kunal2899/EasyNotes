import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.scss']
})
export class ForbiddenComponent implements OnInit {

  constructor() {
   }

  ngOnInit(): void {

    var container = document.getElementById('cont');
    window.onmousemove = function(e){
      var x = -e.clientX/5, y = -e.clientY/5;
      container.style.backgroundPositionX = x + 'px';
      container.style.backgroundPositionY = y + 'px';
    }

  }

}
