import { Component } from '@angular/core';

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


  public contact: any = {};
  constructor() {
  }

  actionMessage() {
    console.log(this.contact);
  }

}
