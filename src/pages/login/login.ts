import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {SessionServiceProvider} from '../../providers/session-service/session-service';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'h-page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public user = {};
  public loading = null;
  public sessionService: SessionServiceProvider = null;
  public error = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController,) {
    this.sessionService = navParams.get('sessionService');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.init();
  }

  init() {
  }

  login() {
    this.startLoading();
    this.sessionService.doLogin(this.user).then(data => {
      console.log(`got data back ... ${data}`);
      this.loading.dismiss();
      this.onClose();
    }).catch(error => {
      console.log(`error after login... ${error}`);
      this.error = error;
      this.loading.dismiss();
    });
  }

  register() {
    this.startLoading();
    this.sessionService.doRegister(this.user).then(data => {
      console.log(`got data back ... ${data}`);
      this.loading.dismiss();
      this.onClose();
    }).catch(error => {
      console.log(`error after registration... ${error}`);
      this.error = error;
      this.loading.dismiss();
    });
  }

  private clearErrors() {
    this.error = null;
  }

  private startLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  onClose() {
    this.navCtrl.pop();
  }

}
