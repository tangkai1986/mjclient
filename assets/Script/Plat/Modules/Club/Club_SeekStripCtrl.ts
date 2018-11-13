/*
author: HJB
日期:2018-02-27 14:06:08
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

import BehaviorMgr from "../../GameMgrs/BehaviorMgr";
import ClubMgr from "../../GameMgrs/ClubMgr";
import FrameMgr from "../../GameMgrs/FrameMgr";
import UiMgr from "../../GameMgrs/UiMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Club_SeekStripCtrl;
//模型，数据处理
class Model extends BaseModel{
	private ClubData = null;
	private node_max:number = 0;
	private name_slice:number = 0;
	constructor()
	{
		super();
		this.ClubData = BehaviorMgr.getInstance().getClubSeekData();
		this.node_max = 138;
		this.name_slice = 6;
	}
	getClubIcon(){
		return this.ClubData.avater
	}
	getClubName(){
		return this.ClubData.name
	}
	getClubNotice(){
		return this.ClubData.notice
	}
	getClubCount(){
		return ""+this.ClubData.mCount+"/"+this.ClubData.mMax
	}
	getClubCaptainName(){
		return this.ClubData.captainName
	}
	getClubId(){
		return this.ClubData.id;
	}
	getClubShowId(){
		return this.ClubData.no;
	}
	getClubApply(){
		return this.ClubData.apply;
	}
	setClubApply(data){
		this.ClubData.apply = data;
	}
	getNodeMax(){
		return this.node_max;
	}
	getNameSlice(){
		return this.name_slice;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		club_icon:null,
		club_name:null,
		club_notice:null,
		club_count:null,
		club_captain_name:null,
		club_id:null,
		club_apply:null,
		node_captain:null,
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
		this.ui.club_icon = ctrl.club_icon;
		this.ui.club_name = ctrl.club_name;
		this.ui.club_notice = ctrl.club_notice;
		this.ui.club_count = ctrl.club_count;
		this.ui.club_captain_name = ctrl.club_captain_name;
		this.ui.club_id = ctrl.club_id;
		this.ui.club_apply = ctrl.club_apply;
		this.ui.node_captain = ctrl.node_captain;

		this.refreshClubStrip();
	}
	refreshClubStrip(){
		//this.ui.club_icon.SpriteFrame = ctrl.club_icon;
		UiMgr.getInstance().setUserHead(this.ui.club_icon, 0, this.model.getClubIcon());
		this.ui.club_name.string = this.model.getClubName();
		this.ui.club_notice.string = this.CutOutChat(this.model.getClubNotice(), 18);
		this.ui.club_count.string = this.model.getClubCount();
		let name = this.model.getClubCaptainName();
		this.ui.club_captain_name.string = name;
		if (this.ui.node_captain.width >= this.model.getNodeMax()){
			name  = name.slice(0, this.model.getNameSlice()) + "...";
			this.ui.club_captain_name.string = name;
		}
		this.ui.club_id.string = this.model.getClubShowId();
	}
}
//c, 控制
@ccclass
export default class Club_SeekStripCtrl extends BaseCtrl {
	//这边去声明ui组件

	@property(cc.Sprite)
	club_icon:cc.Sprite = null

	@property(cc.Label)
	club_name:cc.Label = null

	@property(cc.Label)
	club_notice:cc.Label = null

	@property(cc.Label)
	club_count:cc.Label = null

	@property(cc.Label)
	club_captain_name:cc.Label = null

	@property(cc.Label)
	club_id:cc.Label = null

	@property(cc.Node)
	club_apply:cc.Node = null

	@property(cc.Node)
	node_captain:cc.Node = null

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
		this.connect(G_UiType.image, this.ui.club_apply, this.club_apply_cb, "点击申请")
	}
	start () {
	}
	
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private club_apply_cb(){
		//console.log("club_apply_cb:"+this.model.getClubId());
		if (this.model.getClubApply() == 0)
			ClubMgr.getInstance().reqClubApplyJoin(this.model.getClubId());
		else
			FrameMgr.getInstance().showTips("等待馆主受理",null, 35, cc.color(0,255,50));
	}
	//end
}