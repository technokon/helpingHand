import {Component, EventEmitter, Output} from '@angular/core';
import {FirebaseServiceProvider} from '../../providers/firebase-service/firebase-service';
import {UploadServiceProvider} from '../../providers/upload-service/upload-service';

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
  public categories = [];
  public topCategory;
  private files = [];
  @Output('event.postingForm.posted') adPosted: EventEmitter<any> = new EventEmitter<any>();
  @Output('event.postingForm.cancelled') adCancelled: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private service: FirebaseServiceProvider,
    private uploadService: UploadServiceProvider,) {
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
    this.service.getAllCategories().subscribe(categories => {
      this.categories = categories;
    })
  }

  private subscribeToFileSelections() {
    this.uploadService.getFileSelectorSubject().subscribe(files => {
      this.files = files;
    });
  }

  onChildCategorySelect(childCategory) {
    //console.log(childCategory);
  }

  detectFiles($event) {
    let files = $event.target.files;
    this.uploadService.getFileSelectorSubject().next(files);
  }

}
