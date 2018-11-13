// 分享数据模块

import BaseMgr from "../Libs/BaseMgr";

export default class ShareMgr extends BaseMgr{
    //单例处理
    private static _instance:ShareMgr;
    public static getInstance ():ShareMgr{
        if(!this._instance){
            this._instance = new ShareMgr();
            this._instance.sendReqInviteGiftInfo();
        }
        return this._instance;
    }
    curClickItem = null;
    inviteGiftInfo={};
    isShare=null;
    shareButtonFlag = null;
    constructor () {
        
        super();
        this.routes = {
            'http.reqInviteGiftInfo': this.http_reqInviteGiftInfo,
            'http.reqAddInviteGift': this.http_reqAddInviteGift,
            'http.reqReceiveInviteGift': this.http_reqReceiveInviteGift,
            "http.reqCheckDailyShare": this.http_reqCheckDailyShare,
            "http.reqDailyShare":this.http_reqDailyShare,
        };
        this.inviteGiftInfo = {};
        this.curClickItem = 0;
        this.isShare = 0;
        this.shareButtonFlag = false;
    }
    // 分享成功需要告诉 php
    shareSuccess () {
        //console.log("shareSuccess",this.isShare,this.shareButtonFlag);
        if(this.isShare == 0 && this.shareButtonFlag == true){
            this.send_msg("http.reqDailyShare", {})
            this.sendReqAddInviteGift();
            this.shareButtonFlag=false;
        }
    }
    http_reqDailyShare()
    {
        this.isShare=1;
        this.reqMyInfo();
    }
    //获取我的信息
    reqMyInfo() 
    {
        this.send_msg('http.reqMyInfo');
    }
    // 请求邀请有礼详情
    sendReqInviteGiftInfo () {
        this.send_msg('http.reqInviteGiftInfo', {})
    }
    // 获取邀请有礼详情
    http_reqInviteGiftInfo (msg) {
        cc.log("获取邀请有礼详情", msg);
        this.inviteGiftInfo = msg;
    }
    // 邀请送礼微信记录接口
    sendReqAddInviteGift () {
        this.send_msg('http.reqAddInviteGift', {})
    }
    http_reqAddInviteGift (msg) {
        this.sendReqInviteGiftInfo()
    }
    // 领取邀请好友奖励
    sendReqReceiveInviteGift (msg) {
        this.send_msg('http.reqReceiveInviteGift', msg)
    }
    http_reqReceiveInviteGift (msg) {
        this.sendReqInviteGiftInfo();
    }
    //领取免费钻石
    sendReqCheckDailyShare(){
        this.send_msg('http.reqCheckDailyShare')         
    }
    http_reqCheckDailyShare(msg){
        //console.log("领取免费钻石",msg); 
        if(msg.err!=null || msg.err != undefined){
            this.isShare = msg.err;
        }
        //console.log("isShare",this.isShare); 
    }
    setCheckDailyShare(isShare){
        this.isShare = isShare;
    }
    getCheckDailyShare () {
        return this.isShare;
    }
    setCurClick (target) {
        this.curClickItem = target
    }
    getCurClick () {
        return this.curClickItem;
    }
    getCurClickData () {
        return this.inviteGiftInfo.targets[this.curClickItem]
    }
    // 分享任务数据
    getShareTaskData () {
        return this.inviteGiftInfo;
    }
    // 领取分享任务奖品
    ReceiveShareTask () {
        // 这里暂时使用全局函数进行模拟网络交互
        let data = {
            targetID: 1
        }
        G_FRAME.globalEmitter.emit("", data)
    }
}
