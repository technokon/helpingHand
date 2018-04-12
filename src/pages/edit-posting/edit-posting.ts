import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AdProvider} from '../../providers/ad/ad';

/**
 * Generated class for the EditPostingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-posting',
  templateUrl: 'edit-posting.html',
})
export class EditPostingPage {

  public posting = this.navParams.data;

  public heading = 'New Posting';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public adService: AdProvider) {
    this.init();
  }

  init() {
    if (this.posting && this.posting.id) {
      this.heading = 'Edit Posting';
    }
    this.adService.editPostingSubject.next(this.posting);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPostingPage');
  }

  goBack() {
    this.navCtrl.pop();
  }

  onPostingCancelled($event) {
    this.goBack();
  }

}
