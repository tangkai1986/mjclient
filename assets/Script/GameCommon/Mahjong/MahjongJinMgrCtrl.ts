/*
author: JACKY
日期:2018-01-11 15:29:26
*/

import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import BaseView from "../../Plat/Libs/BaseView";
import BaseModel from "../../Plat/Libs/BaseModel";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";
import { MahjongDef } from "./MahjongDef";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : MahjongJinMgrCtrl;
//模型，数据处理
class Model extends BaseModel{
	jin=null;
	jin2=null;
	jincount = 2;
	mahjongLogic=RoomMgr.getInstance().getLogic();
	mahjongDef=RoomMgr.getInstance().getDef();
	constructor()
	{
		super();
	}
	clear(  )
	{
	}
	recover(  )
	{
		// body
		this.clear(); 
	}
 
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		panel_jin:null,
		jinList:null,
	}; 

	//private node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node; 
		this.initUi(); 
	}
	//初始化ui
	initUi()
	{  
		this.ui.jinList=[];
		this.ui.panel_jin=ctrl.panel_jin;
		this.clear();
		for (let i = 0; i < this.model.jincount; i++) {
			let jinprefab = cc.instantiate(this.ui.panel_jin);
			jinprefab.active = true;
			this.ui.jinList.push(jinprefab);
			this.node.addChild(jinprefab);
		}
 
	}
	recover(  ){
		// body
		this.clear();
		this.initWithJin();
	}
	initWithJin()
	{
		this.node.active=true; 
		let jinValue = null;
		for (let i = 0; i < this.ui.jinList.length; i++) {
			let jinposx =0;
			let jinposy =0;
			if(i==0) {
				jinposx =ctrl.jin1PositionX;
				jinposy =ctrl.jin1PositionY;
				jinValue = this.model.jin;
			}
			else{
				jinposx =ctrl.jin2PositionX;
				jinposy =ctrl.jin2PositionY;
				jinValue = this.model.jin2;
			}
			this.ui.jinList[i].getComponent("MahjongJinCtrl").model.updateJin(jinValue);
			this.ui.jinList[i].getComponent("MahjongJinCtrl").initPosition(jinposx,jinposy);
			this.ui.jinList[i].getComponent("MahjongJinCtrl").view.updateJin();
		}
		if(this.model.jin2 == null || this.model.jin2 == undefined) {
			this.ui.jinList[1].active =false;
		}
	}
	showJinAnim()
	{
		for (let i = 0; i < this.ui.jinList.length; i++) {
			if(i==1 && (this.model.jin2 == null || this.model.jin2 == undefined)) {
				continue;
			}
			this.ui.jinList[i].getComponent("MahjongJinCtrl").showJinAnim(i*-54,0);
		}	
	}
	//清除
	clear()
	{
		// body 
		this.node.active=false; 
	}
}
//c, 控制
@ccclass
export default class MahjongJinMgrCtrl extends BaseCtrl { 

	//这边去声明ui组件
	//麻将资源 
    @property(cc.Node)
	panel_jin=null;
    @property
	jin1PositionX:Number = 0;
    @property
	jin1PositionY:Number = 0;
    @property
	jin2PositionX:Number = 0;
    @property
	jin2PositionY:Number = 0;
     
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离 

	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;  
		this.initMvc(Model,View);
	}

	onDestroy(){   
		super.onDestroy(); 
	}
	//定义网络事件
	defineNetEvents()
	{
        this.n_events={
			//网络消息监听列表             
			onSyncData:this.onSyncData,
			onProcess:this.onProcess,
            'connector.entryHandler.enterRoom':this.connector_entryHandler_enterRoom,
            'room.roomHandler.nextRound':this.room_roomHandler_nextRound,
		}	
	} 
	
	//定义全局事件
	defineGlobalEvents()
	{
		//全局消息
	}
	//绑定操作的回调
	connectUi()
	{  
	}
	start () {     
	}
	onSyncData(  ){
		// body  
		this.model.recover();
		this.view.recover();  
		this.model.jin=this.model.mahjongLogic.getInstance().jin; 
		this.model.jin2=this.model.mahjongLogic.getInstance().jin2;
		if(this.model.jin!=null)
		{
			this.view.initWithJin();
		}
	}
	onProcess(msg){
		if (msg.process==MahjongDef.process_kaijin ){ 
			this.model.jin=msg.jin;
			this.model.jin2=msg.jin2;
			this.view.initWithJin();
			this.view.showJinAnim();
		}
		else if( msg.process==MahjongDef.process_ready){ 
			this.process_ready();
		}
		
	}
	process_ready()
	{
		this.model.clear();
		this.view.clear();
	}
	connector_entryHandler_enterRoom(){
		//每次恢复游戏都是重进房间
		this.model.clear();
		this.view.clear();
	}
	room_roomHandler_nextRound(){
		//再来一局
		this.model.clear();
		this.view.clear();
	}
}
