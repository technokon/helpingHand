import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import * as algoliasearch from 'algoliasearch';
import {Observable} from 'rxjs/Observable';

const POSTING_INDEX = 'prod_POSTING';
const APPLICATION_ID = '1IIZWINWBN';
const ALGOLIA_SEARCH_ONLY_KEY = '03fbd717c23738faacc6b24c36bbbccd';

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

  searchByQuery(options:any = {query: undefined, clear: false}) {
    let query = options.query;
    if (options.clear) {
      this.getSearchIndex().clearCache();
    }
    return Observable.fromPromise(
      this.getSearchIndex().search(query)
        .then((content) =>
          content.hits.map((p) => {
            p.category = {id: p.category};
            return p;
          })));
  }

}
