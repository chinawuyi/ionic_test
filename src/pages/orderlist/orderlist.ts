import { Component } from '@angular/core';
import { NavController, NavParams ,Events,ToastController} from 'ionic-angular';
import {Base} from "../../common/base";
import {Connect} from "../../app/connect";
import {LocalStorage} from "../../app/localstorage";

/**
 * Generated class for the OrderlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-orderlist',
  templateUrl: 'orderlist.html',
})
export class OrderlistPage extends Base{
      public orderStatus:string[] = ['全部','需赎回'];
      public orders:string[] = ['待申请','已申请','已还款','待还款','已废弃','已坏账','审核中','已逾期','还款中','待绑卡','打款中'];
      private curIndex = 0;
      private orderList:any = [];
      private filterOrderList:any = [];
      public hiddenBackBtn:boolean = true;
      constructor
      (
          public navCtrl: NavController,
          public navParams: NavParams,
          public events:Events,
          public C:Connect,
          public LS:LocalStorage,
          public toastController:ToastController
      )
      {
          super();

      }

      ionViewDidLoad() {
       // console.log('ionViewDidLoad OrderlistPage');
      }
      ionViewWillEnter()
      {
          if(this.navParams.get('hiddenBackBtn') === false)
          {
              this.hiddenBackBtn = false;
          }
          else{
              console.log(1231231);
              this.hiddenBackBtn = true;
          }
          if(!this.LS.getItem('isLogin') || this.LS.getItem('isLogin') == null)
          {

             // this.navCtrl.push('LoginPage');
          }
          else{
              this.getOrders();
          }
      }
      public gotoLogin()
      {

            this.navCtrl.push('LoginPage');
      }
      public getOrders()
      {
          this.C.postApi('home/indexA/getconf',{
              'method':'borrow_records',
              'token':this.LS.getItem('TOKEN'),
              'type':'all'
          }).subscribe(
              data=>{
                  //token出错
                  if(data.result_code == '10002')
                  {
                      this.navCtrl.push('LoginPage');
                  }
                  else if(data.result_code == 'SUCCESS'){
                      this.orderList = data.list;
                      this.filterOrderList = data.list;
                  }
              },
              (error) =>  {
                  this.C.endLoading();
                  this.errorLog(this.toastController,error.error.message);
              }
          );
      }
      public gotoDetail(item)
      {
         /* this.navCtrl.push('OrderdetailPage',{
              'orderId':item.id

          }); */
          this.navCtrl.push('PaydetailPage',{
            'orderId':item.id

          });
      }
      public goBack()
      {
          this.navCtrl.pop();
      }
      public tabOrder(index:number):void{
            this.curIndex = index;
              if(index ==0){
                  this.orderList = this.filterOrderList;
              }else{
                  this.orderList = this.filterOrderList.filter((item) => {
                      // console.log(item);
                      if(item.borrow_state == '待赎回'){
                          console.log('ddddd')
                          return true;
                      }else{
                          return false;
                      }
                  });
              }

      }

}
