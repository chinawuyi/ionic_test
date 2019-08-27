import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaydetailPage } from './paydetail';

@NgModule({
  declarations: [
    PaydetailPage,
  ],
  imports: [
    IonicPageModule.forChild(PaydetailPage),
  ],
})
export class PaydetailPageModule {}
