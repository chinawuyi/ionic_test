import { Component } from '@angular/core';
import { NavController, NavParams,Events,ActionSheetController,ToastController } from 'ionic-angular';
import {Base} from "../../common/base";
import {LocalStorage} from "../../app/localstorage";
import {Connect} from "../../app/connect";

/**
 * Generated class for the MyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-my',
  templateUrl: 'my.html',
})
export class MyPage extends Base
{
    //当前登录状态
      public isLogin:boolean = false;
      // is_approved 判断是否已经全部认证完  接口返回字符串1 表示全部完成
      public is_approved:string = '';
      // 判断身份证是否认证完成   id_approved == '1' 表示已经认证完成
      public id_approved:string = '';
      // 判断面部识别是否完成  emergency_approved == '1' 表示已经认证完成
      public emergency_approved:string = '';
      public name:string = '';
      public mobile:string = '';
      constructor
      (
          public navCtrl: NavController,
          public navParams: NavParams,
          public events:Events,
          public LS:LocalStorage,
          public actionSheetCtrl: ActionSheetController,
          public toastController:ToastController,
          public C:Connect
      )
      {
          super();
          this._checkLogin();
      }
      ionViewWillEnter()
      {
          this._checkLogin();
          //console.log(2323);
      }
      private _checkLogin()
      {
          if(!this.LS.getItem('isLogin') || this.LS.getItem('isLogin') == null)
          {
              this.isLogin = false;
          }
          else
          {
              this.isLogin = true;
              this.getUserInfo();
          }
      }
        //退出
      public  showQuit()
      {
          const actionSheet = this.actionSheetCtrl.create({
              title: '退出系统',
              buttons: [
                  {
                      text: '确认退出',
                      role: '确认',
                      handler: () => {
                          this.quit();
                          //console.log('Destructive clicked');
                      }
                  },{
                      text: '取消',
                      role: 'cancel',
                      handler: () => {
                          //console.log('Cancel clicked');
                      }
                  }
              ]
          });
          actionSheet.present();
      }



      public quit()
      {
          this.LS.clearAll();
          this._checkLogin();
      }







      public gotoKefu()
      {
          this.navCtrl.push('KefuPage');
      }
      public gotoAbout()
      {
          this.navCtrl.push('AboutusPage');
      }
      public gotoFindpass()
      {
          this.navCtrl.push('FindpassPage');
      }
      public gotoSearchletter()
      {
          this.navCtrl.push('SearchletterPage');
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
                      this.quit();
                      //this.navCtrl.push('LoginPage');
                  }
                  else if(data.result_code == 'SUCCESS')
                  {

                      this.is_approved = data.is_approved;
                      this.id_approved = data.id_approved;
                      this.emergency_approved = data.emergency_approved;

                      this.LS.setItem('name',data.name);
                      this.name = data.name;
                      this.mobile = data.phone?data.phone:'';
                      this.LS.setItem('idcard',data.idcard);
                      this.LS.setItem('id_approved',data.id_approved);
                      this.LS.setItem('emergency_approved',data.emergency_approved);
                      this.LS.setItem('is_approved',data.is_approved);
                      this.LS.setItem('credit',data.credit);
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
      public gotoLogin()
      {
          this.events.subscribe('login-events',(params)=>{
              this.getUserInfo();
              this.events.unsubscribe('login-events');

          });
          this.navCtrl.push('LoginPage');
      }
      public gotoIdCard()
      {
          if(this.isLogin == false)
          {
              this.errorLog(this.toastController,'请先登录');
              this.gotoLogin();
          }
          else
          {

              this.navCtrl.push('IdcheckPage',{
                  'id_approved':this.id_approved,
                  'emergency_approved':this.emergency_approved
              });
          }

      }
      public gotoMyBank():void
      {
          if(this.isLogin == false)
          {
              this.errorLog(this.toastController,'请先登录');
              this.gotoLogin();
          }
          else
          {
              if(this.LS.getItem('id_approved') != '1')
              {
                  this.errorLog(this.toastController,'请先完成您的实名认证');
                  this.navCtrl.push('IdcheckPage',{
                    'id_approved':this.id_approved,
                    'emergency_approved':this.emergency_approved
                  });
              }
              else{
                  this.navCtrl.push('MybanksPage');
              }

          }
      }
}
