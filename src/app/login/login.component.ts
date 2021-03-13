import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, DoCheck {
  emailLogin: string = '';
  passwordLogin: string = '';

  constructor(private readonly rest: RestService,
              private router: Router) { }

  ngOnInit(): void {

  }

  ngDoCheck() {
    // If log in successful, take user to notes
    this.rest.checkLogin()
      .subscribe((res) => {
        if (res === true) {
          this.router.navigate(['notes'])
        }
      })
  }
  logIn() {
    this.rest.logIn({
      email: this.emailLogin,
      password: this.passwordLogin
    });
  }

}
