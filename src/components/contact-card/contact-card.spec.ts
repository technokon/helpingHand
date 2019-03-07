import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {IonicModule, LoadingController} from 'ionic-angular';

import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import {LoadingControllerMock, SessionServiceProviderMock} from '../../../test-config/mocks-ionic';
import {SessionServiceProvider} from '../../providers/session-service/session-service';
import {ContactCardComponent} from './contact-card';
import {Observable} from 'rxjs/Observable';

describe('Contact card component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ContactCardComponent],
      imports: [
        IonicModule.forRoot(ContactCardComponent)
      ],
      providers: [
        {provide: SessionServiceProvider, useClass: SessionServiceProviderMock},
        {provide: LoadingController, useClass: LoadingControllerMock},
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactCardComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    component.init = sinon.spy();
    expect(component instanceof ContactCardComponent).toBe(true);
  });

  describe('actionMessage', () => {
    it('should send message when logged in', fakeAsync(() => {
      sinon.spy(component.sessionService, 'sendPostingMessage');
      component.postingId = 'testqwdsdqdqwdwqwdqw';
      component.postingTitle = 'This is a unit test';
      component.contact = {
        name: 'Test1',
        phone: '1800-testme',
        message: 'hello i am interested in unit testing...',
      }
      component.actionMessage();
      tick();
      expect(component.loadingCtrl.create.called).toBeTruthy();
      expect(component.loadingCtrl.present.called).toBeTruthy();
      expect(component.loadingCtrl.dismiss.called).toBeTruthy();
      expect(component.sessionService.sendPostingMessage.getCall(0).args[0]).toEqual({
        ...component.contact,
        postingId: component.postingId,
        postingTitle: component.postingTitle,
      });
      expect(component.messageSentContent).toBeDefined();
    }));
    it('should send message when NOT logged in', fakeAsync(() => {
      sinon.spy(component.sessionService, 'sendPostingMessage');
      component.postingId = 'testqwdsdqdqwdwqwdqw';
      component.postingTitle = 'This is a unit test';
      component.contact = {
        name: 'Test1',
        phone: '1800-testme',
        message: 'hello i am interested in unit testing...',
        email: 'test@testing.test'
      }
      component.actionMessage();
      tick();
      expect(component.loadingCtrl.create.called).toBeTruthy();
      expect(component.loadingCtrl.present.called).toBeTruthy();
      expect(component.loadingCtrl.dismiss.called).toBeTruthy();
      expect(component.sessionService.sendPostingMessage.getCall(0).args[0]).toEqual({
        ...component.contact,
        postingId: component.postingId,
        postingTitle: component.postingTitle,
      });
      expect(component.messageSentContent).toBeDefined();

    }));
    it('should display message on error in', fakeAsync(() => {
      component.sessionService.sendPostingMessage = sinon.spy(() => Observable.throw(new Error('some error')));
      component.postingId = 'testqwdsdqdqwdwqwdqw';
      component.postingTitle = 'This is a unit test';
      component.contact = {
        name: 'Test1',
        phone: '1800-testme',
        message: 'hello i am interested in unit testing...',
        email: 'test@testing.test'
      }
      component.actionMessage();
      tick();
      expect(component.loadingCtrl.create.called).toBeTruthy();
      expect(component.loadingCtrl.present.called).toBeTruthy();
      expect(component.loadingCtrl.dismiss.called).toBeTruthy();
      expect(component.sessionService.sendPostingMessage.getCall(0).args[0]).toEqual({
        ...component.contact,
        postingId: component.postingId,
        postingTitle: component.postingTitle,
      });
      expect(component.messageSentContent).toBeUndefined();
      expect(component.sendMessageError).toBeDefined();
    }));
  });

});
