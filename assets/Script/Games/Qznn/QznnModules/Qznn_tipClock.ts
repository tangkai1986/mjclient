/*
author: YOYO
日期:2018-03-12 14:41:26
*/
import BaseView from "../../../Plat/Libs/BaseView";
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import GEventDef from "../../../Plat/GameMgrs/GEventDef";
import UserMgr from "../../../Plat/GameMgrs/UserMgr";
import QznnLogic from "../QznnMgr/QznnLogic";
import QznnConst from "../QznnMgr/QznnConst";
 
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Qznn_tipClock;
const TipStr = {
    idle:"旁观中",
    waitStart:"等待房主%s开始游戏",
    waitChooseChip:"等待玩家下注",//通比牛牛没有倒计时
    thinking:"查看手牌:%s",
    waitTanpai:"等待玩家摊牌:%s",
    waitRestart:"等待重新开始"
}
//模型，数据处理
class Model extends BaseModel{
	constructor()
	{
		super();
    }
    //获取当前操作需要的等待时间
    getCurWaitTime(){
        return QznnLogic.getInstance().getCurWaitTime();
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    private countDownStr:string
	ui={
        //在这里声明ui
        lbl_info:null
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
    }

    //刷新显示的内容
    setInfo (info:string){
        this.node.active = true;
        this.ui.lbl_info.string = info;
    }

    startCountDown (curStr:string = '%s'){
        this.clearCountDown();
        this.node.active = true;
        this.countDownStr = curStr;
        let time = this.model.getCurWaitTime();
        if(time > 0){
            this.showCountDown(time);
        }else ctrl.finish();
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
export default class Qznn_tipClock extends BaseCtrl {
	view:View = null
	model:Model = null
	//这边去声明ui组件
    @property(cc.Label)
    lbl_info:cc.Label = null
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
        this.n_events[QznnConst.clientEvent.onProcess] = this.onProcess;
        this.n_events['onPrepare'] = this.onPrepare;
        this.n_events[QznnConst.clientEvent.onTanPai] = this.onTanPai;
    }
	//定义全局事件
	defineGlobalEvents()
	{
        this.g_events = {};
        this.g_events[GEventDef.bull_giveCardEnd] = this.onGiveCardEnd
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

    //如果进入下一个操作，则清理倒计时
    onProcess(msg){
        switch(msg.process){
            case QznnConst.process.start:
                //游戏重新开始
                this.view.setInfo(TipStr.waitChooseChip);
                this.waitId = setTimeout(()=>{
                    this.view.hideTipInfo();
                }, 300);
            break
            case QznnConst.process.giveCards:
                clearTimeout(this.waitId);
                this.waitId = null;
            break
            case QznnConst.process.settle:
                //游戏结算
                this.view.clearCountDown();
                this.view.setInfo(TipStr.waitRestart);
            break
        }
    }
    //有玩家准备
    onPrepare(msg){
        if(msg.seatid == QznnLogic.getInstance().getMyLogicSeatId()){
            //自己准备, 需要根据自己是否是房主来做显示 test
            let uid = RoomMgr.getInstance().getRoomOwner();
            let curStr = this.view.formatStr(TipStr.waitStart, UserMgr.getInstance().getUserById(uid).nickname);
            this.view.setInfo(curStr);
        }
    }
    //摊牌
    onTanPai(msg){
        if(msg.seatId == QznnLogic.getInstance().getMyLogicSeatId()){
            this.view.startCountDown(TipStr.waitTanpai);
        }
    }
    
	//end
    //全局事件回调begin
    
    //发牌结束
    onGiveCardEnd(){
        let time = QznnLogic.getInstance().getCurWaitTime();
        this.view.startCountDown(TipStr.thinking);
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