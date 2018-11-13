/*
author: JACKY
日期:2018-01-12 16:08:31
*/


import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import BaseView from "../../Plat/Libs/BaseView";
import BaseModel from "../../Plat/Libs/BaseModel";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";  
import { MahjongDef } from "./MahjongDef";
import BetMgr from "../../Plat/GameMgrs/BetMgr";




let Gray = new cc.Color(156,189,228),White = new cc.Color(255,255,255);
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : GroupMaJiang3DCtrl;
//模型，数据处理
class Model extends BaseModel{
	seatid=null;
	logicseatid=null;
	player=null; 
	mySeatID=null;
	curOpedSeatID = null;
	chiindex = null;
	chosencardsindexes=[];//选中的牌的下标列表
	
	
	mahjongResMgr=RoomMgr.getInstance().getResMgr();
	mahjongLogic=RoomMgr.getInstance().getLogic();
	mahjongDef=RoomMgr.getInstance().getDef();
	mahjongAudio=RoomMgr.getInstance().getAudio();

	constructor()
	{
		super();

	} 
	initSeat(seatid){
		// body
		this.seatid=seatid;
	}
	updateLogicId(  ){
		// body 
		this.logicseatid=RoomMgr.getInstance().getLogicSeatId(this.seatid);
		if(this.logicseatid==null)
			return ;
		this.player=this.mahjongLogic.getInstance().players[this.logicseatid]; 
		this.mySeatID=RoomMgr.getInstance().getMySeatId();
	}
	recover(  ){ 
		this.updateLogicId();
	}
	clear(){ 
	}
	//更新选中的牌的标记
	updateSelFlag(cardvalue)
	{
		this.chosencardsindexes=[];
		let opcards=this.player.opcards; 
		for (let index = 0;index<opcards.length;++index){  
			let opcard=opcards[index];
			let value=opcard.value;  
			let startindex=index*4;
			switch(opcard.op)
			{
				case this.mahjongDef.op_chi:
					for(let j = 0;j<value.length;++j)
					{
						if(value[j]==cardvalue)
						{
							this.chosencardsindexes.push(startindex+j);
						}
					}
				break;
				case this.mahjongDef.op_peng: 
					if(value==cardvalue)
					{
						for(let j = 0;j<4;++j)
						{ 
							this.chosencardsindexes.push(startindex+j); 
						}
					}
				break; 
			} 
		}
	}	
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		cardGroups:[],
		majiangBgs:[],
		angangBgs:[],
		majiangSigns:[],
		majiangCards:[],
		//node_effectList:[],
	}; 
	node=null;
	debug=false;  
	constructor(model){
		super(model);
		this.node=ctrl.node; 
		 
		this.debug=false;
		this.initUi();
	}
	//初始化ui
	initUi()
	{ 
		let count=5;
		for(let i = 0;i<count;++i)
		{  
			let group=this.node.getChildByName(`DoorMaJiang_${i}`);//牌墩
			this.ui.cardGroups.push(group);
			let majiangbgs=[];//麻将背景
			let angangbgs=[];//暗杠背景
			let majiangSigns=[];//麻将值
			let majiangCards=[];//单个牌
			for(let j=0;j<4;++j)
			{
				let card=group.getChildByName(`MaJiang_${j}`); 
				majiangCards.push(card);
				let sign=card.getChildByName('sign');
				majiangSigns.push(sign);
				let majiangbg=card.getChildByName('majingBg');
				majiangbgs.push(majiangbg);
				majiangbg.setTag(`mjbg_${i}_${j}`)
				let angangbg=card.getChildByName('angangBg');
				angangbg.setTag(`agbg_${i}_${j}`)
				angangbgs.push(angangbg);
			}
			//this.ui.node_effectList.push(group.getChildByName("effect"));
			this.ui.majiangCards.push(majiangCards);
			this.ui.majiangSigns.push(majiangSigns);
			this.ui.majiangBgs.push(majiangbgs);
			this.ui.angangBgs.push(angangbgs);
		}  

		this.clear();
	} 
	recover(  ){
		// body
		this.clear(); 
		for (let i = 0;i<this.model.player.opcards.length;++i){  
			this.addDoorCard(i)
		}
	} 
	updateBuGang(card)
	{
		for (let index = 0;index<this.model.player.opcards.length;++index){  
			let opcard=this.model.player.opcards[index];
			let majiangCards=this.ui.majiangCards[index];
			let majiangSigns=this.ui.majiangSigns[index];
			let majiangbgs=this.ui.majiangBgs[index];
			let angangbgs=this.ui.angangBgs[index];
			if(opcard.op==MahjongDef.op_bugang && opcard.value==card)
			{   
				let value=opcard.value
				for (let i = 0;i<4;i++){
					let card=majiangCards[i];
					card.active=true;
					let sign=majiangSigns[i]; 
					
					let majingBg = majiangbgs[i];
					let angangBg = angangbgs[i];  
					angangBg.active = false;
					majingBg.active = true;

					sign.getComponent(cc.Sprite).spriteFrame = this.model.mahjongResMgr.getInstance().getCardSpriteFrame(value); 
					sign.active=true;
				}
				break;
			}
		}
	}
	hidejiantou(card)
	{
		for (let seatid = 0; seatid < 4; seatid++) {
			let viewid = RoomMgr.getInstance().getViewSeatId(seatid);
			let jiantou = card.getChildByName(`jiantou${viewid}`);
			if(jiantou!=null &&jiantou!=undefined) {
				jiantou.active=false;
			}
		}
	}
	addDoorCard(index){
		// body  
		////console.log("添加了吃碰类型=",index,this.model.player.opcards)
		let opcard=this.model.player.opcards[index];   
		let group=this.ui.cardGroups[index];
		let majiangCards=this.ui.majiangCards[index];
		let majiangbgs=this.ui.majiangBgs[index];
		let angangbgs=this.ui.angangBgs[index];
		let majiangSigns=this.ui.majiangSigns[index];
		let viewID = RoomMgr.getInstance().getViewSeatId(this.model.curOpedSeatID);
		group.active=true; 
		//this.ui.node_effectList[index].getComponent(cc.Animation).play();
		if (opcard.op==MahjongDef.op_chi){ 
			for(let i = 0;i<3;++i){ 
				let value=opcard.value[i]
				let card=majiangCards[i];
				card.active=true;
				let sign=majiangSigns[i];
				sign.getComponent(cc.Sprite).spriteFrame = this.model.mahjongResMgr.getInstance().getCardSpriteFrame(value);
				
					////console.log("addDoorCard",this.model.chiindex ,this.model.curOpedSeatID,viewID);
				this.hidejiantou(card);
				if(i==this.model.chiindex && (viewID!=null ||viewID!=undefined)) {
					// //console.log("addDoorCard",`jiantou${viewID}`);
					
					card.getChildByName(`jiantou${viewID}`).active=true;
				}
				let majingBg = majiangbgs[i];
				let angangBg = angangbgs[i];  
                angangBg.active = false;
                majingBg.active = true;
				sign.active = true;   
			}
			let card=majiangCards[3];
			card.active=false;
		}
		else if (opcard.op==MahjongDef.op_peng){ 
			let value=opcard.value;
			for (let i = 0;i<3;++i){
				let card=majiangCards[i];
				card.active=true;
				let sign=majiangSigns[i];
				sign.getComponent(cc.Sprite).spriteFrame = this.model.mahjongResMgr.getInstance().getCardSpriteFrame(value);
					////console.log("addDoorCard",this.model.chiindex ,this.model.curOpedSeatID,viewID);
				this.hidejiantou(card);
				if(i==0 && (viewID!=null ||viewID!=undefined)) {
					card.getChildByName(`jiantou${viewID}`).active=true;
				}
				let majingBg = majiangbgs[i];
                let angangBg = angangbgs[i];
                angangBg.active = false;
                majingBg.active = true;
				sign.active = true;   
			}
			let card=majiangCards[3];
			card.active=false;
		}
		else if (opcard.op==MahjongDef.op_gang){ 
			let value=opcard.value;
			for (let i = 0;i<4;i++){
				let card=majiangCards[i];
				card.active=true;
				let sign=majiangSigns[i];
				sign.getComponent(cc.Sprite).spriteFrame = this.model.mahjongResMgr.getInstance().getCardSpriteFrame(value);
				this.hidejiantou(card);
				if(i==0 && (viewID!=null ||viewID!=undefined)) {
					card.getChildByName(`jiantou${viewID}`).active=true;
				}
				let majingBg = majiangbgs[i];
                let angangBg = angangbgs[i];
                angangBg.active = false;
                majingBg.active = true;
				sign.active = true;     
			}
		}
		else if (opcard.op==MahjongDef.op_bugang){ 
			let value=opcard.value;
			for (let i = 0;i<4;i++){
				let card=majiangCards[i];
				card.active=true;
				let sign=majiangSigns[i];
				sign.getComponent(cc.Sprite).spriteFrame = this.model.mahjongResMgr.getInstance().getCardSpriteFrame(value);
			 
				let majingBg = majiangbgs[i];
                let angangBg = angangbgs[i];
                angangBg.active = false;
                majingBg.active = true;
				sign.active = true;     
				////console.log("这边补杠了")
			}
		}
		else if (opcard.op==MahjongDef.op_angang){ 
			let value=opcard.value
			for (let i = 0;i<4;++i){
				let card=majiangCards[i];
				this.hidejiantou(card);
				card.active=true;
				let sign=majiangSigns[i];
				let majingBg = majiangbgs[i];
                let angangBg = angangbgs[i];
				let flag = (i==3 && this.model.logicseatid == this.model.mySeatID)||RoomMgr.getInstance().getVideoMode();
                angangBg.active = !flag;
                majingBg.active = flag;
				sign.active = flag;
				sign.getComponent(cc.Sprite).spriteFrame = this.model.mahjongResMgr.getInstance().getCardSpriteFrame(value);
				if(BetMgr.getInstance().getGameId()==6||BetMgr.getInstance().getGameId()==1){
					//表示龙岩麻将。伟大的客户说龙岩麻将不要隐藏暗杠,後面草他媽的又說泉州麻將也要20180906
					if(i==3)
					{
						angangBg.active=false;
						majingBg.active = true;
						sign.active = true; 
					}
				}
		 
			}  
		} 
	}
	
	recoverPeng(card)
	{
		for (let index = 0;index<this.model.player.opcards.length;++index){  
			let opcard=this.model.player.opcards[index]; 
			let majiangCards=this.ui.majiangCards[index];
			if(opcard.op==MahjongDef.op_peng && opcard.value==card)
			{  
				let value=opcard.value 
				let card=majiangCards[3];
				//未来可能会加上小时的动画
				card.active=false;
				break;
			}
		}
	}
	
	updateCards(msg){
		// body 
		if(msg.event==MahjongDef.event_bugang)
		{
			this.updateBuGang(msg.card);
		}
		else if(msg.event==MahjongDef.event_qianggang_hu)
		{ 
			this.recoverPeng(msg.bugangCard);
		}
		else{ 
			////console.log("updateCards",msg,this.model.curSeatID);
			
			var index=this.model.player.opcards.length-1;
			this.addDoorCard(index)
		}
	}
	clear(){ 
		// body  
		for(var i = 0;i<this.ui.cardGroups.length;++i)
		{  
			this.ui.cardGroups[i].active=false;
		} 
	} 
	//更新选中标记
	updateSelFlag(){
		for(let i = 0;i<this.model.chosencardsindexes.length;++i)
		{
			let index=this.model.chosencardsindexes[i];
			let row=Math.floor(index/4);
			let col=index%4; 
			let bg=this.ui.majiangBgs[row][col];
			bg.color=Gray;
		}
	}
	//重置选中标记
	resetSelFlag(){
		for(let i=0;i<this.ui.majiangBgs.length;++i)
		{
			let bgs=this.ui.majiangBgs[i];
			for(let j =0;j<bgs.length;++j)
			{
				bgs[j].color=White;
			}
		}
	}	 
}
//c, 控制
@ccclass
export default class GroupMaJiang3DCtrl extends BaseCtrl {
	//这边去声明ui组件 
	@property
    seatId:Number = 0;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model,View);
		
		this.model.initSeat(this.seatId);
		this.usersUpdated();
		this.onSyncData();
	}

	//定义网络事件
	defineNetEvents()
	{
		this.n_events={
   			onProcess:this.onProcess, 
			onOp:this.onOp,    
			onSyncData:this.onSyncData, 
		}
	}
	//定义全局事件
	defineGlobalEvents()
	{
		//全局消息
		this.g_events={ 
			'usersUpdated':this.usersUpdated,   
			mj_chosecard:this.mj_chosecard,//接受选中牌的消息
		}
	}
	mj_chosecard(cardvalue)
	{
		if(this.model.logicseatid==null)
		{
			return;
		}
		//选中某张牌
		this.model.updateSelFlag(cardvalue);
		this.view.resetSelFlag();
		this.view.updateSelFlag();
	}
	//绑定操作的回调
	connectUi()
	{
	}
	start () {
	}
	//网络事件回调begin
	onSyncData(  ){
		// body 
		this.model.initSeat(this.seatId);
		this.model.updateLogicId();//清空自己所属位置的逻辑位置
		if(this.model.logicseatid==null)
			return ;
		this.model.recover();
		this.view.recover()
	}
	usersUpdated(){
		this.model.clear()
		this.view.clear() 
		this.model.updateLogicId();//清空自己所属位置的逻辑位置
	}
	onOp(msg){
		if(this.model.logicseatid==null)
		{
			return;
		}  
		//重置选中的牌的显示
		this.view.resetSelFlag();
		var op=MahjongDef.op_cfg[msg.event] 
		//抢杠胡
		if(op==MahjongDef.op_qianggang_hu)
		{ 
			if(this.model.logicseatid!=msg.bugangSeatId){
				return;
			} 
			//恢复补杠为碰 
			this.view.updateCards(msg);
			return;
		}
 
		if(this.model.logicseatid!=msg.opseatid)
			return ;
		//吃碰杠等列表
		let leagleOps=[MahjongDef.op_chi,MahjongDef.op_peng,
			MahjongDef.op_gang,MahjongDef.op_angang,MahjongDef.op_bugang]
		for(let i = 0;i<leagleOps.length;++i)
		{
			if(leagleOps[i]==op){
				if(msg.curseat!=null ||msg.curseat!=undefined) {
					this.model.curOpedSeatID = msg.curseat;
				}
				else
					this.model.curOpedSeatID =null;
				if(msg.chiindex!=null ||msg.chiindex!=undefined) {
					this.model.chiindex = msg.chiindex;
				}
				else
					this.model.chiindex = null;
				this.view.updateCards(msg);
				break;
			}
		} 
	}
	onProcess(msg){
		if(this.model.logicseatid==null)
			return ;
		if (msg.process==MahjongDef.process_ready ){ 
			this.process_ready(msg); 
		}
	}
	 
	
	process_ready(msg){
		this.view.clear()
		// body
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
 
 
}
