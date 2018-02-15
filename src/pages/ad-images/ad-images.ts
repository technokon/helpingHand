import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, Slides} from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-ad-images',
  templateUrl: 'ad-images.html',
})
export class AdImagesPage {

  public images = this.navParams.data;

  @ViewChild(Slides) slides: Slides;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,) {
  }

  ionViewDidLoad() {
    this.initSlider();
    console.log('ionViewDidLoad AdImagesPage');
  }

  initSlider() {
    this.slides.enableKeyboardControl(true);
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    console.log('Current index is', currentIndex);
  }

  goBack() {
    this.navCtrl.pop();
  }

  nextImage() {
    if (this.slides.isEnd()) {
      this.slides.slideTo(0);
    } else {
      this.slides.slideNext();
    }
  }

  previousImage() {
    this.slides.slidePrev();
  }

}
