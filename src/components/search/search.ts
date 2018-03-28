import { Component } from '@angular/core';
import {DetailPage} from '../../pages/detail/detail';
import {ModalController, NavController, Platform} from 'ionic-angular';
import {SearchServiceProvider} from '../../providers/search-service/search-service';
import {Observable} from 'rxjs/Observable';
import {CategoryPickPage} from '../../pages/category-pick/category-pick';

/**
 * Generated class for the SearchComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'h-search',
  templateUrl: 'search.html',
})
export class SearchComponent {

  public postings: Observable<any>;
  public search;
  public category;
  public selectedCategory;
  public location;

  constructor(
    private navCtrl: NavController,
    public modalCtrl: ModalController,
    private searchService: SearchServiceProvider,
    public platform: Platform,
  ) {
    this.init();
  }

  init() {
    this.subscribeToCategorySearch();
    this.subscribeToUidSearch();
    this.postings = this.searchService.searchByQuery();
  }

  pushPage(posting) {
    this.navCtrl.push(DetailPage, posting);
  }

  doSearch() {
    this.performSearch();
  }

  private subscribeToCategorySearch() {
    this.searchService.getCategorySearch().subscribe(searchCategory => {
      this.searchByCategory(searchCategory);
      this.selectedCategory = searchCategory;
      this.category = searchCategory.name;
    });
  }

  private subscribeToUidSearch() {
    this.searchService.getUidSearch().subscribe(uid => {
      this.searchByUid(uid);
    });
  }

  private searchByCategory(searchCategory) {
    this.postings = this.searchService.searchByQuery({
      filters: `category:${searchCategory.id}`
    });
  }

  private searchByUid(uid) {
    this.postings = this.searchService.searchByQuery({
      filters: `owner:${uid}`
    });
  }

  updateList($event) {
    this.performSearch();
  }

  showCategorySelectionModal($event) {
    $event.preventDefault();
    this.modalCtrl.create(CategoryPickPage).present();
  }

  performSearch() {
    let query = {
      query: this.search,
      filters: undefined,
    }

    if (this.selectedCategory) {
      query.filters = `category:${this.selectedCategory.id}`;
    }

    this.postings = this.searchService.searchByQuery(query);
  }

  clearSelectedCategory() {
    this.selectedCategory = null;
    this.category = null;

    this.doSearch();
  }

  modifyAd() {

  }

  deleteAd() {

  }


}
