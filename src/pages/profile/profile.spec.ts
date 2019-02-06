import {async, TestBed} from '@angular/core/testing';
import {AlertController, IonicModule, LoadingController, NavController, NavParams, Platform} from 'ionic-angular';

import {PostingFormComponent} from './posting-form';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import {
  AlertControllerMock, LoadingControllerMock, NavMock, NavParamsMock, PlatformMock,
  SessionServiceProviderMock
} from '../../../test-config/mocks-ionic';
import {ProfilePage} from './profile';
import {SessionServiceProvider} from '../../providers/session-service/session-service';

describe('Profile component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ProfilePage],
      imports: [
        IonicModule.forRoot(ProfilePage)
      ],
      providers: [
        {provide: NavController, useClass: NavMock},
        {provide: SessionServiceProvider, useClass: SessionServiceProviderMock},
        {provide: AlertController, useClass: AlertControllerMock},
        {provide: LoadingController, useClass: LoadingControllerMock},
        {provide: Platform, useClass: PlatformMock}

      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;

    sinon.spy(component.loadingCtrl, 'create');
    sinon.spy(component.alertCtrl, 'create');
  });

  it('should be created', () => {
    component.init = sinon.spy();
    expect(component instanceof ProfilePage).toBe(true);
  });

  describe('ngOnInit', () => {
    it('should call initial setup methods', () => {

    });
  });

  describe('updatePassword', () => {
    it('should update user password', (done) => {
      sinon.spy(component.sessionService, 'updateUserPassword');
      component.updatePassword().then(() => {
        expect(component.sessionService.updateUserPassword.called).toBeTruthy();
        expect(component.loadingCtrl.dismiss.called).toBeTruthy();
        done();
      })
      expect(component.loadingCtrl.create.called).toBeTruthy();
      expect(component.loadingCtrl.present.called).toBeTruthy();
    });
    it('should throw an error if no password is set on user', (done) => {
      sinon.spy(component.sessionService, 'updateUserPassword');
      component.sessionService.user.password = undefined;
      component.updatePassword().catch((error) => {
        expect(component.sessionService.updateUserPassword.called).toBeTruthy();
        expect(component.loadingCtrl.dismiss.called).toBeTruthy();
        expect(error).toBeDefined();
        done();
      })
      expect(component.loadingCtrl.create.called).toBeTruthy();
      expect(component.loadingCtrl.present.called).toBeTruthy();
    });
  });

  describe('showDeleteProfileAlert', () => {
    it('should present an alert for profile delete confirmation', (done) => {
      component.showDeleteProfileAlert().then(() => {
        expect(component.alertCtrl.create.called).toBeTruthy();
        expect(component.alertCtrl.present.called).toBeTruthy();
        done();
      })
    })
  });

  describe('deleteProfile', () => {
    it('should execute delete profile functionality', (done) => {
      sinon.spy(component.sessionService, 'deleteUser');
      spyOn(component, 'closePage');
      component.deleteProfile().then(() => {
        expect(component.sessionService.deleteUser.called).toBeTruthy();
        expect(component.loadingCtrl.dismiss.called).toBeTruthy();
        expect(component.closePage).toHaveBeenCalled();
        done();
      });
      expect(component.loadingCtrl.create.called).toBeTruthy();
      expect(component.loadingCtrl.present.called).toBeTruthy();
    });
  });

  xdescribe('updateUserEmail', () => {
    it('should update user email address', (done) => {
      sinon.spy(component.sessionService, 'updateUserEmail');
      component.updateUserEmail().then(() => {
        expect(component.sessionService.updateUserEmail.called).toBeTruthy();
        expect(component.loadingCtrl.dismiss.called).toBeTruthy();
        done();
      });
      expect(component.loadingCtrl.create.called).toBeTruthy();
      expect(component.loadingCtrl.present.called).toBeTruthy();
    })
    it('should return an error if error is returned from service', (done) => {
      sinon.spy(component.sessionService, 'updateUserEmail');
      component.updateUserEmail().catch((error) => {
        expect(component.sessionService.updateUserEmail.called).toBeTruthy();
        expect(error).toBeDefined();
        done();
      });
    })
  })

  describe('closePage', () => {
    it('should close/pop the page off the stack', (done) => {
      component.navCtrl.pop = sinon.spy(() => Promise.resolve())
      component.closePage().then(() => {
        expect(component.navCtrl.pop.called).toBeTruthy();
        done();
      });
    });
  });


});
