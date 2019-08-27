import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IdcheckPage } from './idcheck';

@NgModule({
  declarations: [
    IdcheckPage,
  ],
  imports: [
    IonicPageModule.forChild(IdcheckPage),
  ],
})
export class IdcheckPageModule {}
