import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {IonicModule, LoadingController, NavController, NavParams, Platform} from 'ionic-angular';

import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import {
  CategoryServiceProviderMock,
  LoadingControllerMock,
  NavMock,
  NavParamsMock,
  PlatformMock,
  SearchServiceProviderMock
} from '../../../test-config/mocks-ionic';
import {DetailPage} from './detail';
import {CategoryServiceProvider} from '../../providers/category-service/category-service';
import {SearchServiceProvider} from '../../providers/search-service/search-service';
import {Observable} from 'rxjs/Observable';

describe('Detail page component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [DetailPage],
      imports: [
        IonicModule.forRoot(DetailPage)
      ],
      providers: [
        {provide: NavController, useClass: NavMock},
        {provide: NavParams, useClass: NavParamsMock},
        {provide: Platform, useClass: PlatformMock},
        {provide: SearchServiceProvider, useClass: SearchServiceProviderMock},
        {provide: CategoryServiceProvider, useClass: CategoryServiceProviderMock},
        {provide: LoadingController, useClass: LoadingControllerMock},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPage);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component instanceof DetailPage).toBe(true);
  });

  describe('ngOnInit', () => {
    it('should call initial setup methods', () => {
      component.navParams.get = sinon.spy(() => '123');
      component.retrievePostingById = sinon.spy();
      component.ngOnInit();
      expect(component.navParams.get.called).toBeTruthy();
      expect(component.retrievePostingById.calledWith('123')).toBeTruthy();
    })
  });

  describe('retrievePostingById', () => {
    it('should retrieve posting for id', fakeAsync(() => {
      const posting = {};
      sinon.spy(component, 'startLoading');
      component.attachCategoryToPosting = sinon.spy(() => Observable.of(posting));
      component.searchService.searchByQuery = sinon.spy(() => Observable.of([posting]));
      component.retrievePostingById('123');
      tick();
      //fixture.detectChanges();

      expect(component.startLoading.called).toBeTruthy();
      expect(component.searchService.searchByQuery.calledWith({
        query: {
          filters: `objectID:123`,
        }
      })).toBeTruthy();
      expect(component.attachCategoryToPosting.calledWith(posting)).toBeTruthy();
      expect(component.posting).toBeDefined();
      expect(component.loading).toBeDefined();
      expect(component.loading.dismiss.called).toBeTruthy();
    }));
  });

  describe('startLoading', () => {
    it('should show message passed in as parameter in the loading tiny-modal', (done) => {
      const testMessage = 'test1';
      component.startLoading(testMessage).then(() => {
        expect(component.loadingCtrl.create.calledWith({content: testMessage}))
        expect(component.loading.present.called).toBeTruthy();
        done();
      });
    });
    it('should show DEFAULT if no parameter passed in the loading tiny-modal', (done) => {
      component.startLoading().then(() => {
        expect(component.loadingCtrl.create.calledWith({content: 'Please wait...'}))
        expect(component.loading.present.called).toBeTruthy();
        done();
      });
    });
  });

  describe('attachCategoryToPosting', () => {
    it('should attach category to posting if id is set', () => {
      var posting = {
        category: {
          id: '1'
        }
      };
      component.categoryService.findCategory = sinon.spy(() => ({
        id: '1',
        name: 'test',
      }));
      posting = component.attachCategoryToPosting(posting);
      expect(component.categoryService.findCategory.called).toBeTruthy();
      expect(posting.category.name).toBeDefined();
    });
    it('should NOT attach category to posting if id and name is set', () => {
      var posting = {
        category: {
          id: '1',
          name: 'test2',
        }
      };
      component.categoryService.findCategory = sinon.spy(() => ({
        id: '1',
        name: 'test',
      }));
      posting = component.attachCategoryToPosting(posting);
      expect(component.categoryService.findCategory.called).toBeFalsy();
      expect(posting.category.name).toBeDefined();
    });
    it('should NOT attach category to posting if it is not found', () => {
      var posting = {
        category: {
          id: '1',
        }
      };
      component.categoryService.findCategory = sinon.spy(() => (null));
      posting = component.attachCategoryToPosting(posting);
      expect(component.categoryService.findCategory.called).toBeTruthy();
      expect(posting.category.name).toBeUndefined();
    });
  });

  describe('gotToSlides', () => {
    it('should NOT go to slides page if there is no pictures', (done) => {
      sinon.spy(component.navCtrl, 'push');
      component.gotToSlides().then(() => {
        expect(component.navCtrl.push.called).toBeFalsy();
        done();
      })
    });
    it('should go to slides page if there is pictures', (done) => {
      sinon.spy(component.navCtrl, 'push');
      component.posting = {
        pictures: [{}]
      };
      component.gotToSlides().then(() => {
        expect(component.navCtrl.push.called).toBeTruthy();
        done();
      })
    });
  });
});
