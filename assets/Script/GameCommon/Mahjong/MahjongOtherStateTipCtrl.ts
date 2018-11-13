 



/*
author: JACKY
日期:2018-01-11 18:49:15
*/  
 

import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import BaseView from "../../Plat/Libs/BaseView";
import BaseModel from "../../Plat/Libs/BaseModel";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";  
import { MahjongDef } from "./MahjongDef";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : MahjongOtherStateTipCtrl;
//模型，数据处理
class Model extends BaseModel{
	seatid=null;//视图座位 
	logicseatid=null;//逻辑座位，服务器那边的座位
 
	player=null; 
	mahjongResMgr=RoomMgr.getInstance().getResMgr();
	mahjongLogic=RoomMgr.getInstance().getLogic();
	mahjongDef=RoomMgr.getInstance().getDef();
	mahjongAudio=RoomMgr.getInstance().getAudio();
	mahjongCards=this.mahjongLogic.getInstance().getMahjongCards();	
	constructor()
	{
		super();
	}
  
	initSeat(id)
	{
		this.seatid=id;  
	}
    //找到屏幕拥有者的逻辑坐标  
	clear(  )
	{
		// body 
	}
 
	updateLogicId(  )
	{
		// body
		this.logicseatid=RoomMgr.getInstance().getLogicSeatId(this.seatid); 
		if(this.logicseatid==null)
			return;
		this.player=this.mahjongLogic.getInstance().players[this.logicseatid];  
	}  
	recover()
	{ 
		this.updateLogicId();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui 
		img_readyyoujin:ctrl.img_readyyoujin,
		img_readyshuangyou:ctrl.img_readyshuangyou,
		img_guo:ctrl.img_guo,
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node; 
		this.initUi();
	}
	//初始化ui
	initUi()
	{ 
   
		this.clear();
	}
 
 
	//清除
	clear( )
	{
		this.ui.img_readyyoujin.active=false;
		this.ui.img_readyshuangyou.active=false;
		this.ui.img_guo.active=false;
 
	} 
	showShuangYou(){
		this.ui.img_readyshuangyou.active=true;
		this.ui.img_readyshuangyou.getChildByName('effect').getComponent('cc.Animation').on('finished', this.onReadyShuangyouFinished, this);
	}
	onReadyShuangyouFinished(){
		this.ui.img_readyshuangyou.getChildByName('effect_xh').getComponent('cc.Animation').play();
	}
	showDanYou(){
		////console.log("显示单游")
		this.ui.img_readyyoujin.active=true;
		this.ui.img_readyyoujin.getChildByName('effect').getComponent('cc.Animation').on('finished', this.onReadyYoujinFinished, this);
	}
	onReadyYoujinFinished(){
		this.ui.img_readyyoujin.getChildByName('effect_xh').getComponent('cc.Animation').play();
	}
	showGuo(){
		this.ui.img_guo.active=true;
	}
}
//c, 控制
@ccclass
export default class MahjongOtherStateTipCtrl extends BaseCtrl {
	//这边去声明ui组件

	@property({
		tooltip : "准备游金",
		type : cc.Node
	})
	img_readyyoujin : cc.Node = null;


	@property({
		tooltip : "准备双游",
		type : cc.Node
	})
	img_readyshuangyou : cc.Node = null;

	@property({
		tooltip : "过的图片",
		type : cc.Node
	})
	img_guo : cc.Node = null;
    @property
	seatId:Number = 0;
	
	timer_delay=null;
    // @property(cc.Node)
	// huatong = null;
	// @property(cc.Node)
    // yinliang = null;    
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		this.initMvc(Model,View); 
		this.model.initSeat(this.seatId);
		this.usersUpdated();
		this.onSyncData();
	}
    onDestroy(){
		this.clearTimer();
		super.onDestroy();
	}
	clearTimer(){
		if(this.timer_delay!=null){
			clearTimeout(this.timer_delay);
			this.timer_delay=null;
		}
	}
	//定义网络事件
	defineNetEvents()
	{
        this.n_events={
			//网络消息监听列表
			'onEnterRoom':this.onEnterRoom,
			'onLeaveRoom':this.onLeaveRoom,
			onSyncData:this.onSyncData, 
			onProcess:this.onProcess, 
			onOp:this.onOp,  
            'onGameFinished':this.onGameFinished, 
			onSeatChange:this.onSeatChange,
        } 
	}
 
	//定义全局事件
	defineGlobalEvents()
	{  
		//全局消息
		this.g_events={ 
			'usersUpdated':this.usersUpdated,   
		}		  
	}
	onGameFinished(){
		this.view.clear();
	}
	onSeatChange(msg)
	{
		if (this.model.logicseatid != this.model.mahjongLogic.getInstance().curseat){  
			return;
		}
		if(msg.needpass!=null)
		{
			this.view.showGuo();
		}
	}
	//这个现在用不到，要具体和策划商量需求
	timeout(){
		this.view.showGuo();
	}
	//这个现在用不到，要具体和策划商量需求
	delayShowGuo(){ 
		this.timer_delay=setTimeout(this.timeout.bind(this),1)
	}
	//绑定操作的回调
	connectUi()
	{ 
     
	}
	start () {
	}
	//网络事件回调begin
    onEnterRoom(){
    }
    onLeaveRoom(){
		this.model.clear();
		this.view.clear();
    }
	onSyncData()
	{
		this.model.initSeat(this.seatId);
		this.model.updateLogicId();
		if(this.model.logicseatid==null)
			return;
		// body为什么这这样设计 
		this.model.recover(); 
	} 
	onOp(msg){
		if (msg.opseatid!=this.model.logicseatid ){ 
			return
		}  
		let op=MahjongDef.op_cfg[msg.event]
		switch(op)
		{
			case MahjongDef.op_gaipai: 
				this.op_gaipai(msg) 
			break; 
			case MahjongDef.op_danyou:
			case MahjongDef.op_shuangyou:
			case MahjongDef.op_sanyou:
				this.view.clear();
			break;
			case MahjongDef.op_chupai:
				this.view.clear();
				this.op_chupai(msg);
			break; 
		} 
	}

	op_chupai(msg)
	{  
		//其他人看到你是显示准备双游
		if(this.model.mahjongLogic.getInstance().isShuangYou()&&this.model.mahjongCards.getCardCount()!=13)
		{
			this.view.clear();
			////console.log("othter准备双游")
			this.view.showShuangYou();
		} 
	}

	op_gaipai(msg)
	{ 
		////console.log("其他人盖牌了")
		if(this.model.mahjongLogic.getInstance().isShuangYou()&&this.model.mahjongCards.getCardCount()!=13)
		{
			this.view.clear();
			////console.log("othter准备双游")
			this.view.showShuangYou();
		}
		else if(this.model.mahjongLogic.getInstance().isDanYou())
		{ 
			this.view.clear();
			////console.log("othter准备单游")
			this.view.showDanYou();
		}
	}
	onProcess(msg)
	{ 
		if(this.model.logicseatid==null)
			return
	    
 
	} 
 
 
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
	

 
	usersUpdated(  ){
	    // body  
        this.model.clear();
        this.view.clear();
        this.model.updateLogicId();  
	}
 
 
}