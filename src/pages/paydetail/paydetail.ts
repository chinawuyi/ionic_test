import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ToastController,AlertController} from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import {Base} from "../../common/base";
import {LocalStorage} from "../../app/localstorage";
import {Connect} from "../../app/connect";
/**
 * Generated class for the PaydetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-paydetail',
  templateUrl: 'paydetail.html',
})
export class PaydetailPage extends Base
{

    public alertObj:any;
    public orderId:string = '';
    public payMoney:number = 0;
    public payMoney2:string = '';
    public TrxId:string = '';
    public checkedList = [];
    public orderDetail:any = {
      //借贷时间
      'apply_time':'',
      //金额
      'borrow_money':'',
      'borrow_reason':'',
      'borrow_state':'',
      //待还利息
      'repayment_interest':'',
      //已还金额
      'payedmoney':'',
      //贷款租金，手续费
      'commission':'',
      //还款时间
      'repayment_time':'',
      'bank_name':'',
      'bank_number':'',
      'borrow_week':'',
      'contract_url':'',
      //还款明细
      'list':[]
    };
    public orderStatus:string = '';
    private isShow:Boolean = false;
    private checkedPro:boolean = true;

    constructor
    (
      public navCtrl: NavController,
      public navParams: NavParams,
      public LS:LocalStorage,
      public toastController:ToastController,
      public C:Connect,
      private iab:InAppBrowser,
      public alertCtrl: AlertController
    )
    {
        super();
        this.orderId = this.navParams.get('orderId');
        this.getOrderDetail();
    }

    public goBack()
    {
        this.navCtrl.popToRoot();
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
                this.orderDetail.list.forEach((item)=>{
                    item['checked'] = false;
                    if(item.cycle_mem == '已赎回')
                    {
                        item['disabled'] = true;
                    }
                    else{
                        item['disabled'] = false;
                    }

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
    public checkList(i)
    {
        var selectedIndex = 0;
        this.payMoney = 0;
        this.checkedList = [];
        this.orderDetail.list.forEach((item,index)=>{
            if(item.checked == true)
            {

                 selectedIndex = index;
            }
        });
        this.orderDetail.list.forEach((item,index)=>{
           if(index <= selectedIndex )
           {
              if(i !=0)
              {
                item.checked = true;
              }
              if(index <selectedIndex)
              {
                 item['disabled'] = true;
              }
              else{
                item['disabled'] = false;
              }

           }
           else{
              item.checked = false;
           }
           if(item.checked == true)
           {
              if(item.cycle_mem != '已赎回')
              {
                  this.payMoney += parseFloat(item.total);
                  this.checkedList.push(item);
              }

           }
        });
        this.payMoney2 = this.toDecimal2(this.payMoney);
    }
    private  toDecimal2(x):string
    {
        var f = parseFloat(x);
        if (isNaN(f)) {
          return '';
        }
        f = Math.round(x*100)/100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
          rs = s.length;
          s += '.';
        }
        while (s.length <= rs + 2) {
          s += '0';
        }
        return s;
    }
    //提交贷款
    public subData()
    {
        if(this.checkedList.length == 0)
        {
            this.errorLog(this.toastController,'请至少选择一期还款');
        }
        else{
          console.log(this.checkedList);
            var liststr = '';
            this.checkedList.forEach((item)=>{
                var cycle = item.cycle.split(' ')[0].split('\/')[0].split('[')[1];
                liststr += cycle + '|';
            });
            liststr = liststr.substring(0,liststr.length-1);


            this.C.postApi('home/indexA/getconf',{
              'method':'repayment_qry',
              'token':this.LS.getItem('TOKEN'),
              'cycle':liststr,
              'borrowid':this.orderId,
              'banknum':this.orderDetail.bank_number
            }).subscribe(
              data=>{
                if(data.result_code =='FAIL')
                {
                    this.errorLog(this.toastController,data.result_msg);
                }
                else if(data.result_code == 'SUCCESS')
                {
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
        title: '还款',
        message: "还款金额："+data.TrxAmt,
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
                       // this.showPrompt();
                        this.navCtrl.popToRoot();
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
    public showFeeDetail()
    {
        this.isShow = !this.isShow;
    }
    public ageement()
    {
        this.checkedPro = !this.checkedPro;
    }
    public gotoService()
    {
        this.navCtrl.push('AggreementPage');
    }
    //打开合同
    public openContract()
    {
        if(this.orderDetail.contract_url != '')
        {
           const browser = this.iab.create(this.orderDetail.contract_url,'_system');
        }

    }
}
