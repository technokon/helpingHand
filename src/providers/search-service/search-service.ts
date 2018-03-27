import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import * as algoliasearch from 'algoliasearch';
import {Observable} from 'rxjs/Observable';

const POSTING_INDEX = 'prod_POSTING';
const APPLICATION_ID ='XXZIWGI3I4';
const ALGOLIA_SEARCH_ONLY_KEY = 'd02fccd1421064f79fb5110cc82f656e';

@Injectable()
export class SearchServiceProvider {

  private categorySearchSubject = new Subject<any>();
  private uidSearchSubject = new Subject<any>();
  private showSearchSubject = new Subject<any>();
  private postingIndex;

  constructor(public http: HttpClient) {
    this.init();
  }

  init() {
    this.initializeAlgolia();
  }

  initializeAlgolia() {
    let client = algoliasearch(APPLICATION_ID, ALGOLIA_SEARCH_ONLY_KEY, {protocol: 'https:'});
    this.postingIndex = client.initIndex(POSTING_INDEX);
    console.log(this.postingIndex);
  }

  getCategorySearch() {
    return this.categorySearchSubject;
  }

  getUidSearch() {
    return this.uidSearchSubject;
  }

  getShowSearch() {
    return this.showSearchSubject;
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
            // console.log(
            //   `Hit(${content.hits[h].objectID}): ${content.hits[h].toString()}`
            // );
          }
          observer.next(content.hits);// use observable
        }
      });
    })
  }

}
