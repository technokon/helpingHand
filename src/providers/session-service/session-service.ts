import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the SessionServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SessionServiceProvider {

  public loggedIn = false;
  constructor(public http: HttpClient) {
    console.log('Hello SessionServiceProvider Provider');
  }

  login() {
    this.loggedIn = !this.loggedIn;
  }

  isLoggedIn() {
    return !!this.loggedIn;
  }

  register() {
    this.loggedIn = true;
  }

}
