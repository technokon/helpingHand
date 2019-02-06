import {async, TestBed} from '@angular/core/testing';
import {AlertController, IonicModule, LoadingController, ModalController} from 'ionic-angular';

import {PostingFormComponent} from './posting-form';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import {
  AlertControllerMock,
  AngularFireAuthMock,
  HttpClientMock,
  LoadingControllerMock,
  ModalControllerMock
} from '../../../test-config/mocks-ionic';
import {ProfilePage} from './profile';
import {HttpClient} from '@angular/common/http';
import {AngularFireAuth} from 'angularfire2/auth';
import {SessionServiceProvider} from './session-service';

describe('Session service', () => {
  let fixture;
  let component;
  let user;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      providers: [
        SessionServiceProvider,
        {provide: HttpClient, useClass: HttpClientMock},
        {provide: ModalController, useClass: ModalControllerMock},
        {provide: AlertController, useClass: AlertControllerMock},
        {provide: AngularFireAuth, useClass: AngularFireAuthMock},
        {provide: LoadingController, useClass: LoadingControllerMock}

      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
  }));

  sinon.spy(SessionServiceProvider.prototype, 'onInit');
  beforeEach(() => {
    component = TestBed.get(SessionServiceProvider);
    expect(SessionServiceProvider.prototype.onInit.called).toBeTruthy();
    user = {
      delete: sinon.spy(() => Promise.resolve()),
      updatePassword: sinon.spy((pass) => {
      user.password = pass;
      return Promise.resolve();}),
      updateEmail: sinon.spy((email) => Promise.resolve(email)),
      sendEmailVerification: sinon.spy(() => Promise.resolve()),
    };
    component.user = user;
  });

  it('should be created', () => {
    expect(component instanceof SessionServiceProvider).toBe(true);
  });

  describe('onInit', () => {
    it('should call initial setup methods', () => {
      component.subscribeToSignInCheck = sinon.spy();
      component.subscribeToSignOutModalSubject = sinon.spy();
      component.listenToAuthStateChange = sinon.spy();
      component.subscribeToAuthStateSubject = sinon.spy();
      component.onInit();
      expect(component.subscribeToSignInCheck.called).toBeTruthy();
      expect(component.subscribeToSignOutModalSubject.called).toBeTruthy();
      expect(component.listenToAuthStateChange.called).toBeTruthy();
      expect(component.subscribeToAuthStateSubject.called).toBeTruthy();
    });
  });

  describe('deleteUser', () => {
    it('should delete user', (done) => {
      component.deleteUser().then(() => {
        expect(component.user.delete.called).toBeTruthy();
        done();
      })
    })
    it('should return an error if user is not logged in', (done) => {
      component.user = undefined;
      component.deleteUser().catch( (error) => {
        expect(error).toBeDefined();
        done();
      })
    })
  });

  describe('updateUserPassword', () => {
    it('should update user password', (done) => {
      let password = 'test';
      component.updateUserPassword(password).then(() => {
        expect(component.user.password).toEqual(password);
        expect(component.user.updatePassword.called).toBeTruthy();
        done();
      })
    })
    it('should return error if no password is provided', (done) => {
      let password = undefined;
      component.user.password = 'test';
      component.updateUserPassword(password).catch( (error) => {
        expect(error).toBeDefined();
        expect(component.user.password).not.toEqual(password);
        expect(component.user.updatePassword.called).toBeFalsy();
        done();
      })
    })
    it('should return error if no user', (done) => {
      let password = 'fsdfsfsfsd';
      component.user = undefined;
      component.updateUserPassword(password).catch( (error) => {
        expect(error).toBeDefined();
        done();
      })
    })
  });

  describe('sendPasswordResetNotification', () => {
    it('should send password reset notification email', (done) => {
      component.sendPasswordResetNotification('test').then(() => {
        expect(component.afAuth.auth.sendPasswordResetEmail.called).toBeTruthy();
        done();
      })
    })
    it('should return error if no email provided', (done) => {
      component.sendPasswordResetNotification(undefined).catch((error) => {
        expect(error).toBeDefined();
        done();
      })
    })
  });

  describe('updateUserEmail', () => {
    it('should update user email address', (done) => {
      component.updateUserEmail('test@gmail.com').then(() => {
        expect(component.user.updateEmail.called).toBeTruthy();
        expect(component.user.sendEmailVerification.called).toBeTruthy();
        done();
      })
    });
    it('should reject if user email is NOT provided', (done) => {
      component.updateUserEmail(undefined).catch((error) => {
        expect(error).toBeDefined();
        expect(component.user.updateEmail.called).toBeFalsy();
        expect(component.user.sendEmailVerification.called).toBeFalsy();
        done();
      })
    });
    it('should reject if user is NOT logged in', (done) => {
      component.user = undefined;
      component.updateUserEmail('test@gmail.com').catch( (error) => {
        expect(error).toBeDefined();
        expect(user.updateEmail.called).toBeFalsy();
        expect(user.sendEmailVerification.called).toBeFalsy();
        done();
      })
    });
  })
});
