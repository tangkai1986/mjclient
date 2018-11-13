/*
author: HJB
日期:2018-03-02 14:08:24
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_HintBoxCtrl;
//模型，数据处理
class Model extends BaseModel{
	private hint_content:string = null
	private hintCall = null
	constructor()
	{
		super();
		this.hint_content = "";
	}
	public setHintContent(data){
		this.hint_content = data;
	}
	public getHintContent(){
		return this.hint_content;
	}
	public getHintCall(){
		return this.hintCall;
	}
	public setHintCall(call){
		this.hintCall = call;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		label_content:null,
		node_confirm:null,
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
		this.ui.label_content = ctrl.label_content;
		this.ui.node_confirm = ctrl.node_confirm;
	}
	refreshContent(){
		this.ui.label_content.string = this.model.getHintContent();
	}
}
//c, 控制
@ccclass
export default class Prefab_HintBoxCtrl extends BaseCtrl {
	//这边去声明ui组件

	@property(cc.Label)
	label_content:cc.Label = null

	@property(cc.Node)
	node_confirm:cc.Node = null


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
		this.connect(G_UiType.image, this.ui.node_confirm,this.node_confirm_cb, "点击确定按钮");	
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	public SetContent(content:string, call?:Function){
		this.model.setHintContent(content);
		this.model.setHintCall(call);
		this.view.refreshContent();
	}
	//end
	//按钮或任何控件操作的回调begin
	private node_confirm_cb(node, event){
		//console.log("node_confirm_cb");
		let call = this.model.getHintCall()
		if (call != null){
			call();
		}
		this.finish();
	}
	//end
}