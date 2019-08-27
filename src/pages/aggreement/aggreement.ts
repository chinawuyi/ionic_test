import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AggreementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-aggreement',
  templateUrl: 'aggreement.html',
})
export class AggreementPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }


  public goBack()
  {
    this.navCtrl.pop();
  }

}
