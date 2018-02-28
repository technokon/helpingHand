import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ModalController} from 'ionic-angular';
import {Subject} from 'rxjs/Subject';
import {LoginPage} from '../../pages/login/login';
import firebase from 'firebase';

@Injectable()
export class SessionServiceProvider {

  public loggedIn = false;
  private singInCheckSubject = new Subject<any>();
  private authStateSubject = new Subject<any>();
  public user;
  constructor(
    public http: HttpClient,
    public modalCtrl: ModalController) {
    console.log('Hello SessionServiceProvider Provider');
    this.init();
  }

  init() {
    this.subscribeToSignInCheck();
    this.listenToAuthStateChange();
    this.subscribeToAuthStateChange();
  }

  private subscribeToAuthStateChange() {
    this.authStateSubject.subscribe(user => {
      if (user) {
        console.log(`logged in user: ${JSON.stringify(user,undefined,4)}`);
        this.loggedIn = true;
        this.user = user;
      }
    })
  }

  private listenToAuthStateChange() {
    firebase.auth().onAuthStateChanged(user => {
      this.authStateSubject.next(user);
    })
  }

  private subscribeToSignInCheck() {
    this.singInCheckSubject.subscribe(data => {
      if (!this.loggedIn) {
        this.modalCtrl.create(LoginPage).present();
      }
    })
  }

  getSignInCheckSubject() {
    return this.singInCheckSubject;
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

}
