import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AlertController, LoadingController, ModalController} from 'ionic-angular';
import {Subject} from 'rxjs/Subject';
import {LoginPage} from '../../pages/login/login';
import {AngularFireAuth} from 'angularfire2/auth';

@Injectable()
export class SessionServiceProvider {

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
    console.log('Hello SessionServiceProvider Provider');
    this.init();
  }

  init() {
    this.subscribeToSignInCheck();
    this.subscribeToSignOutModalSubject();
    this.listenToAuthStateChange();
    this.subscribeToAuthStateSubject();
  }

  private subscribeToAuthStateSubject() {
    this.authStateSubject.subscribe(user => {
      this.loggedIn = !!user;
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

  doLogin(user) {
    return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
      .then(result => {
        console.log(`success signing in ...${JSON.stringify(result)}`);
        this.loggedIn = true;
        return result;
      }).catch(error => {
        console.log(`error logging in ... ${error}`);
        throw error;
      });
  }

  doRegister(user) {
    return this.afAuth.auth.createUserWithEmailAndPassword(
      user.email,
      user.password
    ).then(result => {
      console.log(`success registering in ...${JSON.stringify(result)}`);
      this.loggedIn = true;
      return result;
    }).catch(error => {
      console.log(`error registering ... ${error}`);
      throw error;
    })
  }

  startLoading() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    return loading;
  }

}
