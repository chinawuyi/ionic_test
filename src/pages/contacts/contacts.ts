import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ToastController,Platform} from 'ionic-angular';
import {Base} from "../../common/base";
import {LocalStorage} from "../../app/localstorage";
import {Connect} from "../../app/connect";

import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser';
import { Contacts, Contact, ContactField, ContactName,IContactFindOptions ,ContactFieldType} from '@ionic-native/contacts';
/**
 * Generated class for the ContactsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage extends Base
{
    public disable:string = 'true';
    //运营商类型
    public type:string = '';
    public items:any[] = [];
        //  public items:any[] = [];
    public olditems:any[] = [];

    public selItems:any[] = [];
    constructor
    (
        public navCtrl: NavController,
        public navParams: NavParams,
        public LS:LocalStorage,
        public C:Connect,
        public toastController:ToastController,
        public plt:Platform,
        private contacts: Contacts,
        private iab:InAppBrowser,
        private themeableBrowser:ThemeableBrowser
    )
    {
        super();
        this.type = this.navParams.get('type');
        this.getContacts();
    }

    ionViewDidLoad()
    {
        this.errorLog(this.toastController,'请选择3个您的手机联系人');
    }

    public getContacts()
    {
        this.plt.ready().then((readysource)=>{
            this.getAllContacts();
        });
    }
    public getAllContacts():void
    {
        this.contacts.find(['displayName', 'phoneNumbers'], {filter: "", multiple: true})
            .then(data => {
                this._initContacts(data);
            },(err)=>{
                alert(JSON.stringify(err))
            });
    }
    private _initContacts(data)
    {
        data.forEach((item)=>{
            if(item['_objectInstance']['phoneNumbers'] != null)
            {
                this.olditems.push({
                    'name':item['_objectInstance']['name']['formatted'],
                    'mobile':item['_objectInstance']['phoneNumbers'][0]['value'],
                    'checked':false
                });
            }

        });
        this.items = this.olditems;
        this.updateContactsData();
    }
    public goBack()
    {
        this.navCtrl.pop();
    }
    //(ionChange)="updateContacts($event,item.mobile)"
    public updateContacts(event,mobile)
    {
        if(event.checked === true)
        {
            this.items.forEach((item)=>{
                item.checked = false;
            });
        }
       // this.items[1].checked = false;
    }
    public updateSelected(item)
    {
        if(item.checked == true)
        {
            this.addChecked(item);

        }
        else{
            this.removeChecked(item);
        }
    }
    public addChecked(item)
    {
        if(this.selItems.length >=3)
        {
            this.selItems.shift();
            this.selItems.push(item);
        }
        else{
            this.selItems.push(item);
        }
        this.filterItems();
    }
    public removeChecked(item)
    {
        let i = 0;
        let z:number;
        this.selItems.forEach((it)=>{
            if(it.mobile == item.mobile)
            {
                z = i;
            }
            i++;
        });
        this.selItems.splice(z,1);
        this.filterItems();
        //this.splice();
    }
    public filterItems()
    {
        this.items.forEach((item)=>{
            let mobile = item.mobile;
            let init:boolean = false;
            this.selItems.forEach((it)=>{
               if(it.mobile == mobile)
               {
                    init = true;
               }
            });
            if(init == false)
            {
                item.checked = false;
            }
            else{
                item.checked = true;
            }
        });
        if(this.selItems.length ==3)
        {
           // name = Trim(contacts[i].displayName.replace(/\&|-|_|\～|\~|\）|\（|\?|\=|\(|\)|\.|\—|，|。|\<|\>|、|’|\”|➕/g, ""),'g');
           // phone = Trim(contacts[i].phoneNumbers[0].value.replace(/(-)|(\+86)/g, ""),'g');
            this.selItems.map(function(item){
                item.name = item.name.replace(/\s/gi,"");
                item.mobile = item.mobile.replace(/\s/gi,"");
                item.name = item.name.replace(/\&|-|_|\～|\~|\）|\（|\?|\=|\(|\)|\.|\—|，|。|\<|\>|、|’|\”|➕/g, "");
                item.mobile = item.mobile.replace(/(-)|(\+86)/g, "");
                return item;
            });
            if(this.selItems[0].mobile.length != 11 || this.selItems[1].mobile.length != 11 || this.selItems[2].mobile.length != 11)
            {
                this.errorLog(this.toastController,'请选择手机联系人，座机号码不可用');
            }
            else{
                this.updateSelectedContacts();
            }

        }
    }
    //提交客户选中的三个
    public updateSelectedContacts()
    {
        this.C.postApi('home/indexA/getconf',{
            'method':'emergency_chk',
            'token':this.LS.getItem('TOKEN'),
            'type':this.type,
            'en1':this.selItems[0].name,
            'en2':this.selItems[1].name,
            'en3':this.selItems[2].name,
            'ep1':this.selItems[0].mobile,
            'ep2':this.selItems[1].mobile,
            'ep3':this.selItems[2].mobile,
        }).subscribe(
            data=>{
                //token失效
                if(data.result_code =='SUCCESS')
                {
                    this.errorLog(this.toastController,'提交成功');
                    this.openWebView(data.redirectUrl);
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
    public openWebView(url:string):void
    {
      var options = "location=yes,closebuttoncaption=关闭,hidenavigationbuttons=true,toolbar=true,closebuttoncolor=#ffffff,toolbarposition=bottom,toolbarcolor=#fb8300";
      const browser = this.iab.create(url,'_blank',options);
    }
    public openWebView2(url:string):void
    {

        let options = {
          statusbar: {
            color: '#FB8300'
          },
          toolbar:
            {
              height: 44,
              color: '#FB8300'
            },
          title:
            {
              color: '#ffffffff',
              showPageTitle: true
            },
          backButton:
            {
              wwwImage: 'assets/imgs/nav_icon_back@3x.png',
              align: 'left',
              event: 'backPressed'
            },
          backButtonCanClose: true
        };
        const browser: ThemeableBrowserObject = this.themeableBrowser.create(url, '_blank', options);
    }

    //提交所有的 联系人
    public updateContactsData()
    {
        //黄杰:13992510526|柯有军:15091517528
        let phone_lists = '';
        let i = 0;
        let len = this.olditems.length;
        this.olditems.forEach((item)=>{
            let last = '|';
            if( i ==len-1)
            {
                last = '';
            }
            else
            {
                last = '|';
            }
            phone_lists += item.name+':'+item.mobile+last;
            i++;
        });
        this.C.postApi('home/indexA/getconf',{
            'method':'upload_phone_contacts_list',
            'token':this.LS.getItem('TOKEN'),
            'act':'set',
            'phone_lists':phone_lists
        }).subscribe(
            data=>{
                //token失效
               // console.log(data);
               // this.errorLog(this.toastController,'提交成功');
                if(data.result_code == 'SUCCESS')
                {
                   // this.cardlist = data.list;
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
    public getItems(ev:any)
    {
        const val = ev.target.value;
        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.items = this.olditems.filter((item) => {
                return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        }
        else if(val =='')
        {
            this.items = this.olditems;
        }
    }
}
