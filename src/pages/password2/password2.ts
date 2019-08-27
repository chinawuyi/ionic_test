import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ToastController} from 'ionic-angular';
import {Base} from "../../common/base";
import {Connect} from "../../app/connect";
import {LocalStorage} from "../../app/localstorage";

/**
 * Generated class for the Password2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-password2',
  templateUrl: 'password2.html',
})
export class Password2Page extends Base
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
        this.password1 = this.navParams.get('password');
    }

    ionViewDidLoad() {
      //console.log('ionViewDidLoad Password2Page');
    }

    public goBack():void{
        this.navCtrl.pop();
    }

    public subPassword()
    {
        if(this.password1 != this.password2)
        {
            this.errorLog(this.toastController,'两次密码不一致');
        }
        else{
            this.C.postApi('home/indexA/getconf',{
                'method':'init_pwd',
                'password':this.password1,
                'token':this.LS.getItem('TOKEN'),
            }).subscribe(
                data=>{
                    this.errorLog(this.toastController,'设置成功');
                    this.navCtrl.popToRoot();
                },
                (error) =>  {
                    this.C.endLoading();
                    this.errorLog(this.toastController,error.error.message);
                }
            );
        }
    }

}
