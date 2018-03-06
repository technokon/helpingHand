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
import { MapServiceProvider } from '../providers/map-service/map-service';
import {CategoryPickPage} from '../pages/category-pick/category-pick';
import {LoginPage} from '../pages/login/login';
import {AngularFireAuthModule} from 'angularfire2/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC5jdxgWDpTB5eXLqHh-cllKo4UjRvnXj0",
  authDomain: "helping-hand-1b53a.firebaseapp.com",
  databaseURL: "https://helping-hand-1b53a.firebaseio.com",
  projectId: "helping-hand-1b53a",
  storageBucket: "helping-hand-1b53a.appspot.com",
  messagingSenderId: "689673982246",
  googleMapsApiKey: "AIzaSyDKkJZ70jQKZdd1ZqdxDbwPovN7fmgheto",
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DetailPage,
    AdImagesPage,
    CategoryPickPage,
    LoginPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
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
    CategoryPickPage,
    LoginPage,
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
    MapServiceProvider,
  ]
})
export class AppModule {}
