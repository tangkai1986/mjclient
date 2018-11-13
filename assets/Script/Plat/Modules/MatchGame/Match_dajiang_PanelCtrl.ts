/*
author: JACKY
日期:2018-05-03 16:18:18
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : redPacket_enlistCtrl;
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
		btn_back:null,
		lbl_title:null,
		btn_remind:null,
		btn_gamerule:null,
		btn_share:null,
		Prefab_chat:null,
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
		this.addGrayLayer();
		this.ui.btn_back = ctrl.btn_back;
		this.ui.lbl_title = ctrl.lbl_title;
		this.ui.btn_remind = ctrl.btn_remind;
		this.ui.btn_gamerule = ctrl.btn_gamerule;
		this.ui.btn_share = ctrl.btn_share;
		this.ui.Prefab_chat = ctrl.Prefab_chat;
		this.initChat();
	}
	initChat(){
		let chat_prefab = cc.instantiate(this.ui.Prefab_chat);
		chat_prefab.parent = this.node;
	}
}
//c, 控制
@ccclass
export default class redPacket_enlistCtrl extends BaseCtrl {
	view:View
	model:Model
	//这边去声明ui组件
	@property(cc.Node)
	btn_back:cc.Node = null
	@property(cc.Label)
	lbl_title:cc.Label = null
	@property(cc.Node)
	btn_remind:cc.Node = null
	@property(cc.Node)
	btn_gamerule:cc.Node = null
	@property(cc.Node)
	btn_share:cc.Node = null
	@property(cc.Prefab)
	Prefab_chat:cc.Prefab = null

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
		this.connect(G_UiType.button,this.ui.btn_back,this.backBtn_cb,'点击返回');
		this.connect(G_UiType.button,this.ui.btn_remind,this.remindBtn_cb,'点击提醒');
		this.connect(G_UiType.button,this.ui.btn_gamerule,this.ruleBtn_cb,'点击规则');
		this.connect(G_UiType.button,this.ui.btn_share,this.shareBtn_cb,'点击分享');
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	backBtn_cb(){
		//console.log("点击返回");
		this.finish();
	}
	remindBtn_cb(){
		//console.log("点击提醒");
	}
	ruleBtn_cb(){
		//console.log("点击规则");
	}
	shareBtn_cb(){
		//console.log("点击分享");
	}
	//end
}