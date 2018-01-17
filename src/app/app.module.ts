import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { ComponentsModule } from '../components/components.module';
import { HomePage } from '../pages/home/home';
import { PeopleProvider } from '../providers/people/people';
import { DetailPage } from '../pages/detail/detail';
import { SessionServiceProvider } from '../providers/session-service/session-service';
import { AdProvider } from '../providers/ad/ad';
import { FirebaseServiceProvider } from '../providers/firebase-service/firebase-service';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { SearchServiceProvider } from '../providers/search-service/search-service';
import { CategoryServiceProvider } from '../providers/category-service/category-service';
import { UploadServiceProvider } from '../providers/upload-service/upload-service';
import {AdImagesPage} from '../pages/ad-images/ad-images';

const firebaseConfig = {
  apiKey: "AIzaSyC5jdxgWDpTB5eXLqHh-cllKo4UjRvnXj0",
  authDomain: "helping-hand-1b53a.firebaseapp.com",
  databaseURL: "https://helping-hand-1b53a.firebaseio.com",
  projectId: "helping-hand-1b53a",
  storageBucket: "helping-hand-1b53a.appspot.com",
  messagingSenderId: "689673982246",
  googleMapsApiKey: "AIzaSyA1tnC3od78dBFlQep6A6BKAOk-JrDvNyc",
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DetailPage,
    AdImagesPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(firebaseConfig),
    IonicModule.forRoot(MyApp),
    ComponentsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DetailPage,
    AdImagesPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PeopleProvider,
    SessionServiceProvider,
    AdProvider,
    FirebaseServiceProvider,
    SearchServiceProvider,
    CategoryServiceProvider,
    UploadServiceProvider,
  ]
})
export class AppModule {}
