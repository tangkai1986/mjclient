import { Label } from './../../../../../creator.d';
/*
author: JACKY
日期:2018-05-03 19:07:13
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Match_inviteCodeCtrl;
//模型，数据处理
class Model extends BaseModel{
	constructor()
	{
		super();

	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		editbox_yaoqingma:null,
		lbl_wechat:null,
		btn_confirm:null,
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
		this.ui.editbox_yaoqingma = ctrl.editbox_yaoqingma;
		this.ui.lbl_wechat = ctrl.lbl_wechat;
		this.ui.btn_confirm = ctrl.btn_confirm;
	}
}
//c, 控制
@ccclass
export default class Match_inviteCodeCtrl extends BaseCtrl {
	view:View
	model:Model
	//这边去声明ui组件
	@property(cc.EditBox)
	editbox_yaoqingma:cc.EditBox = null

	@property(cc.Label)
	lbl_wechat:cc.Label = null

	@property(cc.Node)
	btn_confirm:cc.Node = null

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
		this.connect(G_UiType.button, this.ui.btn_confirm,this.btn_confirm_cb,"点击确定");
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	btn_confirm_cb(){
		//console.log("点击确定");
	}
	//end
}