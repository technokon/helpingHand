import {Component, EventEmitter, Output} from '@angular/core';
import {FirebaseServiceProvider} from '../../providers/firebase-service/firebase-service';

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

  public ad: any = {};
  @Output('event.postingForm.posted') adPosted: EventEmitter<any> = new EventEmitter<any>();

  constructor(private service: FirebaseServiceProvider) {
  }

  uploadPictures() {

  }

  postAd() {
    this.service.addPosting(this.ad);

    this.adPosted.emit({
      result: 'success',
      data: {
        link: 'a link to the posted ad',
      },
    });
  }

}
