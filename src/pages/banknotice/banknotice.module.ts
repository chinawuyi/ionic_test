import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BanknoticePage } from './banknotice';

@NgModule({
  declarations: [
    BanknoticePage,
  ],
  imports: [
    IonicPageModule.forChild(BanknoticePage),
  ],
})
export class BanknoticePageModule {}
