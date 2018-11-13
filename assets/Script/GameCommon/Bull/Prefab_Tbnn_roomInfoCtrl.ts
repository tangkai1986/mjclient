/*
author: YOYO
日期:2018-05-07 11:23:27
*/
import BaseModel from "../../Plat/Libs/BaseModel";
import BaseView from "../../Plat/Libs/BaseView";
import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";
import LocalStorage from "../../Plat/Libs/LocalStorage";
//MVC模块,
const {ccclass, property} = cc._decorator;

const SETTLERULE = {
	0:"牛牛X4/牛九X3/牛八X2/牛七X2",
	1:"牛牛X3/牛九X2/牛八X2"
}
let ctrl : Prefab_Tbnn_roomInfoCtrl;
let BullConst = null;
//模型，数据处理
class Model extends BaseModel{
	gamename:null;		//游戏名
	roundCount:null;	//总局数
	minChip:null; 		//底分
	wanglaiLimit:null;	//王癞玩法
	settleRule:null;	//翻倍
	roomInfo:any;
	bgState:any;
	isAn:any;
	constructor()
	{
		super();
		BullConst = RoomMgr.getInstance().getDef();

		let room = RoomMgr.getInstance();
		this.gamename = room.getGameName();					
		this.roomInfo =RoomMgr.getInstance().getFangKaCfg();
		this.roundCount = this.roomInfo.v_roundcount;	
		this.minChip = this.roomInfo.v_minChip;
		this.wanglaiLimit = this.roomInfo.v_wanglaiLimit;
		this.settleRule = this.roomInfo.v_settleRule;
	}
	initBGState (){
        this.bgState = LocalStorage.getInstance().getBullRoomBGCfg();
        if(!this.bgState){
            this.bgState = 1;
            LocalStorage.getInstance().setBullRoomBGCfg(this.bgState);
        }
	}
	isFontan(){
		let room = RoomMgr.getInstance();
		if(room.isGameStarted() || !room.isFirstRound()){
			this.isAn = true;
		}else{
			this.isAn = false;
		}
		return this.isAn;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		node_label1:null,
		node_label2:null,
		node_label3:null,
		node_label4:null,
		font_an_lan:null,
		font_an_lv:null,
		font_liang_lan:null,
		font_liang_lv:null,
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
		this.ui.node_label1 = ctrl.node_label1;
		this.ui.node_label2 = ctrl.node_label2;
		this.ui.node_label3 = ctrl.node_label3;
		this.ui.node_label4 = ctrl.node_label4;
		this.ui.font_an_lan = ctrl.font_an_lan;
		this.ui.font_an_lv = ctrl.font_an_lv;
		this.ui.font_liang_lan = ctrl.font_liang_lan;
		this.ui.font_liang_lv = ctrl.font_liang_lv;
		this.initRoomInfo();
	}

	initRoomInfo(){
		//游戏名字-局数
		let string =`${this.model.gamename}-${this.model.roundCount}局`;
		this.ui.node_label1.getComponent(cc.Label).string = string;
		//底分  
		string = `底分：${this.model.minChip}`
		this.ui.node_label2.getComponent(cc.Label).string = string;
		//王癞玩法
		string =this.model.wanglaiLimit==1?"王癞玩法":""
		this.ui.node_label4.getComponent(cc.Label).string = string;
		//翻倍
		string = this.model.settleRule ==0?SETTLERULE["0"]:SETTLERULE["1"];
		this.ui.node_label3.getComponent(cc.Label).string = string;
		//更改字体
		this.updateFont();
		this.model.wanglaiLimit==0?this.ui.node_label2.x = 0:this.ui.node_label2.x = -96;
	}
	//更改字体
	updateFont() {
		this.model.initBGState();
		let state = this.model.bgState;
		if (state == 1 && !this.model.isFontan()) {
			this.ui.node_label1.getComponent(cc.Label).font = this.ui.font_liang_lv;
			this.ui.node_label2.getComponent(cc.Label).font = this.ui.font_liang_lv;
			this.ui.node_label3.getComponent(cc.Label).font = this.ui.font_liang_lv;
			this.ui.node_label4.getComponent(cc.Label).font = this.ui.font_liang_lv;
		} else if (state == 2 && !this.model.isFontan()) {
			this.ui.node_label1.getComponent(cc.Label).font = this.ui.font_liang_lan;
			this.ui.node_label2.getComponent(cc.Label).font = this.ui.font_liang_lan;
			this.ui.node_label3.getComponent(cc.Label).font = this.ui.font_liang_lan;
			this.ui.node_label4.getComponent(cc.Label).font = this.ui.font_liang_lan;
		}else if(state == 1 && this.model.isFontan()){
			this.ui.node_label1.getComponent(cc.Label).font = this.ui.font_an_lv;
			this.ui.node_label2.getComponent(cc.Label).font = this.ui.font_an_lv;
			this.ui.node_label3.getComponent(cc.Label).font = this.ui.font_an_lv;
			this.ui.node_label4.getComponent(cc.Label).font = this.ui.font_an_lv;
		}else if(state == 2 && this.model.isFontan()){
			this.ui.node_label1.getComponent(cc.Label).font = this.ui.font_an_lan;
			this.ui.node_label2.getComponent(cc.Label).font = this.ui.font_an_lan;
			this.ui.node_label3.getComponent(cc.Label).font = this.ui.font_an_lan;
			this.ui.node_label4.getComponent(cc.Label).font = this.ui.font_an_lan;
		}
	}
}
//c, 控制
@ccclass
export default class Prefab_Tbnn_roomInfoCtrl extends BaseCtrl {
	view:View
	model:Model
	//这边去声明ui组件
	//=================label
	@property({
        type:cc.Node,
        displayName:"游戏名+局数"
    })
	node_label1:cc.Node= null
	
	@property({
        type:cc.Node,
        displayName:"底分"
    })
	node_label2:cc.Node= null

	@property({
        type:cc.Node,
        displayName:"王癞"
    })
	node_label4:cc.Node= null
	
	@property({
        type:cc.Node,
        displayName:"翻倍"
    })
	node_label3:cc.Node= null
	//=====================font
	@property({
        type:cc.Font,
        displayName:"亮-绿"
    })
	font_liang_lv:cc.Font= null

	@property({
        type:cc.Font,
        displayName:"亮-蓝"
    })
	font_liang_lan:cc.Font= null

	@property({
        type:cc.Font,
        displayName:"暗-绿"
    })
	font_an_lv:cc.Font= null

	@property({
        type:cc.Font,
        displayName:"暗-蓝"
    })
	font_an_lan:cc.Font= null

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
		this.n_events[BullConst.clientEvent.onStart] = this.onStart;
		this.n_events['connector.entryHandler.enterRoom'] = this.onMyEnterRoom;//自己进入的
	}
	//定义全局事件
	defineGlobalEvents()
	{
		this.g_events = {
            'setRoomInfoFont':this.setRoomInfoFont,
        } 
	}
	//绑定操作的回调
	connectUi()
	{
	}
	start () {
	}
	//网络事件回调begin
	//游戏开始
	onStart(msg){
		this.view.updateFont();
	}
	//自己进入
	onMyEnterRoom(){
		this.view.updateFont();
	}
	//end
	//全局事件回调begin
	setRoomInfoFont(){
		this.view.updateFont();
	}
	//end
	//按钮或任何控件操作的回调begin
	//end
}