import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';





@Component({
  selector: 'page-problemdetails',
  templateUrl: 'problemdetails.html',
})
export class ProblemdetailsPage {
  problem = {};
  constructor(
      public navCtrl: NavController,
      public navParams: NavParams
  )
  {
    this.problem = this.navParams.data;
  }


}
