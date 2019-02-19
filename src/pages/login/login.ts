import {Component, OnInit} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {SessionServiceProvider} from '../../providers/session-service/session-service';
import {Observable} from 'rxjs/Observable';

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

  public user:any = {};
  public loading;
  public sessionService: SessionServiceProvider;
  public error;
  public emailVerificationMessage;
  public showPasswordResetLink = false;
  private action;
  public actionMessage;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.sessionService = this.navParams.get('sessionService');
    this.action = this.navParams.get('action');
  }

  login() {
    return Observable.fromPromise(this.startLoading())
      .flatMapTo(this.sessionService.doLogin(this.user))
      .subscribe(data => {
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
        this.handleError(error);
        this.loading.dismiss();
      }, () =>
        this.loading.dismiss());
  }

  handleError(error) {
    if (error && error.code === 'auth/wrong-password') {
      this.showPasswordResetLink = true;
      this.actionMessage = error.message;
    }
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

  sendPasswordReset(email) {
    Observable.fromPromise(this.startLoading())
      .flatMapTo(this.sessionService.sendPasswordResetNotification(email))
      .subscribe(
        () => {
          this.actionMessage = 'You should receive an email with instruction to reset your password';
        },
        (error) => {
          console.log(`error after sending email reset... ${error}`);
          this.error = error;
          this.handleError(error);
          this.loading.dismiss();
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
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    return this.loading.present();
  }

  onClose() {
    this.navCtrl.pop();
  }

}
