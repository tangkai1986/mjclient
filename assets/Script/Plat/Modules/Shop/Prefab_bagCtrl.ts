/*
author: YOYO
日期:2018-04-08 16:07:44
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import BagMgr from "../../GameMgrs/BagMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_bagCtrl;
//模型，数据处理
class Model extends BaseModel{
	bagData:any=null;
	constructor()
	{
		super();

	}
	bagItemData(msg){
		this.bagData = msg;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        node_close:ctrl.node_close,
        prefab_bagItem:ctrl.prefab_bagItem,
        item_content:ctrl.item_content,
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

	}

	addItem(){
		//BagMgr.getInstance().setItemPrice(i)
		//BagMgr.getInstance().setItemType(type)
		let item = cc.instantiate(this.ui.prefab_bagItem)
		item.parent = this.ui.item_content;
	}
	cleanItems(){
		this.ui.item_content.removeAllChildren();
	}
}
//c, 控制
@ccclass
export default class Prefab_bagCtrl extends BaseCtrl {
	view:View = null
	model:Model = null
	//这边去声明ui组件
    @property(cc.Node)
    node_close:cc.Node = null

    @property(cc.Prefab)
    prefab_bagItem:cc.Prefab = null

    @property(cc.Node)
    item_content:cc.Node = null

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
		this.n_events={

		}
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.image, this.ui.node_close, this.node_close_cb, '点击关闭')
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin
    private node_close_cb(){
        this.finish();
    }
	//end
}