import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ToastController} from 'ionic-angular';
import {Base} from "../../common/base";

/**
 * Generated class for the Password1Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-password1',
  templateUrl: 'password1.html',
})
export class Password1Page extends Base
{
    public password:string = ''
    constructor
    (
        public navCtrl: NavController,
        public navParams: NavParams,
        public toastController:ToastController
    )
    {
        super();
    }

    ionViewDidLoad() {
     // console.log('ionViewDidLoad Password1Page');
    }

    public goBack():void{
        this.navCtrl.pop();
    }
    public gotoNext()
    {
        if(this.password == '')
        {
            this.errorLog(this.toastController,'密码不可为空');
        }
        else
        {
            this.navCtrl.push('Password2Page',{
                'password':this.password
            })
        }

    }

}
