import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';

import {Connect} from "../../app/connect";
import {Base} from "../../common/base";
//import { Contacts, Contact, ContactField, ContactName,IContactFindOptions ,ContactFieldType} from '@ionic-native/contacts';
import {LocalStorage} from "../../app/localstorage";

import { InAppBrowser } from '@ionic-native/in-app-browser';

//import { Device } from '@ionic-native/device';

import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser';

import { OrderlistPage } from '../orderlist/orderlist';
declare var BMap:any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage extends Base{

  //为苹果上架做准备
  public appleStore:boolean = false;
  public money:number = 7000;
  public max:number = 200000;
  public loanList = [];
  public creditList = [];
  public credit1 = {};
  public credit2 = {};
  public loan1 = {};
  public loan2 = {};
  public isLogin:boolean = false;
  public isLoan:boolean = false;
  public city:string = '';
  public idexCredit = {};
  public deviceObj = {
      platform:'',
      version:''
  };
  public mytitle:string = '我要融资';
  constructor
  (
      public navCtrl: NavController,
      public C:Connect,
      public toastController:ToastController,
     // private contacts: Contacts,
      public LS:LocalStorage,
     // public plt:Platform,
      private iab:InAppBrowser
    //  private themeableBrowser:ThemeableBrowser,
    //  private device: Device
  )
  {
      super();

      if(!this.LS.getItem('isLogin') || this.LS.getItem('isLogin') == null)
      {
          this.isLogin = false;

      }else {
        this.isLogin = true;
      }
  }
  ionViewWillEnter(){
    if(!this.LS.getItem('isLogin') || this.LS.getItem('isLogin') == null)
    {
      this.isLogin = false;
      this.isLoan = false;

    }else {
      this.isLogin = true;
      this.getUserInfo();
    }
  }
  ionViewDidLoad()
  {
      this.getLoan();
      this.getcredit();
      this.getIdx_fix_custom_credit();
      //this._getPos();
      //this.getPos();
      // @ts-ignore
    //  this.deviceObj.platform = '融资标的物：'+this.device.platform;
      // @ts-ignore
    //  this.deviceObj.version  = this.device.version;
      //this.getAllContacts();
  }

  public openWebView(url:string):void
  {
      var options = "location=yes,closebuttoncaption=关闭,hidenavigationbuttons=true,toolbar=true,closebuttoncolor=#ffffff,toolbarposition=bottom,toolbarcolor=#fb8300";
      const browser = this.iab.create(url,'_blank',options);
  }
  public openWebView2(url:string):void
  {
/*
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
      closeButton: {
        image: 'close',
        imagePressed: 'close_pressed',
        align: 'left',
        event: 'closePressed'
      },
      customButtons: [
        {
          image: 'share',
          imagePressed: 'share_pressed',
          align: 'right',
          event: 'sharePressed'
        }
      ],
      backButtonCanClose: true
    };
    const browser: ThemeableBrowserObject = this.themeableBrowser.create(url, '_blank', options);
    //this.themeableBrowser.on('')
 */
  }
  public getUserInfo()
  {
    this.C.postApi('home/indexA/getconf',{
      'method':'get_userinfo',
      'token':this.LS.getItem('TOKEN')
    },false).subscribe(
      data=>{
        console.log(data);
        //token失效
        if(data.result_code == '10002')
        {
          //this.navCtrl.push('LoginPage');
        }
        else if(data.result_code == 'SUCCESS')
        {
            if(parseInt(data.credit) >0)
            {
                this.mytitle = '我要融资';
            }
            if(data.credit == '0' && parseInt(data.orders) >0 )
            {
                this.mytitle = '我要赎回';
            }
            else if(data.credit == '0' && parseInt(data.orders) == 0)
            {
                this.mytitle = '我要融资';
            }
            if(data.loan_page == 1)
            {
                this.isLoan = true;
            }
            else{
                this.isLoan = false;
            }
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
  public getPos():void
  {
  /*    let _this2 = this;
      this.plt.ready().then((readysource)=>{

          this.geo.getCurrentPosition().then((resp) => {
           //   var gpsPoint = new BMap.Point(resp.coords.longitude,resp.coords.latitude);
              var gpsPoint = new BMap.Point(resp.coords.longitude,resp.coords.latitude);
             // alert(resp.coords.longitude+'|'+resp.coords.latitude);
              //120.024027385828451    32.166118163422325
              var getCityByBaiduCoordinate = function(rs)
              {
                  _this2.city = rs.addressComponents.city.replace('市','');

              }
              var translateCallback = function(point){
                //  alert(1);
                  var baiduPoint = point;
                  var geoc = new BMap.Geocoder();
                  geoc.getLocation(baiduPoint, getCityByBaiduCoordinate);
              };

              BMap.Convertor.translate(gpsPoint, 0, translateCallback);

          }).catch((error) => {
              // console.log('Error getting location', error);
          });
         // this.getAllContacts();
      });
      */
  }
  public checkLogin():boolean
  {
      if(!this.LS.getItem('isLogin') || this.LS.getItem('isLogin') == null)
      {
          this.isLogin = false;
          this.navCtrl.push('LoginPage');
          return false;

      }
      else
      {
          if(this.LS.getItem('is_approved') != '1')
          {

              this.navCtrl.push('IdcheckPage',{
                  'id_approved':this.LS.getItem('id_approved')
              });
              return false;
          }
          this.isLogin = true;
      }
      return true;
  }
  //获取所有通讯录用户
  public getAllContacts():void
  {
   /*   this.contacts.find(['displayName', 'phoneNumbers'], {filter: "", multiple: true})
          .then(data => {
              alert("len= "+data.length);
              //this.data = data;
              alert(JSON.stringify(data));
          },(err)=>{alert(JSON.stringify(err))});
          */
  }
  //获取融资
  public getLoan()
  {
      this.C.postApi('home/indexA/getconf',{
          'method':'idx_hot_recommand',
          'type':'loan'
      }).subscribe(
          data=>{
              if(data.result_code == 'SUCCESS')
              {
                  this.loan1 = data.list[0];
                  this.loan2 = data.list[1];
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

    //获取信信用卡
  public getcredit()
  {
      this.C.postApi('home/indexA/getconf',{
          'method':'idx_hot_recommand',
          'type':'credit'
      }).subscribe(
          data=>{
              if(data.result_code == 'SUCCESS')
              {
                  this.credit1 = data.list[0];
                  this.credit2 = data.list[1];
                  this.creditList = data.list;
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
  public getIdx_fix_custom_credit()
  {
      this.C.postApi('home/indexA/getconf',{
          'method':'idx_fix_custom_credit'
      }).subscribe(
          data=>{
              if(data.result_code == 'SUCCESS')
              {
                  this.idexCredit = data;
                  console.log(data);
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

  private _check():boolean
  {
      return true;
  }

  public createLoan():void
  {
      if(this.checkLogin() == true)
      {
          //
          if(this.mytitle == '我要融资')
          {
              this.navCtrl.push('BiaodiwuPage');
          }
          else if(this.mytitle == '我要赎回')
          {
              this.navCtrl.push(OrderlistPage,{
                'hiddenBackBtn':false
              });
          }
      }
  }
  public gotoIframe(item)
  {
      if(item.spread_url !='')
      {
        this.openWebView(item.spread_url);
      }

  }
    public gotoIframe2(item)
    {
        if(item.spread_url !='')
        {
            this.openWebView(item.spread_url);
        }
    }
  public gotoLoan(item)
  {

      this.navCtrl.push('LoanlistPage');
  }
  public gotoLogin()
  {
      this.navCtrl.push('LoginPage');
  }
  public gotoCards()
  {
      this.navCtrl.push('CardsPage');
  }
  public gotoIdex(item)
  {
      if(item.spread_url !='')
      {
        this.openWebView(item.spread_url);
      }

  }
  public gotoSearchletter()
  {
      if(!this.LS.getItem('isLogin') || this.LS.getItem('isLogin') == null)
      {
          this.isLogin = false;
          this.navCtrl.push('LoginPage');
          return false;

      }
      else
      {
          this.navCtrl.push('SearchletterPage');
      }

  }
  public gotoContacts()
  {
     // this.navCtrl.push('ContactsPage');
  }

}
