import { Component } from '@angular/core';
import {NavController, ModalController, Events} from 'ionic-angular';
import { PeopleProvider } from '../../providers/people/people';
import { AdProvider } from '../../providers/ad/ad';
import { DetailPage} from '../detail/detail';
import {FirebaseServiceProvider} from '../../providers/firebase-service/firebase-service';
import {SearchServiceProvider} from '../../providers/search-service/search-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public shouldReorder = false;
  public showSearch = false;
  public showPostAd;

  constructor(
    public navCtrl: NavController,
    public service2: FirebaseServiceProvider,
    public modalCtrl: ModalController,
    private searchService: SearchServiceProvider) {
    this.subscribeToSearch();
  }

  toggleReorder() {
    this.shouldReorder = !this.shouldReorder;
  }

  toggleSearch() {
    this.searchService.getShowSearchObserver().next(!this.showSearch);
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
