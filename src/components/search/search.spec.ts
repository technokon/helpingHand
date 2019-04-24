import {async, TestBed} from '@angular/core/testing';
import {AlertController, IonicModule, ModalController, NavController, Platform} from 'ionic-angular';

import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import {
  AdProviderMock, AlertControllerMock, FirebaseServiceProviderMock, ModalControllerMock, NavMock, PlatformMock,
  SearchServiceProviderMock,
  SessionServiceProviderMock
} from '../../../test-config/mocks-ionic';
import {SessionServiceProvider} from '../../providers/session-service/session-service';
import {AdProvider} from '../../providers/ad/ad';
import {SearchComponent} from './search';
import {SearchServiceProvider} from '../../providers/search-service/search-service';
import {FirebaseServiceProvider} from '../../providers/firebase-service/firebase-service';
import {Observable} from 'rxjs/Observable';

describe('Search component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [
        IonicModule.forRoot(SearchComponent)
      ],
      providers: [
        {provide: NavController, useClass: NavMock},
        { provide: ModalController, useClass: ModalControllerMock },
        {provide: SearchServiceProvider, useClass: SearchServiceProviderMock},
        {provide: Platform, useClass: PlatformMock},
        {provide: SessionServiceProvider, useClass: SessionServiceProviderMock},
        {provide: FirebaseServiceProvider, useClass: FirebaseServiceProviderMock},
        {provide: AlertController, useClass: AlertControllerMock},
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    component.init = sinon.spy();
    expect(component instanceof SearchComponent).toBe(true);
  });

  describe('ngOnInit', () => {
    it('should call initial setup methods', () => {
      component.categorySearch$ = sinon.spy(() => Observable.of(1));
      component.uidSearch$ = sinon.spy(() => Observable.of(2));
      component.textSearch$ = sinon.spy(() => Observable.of(3));
      component.searchButtonClick$ = sinon.spy(() => Observable.of(4));
      component.deletePostingTrigger$ = sinon.spy(() => Observable.of(5));
      component.ngOnInit();
      expect(component.postings).toBeDefined();
      expect(component.categorySearch$.called).toBeTruthy();
      expect(component.uidSearch$.called).toBeTruthy();
      expect(component.textSearch$.called).toBeTruthy();
      expect(component.searchButtonClick$.called).toBeTruthy();
      expect(component.deletePostingTrigger$.called).toBeTruthy();
    })
  });

  describe('textSearch$', () => {
    it('should return a stream', () => {
      expect(component.textSearch$() instanceof Observable).toBeTruthy();
    });
  });

  describe('uidSearch$', () => {
    it('should return a stream', () => {
      sinon.spy(component.searchService, 'getUidSearch');
      expect(component.uidSearch$() instanceof Observable).toBeTruthy();
      expect(component.searchService.getUidSearch.called).toBeTruthy();
    });
  });

  describe('categorySearch$', () => {
    it('should return a stream', () => {
      sinon.spy(component.searchService, 'getCategorySearch');
      expect(component.categorySearch$() instanceof Observable).toBeTruthy();
      expect(component.searchService.getCategorySearch.called).toBeTruthy();
    });
  });

  describe('deletePostingTrigger$', () => {
    it('should return a stream', () => {
      component.performSearch$ = sinon.spy(() => Observable.of(1))
      expect(component.deletePostingTrigger$() instanceof Observable).toBeTruthy();
      expect(component.performSearch$.called).toBeTruthy();
    });
  });

});
