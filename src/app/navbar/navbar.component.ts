import { Component, DoCheck, OnInit } from '@angular/core';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, DoCheck {
  isLoggedIn: boolean;

  constructor(private rest: RestService) { }

  ngOnInit(): void {
  }

  ngDoCheck() {
    this.rest.checkLogin().subscribe((res) => {
      this.isLoggedIn = res;
    })
  }


  logOut() {
    this.rest.logOut();
  }

}
