import {Component, EventEmitter, Output} from '@angular/core';
import {FirebaseServiceProvider} from '../../providers/firebase-service/firebase-service';
import {UploadServiceProvider} from '../../providers/upload-service/upload-service';
import {CategoryPickPage} from '../../pages/category-pick/category-pick';
import {ModalController} from 'ionic-angular';
import {SearchServiceProvider} from '../../providers/search-service/search-service';

/**
 * Generated class for the PostingFormComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'h-posting-form',
  templateUrl: 'posting-form.html'
})
export class PostingFormComponent {

  public ad: any = {
    pictures: [],
  };
  public category;
  public selectedCategory;
  private files = [];
  @Output('event.postingForm.posted') adPosted: EventEmitter<any> = new EventEmitter<any>();
  @Output('event.postingForm.cancelled') adCancelled: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private service: FirebaseServiceProvider,
    private uploadService: UploadServiceProvider,
    public modalCtrl: ModalController,
    private searchService: SearchServiceProvider,) {
    this.init();
  }

  init() {
    this.subscribeToCategories();
    this.subscribeToFileSelections();
  }

  uploadPictures() {

  }

  postAd() {
    this.ad.datePosted = new Date();
    this.service.addPosting(this.ad, this.files);

    this.adPosted.emit({
      result: 'success',
      data: {
        link: 'a link to the posted ad',
      },
    });
  }

  cancelAd() {
    this.adCancelled.emit({
      result: 'success',
    });
  }

  private subscribeToCategories() {
    this.searchService.getCategorySearch().subscribe(searchCategory => {
      this.selectedCategory = searchCategory;
      this.category = searchCategory.name;
      this.ad.category = searchCategory.id;
    })
  }

  private subscribeToFileSelections() {
    this.uploadService.getFileSelectorSubject().subscribe(files => {
      this.files = files;
    });
  }

  detectFiles($event) {
    let files = $event.target.files;
    this.uploadService.getFileSelectorSubject().next(files);
  }

  clearSelectedCategory() {
    this.selectedCategory = null;
    this.category = null;
    delete this.ad.category;
  }

  showCategorySelectionModal() {
    this.modalCtrl.create(CategoryPickPage).present();
  }

}
