import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FacecheckPage } from './facecheck';

@NgModule({
  declarations: [
    FacecheckPage,
  ],
  imports: [
    IonicPageModule.forChild(FacecheckPage),
  ],
})
export class FacecheckPageModule {}
