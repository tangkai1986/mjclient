/*
author: JACKY
日期:2018-01-12 16:06:45
*/



import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import BaseView from "../../Plat/Libs/BaseView";
import BaseModel from "../../Plat/Libs/BaseModel";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";  
import { MahjongGeneral } from "./MahjongGeneral";
import { MahjongDef } from "./MahjongDef";

let Gray = new cc.Color(156,189,228),White = new cc.Color(255,255,255);

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: QzmjCardPoolCtrl;
//模型，数据处理
class Model extends BaseModel {
	seatid = null;
	logicseatid = null;
	player = null;
	chosencardsindexes=[];//选中的牌的下标列表
	jinRed = 255;
	jinGreen = 255;
	jinBlue = 255;
	jinColor = White;
	mahjongResMgr=RoomMgr.getInstance().getResMgr();
	mahjongLogic=RoomMgr.getInstance().getLogic();
	mahjongDef=RoomMgr.getInstance().getDef();
	mahjongAudio=RoomMgr.getInstance().getAudio();	

	constructor() {
		super();
		this.clear();
	}
	initSeat(seatid) {
		// body 
		this.seatid = seatid;
	}
	updateLogicId() {
		// body 
		this.logicseatid = RoomMgr.getInstance().getLogicSeatId(this.seatid);
		if (this.logicseatid == null)
			return;
		this.player = this.mahjongLogic.getInstance().players[this.logicseatid];
	}
	clear() {
		// body  
	}
	recover() {
		// body 
	}
	//更新选中的牌的标记
	updateSelFlag(cardvalue)
	{
		this.chosencardsindexes=[];
		let cardpool=this.player.cardpool;
		for(let index = 0;index<cardpool.length;++index)
		{
			if(cardpool[index]==cardvalue)
			{
				this.chosencardsindexes.push(index);
			}
		}
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
class View extends BaseView {
	ui = {
		//在这里声明ui
		signSpriteList:[],
		jinList:[],
		guangbiaoList:[],
		node_outcard:null,
		node_effectCard:null,
		node_effectCardJin:null,
		node_effectCardSign:null,
		//effectList:[],
		hueffectList:[],
	};
	debug = null;
	poolcard = null;
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.debug = false;
		this.initUi();
	}
	//初始化ui
	initUi() {
		this.poolcard = [];
		this.ui.node_outcard = ctrl.node_outcard.getChildByName("sign");
		this.ui.node_effectCard = ctrl.node_effectCard;
		this.ui.node_effectCardSign = this.ui.node_effectCard.parent.getChildByName("sign").getComponent(cc.Sprite);
		this.ui.node_effectCardJin = this.ui.node_effectCard.parent.getChildByName("jin");
		let count = this.node.childrenCount;
		for (var i = 0; i < count-1; ++i) {
			let majiang_node = this.node.getChildByName(`Majiang_${i}`)
			if(!majiang_node) {
				continue;
			}
			this.poolcard.push(majiang_node);
			this.ui.signSpriteList.push(majiang_node.getChildByName('sign').getComponent(cc.Sprite));
			this.ui.jinList.push(majiang_node.getChildByName('jin'));
			this.ui.guangbiaoList.push(majiang_node.getChildByName('guangbiao'));
			//this.ui.effectList.push(majiang_node.getChildByName('effect'));
			this.ui.hueffectList.push(majiang_node.getChildByName('hueffect'));
			majiang_node.getChildByName('hueffect').getComponent(cc.Animation).on('finished', this.onhueffectFinished, this);
			majiang_node.getChildByName('guangbiao').active = false;
		}
		this.clear();
	}
	updatePool() {
		var index = this.model.player.cardpool.length - 1;
		var value = this.model.player.cardpool[index];
		var card = this.poolcard[index];
		//牌不够显示
		if(!card)
		{
			return;
		}
		card.active = true; 
		this.ui.signSpriteList[index].spriteFrame = this.model.mahjongResMgr.getInstance().getCardSpriteFrame(value);
		let isJoker= MahjongGeneral.isJoker(value);
		this.ui.jinList[index].active = isJoker;
		card.getChildByName('MajiangBg').color=isJoker ? this.model.jinColor:White;
		this.hideGuangbiao();  
		this.ui.guangbiaoList[index].active= true;
		this.ui.guangbiaoList[index].getComponent(cc.Animation).play();
	}
	showhueffect()
	{
		var index = this.model.player.cardpool.length - 1;
		this.ui.hueffectList[index].getComponent(cc.Animation).play();
	}
	onhueffectFinished()
	{
		let index = this.model.player.cardpool.length;
		let card = this.poolcard[index-1];
		card.active = false;
	}
	hideGuangbiao() {
		let count = this.ui.guangbiaoList.length;
		for (var i = 0; i < count; ++i) {
			this.ui.guangbiaoList[i].active = false;
		}
	}

	clear() {
		for (var i = 0; i < this.poolcard.length; ++i) {
			this.poolcard[i].active = false;
		}
		this.ui.node_outcard.parent.parent.active = false;
	}
	hideoutcard()
	{
		this.ui.node_outcard.parent.parent.active = false;
	}
	recover() {
		this.clear();
		for (let index = 0; index < this.model.player.cardpool.length; ++index) {
			var value = this.model.player.cardpool[index];
			let isJoker= MahjongGeneral.isJoker(value);
			var card = this.poolcard[index];
			card.active = true; 
			this.ui.jinList[index].active = isJoker;
			card.getChildByName('MajiangBg').color=isJoker ?  this.model.jinColor:White;
			this.ui.signSpriteList[index].spriteFrame = this.model.mahjongResMgr.getInstance().getCardSpriteFrame(value);
		}
	}
	reducePool() {
		let index = this.model.player.cardpool.length;
		let card = this.poolcard[index];
		card.active = false;
	}
	showoutcard(value)
	{
		// this.ui.node_outcard.parent.parent.active = true; 
		this.ui.node_outcard.getComponent(cc.Sprite).spriteFrame = this.model.mahjongResMgr.getInstance().getCardSpriteFrame(value);
		let isJoker= MahjongGeneral.isJoker(value);
		this.ui.node_outcard.parent.getChildByName("jin").active = isJoker;
		// this.ui.node_outcard.getChildByName('MajiangBg').color=isJoker ?  this.model.jinColor:White;
	}
	updateSelFlag(){
		for(let i = 0;i<this.model.chosencardsindexes.length;++i)
		{
			let index=this.model.chosencardsindexes[i];
			var card = this.poolcard[index]; 
			let cardvalue=this.model.player.cardpool[index];
			if(!MahjongGeneral.isJoker(cardvalue))
			{
				card.getChildByName('MajiangBg').color=Gray; 
			}
		}
	}
	resetSelFlag(){
		for(let index = 0;index<this.poolcard.length;++index)
		{ 
			let card = this.poolcard[index]; 
			let cardvalue=this.model.player.cardpool[index];
			if(!MahjongGeneral.isJoker(cardvalue))
			{
				card.getChildByName('MajiangBg').color=White; 
			}
		}
	}
	playOutcardEffect(callback)
	{
		if (typeof(callback)!="function") {
			return;
		}
		this.ui.node_effectCard.parent.active = true;
		let originalPos = this.ui.node_effectCard.parent.getPosition();
		let index = this.model.player.cardpool.length - 1;
		let card = this.poolcard[index];
		let value = this.model.player.cardpool[index];
		let isJoker= MahjongGeneral.isJoker(value);
		this.ui.node_effectCardSign.spriteFrame = this.model.mahjongResMgr.getInstance().getCardSpriteFrame(value);
		this.ui.node_effectCardJin.active = isJoker;
		this.ui.node_effectCard.color=isJoker ?  this.model.jinColor:White;
		let plyEndPos = card.getChildByName('MajiangBg').getPosition();
		let cardPos = card.getPosition();
		// //console.log("originalPos:",originalWorldPos,"plyEndPos:",plyEndPos,"index",index,card.getChildByName('MajiangBg').getPosition());
		let self = this;
		if(this.model.seatid==3)
		{
			this.ui.node_effectCard.parent.runAction(cc.sequence(cc.moveTo(0.1,cc.p(plyEndPos.x,-plyEndPos.y+cardPos.y)),cc.callFunc(function(){self.ui.node_effectCard.parent.setPosition(originalPos);self.ui.node_effectCard.parent.active=false;}),cc.callFunc(function(){callback();})));
		}
		else
			this.ui.node_effectCard.parent.runAction(cc.sequence(cc.moveTo(0.1,cc.p(plyEndPos.x,plyEndPos.y+cardPos.y)),cc.callFunc(function(){self.ui.node_effectCard.parent.setPosition(originalPos);self.ui.node_effectCard.parent.active=false;}),cc.callFunc(function(){callback();})));
	}
}
//c, 控制
@ccclass
export default class QzmjCardPoolCtrl extends BaseCtrl {
	//这边去声明ui组件 
	@property
	seatId: Number = 0;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离 
	@property({
		tooltip : "麻将出牌提示",
		type : cc.Node
	})
	node_outcard : cc.Node = null;
	@property({
		tooltip : "打出麻将特效",
		type : cc.Node
	})
	node_effectCard : cc.Node = null;
	@property
	jinRed: Number = 0;
	@property
	jinGreen: Number = 0;
	@property
	jinBlue: Number = 0;

	onLoad() {
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model, View);
		this.model.setJinColor(this.jinRed,this.jinGreen,this.jinBlue)
		this.model.initSeat(this.seatId);
		this.usersUpdated();
		this.onSyncData();
	}

	//定义网络事件
	defineNetEvents() {
		this.n_events = {
			//网络消息监听列表 
			onOp: this.onOp,
			onProcess: this.onProcess,
			onSyncData: this.onSyncData,
			'http.reqSettle':this.http_reqSettle,
		}
	}
	//定义全局事件
	defineGlobalEvents() {
		//全局消息
		this.g_events = {
			'usersUpdated': this.usersUpdated,
			mj_chosecard:this.mj_chosecard,
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
	connectUi() {
	}
	start() {
	}
	//网络事件回调begin

	onSyncData() {
		// body
		if (this.model.logicseatid == null)
			return;
		this.model.recover();
		this.view.recover()
	}
	usersUpdated() {
		this.model.clear();
		this.view.clear()
		this.model.updateLogicId();
	}
	onOp(msg) {
		if(this.model.logicseatid==null)
		{
			return;
		}
		//重置选中的牌的显示
		this.view.resetSelFlag();
		// body
		//是要当前的牌权者打出去的牌被去碰杠所以要这样写
		if (this.model.logicseatid != this.model.mahjongLogic.getInstance().curseat){
			this.view.hideGuangbiao();
			this.ui.node_outcard.parent.parent.active = false;
			return;
		}	
		var op = MahjongDef.op_cfg[msg.event]
		if (op == MahjongDef.op_chupai) {
			if (msg.opseatid!=RoomMgr.getInstance().getMySeatId())
			{
				this.view.showoutcard(msg.card);
				// this.view.playOutcardEffect(function(){
				// 	// self.op_chupai(msg);
				// });
				this.op_chupai(msg);
			}
			else
			{
				this.op_chupai(msg);
				// let self = this;
				// this.view.playOutcardEffect(function(){
				// 	self.op_chupai(msg);
				// });
			}

		}
		else if (op == MahjongDef.op_gaipai) {
			this.view.updatePool();
		}
		else if (op == MahjongDef.op_chi || op == MahjongDef.op_peng || op == MahjongDef.op_gang) {
			if (this.model.logicseatid == this.model.mahjongLogic.getInstance().curseat) {
				this.model.cardpool = this.model.player.cardpool;
				this.view.reducePool();
				this.ui.node_outcard.parent.parent.active = false;
			}
		}
		else if (op == MahjongDef.op_hu || op == MahjongDef.op_qianggang_hu) {
			//console.log("poolmajiang",msg,this.model.mahjongLogic.getInstance().curseat,this.model.logicseatid);
			this.view.showhueffect();
		}
	}

	onProcess(msg) {
		if (this.model.logicseatid == null)
			return;
		if (msg.process == MahjongDef.process_ready) {
			this.process_ready(msg);
		}
	}
	process_ready(msg) {
		// body
		this.model.clear();
		this.view.clear();
	}
	op_chupai(msg) {
		// if (this.model.logicseatid != this.model.mahjongLogic.getInstance().curseat) {
		// 	return;
		// }
		// body 
		this.view.updatePool();
	}
	http_reqSettle()
	{
		this.view.hideoutcard();
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end


}