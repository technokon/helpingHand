import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';

declare var google;
@Injectable()
export class MapServiceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello MapServiceProvider Provider');
  }

  getMapForZipCode(zip) {
    let geocoder = new google.maps.Geocoder();

    return Observable.create(observer => {
      geocoder.geocode({ 'address': `${zip}, Canada`}, (results, status) => {
            if (status === 'OK') {
              observer.next(results);
            } else {
              console.log(`error occured ${results}`);
              observer.error(results);
            }
          });
    })

    // let p = new Promise((resolve, reject) => {
    //   geocoder.geocode({ 'address': `${zip}, Canada`}, (results, status) => {
    //     if (status === 'OK') {
    //       resolve(results);
    //     } else {
    //       console.log(`error occured ${results}`);
    //       reject(results);
    //     }
    //   });
    // });
    //
    // return p;
  }

}
