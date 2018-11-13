/*
author: JACKY
日期:2018-01-12 16:27:16
*/



import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import BaseView from "../../Plat/Libs/BaseView";
import BaseModel from "../../Plat/Libs/BaseModel";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";  
import { MahjongGeneral } from "./MahjongGeneral";
import { MahjongDef } from "./MahjongDef";

     

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : QzmjHandCardCtrl;
let Green = new cc.Color(24,221,40),Red = new cc.Color(255,78,0), Yellow = new cc.Color(255,222,0),White = new cc.Color(255,255,255);
//模型，数据处理
class Model extends BaseModel{
	logicseatid=null;
	seatid=null;
	player=null;
	offset=0;//麻将起始位置偏移 
	jinRed = 255;
	jinGreen = 255;
	jinBlue = 255;
	jinColor = White;


	mahjongResMgr=RoomMgr.getInstance().getResMgr();
	mahjongLogic=RoomMgr.getInstance().getLogic();
	mahjongDef=RoomMgr.getInstance().getDef();
	mahjongAudio=RoomMgr.getInstance().getAudio();	
	mahjongCards=this.mahjongLogic.getInstance().getMahjongCards();	
	constructor()
	{
		super();
		//在这里定义视图和控制器数据 
		this.logicseatid=null;
		this.clear();

	} 
	updateOffset(){
		this.offset=this.player.opcards.length*3;
	}
	initSeat(seatid)
	{
		this.seatid=seatid; 
	} 
 
	updateLogicId(  ){
		// body 
		this.logicseatid=RoomMgr.getInstance().getLogicSeatId(this.seatid);  
		if(this.logicseatid==null)
			return;
		this.player=this.mahjongLogic.getInstance().players[this.logicseatid];  
	} 

    recover(  ){
		// body
		this.clear();
		this.updateLogicId();
		//this.player=this.mahjongLogic.getInstance().players[this.logicseatid];  
	} 
	clear()
	{ 
		this.offset=0;
	}
	setJinColor(colorR,colorG,colorB)
	{
		this.jinRed = colorR;
		this.jinGreen = colorG;
		this.jinBlue = colorB;
		this.jinColor = new cc.Color(this.jinRed,this.jinGreen,this.jinBlue)
	}
 
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui  
		cards_laydown:null,
		cards_stand:null,
		cards_layup:null,
		standcards:null,
		layupcards:null,
		laydowncards:null,
		fapaigroup:[],
	};    
	constructor(model){
		super(model);
		this.node=ctrl.node; 
		this.initUi();
	}
	//初始化ui
	initUi()
	{  
		this.ui.cards_laydown=this.node.getChildByName('cards_laydown')
		this.ui.cards_stand=this.node.getChildByName('cards_stand')
		this.ui.cards_layup=this.node.getChildByName('cards_layup')
		this.ui.standcards=[]; 
		this.ui.layupcards=[];  
		this.ui.laydowncards=[];  
		for(let i = 0;i<this.model.mahjongCards.getCardCount()+1;++i)
		{  
			let standcard=this.ui.cards_stand.getChildByName(`card_${i}`)
			this.ui.standcards.push(standcard);
			let layupcard=this.ui.cards_layup.getChildByName(`card_${i}`)
			this.ui.layupcards.push(layupcard);
			let laydowncard=this.ui.cards_laydown.getChildByName(`card_${i}`)
			this.ui.laydowncards.push(laydowncard);
		}  
		this.clear();
	} 
	//恢复游戏
	recover(  )
	{
		// body
		this.clear();  
		this.updateCards();
	} 
	updateCards(){ 
		//录像
		if(RoomMgr.getInstance().getVideoMode())
		{
			this.updateVideoCards();
		}
		else
		{
			this.updateHandCards();
		}
	}   
	updateVideoCards(){
		for (let i = 0;i<this.model.offset;++i){  
			var card = this.ui.layupcards[i];
			card.active=false;
		}
		for (let i = this.model.offset;i<this.ui.layupcards.length;++i){
			let card = this.ui.layupcards[i];
			let cardIndex=i-this.model.offset
			let value=this.model.player.handcard[i-this.model.offset]; 
			if (value !=null && value !=undefined){
                var sign=card.getChildByName('sign');
                sign.active = true;
                sign.getComponent(cc.Sprite).spriteFrame = this.model.mahjongResMgr.getInstance().getCardSpriteFrame(value); 
				card.active=true;
			}
			else
			{
				card.active=false;
			}
			card.getChildByName('jin').active = value?false:true;
			if(value==0) {
				card.getChildByName('majingBg').color=new cc.Color(234,219,151);
			}
			else
			{
				card.getChildByName('majingBg').color=White;
			}
		}	
	}
	clear(){ 
		this.ui.fapaigroup=[];
		for(let i = 0;i<this.model.mahjongCards.getCardCount()+1;++i)
		{
			this.ui.standcards[i].active=false;
			this.ui.layupcards[i].active=false;
			this.ui.laydowncards[i].active=false;
		}
		if(!RoomMgr.getInstance().getVideoMode())
		{  
			this.ui.cards_layup.active=false;
			this.ui.cards_laydown.active=false;
		} 
	}  
	initFaPai(){
		//录像模式下牌要亮着
		if(RoomMgr.getInstance().getVideoMode())
		{		 
			this.ui.cards_layup.active=true;
			this.ui.cards_stand.active=false;
			for (let i=0;i<this.ui.layupcards.length;++i){
				let card=this.ui.layupcards[i]; 
				card.active= false;
			}  	 
			for(let i = 0;i<5;++i)
			{
				let count=4;
				let group=[];
				for(let j = 0;j<count;++j)
				{
					let index=i*count+j;
					let card=this.ui.layupcards[index];  
					if(index<this.model.player.handcard.length)
					{ 
						group.push(card); 
					}
				}
				this.ui.fapaigroup.push(group);
			} 
			//重置金的显示
			for (let i = 0;i<this.ui.layupcards.length;++i){
				let card = this.ui.layupcards[i];   
				card.getChildByName('jin').active = false; 
				card.getChildByName('majingBg').color=White; 
			}			
			for (let i = 0;i<this.ui.layupcards.length;++i){
				let card = this.ui.layupcards[i];
				let pos=card.position; 
				card.position=cc.p(pos.x,0);  
				let value=this.model.player.handcard[i]; 
				if (value !=null && value !=undefined){
					let sign=card.getChildByName('sign');
					sign.active = true;
					sign.getComponent(cc.Sprite).spriteFrame = this.model.mahjongResMgr.getInstance().getCardSpriteFrame(value); 
				} 
			}			 

		}
		else
		{
			for (let i=0;i<this.ui.standcards.length;++i){
				let card=this.ui.standcards[i]; 
				card.active= false;
			}  	 
			for(let i = 0;i<5;++i)
			{
				let count=4;
				let group=[];
				for(let j = 0;j<count;++j)
				{
					let index=i*count+j;
					let card=this.ui.standcards[index];  
					if(index<this.model.player.handcard.length)
					{
						this.ui.laydowncards[index].active=true;
						group.push(card); 
					}
				}
				this.ui.fapaigroup.push(group);
			} 
		}
	}
	stepFaPai(step){
		let group=this.ui.fapaigroup[step];
		if(group && group.hasOwnProperty('length')) {
			for(let i = 0;i<group.length;++i)
			{
				let card=group[i]; 
				card.active=true; 
			} 
		}
	}
	updateHandCards(  ){
		for (let i=0;i<this.model.offset;++i){
			let card=this.ui.standcards[i]; 
			card.active= false;
		}

		for (let i=this.model.offset;i<this.ui.standcards.length;++i){ 
			let value=this.model.player.handcard[i-this.model.offset];
			let card=this.ui.standcards[i]; 
			card.active= (value !=null && value !=undefined);
		} 	 
	}  
 
	showLayupCards()
	{ 
		this.ui.cards_layup.active=true;
		for (let i=0;i<this.model.offset;++i){
			let card=this.ui.layupcards[i]; 
			card.active= false;
		} 
		for (let i=this.model.offset;i<this.ui.layupcards.length;++i){ 
			let value=this.model.player.handcard[i-this.model.offset];
			let cardNode=this.ui.layupcards[i]; 
			let active = (value !=null && value !=undefined);
			cardNode.active=active
			if(active)
			{ 
				let sign=cardNode.getChildByName("sign");
				sign.getComponent(cc.Sprite).spriteFrame = this.model.mahjongResMgr.getInstance().getCardSpriteFrame(value);
				let isJoker= MahjongGeneral.isJoker(value);
				cardNode.getChildByName("jin").active = isJoker;
				if(isJoker) {
					cardNode.getChildByName('majingBg').color=this.model.jinColor;
				}
				else
				{
					cardNode.getChildByName('majingBg').color=White;
				}
			}
		} 	 
	}
	//趴下
	layDown(){
		this.ui.cards_stand.active=false;
		this.ui.cards_laydown.active=true;
	} 
	//挺起
	showStand(){ 
		this.ui.cards_stand.active=true;
		this.ui.cards_laydown.active=false;
	}
}
//c, 控制
@ccclass
export default class QzmjHandCardCtrl extends BaseCtrl {
	//这边去声明ui组件

	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离 
	@property
    seatId:Number = 0;
    fapaitimer=null;
	fapaiStep=0;
	tidytimer=null;//整理手牌定时器
	tidystep=0;//整理手牌动画帧
	@property
	jinRed: Number = 0;
	@property
	jinGreen: Number = 0;
	@property
	jinBlue: Number = 0;
	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model,View); 
		this.model.initSeat(this.seatId);
		this.model.setJinColor(this.jinRed,this.jinGreen,this.jinBlue);
		
		this.usersUpdated();
		this.onSyncData();
	}
	onDestroy(){
		this.clearFaPaiTimer();
		this.clearTidyTimer();
		super.onDestroy();
	}
	clearTidyTimer(){
		if(this.tidytimer!=null)
		{
			clearInterval(this.tidytimer);
			this.tidytimer=null;
		}
	}
	clearFaPaiTimer(){
		if(this.fapaitimer!=null)
		{
			clearInterval(this.fapaitimer);
			this.fapaitimer=null;
		}
	}
	stepFaPai(){
		switch(this.fapaiStep)
		{
			case 0:
				this.view.stepFaPai(0);
			break;
			case 1:
				this.view.stepFaPai(1);
			break;
			case 2:
				this.view.stepFaPai(2);
			break;
			case 3:
				this.view.stepFaPai(3);
			break;
			case 4:
				this.view.stepFaPai(4);
			break;
			case 5:
				this.clearFaPaiTimer();
			break;
		}  
		this.fapaiStep++;
	}
	stepTidy(){
		switch(this.tidystep)
		{ 
			case 2:
				this.view.layDown();
			break;
			case 3:  
				this.view.showStand();
			break;
			case 4:
				this.clearTidyTimer();
			break;
		} 
	}
	//整理手牌定时器
	startTidyTimer(){
		this.tidytimer=setInterval(this.stepTidy.bind(this),500)
	}
	process_kaijin()
	{
		//录像模式下直接刷新牌
		if(RoomMgr.getInstance().getVideoMode())
		{
			this.view.updateCards(); 
		}
		else
		{
			this.tidystep=0;
			this.startTidyTimer();
		}
	}
	startFaPaiTimer(){
		this.fapaitimer=setInterval(this.stepFaPai.bind(this),300)
	}
	
	//定义网络事件
	defineNetEvents()
	{
		this.n_events={
			onProcess:this.onProcess,   
			onOp:this.onOp,  
			onSeatChange:this.onSeatChange, 
			onSyncData:this.onSyncData, 
			'http.reqSettle':this.http_reqSettle,  
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
	start () {
	}
	//网络事件回调begin 
 
	onSyncData(  )
	{
		this.clearFaPaiTimer();
		this.model.initSeat(this.seatId);
		this.model.updateLogicId(); 
		if (this.model.seatid==0){
			return
		}  
		if(this.model.logicseatid==null)
			return;
		// 恢复游戏
		this.model.recover();
		this.model.updateOffset();
		this.view.recover(); 
	}
 
	usersUpdated(  )
	{
		// body
		this.model.clear();
		this.view.clear();
		this.model.updateLogicId(); 
	} 
	onOp(msg) 
	{
		// body  
		if (msg.opseatid!=this.model.logicseatid ){  
			return
		} 
		this.model.updateOffset()
		if(RoomMgr.getInstance().getVideoMode())
		{ 
			////console.log("更新其他人的牌")
			this.view.updateCards(); 
		}
		else
		{
			let op=MahjongDef.op_cfg[msg.event]
			switch(op)
			{
				case MahjongDef.op_chupai:
					this.op_chupai(msg) 
				break; 
				case MahjongDef.op_gaipai:
					this.op_gaipai(msg) 
				break;
				case MahjongDef.op_hu:
					this.op_hu(msg) 
				break;
				case MahjongDef.op_qianggang_hu:
					this.op_qianggang_hu(msg) 
				break;
				case MahjongDef.op_sanjindao:
				case MahjongDef.op_danyou:
				case MahjongDef.op_sanyou:
				case MahjongDef.op_shuangyou:
				case MahjongDef.op_bazhanghua:
					if(this.model.logicseatid==null)
						return
					this.view.updateCards();
					this.view.clear(); 
					this.view.showLayupCards();
				break;
			} 
		}
	} 
	op_hu(msg){
		this.view.updateCards(); 
	}
	op_qianggang_hu(msg){
		this.view.updateCards(); 
	} 
	onSeatChange(msg){ 
		// body
		if (this.model.logicseatid != this.model.mahjongLogic.getInstance().curseat){ 
			return;
		}
		this.view.updateCards() 
	}
	op_gaipai(msg)
	{ 
		// body  
		this.view.updateCards();
	}
	onProcess(msg){
		if (this.model.seatid==0){ 
			return
		}
		if(this.model.logicseatid==null)
		{
			return;
		}
		// body 
		if (msg.process==MahjongDef.process_fapai){ 
			this.process_fapai();
		}
		else if (msg.process==MahjongDef.process_buhua){ 
			this.process_buhua(msg);
		}
		else if (msg.process==MahjongDef.process_ready){ 
			this.process_ready(); 
		}
		else if (msg.process==MahjongDef.process_kaijin){
			this.process_kaijin();
		}
	}
	http_reqSettle(msg){
		// body 
		if(this.model.logicseatid==null)
			return
		this.view.clear();
		if(RoomMgr.getInstance().getVideoMode())
		{
			this.view.updateCards(); 
		}
		else
		{
			this.view.showLayupCards();
		}
	}
	process_ready(){
		// body
		this.model.clear();
		this.view.clear();
	}
	process_buhua(msg){
		// body  
 
		this.view.updateCards() 
	}
 
	op_chupai(msg){
		//收到出牌的指令了 
		this.view.updateCards(); 
	}

    process_fapai(){
		this.fapaiStep=0;
		this.view.initFaPai();
		this.startFaPaiTimer();
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
  
}