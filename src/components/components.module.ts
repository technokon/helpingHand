import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistrationComponent } from './registration/registration';
import { PostingComponent } from './posting/posting';
import { GuideCardComponent } from './guide-card/guide-card';
import { PostingFormComponent } from './posting-form/posting-form';
import { ConfirmationCardComponent } from './confirmation-card/confirmation-card';
import { MapCardComponent } from './map-card/map-card';
import { SearchComponent } from './search/search';
import { MenuComponent } from './menu/menu';
import { ContactCardComponent } from './contact-card/contact-card';
import {PipesModule} from '../pipes/pipes.module';

@NgModule({
	declarations: [
    RegistrationComponent,
    PostingComponent,
    GuideCardComponent,
    PostingFormComponent,
    ConfirmationCardComponent,
    MapCardComponent,
    SearchComponent,
    MenuComponent,
    ContactCardComponent,
  ],
	imports: [
    IonicPageModule.forChild(RegistrationComponent),
    PipesModule,
  ],
	exports: [
    RegistrationComponent,
    PostingComponent,
    GuideCardComponent,
    PostingFormComponent,
    ConfirmationCardComponent,
    MapCardComponent,
    SearchComponent,
    MenuComponent,
    ContactCardComponent,
  ]
})
export class ComponentsModule {}
