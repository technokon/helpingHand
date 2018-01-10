import {Component, Input} from '@angular/core';

/**
 * Generated class for the GuideCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'h-guide-card',
  templateUrl: 'guide-card.html'
})
export class GuideCardComponent {

  @Input() guideContent;

  constructor() {
  }

}
