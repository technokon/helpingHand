import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {FirebaseServiceProvider} from '../../providers/firebase-service/firebase-service';
import {Observable} from 'rxjs/Observable';
import {SearchServiceProvider} from '../../providers/search-service/search-service';

/**
 * Generated class for the CategoryPickPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-category-pick',
  templateUrl: 'category-pick.html',
})
export class CategoryPickPage {
  private categories= [];
  private allCategories= [];
  public children = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private service: FirebaseServiceProvider,
              private searchService: SearchServiceProvider,
              public platform: Platform,) {
    this.init();
  }

  init() {
    this.subscribeToCategories();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryPickPage');
  }

  subscribeToCategories() {
    let obs = this.service.getAllCategories().subscribe(cats => {
      this.allCategories = cats;
      this.categories.push(...this.allCategories);
      obs.unsubscribe();
    });
  }

  onCategory(category) {
    console.log(category);
    if (category.kids) {
      this.categories.length = 0;
      this.categories.push(...category.kids);
      this.children = true;
    } else {
      this.searchService.getCategorySearch().next(category);
      this.onClose();
    }
  }

  onClose() {
    this.navCtrl.pop();
  }

  upCategories() {
    this.children = false;
    this.categories.length = 0;
    this.categories.push(...this.allCategories);
  }

}
