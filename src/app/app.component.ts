import { Component, OnInit, DoCheck } from '@angular/core';

import { RestService } from './rest.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, DoCheck {

  jwtKey: string = this.rest.jwtKey;
  isLoggedIn: boolean;

  constructor(private readonly rest: RestService) {
  };

  // Check if user is logged in
  ngDoCheck() {
    this.rest.checkLogin().subscribe((res) => {
      this.isLoggedIn = res;
    })
  }

  ngOnInit(): void {};



}
