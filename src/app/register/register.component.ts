import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  //Register
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';

  constructor(private rest: RestService,
              private router: Router) { }

  ngOnInit(): void {
  }

  ngDoCheck() {
    // If register is successful, take user to register-success
    this.rest.checkLogin()
      .subscribe((res) => {
        if (res === true) {
          console.log("Logged in")
          this.router.navigate(['notes'])
        }
      })
  }

  register() {
    this.rest.register({
      fname: this.firstName,
      lname: this.lastName,
      email: this.email,
      password: this.password
    });
    this.router.navigate(['notes'])
  }

}
