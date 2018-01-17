import { Component } from '@angular/core';
import {DetailPage} from '../../pages/detail/detail';
import {ModalController, NavController, Platform} from 'ionic-angular';
import {FirebaseServiceProvider} from '../../providers/firebase-service/firebase-service';
import {SearchServiceProvider} from '../../providers/search-service/search-service';
import {Observable} from 'rxjs/Observable';

/**
 * Generated class for the SearchComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'h-search',
  templateUrl: 'search.html'
})
export class SearchComponent {

  public showSearchResults;
  public postings: Observable<any>;
  private allPositng: Observable<any>;
  private criteriaPostings: Observable<any>;
  public search;
  public category;
  public location;

  constructor(
    private navCtrl: NavController,
    public modalCtrl: ModalController,
    public service: FirebaseServiceProvider,
    private searchService: SearchServiceProvider,
    public platform: Platform,
  ) {
    this.init();
  }

  init() {
    this.subscribeToCategorySearch();
    this.subscribeToAllSearch();
    this.postings = this.allPositng;
  }

  pushPage(posting) {
    this.navCtrl.push(DetailPage, posting);
    //this.modalCtrl.create(DetailPage, user).present();
  }

  subscribeToAllSearch() {
    this.allPositng = this.service.getPostings();
  }

  doSearch() {
    this.postings = this.allPositng;
  }

  private subscribeToCategorySearch() {
    this.searchService.getCategorySearch().subscribe(searchCategory => {
      this.searchByCategory(searchCategory);
      this.category = searchCategory.name;
      this.postings = this.criteriaPostings;
    });
  }

  private searchByCategory(searchCategory) {
    this.criteriaPostings = this.service.getPostingByCategory(searchCategory);
  }

}
