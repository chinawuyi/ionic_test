import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchletterPage } from './searchletter';

@NgModule({
  declarations: [
    SearchletterPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchletterPage),
  ],
})
export class SearchletterPageModule {}
