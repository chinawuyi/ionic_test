import { Component ,ViewChild} from '@angular/core';

import { IonicPage, NavController, NavParams,ToastController ,Tabs} from 'ionic-angular';
import { HomePage } from '../home/home';
import { MyPage } from '../my/my';
import { OrderlistPage } from '../orderlist/orderlist';
import {LocalStorage} from "../../app/localstorage";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
    @ViewChild('myTabs') tabRef: Tabs;
      public tab1Root:any = HomePage;
      public tab2Root:any = OrderlistPage;
      public tab3Root:any = MyPage;

      constructor
      (
          public LS:LocalStorage,
          public navCtrl: NavController
      )
      {

      }

      public gotoOrderList()
      {
          let isLogin = this.LS.getItem('isLogin');
          if(!isLogin || isLogin == null)
          {
              this.navCtrl.push('LoginPage');

          }
          else{
              this.tabRef.select(2);
          }
      }
}
