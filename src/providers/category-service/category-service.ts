import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';

/*
  Generated class for the CategoryServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CategoryServiceProvider {

  private categorySelectObserver;
  private categorySelectObservable;

  constructor(public http: HttpClient) {
    this.init();
  }

  init() {
    this.createCategorySelectObservable();
  }

  private createCategorySelectObservable() {
    this.categorySelectObservable = Observable.create(observer => {
      this.categorySelectObserver = observer;
    });
  }

  getCategorySelect() {
    return this.categorySelectObservable;
  }

  getCategorySelectObserver() {
    return this.categorySelectObserver;
  }

}
