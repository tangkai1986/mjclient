import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseModel from "../../../Plat/Libs/BaseModel";
import MpnnLogic from "../BullMgr/MpnnLogic";
import MpnnConst from "../BullMgr/MpnnConst";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";

/*
author: YOYO
日期:2018-04-20 20:11:19
*/
const chipIndex = {
    0:[1,2],
    1:[2,4],
    2:[4,8],
    3:[5,10],
}
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Mpnn_Bets_btnCtrl;
//模型，数据处理

class Model extends BaseModel{
	minChip = null;//最小底分
	maxChip = null;//最大底分
	isGrabing = null;//是否抢庄
	playeraddin = null;//闲家推注的倍数
	ExtraChip = null//闲家推注的注码
	roomRule = null;
	ChipDouble = null
	ExtraChipDouble = null;//闲家推注加倍
	constructor()
	{
		super();
		this.initminChip();
		this.roomRule = RoomMgr.getInstance().getFangKaCfg();
		this.update();
	}
	initminChip(){
		let arr = chipIndex[RoomMgr.getInstance().getFangKaCfg().v_minChip];
		this.minChip = arr[0];
		this.maxChip = arr[1];
	}
	update(){
		let GrabList = MpnnLogic.getInstance().getGrablist();
		let myseatId = MpnnLogic.getInstance().getMyLogicSeatId();
		let delaerSeatId = MpnnLogic.getInstance().getDelaerSeatId();
		this.isGrabing = GrabList[myseatId] == GrabList[delaerSeatId] && GrabList[delaerSeatId]!= 0 && GrabList[delaerSeatId] == this.roomRule.v_grabbanker? true:false;
		this.ExtraChip = MpnnLogic.getInstance().getExtraChip();
		this.playeraddin = this.roomRule.v_playeraddin;
	}
	updateExtraDouble(){
		this.ExtraChipDouble = this.ExtraChip * 2;
		this.ChipDouble = this.maxChip * 2;
		let maxChip = this.maxChip * this.playeraddin;
		if(this.ExtraChipDouble >= maxChip){
			this.ExtraChipDouble = maxChip;
		}
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		btn_betMin:ctrl.btn_betMin,
		btn_betMax:ctrl.btn_betMax,
		btn_doubleBet:ctrl.btn_doubleBet,
		btn_extraChip:ctrl.btn_extraChip,
		node_normal:ctrl.node_normal,
		node_double:ctrl.node_double,
		btn_minChipDouble:ctrl.btn_minChipDouble,//底分加倍
		btn_extraChipDouble:ctrl.btn_extraChipDouble,//推注加倍
	};
	node:cc.Node
	model:Model
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{	
		this.node.active = false;
		//隐藏加倍按钮余节点
		this.ui.node_double.active = false;
		this.ui.btn_doubleBet.active = false;
		this.ui.btn_extraChip.active = false;
		this.initMinClip();	
		this.showBetBtn();
	}
	showBetBtn(){	
		//是否有闲家推注
		if(this.model.ExtraChip && this.model.playeraddin){
			this.ui.btn_extraChip.active = true;
		}
		//是否允许下注加倍
		if(this.model.roomRule.v_betredoubleLimit){
			this.ui.btn_doubleBet.active = this.model.isGrabing;
		}
		if(this.model.isGrabing){
			//是否有下注限制，有的话不显示最小下注
			this.ui.btn_betMin.active = this.model.roomRule.v_betLimit ? false : true;
		}
	}
	initMinClip(){
		this.ui.btn_betMin.getChildByName('text').getComponent(cc.Label).string = this.model.minChip;
		this.ui.btn_betMax.getChildByName('text').getComponent(cc.Label).string = this.model.maxChip;
		this.ui.btn_extraChip.getChildByName('text').getComponent(cc.Label).string = this.model.ExtraChip;
	}
	//显示下注节点
	showBouble(){
		this.ui.node_normal.active = false;
		this.ui.node_double.active = true;
		this.ui.btn_extraChipDouble.active = this.model.ExtraChip?true:false;
		this.ui.btn_minChipDouble.getChildByName('text').getComponent(cc.Label).string = this.model.ChipDouble;
		this.ui.btn_extraChipDouble.getChildByName('text').getComponent(cc.Label).string = this.model.ExtraChipDouble;
	}
	showBetNode(){
		this.node.active = true;
	}
}
//c, 控制
@ccclass
export default class Mpnn_Bets_btnCtrl extends BaseCtrl {
	view:View
	model:Model
	//这边去声明ui组件
	@property(cc.Node)
	btn_betMin:cc.Node = null
	@property(cc.Node)
	btn_betMax:cc.Node = null
	@property(cc.Node)
	btn_doubleBet:cc.Node = null
	@property(cc.Node)
	btn_extraChip:cc.Node = null
	@property(cc.Node)
	node_normal:cc.Node = null
	@property(cc.Node)
	node_double:cc.Node = null
	@property(cc.Node)
	btn_minChipDouble:cc.Node = null
	@property(cc.Node)
	btn_extraChipDouble:cc.Node = null
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
		this.n_events[MpnnConst.clientEvent.onProcess] = this.onProcess;
		this.n_events[MpnnConst.clientEvent.onSyncData] = this.onSyncData;
		this.n_events['connector.entryHandler.enterRoom'] = this.onEnterRoom;
	}
	//定义全局事件
	defineGlobalEvents()
	{
		this.g_events["updateExtraChip"] = this.updateExtraChip;
		this.g_events["showBet_Btn"] = this.showBet_Btn;

	}
	//绑定操作的回调
	connectUi()
	{	
		this.connect(G_UiType.image, this.view.ui.btn_betMin, this.btn_betMin_cb, '点击最小下注');
		this.connect(G_UiType.image, this.view.ui.btn_betMax, this.btn_betMax_cb, '点击最大下注');
		this.connect(G_UiType.image, this.view.ui.btn_extraChip, this.btn_extraChip_cb, '点击推注');
		this.connect(G_UiType.image, this.view.ui.btn_doubleBet, this.btn_doubleBet_cb, '点击加倍');
		this.connect(G_UiType.image, this.view.ui.btn_minChipDouble, this.btn_minChipDouble_cb, '点击底分推注');
		this.connect(G_UiType.image, this.view.ui.btn_extraChipDouble, this.btn_extraChipDouble_cb, '点击推注加倍');
	}
	start () {
	}
	//网络事件回调begin
	onProcess(msg){
		if(msg.process != MpnnConst.process.chooseChip){
			this.finish();
		}
	}
	onSyncData(msg){
		if(msg.processType != MpnnConst.process.chooseChip){
			this.finish();
		}
	}
	onEnterRoom(msg){
		if(!msg.gamestarted){
			this.finish();
		}
	}
	//end
	//全局事件回调begin
	
	//抢庄动画播放完了后显示下注
	showBet_Btn(){
		this.view.showBetNode();
	}
	//获取推注的注码
	updateExtraChip(){
		this.model.update();
		this.view.showBetBtn();
		this.view.initMinClip();
		//console.log("闲家推注的注码："+this.model.ExtraChip+"闲家推注："+this.model.playeraddin)
	}
	//end
	//按钮或任何控件操作的回调begin
	btn_betMin_cb(){
		MpnnLogic.getInstance().sendChooseChip(this.model.minChip);
		this.finish();
	}
	btn_betMax_cb(){
		MpnnLogic.getInstance().sendChooseChip(this.model.maxChip);
		this.finish();
	}
	btn_extraChip_cb(){
		MpnnLogic.getInstance().sendChooseChip(this.model.ExtraChip);
		this.finish();
	}
	btn_minChipDouble_cb(){
		MpnnLogic.getInstance().sendChooseChip(this.model.maxChip * 2);
		this.finish();
	}
	btn_extraChipDouble_cb() {
		this.model.updateExtraDouble();
		MpnnLogic.getInstance().sendChooseChip(this.model.ExtraChipDouble);
		this.finish();
	}
	btn_doubleBet_cb() {
		this.model.updateExtraDouble()
		this.view.showBouble();
	}
	//end
	sendShowBetTipG(){
		this.gemit("showBetTip")
	}
}