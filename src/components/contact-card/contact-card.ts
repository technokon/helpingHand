import {Component, Input} from '@angular/core';
import {SessionServiceProvider} from '../../providers/session-service/session-service';
import {LoadingController} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';

/**
 * Generated class for the ContactCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'h-contact-card',
  templateUrl: 'contact-card.html'
})
export class ContactCardComponent {

  @Input() private postingId;
  @Input() private postingTitle;
  public contact: any = {};
  public messageSentContent;
  public sendMessageError;
  constructor(
    public sessionService: SessionServiceProvider,
    private loadingCtrl: LoadingController) {
  }

  actionMessage() {
    const loading = this.loadingCtrl.create({
      content: 'Sending your message...'
    });
    return Observable.fromPromise(loading.present())
      .flatMapTo(this.sessionService.sendPostingMessage({
        ...this.contact,
        postingId: this.postingId,
        postingTitle: this.postingTitle,
      }))
      .subscribe(
        (content) => {
          console.log(content);
          this.messageSentContent = {
            header: `Success`,
            items: [
              `Your message for ${this.postingTitle} has been sent successfully!`,
            ]
          };
        },
        (error) => {
          console.log(`error sending message: ${error}`);
          this.sendMessageError = error.message;
          loading.dismiss();
        },
        () =>
          loading.dismiss());
  }
}
