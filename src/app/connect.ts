import { Injectable } from '@angular/core';
import {LoadingController, ToastController} from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

import { GLOBALBASE } from './const';

@Injectable()
export class Connect
{
  public path:string;
  public isLoading:boolean = false;
  public loading:any;
  constructor
  (
      private http:HttpClient,
      public loadCtrl:LoadingController,
      public toastController:ToastController
  )
  {
      this.path = GLOBALBASE['path'];

  }

  public async startLoading()
  {
      if(this.isLoading == true)
      {
          return;
      }
      this.isLoading = true;
      this.loading = await this.loadCtrl.create({
        spinner: 'hide',
        content: '<img style="width:20px;height:auto;" src="./assets/imgs/loading.gif">',
        cssClass: 'custom-class custom-loading'
      });
      return await this.loading.present();
  }
  public endLoading():void
  {
      if(this.isLoading == true)
      {
          this.loading.dismiss();
          this.isLoading = false;
      }
  }

  private  _compare(property)
  {
      return function(a,b){
          var value1 = a[property];
          var value2 = b[property];
          return value1 - value2;
      }
  }
  public postApi(action,arg,canLoading:boolean=true):any
  {
      let _path = this.path+action;
      let _search = {};
      let _arr:any[] = [];
      for(let i in arg)
      {
          if(i)
          {
              _search[i] = arg[i];
              _arr.push({
                "key":i,
                "value":arg[i]
              });
          }
      }
      let _sortarr:any[] = _arr.sort(this._compare('key'));
      let _parstr:string = '';
      _sortarr.forEach((item)=>{
          _parstr += item['key'];
          _parstr += '=';
          _parstr += item['value'];
          _parstr += '&';
      });
      _parstr = _parstr.substr(0,_parstr.length-1);
      if(canLoading){
          this.startLoading();
      }
      //const headers = new HttpHeaders().set("usertoken", "d444aa0f-f30d-4804-87d5-35e6e2082739");
      //,{headers}
      return this.http.post(_path,_search).map(response=>{
          if(canLoading)
          {
              this.endLoading();
          }
          if(response['return_code'] === 'SUCCESS')
          {
              return response;
          }
          else
          {
              this.errorLog(this.toastController,response['return_msg']);
              return false;
          }
      });
  }

  public getApi(action,arg,canLoading:boolean=true):any
  {

      let _search = {};
      let _arr:any[] = [];
      for(let i in arg)
      {
          if(i)
          {
              _search[i] = arg[i];
              _arr.push({
                  "key":i,
                  "value":arg[i]
              });
          }
      }
      let _sortarr:any[] = _arr.sort(this._compare('key'));
      let _parstr:string = '';
      _sortarr.forEach((item)=>{
          _parstr += item['key'];
          _parstr += '=';
          _parstr += item['value'];
          _parstr += '&';
      });
      _parstr = _parstr.substr(0,_parstr.length-1);
      let _path = this.path+action;
      if(canLoading)
      {
          this.startLoading();
      }
      return this.http.get(_path,{params:_search}).map(response=>{
          if(canLoading)
          {
              this.endLoading();
          }
          if(response['return_code'] === 'SUCCESS')
          {
              return response;
          }
          else
          {
              this.errorLog(this.toastController,response['return_msg']);
              return false;
          }
      });
  }
  private async errorLog(toastController:ToastController,message:string='toast message',position:string='middle')
  {
      const toast = await toastController.create({
          message: message,
          duration: 2000,
          position: position,

      });
      toast.present();
  }


}
