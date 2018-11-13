/*
author: HJB
日期:2018-03-12 17:33:40
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

import BehaviorMgr from "../../GameMgrs/BehaviorMgr";
import RoomMgr from "../../GameMgrs/RoomMgr";
import Prefab_RoomRuleCtrl from "../CreateRoom/Prefab_RoomRuleCtrl";
import GameCateCfg from "../../CfgMgrs/GameCateCfg";
import GameResCfg from "../../CfgMgrs/GameResCfg";
import RoomCostCfg from "../../CfgMgrs/RoomCostCfg";
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
let ctrl : Club_RoomStripCtrl;
//模型，数据处理
class Model extends BaseModel{
	private room_data = null;
	private game_res = null;
	public res_path:string = "Plat/Club/";
	constructor()
	{
		super();
		this.room_data = BehaviorMgr.getInstance().getClubGameRoom();
		this.game_res = GameResCfg.getInstance().getGameResData(this.room_data.type);
		//console.log("Club_RoomStripCtrl", this.game_res);
	}
	getRoomId(){
		return this.room_data.id
	}
	getRoomName(){
		return this.room_data.name+"的房间";
	}
	getRoomType(){
		let games = GameCateCfg.getInstance().getGameById(this.room_data.type);
		let type_name = games.name;
		return type_name;
	}
	getRoomPay(){
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
		// if (this.room_data.payType == CLUB_ROOM_PAY_TYPE.TYPE_AA){
		// 	pay_count = pay_count/this.room_data.countMax
		// }
		
	}
	setRoomCount(data){
		this.room_data.mCount = data;
	}
	getRoomCount(){
		return ""+this.room_data.count+"/"+this.room_data.countMax 
	}
	getRoomTime(){
		return this.room_data.time
	}
	getRoomRound(){
		if (this.room_data.roundMax == 0){
			return  "1课"
		}
		return ""+this.room_data.round+"/"+this.room_data.roundMax;
	}
	getClubPaySource(){
		return this.room_data.paySource;
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
	getGameResData(){
		return this.game_res;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		label_name:null,
		label_type:null,
		label_pay:null,
		label_count:null,
		label_time:null,
		label_round:null,
		btn_room:null,
		node_club:null,
		node_bottom:null,
		node_title:null,
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
		this.ui.label_name = ctrl.label_name;
		this.ui.label_type = ctrl.label_type;
		this.ui.label_pay = ctrl.label_pay;
		this.ui.label_count = ctrl.label_count;
		this.ui.label_time = ctrl.label_time;
		this.ui.label_round = ctrl.label_round;
		this.ui.btn_room = ctrl.btn_room;
		this.ui.node_club = ctrl.node_club;
		this.ui.node_bottom = ctrl.node_bottom;
		this.ui.node_title = ctrl.node_title;

		this.refreshUi();
	}
	refreshUi(){
		this.refreshRoomName();
		this.refreshRoomType();
		this.refreshRoomPay();
		this.refreshRoomCount();
		this.refreshRoomTime();
		this.refreshRoomRound();
		this.refreshRoomSource();
		this.refreshTitleBottom();
	}

	refreshRoomName(){
		this.ui.label_name.string = this.model.getRoomName();
	}
	refreshRoomType(){
		this.ui.label_type.string = this.model.getRoomType();
	}
	refreshRoomPay(){
		this.ui.label_pay.string = this.model.getRoomPay();
	}
	refreshRoomCount(){
		this.ui.label_count.string = this.model.getRoomCount();
	}
	refreshRoomTime(){
		this.ui.label_time.string = this.model.getRoomTime();
	}
	refreshRoomRound(){
		this.ui.label_round.string = this.model.getRoomRound();
	}
	refreshRoomSource(){
		if (this.model.getClubPaySource() == 2){
			this.ui.node_club.active = true;
		}else{
			this.ui.node_club.active = false;
		}
	}
	refreshTitleBottom(){
		let game_res = this.model.getGameResData();
		
		cc.loader.loadRes(game_res.club_room_down);
		cc.loader.loadRes(this.model.res_path + game_res.club_room_down, cc.SpriteFrame, (err, spriteFrame:cc.SpriteFrame)=> { 
			if(err){
				cc.error(err) 
			}else{
				if(cc.isValid(this.ui.node_bottom) && this.ui.node_bottom) {
					this.ui.node_bottom.spriteFrame = spriteFrame;
				}
			} 
		});

		cc.loader.loadRes(this.model.res_path + game_res.club_room_title, cc.SpriteFrame, (err, spriteFrame:cc.SpriteFrame)=> { 
			if(err){
				cc.error(err) 
			}else{
				if(cc.isValid(this.ui.node_title) && this.ui.node_title) {
					this.ui.node_title.spriteFrame = spriteFrame;
				}
			} 
		});
	}
}
//c, 控制
@ccclass
export default class Club_RoomStripCtrl extends BaseCtrl {
	//这边去声明ui组件

	@property(cc.Label)
	label_name:cc.Label = null

	@property(cc.Label)
	label_type:cc.Label = null

	@property(cc.Label)
	label_pay:cc.Label = null

	@property(cc.Label)
	label_count:cc.Label = null

	@property(cc.Label)
	label_time:cc.Label = null

	@property(cc.Label)
	label_round:cc.Label = null

	@property(cc.Node)
	btn_room:cc.Node = null

	@property(cc.Node)
	node_club:cc.Node = null

	@property(cc.Sprite)
	node_bottom:cc.Sprite = null

	@property(cc.Sprite)
	node_title:cc.Sprite = null


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
			"http.onClubGame":this.http_onClubGame,
			"http.reqFangKaCfg":this.http_reqFangKaCfg,  
		}
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image, this.ui.btn_room, this.btn_room_cb,"点击房间");
		
	}
	start () {
	}
	//网络事件回调begin
	private http_onClubGame(msg){
		let data = msg.states;
        if (data.state == CLUB_GAME_STATE.COLSE){
			this.finish();
		}else if (data.state == CLUB_GAME_STATE.REMOVE){
			this.model.setRoomCount(data.count);
			this.view.refreshRoomCount();
		}
	}

	private http_reqFangKaCfg(){
		// this.start_sub_module(G_MODULE.GameRoomRule, (uiRoom:Prefab_RoomRuleCtrl)=>{
		// 	uiRoom.OpenAddGrayLayer();
		// 	uiRoom.openCloseBtn();
		// }, "Prefab_RoomRuleCtrl");
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private btn_room_cb(){
		//console.log("btn_room_cb"+this.model.getRoomId())
		let roomId = this.model.getRoomId(); 
		RoomMgr.getInstance().reqFangKaCfg(roomId);
	}
	//end
}