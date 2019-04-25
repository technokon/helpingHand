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
  public deletePosting$ = new Subject<any>();
  public category;
  public selectedCategory;
  public text;
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
      this.categorySearch$(),//---landscaping--electrical--...
      this.uidSearch$(),//--123--432---...
      this.textSearch$(),//---abc--abcde---...
      this.searchButtonClick$(),//---click---click---...
      this.deletePostingTrigger$(),//--delete1--delete2...
    );
  }

  textSearch$() {
    return this.search$
      .asObservable()
      .debounceTime(400)
      .distinctUntilChanged()//---abs---abcdefg---...
      .do((text) => {
        this.text = text;
      })
      .flatMap(() =>//--o(result1)--o(result2)-... -> --result1--result2--...
        this.performSearch$());
  }

  deletePostingTrigger$() {
    return this.deletePosting$
      .asObservable()
      .flatMap(([posting, dismiss]) =>
        this.firebaseService.deletePosting(posting)
          .do(dismiss))
      .flatMapTo(this.performSearch$());
  }


  private searchButtonClick$() {
    return this.searchButton$
      .asObservable()
      .flatMap(() => this.performSearch$());
  }

  private categorySearch$() {
    return this.searchService.getCategorySearch()
      .do(searchCategory => {
        this.selectedCategory = searchCategory || undefined;
      })
      .flatMap(() => this.performSearch$())
  }

  private uidSearch$() {
    return this.searchService
      .getUidSearch()//--123--457--...
      .flatMap(uid =>//--result1--result2...
        this.searchByUid$(uid));
  }


  private searchByUid$(uid) {
    return this.searchService.searchByQuery({
      query: {
        filters: `owner:${uid}`
      }
    });
  }

  performSearch$(text?, clear = false) {
    console.log('performing search...')
    let query = {
      query: text || this.text,
      filters: undefined,
    }

    if (this.selectedCategory) {
      query.filters = `category:${this.selectedCategory.id}`;
    }

    return this.searchService.searchByQuery({query, clear: clear});
  }

  pushPage(posting) {
    return this.navCtrl.push(DetailPage, {
      id: posting.objectID
    });
  }

  showCategorySelectionModal($event) {
    $event.preventDefault();
    this.modalCtrl.create(CategoryPickPage).present();
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
            this.deletePosting$.next([posting, dismiss]);
            this.loading = this.sessionService.startLoading();
          }
        }
      ]
    });
    return confirm.present();
  }


}
