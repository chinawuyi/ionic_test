import { ToastController } from 'ionic-angular';



export abstract class Base
{
    protected constructor()
    {

    }
    protected async presentToast(toastController:ToastController,message:string='toast message',position:string='middle') {
        const toast = await toastController.create({
            message: message,
            duration: 2000,
            position: position,

        });
        toast.present();
    }
    public async errorLog(toastController:ToastController,message:string='toast message',position:string='middle')
    {
        const toast = await toastController.create({
            message: message,
            duration: 2000,
            position: position,

        });
        toast.present();
    }

    public checkMobile(mobile:any):boolean
    {
        let reg = /^1[0-9]{10}$/;
        if(!reg.test(mobile))
        {
            return false;
        }
        return true;
    }

    public toThousands(num):string
    {
        let result = '', counter = 0,i=0;
        num = (num || 0).toString();
        for ( i = num.length - 1; i >= 0; i--)
        {
            counter++;
            result = num.charAt(i) + result;
            if (!(counter % 3) && i != 0)
            {
                result = ',' + result;
            }
        }
        return result;
    }

}
