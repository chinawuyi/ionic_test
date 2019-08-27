import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import {Base} from "../../common/base";
import {Connect} from "../../app/connect";
import {LocalStorage} from "../../app/localstorage";

/**
 * Generated class for the MylimitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mylimit',
  templateUrl: 'mylimit.html',
})
export class MylimitPage extends Base{
  //最高可贷额度
    public credit:number = 0;
    //当前选中额度
    public money:number = 1000;
    public biz_no:string = '';
    public id_approved:string = '';
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
        this.biz_no = this.navParams.get('biz_no');
        this.id_approved = this.navParams.get('id_approved');
        if(this.biz_no !='')
        {
            this.getFaceResult();
        }

    }

    ionViewDidLoad()
    {
        this.getUserInfo();
    }
    public getFaceResult()
    {
        this.C.postApi('home/indexA/getconf',{
            'method':'face_chk_query',
            'token':this.LS.getItem('TOKEN'),
            'biz_no':this.biz_no
        }).subscribe(
            data=>{
                //token失效
                if(data.result_code =='FAIL')
                {
                    this.errorLog(this.toastController,data.result_msg);
                    this.navCtrl.pop();
                }
                else if(data.result_code =='SUCCESS'){
                    this.credit = data.credit;
                    this.money = data.credit;
                    this.LS.setItem('credit',data.credit);
                }
            },
            (error) =>  {
                this.C.endLoading();
                this.errorLog(this.toastController,error.error.message);
            }
        );
    }
    public getUserInfo()
    {
        this.C.postApi('home/indexA/getconf',{
            'method':'get_userinfo',
            'token':this.LS.getItem('TOKEN')
        }).subscribe(
            data=>{
                //token失效
                if(data.result_code == '10002')
                {
                    this.navCtrl.popToRoot();
                    //this.navCtrl.push('LoginPage');
                }
                else if(data.result_code =='SUCCESS')
                {
                    this.credit = parseInt(data.credit);//data.credit;
                    this.money = data.credit;
                    this.LS.setItem('name',data.name);
                    this.LS.setItem('idcard',data.idcard);
                    this.LS.setItem('id_approved',data.id_approved);
                    this.LS.setItem('emergency_approved',data.emergency_approved);
                    this.LS.setItem('is_approved',data.is_approved);
                    this.LS.setItem('credit',data.credit);
                }
            },
            (error) =>  {
                this.C.endLoading();
                this.errorLog(this.toastController,error.error.message);
            }
        );
    }
    public createLoan()
    {
        this.navCtrl.push('BiaodiwuPage');
     /*   this.navCtrl.push('CreateloanPage',{
            'credit':this.credit
        }); */
    }
    public goBack()
    {
        this.navCtrl.popToRoot();
    }
}
