/*
author: YOYO
日期:2018-03-12 14:41:26
*/
import BaseView from "../../../Plat/Libs/BaseView";
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import MpnnLogic from "../BullMgr/MpnnLogic";
import MpnnConst from "../BullMgr/MpnnConst";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import GEventDef from "../../../Plat/GameMgrs/GEventDef";
import UserMgr from "../../../Plat/GameMgrs/UserMgr";
import GameAudioCfg from "../../../Plat/CfgMgrs/GameAudioCfg";
 
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Mpnn_tipClock;
const TipStr = {
    idle:"旁观中",
    waitStart:"等待房主%s开始游戏",
    waitQiangZhuang:"抢庄中:%s",
    waitChooseChip:"闲家下注:%s",//通比牛牛没有倒计时
    thinking:"查看手牌:%s",
    waitTanpai:"等待玩家摊牌:%s",
    waitRestart:"等待重新开始",
    waitOtherPrepare:"等待其它玩家准备",
}
//模型，数据处理
class Model extends BaseModel{
	constructor()
	{
		super();
    }
    //获取当前操作需要的等待时间
    getCurWaitTime(){
        return MpnnLogic.getInstance().getCurWaitTime();
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    private countDownStr:string
	ui={
        //在这里声明ui
        lbl_info:null,
        sprite_bg:null
	};
    node=null;
    intervalID:number = null
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
        this.ui.lbl_info = ctrl.lbl_info;
        this.ui.sprite_bg = ctrl.sprite_bg;
    }

    //刷新显示的内容
    setInfo (info:string){
        this.node.active = true;
        this.ui.lbl_info.string = info;
        this.ui.sprite_bg.node.width = this.ui.lbl_info.fontSize*(this.ui.lbl_info.string.length+4);
    }
    startCountDown (curStr:string = '%s'){
        this.clearCountDown();
        this.node.active = true;
        this.countDownStr = curStr;
        let time = this.model.getCurWaitTime();
        //console.log('倒计时',time)
        if(time > 0){
            this.showCountDown(time);
        }else this.node.active =false;
    }
    //清理倒计时
    hideTipInfo(){
        this.node.active = false;
    }

    clearCountDown (){
        clearInterval(this.intervalID);
        this.intervalID = null;
        this.hideTipInfo();
    }

    //==========================
    
    //显示倒计时
    private showCountDown(time){
        let curTime = time;
        this.ui.lbl_info.string = this.formatStr(this.countDownStr, curTime);
        this.ui.sprite_bg.node.width = this.ui.lbl_info.fontSize*(this.ui.lbl_info.string.length+4);
        this.intervalID = setInterval(()=>{
            if(curTime > 0){
                curTime -= 1;
                if(curTime<=3){
                    //播放倒计时音效
                    GameAudioCfg.getInstance().playGameProcessAudio("Clock",false);
                }
                this.ui.lbl_info.string = this.formatStr(this.countDownStr, curTime);
            }else{
                this.clearCountDown();
            }
        }, 1000);
    }

    formatStr(...args){
        var t=args,e=t.length;
        if(e<1)return"";
        var i=/(%d)|(%s)/,n=1,r=t[0],s="string"==typeof r&&i.test(r);
        if(s)for(var o=/%s/;n<e;++n){
            var a=t[n],c="number"==typeof a?i:o;
            c.test(r)?r=r.replace(c,a):r+=" "+a
        }else if(e>1)for(;n<e;++n)r+=" "+t[n]; else r=""+r;
        return r
    }
}
//c, 控制
@ccclass
export default class Mpnn_tipClock extends BaseCtrl {
	view:View = null
	model:Model = null
	//这边去声明ui组件
    @property(cc.Label)
    lbl_info:cc.Label = null
    @property(cc.Sprite)
    sprite_bg:cc.Sprite = null
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离
    private waitId                  //延时
	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model,View);
	}

	//定义网络事件
	defineNetEvents()
	{
        this.n_events = {
        };
        this.n_events['connector.entryHandler.enterRoom'] = this.onEnterRoom;
        this.n_events[MpnnConst.clientEvent.onProcess] = this.onProcess;
        this.n_events['onPrepare'] = this.onPrepare;
        this.n_events[MpnnConst.clientEvent.onTanPai] = this.onTanPai;
        this.n_events[MpnnConst.clientEvent.onSyncData] = this.onSyncData;
        this.n_events[MpnnConst.clientEvent.onMidEnter] = this.onMidEnter;
        this.n_events['http.reqSettle'] = this.onReqSettle;
	}
	//定义全局事件
	defineGlobalEvents()
	{
        this.g_events[GEventDef.bull_giveCardEnd] = this.onGiveCardEnd
        this.g_events[GEventDef.usersUpdated] = this.usersUpdated
        this.g_events["showBetTip"]=this.showBetTip
	}
	//绑定操作的回调
	connectUi()
	{
	}
	start () {
        //要判定自己是不是房主
        //this.view.setInfo(TipStr.idle);
        this.node.active = false;
	}
    //网络事件回调begin
    //当总结算时，隐藏掉提示
    onReqSettle (msg){
        if(RoomMgr.getInstance().isBunchFinish()){
            this.node.active = false;
        }
    }
    //如果进入下一个操作，则清理倒计时
    onEnterRoom(msg){
        //console.log("这是替换提示的消息",msg)
        let bwatch = msg.bwatch;
        let gamestarted = msg.gamestarted;
        if(msg.bunchInfo.roundIndex>0 && !bwatch && !gamestarted){
            this.view.setInfo(TipStr.waitRestart);
        }
        
    }
    onProcess(msg){
        switch(msg.process){
            case MpnnConst.process.start:
                clearTimeout(this.waitId);
                this.waitId = null;
                break
            case MpnnConst.process.chooseChip:
                this.view.hideTipInfo();
                this.waitId = setTimeout(() => {
                    this.view.startCountDown(TipStr.waitChooseChip);
                }, 300);
                break
            case MpnnConst.process.giveCards:
                this.view.hideTipInfo();
                this.view.startCountDown(TipStr.waitQiangZhuang);
                break
            case MpnnConst.process.settle:
                //游戏结算
                this.view.clearCountDown();
                this.view.setInfo(TipStr.waitRestart);
                break
        }
    }
    //有玩家准备
    onPrepare(msg){
        if(msg.seatid == MpnnLogic.getInstance().getMyLogicSeatId()){
            //自己准备, 需要根据自己是否是房主来做显示 test
            let curStr;
            if(RoomMgr.getInstance().isFirstRound()){
                let uid = RoomMgr.getInstance().getRoomOwner();
                curStr = this.view.formatStr(TipStr.waitStart, UserMgr.getInstance().getUserById(uid).nickname);
            }else{
                curStr = TipStr.waitOtherPrepare;
            }
            this.view.setInfo(curStr);
        }
    }
    //摊牌
    onTanPai(msg){
        if(msg.seatId == MpnnLogic.getInstance().getMyLogicSeatId()){
            this.view.startCountDown(TipStr.waitTanpai);
        }
    }
    onSyncData(msg) {
        switch (msg.processType) {
            case MpnnConst.process.giveCards:
                this.view.startCountDown(TipStr.waitQiangZhuang);
                break;
            case MpnnConst.process.chooseChip:
                this.view.hideTipInfo();
                this.view.startCountDown(TipStr.waitChooseChip);
                break;
            case MpnnConst.process.calculate:
                this.view.startCountDown(TipStr.thinking);
                break;
            case MpnnConst.process.settle:
                this.view.clearCountDown();
                this.view.setInfo(TipStr.waitRestart);
                break;
        }
    }
    //自己是中途加入的
    onMidEnter(msg) {
        //this.node.active = true;
        this.view.setInfo(TipStr.idle);
        if (msg.enterSeatId == RoomMgr.getInstance().getMySeatId()){
            if(msg.curProcess == MpnnConst.process.giveCards){
                this.view.startCountDown(TipStr.thinking);
            }
        }
    }
    
	//end
    //全局事件回调begin
    showBetTip(){
        this.view.startCountDown(TipStr.waitChooseChip);
    }
    //发牌结束
    onGiveCardEnd(){
        this.view.startCountDown(TipStr.thinking);
    }
    usersUpdated(){
        let room = RoomMgr.getInstance();
        let myLogicSeatId = room.getMySeatId();
        if(room.preparemap[myLogicSeatId]){
            let curStr;
            if(RoomMgr.getInstance().isFirstRound()){
                let uid = RoomMgr.getInstance().getRoomOwner();
                curStr = this.view.formatStr(TipStr.waitStart, "");
            }else{
                curStr = TipStr.waitOtherPrepare;
            }
            this.view.setInfo(curStr);
        }
    }

	//end
	//按钮或任何控件操作的回调begin
    //end

    onDestroy(){
        clearInterval(this.view.intervalID);
        clearTimeout(this.waitId);
        this.view.intervalID = null;
        this.waitId = null
        super.onDestroy();
    }
}