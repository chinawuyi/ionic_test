import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the Service2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-service2',
  templateUrl: 'service2.html',
})
export class Service2Page {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  public goBack()
  {
    this.navCtrl.pop();
  }

}
