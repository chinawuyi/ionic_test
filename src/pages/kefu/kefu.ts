import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {ProblemdetailsPage} from '../problemdetails/problemdetails';
/**
 * Generated class for the KefuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-kefu',
  templateUrl: 'kefu.html',
})
export class KefuPage {

    private navShow:boolean = false;
    private curIndex = 1;
    fromPage:string;
    problemList = [];
    problemList2 = [];
    problemList3 = [];
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams
    )
    {
        this.curIndex = this.navParams.get('type')?this.navParams.get('type'):1;
        this.fromPage = this.navParams.get('fromPage')?this.navParams.get('fromPage'):'';

    }
    ionViewDidEnter()
    {
        this.problemList = [
          {'title':'融资相关','id':1,'detail':[
              {'name':'银行已扣款，为什么app还没还款成功？','titleId':'11','des':'扣款成功后银行需与平台进行系统资金对账工作。如已确定银行已经扣款成功，请不用担心，最迟可在次日查看app还款更新情况。'},
              {'name':'是否可以续期？','titleId':'12','des':'可以根据个人情况选择需器或全额还款。'},
              {'name':'从什么时候开始计算费用？','titleId':'13','des':'自您的融资成功,资金进入你的现金账户开始开始计息。'},
              {'name':'如何收费？','titleId':'14','des':'注册、认证不收费，费率采用风险定价，具体利率系统会根据您的综合资信状况给出，具体收费，可在融资申请前查看费用明细。利息费： 在还款时一次性收取。'},
              {'name':'手机号无法注册怎么办？','titleId':'15','des':'确认操作过程中手机网络通畅。\n' +
                  '确认手机号码是否正确（已注册的手机号无法重复注册）\n' +
                  '确认登录密码格式正确（6-18位数字或字母，不可含符号）\n' +
                  '确认正确输入验证码，如无法收到验证码，请检查手机是否能正常接收短信，并重新获取。'},
              {'name':'无法登录怎么办？','titleId':'16','des':'确认操作过程中手机网络通畅。\n' +
                  '确认登录手机号码及密码输入正确\n' +
                  '如忘记登录密码，可在密码错误输入过多时，在页面中进行“找回密码”操作。'},
              {'name':'为何要同意及授权相关文件？','titleId':'17','des':'这些是保证您权益的授权文件，请在了解文件内容后进行确认，只有获得您授权后才能进行系统评估，给出授信额度。'},
              {'name':'为什么一分钟内未完成审核？','titleId':'18','des':'获取第三方信息进行审核的过程中，可能会因第三方信息传输等待等情况造成延迟，请耐心等候并留意系统审批结果，如超过一个工作日还未出结果，请联系客服。'},
              {'name':'提现后多久能到账？','titleId':'19','des':'因合作银行等金融机构原因需进行相关清算操作，理论上1分钟内到，原则上不超过一个工作日即可到账。'},
              {'name':'忘记登录密码怎么办？','titleId':'20','des':'请确认密码是否填写正确，密码为不少于6位数的数字或英文字母（区分大小写）。\n' +
                  '通过（找回密码）功能重新设置您的登录密码。\n' +
                  '如无法解决，请联系客服*'},
              {'name':'如果手机丢失了，如何避免账户被盗用？','titleId':'21','des':'当您手机丢失时，请及时用其他手机登录您的融资账号，更改登录密码。'}
            ],
            'show':true}];
          this.problemList2 = [{'title':'测试数据','id':1,'detail':[
              {'name':'什么是信用额度？','titleId':'11','des':'信用额度是根据您个人提供的信息及第三方提供的信息综合评估，由系统计算得出的。额度最高为3万元人民币，获得信用额度后，您可在额度范围内自主提现。当提现的融资结清后，系统会恢复对应额度，额度可循环使用。'},
              {'name':'如果曾经还款记录不良，是否能申请？','titleId':'12','des':'如有不良还款记录，会对您的综合资信状况产生影响，但具体能否获得额度，还是需要结合其他方面的整体情况来评定。'},
              {'name':'逾期是否会记录进个人信用报告？','titleId':'13','des':'当您逾期15天时，系统会自动上传您的逾期情况，至蚂蚁金服-芝麻信用-负面记录和人民银行征信系统，对您的芝麻信用分及人民银行征信记录造成影响，请您珍惜信用记录，按合同约定进行还款。'},
              {'name':'我填写的资料会被泄露吗？','titleId':'14','des':'我们使用了先进的安全技术保护您在账户中存储的账户信息、交易记录，以免用户账户遭受到未经授权的访问、使用以及信息泄露。\n' +
                  '我们严格遵守国家相关的法律法规。对您的隐私信息进行保护，未经您的同意，不会向任何第三方公司、组织和个人披露您的信息（法律法规另有规定的根据与您约定的某项服务已获得您同意的除外）'}

            ]}];

      this.problemList3 =[{'title':'测试数据','id':1,'detail':[
          {'name':'提前结清会产生而外费用吗？','titleId':'11','title':'','des':'不会产生任何额外费用。'},
          {'name':'怎么能释放额度？','titleId':'12','title':'','des':'当一笔融资全额结清后，系统会自动恢复相应额度。'}],'show':true}]
    }
    public goBack():void{
        this.navCtrl.pop();
    }
    public callPhone(tel:string):void{

    }

    //展开明细
    public showAll(item:any):void{
        item.show = !item.show;
    }

    public goToDetail(detail:any){
        this.navCtrl.push(ProblemdetailsPage,detail)
    }

    public callCust2():void
    {

    }

}
