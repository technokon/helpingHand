import {async, TestBed} from '@angular/core/testing';
import {IonicModule, NavController, Platform} from 'ionic-angular';

import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import {AdProviderMock, NavMock, PlatformMock, SessionServiceProviderMock} from '../../../test-config/mocks-ionic';
import {SessionServiceProvider} from '../../providers/session-service/session-service';
import {AdProvider} from '../../providers/ad/ad';
import {PostingComponent} from './posting';

describe('Posting form component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [PostingComponent],
      imports: [
        IonicModule.forRoot(PostingComponent)
      ],
      providers: [
        {provide: SessionServiceProvider, useClass: SessionServiceProviderMock},
        { provide: Platform, useClass: PlatformMock },
        {provide: AdProvider, useClass: AdProviderMock},
        {provide: NavController, useClass: NavMock},
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostingComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    component.init = sinon.spy();
    expect(component instanceof PostingComponent).toBe(true);
  });

  describe('ngOnInit', () => {
    it('should call initial setup methods', () => {
      component.subscribeToEditPosting = jasmine.createSpy('subscribeToEditPosting spy')
      component.ngOnInit();
      expect(component.subscribeToEditPosting).toHaveBeenCalled();
    })
  });

  describe('onAdPosted', () => {
    it('shold perform logic when ad posted event occurs and it is not empty', () => {
      const event = {
        result: 'success',
        data: {
          link: { abc: 'abc'}
        }
      }
      component.onAdPosted(event);
      expect(component.adPosted).toBe(true);
      expect(component.posting).toEqual(event.data.link);
    });
    it('shold perform logic when ad posted event occurs and it is empty', () => {
      const event = {
      }
      component.onAdPosted();
      expect(component.adPosted).toBe(false);
      expect(component.posting).toEqual(undefined);
    });
  })

});
