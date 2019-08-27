import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
/**
 * Generated class for the IframePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-iframe',
  templateUrl: 'iframe.html',
})
export class IframePage {
    public  browser: any = {
        isLoaded: false, // 网页是否被加载
        proObj: null, // 进度条对象
        progress: 0, // 网页访问的进度条
        secUrl: '', // 安全链接

        title: '加载中',
        url: ''
    };

    public shareConfig: any = {
        isShow: true
    }; // 分享控制的配置

    public microAppCall;
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private sanitizer: DomSanitizer
    )
    {
        this.browser.title = this.navParams.get('title');
        this.browser.url = this.navParams.get('url');
        this.browser.secUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.browser.url);
    }
    public loaded()
    {
        console.log(4);
    }

    public goBack():void{
        this.navCtrl.pop();
    }
    ionViewDidLoad() {
      console.log('ionViewDidLoad IframePage');
    }

}
