import { Component } from '@angular/core';
import {SearchServiceProvider} from '../../providers/search-service/search-service';
import {SessionServiceProvider} from '../../providers/session-service/session-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public showSearch = false;
  public showPostAd;
  private user;

  constructor(
    private searchService: SearchServiceProvider,
    private sessionService: SessionServiceProvider,) {
    this.subscribeToSearch();
    this.subscribeToAuthStateChange();
  }

  toggleSearch() {
    this.searchService.getShowSearch().next(!this.showSearch);
    this.showPostAd = false;
  }

  togglePostAd() {
    this.sessionService.getSignInCheckSubject().next(true);
    this.showPostAd = !this.showPostAd;
    this.showSearch = false;
  }

  onPostingCancelled() {
    this.showPostAd = false;
  }

  subscribeToSearch() {
    this.searchService.getShowSearch()
      .subscribe(show => this.showSearch = show);
  }

  subscribeToAuthStateChange() {
    this.sessionService.getAuthStateSubject().subscribe(user => {
      if (user) {
        this.user = user;
      }
    })
  }
}
