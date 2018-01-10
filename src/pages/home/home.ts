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

  public postings = [];
  public shouldReorder = false;
  public showSearch = false;
  public showSearchResults;
  public search;
  public category;
  public location;
  public showPostAd;

  constructor(
    public navCtrl: NavController,
    public service: PeopleProvider,
    public service2: FirebaseServiceProvider,
    public modalCtrl: ModalController,
    private searchService: SearchServiceProvider) {
    this.subscribeToMeanuSearch();
  }

  toggleReorder() {
    this.shouldReorder = !this.shouldReorder;
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    this.showPostAd = false;
  }

  togglePostAd() {
    this.showPostAd = !this.showPostAd;
    this.showSearchResults = false;
    this.showSearch = false;
  }

  doRefresh(e) {
    this.service2.getPostings().subscribe(
      data => this.postings,
      error => console.log(error),
      () => e.complete(),
    )
  }

  doSearch() {
    this.service2.getPostings().subscribe(
      data => {
        this.postings = data;
        this.showSearchResults = true;
      },
      error => console.log(error),
      //() => e.complete(),
    )
  }

  doInfinite(e) {
    this.service2.getPostings().subscribe(
      data => this.postings = data,
      error => console.log(error),
      () => e.complete(),
    )
  }

  pushPage(posting) {
    this.navCtrl.push(DetailPage, posting);
    //this.modalCtrl.create(DetailPage, user).present();
  }

  private subscribeToMeanuSearch() {
    this.searchService.getCategorySearch().subscribe(searchCategory => {
      this.searchByCategory(searchCategory);
    });
  }

  private searchByCategory(searchCategory) {
    this.service2.getPostingByCategory(searchCategory).subscribe(
      data => {
          this.postings = data;
          this.showSearch = false;
          this.showPostAd = false;
          this.showSearchResults = true;
        },
        error => console.log(error));
  }
}
