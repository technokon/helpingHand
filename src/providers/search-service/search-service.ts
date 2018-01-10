import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';

/*
  Generated class for the SearchServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SearchServiceProvider {

  private categorySearchObserver;
  private categorySearchObservable;
  constructor(public http: HttpClient) {
    console.log('Hello SearchServiceProvider Provider');
    this.init();
  }

  init() {
    this.createCategorySearchObservable();
  }

  private createCategorySearchObservable() {
    this.categorySearchObservable = Observable.create(observer => {
      this.categorySearchObserver = observer;
    });
  }

  getCategorySearchObserver() {
    return this.categorySearchObserver;
  }

  getCategorySearch() {
    return this.categorySearchObservable;
  }

}
