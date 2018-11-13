/*
author: YOYO
日期:2018-04-03 10:46:32
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import SettingMgr from "../../GameMgrs/SettingMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : RoomSetting_mjCtrl;
//模型，数据处理
class Model extends BaseModel{
    controlInfo:any = null
	constructor()
	{
		super();
        this.controlInfo = SettingMgr.getInstance().getControlInfo();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    model:Model
	ui={
        //在这里声明ui
        button_mjClickToggle:null,
        button_mjDragToggle:null,
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
        this.ui.button_mjClickToggle = ctrl.mjClickToggle;
		this.ui.button_mjDragToggle = ctrl.mjDragToggle;
		this.ui.button_mjClickToggle.getComponent(cc.Toggle).isChecked = this.model.controlInfo.bMjClick;
		this.ui.button_mjDragToggle.getComponent(cc.Toggle).isChecked = this.model.controlInfo.bMjDrag;
		this.ui.button_mjClickToggle.getComponent(cc.Toggle).enabled = !this.model.controlInfo.bMjClick;
		this.ui.button_mjDragToggle.getComponent(cc.Toggle).enabled = !this.model.controlInfo.bMjDrag;
		if (this.model.controlInfo.bMjClick && this.model.controlInfo.bMjDrag) {
			this.ui.button_mjClickToggle.getComponent(cc.Toggle).enabled = true
			this.ui.button_mjDragToggle.getComponent(cc.Toggle).enabled = true
    	}
	}
}
//c, 控制
@ccclass
export default class RoomSetting_mjCtrl extends BaseCtrl {
	view:View = null
	model:Model = null
	//这边去声明ui组件
    @property({
		tooltip : "点击出牌",
		type : cc.Node
	})
	mjClickToggle : cc.Node = null;

	@property({
		tooltip : "拖动出牌",
		type : cc.Node
	})
	mjDragToggle : cc.Node = null;
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
        this.connect(G_UiType.toggle, this.ui.button_mjClickToggle, this.mjControl_cb, '点击出牌设置')
		this.connect(G_UiType.toggle, this.ui.button_mjDragToggle, this.mjControl_cb, '点击拖动出牌设置')
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin
    
    private mjControl_cb(event){
    	let mjClickToggle = this.ui.button_mjClickToggle.getComponent(cc.Toggle)
		let mjDragToggle = this.ui.button_mjDragToggle.getComponent(cc.Toggle)
    	let clickNode = event.currentTarget;
    	if (clickNode.name == "clickToggle") {
			SettingMgr.getInstance().setProperty(!this.model.controlInfo.bMjClick, 'controlInfo', 'bMjClick');
    	}
    	if (clickNode.name == "dragToggle") {
			SettingMgr.getInstance().setProperty(!this.model.controlInfo.bMjDrag, 'controlInfo', 'bMjDrag');
    	}
    	this.model.controlInfo = SettingMgr.getInstance().getControlInfo();

		mjClickToggle.enabled = (clickNode.name == "clickToggle")
    	mjDragToggle.enabled = (clickNode.name == "dragToggle")
    	if (this.model.controlInfo.bMjClick && this.model.controlInfo.bMjDrag) {
			mjClickToggle.enabled = true
			mjDragToggle.enabled = true
    	}
    	//console.log('controlInfo:',this.model.controlInfo);
    }

	//end
}