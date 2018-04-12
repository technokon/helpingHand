import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';

/*
  Generated class for the AdProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AdProvider {

  public editPostingSubject = new Subject<any>();

  constructor(public http: HttpClient) {
  }



}
