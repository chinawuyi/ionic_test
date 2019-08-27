import { Component ,Input,ViewChild,ElementRef} from '@angular/core';
import { IonicPage, NavController,AlertController, NavParams,ToastController,Events } from 'ionic-angular';
import {Base} from "../../common/base";
import {Connect} from "../../app/connect";

import { Md5 } from 'ts-md5/dist/md5';
import {LocalStorage} from "../../app/localstorage";
import { Device } from '@ionic-native/device';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage extends Base
{
  @Input()
  @ViewChild('jsUserName') jsUserName: ElementRef;
      public mobile:string = '';
      public seckey:string = 'f5b8b09fad6bf4e6d519a16b2f8b2053';
      //默认短信登录
      public msgLogin:boolean = true;
      public msgText:string = '获取短信';
      //短信输入框
      public msgCode:string = '';
      //密码输入框
      public password:string = '';
      public btnmsg:string  = '短信登录';
      public btnmsg2:string = '密码登录';
      //是否是新用户注册
      public isNew:boolean = false;
      public isLogin:boolean = false;
      constructor
      (
          public navCtrl: NavController,
          public navParams: NavParams,
          public toastController:ToastController,
          public C:Connect,
          public LS:LocalStorage,
          public events:Events,
          private device: Device,
          public alertCtrl: AlertController,
          private elementRef: ElementRef
      )
      {
          super();
          if(this.LS.getItem('isLogin') == 'TRUE')
          {
              this.isLogin = false;
          }
          else{
              this.isLogin = true;
          }
      }

      ionViewDidLoad()
      {
          //console.log(Md5.hashStr('1'));
         //this.login();
      }
      public changeLoginType()
      {
            if(this.btnmsg == '密码登录')
            {
                this.btnmsg = '短信登录';
                this.btnmsg2 = '密码登录';
                this.msgLogin = true;
            }
            else{
                this.btnmsg = '密码登录';
                this.btnmsg2 = '短信登录';
                this.msgLogin = false;
            }
      }
      public login()
      {

      }

      public gotoSub()
      {
          let type = 'sms';
          let pwd  = '';
          if(this.msgLogin == true)
          {
              type = 'sms';
              pwd = this.msgCode;
          }
          else{
              type = 'pwd';
              pwd = this.password;
          }
          if(this.checkMobile(this.mobile) == true)
          {
              this.C.postApi('home/indexA/getconf',{
                  'method':'login_auth',
                  'phone':this.mobile,
                  'password':pwd,
                  'type':type
              }).subscribe(
                  data=>{
                      if(data.result_code == 'SUCCESS')
                      {
                          this.LS.setItem('TOKEN',data.token);
                          this.LS.setItem('isLogin','TRUE');
                          this.LS.setItem('is_approved',data.is_approved);
                          this.LS.setItem('id_approved',data.id_approved);
                          this.LS.setItem('credit',data.credit);
                          this.upUserInfo();
                          if(this.isNew == true)
                          {
                                this.errorLog(this.toastController,'注册成功');
                                this.navCtrl.push('Password1Page');
                          }
                          else{
                              this.errorLog(this.toastController,'登录成功');
                              this.navCtrl.pop().then(()=>{
                                  this.events.publish('login-events');
                              });
                          }
                      }
                      else{
                          this.errorLog(this.toastController,data.result_msg);
                      }
                  },
                  (error) =>  {
                       this.C.endLoading();
                      // this.errorLog(this.toastController,error.error.message);
                  }
              );
          }
          else{
              this.errorLog(this.toastController,'请输入正确的手机号码');
          }

      }
      //上传用户信息
      public upUserInfo()
      {
          this.C.postApi('home/indexA/getconf',{
            'method':'set_phone_info',
            'token':this.LS.getItem('TOKEN'),
            'phone_info':this.device.platform+'|'+this.device.manufacturer+'|'+this.device.model+'|'+this.device.version,
            'clentid':this.device.uuid
          }).subscribe(
            data=>{


            },
            (error) =>  {
              this.C.endLoading();
              // this.errorLog(this.toastController,error.error.message);
            }
          );
      }
      public getMsg():void
      {
          if(this.checkMobile(this.mobile) == true)
          {
              this.C.postApi('home/indexA/getconf',{
                  'method':'get_sms_code',
                  'phone':this.mobile,
                  'sign':(Md5.hashStr(this.seckey+this.mobile)+'')
              }).subscribe(
                  data=>{
                      //新用户
                      if(data.result_code =='SUCCESS')
                      {
                          if(data.is_new == '0')
                          {
                              this.isNew = true;
                          }
                          else{
                              this.isNew = false;
                          }
                          this.errorLog(this.toastController,'发送成功')
                      }
                      else{
                          this.errorLog(this.toastController,data.result_msg)
                      }

                  },
                  (error) =>  {
                       this.C.endLoading();
                      // this.errorLog(this.toastController,error.error.message);
                  }
              );
          }
          else{
              this.errorLog(this.toastController,'请输入正确的手机号码');
          }
      }
      public showAlert():void
      {
        const alert = this.alertCtrl.create({
          title: '隐私政策!',
          subTitle: '感谢您下载51信证！我们非常重视您的隐私保护和个人信息保护，请认真阅读<span class="jsclick1">《用户隐私政策》</span>，<span class="jsclick2">《用户注册协议》</span>全部条款，同意并接受全部条款后再使用我们的服务',
          buttons: ['同意并继续']
        });
        alert.present();


      }
      public gotoService()
      {
         this.navCtrl.push('ServicePage');
      }
      public gotoService2()
      {
        this.navCtrl.push('Service2Page');
      }

      public setPassword1()
      {
          this.navCtrl.push('Password1Page');
      }

      public closeShadow()
      {
          this.isLogin = false;
      }

      public goBack()
      {
            //this.setPassword1();
            this.navCtrl.pop();
         // this.navCtrl.popToRoot();
      }


}
