import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoanlistPage } from './loanlist';

@NgModule({
  declarations: [
    LoanlistPage,
  ],
  imports: [
    IonicPageModule.forChild(LoanlistPage),
  ],
})
export class LoanlistPageModule {}
