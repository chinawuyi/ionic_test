import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MybanksPage } from './mybanks';

@NgModule({
  declarations: [
    MybanksPage,
  ],
  imports: [
    IonicPageModule.forChild(MybanksPage),
  ],
})
export class MybanksPageModule {}
