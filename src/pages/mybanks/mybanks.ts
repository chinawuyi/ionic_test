import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Events } from 'ionic-angular';
import {Base} from "../../common/base";
import {Connect} from "../../app/connect";
import {LocalStorage} from "../../app/localstorage";

/**
 * Generated class for the MybanksPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mybanks',
  templateUrl: 'mybanks.html',
})
export class MybanksPage extends Base{
    public test = [];
    public list = [];
    public from:string = '';
    constructor
    (
        public navCtrl: NavController,
        public navParams: NavParams,
        public C:Connect,
        public LS:LocalStorage,
        public events:Events,
        public toastController:ToastController
    )
    {
        super();
        this.from = this.navParams.get('from');
    }

    ionViewDidLoad()
    {
     // console.log('ionViewDidLoad MybanksPage');
    }
    ionViewWillEnter()
    {
        this.getBanks();
        //console.log(2323);
    }
    public getBanks():void
    {
        this.C.postApi('home/indexA/getconf',{
            'method':'get_bankcard',
            'token':this.LS.getItem('TOKEN')
        }).subscribe(
            data=>{
                if(data.result_code =='SUCCESS')
                {
                    this.list = data.list;
                    this._filterChecked(this.list);
                    console.log(this.test);
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
    private _filterChecked(list):void
    {
        let test = [];
        list.forEach((item)=>{
            if(item.is_default == '0')
            {
                test.push({
                    'no':item.bank_number,
                    'radio':false
                });
            }
            else
            {
                test.push({
                    'no':item.bank_number,
                    'radio':true
                });
            }
        });
        this.test = test;
    }
    public deleteItem(item):void
    {
        this.C.postApi('home/indexA/getconf',{
            'method':'set_bankcard',
            'token':this.LS.getItem('TOKEN'),
            'act':'del',
            'bank_number':item.bank_number,
            'bank_name':item.bank_name,
            'pre_phone':item.pre_phone
        }).subscribe(
            data=>{
                if(data.result_code == 'FAIL')
                {
                    this.errorLog(this.toastController,data.result_msg);
                }
                else if(data.result_code =='SUCCESS'){
                    this.errorLog(this.toastController,'删除成功');
                    this.getBanks();
                }

            },
            (error) =>  {
                this.C.endLoading();
                this.errorLog(this.toastController,error.error.message);
            }
        );
    }
    public gotoAddBank():void
    {
        this.navCtrl.push('AddbankPage');
    }
    public goBack():void
    {
        this.navCtrl.pop();
    }

    public updateToDo(event,titem):void
    {
        let no = titem.bank_number;
        this.test.map(function(item){
            if(item.no == no)
            {
                //item.radio = item.radio;
            }
            else{
                item.radio = false;
            }
        });
        //重新设置
        this.resetBank(titem);
    }
    public resetBank(item):void
    {
        let _mycheck:boolean;
        this.test.forEach((item)=>{
            if(item.radio == true)
            {
                _mycheck = true;
            }
        });
        if(_mycheck == true)
        {
            this.C.postApi('home/indexA/getconf',{
                'method':'set_bankcard',
                'token':this.LS.getItem('TOKEN'),
                'act':'default',
                'bank_number':item.bank_number,
                'bank_name':item.bank_name,
                'pre_phone':item.pre_phone
            }).subscribe(
                data=>{
                    if(data.result_code =='SUCCESS')
                    {
                        this.errorLog(this.toastController,'设置为默认银行卡');
                        if(this.from == 'orderdetail')
                        {
                            this.navCtrl.pop().then(()=>{
                                this.events.publish('bank-events',{
                                    'bank_number':item.bank_number,
                                    'bank_name':item.bank_name
                                });
                            });
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

    }

}
