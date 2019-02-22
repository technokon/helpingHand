import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

export class PlatformMock {
  public ready(): Promise<string> {
    return Promise.resolve('READY');
  }

  public getQueryParam() {
    return true;
  }

  public registerBackButtonAction(fn: Function, priority?: number): Function {
    return (() => true);
  }

  public hasFocus(ele: HTMLElement): boolean {
    return true;
  }

  public doc(): HTMLDocument {
    return document;
  }

  public is(): boolean {
    return true;
  }

  public getElementComputedStyle(container: any): any {
    return {
      paddingLeft: '10',
      paddingTop: '10',
      paddingRight: '10',
      paddingBottom: '10',
    };
  }

  public onResize(callback: any) {
    return callback;
  }

  public registerListener(ele: any, eventName: string, callback: any): Function {
    return (() => true);
  }

  public win(): Window {
    return window;
  }

  public raf(callback: any): number {
    return 1;
  }

  public timeout(callback: any, timer: number): any {
    return setTimeout(callback, timer);
  }

  public cancelTimeout(id: any) {
    // do nothing
  }

  public getActiveElement(): any {
    return document['activeElement'];
  }

  public isLandscape() {
    return true;
  }
}

export class StatusBarMock extends StatusBar {
  styleDefault() {
    return;
  }
}

export class SplashScreenMock extends SplashScreen {
  hide() {
    return;
  }
}

export class NavMock {

  public pop(): any {
    return Promise.resolve();
  }

  public push(): any {
    return Promise.resolve();
  }

  public getActive(): any {
    return {
      'instance': {
        'model': 'something',
      },
    };
  }

  public setRoot(): any {
    return true;
  }

  public registerChildNav(nav: any): void {
    return ;
  }
}

export class NavParamsMock {
  get(){}
}

export class DeepLinkerMock {

}

export class FirebaseServiceProviderMock {

  addPosting(posting, files) {
    return {
      subscribe: (f, error, complete) => {
        const result = f(posting);
        complete();
        return Promise.resolve(result)
      }
    };
  }

}

export class UploadServiceProviderMock {

}

export class SearchServiceProviderMock {

}

export class SessionServiceProviderMock {

  public mockData = {
    emailVerified: true,
  }

  public mockEmailVerification = true;

  public user = {
    uid: '123',
    password: 'test123'
  }

  public error;

  doLogin(user) {
    return Promise.resolve(this.mockData);
  }

  doRegister(user) {
    return {
      subscribe: (fn, error, complete) => {
        fn(this.mockEmailVerification);
        complete();
        return Promise.resolve();
      }
    }
  }

  resendEmailVerification() {
    return {
      subscribe: (fn, error, complete) => {
        fn && fn();
        complete && complete();
        return Promise.resolve();
      }
    }
  }

  deleteUser() {
    return Promise.resolve();
  }

  sendPasswordResetNotification() {
    return Promise.resolve();
  }

  updateUserPassword(password) {
    return !password && Promise.reject('no password ') || Promise.resolve();
  }

  updateUserEmail(email) {
    if (!email) {
      return Promise.reject('no email provided MOCK')
    }
    return Promise.resolve();
  }

  searchByQuery() {
    return Promise.resolve();
  }
}

export class AdProviderMock {

}

export class ModalControllerMock {

}

export class LoadingControllerMock {
  present = sinon.spy(() => Promise.resolve());
  dismiss = sinon.spy(() => Promise.resolve());

  create() {
    return {
      present: this.present,
      dismiss: this.dismiss,
    }
  }
}
sinon.spy(LoadingControllerMock.prototype, 'create');

export class AlertControllerMock {
  present = sinon.spy(() => Promise.resolve());
  create(alert) {
    return {
      present: this.present
    }
  }
}

export class HttpClientMock {

}

export class AngularFireAuthMock {

  auth = {
    sendPasswordResetEmail: sinon.spy(() => Promise.resolve())
  }

  authState = new Subject<any>();

}

export class ViewControllerMock{
  readReady = {
    subscribe(){

    }
  };
  writeReady = {
    subscribe(){

    }
  };

  dismiss = sinon.spy();
  _setHeader(){

  }
  _setNavbar(){

  }
  _setIONContent(){

  }
  _setIONContentRef(){

  }
}


export class CategoryServiceProviderMock {
  findCategory = sinon.spy((c) => {c});
}
