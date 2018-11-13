import { Prefab } from './../../../../../creator.d';
/*
author: JACKY
日期:2018-05-03 15:44:47
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : redPacket_rowContentCtrl;
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
		lbl_title:null,
		lbl_game:null,
		lbl_saizhi:null,
		lbl_diamondNum:null,
		btn_enlist:null,
		Prefab_enlist:null,
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
		this.ui.lbl_diamondNum = ctrl.lbl_diamondNum;
		this.ui.lbl_game = ctrl.lbl_game;
		this.ui.lbl_saizhi = ctrl.lbl_saizhi;
		this.ui.lbl_title = ctrl.lbl_title;
		this.ui.btn_enlist = ctrl.btn_enlist;
		this.ui.Prefab_enlist = ctrl.Prefab_enlist;
	}
}
//c, 控制
@ccclass
export default class redPacket_rowContentCtrl extends BaseCtrl {
	view:View
	model:Model
	//这边去声明ui组件
	@property(cc.Label)
	lbl_title:cc.Label = null
	@property(cc.Node)
	lbl_game:cc.Label = null
	@property(cc.Label)
	lbl_saizhi:cc.Label = null
	@property(cc.Label)
	lbl_diamondNum:cc.Label = null
	@property(cc.Node)
	btn_enlist:cc.Node = null
	@property(cc.Prefab)
	Prefab_enlist:cc.Prefab = null

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
		this.connect(G_UiType.button,this.ui.btn_enlist,this.EnlistBtn_cb,'点击报名');
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	EnlistBtn_cb(){
		//console.log("baoming+1");
		this.start_sub_module(G_MODULE.redPacket_prefab);
	}
	//end
}