import {Component, OnInit} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  AlertController,
  Platform, LoadingController,
} from 'ionic-angular';
import {AdImagesPage} from '../ad-images/ad-images';
import {CategoryServiceProvider} from '../../providers/category-service/category-service';
import {SearchServiceProvider} from '../../providers/search-service/search-service';
import {Observable} from 'rxjs/Observable';

/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage implements OnInit {

  public posting;
  public loading;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform,
              private searchService: SearchServiceProvider,
              private categoryService: CategoryServiceProvider,
              private loadingCtrl: LoadingController,) {
  }

  ngOnInit() {
    const postingId = this.navParams.get('id');
    return this.retrievePostingById(postingId);
  }

  private retrievePostingById(postingId) {
    return Observable.fromPromise(this.startLoading('Loading ad...'))
      .flatMapTo(this.searchService.searchByQuery({
        query: {
          filters: `objectID:${postingId}`,
        }
      }))
      .map((postings) =>
        this.attachCategoryToPosting(postings[0]))
      .subscribe(
        (posting) => {
          this.posting = posting;
        },
        (error) => {
          console.log(`Error retrieving posting for ${postingId}`, error);
          this.loading.dismiss();
        },
        () =>
          this.loading.dismiss());
  }

  private startLoading(message?) {
    this.loading = this.loadingCtrl.create({
      content: message || 'Please wait...'
    });
    return this.loading.present();
  }

  private attachCategoryToPosting(posting) {
    if (!posting.category.name) {
      let category = this.categoryService.findCategory(posting.category);
      if (category) {
        posting.category = category;
      }
    }
    return posting;
  }

  gotToSlides() {
    return Promise.resolve(this.posting &&
      this.posting.pictures &&
      this.posting.pictures.length &&
      this.navCtrl.push(AdImagesPage, this.posting.pictures));
  }
}
