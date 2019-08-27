import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import {Base} from "../../common/base";
import {Connect} from "../../app/connect";

import { InAppBrowser } from '@ionic-native/in-app-browser';


import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser';
/**
 * Generated class for the CardsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cards',
  templateUrl: 'cards.html',
})
export class CardsPage extends Base{
    public cardlist=[];
    constructor
    (
        public navCtrl: NavController,
        public navParams: NavParams,
        public C:Connect,
        public toastController:ToastController,
        private iab:InAppBrowser,
        private themeableBrowser:ThemeableBrowser
    )
    {
        super();
    }

    ionViewDidLoad() {
      //console.log('ionViewDidLoad CardsPage');
        this.getCard();
    }
    public openWebView(url:string):void
    {
      var options = "location=yes,closebuttoncaption=关闭,hidenavigationbuttons=true,toolbar=true,closebuttoncolor=#ffffff,toolbarposition=bottom,toolbarcolor=#fb8300";
      const browser = this.iab.create(url,'_blank',options);
    }
    public openWebView2(url:string):void
    {

      let options = {
        statusbar: {
          color: '#FB8300'
        },
        toolbar:
          {
            height: 44,
            color: '#FB8300'
          },
        title:
          {
            color: '#ffffffff',
            showPageTitle: true
          },
        backButton:
          {
            wwwImage: 'assets/imgs/nav_icon_back@3x.png',
            align: 'left',
            event: 'backPressed'
          },
        backButtonCanClose: true
      };
      const browser: ThemeableBrowserObject = this.themeableBrowser.create(url, '_blank', options);
    }
    public getCard():void
    {
        this.C.postApi('home/indexA/getconf',{
            'method':'credit_market',
            'type':''
        }).subscribe(
            data=>{

                if(data.result_code == 'SUCCESS')
                {
                    this.cardlist = data.list;
                }
                else{
                    this.errorLog(this.toastController,data.result_msg);
                }
            },
            (error) =>  {
                this.C.endLoading();
                this.errorLog(this.toastController,error.error.message);
            }
        );
    }

    public jumpItem(item):void
    {
        if(item.spread_url !='')
        {
          this.openWebView(item.spread_url);
        }
    }
    public goBack()
    {
        this.navCtrl.pop();
    }
}
