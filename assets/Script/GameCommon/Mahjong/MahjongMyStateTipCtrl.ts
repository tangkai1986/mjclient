



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
let ctrl : MahjongMyStateTipCtrl;
//模型，数据处理
class Model extends BaseModel{
	seatid=0;//视图座位 
	logicseatid=null;//逻辑座位，服务器那边的座位
    mySeatId=null;
	myself=null; 
	mahjongResMgr=RoomMgr.getInstance().getResMgr();
	mahjongLogic=RoomMgr.getInstance().getLogic();
	mahjongDef=RoomMgr.getInstance().getDef();
	mahjongAudio=RoomMgr.getInstance().getAudio();
	mahjongCards=this.mahjongLogic.getInstance().getMahjongCards();	
	constructor()
	{
		super();
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
		this.mySeatId=RoomMgr.getInstance().getMySeatId();
		this.myself=this.mahjongLogic.getInstance().players[this.logicseatid];  
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
		panel_tip:null,
		lbl_tip:null,
		panel_youjinzhong:null,
		panel_shuangyouzhong:null,
		img_readyyoujin:null,
		img_readyshuangyou:null,
		panel_genzhuang:null,
		lbl_genzhuangtip:null,
		img_guo:null,
		panel_sanyouzhong:null,
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
		this.ui.panel_tip=ctrl.panel_tip;
		this.ui.lbl_tip=ctrl.lbl_tip;
		this.ui.panel_youjinzhong=ctrl.panel_youjinzhong;
		this.ui.panel_shuangyouzhong=ctrl.panel_shuangyouzhong;
		this.ui.img_readyyoujin=ctrl.img_readyyoujin;
		this.ui.img_readyshuangyou=ctrl.img_readyshuangyou;
		this.ui.panel_genzhuang=ctrl.panel_genzhuang;
		this.ui.lbl_genzhuangtip=ctrl.lbl_genzhuangtip;
		this.ui.img_guo = ctrl.img_guo;
		this.ui.panel_sanyouzhong = ctrl.panel_sanyouzhong;
		if(this.model.mahjongCards.getCardCount()==13){
			this.ui.panel_tip.setPositionY(-25);
			this.ui.panel_youjinzhong.setPositionY(-100);
			this.ui.panel_shuangyouzhong.setPositionY(-100);
			this.ui.panel_sanyouzhong.setPositionY(-100);
			this.ui.panel_genzhuang.setPositionY(-25);
		}
		this.clear();
	}
 
 
	//清除
	clear( )
	{ 
		////console.log("全部隐藏了")
		this.ui.panel_tip.active=false;
		this.ui.panel_youjinzhong.active=false;
		this.ui.panel_shuangyouzhong.active=false;
		this.ui.img_readyyoujin.active=false;
		this.ui.img_readyshuangyou.active=false;
		this.ui.panel_genzhuang.active=false;
		this.ui.img_guo.active=false;
		this.ui.panel_sanyouzhong.active=false;
	} 
	showOtherShuangYou(){
		this.ui.panel_genzhuang.active=true;
		this.ui.panel_genzhuang.getComponent(cc.Animation).playOnLoad=false;
		this.ui.lbl_genzhuangtip.string='有人要双游了,请摸最后一张牌'
	}
	showOtherDanYou(){
		this.ui.panel_genzhuang.active=true;
		this.ui.panel_genzhuang.getComponent(cc.Animation).playOnLoad=false;
		this.ui.lbl_genzhuangtip.string='有人要单游了,请摸最后一张牌'
	}
    showShuangYouZhong(){
		this.ui.panel_shuangyouzhong.active=true;
	}
    showSanYouZhong(){
		this.ui.panel_sanyouzhong.active=true;
	}
	showDanYouZhong(){
		this.ui.panel_youjinzhong.active=true;
	}
	showReadyYouJing(){
		this.ui.img_readyyoujin.active=true;
		this.ui.img_readyyoujin.getChildByName('effect').getComponent('cc.Animation').on('finished', this.onReadyYoujinFinished, this);
	}
	onReadyYoujinFinished(){
		this.ui.img_readyyoujin.getChildByName('effect_xh').getComponent('cc.Animation').play();
	}
	showReadyShuangYou(){
		this.ui.img_readyshuangyou.active=true;
		this.ui.img_readyshuangyou.getChildByName('effect').getComponent('cc.Animation').on('finished', this.onReadyShuangyouFinished, this);
	}
	onReadyShuangyouFinished(){
		this.ui.img_readyshuangyou.getChildByName('effect_xh').getComponent('cc.Animation').play();
	}
	showQingChuPai(){
		this.ui.panel_tip.active=true; 
		this.ui.lbl_tip.string='轮到你打牌了'
	}
	showGuo(){
		this.ui.img_guo.active=true;
	}
	showGenZhuang(data)
	{
		this.ui.panel_genzhuang.active=true;
		let showStr = "";
		let difan = data.shui*data.count;
		////console.log("showGenZhuang",data);
		
		if(data.count == 1) {
			showStr = `${data.count}跟庄,庄家赔付其他三家各${difan}底`;
		}
		else
		{
			showStr = `${data.count}连跟庄,庄家赔付其他三家各${difan}底`;
		}
		if(this.model.mahjongCards.getCardCount()==13) {
			showStr = `${data.count}分饼：庄家赔付闲家每位${data.score}分`;
		}
		this.ui.lbl_genzhuangtip.string = showStr;
		this.ui.panel_genzhuang.getComponent(cc.Animation).play();
	}
	vibratePhone()
	{        
		if (cc.sys.isNative)
            G_PLATFORM.moblieVibrator();
	}
}
//c, 控制
@ccclass
export default class MahjongMyStateTipCtrl extends BaseCtrl {
	//这边去声明ui组件

	@property({
		tooltip : "其他人游金",
		type : cc.Node
	})
	panel_tip : cc.Node = null;

	
	@property({
		tooltip : "准备单游",
		type : cc.Node
	})
	img_readyyoujin : cc.Node = null;

	
	@property({
		tooltip : "准备双游",
		type : cc.Node
	})
	img_readyshuangyou : cc.Node = null;

	@property({
		tooltip : "游金提示文字",
		type : cc.Label
	})
	lbl_tip : cc.Label = null;
  
	@property({
		tooltip : "准备游金",
		type : cc.Node
	})
	panel_youjinzhong : cc.Node = null;
	@property({
		tooltip : "准备双游",
		type : cc.Node
	})
	panel_shuangyouzhong : cc.Node = null;
	@property({
		tooltip : "准备三游",
		type : cc.Node
	})
	panel_sanyouzhong : cc.Node = null;
	@property({
		tooltip : "跟庄提示文字",
		type : cc.Label
	})
	lbl_genzhuangtip : cc.Label = null;
	@property({
		tooltip : "跟庄",
		type : cc.Node
	})
	panel_genzhuang : cc.Node = null;
	
	@property({
		tooltip : "过",
		type : cc.Node
	})
	img_guo : cc.Node = null;
  
	timer_delay=null;//延迟提示清出牌定时器
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
		this.usersUpdated();
		this.onSyncData();
	}
    onDestroy(){
		this.clearLaterChuPaiTimer();
		super.onDestroy();
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
			onSeatChange:this.onSeatChange,
			onEvent:this.onEvent,  
			onGameFinished:this.onGameFinished,
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
	//绑定操作的回调
	connectUi()
	{ 
     
	}
	onSeatChange(msg)
	{ 
		if(this.model.logicseatid==null)
		{
			return;
		}
		this.clearLaterChuPaiTimer(); 
		if (this.model.mySeatId != this.model.mahjongLogic.getInstance().curseat)
		{
			return;
		}
		if(msg.needpass!=null)
		{
			////console.log("进入全局什么游了",this.model.mahjongLogic.getInstance().isShuangYou(),this.model.mahjongLogic.getInstance().isDanYou())
			if(this.model.mahjongLogic.getInstance().isShuangYou()&&this.model.mahjongCards.getCardCount()!=13){
				this.view.clear();
				this.view.showOtherShuangYou();
				this.view.showGuo();
			}
			else if(this.model.mahjongLogic.getInstance().isDanYou()){
				this.view.clear();
				this.view.showOtherDanYou();
				this.view.showGuo();
			}
		}
	}
	onOp(msg)
	{
		if(this.model.logicseatid==null)
		{
			return;
		}
		this.clearLaterChuPaiTimer();
		if (msg.opseatid!=this.model.logicseatid ){
			if(msg.genzhuang) {
				////console.log("showGenZhuang1",msg);
				
				this.view.showGenZhuang(msg.genzhuang);
			}
			return
		}  
		let op=MahjongDef.op_cfg[msg.event]
		switch(op)
		{
			case MahjongDef.op_chupai:
				this.op_chupai(msg) 
			break; 
			case MahjongDef.op_gaipai:
				this.op_gapai(msg) 
			break; 
			case MahjongDef.op_danyou:
			case MahjongDef.op_shuangyou:
			case MahjongDef.op_sanyou:
				this.view.clear();
			break;
		} 
	}
	op_chupai(msg){
		if(this.model.logicseatid==null)
		{
			return;
		}
		this.view.clear();
		if(msg.genzhuang) {
			this.view.showGenZhuang(msg.genzhuang);
		}
 
		switch(msg.youjinstate)
		{ 
			case MahjongDef.youjinstate_sanyou:  
				this.view.showSanYouZhong();
			break;
			case MahjongDef.youjinstate_shuangyou:  
				this.view.showShuangYouZhong();
			break;
			case MahjongDef.youjinstate_danyou:  
				this.view.showDanYouZhong();
			break; 
		} 

	}
	onGameFinished(){
		this.view.clear();
	}
	clearLaterChuPaiTimer(){
		if(this.timer_delay!=null){
			clearTimeout(this.timer_delay);
			this.timer_delay=null;
		} 
	}
	timeout(){
		this.view.showQingChuPai();
		this.view.vibratePhone();
	}
	//延迟显示清出牌
	laterShowQingChuPai(){
		
		this.timer_delay=setTimeout(this.timeout.bind(this),10000)
	}
	onEvent(msg)
	{ 
		if(this.model.logicseatid==null)
		{
			return;
		} 
		this.clearLaterChuPaiTimer(); 
		//轮到我自己要求我盖牌或出牌
		////console.log("this.model.myself.state=",this.model.myself.state)
		switch(this.model.myself.state)
		{
			case MahjongDef.state_chupai: 
				this.view.clear(); 
				this.laterShowQingChuPai();
			break;
			case MahjongDef.state_gaipai:
				//盖牌的话说明是游金或双游中 
				if(this.model.myself.readyForShuangYou())
				{
					this.view.clear();
					this.view.showReadyShuangYou();//准备双游
				}else if(this.model.myself.readyForDanYou())
				{
					this.view.clear();
					this.view.showReadyYouJing();//准备游金
				} 
			break; 
		} 
	}
	op_gapai(msg){
		if(msg.opseatid!=this.model.logicseatid)
			return ;
		//表示盖牌
		if(this.model.mahjongLogic.getInstance().bSanYou){
			this.view.clear();
			this.view.showSanYouZhong();
		}
		else if(this.model.mahjongLogic.getInstance().isShuangYou()){
			this.view.clear();
			this.view.showShuangYouZhong();
		}
		else if(this.model.mahjongLogic.getInstance().isDanYou()){
			this.view.clear();
			this.view.showDanYouZhong();
		}	
	}
	start () {
	}
	//网络事件回调begin
    onEnterRoom(){

    }
    onLeaveRoom(){

    }
	onSyncData()
	{
		this.model.updateLogicId();
		if(this.model.logicseatid==null)
			return;
		// body为什么这这样设计 
		this.model.recover(); 
		this.onEvent(null);//同步数据		 
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