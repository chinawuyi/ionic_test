import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,AlertController } from 'ionic-angular';
import {Base} from "../../common/base";
import {Connect} from "../../app/connect";
import {LocalStorage} from "../../app/localstorage";

import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser';
/**
 * Generated class for the SearchletterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-searchletter',
  templateUrl: 'searchletter.html',
})
export class SearchletterPage extends Base{
      public nessary  = [];
      public unnessary = [];
      public creditList:any;
      public credit1 = {};
      public credit2 = {};
      public loan1 = {};
      public loan2 = {};
      public loan3 = {};
      public loan4 = {};
      public isLoan:boolean = false;
      public is_view_pay:string = '';
      public bank_no:string = '';
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
      }

      ionViewDidLoad() {
          this.getLoan();
          this.getcredits();
          this.showAlert();
      }
      public showAlert()
      {
          const alert = this.alertCtrl.create({
            title: '注意',
            subTitle: '为了您最快速拿到融资款，请务必完成必要认证。完成可选认证是你提高额度的辅助！',
            buttons: ['确认']
          });
          alert.present();

      }
      ionViewWillEnter()
      {
        if(!this.LS.getItem('isLogin') || this.LS.getItem('isLogin') == null)
        {
          this.isLoan = false;

        }else {
          this.getUserInfo();
        }

        this.getCredit();
      }
      public getUserInfo()
      {
        this.C.postApi('home/indexA/getconf',{
          'method':'get_userinfo',
          'token':this.LS.getItem('TOKEN')
        },false).subscribe(
          data=>{
            //token失效
            if(data.result_code == '10002')
            {
              //this.navCtrl.push('LoginPage');
            }
            else if(data.result_code == 'SUCCESS')
            {
                if(data.loan_page == 1)
                {
                  this.isLoan = true;
                }
                else{
                  this.isLoan = false;
                }
                this.is_view_pay = data.is_view_pay;
                this.bank_no = data.default_bankcard;
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
      public getCredit()
      {
          this.C.postApi('home/indexA/getconf',{
              'method':'get_certified',
              'token':this.LS.getItem('TOKEN')
          }).subscribe(
              data=>{
                  this.filterList(data.list);
              },
              (error) =>  {
                   this.C.endLoading();
                   this.errorLog(this.toastController,error.error.message);
              }
          );
      }
      public checkMy()
      {
          if(this.is_view_pay == '0')
          {
              if(this.bank_no == '')
              {
                  this.errorLog(this.toastController,'请先绑定银行卡');
                  this._gotoBank();
              }
              else{
                  this.C.postApi('home/indexA/getconf',{
                    'method':'view_repayment_qry',
                    'banknum':this.bank_no,
                    'token':this.LS.getItem('TOKEN')
                  }).subscribe(
                    data=>{
                        if(data.result_code =='SUCCESS')
                        {
                            this.prompt(data);
                        }
                    },
                    (error) =>  {
                      this.C.endLoading();
                      this.errorLog(this.toastController,error.error.message);
                    }
                  );
              }
          }
          else{
             this.searchList();
          }
      }
      //跳转到 信证列表页面
      public searchList()
      {
          this.navCtrl.push('SearchListPage');
      }
      public prompt(data)
      {
        /*TrxAmt: 1500
            TrxId: "20181222164053a5ee3e49229"
        *
        * */
        const prompt = this.alertCtrl.create({
          title: '信证',
          message: "查询金额："+data.TrxAmt,
          inputs: [
            {
              name: 'msgcode',
              placeholder: '短信'
            },
          ],
          buttons: [
            {
              text: '取消',
              handler: data2 => {
                console.log('Cancel clicked');
              }
            },
            {
              text: '确认',
              handler: data3 => {
                if(data3.msgcode == '')
                {
                  this.errorLog(this.toastController,'请输入收到的短信码');
                }
                else{
                  this.C.postApi('home/indexA/getconf',{
                    'method':'repayment_confirm',
                    'token':this.LS.getItem('TOKEN'),
                    'smsCode':data3.msgcode,
                    'TrxId':data.TrxId
                  }).subscribe(
                    data4=>{
                      if(data4.result_code == 'SUCCESS')
                      {
                          this.errorLog(this.toastController,'支付成功');
                         // this.showPrompt();
                          this.searchList();
                      }
                      else{
                        this.errorLog(this.toastController,data4.result_msg);
                      }

                    },
                    (error) =>  {
                      this.C.endLoading();
                      this.errorLog(this.toastController,error.error.message);
                    }
                  );
                }
              }
            }
          ]
        });
        prompt.present();

      }
      public filterList(list):void
      {
          let nindex = 0;
          let unindex = 0 ;
          this.nessary = [];
          this.unnessary = [];
          for(var i in list)
          {
              let obj = {};

              obj[i] = list[i];
              if(obj[i].is_neccesary == '1')
              {
                  let _i = nindex%6;
                  let _index = Math.floor(nindex/6);
                  if(nindex%6 == 0)
                  {
                      let item = {
                          'name':'t',
                          'data':[]
                      };
                      item.data.push(obj[i]);
                      this.nessary.push(item);
                  }
                  else{
                      this.nessary[_index]['data'].push(obj[i]);
                  }
                  nindex++;

              }
              else{
                  let _i2 = unindex%6;
                  let _index2 = Math.floor(unindex/6);
                  if(unindex%6 == 0)
                  {
                      let item = {
                          'data':[]
                      };
                      item.data.push(obj[i]);
                      this.unnessary.push(item);
                  }
                  else{
                      this.unnessary[_index2].data.push(obj[i]);
                  }
                  unindex++;
              }
          }
          console.log(this.nessary);
      }

      public gotoLoan(item):void
      {
          switch (item.risk_code)
          {
              case 'face_chk_risk':this._gotoFace();
                  break;
              case 'idcard_risk':this._gotoId();
                  break;
              case 'bank_bind_risk':this._gotoBank();
                    break;
              case 'normal_mobile_risk':this._gotoContact('normal');
                    break;
              case 'senior_mobile_risk':this._gotoContact('seniro');
                    break;
              case 'alipay_risk':this._gotoContact2('alipay');
                    break;
              case 'credit_risk':this._gotoContact2('credit');
                    break;
              case 'taobao_risk':this._gotoContact2('taobao');
                    break;
              case 'jd_risk':this._gotoContact2('jd');
                    break;
              case 'creditemail_risk':this._gotoContact2('creditemail');
                    break;
              default:this._others(item);
                  break;
          }
      }
      public _gotoBank():void
      {
          this.navCtrl.push('MybanksPage',{
              'from':'searchletter'
          });
      }
      private _others(item):void
      {
          this.C.postApi('home/indexA/getconf',{
            'method':'normal_verify',
            'token':this.LS.getItem('TOKEN'),
            'type':item.risk_code.split('_')[0]
          }).subscribe(
            data=>{
                if(data.result_code =='SUCCESS')
                {
                    if(data.redirectUrl !='')
                    {
                        this.openWebView(data.redirectUrl);
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
      private _notOpen(item):void
      {
          if(item.spread_url && item.spread_url !='')
          {

          }
          else
          {
              this.errorLog(this.toastController,'暂未开通');
          }

      }
      private _gotoContact(type:string):void
      {
          if(this.LS.getItem('id_approved') != '1')
          {
            this.errorLog(this.toastController,'请先识别您的身份证');

            this.navCtrl.push('IdcheckPage',{
              'id_approved':this.LS.getItem('id_approved')
            });
          }
          else{
            this.navCtrl.push('ContactsPage',{
              'type':type
            });
          }

      }
      private _gotoContact2(type:string):void
      {
          if(this.LS.getItem('id_approved') != '1')
          {
            this.errorLog(this.toastController,'请先识别您的身份证');

            this.navCtrl.push('IdcheckPage',{
              'id_approved':this.LS.getItem('id_approved')
            });
          }
          else{
            this.C.postApi('home/indexA/getconf',{
              'method':'normal_chk',
              'token':this.LS.getItem('TOKEN'),
              'type':type
            }).subscribe(
              data=>{
                //token失效
                if(data.result_code =='SUCCESS')
                {
                  this.openWebView(data.redirectUrl);
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

      }
      private _gotoId():void
      {
          this.navCtrl.push('IdcheckPage',{
              'id_approved':this.LS.getItem('id_approved'),
              'emergency_approved':this.LS.getItem('emergency_approved')
          });
      }
      private _gotoFace():void
      {
          //身份证未识别
          if(this.LS.getItem('id_approved') != '1')
          {
              this.errorLog(this.toastController,'请先识别您的身份证');

              this.navCtrl.push('IdcheckPage',{
                  'id_approved':this.LS.getItem('id_approved')
              });
          }
          else{
              this.navCtrl.push('FacecheckPage',{
                  'id_approved':this.LS.getItem('id_approved')
              });
          }
      }


        //获取融资
        public getLoan()
        {
            this.C.postApi('home/indexA/getconf',{
                'method':'idx_hot_recommand',
                'type':'loan'
            }).subscribe(
                data=>{
                    this.loan1 = data.list[0];
                    this.loan2 = data.list[1];
                    this.loan3 = data.list[2];
                    this.loan4 = data.list[3];
                },
                (error) =>  {
                    this.C.endLoading();
                    this.errorLog(this.toastController,error.error.message);
                }
            );
        }

        //获取信信用卡
        public getcredits()
        {
            this.C.postApi('home/indexA/getconf',{
                'method':'idx_hot_recommand',
                'type':'credit'
            }).subscribe(
                data=>{
                    this.credit1 = data.list[0];
                    this.credit2 = data.list[1];
                    this.creditList = data.list;
                },
                (error) =>  {
                    this.C.endLoading();
                    this.errorLog(this.toastController,error.error.message);
                }
            );
        }

      public goBack()
      {
          this.navCtrl.pop();
      }
}
