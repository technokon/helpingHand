import { async, TestBed } from '@angular/core/testing';
import {IonicModule, LoadingController, ModalController, Platform} from 'ionic-angular';

import { PostingFormComponent } from './posting-form';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import {
  AdProviderMock,
  FirebaseServiceProviderMock, LoadingControllerMock, ModalControllerMock, PlatformMock, SearchServiceProviderMock,
  SessionServiceProviderMock,
  UploadServiceProviderMock
} from '../../../test-config/mocks-ionic';
import {FirebaseServiceProvider} from '../../providers/firebase-service/firebase-service';
import {UploadServiceProvider} from '../../providers/upload-service/upload-service';
import {SearchServiceProvider} from '../../providers/search-service/search-service';
import {SessionServiceProvider} from '../../providers/session-service/session-service';
import {AdProvider} from '../../providers/ad/ad';

describe('Posting form component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [PostingFormComponent],
      imports: [
        IonicModule.forRoot(PostingFormComponent)
      ],
      providers: [
        {provide: FirebaseServiceProvider, useClass: FirebaseServiceProviderMock},
        {provide: UploadServiceProvider, useClass: UploadServiceProviderMock},
        {provide: ModalController, useClass: ModalControllerMock},
        {provide: SearchServiceProvider, useClass: SearchServiceProviderMock},
        {provide: SessionServiceProvider, useClass: SessionServiceProviderMock},
        {provide: AdProvider, useClass: AdProviderMock},
        { provide: Platform, useClass: PlatformMock },
        {provide: LoadingController, useClass: LoadingControllerMock}
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostingFormComponent);
    component = fixture.componentInstance;
    component.loading = component.loadingCtrl.create();
  });

  it('should be created', () => {
    component.init = sinon.spy();
    expect(component instanceof PostingFormComponent).toBe(true);
  });

  describe('ngOnInit', () => {
    it('should call initial setup methods', () => {
      component.subscribeToCategories = jasmine.createSpy('subscribeToCategories spy')
      component.subscribeToFileSelections = sinon.spy();
      component.subscribeToEditPosting = sinon.spy();
      component.ngOnInit();
      expect(component.subscribeToCategories).toHaveBeenCalled();
      expect(component.subscribeToFileSelections.called).toBe(true);
      expect(component.subscribeToEditPosting.called).toBe(true);
      expect(component.loading).toBeDefined();
    })
  });

  describe('postAd', () => {
    it('should post the add and fire an event to parent with the posting', (done) => {
      component.ad = {}
      component.files = ['test'];
      spyOn(component.adPosted, 'emit');
      spyOn(component, 'startLoading');
      sinon.spy(component.service, 'addPosting');
      component.postAd().then((posting) => {
        expect(component.service.addPosting.calledWith(posting, component.files)).toBe(true);
        expect(component.adPosted.emit).toHaveBeenCalled();
        expect(component.loading.dismiss.called).toBeTruthy();
        done();
      });
      expect(component.startLoading).toHaveBeenCalled();
    })
  });

  describe('startLoading', () => {
    it('should start loading', () => {
      component.startLoading();
      expect(component.loading).toBeDefined();
      expect(component.loading.present.called).toBeTruthy();
    })
  });


});
