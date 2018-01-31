import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import * as algoliasearch from 'algoliasearch';
import {Observable} from 'rxjs/Observable';

const POSTING_INDEX = 'prod_POSTING';
const APPLICATION_ID ='XXZIWGI3I4';
const ADMIN_KEY = 'fc47b09d7999f58771e5ba94aec2cf03';
const API_KEY = '863bc2fa9bf73190cfaa76f3533bf5dd';

@Injectable()
export class SearchServiceProvider {

  private categorySearchSubject = new Subject<any>();
  private showSearchSubject = new Subject<any>();
  private indexAddSubject = new Subject<any>();
  private indexDeleteSubject = new Subject<any>();
  private indexUpdateSubject = new Subject<any>();
  private postingIndex;

  constructor(public http: HttpClient) {
    this.init();
  }

  init() {
    this.initializeAlgolia();
  }

  initializeAlgolia() {
    let client = algoliasearch(APPLICATION_ID, API_KEY, {protocol: 'https:'});
    this.postingIndex = client.initIndex(POSTING_INDEX);
    console.log(this.postingIndex);

    this.indexAddSubject.subscribe(posting => {
      this.postingIndex.addObject(posting, (error, content) => {
        console.log(`indexing ${content.objectID}`)
      })
    })
  }

  getCategorySearch() {
    return this.categorySearchSubject;
  }

  getShowSearch() {
    return this.showSearchSubject;
  }

  getIndexAddSubject() {
    return this.indexAddSubject;
  }

  getSearchIndex() {
    return this.postingIndex;
  }

  searchByQuery(query?) {
    return Observable.create(observer => {
      this.getSearchIndex().search(query, (err, content) => {
        if (err) {
          console.error(err);
          observer.error(err);
          return;
        } else {
          for (var h in content.hits) {
            console.log(
              `Hit(${content.hits[h].objectID}): ${content.hits[h].toString()}`
            );
          }
          observer.next(content.hits);// use observable
        }
      });
    })
  }

}
