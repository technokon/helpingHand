import {Component} from '@angular/core';
import {AlertController, ModalController, NavController, Platform} from 'ionic-angular';
import {SearchServiceProvider} from '../../providers/search-service/search-service';
import {Observable} from 'rxjs/Observable';
import {CategoryPickPage} from '../../pages/category-pick/category-pick';
import {SessionServiceProvider} from '../../providers/session-service/session-service';
import {EditPostingPage} from '../../pages/edit-posting/edit-posting';
import {FirebaseServiceProvider} from '../../providers/firebase-service/firebase-service';
import {DetailPage} from '../../pages/detail/detail';

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
  public loading;

  constructor(private navCtrl: NavController,
              public modalCtrl: ModalController,
              private searchService: SearchServiceProvider,
              public platform: Platform,
              public sessionService: SessionServiceProvider,
              public firebaseService: FirebaseServiceProvider,
              public alertCtrl: AlertController,) {
    this.init();
  }

  init() {
    this.subscribeToCategorySearch();
    this.subscribeToUidSearch();
    this.postings = this.searchService.searchByQuery();
  }

  pushPage(posting) {
    return this.navCtrl.push(DetailPage, {
      id: posting.objectID
    });
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
      query: {
        filters: `category:${searchCategory.id}`,
      }
    });
  }

  private searchByUid(uid) {
    this.postings = this.searchService.searchByQuery({
      query: {
        filters: `owner:${uid}`
      }
    });
  }

  updateList($event) {
    this.performSearch();
  }

  showCategorySelectionModal($event) {
    $event.preventDefault();
    this.modalCtrl.create(CategoryPickPage).present();
  }

  performSearch(clear = false) {
    let query = {
      query: this.search,
      filters: undefined,
    }

    if (this.selectedCategory) {
      query.filters = `category:${this.selectedCategory.id}`;
    }

    this.postings = this.searchService.searchByQuery({query, clear: clear});
  }

  clearSelectedCategory() {
    this.selectedCategory = null;
    this.category = null;

    this.doSearch();
  }

  modifyAd(posting, $event) {
    $event.stopPropagation();
    this.navCtrl.push(EditPostingPage, posting);
  }

  deleteAd(posting, $event) {
    $event.stopPropagation();
    let confirm = this.alertCtrl.create({
      title: 'You are about to remove your ad',
      message: 'Are you sure you want to do that?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            console.log(`Deleting posting ${{posting}}`);
            let dismiss = () => {
              if (this.loading) {
                this.loading.dismiss();
              }
            };
            this.firebaseService.deletePosting(posting)
              .subscribe(
                (data) => {
                  this.performSearch(true);
                },
                (error) => {
                  console.log(`error deleting posing: ${{posting}}`);
                  dismiss();
                  },
                () => {
                  dismiss();
                });
            this.loading = this.sessionService.startLoading();
          }
        }
      ]
    });
    return confirm.present();

    // todo after delete, refresh results
  }


}
