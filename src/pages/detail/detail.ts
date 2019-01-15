import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  AlertController,
  Platform,
} from 'ionic-angular';
import {AdImagesPage} from '../ad-images/ad-images';
import {CategoryServiceProvider} from '../../providers/category-service/category-service';

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
export class DetailPage {

  public posting = this.navParams.data;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    public platform: Platform,
    private categoryService: CategoryServiceProvider,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
    this.attachCategoryToPosting();
  }

  private attachCategoryToPosting() {
    if (!this.posting.category.name) {
      let category = this.categoryService.findCategory(this.posting.category);
      if (category) {
        this.posting.category = category;
      }
    }
  }

  dismiss() {
    let alert = this.alertCtrl.create({
      title: 'Close Modal?',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel,',
          handler: () => { console.log('cancelled')}
        },
        {
          text: 'Yes',
          handler: () => {
            this.viewCtrl.dismiss();
          }
        },
      ]
    });
    alert.present();
  }

  getGuideContent() {
    return {
      header: 'Add Tips',
      items: [
        'Enter as many details as possible',
        'Include pictures (15 max)',
        'Click the Post Ad button!',
      ]
    }
  }

  get flat() {
    return this.platform.isLandscape();
  }

  gotToSlides() {
    this.navCtrl.push(AdImagesPage, this.posting.pictures);
  }
}
