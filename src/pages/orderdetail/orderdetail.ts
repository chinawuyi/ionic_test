import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,AlertController ,Events} from 'ionic-angular';
import {Base} from "../../common/base";
import {LocalStorage} from "../../app/localstorage";
import {Connect} from "../../app/connect";

/**
 * Generated class for the OrderdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-orderdetail',
  templateUrl: 'orderdetail.html',
})
export class OrderdetailPage extends Base{
    public alertObj:any;
    public orderId:string = '';
    public borrow_money = '';
    public borrow_reason = '';
    public borrow_week = '';
    public orderDetail:any = {
      //借贷时间
       'apply_time':'',
        //金额
       'borrow_money':'',
       'borrow_reason':'',
        //待还利息
       'repayment_interest':'',
        //已还金额
        'payedmoney':'',
      //贷款租金，手续费
        'commission':'',
        //还款时间
        'repayment_time':'',
        'borrow_week':'',
        'bank_name':'',
        'bank_number':'',
      //还款明细
        'list':[]
    };
    public orderStatus:string = '';
    constructor
    (
        public navCtrl: NavController,
        public navParams: NavParams,
        public LS:LocalStorage,
        public C:Connect,
        public events:Events,
        public toastController:ToastController,
        public alertCtrl: AlertController
    )
    {
        super();
        this.orderId = this.navParams.get('orderId');
        this.borrow_money = this.navParams.get('borrow_money');
        this.borrow_reason = this.navParams.get('borrow_reason');
        this.borrow_week = this.navParams.get('borrow_week');
        this.orderDetail.bank_name = this.navParams.get('bank_name');
        this.orderDetail.bank_number = this.navParams.get('bank_number');
    }

    ionViewDidLoad()
    {
      //console.log('ionViewDidLoad OrderdetailPage');
         this.getDetail();
    }
    public getDetail()
    {
        //从缓存获取订单 预下单详情
         if(this.orderId == '' || !this.orderId )
         {
              this.orderStatus = '待确认';
              this.orderDetail = JSON.parse(this.LS.getItem('NEWORDER'));
         }
         //根据订单ID获取订单实际详情
         else{
             this.getOrderDetail();
         }
    }
    public getOrderDetail()
    {
        this.C.postApi('home/indexA/getconf',{
            'method':'borrowed_detail',
            'token':this.LS.getItem('TOKEN'),
            'id':this.orderId
        }).subscribe(
            data=>{
                if(data.result_code =='SUCCESS')
                {
                    this.orderDetail = data;
                    this.orderStatus = data.borrow_state;
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
    public backAll()
    {
        if(this.orderDetail.bank_number =='' || !this.orderDetail.bank_number )
        {
            this.errorLog(this.toastController,'请选择您的还款银行卡');
        }
        else{
            this.C.postApi('home/indexA/getconf',{
                'method':'repayment_qry',
                'token':this.LS.getItem('TOKEN'),
                'borrowid':this.orderId,
                'banknum':this.orderDetail.bank_number,
                'act':'repayment'
            }).subscribe(
                data=>{
                    if(data.result_code =='FAIL')
                    {
                        this.errorLog(this.toastController,data.result_msg);
                    }
                    else if(data.result_code == 'SUCCESS'){
                        this.prompt(data);
                    }

                },
                (error) =>  {
                    this.C.endLoading();
                    this.errorLog(this.toastController,error.error.message);
                }
            );
        }

    }

    public prompt(data)
    {
        /*TrxAmt: 1500
            TrxId: "20181222164053a5ee3e49229"
        *
        * */
        const prompt = this.alertCtrl.create({
            title: '全额还款',
            message: "还款总金额："+data.TrxAmt,
            inputs: [
                {
                    name: 'msgcode',
                    placeholder: '短信'
                },
            ],
            buttons: [
                {
                    text: '取消',
                    handler: data2 => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: '确认',
                    handler: data3 => {
                        if(data3.msgcode == '')
                        {
                            this.errorLog(this.toastController,'请输入收到的短信码');
                        }
                        else{
                            this.C.postApi('home/indexA/getconf',{
                                'method':'repayment_confirm',
                                'token':this.LS.getItem('TOKEN'),
                                'smsCode':data3.msgcode,
                                'TrxId':data.TrxId
                            }).subscribe(
                                data4=>{
                                    if(data4.result_code == 'SUCCESS')
                                    {
                                        this.errorLog(this.toastController,'还款成功，请等待审核');
                                        this.showPrompt();
                                    }
                                    else{
                                        this.errorLog(this.toastController,data4.result_msg);
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
            ]
        });
        prompt.present();

    }
    public promptDelay(data)
    {
        /*TrxAmt: 1500
            TrxId: "20181222164053a5ee3e49229"
        *
        * */
        const prompt = this.alertCtrl.create({
            title: '延期还款',
            message: "延期需支付："+data.TrxAmt,
            inputs: [
                {
                    name: 'msgcode',
                    placeholder: '短信'
                },
            ],
            buttons: [
                {
                    text: '取消',
                    handler: data2 => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: '确认',
                    handler: data3 => {
                        if(data3.msgcode == '')
                        {
                            this.errorLog(this.toastController,'请输入收到的短信码');
                        }
                        else{
                            this.C.postApi('home/indexA/getconf',{
                                'method':'repayment_confirm',
                                'token':this.LS.getItem('TOKEN'),
                                'smsCode':data3.msgcode,
                                'TrxId':data.TrxId
                            }).subscribe(
                                data4=>
                                {
                                    if(data4.result_code == 'SUCCESS')
                                    {
                                        this.errorLog(this.toastController,'延期成功，请等待审核');
                                        this.navCtrl.pop();
                                    }
                                    else{
                                        this.errorLog(this.toastController,data4.result_msg);
                                    }
                                },
                                (error) =>
                                {
                                    this.C.endLoading();
                                    this.errorLog(this.toastController,error.error.message);
                                }
                            );
                        }
                        console.log(data);
                    }
                }
            ]
        });
        prompt.present();

    }
    public subOrder()
    {

        this.C.postApi('home/indexA/getconf',{
            'method':'borrow_ensure',
            'token':this.LS.getItem('TOKEN'),
            'borrow_money':this.borrow_money,
            'borrow_reason':this.borrow_reason,
            'borrow_week':this.borrow_week
        }).subscribe(
            data=>
            {
                if(data.result_code =='SUCCESS')
                {
                    this.orderStatus = '待审核';
                    this.updateOrder();
                    if(data.bank_approved !='1')
                    {
                        this.errorLog(this.toastController,'下单成功,在放款前请先完成您的必要认证');
                        this.navCtrl.push('SearchletterPage');
                    }
                    else{
                        this.errorLog(this.toastController,'下单成功');
                        this.navCtrl.popToRoot();
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
    //延期
    public delay()
    {
        if(this.orderDetail.bank_number =='' || !this.orderDetail.bank_number )
        {
            this.errorLog(this.toastController,'请选择您的还款银行卡');
        }
        else{
            this.C.postApi('home/indexA/getconf',{
                'method':'repayment_qry',
                'token':this.LS.getItem('TOKEN'),
                'borrowid':this.orderId,
                'banknum':this.orderDetail.bank_number,
                'act':'delay'
            }).subscribe(
                data=>{
                    if(data.result_code =='FAIL')
                    {
                        this.errorLog(this.toastController,data.result_msg);
                    }
                    else if(data.result_code == 'SUCCESS'){
                        this.promptDelay(data);
                    }


                },
                (error) =>  {
                    this.C.endLoading();
                    this.errorLog(this.toastController,error.error.message);
                }
            );
        }
    }
    public changeBank()
    {
        this.events.subscribe('bank-events',(params)=>{
            this.orderDetail.bank_name = params.bank_name;
            this.orderDetail.bank_number = params.bank_number;
            this.events.unsubscribe('bank-events');

        });
        this.navCtrl.push('MybanksPage',{
            'from':'orderdetail'
        });
    }
    public showPrompt()
    {
        const prompt = this.alertCtrl.create({
            title: '提升额度',
            message: "请输入您需要提升的金额",
            inputs: [
                {
                    name: 'title',
                    placeholder: '请输入金额'
                },
            ],
            buttons: [
                {
                    text: '取消',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: '确认',
                    handler: data => {
                        //客户输入的不是数字类型
                        if(isNaN(parseInt(data.title)))
                        {
                            this.errorLog(this.toastController,'请输入数字格式');
                            return false;
                        }
                        else{
                            this.applyCredit(parseInt(data.title));
                        }
                        console.log(data);
                    }
                }
            ]
        });
        prompt.present();
    }
    public applyCredit(credit)
    {
        this.C.postApi('home/indexA/getconf',{
            'method':'applay_credit',
            'token':this.LS.getItem('TOKEN'),
            'credit':credit
        }).subscribe(
            data4=>{
                if(data4.result_code == 'SUCCESS')
                {
                    this.errorLog(this.toastController,'申请成功，请等待审核');
                    this.goBack();
                }
                else{
                    this.errorLog(this.toastController,data4.result_msg);
                }

            },
            (error) =>  {
                this.C.endLoading();
                this.errorLog(this.toastController,error.error.message);
            }
        );
    }
    public updateOrder()
    {

    }
    public goBack()
    {
        this.navCtrl.popToRoot();
    }
}
