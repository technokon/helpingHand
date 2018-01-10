import { Component } from '@angular/core';
import { MenuController, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import {FirebaseServiceProvider} from '../providers/firebase-service/firebase-service';
import {SearchServiceProvider} from '../providers/search-service/search-service';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  private categories:any;
  private menuCategories:any;
  private selectedCategory;
  breadcrumbs = [];
  showBreadcrumbs = false;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private service: FirebaseServiceProvider,
    private menuCtrl: MenuController,
    private searchService: SearchServiceProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    this.initCategories();
  }

  private initCategories() {
    this.service.getAllCategories().
    subscribe(
      categories => {
        console.log(this.categories);
        let topCategories = categories.filter(c => !c.parents);
        topCategories.forEach(tc => {
          tc.kids = [];
          tc.children.forEach(ch => {
            tc.kids.push(categories.find(c => c.id === ch));
          });
        });
        this.categories = topCategories;
        this.populateMenuCategories();
      },
      error => {
        console.log(error);
      }
    );
  }

  populateMenuCategories(category?) {
    if (!category) {
      this.menuCategories = this.categories;
      this.breadcrumbs = [];
      this.breadcrumbs.push({name: 'All', id: '0', root: true});
    } else {
      this.breadcrumbs = category.breadcrumbs.slice();
      this.breadcrumbs.push({
        name: category.name,
        id: category.id,
        root: true,
      });
      this.selectedCategory = category;
      this.fetchAds();
      if (category.kids) {
        this.menuCategories = category.kids;
      }
    }
  }

  fetchAds() {
    this.menuCtrl.close();
    this.searchService.getCategorySearchObserver().next(this.selectedCategory);
  }

  actionBreadcrumb(breadcrumb) {
    if (breadcrumb.root) return;
    if (breadcrumb.id === '0') {
      this.populateMenuCategories();
    } else {
      let cat = this.categories.find(c => c.id === breadcrumb.id)
      this.populateMenuCategories(cat);
    }
  }

}

