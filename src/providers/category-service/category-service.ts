import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

/*
  Generated class for the CategoryServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CategoryServiceProvider {

  private categorySelectObserver;
  private categorySelectObservable;
  private categoriesSubject = new Subject<any>();
  private categories;

  constructor(public http: HttpClient) {
    this.init();
  }

  init() {
    this.createCategorySelectObservable();
    this.categoriesSubject.subscribe(categories => {
      this.categories = categories;
    })
  }

  private createCategorySelectObservable() {
    this.categorySelectObservable = Observable.create(observer => {
      this.categorySelectObserver = observer;
    });
  }

  findCategory(category?) {
    if (category && this.categories && this.categories.length) {
      return this.categories
        .find(c => c.kids.find(k => k.id === category.id))
        .kids.find(k => k.id === category.id);
    }
  }

  getCategorySelect() {
    return this.categorySelectObservable;
  }

  getCategorySelectObserver() {
    return this.categorySelectObserver;
  }

  getCategoriesSubject() {
    return this.categoriesSubject;
  }

  getAllCategories() {
    return this.categories;
  }

}
