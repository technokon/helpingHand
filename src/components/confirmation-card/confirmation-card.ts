import {Component, Input} from '@angular/core';

/**
 * Generated class for the ConfirmationCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'h-confirmation-card',
  templateUrl: 'confirmation-card.html'
})
export class ConfirmationCardComponent {

  @Input() confirmationContent;

  constructor() {
  }

}
