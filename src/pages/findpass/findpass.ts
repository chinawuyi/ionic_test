import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ToastController} from 'ionic-angular';
import {Base} from "../../common/base";
import {Connect} from "../../app/connect";
import {LocalStorage} from "../../app/localstorage";

/**
 * Generated class for the FindpassPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-findpass',
  templateUrl: 'findpass.html',
})
export class FindpassPage extends Base
{

    public password1:string = '';
    public password2:string = '';
    constructor
    (
        public navCtrl: NavController,
        public navParams: NavParams,
        public toastController:ToastController,
        public C:Connect,
        public LS:LocalStorage
    )
    {
        super();
    }

    ionViewDidLoad()
    {

    }
    public modifyPass():void
    {
        if(this.password1 == '')
        {
            this.errorLog(this.toastController,'密码不可为空');
            return;
        }
        if(this.password1 != this.password2 )
        {
            this.errorLog(this.toastController,'两次输入的密码不一致');
            return;
        }
        this.C.postApi('home/indexA/getconf',{
            'method':'resetpwd',
            'token':this.LS.getItem('TOKEN'),
            'pwd':this.password1
        }).subscribe(
            data=>{
                if(data.result_code == 'SUCCESS')
                {
                    this.errorLog(this.toastController,'修改成功');
                    this.navCtrl.pop();
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

    public goBack():void
    {
        this.navCtrl.pop();
    }
}
