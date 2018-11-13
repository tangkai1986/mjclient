/*
author: HJB
日期:2018-02-23 15:28:21
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

import BehaviorMgr from "../../GameMgrs/BehaviorMgr"
import ClubMgr from "../../GameMgrs/ClubMgr"
import UserMgr from "../../GameMgrs/UserMgr"

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Club_LobbyTopCtrl;
//模型，数据处理
class Model extends BaseModel{
	private user_identity:string = null;
	private apply_dot:number = null;
	private club_id:number = null;
	constructor()
	{
		super();
		this.user_identity = IDENTITY_TYPE.MEMBER;
		this.apply_dot = 0;
		this.club_id = BehaviorMgr.getInstance().getClubSelectId();
		this.refreshIdentity();
		this.refreshApplyDot();	
	}
	public refreshIdentity(){
		this.user_identity = ClubMgr.getInstance().getClubIdentity(this.club_id);
	}
	public getIdentity(){
		return this.user_identity;
	}
	public refreshApplyDot(){
		this.apply_dot = ClubMgr.getInstance().getClubApplyDot(this.club_id);
	}
	public getApply(){
		return this.apply_dot;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		btn_record:null,
		btn_apply:null,
		btn_member:null,
		apply_dot:null,
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
		this.ui.btn_record = ctrl.btn_record;
		this.ui.btn_apply = ctrl.btn_apply;
		this.ui.btn_member = ctrl.btn_member;
		this.ui.apply_dot = ctrl.apply_dot;

		this.refreshBtn();
		this.refreshDot();
	}

	refreshBtn(){
		if (this.model.getIdentity() == IDENTITY_TYPE.MEMBER){
			this.ui.btn_apply.active = false;
			this.ui.btn_apply.pauseSystemEvents(true);
		}else{
			this.ui.btn_apply.active = true;
			this.ui.btn_apply.resumeSystemEvents(true);
		}
	}
	refreshDot(){
		if (this.model.getApply() == 0){
			this.ui.apply_dot.active = false;
		}else{
			this.ui.apply_dot.active = true;
		}
	}
}
//c, 控制
@ccclass
export default class Club_LobbyTopCtrl extends BaseCtrl {
	//这边去声明ui组件

	@property(cc.Node)
	btn_record:cc.Node = null

	@property(cc.Node)
	btn_apply:cc.Node = null

	@property(cc.Node)
	btn_member:cc.Node = null

	@property(cc.Node)
	apply_dot:cc.Node = null

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
		this.connect(G_UiType.image, this.ui.btn_record,this.btn_record_cb,"战绩按钮");
		this.connect(G_UiType.image, this.ui.btn_apply,this.btn_apply_cb,"申请按钮");
		this.connect(G_UiType.image, this.ui.btn_member,this.btn_member_cb,"成员按钮");
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin

	private btn_record_cb(node, event){
		//console.log("btn_record_cb");
		this.start_sub_module(G_MODULE.ClubRecord)
	}

	private btn_apply_cb(node, event){
		//console.log("btn_apply_cb");
		this.start_sub_module(G_MODULE.ClubApplication)
	}

	private btn_member_cb(node, event){
		//console.log("btn_member_cb");
		this.start_sub_module(G_MODULE.ClubMember)
	}


	//end
}