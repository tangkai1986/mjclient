/*
author: HJB
日期:2018-03-16 15:09:27
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import GameRecordMgr from "../../GameMgrs/GameRecordMgr";
import BehaviorMgr from "../../GameMgrs/BehaviorMgr";
import FrameMgr from "../../GameMgrs/FrameMgr";
import BunchInfoMgr from "../../GameMgrs/BunchInfoMgr";

const RECORD_STATE ={
	ROOM:1,
	FIGHT:2
}

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_RecordListCtrl;
//模型，数据处理
class Model extends BaseModel{
	private record_list:any = null;
	private record_state:number = 0;
	private record_begin:number = null;
	private record_num:number = null;
	private record_page:number = null;
	private list_record:boolean = true;
	private record_max:number = 0;
	private record_type:number = 0;
	private record_club:number = 0;
	constructor()
	{
		super();
		this.record_num = 20;
		this.record_list = {};
		this.record_state = RECORD_STATE.ROOM;
		this.record_begin = 0;
		this.record_page = 1;
		this.record_max = GameRecordMgr.getInstance().getRecordMax();

		this.refreshRecordList();
	}
	refreshRecordList(){
		this.record_type = GameRecordMgr.getInstance().getGameType();
		this.record_club = GameRecordMgr.getInstance().getRecordClub();
		this.record_list = GameRecordMgr.getInstance().getRecordList();
	}
	getRecordType(){
		return this.record_type;
	}
	getRecordClub(){
		return this.record_club;
	}
	getRecordList(){
		return this.record_list;
	}
	getRecordState(){
		return this.record_state;
	}
	setRecordState(data){
		this.record_state = data;
	}

	getRecordBegin(){
		return this.record_begin;
	}
	setRecordBegin(data){
		this.record_begin = data;
	}
	getRecordPage(){
		return this.record_page;
	}
	setRecordPage(data){
		this.record_page = data;
	}
	addRecordPage(data){
		this.record_page += data;
	}
	getRecordNum(){
		return this.record_num;
	}
	setListRecord(state){
		this.list_record = state;
	}
	getListRecord(){
		return this.list_record;
	}
	getRecordMax(){
		return this.record_max;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		prefab_strip:null,
		btn_close:null,
		btn_room:null,
		btn_fight:null,
		btn_video:null,
		node_record_list:null,
		node_recordView:null,
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
		this.ui.prefab_strip = ctrl.prefab_strip;
		this.ui.btn_close = ctrl.btn_close;
		this.ui.btn_room = ctrl.btn_room;
		this.ui.btn_fight = ctrl.btn_fight;
		this.ui.btn_video = ctrl.btn_video;
		this.ui.node_record_list = ctrl.node_record_list;
		this.ui.node_recordView = ctrl.node_recordView;

		this.refreshStateCheck();
	}
	refreshStateCheck(){
		if (this.model.getRecordState() == RECORD_STATE.ROOM){
			let node_check = this.ui.btn_room.getComponent(cc.Toggle);
			node_check.check();
		}else{
			let node_check = this.ui.btn_fight.getComponent(cc.Toggle);
			node_check.check();
		}
	}

	addRecordStrip(){
		let node_member = cc.instantiate(this.ui.prefab_strip);
		this.ui.node_record_list.addChild(node_member);
	}
	removeRecordList(){
		this.ui.node_record_list.destroyAllChildren();
		this.ui.node_record_list.removeAllChildren();
	}
	refreshRecordList(){
		let count = this.ui.node_record_list.childrenCount,
			layout = this.ui.node_record_list.getComponent(cc.Layout),
			layoutGap = layout.spacingY,
			layoutHeight = layout.paddingTop + layout.paddingBottom;
		for (let i = 0; i< count; i++){
			let curNode = this.ui.node_record_list.children[i];
			layoutHeight = layoutHeight + curNode.height + layoutGap;
		}

		this.ui.node_record_list.height = layoutHeight - layoutGap;
	}
}
//c, 控制
@ccclass
export default class Prefab_RecordListCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property(cc.Prefab)
	prefab_strip:cc.Prefab = null

	@property(cc.Node)
	btn_close:cc.Node = null

	@property(cc.Node)
	btn_room:cc.Node = null

	@property(cc.Node)
	btn_fight:cc.Node = null

	@property(cc.Node)
	btn_video:cc.Node = null

	@property(cc.Node)
	node_record_list:cc.Node = null

	@property(cc.Node)
	node_recordView:cc.Node = null

	

	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model,View);

		GameRecordMgr.getInstance().reqGambleRecordList(1,this.model.getRecordState(), 0, 0);
		//this.addMemberList();
	}

	//定义网络事件
	defineNetEvents(){ 
		this.n_events={
			"http.reqGambleRecordList":this.http_reqGambleRecordList,
			
			"http.reqGambleRecord":this.http_reqGambleRecord,
		}
	}

	http_reqGambleRecordList(msg){
		if (msg.page == 1){
			this.model.setRecordBegin(0);
			this.model.setRecordPage(1);
			this.view.removeRecordList();
		}
		this.model.refreshRecordList();
		this.addMemberList();
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image, this.ui.btn_room,this.btn_room_cb,"切换房间");
		this.connect(G_UiType.image, this.ui.btn_fight,this.btn_fight_cb,"切换比赛");
		this.connect(G_UiType.image, this.ui.btn_video,this.btn_video_cb,"点击录像");
		this.connect(G_UiType.button, this.ui.btn_close,this.btn_close_cb,"退出界面");
		this.connect(G_UiType.scroll, this.ui.node_record_list, this.record_view_cb, '切换列表内容');
	}
	start () {
	}
	//网络事件回调begin
	
	private http_reqGambleRecord(msg){
		
		//先启动游戏再去加载  
		//在这里暂时先写死启动泉州麻将的ui
		BunchInfoMgr.getInstance().showFinalSettle(msg.gameid);
	}
	//end
	//全局事件回调begin
	private addMemberList(){
		let record_list = this.model.getRecordList(),
			recordBegin = this.model.getRecordBegin(),
			recordCount = recordBegin + this.model.getRecordNum(),
			list_count =  record_list.length==null?0:record_list.length;
		recordCount = Math.min(recordCount, list_count);
		for (let i = recordBegin; i<recordCount; i++){
			let data = record_list[i];
			BehaviorMgr.getInstance().setGameRecordData(data);
			this.view.addRecordStrip();
		}
		this.view.refreshRecordList();
		this.model.setRecordBegin(recordCount);
		this.model.addRecordPage(1);
		if (recordCount != recordBegin)
			this.model.setListRecord(true);
	}
	//end
	//按钮或任何控件操作的回调begin
	private btn_close_cb(node, event){
		this.finish();
	}

	private record_view_cb(node, event){
		if (event.type == cc.Node.EventType.TOUCH_MOVE){
			let record_list = this.model.getRecordList(),
				itemMax = record_list.length;
			var node_height = node.height - this.ui.node_recordView.height
			if ((node_height * 0.25 * 4) < node.y
			&& this.model.getListRecord() == true) {
				this.model.setListRecord(false);
				GameRecordMgr.getInstance().reqGambleRecordList(
					this.model.getRecordPage(),
				);
			}
		}
	}

	private btn_room_cb(node, event){
		//console.log("btn_room_cb");
		if (this.model.getRecordState() == RECORD_STATE.ROOM)
			return ;
		this.model.setRecordState(RECORD_STATE.ROOM);
		GameRecordMgr.getInstance().reqGambleRecordList(
			1,
			this.model.getRecordState(),
		);
	}
	private btn_fight_cb(node, event){
		//console.log("btn_fight_cb");
		/*if (this.model.getRecordState() == RECORD_STATE.FIGHT)
			return ;
		this.model.setRecordState(RECORD_STATE.FIGHT);
		GameRecordMgr.getInstance().reqGameRecord(
			1,
			this.model.getRecordState(),
		);*/
		this.view.refreshStateCheck();
		FrameMgr.getInstance().showTips("暂未开放，敬请期待");
	}
	private btn_video_cb(node, event){
		//console.log("btn_video_cb");
		this.start_sub_module(G_MODULE.VideoEnter);
	}

	//end
}