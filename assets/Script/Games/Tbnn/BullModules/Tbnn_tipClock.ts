/*
author: YOYO
日期:2018-03-12 14:41:26
*/
import BaseView from "../../../Plat/Libs/BaseView";
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import TbnnLogic from "../BullMgr/TbnnLogic";
import TbnnConst from "../BullMgr/TbnnConst";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import GEventDef from "../../../Plat/GameMgrs/GEventDef";
import UserMgr from "../../../Plat/GameMgrs/UserMgr";
import TbnnAudio from"../../../Games/Tbnn/BullMgr/TbnnAudio"
 
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Tbnn_tipClock;
const TipStr = {
    idle:"旁观中",
    waitStart:"等待房主%s开始游戏",
    waitChooseChip:"等待玩家下注",//通比牛牛没有倒计时
    thinking:"查看手牌:%s",
    waitTanpai:"等待玩家摊牌:%s",
    waitRestart:"等待重新开始",
    waitOtherPrepare:"等待玩家准备"
}
//模型，数据处理
class Model extends BaseModel{
	constructor()
	{
		super();
    }
    //获取当前操作需要的等待时间
    getCurWaitTime(){
        return TbnnLogic.getInstance().getCurWaitTime();
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
        let time = this.model.getCurWaitTime();
        if(time > 0){
            this.node.active = true;
            this.countDownStr = curStr;
            this.showCountDown(time);
        }
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
        this.intervalID = setInterval(()=>{
            if(curTime > 0){
                curTime -= 1;
                if(curTime<=3){
                    //播放倒计时音效
                    TbnnAudio.getInstance().playClock("Clock",false);
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
export default class Tbnn_tipClock extends BaseCtrl {
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
        this.n_events = {};
        this.n_events[TbnnConst.clientEvent.onProcess] = this.onProcess;
        this.n_events['onPrepare'] = this.onPrepare;
        this.n_events[TbnnConst.clientEvent.onTanPai] = this.onTanPai;
        this.n_events[TbnnConst.clientEvent.onSyncData] = this.onSyncData;
        this.n_events[TbnnConst.clientEvent.onMidEnter] = this.onMidEnter;
        // this.n_events[TbnnConst.clientEvent.onSettle] = this.onSettle;
        this.n_events['http.reqSettle'] = this.onReqSettle;
        this.n_events['onChangeRoomMaster'] = this.onChangeRoomMaster;
        this.n_events['connector.entryHandler.enterRoom'] = this.onMyEnterRoom;//自己进入的
	}
	//定义全局事件
	defineGlobalEvents()
	{
        this.g_events[GEventDef.bull_giveCardEnd] = this.onGiveCardEnd
        // this.g_events[GEventDef.usersUpdated] = this.usersUpdated
	}
	//绑定操作的回调
	connectUi()
	{
	}
	start () {
        //要判定自己是不是房主
        this.view.setInfo(TipStr.idle);
	}
    //网络事件回调begin
    //当总结算时，隐藏掉提示
    onReqSettle (msg){
        if(RoomMgr.getInstance().isBunchFinish()){
            this.view.hideTipInfo();
        }
    }
    //如果进入下一个操作，则清理倒计时
    onProcess(msg){
        switch(msg.process){
            case TbnnConst.process.start:
                //游戏重新开始
                if(TbnnLogic.getInstance().getIsMyWatcher())return;
                this.view.setInfo(TipStr.waitChooseChip);
                this.waitId = setTimeout(()=>{
                    this.view.hideTipInfo();
                }, 300);
            break
            case TbnnConst.process.giveCards:
                clearTimeout(this.waitId);
                this.waitId = null;
            break
            case TbnnConst.process.settle:
                //游戏结算
                this.view.clearCountDown();
                this.view.setInfo(TipStr.waitOtherPrepare);
            break
        }
    }
    //房主发生了变化
    onChangeRoomMaster(msg){
        if(RoomMgr.getInstance().isFirstRound()){
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
    //有玩家准备
    onPrepare(msg){
        if(msg.seatid == TbnnLogic.getInstance().getMyLogicSeatId()){
            //自己准备, 需要根据自己是否是房主来做显示 test
            let curStr;
            let room = RoomMgr.getInstance();
            if(RoomMgr.getInstance().isFirstRound()){
                let preparemap = room.preparemap;
                let isAllPrepare = true;
                for(let seatId in preparemap){
                    if(!preparemap[seatId]) {
                        isAllPrepare = false;
                        break;
                    }
                }
                if(isAllPrepare){
                    let uid = RoomMgr.getInstance().getRoomOwner();
                    curStr = this.view.formatStr(TipStr.waitStart, UserMgr.getInstance().getUserById(uid).nickname);
                }else{
                    curStr = TipStr.waitOtherPrepare;
                }
            }else{
                curStr = TipStr.waitOtherPrepare;
            }
            this.view.setInfo(curStr);
        }
    }
    //摊牌
    onTanPai(msg){
        if(msg.seatId == TbnnLogic.getInstance().getMyLogicSeatId()){
            this.view.startCountDown(TipStr.waitTanpai);
        }
    }
    //自己进入的
    onMyEnterRoom(msg){
        let room = RoomMgr.getInstance();
        this.view.clearCountDown();
        if(!room.isGameStarted()){
            this.view.setInfo(TipStr.waitOtherPrepare);
        }
    }
    onSyncData(msg){
        if(msg.processType == TbnnConst.process.giveCards){
            let tanpaiInfo = msg.tanpaiDict[RoomMgr.getInstance().getMySeatId()];
            if(tanpaiInfo){
                //已经摊牌
                this.view.startCountDown(TipStr.waitTanpai);
            }else{
                //未摊牌
                this.view.startCountDown(TipStr.thinking);
            }
        }
    }
    //自己是中途加入的
    onMidEnter(msg){
            if (msg.curProcess == TbnnConst.process.giveCards) {
                if(TbnnLogic.getInstance().getIsMyWatcher()){
                    this.view.setInfo(TipStr.idle);
                }
            }
    }
	//end
    //全局事件回调begin
    
    //发牌结束
    onGiveCardEnd(){
        this.view.startCountDown(TipStr.thinking);
    }
    // usersUpdated(){
    //     let room = RoomMgr.getInstance();
    //     let myLogicSeatId = room.getMySeatId();
    //     if(room.preparemap[myLogicSeatId]){
    //         this.view.setInfo(TipStr.waitOtherPrepare);
    //     }
    // }
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