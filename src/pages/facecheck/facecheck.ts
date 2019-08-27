import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ToastController} from 'ionic-angular';
import {Base} from "../../common/base";
import {Connect} from "../../app/connect";
import {LocalStorage} from "../../app/localstorage";

import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the FacecheckPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-facecheck',
  templateUrl: 'facecheck.html',
})
export class FacecheckPage extends Base{
  public nextText :string = '开始识别';
  public id_approved:string = '';
  //姓名
  public name:string = '';
  //身份证
  public idcard:string = '';
  //本次面部识别的ID号
  public biz_no:string = '';
  public url:string = '';
  public interval:any;
  public loopindex:number = 0;
  constructor
  (
    public navCtrl: NavController,
    public navParams: NavParams,
    public C:Connect,
    public toastController:ToastController,
    public LS:LocalStorage,
    public iab:InAppBrowser
  )
  {
    super();
    this.id_approved = this.navParams.get('id_approved');
    this.name = this.LS.getItem('name');
    this.idcard = this.LS.getItem('idcard');
    if(this.id_approved == '1')
    {
      this.nextText = '已完成，下一步';
    }
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad FacecheckPage');
  }
  public gotoFace():void
  {
    if(this.id_approved == '1')
    {
      this.errorLog(this.toastController,'面部识别已完成，请直接进入下一步');
      this.gotoNext();
    }
    else
    {
      this.C.postApi('home/indexA/getconf',{
        'method':'face_chk',
        'token':this.LS.getItem('TOKEN'),
        'name':this.name,
        'idcard':this.idcard
      }).subscribe(
        data=>{
          if(data.result_code == 'SUCCESS')
          {
            this.biz_no = data.biz_no;
            this.url = data.url;
            this.iab.create(this.url,'_system');
            this.loopCheck();
          }
          else{
            this.errorLog(this.toastController,data.result_msg);
          }
          //console.log(data);

        },
        (error) =>  {
          this.C.endLoading();
          this.errorLog(this.toastController,error.error.message);
        }
      );
    }

  }
  public loopCheck()
  {

    setTimeout(()=>{

      this.C.startLoading();
      this.interval = setInterval(()=>{
        this.getFaceResult();
      },1000);
    },1000);
  }
  public getFaceResult()
  {
    this.C.postApi('home/indexA/getconf',{
      'method':'face_chk_query',
      'token':this.LS.getItem('TOKEN'),
      'biz_no':this.biz_no
    },false).subscribe(
      data=>{
        this.loopindex ++;
        if(this.loopindex >= 11)
        {
            clearInterval(this.interval);
            this.C.endLoading();
        }
        //token失效
        if(data.result_code =='FAIL')
        {

        }
        else if(data.result_code == 'SUCCESS'){
          //this.credit = data.credit;
          clearInterval(this.interval);
          this.C.endLoading();
          this.LS.setItem('credit',data.credit);
          this.errorLog(this.toastController,'识别成功');
          this.gotoNext();
        }
      },
      (error) =>  {
        this.C.endLoading();
        //  this.errorLog(this.toastController,error.error.message);
      }
    );
  }
  public gotoNext():void
  {

    clearInterval(this.interval);
    if(this.id_approved == '1')
    {
      this.navCtrl.push('MylimitPage',{
        'biz_no':this.biz_no,
        'id_approved':this.id_approved
      });
    }
    else{
      if(this.biz_no == '')
      {
        this.errorLog(this.toastController,'请先进行面部识别');
      }
      else{
        this.navCtrl.push('MylimitPage',{
          'biz_no':this.biz_no,
          'id_approved':this.id_approved
        });
      }
    }


  }

  public goBack():void{
    this.navCtrl.pop();
  }

}
