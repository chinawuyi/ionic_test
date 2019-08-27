import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ToastController,AlertController} from 'ionic-angular';
import {Base} from "../../common/base";
import {Connect} from "../../app/connect";
import {LocalStorage} from "../../app/localstorage";

import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser';
/**
 * Generated class for the SearchListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-list',
  templateUrl: 'search-list.html',
})
export class SearchListPage extends Base
{
    public list = [];
    constructor
    (
        public navCtrl: NavController,
        public navParams: NavParams,
        public C:Connect,
        public toastController:ToastController,
        public LS:LocalStorage,
        private iab:InAppBrowser,
        private themeableBrowser:ThemeableBrowser,
        public alertCtrl: AlertController
    )
    {
        super();
        this.getMySearchList();
    }
    //获取我的信证列表
    public getMySearchList()
    {
        this.C.postApi('home/indexA/getconf',{
          'method':'get_report_list',
          'token':this.LS.getItem('TOKEN')
        }).subscribe(
          data=>{
              if(data.result_code =='SUCCESS')
              {
                  this.list = data.list;
              }
          },
          (error) =>  {
            this.C.endLoading();
            this.errorLog(this.toastController,error.error.message);
          }
        );
    }
    public openWebView(url:string):void
    {
        var options = "location=yes,closebuttoncaption=关闭,hidenavigationbuttons=true,toolbar=true,closebuttoncolor=#ffffff,toolbarposition=bottom,toolbarcolor=#fb8300";
        const browser = this.iab.create(url,'_blank',options);
    }
    public itemSelected(item)
    {
        this.openWebView(item.report_detail_url);
    }

    public goBack()
    {
        this.navCtrl.pop();
    }
}
