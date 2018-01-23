import { Component } from '@angular/core';
import {SearchServiceProvider} from '../../providers/search-service/search-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public showSearch = false;
  public showPostAd;

  constructor(
    private searchService: SearchServiceProvider) {
    this.subscribeToSearch();
  }

  toggleSearch() {
    this.searchService.getShowSearch().next(!this.showSearch);
    this.showPostAd = false;
  }

  togglePostAd() {
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
}
