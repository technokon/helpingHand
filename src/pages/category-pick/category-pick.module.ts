import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoryPickPage } from './category-pick';

@NgModule({
  declarations: [
    CategoryPickPage,
  ],
  imports: [
    IonicPageModule.forChild(CategoryPickPage),
  ],
})
export class CategoryPickPageModule {}
