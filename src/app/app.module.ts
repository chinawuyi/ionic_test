import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import { Contacts } from '@ionic-native/contacts';
import { Camera } from '@ionic-native/camera';

import { Geolocation } from '@ionic-native/geolocation';

import { InAppBrowser } from '@ionic-native/in-app-browser';

import {ThemeableBrowser } from '@ionic-native/themeable-browser';
import { Device } from '@ionic-native/device';




import { Connect } from './connect';
import { LocalStorage } from './localstorage';



import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { MyPage } from '../pages/my/my';
import { OrderlistPage } from '../pages/orderlist/orderlist';
import {ProblemdetailsPage} from '../pages/problemdetails/problemdetails';


@NgModule({
  declarations: [
    MyApp,
    HomePage,TabsPage,MyPage,OrderlistPage,ProblemdetailsPage
  ],
  imports: [
    BrowserModule,HttpClientModule,
    IonicModule.forRoot(MyApp,{
        tabsHideOnSubPages:true
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,TabsPage,MyPage,OrderlistPage,ProblemdetailsPage
  ],
  providers: [
    StatusBar,SplashScreen,
    Connect,LocalStorage,

    Contacts,Camera,InAppBrowser,Geolocation,ThemeableBrowser,Device,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
