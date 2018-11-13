/*
author: Justin
日期:2018-02-08 13:34:25
*/  

import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import BaseView from "../../Plat/Libs/BaseView";
import BaseModel from "../../Plat/Libs/BaseModel";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";
import { MahjongDef } from "./MahjongDef";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : QzmjSwitchCardWithPlayerGmCtrl;
//模型，数据处理
class Model extends BaseModel{
	roomCards = [];//底牌数据
	handCard = null;//选中要换的手牌
	oppositeCard = null;//选中要换的对方牌
	cardsArr = [];//手牌数据
	targetSeatId=null;//目标座位的id
	
	mahjongResMgr=RoomMgr.getInstance().getResMgr();
	mahjongLogic=RoomMgr.getInstance().getLogic();
	mahjongDef=RoomMgr.getInstance().getDef(); 
	constructor()
	{
		super();

	}
	setTargetSeatId(seatId)
	{
		this.targetSeatId=seatId;
	}
	getMyCards(){
		let seatId=RoomMgr.getInstance().getMySeatId();
		let players=this.mahjongLogic.getInstance().players;
		let player=players[seatId];
		return player.handcard;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		//在这里声明ui
		prefab_MahjongItem : null,
		node_MyCards : null,
		node_OppositeMahjong : null,
		node_Close : null,
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
		this.addGrayLayer(); 
	}
	//初始化ui
	initUi()
	{
		this.ui.node_OppositeMahjong = ctrl.Node_OppositeMahjong;
		this.ui.node_MyCards = ctrl.Node_MyMahjong;
		this.ui.node_Close = ctrl.Node_Close;
		this.ui.prefab_MahjongItem = ctrl.Prefab_MahjongItem;
		this.ui.node_MyCards.removeAllChildren();
		this.ui.node_OppositeMahjong.removeAllChildren();
	}

	createMahjong (id, parent) : void {
		let node = cc.instantiate(this.ui.prefab_MahjongItem); 
		let face=node.getChildByName("MaJiang");
		face.getComponent(cc.Sprite).spriteFrame = this.model.mahjongResMgr.getInstance().getCardSpriteFrame(id)
		parent.addChild(node);
		return node;
	}
}
//c, 控制
@ccclass
export default class QzmjSwitchCardWithPlayerGmCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property({
		tooltip : "我方的麻将位置",
		type : cc.Node
	})
	Node_MyMahjong : cc.Node = null;
	@property({
		tooltip : "对方的麻将位置",
		type : cc.Node
	})
	Node_OppositeMahjong : cc.Node = null;
	@property({
		tooltip : "麻将预制资源",
		type : cc.Prefab
	})
	Prefab_MahjongItem : cc.Prefab = null;
	
	@property({
		tooltip : "关闭",
		type : cc.Node
	})
	Node_Close : cc.Node = null;

	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model,View);
		this.initMyMahjong();

	}

	//定义网络事件
	defineNetEvents()
	{
		this.n_events={
			//网络消息监听列表
            'room.roomHandler.gmReq':this.room_roomHandler_gmReq.bind(this), 
            onGmOp:this.onGmOp,
		}
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image, this.ui.node_Close, this.Node_Close_cb, "点击了关闭");
		let nodes = this.ui.node_MyCards.children || [];
		for (let i = 0; i < nodes.length; i ++) {
			this.connect(G_UiType.image, nodes[i], this.touchMeCards.bind(this, i), `点击了我的麻将${this.model.getMyCards()[i]}`);
		}
		nodes = this.ui.node_OppositeMahjong.children || [];
		for (let i = 0; i < nodes.length; i ++) {
			this.connect(G_UiType.image, nodes[i], this.touchOtherCards.bind(this, i), `点击了别的麻将${this.model.roomCards[i]}`);
		}
	}
	
	start () {

	}
	setTargetSeatId(seatId)
	{		
		this.model.setTargetSeatId(seatId)
		let msg = {
		reqtype : MahjongDef.gmreq_cards, 
		data : {
			target : seatId
		}
	};
	this.model.mahjongLogic.getInstance().gmReq(msg);
	}
	//网络事件回调begin
	private room_roomHandler_gmReq (msg) : void {
		//console.log(msg);
		this.model.roomCards = msg.data.cards;
		let cards = msg.data.cards;
		for (let i = 0; i < cards.length; i ++) {
			let node = this.view.createMahjong(cards[i], this.ui.node_OppositeMahjong);
		}
		this.connectUi();
	}
	private onGmOp (msg) : void {
		//console.log(msg);
		this.finish();
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private Node_Close_cb () : void {
		this.finish();
	}
	emitChangeCard () : void {
		if (this.model.handCard != null && this.model.oppositeCard != null) {
			let msg={ 
				optype : MahjongDef.gmop_changecard, 
				data:{
					src : this.model.handCard,
					dest : this.model.oppositeCard,
					seatId : this.model.targetSeatId,
				}
			}
			this.model.mahjongLogic.getInstance().gmOp(msg);
			 
			this.model.handCard = null;
			this.model.oppositeCard = null; 
		}
	}
	touchMeCards (id) : void {
		this.model.handCard = this.model.getMyCards()[id];
		let node = this.ui.node_MyCards.children[id];
		this.touchEffect(this.ui.node_MyCards.children, 0.8);
		node.setScale(new cc.Vec2(1, 1));
		this.emitChangeCard();
	}

	touchOtherCards (id) : void {
		this.model.oppositeCard = this.model.roomCards[id];
		let node = this.ui.node_OppositeMahjong.children[id];
		this.touchEffect(this.ui.node_OppositeMahjong.children, 0.8);
		node.setScale(new cc.Vec2(1, 1));
		this.emitChangeCard();
	}

	touchEffect (nodes, scale) : void {
		for (let i = 0; i < nodes.length; i ++) {
			nodes[i].setScale(new cc.Vec2(scale, scale));
		}
	}
	initMyMahjong () : void {
		let cards = this.model.getMyCards();
		for (let i = 0; i < cards.length; i ++) {
			let node = this.view.createMahjong(cards[i], this.ui.node_MyCards);
		}
		this.connectUi();
	}
	//end
}