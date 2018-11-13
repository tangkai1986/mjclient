/*
author: HJB
日期:2018-02-23 15:29:05
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

import BehaviorMgr from "../../GameMgrs/BehaviorMgr";
import ClubMgr from "../../GameMgrs/ClubMgr";
import ClubGameMgr from "../../GameMgrs/ClubGameMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Club_LobbyRoomCtrl;

//模型，数据处理
class Model extends BaseModel{
	private room_list:any = null;
	private club_id:number = null
	private game_begin:number = null;
	private game_page:number = null;
	private game_num:number = null;
	private club_record:boolean = true
	constructor()
	{
		super();
		this.game_num = 6;
		this.game_begin = 0;
		this.game_page = 1;
		this.club_id = BehaviorMgr.getInstance().getClubSelectId();
		this.room_list = {};
	}
	setRoomList(data){
		this.room_list = data;
	}
	refreshRoomList(data){
		this.room_list = ClubGameMgr.getInstance().getClubGameList();
	}
	getRoomList(){
		return this.room_list;
	}
	getClubId(){
		return this.club_id;
	}
	getRoomBegin(){
		return this.game_begin;
	}
	setRoomBegin(data){
		this.game_begin = data;
	}
	getRoomPage(){
		return this.game_page;
	}
	setRoomPage(data){
		this.game_page = data;
	}
	addRoomPage(data){
		this.game_page += data;
	}
	getRoomNum(){
		return this.game_num;
	}
	setClubRecord(state){
		this.club_record = state;
	}
	getClubRecord(){
		return this.club_record;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		node_room_list:null,
		node_room_frame:null,
		node_room_botton:null,
		node_gameList:null,
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
		this.ui.node_room_list = ctrl.node_room_list;
		this.ui.node_room_frame = ctrl.node_room_frame;
		this.ui.node_room_botton = ctrl.node_room_botton;
		this.ui.node_gameList = ctrl.node_gameList;

	}
	/*
	data {id, name, type, pay, count, time, round}
	*/
	addRoomStrip(){
		let node_strip = cc.instantiate(this.ui.node_room_frame);
		this.ui.node_room_list.addChild(node_strip);
	}
	insertRoomStrip(){
		let node_strip = cc.instantiate(this.ui.node_room_frame);
		this.ui.node_room_list.insertChild(node_strip, 0);
		this.refreshRoomList();
	}
	//刷新房间列表
	refreshRoomList(){
		let count = this.ui.node_room_list.childrenCount,
			height = 0;
		if (count != 0){
			let layout = this.ui.node_room_list.getComponent(cc.Layout),
				gapTop = layout.paddingTop,
				gapBottom = layout.paddingBottom,
				gapY = layout.spacingY,
				node = this.ui.node_room_list.children[0];

			height = height + gapTop;
			height = height + gapBottom;
			height = height + Math.floor(count/2) * gapY;
			height = height + node.height * Math.ceil((count)/2);
		}

		//设置拖拽层容器大小
		this.ui.node_room_list.height = height;
	}
}
//c, 控制
@ccclass
export default class Club_LobbyRoomCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property(cc.Prefab)
	node_room_frame:cc.Prefab = null

	@property(cc.Node)
	node_room_list:cc.Node = null

	@property(cc.Node)
	node_room_botton:cc.Node = null

	@property(cc.Node)
	node_gameList:cc.Node = null
	

	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离

	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model,View);

		ClubGameMgr.getInstance().reqClubGameList(
			this.model.getClubId(), 
			this.model.getRoomPage())
	}

	//定义网络事件
	defineNetEvents()
	{
		this.n_events = {
			"http.reqClubGameList":this.http_reqClubGameList,
			"http.onClubGame":this.http_onClubGame,
		}
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image, this.ui.node_room_botton,()=>{},"遮罩层");
		this.connect(G_UiType.scroll, this.ui.node_room_list, this.club_view_cb, "拖动动态添加");
		
	}
	start () {
	}
	//网络事件回调begin
	private http_reqClubGameList(){
		this.model.refreshRoomList();
		this.refreshRoomList();
	}
	private http_onClubGame(msg){
		let data = msg.states;
        if (data.state == CLUB_GAME_STATE.CREATE){
			this.view.refreshRoomList();
			BehaviorMgr.getInstance().setClubGameRoom(data);
			this.view.insertRoomStrip();
			this.model.setRoomBegin(this.model.getRoomNum() + 1);
		}
	}

	//刷新房间列表
	refreshRoomList(){
		let roomList = this.model.getRoomList(),
			roomBegin = this.model.getRoomBegin(),
			roomCount = roomBegin + this.model.getRoomNum();
			roomCount = Math.min(roomCount, roomList.length);
		for (let i = roomBegin; i<roomCount; i++){
			let data = roomList[i];
			BehaviorMgr.getInstance().setClubGameRoom(data);
			this.view.addRoomStrip();
		}
		this.view.refreshRoomList();
		this.model.setRoomBegin(roomCount);
		this.model.addRoomPage(1);
		this.model.setClubRecord(true)
	}

	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private club_view_cb(node, event){
		if (event.type == cc.Node.EventType.TOUCH_MOVE){
			let game_list = this.model.getRoomList(),
				itemMax = game_list.length;
			if (this.model.getRoomBegin() == itemMax){
				return 
			}
			var node_height = node.height - this.ui.node_gameList.height
			if ((node_height * 0.25 * 4) < node.y
			&& this.model.getClubRecord() == true) {
				this.model.setClubRecord(false);
				ClubGameMgr.getInstance().reqClubGameList(
					this.model.getClubId(), 
					this.model.getRoomPage());
			}
		}
	}
	//end
}