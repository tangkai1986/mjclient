/*
author: YOYO
日期:2018-02-10 14:29:44
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_MoreGameCtrl;
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
		node_label:null,
		node_sure:null,
		node_close:null,
		node_edit:null
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
		this.ui.node_label = ctrl.Label;
		this.ui.node_close = ctrl.Btn_Close; 
		this.ui.node_sure = ctrl.Btn_Sure; 
		this.ui.node_edit = ctrl.Edit;
	}
}
//c, 控制
@ccclass
export default class Prefab_MoreGameCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property({
		tooltip:"确定按钮",
		type : cc.Node
	})
	Btn_Sure :cc.Node = null;
	
	@property({
		tooltip:"关闭按钮",
		type : cc.Node
	})
	Btn_Close :cc.Node = null;
	
	@property({
		tooltip:"输入框",
		type : cc.Node
	})
	Edit :cc.Node = null;
	
	@property({
		tooltip:"字数文本",
		type : cc.Node
	})
	Label :cc.Node = null;
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
		this.connect(G_UiType.image, this.Btn_Close, this.Btn_Close_cb, "关闭");
		this.connect(G_UiType.image, this.Btn_Sure, this.Btn_Sure_cb, "确认");
		this.connect(G_UiType.edit, this.Edit, this.editTextChenge_cb, "确认");
		this.connect(G_UiType.button, this.node, this.bg_cb, "点击更多界面的背景");
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
	private Btn_Close_cb() : void{
		this.finish();
	}

	private Btn_Sure_cb() : void{
		this.finish();
	}
	  //真实姓名
    private editTextChenge_cb(event){
		let length = this.ui.node_edit.getComponent(cc.EditBox).string.length;
		this.ui.node_label.getComponent(cc.Label).string = "("+length+"/200"+")";
	}
	private bg_cb () {

	}
}