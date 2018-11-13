/*
author: JACKY
日期:2018-04-08 16:39:53
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import BagMgr from "../../GameMgrs/BagMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_bagItemCtrl;
//模型，数据处理
class Model extends BaseModel{
	itemPrice:any = null;
	itemType:any = null;
	constructor()
	{
		super();
		this.itemPrice = BagMgr.getInstance().getItemPrice();
		this.itemType = BagMgr.getInstance().getItemType();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        btn_linqu:ctrl.btn_linqu,
        img_hongbao:ctrl.img_hongbao,
        img_huafei:ctrl.img_huafei,
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
        this.updateItem();
	}
	updateItem(){
		// this.ui.img_hongbao.active = false;
        // this.ui.img_huafei.active = false;
	}
	
}
//c, 控制
@ccclass
export default class Prefab_bagItemCtrl extends BaseCtrl {
	view:View = null
	model:Model = null
	//这边去声明ui组件
	@property({
    	tooltip : '领取按钮',
    	type : cc.Node
    })
    btn_linqu:cc.Node = null;

    @property({
    	tooltip : '话费图片',
    	type : cc.Node
    })
    img_huafei:cc.Node = null;

    @property({
    	tooltip : '红包图片',
    	type : cc.Node
    })
	img_hongbao:cc.Node = null;

	@property({
    	tooltip : '金额',
    	type : cc.Label
    })
	lab_price:cc.Label = null;

	@property({
    	tooltip : '描述',
    	type : cc.Label
    })
	lab_detial:cc.Label = null;

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