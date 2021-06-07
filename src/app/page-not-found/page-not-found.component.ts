import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

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
