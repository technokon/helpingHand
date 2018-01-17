import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import 'firebase/storage';
import * as _ from 'lodash';
import * as firebase from 'firebase';

/*
  Generated class for the UploadServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UploadServiceProvider {

  private basePath = '/uploads';

  private fileSelectorSubject = new Subject<any>();

  constructor(
    private angularFireStore: AngularFirestore,
    public http: HttpClient) {
    this.init();
  }

  init() {

  }

  pushUpload(upload) {
    let storageRef = this.angularFireStore.app.storage().ref();
    let uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);


    let handle = uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED);
    console.log(`Handle: what are you? ${handle}`);
    handle(
      (snapshot) => {
        upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      },
      (error) => {

      },
      ()=> {
        // upload success, finished
        upload.url = uploadTask.snapshot.downloadURL
        upload.name = upload.file.name
      }
    );
  }

  simpleUpload(images, docId) {
    let storageRef = this.angularFireStore.app.storage().ref();

    let uploads = [];

    let filesIndex = _.range(images.length);

    _.each(filesIndex, idx => {
      let image = images[idx];
      let uploadTask = storageRef.child(`${this.basePath}/${docId}/${image.name}`).put(image)
        .then(snapshot => {
          return {
            name: image.name,
            url: snapshot.downloadURL
          }
        });
      uploads.push(uploadTask);
    })

    return Promise.all(uploads);
  }

  getFileSelectorSubject() {
    return this.fileSelectorSubject;
  }
}
