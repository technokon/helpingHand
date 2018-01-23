import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class SearchServiceProvider {

  private categorySearchSubject = new Subject<any>();
  private showSearchSubject = new Subject<any>();

  constructor(public http: HttpClient) {
    this.init();
  }

  init() {
  }

  getCategorySearch() {
    return this.categorySearchSubject;
  }

  getShowSearch() {
    return this.showSearchSubject;
  }

}
