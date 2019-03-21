import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable, OnInit} from '@angular/core';
import {AlertController, LoadingController, ModalController} from 'ionic-angular';
import {Subject} from 'rxjs/Subject';
import {LoginPage} from '../../pages/login/login';
import {AngularFireAuth} from 'angularfire2/auth';
import {Observable} from 'rxjs/Observable';
import {RequestOptions} from '@angular/http';

@Injectable()
export class SessionServiceProvider{

  public loggedIn = false;
  private singInCheckSubject = new Subject<any>();
  private authStateSubject = new Subject<any>();
  private singOutModalSubject = new Subject<any>();
  public user;

  constructor(public http: HttpClient,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              private afAuth: AngularFireAuth,
              private loadingCtrl: LoadingController,) {
    this.onInit();
  }

  onInit() {
    this.subscribeToSignInCheck();
    this.subscribeToSignOutModalSubject();
    this.listenToAuthStateChange();
    this.subscribeToAuthStateSubject();
  }

  private subscribeToAuthStateSubject() {
    this.authStateSubject.subscribe(user => {
      this.loggedIn = !!(user && user.emailVerified);
      this.user = user;
    })
  }

  private listenToAuthStateChange() {
    this.afAuth.authState.subscribe(user => {
      this.authStateSubject.next(user);
    });
  }

  private subscribeToSignInCheck() {
    this.singInCheckSubject.subscribe(action => {
      if (!this.loggedIn) {
        this.modalCtrl.create(
          LoginPage,
          {
            sessionService: this,
            action,
          }).present();
      } else {
        action();
      }
    });
  }

  private subscribeToSignOutModalSubject() {
    this.singOutModalSubject.subscribe(data => {
      if (this.loggedIn) {
        this.showConfirmSignOut(data);
      }
    });
  }

  private showConfirmSignOut(data) {
    let confirm = this.alertCtrl.create({
      title: 'You are about to sing out',
      message: 'Are you sure you want to do that?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Sign Out',
          handler: () => {
            console.log(`Signing out user ${this.user}`);
            this.afAuth.auth.signOut();
            if (data) {
              data();
            }
          }
        }
      ]
    });
    confirm.present();
  }

  getSignInCheckSubject() {
    return this.singInCheckSubject;
  }

  getSignOutModalSubject() {
    return this.singOutModalSubject;
  }

  getAuthStateSubject() {
    return this.authStateSubject;
  }

  login() {
    this.loggedIn = !this.loggedIn;
  }

  isLoggedIn() {
    return !!this.loggedIn;
  }

  register() {
    this.loggedIn = true;
  }

  resendEmailVerification() {
    return Observable
      .fromPromise(
        this.user &&
        this.user.sendEmailVerification &&
        this.user.sendEmailVerification());
  }

  doLogin(user) {
    return Observable.fromPromise(this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
      .then(result => {
        console.log(`success signing in ...${JSON.stringify(result)}`);
        this.loggedIn = result && result.emailVerified;
        return result;
      }).catch(error => {
        console.log(`error logging in ... ${error}`);
        throw error;
      }));
  }

  doRegister(user) {
    return Observable.fromPromise(this.afAuth.auth.createUserWithEmailAndPassword(
      user.email,
      user.password
    ).then(result => {
      console.log(`success registering in ...${JSON.stringify(result)}`);
      return result && result.emailVerified || result.sendEmailVerification() && false;
    }).catch(error => {
      console.log(`error registering ... ${error}`);
      throw error;
    }));
  }

  deleteUser() {
    if (!this.user) {
      return Promise.reject('No user found... Please log in');
    }
    return this.user && this.user.delete();
  }

  updateUserPassword(newPassword) {
    let error;
    if (!newPassword) {
      error = 'Please provide a password';
    }
    if (!this.user) {
      error = 'No user found... Please log in';
    }
    if (error) {
      return Promise.reject(error);
    }

    return newPassword &&
        this.user &&
        this.user.updatePassword(newPassword);
  }

  sendPasswordResetNotification(emailAddress) {
    if (!emailAddress) {
      return Promise.reject('Please provide your email address');
    }
    return this.afAuth.auth.sendPasswordResetEmail(emailAddress);
  }

  updateUserEmail(emailAddress) {
    let error;
    if (!emailAddress) {
      error = 'Please provide an email';
    }
    if (!this.user) {
      error = 'No user found... Please log in';
    }
    if (error) {
      return Promise.reject(error);
    }
    return this.user.updateEmail(emailAddress)
      .then(() =>
        this.user.sendEmailVerification());
  }

  sendPostingMessage(data) {
    if (!data) {
      return Observable.throw(new Error('No data provided!!!'));
    }
    if (!this.user && !data.email) {
      return Observable.throw(new Error('No email provided!!!'));
    }
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Allow-Control-Allow-Origin', '*');

    const postData = {
      'name': data.name,
      'phone': data.phone,
      'from': this.user && this.user.email || data.email,
      'message': data.message,
      'postingTitle': data.postingTitle,
      'postingId': data.postingId,
    };

    console.log(JSON.stringify(data, null, 2));

    return this.http.post(
      'https://us-central1-helping-hand-1b53a.cloudfunctions.net/httpEmailMessage',
      postData,
      { headers });
  }

  startLoading() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    return loading;
  }

}
