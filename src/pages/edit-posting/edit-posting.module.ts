import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditPostingPage } from './edit-posting';

@NgModule({
  declarations: [
    EditPostingPage,
  ],
  imports: [
    IonicPageModule.forChild(EditPostingPage),
  ],
})
export class EditPostingPageModule {}
