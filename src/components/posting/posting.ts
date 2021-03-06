import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import { SessionServiceProvider } from '../../providers/session-service/session-service';
import {AdProvider} from '../../providers/ad/ad';
import {DetailPage} from '../../pages/detail/detail';

/**
 * Generated class for the PostingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'h-posting',
  templateUrl: 'posting.html'
})
export class PostingComponent  implements OnInit {

  public guideContent = this.getGuideContent();
  public adPosted  = false;

  posting;

  @Output('event.posting.cancelled') postingCancelled: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public session: SessionServiceProvider,
    public platform: Platform,
    public adService: AdProvider,
    private navCtrl: NavController,) {
  }

  ngOnInit() {
    this.subscribeToEditPosting();
  }

  private subscribeToEditPosting() {
    this.adService.editPostingSubject.subscribe(posting => {
      this.posting = posting;
    })
  }

  getGuideContent() {
    if (this.session.loggedIn) {
      return {
        header: 'Add Tips',
        items: [
          'Enter as many details as possible',
          'Include pictures (15 max)',
          'Click the Post Ad button!',
        ]
      }
    }
    return {
      header: 'Post Your Ad in 3 simple steps!',
      items: [
        'Register',
        'Enter Ad details',
        'Click the Post Ad button!',
      ]
    }
  }

  getConfirmationContent() {
    if (this.adPosted) {
      return {
        header: 'Add Posted',
        items: [
          'Your Ad has been posted!',
        ]
      }
    }
  }

  onAdPosted($event) {
    if ($event && $event.result === 'success') {
      this.adPosted = true;
      this.posting = $event.data.link;
    }
  }

  onAdCanceled($event) {
    this.postingCancelled.emit({
      success: true,
    });
  }

  viewAd() {
    this.navCtrl.push(DetailPage, this.posting);
  }

  editAd() {
    // make the ad editable
    this.adPosted = false;

  }

  get flat() {
    return this.platform.isLandscape();
  }

}
