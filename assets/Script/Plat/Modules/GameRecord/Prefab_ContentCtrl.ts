/*
author: HJB
日期:2018-03-16 15:10:43
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import BehaviorMgr from "../../GameMgrs/BehaviorMgr";
import UiMgr from "../../GameMgrs/UiMgr";
import UserMgr from "../../GameMgrs/UserMgr";

const SCORE_COLOR = {
	WIN:new cc.Color(0xFF, 0x1F, 0x01),
	FAIL:new cc.Color(0x00, 0x9C, 0x0B),
}

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_ContentCtrl;
//模型，数据处理
class Model extends BaseModel{
	private player_data:any = null;
	private name_max:number = 3;
	private node_min:number = 211;
	private node_max:number = 265;
	constructor()
	{
		super();
		this.player_data = BehaviorMgr.getInstance().getRecordPlayerData();
		this.name_max = 3;
	}
	public getPlayerId(){
		return this.player_data.id;
	}
	public getPlayerIcon(){
		return this.player_data.icon;
	}
	public getPlayerName(){
		return this.player_data.name;
	}
	public getPlayerScore(){
		return this.player_data.score;
	}
	public getPlayerWin(){
		return this.player_data.win;
	}
	public getPlayeOwner(){
		return this.player_data.roomOwner;
	}
	public getNodeMin(){
		return this.node_min;
	}
	public getNodeMax(){
		return this.node_max;
	}
	public getNameSlice(){
		return this.name_max;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		label_icon:null,
		label_name:null,
		node_score:null,
		label_score:null,
		node_win:null,
		node_player:null,
		node_member:null,
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
		this.ui.label_icon = ctrl.label_icon;
		this.ui.label_name = ctrl.label_name;
		this.ui.node_score = ctrl.node_score;
		this.ui.label_score = ctrl.label_score;
		this.ui.node_win = ctrl.node_win;
		this.ui.node_player = ctrl.node_player;
		this.ui.node_member = ctrl.node_member;

		this.refreshIcon();
		this.refreshName();
		this.refreshScore();
		this.refreshWin();
		this.refreshPlayerBottom();
	}

	refreshIcon(){
		let icon = this.model.getPlayerIcon();
		if (typeof icon == "number")
			UiMgr.getInstance().setUserHead(this.ui.label_icon, icon);
		else
			UiMgr.getInstance().setUserHead(this.ui.label_icon, 0, icon);
	}
	refreshName(){
		let name = this.model.getPlayerName();
		if (name != null){
			if (this.node.width <= this.model.getNodeMin()){
				name  = name.slice(0, this.model.getNameSlice()) + "...";
			}else if (this.node.width <= this.model.getNodeMax()){
				name  = name.slice(0, this.model.getNameSlice()+2) + "...";
			}else{
				name  = name.slice(0, this.model.getNameSlice()*3) + "...";
			}
		}
		this.ui.label_name.string = name;
	}
	refreshScore(){
		if (this.model.getPlayerScore() >= 0){
			this.ui.node_score.color = SCORE_COLOR.WIN;
		}else{
			this.ui.node_score.color = SCORE_COLOR.FAIL;
		}
		this.ui.label_score.string = this.model.getPlayerScore();
	}
	refreshWin(){
		if (this.model.getPlayeOwner() == 1)
			this.ui.node_win.active = true;
		else
			this.ui.node_win.active = false;
	}
	refreshPlayerBottom(){
		let playerid = UserMgr.getInstance().getUid();
		if (this.model.getPlayerId() == playerid){
			this.ui.node_player.active = true;
		}else{
			this.ui.node_player.active = false;
		}
	}
}
//c, 控制
@ccclass
export default class Prefab_ContentCtrl extends BaseCtrl {
	//这边去声明ui组件

	@property(cc.Sprite)
	label_icon:cc.Sprite = null

	@property(cc.Label)
	label_name:cc.Label = null

	@property(cc.Node)
	node_score:cc.Node = null

	@property(cc.Label)
	label_score:cc.Label = null

	@property(cc.Node)
	node_win:cc.Node = null

	@property(cc.Node)
	node_player:cc.Node = null

	@property(cc.Node)
	node_member:cc.Node = null

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
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
}