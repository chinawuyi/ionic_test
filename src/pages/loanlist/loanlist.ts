import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import {Base} from "../../common/base";
import {Connect} from "../../app/connect";


import { InAppBrowser } from '@ionic-native/in-app-browser';


import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser';
@IonicPage()
@Component({
  selector: 'page-loanlist',
  templateUrl: 'loanlist.html',
})
export class LoanlistPage extends Base{
  public orderStatus:string[] = ['大额融资','小额融资'];
  private curIndex = 0;
  public loanList = [];
  constructor
  (
      public navCtrl: NavController,
      public navParams: NavParams,
      public toastController:ToastController,
      public C:Connect,
      private iab:InAppBrowser,
      private themeableBrowser:ThemeableBrowser
  )
  {
      super();
  }

  ionViewDidLoad()
  {
        this.getLoan('large');
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
    //获取融资
  public getLoan(type:string)
  {
        this.C.postApi('home/indexA/getconf',{
            'method':'loan_market',
            'type':type
        }).subscribe(
            data=>{

                if(data.result_code == 'SUCCESS')
                {
                    this.loanList = data.list;
                }else{
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
  public tabOrder(index:number):void
  {
        this.curIndex = index;
        //大额融资
        if(index == 0)
        {
            this.getLoan('large');
        }
        else if(index == 1)
        {
            this.getLoan('small');
        }

  }

}
