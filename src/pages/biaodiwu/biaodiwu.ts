import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';
import {Base} from "../../common/base";

import {Connect} from "../../app/connect";
import {LocalStorage} from "../../app/localstorage";
/**
 * Generated class for the BiaodiwuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-biaodiwu',
  templateUrl: 'biaodiwu.html',
})
export class BiaodiwuPage extends Base
{
    public nextText:string ='下一步';
    public front:string = "";
    public target_price :string = '';
    public target_type :string = '';
    public target_name : string = '';
    constructor
    (
        public navCtrl: NavController,
        public navParams: NavParams,
        public C:Connect,
        public toastController:ToastController,
        public LS:LocalStorage,
        private camera: Camera
    )
    {
        super();
    }
    public goBack()
    {
      this.navCtrl.popToRoot();
    }
    public openCamera() {
      const options: CameraOptions = {
        quality: 50,                                                   //相片质量 0 -100
        destinationType: this.camera.DestinationType.DATA_URL,        //DATA_URL 是 base64   FILE_URL 是文件路径
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        saveToPhotoAlbum: false,                                       //是否保存到相册
        targetWidth:1000,
        targetHeight :1333
        // sourceType: this.camera.PictureSourceType.CAMERA ,         //是打开相机拍照还是打开相册选择  PHOTOLIBRARY : 相册选择, CAMERA : 拍照,
      }

      this.camera.getPicture(options).then((imageData) => {
        // console.log("got file: " + imageData);

        // If it's base64:
        let base64Image = 'data:image/jpeg;base64,'+ imageData;
        this.front = base64Image;
        // this.path = base64Image;

        //If it's file URI
        // this.path = imageData;

      }, (err) => {
        // Handle error
      });

    }

    public supData()
    {
        this.C.postApi('home/indexA/getconf',{
          'method':'set_target_info',
          'TARGET':this.front.split('data:image/jpeg;base64,')[1],
          'target_name':this.target_name,
          'target_type':this.target_type,
          'target_price':this.target_price,
          'token':this.LS.getItem('TOKEN')
        }).subscribe(
          data=>{
              console.log(data);
              if(data.result_code == 'SUCCESS')
              {
                this.navCtrl.push('CreateloanPage');
              }else{
                this.errorLog(this.toastController,data.result_msg);
              }
            //this.checkIdSuccess(data);
          },
          (error) =>
          {
            this.C.endLoading();
            this.errorLog(this.toastController,error.error.message);
          }
        );
    }

}
