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
let ctrl : MahjongJinCtrl;
//模型，数据处理
class Model extends BaseModel{
	jin=null;
	mahjongResMgr=RoomMgr.getInstance().getResMgr();
	mahjongAudio=RoomMgr.getInstance().getAudio();
	constructor()
	{
		super();
	}
	clear(  )
	{
	}
	updateJin(jinValue)
	{
		this.jin = jinValue;
	}
 
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		panel_jin:null,
		// kaijinEffect:null,
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
		this.ui.panel_jin=ctrl.panel_jin;
		// this.ui.kaijinEffect=ctrl.panel_jin.getChildByName("kaijin_anim").getComponent(cc.Animation);
		this.clear();
 
	}
	//清除
	clear()
	{
		// body 
		this.ui.panel_jin.active=false; 
	}
	//显示金
	updateJin(){
		// // body 
		this.ui.panel_jin.active=true; 
		var sign=this.ui.panel_jin.getChildByName('sign');    
		sign.getComponent(cc.Sprite).spriteFrame = this.model.mahjongResMgr.getInstance().getCardSpriteFrame(this.model.jin); 
	}

	initPosition(x,y)
	{
		this.ui.panel_jin.setPosition(cc.v2(x,y));
	}
}
//c, 控制
@ccclass
export default class MahjongJinCtrl extends BaseCtrl { 

	//这边去声明ui组件
	//麻将资源 
    @property(cc.Node)
	panel_jin=null;
    posX = 0;
    posY = 0;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离 
    timer=null;
	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;  
		this.initMvc(Model,View);
	}
	clearTimer(){
		if(null==this.timer)
		{
			return;
		}
		clearTimeout(this.timer)
		this.timer=null;
	}
	onDestroy(){   
		this.clearTimer();
		super.onDestroy(); 
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
	initPosition(x,y)
	{
		this.posX = x;
		this.posY = y;
		this.view.initPosition(x,y);
	}
	showJinAnim(x,y)
	{ 
		this.ui.panel_jin.active=false;
		let jinOriginPos = this.ui.panel_jin.getPosition();
		this.ui.panel_jin.setPosition(cc.v2(x,y)); 
		this.clearTimer();
        this.timer=setTimeout( ()=>{
			this.ui.panel_jin.active=true;
			// this.ui.kaijinEffect.play();
			this.ui.panel_jin.runAction(cc.sequence(cc.delayTime(0.3),cc.moveTo(0.20,jinOriginPos),cc.callFunc(()=>{this.model.mahjongAudio.getInstance().playDown()})));		
		},300)		
	}
}
