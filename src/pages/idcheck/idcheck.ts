import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';
import {Base} from "../../common/base";
import {Connect} from "../../app/connect";
import {LocalStorage} from "../../app/localstorage";
import {GLOBALBASE as G} from "../../app/const";
/**
 * Generated class for the IdcheckPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-idcheck',
  templateUrl: 'idcheck.html',
})
export class IdcheckPage extends Base
{

    public front:string ='';

    public behind:string ='';



    public uploadResult = {
        'FRONT':{},
        'BACK':{}
    };
    //判断身份证认证是否完成
    public id_approved:string = '';
    public emergency_approved:string = '';
    public nextText:string = '下一步';
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
        this.id_approved = this.navParams.get('id_approved');
        this.emergency_approved = this.navParams.get('emergency_approved');

        if(this.id_approved == '1' || this.id_approved == '3')
        {
            this.getIdMsg();
            this.nextText = '已认证，下一步';
        }

    }

    ionViewDidLoad() {

    }
    public getIdMsg()
    {
        this.C.postApi('home/indexA/getconf',{
            'method':'get_idcard_info',
            'token':this.LS.getItem('TOKEN')
        }).subscribe(
            data=>{
                if(data.result_code == 'SUCCESS')
                {
                    this.front = data.face;
                    this.behind = data.back;
                }else{
                    this.errorLog(this.toastController,data.result_msg);
                }
            },
            (error) =>
            {
                this.C.endLoading();
                this.errorLog(this.toastController,error.error.message);
            }
        );
    }
    public goBack():void{
        this.navCtrl.pop();
    }

    public openCamera(face) {
        if(this.id_approved =='1' ||this.id_approved == '3')
        {
            this.errorLog(this.toastController,'您的身份证已经认证');
        }
        else{
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
                if(face == 'face')
                {
                    this.front = base64Image;
                }
                else if(face == 'behind')
                {
                    this.behind = base64Image;
                }
                // this.path = base64Image;

                //If it's file URI
                // this.path = imageData;

            }, (err) => {
                // Handle error
            });
        }

    }


    public checkIdSuccess(data):void
    {


        if(data.FRONT.result_code == 'SUCCESS')
        {
            this.uploadResult.FRONT = data.FRONT;
            this.LS.setItem('idcard',data.FRONT.id_card_number);
            this.LS.setItem('name',data.FRONT.name);
        }

        if(data.BACK.result_code == 'SUCCESS')
        {
            this.uploadResult.BACK = data.BACK;
        }
        if(data.FRONT.result_code == 'FAIL')
        {
            this.errorLog(this.toastController,data.FRONT.result_msg);
            return;
        }
        if(data.BACK.result_code == 'FAIL'){
            this.errorLog(this.toastController,data.BACK.result_msg);
            return;
        }
        if(this.uploadResult.FRONT['result_code'] == 'SUCCESS' && this.uploadResult.BACK['result_code'] =='SUCCESS')
        {
            this.navCtrl.push('FacecheckPage',{
                'id_approved':'3'
            });
        }
    }

    public upload():void
    {

        if(this.front == '' || this.behind == '')
        {
            this.errorLog(this.toastController,'请先拍照');
            return;
        }
        this.C.postApi('home/indexA/getconf',{
            'method':'upload',
            'FRONTIMG':this.front.split('data:image/jpeg;base64,')[1],
            'BACKIMG':this.behind.split('data:image/jpeg;base64,')[1],
            'token':this.LS.getItem('TOKEN')
        }).subscribe(
            data=>{
                this.checkIdSuccess(data);
            },
            (error) =>
            {
                this.C.endLoading();
                this.errorLog(this.toastController,error.error.message);
            }
        );
    }

    public gotoNext():void
    {
        if(this.id_approved == '1' || this.id_approved =='3')
        {
            this.navCtrl.push('FacecheckPage',{
                'id_approved':this.id_approved
            });
        }
        else
        {
            this.upload();
        }

        //this.navCtrl.push('MylimitPage');
    }
}
