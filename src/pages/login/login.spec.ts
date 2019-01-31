import {async, TestBed} from '@angular/core/testing';
import {IonicModule, LoadingController, NavController, NavParams} from 'ionic-angular';

import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import {
  LoadingControllerMock,
  NavMock,
  NavParamsMock,
  SessionServiceProviderMock
} from '../../../test-config/mocks-ionic';
import {LoginPage} from './login';

describe('Login page component', () => {
  let fixture;
  let component;
  let sessionService;
  let action;
  const user = {

  }

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [
        IonicModule.forRoot(LoginPage)
      ],
      providers: [
        {provide: NavController, useClass: NavMock},
        {provide: NavParams, useClass: NavParamsMock},
        {provide: LoadingController, useClass: LoadingControllerMock},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
  }));

  beforeEach(() => {
    sessionService = new SessionServiceProviderMock();
    action = jasmine.createSpy('action spy');
    const params = {
      'sessionService': sessionService,
      'action': action
    };
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;

    spyOn(component.navParams, 'get').and.callFake(p => params[p]);
    component.ngOnInit();
    component.user = user;
  });

  it('should be created', () => {
    expect(component instanceof LoginPage).toBe(true);
  });

  describe('ngOnInit', () => {
    it('should call initial setup methods', () => {
      component.ngOnInit();
      expect(component.sessionService).toEqual(sessionService);
      expect(component.action).toEqual(action);
      expect(component.loading).toBeDefined();
    })
  });

  describe('login', () => {
    it('perform login with email being verified', (done) => {
      spyOn(component, 'startLoading');
      spyOn(component, 'executeOnSuccess');
      spyOn(component, 'onClose');

      sinon.spy(component.sessionService, 'doLogin');

      component.login().then(() => {
        expect(component.sessionService.doLogin.called).toBeTruthy();
        expect(component.loading.dismiss.called).toBeTruthy();
        expect(component.executeOnSuccess).toHaveBeenCalled();
        expect(component.emailVerificationMessage).toBeUndefined();
        expect(component.onClose).toHaveBeenCalled();
        done();
      })
      expect(component.startLoading).toHaveBeenCalled();
    })
    it('perform login with email NOT being verified', (done) => {
      spyOn(component, 'startLoading');
      spyOn(component, 'executeOnSuccess');
      spyOn(component, 'onClose');

      component.sessionService.mockData.emailVerified = false;
      sinon.spy(component.sessionService, 'doLogin');

      component.login().then(() => {
        expect(component.sessionService.doLogin.called).toBeTruthy();
        expect(component.loading.dismiss.called).toBeTruthy();
        expect(component.executeOnSuccess).not.toHaveBeenCalled();
        expect(component.onClose).not.toHaveBeenCalled();
        expect(component.emailVerificationMessage).toBeDefined();

        done();
      })
      expect(component.startLoading).toHaveBeenCalled();
    })
  });

  describe('register', () => {
    it('register with email being verified', (done) => {
      spyOn(component, 'startLoading');
      spyOn(component, 'executeOnSuccess');
      spyOn(component, 'onClose');

      sinon.spy(component.sessionService, 'doRegister');

      component.register().then(() => {
        expect(component.sessionService.doRegister.called).toBeTruthy();
        expect(component.loading.dismiss.called).toBeTruthy();
        expect(component.executeOnSuccess).toHaveBeenCalled();
        expect(component.emailVerificationMessage).toBeUndefined();
        expect(component.onClose).toHaveBeenCalled();
        done();
      })
      expect(component.startLoading).toHaveBeenCalled();
    })
    it('perform register with email NOT being verified', (done) => {
      spyOn(component, 'startLoading');
      spyOn(component, 'executeOnSuccess');
      spyOn(component, 'onClose');

      component.sessionService.mockEmailVerification = false;
      sinon.spy(component.sessionService, 'doRegister');

      component.register().then(() => {
        expect(component.sessionService.doRegister.called).toBeTruthy();
        expect(component.loading.dismiss.called).toBeTruthy();
        expect(component.executeOnSuccess).not.toHaveBeenCalled();
        expect(component.onClose).not.toHaveBeenCalled();
        expect(component.emailVerificationMessage).toBeDefined();

        done();
      })
      expect(component.startLoading).toHaveBeenCalled();
    })
  });

  describe('resendEmailVarification', () => {
    it('should resend email notification', (done) => {
      spyOn(component, 'startLoading');
      sinon.spy(component.sessionService, 'resendEmailVerification');

      component.resendEmailVarification().then(() => {
        expect(component.sessionService.resendEmailVerification.called).toBeTruthy();
        expect(component.loading.dismiss.called).toBeTruthy();
        done();
      })
      expect(component.startLoading).toHaveBeenCalled();
    })
  });

  describe('executeOnSuccess', () => {
    it('should execute action passed in', () => {
      component.executeOnSuccess();
      expect(component.action).toHaveBeenCalled();
    })
    it('should NOT execute action if it does not exist', () => {
      component.action = undefined;
      expect(component.executeOnSuccess()).toBeUndefined()
    })
  });

  describe('startLoading', () => {
    it('should start loading', () => {
      component.startLoading();
      expect(component.loading).toBeDefined();
      expect(component.loading.present.called).toBeTruthy();
    })
  });

  describe('onClose', () => {
    it('should execute onClose', () => {
      spyOn(component.navCtrl, 'pop');
      component.onClose();
      expect(component.navCtrl.pop).toHaveBeenCalled();
    })
  })




});
