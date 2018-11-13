import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import BaseView from "../../../Plat/Libs/BaseView";
import MpnnLogic from "../BullMgr/MpnnLogic";
import MpnnConst from "../BullMgr/MpnnConst";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";

/*
author: JACKY
日期:2018-04-20 19:54:03
*/
let GRAB_STATE = cc.Enum({
	GRAB_NO:0,
	GRAB_ONE:1,
	GRAB_TWO:2,
	GRAB_THREE:3,
	GRAB_FOUR:4,
}) 


//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Mpnn_qiangzhuangCtrl;
//模型，数据处理
class Model extends BaseModel{
	private grab_state:number = null
	public nograb_count:number = null		//非抢庄倍数按钮个数
	constructor()
	{
		super();
		this.nograb_count = 1;
		let fangkacfg = RoomMgr.getInstance().getFangKaCfg()
		this.grab_state = Number(fangkacfg.v_grabbanker);
		//console.log("Mpnn_qiangzhuangCtrl", this.grab_state)
	}

	getGrabState(){
		return this.grab_state;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		node_frame:null,
		node_qiangx:null,
		btn_buqiang:null,
		btn_yibei:null,
		btn_liangbei:null,
		btn_sanbei:null,
		btn_sibei:null,
	};
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
		this.ui.node_frame = ctrl.node_frame;
		this.ui.btn_buqiang = ctrl.btn_buqiang;
		this.ui.btn_yibei = ctrl.btn_yibei;
		this.ui.btn_liangbei = ctrl.btn_liangbei;
		this.ui.btn_sanbei = ctrl.btn_sanbei;
		this.ui.btn_sibei = ctrl.btn_sibei;
		this.ui.node_qiangx = ctrl.node_qiangx;
		
		this.refreshUi();
		this.refreshFrame();
	}
	refreshUi(){
		this.ui.btn_yibei.active = false;
		this.ui.btn_liangbei.active = false;
		this.ui.btn_sanbei.active = false;
		this.ui.btn_sibei.active = false;
		if (GRAB_STATE.GRAB_ONE <= this.model.getGrabState())
			this.ui.btn_yibei.active = true;
		if (GRAB_STATE.GRAB_TWO <= this.model.getGrabState())
			this.ui.btn_liangbei.active = true;
		if (GRAB_STATE.GRAB_THREE <= this.model.getGrabState())
			this.ui.btn_sanbei.active = true;
		if (GRAB_STATE.GRAB_FOUR <= this.model.getGrabState())
			this.ui.btn_sibei.active = true;
	}
	refreshFrame(){
		let count = this.model.getGrabState() + this.model.nograb_count;
		this.ui.node_frame.width = this.ui.btn_yibei.width * count;
	}
	showQiangX(Times){
		this.ui.node_frame.active = false;
		// if(Times!=0){
		// 	this.ui.node_frame.active = false;
		// 	this.ui.node_qiangx.children[0].active = true;
		// 	this.ui.node_qiangx.children[0].children[0].getComponent(cc.Label).string = Times;
		// }else{
		// 	this.ui.node_frame.active = false;
		// 	this.ui.node_qiangx.children[1].active = true;
		// }
	}
	showOthersQiangX(){

	}
}
//c, 控制
@ccclass
export default class Mpnn_qiangzhuangCtrl extends BaseCtrl {

	@property(cc.Node)
	node_frame:cc.Node = null

	@property(cc.Node)
	node_qiangx:cc.Node = null

	@property(cc.Node)
	btn_buqiang:cc.Node = null

	@property(cc.Node)
	btn_yibei:cc.Node = null

	@property(cc.Node)
	btn_liangbei:cc.Node = null

	@property(cc.Node)
	btn_sanbei:cc.Node = null

	@property(cc.Node)
	btn_sibei:cc.Node = null
	

	//这边去声明ui组件

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
		this.n_events[MpnnConst.clientEvent.onChooseGrab] = this.onChooseGrab;
		this.n_events[MpnnConst.clientEvent.onConfirmGrab] = this.onConfirmGrab;
		this.n_events[MpnnConst.clientEvent.onSyncData] = this.onSyncData;
		this.n_events['connector.entryHandler.enterRoom'] = this.onEnterRoom;
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.button, this.ui.btn_buqiang, this.btn_buqiang_cb, '点击不抢'); 
		if (GRAB_STATE.GRAB_ONE <= this.model.getGrabState())
			this.connect(G_UiType.button, this.ui.btn_yibei, this.btn_yibei_cb, '点击一倍'); 
		if (GRAB_STATE.GRAB_TWO <= this.model.getGrabState())
			this.connect(G_UiType.button, this.ui.btn_liangbei, this.btn_liangbei_cb, '点击两倍'); 
		if (GRAB_STATE.GRAB_THREE <= this.model.getGrabState())
			this.connect(G_UiType.button, this.ui.btn_sanbei, this.btn_sanbei_cb, '点击三倍'); 
		if (GRAB_STATE.GRAB_FOUR <= this.model.getGrabState())
			this.connect(G_UiType.button, this.ui.btn_sibei, this.btn_sibei_cb, '点击四倍'); 
	}
	btn_buqiang_cb(){
		MpnnLogic.getInstance().sendChooseGrab(GRAB_STATE.GRAB_NO);
		this.view.showQiangX(GRAB_STATE.GRAB_NO);
	}
	btn_yibei_cb(){
		MpnnLogic.getInstance().sendChooseGrab(GRAB_STATE.GRAB_ONE);
		this.view.showQiangX(GRAB_STATE.GRAB_ONE);
	}
	btn_liangbei_cb(){
		MpnnLogic.getInstance().sendChooseGrab(GRAB_STATE.GRAB_TWO);
		this.view.showQiangX(GRAB_STATE.GRAB_TWO);
	}
	btn_sanbei_cb(){
		MpnnLogic.getInstance().sendChooseGrab(GRAB_STATE.GRAB_THREE);
		this.view.showQiangX(GRAB_STATE.GRAB_THREE);
	}
	btn_sibei_cb(){
		MpnnLogic.getInstance().sendChooseGrab(GRAB_STATE.GRAB_FOUR);
		this.view.showQiangX(GRAB_STATE.GRAB_FOUR);
	}
	start () {

	}
	//网络事件回调begin
	onProcess(msg){
		switch(msg.process){
            case MpnnConst.process.chooseChip:
            this.finish();
			break;
        }
	}
	onChooseGrab(msg){

	}
	onSyncData(msg){
		//console.log("zheshiqiangzhuangyuzhitiduanxian",msg);
		if(msg.processType!=MpnnConst.process.giveCards){
			this.finish();
		}
	}
	onConfirmGrab(){
		//this.view.showOthersQiangX();
		this.finish();
	}
	onEnterRoom(msg){
		//console.log("onEnterRoom",msg);
		if(!msg.gamestarted){
			this.finish();
		}
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
}