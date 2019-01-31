import {Component, OnInit} from '@angular/core';
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
export class LoginPage implements OnInit{

  public user = {};
  public loading;
  public sessionService: SessionServiceProvider;
  public error;
  public emailVerificationMessage;
  private action;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.sessionService = this.navParams.get('sessionService');
    this.action = this.navParams.get('action');
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  }

  login() {
    this.startLoading();
    return this.sessionService.doLogin(this.user).subscribe(data => {
      if (!data.emailVerified) {
        this.emailVerificationMessage = 'It seems that you have not verified your email yet. ' +
          'Please verify your email and login';
      } else {
        this.executeOnSuccess();
        this.onClose();
      }
    }, error => {
      console.log(`error after login... ${error}`);
      this.error = error;
    }, () =>
      this.loading.dismiss());
  }

  resendEmailVarification() {
    this.startLoading();
    return this.sessionService.resendEmailVerification()
      .subscribe(
        undefined,
        (error) => {
          console.log(`error after resending email... ${error}`);
          this.error = error;
        }, () =>
          this.loading.dismiss());
  }

  private executeOnSuccess() {
    return this.action && this.action();
  }

  register() {
    this.startLoading();
    return this.sessionService.doRegister(this.user).subscribe(data => {
      if (!data) {
        this.emailVerificationMessage = 'We have sent you an email verification.' +
          ' You should receive it soon. Please verify your email and then login.';
      } else {
        this.executeOnSuccess();
        this.onClose();
      }
      return data;
    }, error => {
      console.log(`error after registration... ${error}`);
      this.error = error;
    }, () =>
      this.loading.dismiss());
  }

  private startLoading() {
    this.loading.present();
  }

  onClose() {
    this.navCtrl.pop();
  }

}
