import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController, NavController, Platform} from 'ionic-angular';
import {SearchServiceProvider} from '../../providers/search-service/search-service';
import {Observable} from 'rxjs/Observable';
import {CategoryPickPage} from '../../pages/category-pick/category-pick';
import {SessionServiceProvider} from '../../providers/session-service/session-service';
import {EditPostingPage} from '../../pages/edit-posting/edit-posting';
import {FirebaseServiceProvider} from '../../providers/firebase-service/firebase-service';
import {DetailPage} from '../../pages/detail/detail';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

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
export class SearchComponent implements OnInit{

  public postings: Observable<any>;
  public search$ = new Subject<string>();
  public searchButton$ = new BehaviorSubject<any>(undefined);
  public category;
  public selectedCategory;
  public location;
  public loading;

  constructor(private navCtrl: NavController,
              public modalCtrl: ModalController,
              public searchService: SearchServiceProvider,
              public platform: Platform,
              public sessionService: SessionServiceProvider,
              public firebaseService: FirebaseServiceProvider,
              public alertCtrl: AlertController,) {
  }

  ngOnInit() {
    this.postings = Observable.merge(
      this.categorySearch$(),
      this.uidSearch$(),
      this.textSearch$(),
      this.searchButtonClick$(),
    );
  }

  textSearch$() {
    return this.search$
      .asObservable()
      .debounceTime(400)
      .distinctUntilChanged()//---abs---abcdefg---...
      .do(console.log)
      .flatMap((text) => this.performSearch$(text))//--o(abc)--o(abcdefg)-...
  }

  pushPage(posting) {
    return this.navCtrl.push(DetailPage, {
      id: posting.objectID
    });
  }

  private searchButtonClick$() {
    return this.searchButton$
      .asObservable()
      .flatMap(text => this.performSearch$(text));
  }

  private categorySearch$() {
    return this.searchService.getCategorySearch()
      .do(searchCategory => {
        this.selectedCategory = searchCategory || undefined;
      })
      .flatMap(searchCategory => this.searchByCategory$(searchCategory))
  }

  private uidSearch$() {
    return this.searchService
      .getUidSearch()
      .flatMap(uid =>
        this.searchByUid$(uid));
  }

  private searchByCategory$(searchCategory) {
    const query = {
      filters: undefined,
    };
    if (searchCategory && searchCategory.id) {
      query.filters = `category:${searchCategory.id}`;
    }
    return this.searchService.searchByQuery({ query });
  }

  private searchByUid$(uid) {
    return this.searchService.searchByQuery({
      query: {
        filters: `owner:${uid}`
      }
    });
  }


  showCategorySelectionModal($event) {
    $event.preventDefault();
    this.modalCtrl.create(CategoryPickPage).present();
  }

  performSearch$(text?, clear = false) {
    console.log('performing search...')
    let query = {
      query: text,
      filters: undefined,
    }

    if (this.selectedCategory) {
      query.filters = `category:${this.selectedCategory.id}`;
    }

    return this.searchService.searchByQuery({query, clear: clear});
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
            this.firebaseService.deletePosting(posting)// *** stream 123dawlish
              .subscribe(
                () =>
                  this.searchButton$.next(undefined),
                (error) => {
                  console.log(`error deleting posing: ${posting}`);
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
