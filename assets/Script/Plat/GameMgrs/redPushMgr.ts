
import BaseMgr from "../Libs/BaseMgr";
import UserMgr from "./UserMgr";

export default class redPushMgr extends BaseMgr{
    routes:{} = null
    redState = [];
    //myinfo = null;
    mailList:any = null;
    dailyTaskList:any = null;
    inviteList:any = null;
    public mailRed = false;
	public welfareRed = false
    constructor (){
        super();
        this.routes={
            //'http.reqMyInfo':this.http_reqMyInfo, 
            'http.reqUnread':this.http_reqUnread,//初始化红点状态
            'http.reqMailList':this.http_reqMailList,//邮件详情
            'http.reqDailyActivity':this.http_reqDailyActivity,//每日任务详情
            'http.reqInviteGiftInfo':this.http_reqInviteGiftInfo,//邀请有礼详情
        }
        //this.myinfo = UserMgr.getInstance().getMyInfo();
        this.sendRedreq()
    }

    sendRedreq(){
        this.send_msg("http.reqUnread");
    }

    // http_reqMyInfo(msg){
    //     this.myinfo = msg
    // }

    http_reqUnread(msg){
        this.redState = msg.result;
        if(this.redState.length == 2){
            this.mailRed = true;
            this.welfareRed = false;
        }else if(this.redState.length == 1){
            if(this.redState[0] == 1){
				this.welfareRed = true;
				this.mailRed = false;
			}else if(this.redState[0] == 2){
				this.welfareRed = false;
				this.mailRed = true;
			}
        }
    }
    http_reqMailList(msg){
        this.mailRed = false
        this.mailList = msg.maillist
        for(let i = 0;i<this.mailList.length;i++){
            if(this.mailList[i].status != 2){   //status：0：未阅读，1：已阅读未领取，2：已阅读已领取
                this.mailRed = true;
            }
        }
        this.gemit("mailRedPush_update",this.mailRed);
    }
    http_reqDailyActivity(msg){
        this.dailyTaskList = msg;
        this.updateWelfareRed();
    }

    http_reqInviteGiftInfo(msg){
        this.inviteList = msg;
        this.updateWelfareRed();
    }

    updateWelfareRed(){
        this.welfareRed = false;
        //每日任务福利
        if (this.dailyTaskList) {
            for (let i = 0; i < this.dailyTaskList.length; i++) {
                let target = this.dailyTaskList[i].target;  //任务目标
                let step = this.dailyTaskList[i].step;      //已完成进度
                if (!this.dailyTaskList[i].is_receive && step >= target) {//is_receive：0=未领取 1=已领
                    this.welfareRed = true;
                }
            }
        }
        //分享任务福利
        if (this.inviteList) {
            let list = this.inviteList.targets;
            let num = this.inviteList.number;         //已分享数量
            for (let i = 0; i < list.length; i++) {
                if (parseInt(list[i].target) <= num && list[i].status != 1) {//status:1已领取，0是未领取
                    this.welfareRed = true;
                }
            }
        }
        // if (this.myinfo && this.myinfo.is_first_recharge && !this.myinfo.is_get_reward) {  //首充奖励领取判断
        //     this.welfareRed = true
        // }
        this.gemit("welfareRedPush_update",this.welfareRed);
    }
    getMailRed(){
        return this.mailRed;
    }
    getwelfareRed(){
        return this.welfareRed;
    }
    private static _instance:redPushMgr;
    public static getInstance ():redPushMgr{
        if(!this._instance){
            this._instance = new redPushMgr();
        }
        return this._instance;
    }
}