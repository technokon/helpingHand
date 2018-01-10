import {Component, Input} from '@angular/core';

/**
 * Generated class for the MapCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'h-map-card',
  templateUrl: 'map-card.html'
})
export class MapCardComponent {

  @Input()
  zipCode;

  constructor() {
  }

}
