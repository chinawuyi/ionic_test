import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,ActionSheetController } from 'ionic-angular';
import {Base} from "../../common/base";
import {Connect} from "../../app/connect";
import {LocalStorage} from "../../app/localstorage";

/**
 * Generated class for the CreateloanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-createloan',
  templateUrl: 'createloan.html',
})
export class CreateloanPage extends Base
{
  //最高额度
    public credit:number = 0;
    public money:number = 1000;
    public BE_USE:string[] = [];
    public WEEK:string[] = [];
    public subObj = {
        'type':'',
        'time':''
    }
    constructor
    (
        public navCtrl: NavController,
        public navParams: NavParams,
        public C:Connect,
        public LS:LocalStorage,
        public toastController:ToastController,
        public actionSheetCtrl:ActionSheetController
    )
    {
        super();
        this.credit = this.navParams.get('credit');

        this.LS.removeItem('NEWORDER');
        if(!this.credit)
        {
            this.getUserInfo();
        }
        else{
            this.money  = this.credit;
        }
    }

    ionViewDidLoad()
    {
        this.getBase();
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
                    //this.quit();
                    //this.navCtrl.push('LoginPage');
                }
                else if(data.result_code == 'SUCCESS')
                {
                    this.credit =  parseInt(data.credit);
                    this.money  = this.credit;
                    if(this.credit ==0)
                    {
                        this.money = 0;
                    }
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

    public getBase()
    {
        this.C.postApi('home/indexA/getconf',{
            'method':'wanna_borrow',
            'token':this.LS.getItem('TOKEN')
        }).subscribe(
            data=>{
                //token失效
                if(data.result_code == 'SUCCESS')
                {
                    this.BE_USE = data.BE_USE;
                    this.WEEK = data.WEEK;
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

    public chooseType():void
    {
        let buttons:any[] = [];
        let _mythis = this;
        this.BE_USE.forEach((item)=>{
            var  id = item;
            buttons.push({
                'text':item,
                'id':item,
                handler:function()
                {
                    _mythis.subObj.type = this.text;
                }
            });
        });
        buttons.push({
            'text':'取消',
            role: 'cancel'
        });
        const actionSheet = this.actionSheetCtrl.create({
            title: '融资用途',
            buttons: buttons
        });
        actionSheet.present();
    }

    public chooseTime():void
    {
        let buttons:any[] = [];
        let _mythis = this;
        this.WEEK.forEach((item)=>{
            var  id = item;
            buttons.push({
                'text':item,
                'id':item,
                handler:function()
                {
                    _mythis.subObj.time = this.text;
                }
            });
        });
        buttons.push({
            'text':'取消',
            role: 'cancel'
        });
        const actionSheet = this.actionSheetCtrl.create({
            title: '融资周期',
            buttons: buttons
        });
        actionSheet.present();
    }
    //创建融资
    public createLoan():void
    {
        if(this.credit < 1000)
        {
            this.errorLog(this.toastController,'您的融资额度已经不够');
            return;
        }
        if(this.subObj.type == '')
        {
            this.errorLog(this.toastController,'请选择融资用途');
            return;
        }
        if(this.subObj.time == '')
        {
            this.errorLog(this.toastController,'请选择融资周期');
            return;
        }
        this.C.postApi('home/indexA/getconf',{
            'method':'borrow_confirm',
            'token':this.LS.getItem('TOKEN'),
            'borrow_money':this.money,
            'borrow_reason':this.subObj.type,
            'borrow_week':this.subObj.time
        }).subscribe(
            data=>{
                if(data.result_code == 'SUCCESS')
                {
                    this.LS.setItem('NEWORDER',JSON.stringify(data));
                    this.navCtrl.push('OrderdetailPage',{
                        'orderId':'',
                        'borrow_money':this.money,
                        'borrow_reason':this.subObj.type,
                        'borrow_week':this.subObj.time,
                        'bank_name':data.bank_name,
                        'bank_number':data.bank_number
                    });
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
    public goBack()
    {
        this.navCtrl.pop();
    }
}
