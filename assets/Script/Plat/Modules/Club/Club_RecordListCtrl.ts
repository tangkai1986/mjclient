/*
author: HJB
日期:2018-03-05 13:54:49
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import BehaviorMgr from "../../GameMgrs/BehaviorMgr";

import GameRecordMgr from "../../GameMgrs/GameRecordMgr";
import UserMgr from "../../GameMgrs/UserMgr";
import BunchInfoMgr from "../../GameMgrs/BunchInfoMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Club_RecordListCtrl;
//模型，数据处理
class Model extends BaseModel{
	private record_list = null;
	private club_id = null;
	private record_begin:number = null;
	private record_num:number = null;
	private record_page:number = null;
	private list_record:boolean = true;
	constructor()
	{
		super();
		this.record_num = 20;
		this.record_begin = 0;
		this.record_page = 1;
		this.record_list = new Array();
		this.club_id = BehaviorMgr.getInstance().getClubSelectId();
	}
	getRecordList(){
		return this.record_list
	}
	getClubId(){
		return this.club_id;
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
	addRecordPage(data){
		this.record_page += data;
	}
	setRecordPage(data){
		this.record_page = data;
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

	refreshRecord(){
		this.record_list = GameRecordMgr.getInstance().getRecordList();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		btn_close:null,
		record_list:null,
		record_strip:null,
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
		this.ui.btn_close = ctrl.btn_close;
		this.ui.record_list = ctrl.record_list;
		this.ui.record_strip = ctrl.record_strip;
		this.ui.node_recordView = ctrl.node_recordView;
	}

	addRecordStrip(){
		let record_node = cc.instantiate(this.ui.record_strip);
		this.ui.record_list.addChild(record_node);
	}

	refreshRecordList(){
		let count = this.ui.record_list.childrenCount,
			height = 0;
		if (count != 0){
			let layout = this.ui.record_list.getComponent(cc.Layout),
				gapTop = layout.paddingTop,
				gapBottom = layout.paddingBottom,
				gapY = layout.spacingY,
				node = this.ui.record_list.children[0];

			height = height + gapTop;
			height = height + gapBottom;
			height = height + (count-1) * gapY;
			height = height + node.height * count;
		}
		//设置拖拽层容器大小
		this.ui.record_list.height = height;
	}

	removeRecordList(){
		this.ui.record_list.destroyAllChildren();
	}
}
//c, 控制
@ccclass
export default class Club_RecordListCtrl extends BaseCtrl {
	//这边去声明ui组件

	@property(cc.Node)
	btn_close:cc.Node = null

	@property(cc.Node)
	record_list:cc.Node = null

	@property(cc.Prefab)
	record_strip:cc.Prefab = null

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

		GameRecordMgr.getInstance().reqGambleRecordList(1, 0, 0, this.model.getClubId());
	}

	//定义网络事件
	defineNetEvents()
	{
		this.n_events = {
			"http.reqGambleRecordList":this.http_reqGamebleRecordList,
			"http.onClubInfo":this.http_onClubInfo,
			"http.reqGambleRecord":this.http_reqGambleRecord,
		}
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image,this.ui.btn_close,this.btn_close_cb,"关闭界面");
		this.connect(G_UiType.scroll, this.ui.record_list, this.record_view_cb, '切换列表内容');
	}
	start () {
	}
	//网络事件回调begin
	private http_reqGamebleRecordList(msg){
		
		if (msg.page == 1){
			this.model.setRecordBegin(0);
			this.model.setRecordPage(1);
			this.view.removeRecordList();
		}
		this.model.refreshRecord();
		this.addMemberList();
	}
	private http_onClubInfo(msg){
		let data = msg.states;
		if (CLUB_INFO_STATE.EXIT == data.state){
			let user_id = UserMgr.getInstance().getUid();
			if (data.change_id == user_id && this.model.getClubId() == data.club_id){
                this.finish();
			}
        }else if (CLUB_INFO_STATE.DISSOVE == data.state){
			if (data.club_id == this.model.getClubId()){
				this.finish();
			}
		}
	}
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
			BehaviorMgr.getInstance().setClubRecordData(data);
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
	private btn_close_cb(node){
		//console.log('node_close_cb')
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
	//end
}