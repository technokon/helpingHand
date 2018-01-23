import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {MapServiceProvider} from '../../providers/map-service/map-service';

declare var google;

@Component({
  selector: 'h-map-card',
  templateUrl: 'map-card.html'
})
export class MapCardComponent {

  @Input()
  zipCode;

  address:any = {};

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public mapService: MapServiceProvider) {
  }

  ngOnInit(){
    this.loadMap();
  }

  init() {

    this.loadMap();
  }

  loadMap() {
    let subscribtion = this.mapService.getMapForZipCode(this.zipCode).subscribe((results) => {
      console.log(results);
      this.address = results[0];
      let latLng = this.address.geometry.location;

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
      });

      subscribtion.unsubscribe();
    });
  }

}
