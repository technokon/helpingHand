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
  private showSearchObserver;
  private showSearchObservable;

  constructor(public http: HttpClient) {
    this.init();
  }

  init() {
    this.createCategorySearchObservable();
    this.createshowSearchObservable();
  }

  private createCategorySearchObservable() {
    this.categorySearchObservable = Observable.create(observer => {
      this.categorySearchObserver = observer;
    });
  }

  private createshowSearchObservable() {
    this.showSearchObservable = Observable.create(observer => {
      this.showSearchObserver = observer;
    });
  }

  getCategorySearchObserver() {
    return this.categorySearchObserver;
  }

  getCategorySearch() {
    return this.categorySearchObservable;
  }

  getShowSearch() {
    return this.showSearchObservable;
  }

  getShowSearchObserver() {
    return this.showSearchObserver;
  }

}
