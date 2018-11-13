/*
author: YOYO
日期:2018-05-04 09:45:40
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Match_hongbao_scrollCtrl;
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
		content:ctrl.content,
		hongbaoPre:ctrl.hongbaoPre,
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
		this.addItem();
	}

	addItem(){
		this.ui.content.width =this.ui.hongbaoPre.data.width * 2;
		this.ui.content.height =this.ui.hongbaoPre.data.height;
		for(let i = 0;i<5;i++){
			let item = cc.instantiate(this.ui.hongbaoPre);
			item.parent = this.ui.content;
			this.ui.content.height += item.height;
		}
	}
}
//c, 控制
@ccclass
export default class Match_hongbao_scrollCtrl extends BaseCtrl {
	view:View
	model:Model
	//这边去声明ui组件
	@property(cc.Node)
	content: cc.Node = null;
	@property(cc.Prefab)
	hongbaoPre: cc.Prefab = null;
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