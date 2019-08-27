import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import {Base} from "../../common/base";
import {Connect} from "../../app/connect";
import {LocalStorage} from "../../app/localstorage";

/**
 * Generated class for the AboutusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-aboutus',
  templateUrl: 'aboutus.html',
})
export class AboutusPage extends Base{
    about:string = '关于我们';

    constructor
    (
        public navCtrl: NavController,
        public navParams: NavParams,
        public C:Connect,
        public toastController:ToastController,
        public LS:LocalStorage
    )
    {
        super();
    }

    ionViewDidLoad() {
      //console.log('ionViewDidLoad AboutusPage');
        this.getAboutUs();
    }
    public goBack():void{
        this.navCtrl.pop();
    }
    public getAboutUs():void
    {
        this.C.postApi('home/indexA/getconf',{
          'method':'get_about_me'
        }).subscribe(
          data=>{
              if(data.result_code =='SUCCESS'){
                 this.about = data.about;
              }
          },
          (error) =>  {
              this.C.endLoading();
              this.errorLog(this.toastController,error.error.message);
          }
        );
    }
}
