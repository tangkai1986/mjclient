/*
author: JACKY
日期:2018-01-10 17:16:44
*/
import BaseControl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UiMgr from "../../GameMgrs/UiMgr";
import ModuleMgr from "../../GameMgrs/ModuleMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : NodeLeftCtrl;
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
	};
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
		this.ui['btn_sign']=ctrl.btn_sign;
		this.ui['btn_first_punch']=ctrl.btn_first_punch;
	}
}
//c, 控制
@ccclass
export default class NodeLeftCtrl extends BaseControl {
	//这边去声明ui组件
	@property(cc.Node)
	btn_sign:cc.Node = null

	@property(cc.Node)
	btn_first_punch:cc.Node = null;
	
    // @property({
	// 	tooltip : "金币场按钮",
	// 	type : cc.Node
	// })
    // GoldModeBtn : cc.Node = null;

	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
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
		this.connect(G_UiType.image,this.ui.btn_sign,this.btn_sign_cb,"签到");
		this.connect(G_UiType.image,this.ui.btn_first_punch,this.btn_first_punch_cb,"首冲");
		// this.connect(G_UiType.image,this.GoldModeBtn,this.GoldModeBtn_cb,"金币场");
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	btn_sign_cb(node,event){
		//console.log("btn_sign_cb");
		this.start_sub_module(G_MODULE.SignIn);
	}
	btn_first_punch_cb(node,event){
		//console.log("btn_first_punch_cb");
	}
	// GoldModeBtn_cb(node,event){
	// 	this.start_sub_module(G_MODULE.GoldMode);
	// }
	//end
}