/*
author: HJB
日期:2018-02-24 10:58:03
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

import BehaviorMgr from "../../GameMgrs/BehaviorMgr";
import RoomMgr from "../../GameMgrs/RoomMgr";
import SubGameMgr from "../../GameMgrs/SubGameMgr";
import Prefab_RoomRuleCtrl from "../CreateRoom/Prefab_RoomRuleCtrl";
import GameCateCfg from "../../CfgMgrs/GameCateCfg";
import CreateRoomMgr from "../../GameMgrs/CreateRoomMgr";
import RoomCostCfg from "../../CfgMgrs/RoomCostCfg";
import ClubMgr from "../../GameMgrs/ClubMgr";
import UiMgr from "../../GameMgrs/UiMgr";
import RoomOptionCfg from "../../CfgMgrs/RoomOptionCfg";
import FrameMgr from "../../GameMgrs/FrameMgr";
import {g_deepClone} from "../../Libs/Gfun";
import VerifyMgr from "../../GameMgrs/VerifyMgr";

const CLUB_ROOM_PAY_SOURCE = {
	ROOM_CREATE_SELF:1,
	ROOM_CREATE_CLUB:2,
}

const CLUB_ROOM_PAY_TYPE = {
	TYPE_SELF:0,
	TYPE_AA:1,
	TYPE_WIN:2,
}

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Club_ChatRoomEnterCtrl;
//模型，数据处理
class Model extends BaseModel{
	private room_data = null;
	constructor()
	{
		super();
		this.room_data = g_deepClone(BehaviorMgr.getInstance().getClubRoomData());
		//console.log(this.room_data);
	}
	getRoomId(){
		return this.room_data.id;
	}
	getClubRoomType(){
		let games = GameCateCfg.getInstance().getGameById(this.room_data.type);
		let type_name = games.name;
		return type_name;
	}
	getClubRoomPayType(){
		let type_name = this.getPayTypeName(this.room_data.payType);
		let pay_count = 0;
		// pay_count = this.room_data.payCount;
		if(this.room_data.roundMax==0)
		{
			pay_count = RoomCostCfg.getInstance().getRoomCost(GameCateCfg.getInstance().getGameById(this.room_data.type).code,
			1,this.room_data.roundMax,this.room_data.countMax,this.room_data.type)
		}
		else{
			//console.log("支付的类型是什么"+this.room_data.payType)
			//console.log("游戏名字"+GameCateCfg.getInstance().getGameById(this.room_data.type).code)
			pay_count = RoomCostCfg.getInstance().getRoomCost(GameCateCfg.getInstance().getGameById(this.room_data.type).code,
			0,this.room_data.roundMax,this.room_data.countMax,this.room_data.payType)
		}
		return type_name+":"+pay_count;
	}
	getClubRoomPaySource(){
		return this.room_data.paySource;
	}
	getClubRoomCount(){
		return ""+this.room_data.count+"/"+this.room_data.countMax;
	}
	getClubRoomRound(){
		if (this.room_data.roundMax == 0){
			return  "1课"
		}
		return ""+this.room_data.round+"/"+this.room_data.roundMax;
	}
	getClubRoomTime(){
		return this.room_data.time;
	}
	getClubRoomState(){
		return this.room_data.state;
	}
	getClubPaySource(){
		return this.room_data.paySource
	}
	getClubRoomInfo()
	{
		let roomInfo = this.room_data.countMax+"人，";
		if(this.room_data.youjintype!=null &&this.room_data.youjintype!=undefined) {
			if(this.room_data.type==1) {
				roomInfo = roomInfo + RoomOptionCfg.getInstance().getRoomDescToString(this.room_data.type,{"t_youjin":this.room_data.youjintype})+"，";
			}
		}
		if (this.room_data.roundMax == 0){
			roomInfo = roomInfo + "1课\n";
		}
		else{
			roomInfo = roomInfo + this.room_data.roundMax+"局\n";
		}
		roomInfo = roomInfo + "茶馆支付";
		// roomInfo = roomInfo+this.getPayTypeName(this.room_data.payType)+"，";
		// roomInfo = roomInfo+"费用"+RoomCostCfg.getInstance().getRoomCost(GameCateCfg.getInstance().getGameById(this.room_data.type).code,
		// 	0,this.room_data.roundMax,this.room_data.countMax,this.room_data.payType)
		return roomInfo;
	}
	getClubRoomData(){
		return this.room_data;
	}
	setClubRoomData(data){
		//BehaviorMgr.getInstance().setClubRoomData(data);
		this.room_data.state = data.state;
		if (this.room_data.state == 1){
			this.room_data.count = data.count;
			this.room_data.round = data.round;
		}
		this.room_data.userheads = data.userheads;
	}
	//判定是否可加入
	getClubRoomOpen(){
		return this.room_data.disableotherenter;
	}
	//判定是否房间已满
	getClubRoomMember(){
		return this.room_data.count>=this.room_data.countMax?true:false;
	}
	getPayTypeName(type){
		let strName = "";
		switch(type){
			case CLUB_ROOM_PAY_TYPE.TYPE_SELF:
				strName = "房主支付";
				break;
			case CLUB_ROOM_PAY_TYPE.TYPE_AA:
				strName = "AA制支付";
				break;
			case CLUB_ROOM_PAY_TYPE.TYPE_WIN:
				strName = "赢家支付";
				break;
			default:
				break;
		}
		return strName;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		label_roomid:null,
		label_type:null,
		label_pay:null,
		label_count:null,
		label_round:null,
		label_time:null,
		node_enter:null,
		node_bottom_1:null,
		node_club:null,
		btn_club:null,
		label_roomInfo:null,
		node_users:null,
		node_roomState:null,
		node_roomInWait:null,
		node_roomInGame:null,
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
		this.ui.label_roomid = ctrl.label_roomid;
		this.ui.label_type = ctrl.label_type;
		this.ui.label_pay = ctrl.label_pay;
		this.ui.label_count = ctrl.label_count;
		this.ui.label_round = ctrl.label_round;
		this.ui.label_time = ctrl.label_time;
		this.ui.node_enter = ctrl.node_enter;
		this.ui.node_bottom_1 = ctrl.node_bottom_1;
		this.ui.node_club = ctrl.node_club;
		this.ui.btn_club = ctrl.btn_club;
		this.ui.label_roomInfo = ctrl.label_roomInfo;
		this.ui.node_users=ctrl.node_users;
		this.ui.node_roomState = ctrl.node_roomState;
		this.ui.node_roomInGame = ctrl.node_roomState.getChildByName("ingame");
		this.ui.node_roomInWait = ctrl.node_roomState.getChildByName("waiting");
		this.refreshUi();
	}
	refreshUi(){
		this.refreshRoomID();
		this.refreshRoomType();
		this.refreshRoomPay();
		this.refreshRoomCount();
		this.refreshRoomRound();
		this.refreshRoomTime();
		this.refreshRoomInfo();
		this.refreshRoomUsers();
		this.refreshEnter();
		this.refreshPayType();
		this.refreshRoomState();
	}
	refreshRoomID(){
		this.ui.label_roomid.string = this.model.getRoomId();
	}
	refreshRoomType(){
		this.ui.label_type.string = this.model.getClubRoomType();
	}
	refreshRoomInfo()
	{
		this.ui.label_roomInfo.string = this.model.getClubRoomInfo();
	}
	refreshRoomUsers()
	{
		//console.log("refreshRoomUsers",this.model.room_data)
		for (let userIdx = 0; userIdx < this.ui.node_users.children.length; userIdx++) {
			let user=this.ui.node_users.children[userIdx];
			user.active= false;
		}
		if(this.model.room_data.userheads) {
			let self = this;
			for (let userIdx = 0; userIdx < this.model.room_data.userheads.length; userIdx++) {
				let user=this.ui.node_users.children[userIdx];
				if(userIdx>3) {
					return;
				}
				user.active = true;
				if (typeof this.model.room_data.userheads[userIdx] == "number"){
					UiMgr.getInstance().setUserHead(user, this.model.room_data.userheads[userIdx]);
				}					
				else{
					UiMgr.getInstance().setUserHead(user, 0, this.model.room_data.userheads[userIdx]);
				};
			}
		}
		//console.log("userheads",this.model.room_data.userheads);
	}
	refreshRoomPay(){
		this.ui.label_pay.string = this.model.getClubRoomPayType();
	}
	refreshRoomCount(){
		this.ui.label_count.string = this.model.getClubRoomCount();
	}
	refreshRoomRound(){
		this.ui.label_round.string = this.model.getClubRoomRound();
	}
	refreshRoomTime(){
		// if (this.model.getClubRoomState() == 0)
		// 	this.ui.label_time.string = "已结束";
		// else
			this.ui.label_time.string = this.model.getClubRoomTime();
	}
	refreshPayType(){
		if (this.model.getClubPaySource() == 2){
			this.ui.node_club.active = false;
		}else{
			this.ui.node_club.active = false;
		}
	}
	refreshEnter(){
		// if (this.model.getClubRoomState() == 0 
		// || this.model.getClubRoomOpen() == 1
		// || this.model.getClubRoomMember()){
		// 	this.ui.node_enter.active = false;
		// 	this.ui.btn_club.active = false;
		// 	this.ui.btn_club.pauseSystemEvents();
		// }else{
		this.ui.node_enter.active = true;
		this.ui.btn_club.active = true;
		this.ui.btn_club.resumeSystemEvents();
		//}
	}
	refreshRoomState(){
		if(this.model.room_data.state==1) {
			this.ui.node_roomInWait.active = true;
			this.ui.node_roomInGame.active = false;
		}
		else
		{
			this.ui.node_roomInWait.active = false;
			this.ui.node_roomInGame.active = true;
		}
	}
}
//c, 控制
@ccclass
export default class Club_ChatRoomEnterCtrl extends BaseCtrl {
	//这边去声明ui组件

	@property(cc.Label)
	label_roomid:cc.Label = null
	
	@property(cc.Label)
	label_type:cc.Label = null

	@property(cc.Label)
	label_pay:cc.Label = null

	@property(cc.Label)
	label_count:cc.Label = null

	@property(cc.Label)
	label_round:cc.Label = null

	@property(cc.Label)
	label_time:cc.Label = null
	@property(cc.Label)
	label_roomInfo:cc.Label = null

	@property(cc.Node)
	node_enter:cc.Node = null

	@property(cc.Node)
	node_bottom_1:cc.Node = null

	@property(cc.Node)
	node_club:cc.Node = null

	@property(cc.Node)
	btn_club:cc.Node = null
	@property(cc.Node)
	node_users:cc.Node = null
	@property(cc.Node)
	node_roomState:cc.Node = null

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
		this.n_events = {
			"http.reqFangKaCfg":this.http_reqFangKaCfg,
			"ws.onClubChat":this.ws_onClubChat,
		}
	}
	//定义全局事件
	defineGlobalEvents()
	{
		this.g_events = {
			chat_room_refresh:this.chat_room_refresh,
		}
	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image, this.ui.btn_club, this.node_enter_cb, '点击关闭')
	}
	start () {
	}

	//网络事件回调begin
	private http_reqFangKaCfg(msg){
		//防止弹出多个下载界面
		if(msg.cfg.room_id != this.model.getRoomId()) {
			return;
		}
		//判断有没有安装此游戏
		let gameid=msg.cfg.gameid; 
		let game=GameCateCfg.getInstance().getGameById(gameid); 
		let state=SubGameMgr.getInstance().getSubGameState(game.code) 
		//console.log("http_reqFangKaCfg1",msg,state);
		if(state==0)
		{
			//this.finish();
			//防止重复设置
			//console.log("防止重复监听了")
			if(!RoomMgr.getInstance().isLoadingGame()&&msg.cfg.room_id == this.model.getRoomId())
			{
				RoomMgr.getInstance().reqFangKaVerify(this.model.getRoomId());
			}
		}
		else
		{
			//FrameMgr.getInstance().showTips(`请先下载【${game.name}】`, null,35, cc.color(0,255,0), cc.p(0,0), "Arial", 1000);  
				
			this.start_sub_module(G_MODULE.DownLoadGame,(obj)=>{
				obj.regCompleteCb(()=>{
					//请求房间号和服务器的房间号要一致
					if(msg.cfg.room_id == this.model.getRoomId()) {
						obj.finish();
						RoomMgr.getInstance().reqFangKaVerify(this.model.getRoomId());
					}
					else
					{
						obj.finish();
                    	RoomMgr.getInstance().reqMyRoomState();
						FrameMgr.getInstance().showMsgBox('房间已解散');
					}
				})
			},'Prefab_downLoadGamePanelCtrl'); 
		} 
	}
	private ws_onClubChat(msg){
		//console.log("ws_onClubChat1",msg);
		
		if (msg.type == CLUB_CHAT_TYPE.TYPE_ROOM_MODIFICATION){
			let roomId = this.model.getRoomId();
			//console.log("ws_onClubChat1",roomId, msg.room_data.id);
			if (roomId == msg.room_data.id){
				this.model.setClubRoomData(msg.room_data);
				this.view.refreshUi();
			}
		}
		else if(msg.type == CLUB_CHAT_TYPE.TYPE_ROOM_EXIT){
			let roomId = this.model.getRoomId();
			if (roomId == msg.room_data.id){
				this.finish();
			}
		}
	}
	private chat_room_refresh(){
		this.view.refreshEnter();
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private node_enter_cb(node, event){
        //判断有没有恢复房间
        if(VerifyMgr.getInstance().checkUnSettled()){
            return;
        }
		//console.log("node_enter_cb");
		let roomId = this.model.getRoomId();
		RoomMgr.getInstance().reqFangKaCfg(roomId);
		//改变茶馆排序
		// let club_id = BehaviorMgr.getInstance().getClubSelectId();
		// ClubMgr.getInstance().reqClubTop(club_id)
		this.gemit("refreshClubList")
	}
	//end
}