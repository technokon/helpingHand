import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the PeopleProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PeopleProvider {

  people = [];

  constructor(public http: HttpClient) {
  }

  getPeople() {
    return this.http.get('https://randomuser.me/api/?results=3');
  }

}
