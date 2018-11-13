/*
author: HJB
日期:2018-03-14 14:41:08
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

import BehaviorMgr from "../../GameMgrs/BehaviorMgr";
import UserMgr from "../../GameMgrs/UserMgr";
import ClubMgr from "../../GameMgrs/ClubMgr";
import FrameMgr from "../../GameMgrs/FrameMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Club_RechargeCtrl;
//模型，数据处理
class Model extends BaseModel{
	private club_id = null;
	private user_info = null;
	private diamond_min:number = 1
	private diamondCount:number = 0
	constructor()
	{
		super();
		this.diamond_min = 1;
		this.diamondCount = this.diamond_min;
		this.club_id = BehaviorMgr.getInstance().getClubSelectId();
		this.user_info = UserMgr.getInstance().getMyInfo()
	}
	public getClubId(){
		return this.club_id;
	}
	public getUserDiamond(){
		return this.user_info.gold;
	}
	public getDiamond(){
		return this.diamondCount;
	}
	public setDiamond(data){
		this.diamondCount = data;
	}
	public addDiamond(){
		this.diamondCount++;
		this.diamondCount = Math.min(this.diamondCount, this.getUserDiamond());
	}
	public minusDiamond(){
		this.diamondCount--;
		this.diamondCount = Math.max(this.diamondCount, this.diamond_min)
	}
	public maxDiamond(){
		this.diamondCount = this.getUserDiamond();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		btn_minus:null,
		btn_add:null,
		btn_max:null,
		node_edit:null,
		btn_confirm:null,
		btn_close:null,
		label_diamond:null,
		edit_club_diamond:null,
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
		this.ui.btn_minus = ctrl.btn_minus;
		this.ui.btn_add = ctrl.btn_add;
		this.ui.btn_max = ctrl.btn_max;
		this.ui.node_edit = ctrl.node_edit;
		this.ui.btn_confirm = ctrl.btn_confirm;
		this.ui.btn_close = ctrl.btn_close;
		this.ui.label_diamond = ctrl.label_diamond;
		this.ui.edit_club_diamond = this.ui.node_edit.getComponent(cc.EditBox);

		this.initUiEdit();
		this.refreshDiamond();
		this.setEditString();
	}

	initUiEdit(){
		//console.log(this.ui.edit_club_diamond)
		this.ui.edit_club_diamond.setFont = "Texture/Plat/setting/fzzyjt.ttf";
		this.ui.edit_club_diamond.setPlaceholderFont = "Texture/Plat/setting/fzzyjt.ttf";
	}

	refreshDiamond(){
		this.ui.label_diamond.string = this.model.getUserDiamond();
	}

	setEditString(){
		this.ui.edit_club_diamond.string = this.model.getDiamond();
	}
}
//c, 控制
@ccclass
export default class Club_RechargeCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property(cc.Node)
	btn_minus:cc.Node = null

	@property(cc.Node)
	btn_add:cc.Node = null

	@property(cc.Node)
	btn_max:cc.Node = null

	@property(cc.Node)
	node_edit:cc.Node = null

	@property(cc.Node)
	btn_confirm:cc.Node = null

	@property(cc.Node)
	btn_close:cc.Node = null

	@property(cc.Label)
	label_diamond:cc.Label = null

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
			"http.reqClubRecharge":this.http_reqClubRecharge,
		}
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image,this.ui.btn_minus,this.btn_minus_cb, "递减");
		this.connect(G_UiType.image,this.ui.btn_add,this.btn_add_cb, "递增");
		this.connect(G_UiType.image,this.ui.btn_max,this.btn_max_cb, "最大值");
		this.connect(G_UiType.image,this.ui.btn_confirm,this.btn_confirm_cb, "确定");
		this.connect(G_UiType.image,this.ui.btn_close,this.btn_close_cb, "取消");
		this.connect(G_UiType.edit,this.ui.node_edit,this.node_edit_cb, "输入监听");
	}
	start () {
	}
	//网络事件回调begin
	private http_reqClubRecharge(msg){
		this.finish();
		UserMgr.getInstance().reqMyInfo();
		FrameMgr.getInstance().showMsgBox("充值成功", ()=>{}, "提示");
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin

	private btn_minus_cb(node, event){
		this.model.minusDiamond();
		this.view.setEditString();
	}

	private btn_add_cb(node, event){
		this.model.addDiamond();
		this.view.setEditString();
	}

	private btn_max_cb(node, event){
		this.model.maxDiamond();
		this.view.setEditString();
	}

	private btn_confirm_cb(node, event){
		if (this.model.getDiamond() != 0){
			ClubMgr.getInstance().reqClubRecharge(this.model.getClubId(), this.model.getDiamond());
		}else{
			FrameMgr.getInstance().showTips("请正确输入数字");
		}
	}

	private btn_close_cb(node, event){
		this.finish();
	}

	private node_edit_cb(str, event){
		//console.log("node_edit_cb");
		if (str == "editing-did-ended"){
			let content = this.ui.edit_club_diamond.string;
			this.model.setDiamond(Number(content));
		}
	}

	//end
}