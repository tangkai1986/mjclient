/*
author: YOYO
日期:2018-03-23 15:00:54
*/
import BullPosMgr from "./BullPosMgr";
import GEventDef from "../../Plat/GameMgrs/GEventDef";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";
import BaseModel from "../../Plat/Libs/BaseModel";
import BaseView from "../../Plat/Libs/BaseView";
import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import GameAudioCfg from "../../Plat/CfgMgrs/GameAudioCfg";

//MVC模块,
const {ccclass, property} = cc._decorator;
const CONFIGS = {
    resultGoldUpH:100,
    failFontSize:25,
    winFontSize:30
}
let ctrl : Bull_resultGoldCtrl;
let BullConst;
//模型，数据处理
class Model extends BaseModel{
    flyH:number
	constructor(){
		super();
        BullConst = RoomMgr.getInstance().getDef();

        let seatH = BullPosMgr.getInstance().getSeatH();
        this.flyH = seatH + CONFIGS.winFontSize/2;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    private dict_resultLbl                          //所有的结果显示label
	ui={
        //在这里声明ui
        font_winNumber:null,
        font_loseNumber:null,
        spriteframe_WinNunberbg:null,
        spriteframe_LoseNunberbg:null,
	};
    node=null;
    model:Model
	constructor(model){
		super(model);
		this.node=ctrl.node;
        this.initUi();
        this.dict_resultLbl = {};
	}
	//初始化ui
	initUi()
	{
        this.ui.font_winNumber = ctrl.font_winNumber;
        this.ui.font_loseNumber = ctrl.font_loseNumber;
        this.ui.spriteframe_WinNunberbg = ctrl.spriteframe_WinNunberbg;
        this.ui.spriteframe_LoseNunberbg  =ctrl.spriteframe_LoseNunberbg;
    }

    //根据位置显示结算后的金币
    showOneResultGold(viewSeatId:number, value){
        let bgNode = this.getOneResultLbl(viewSeatId,value);
        if(bgNode){
            value = parseInt(value);
            let targetNode = bgNode.children[0];
            let curLbl:cc.Label = targetNode.getComponent(cc.Label);
            curLbl['spacingX'] = 6;
            let spriteComp = bgNode.getComponent(cc.Sprite);
            if (value > 0) {
                value = '+' + value;
                curLbl.font = this.ui.font_winNumber;
                curLbl.fontSize = CONFIGS.winFontSize;
                spriteComp.spriteFrame = this.ui.spriteframe_WinNunberbg;
            }else{
                //通比牛牛只有正负，没有0.. 这里是负数
                curLbl.font = this.ui.font_loseNumber;
                curLbl.fontSize = CONFIGS.failFontSize;
                spriteComp.spriteFrame = this.ui.spriteframe_LoseNunberbg;
            }
            curLbl.string = value;
            this.playResultGoldAni(bgNode);
        }
    }
    //隐藏所有
    hideAll (){
        this.node.stopAllActions();
        let curNode:cc.Node;
        for(let viewSeatId in this.dict_resultLbl){
            curNode = this.dict_resultLbl[viewSeatId];
            curNode.stopAllActions();
            curNode.active = false;
        }
    }
    
    private getOneResultLbl (viewSeatId,value){
        let bgNode = this.dict_resultLbl[viewSeatId];
        if(!bgNode){
            bgNode = new cc.Node();
            bgNode.parent = this.node;

            // let spriteFrame;
            // value>0?spriteFrame = this.ui.spriteframe_WinNunberbg:spriteFrame = this.ui.spriteframe_LoseNunberbg;
            bgNode.addComponent(cc.Sprite);

            bgNode.position = BullPosMgr.getInstance().getSeatPos(viewSeatId);
            bgNode.y -= this.model.flyH/2;

            let lblNode = new cc.Node();
            lblNode.parent = bgNode;
            lblNode.addComponent(cc.Label).string = '';
            this.dict_resultLbl[viewSeatId] = bgNode;
        }
        return bgNode;
    }
    //播放金币结果的特效
    private playResultGoldAni(bgNode:cc.Node){
        bgNode.active = true;
        if(!bgNode['_initPosY']) bgNode['_initPosY'] = bgNode.y;
        else bgNode.y = bgNode['_initPosY'];
        bgNode.scale = 0.2;

        let time1 = 0.5;
        let targetY = bgNode.y + this.model.flyH;
        let WinH = cc.director.getVisibleSize().height;
        targetY += targetY>=WinH/2 ? -CONFIGS.winFontSize : 0;
        let act1 = cc.moveTo(time1, bgNode.x, targetY);
        let act2 = cc.scaleTo(time1, 1);
        // let act3 = cc.delayTime(time1+1.5);
        // let act4 = cc.callFunc(function(){
        //     curNode.active = false;
        // }, this);
        bgNode.runAction(cc.spawn(act1, act2));
        // curNode.runAction(cc.sequence(act3, act4));
    }
}
//c, 控制
@ccclass
export default class Bull_resultGoldCtrl extends BaseCtrl {
	view:View = null
	model:Model = null
	//这边去声明ui组件
    @property({
        type:cc.Font,
        tooltip:'赢数字'
    })
    font_winNumber :cc.Font = null;
    @property({
        type:cc.Font,
        tooltip:'输数字'
    })
    font_loseNumber :cc.Font = null;
    @property({
        type:cc.SpriteFrame,
        tooltip:'赢背景'
    })
    spriteframe_WinNunberbg :cc.Font = null;
    @property({
        type:cc.SpriteFrame,
        tooltip:'输背景'
    })
    spriteframe_LoseNunberbg :cc.Font = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


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
        this.n_events['onPrepare'] = this.onPrepare;
        this.n_events[BullConst.clientEvent.onSettle] = this.onSettle_bull;
        this.n_events[BullConst.clientEvent.onSyncData] = this.onSyncData;
        this.n_events[BullConst.clientEvent.onProcess] = this.onProcess;
	}
	//定义全局事件
	defineGlobalEvents()
	{
        this.g_events[GEventDef.usersUpdated] = this.usersUpdated
	}
	//绑定操作的回调
	connectUi()
	{
	}
	start () {
	}
    //网络事件回调begin
    
    /*结算
    winSeatId:null,                     //胜利的座位id
            scoreInfo:null,                     //胜利的相关信息（输赢分值）{}
            servertime_now:null,                //服务器时间(客户端同步时间并计算间隔)
            servertime_next:null,               //服务器时间(客户端同步时间并计算间隔)
    scoreInfo = {1:10}
    dict_notTanPai
    */
   onSettle_bull(msg){
        //显示金币获取结果
        let resultList = [];
        for(let logicId in msg.scoreInfo){
            resultList.push({
                viewSeatId:RoomMgr.getInstance().getViewSeatId(logicId),
                goldValue: msg.scoreInfo[logicId]
            })
        }
        ////console.log('显示结算金币信息', resultList)
        let cb = function(){
            this.showGoldsResult(resultList);
        }
        let seq = cc.sequence(cc.delayTime(2),cc.callFunc(cb,this));
        this.node.runAction(seq);
    }
    //有人准备
    onPrepare(msg){
        if(msg.seatid == RoomMgr.getInstance().getMySeatId()){
            this.view.hideAll();
        }
    }
    usersUpdated(){
        this.view.hideAll();
    }
    onSyncData(){
        this.view.hideAll();
    }
    //进程管理
    onProcess(msg){
        if(msg.process == BullConst.process.start){
            this.view.hideAll();
        }
    }

	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
    //end
    
    //显示金币结果数值信息(+积分 -积分)
    showGoldsResult(dataList){
        let i,
            data;
        for(i = 0; i < dataList.length; i ++){
            data = dataList[i];
            this.view.showOneResultGold(data.viewSeatId, data.goldValue);
        }
    }
}