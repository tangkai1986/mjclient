import BaseControl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UiMgr from "../../GameMgrs/UiMgr";
import ModuleMgr from "../../GameMgrs/ModuleMgr";
import SettingMgr from "../../GameMgrs/SettingMgr";
import LocalStorage from "../../Libs/LocalStorage";
import LoginMgr from "../../GameMgrs/LoginMgr";

const {ccclass, property} = cc._decorator;
let ctrl : Prefab_ControlSettingCtrl;
//模型，数据处理
class Model extends BaseModel{
	controlInfo:any = null;
	constructor()
	{
		super();
		this.controlInfo = SettingMgr.getInstance().getControlInfo();
		//console.log("controlInfo",this.controlInfo);
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        button_resetBtn:null,
        button_changeAccount:null,
        button_mjClickToggle:null,
        button_mjDragToggle:null,
        button_sssAutoMate:null,
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
		this.ui.button_resetBtn = ctrl.resetBtn;
		this.ui.button_changeAccount = ctrl.changeAccount;
		this.ui.button_mjClickToggle = ctrl.mjClickToggle;
		this.ui.button_mjDragToggle = ctrl.mjDragToggle;
		this.ui.button_sssAutoMate = ctrl.sssAutoMate;
		this.ui.button_mjClickToggle.getComponent(cc.Toggle).isChecked = this.model.controlInfo.bMjClick;
		this.ui.button_mjDragToggle.getComponent(cc.Toggle).isChecked = this.model.controlInfo.bMjDrag;
		this.ui.button_mjClickToggle.getComponent(cc.Toggle).enabled = !this.model.controlInfo.bMjClick;
		this.ui.button_mjDragToggle.getComponent(cc.Toggle).enabled = !this.model.controlInfo.bMjDrag;
		if (this.model.controlInfo.bMjClick && this.model.controlInfo.bMjDrag) {
			this.ui.button_mjClickToggle.getComponent(cc.Toggle).enabled = true
			this.ui.button_mjDragToggle.getComponent(cc.Toggle).enabled = true
    	}
		this.ui.button_sssAutoMate.getComponent(cc.Toggle).isChecked = this.model.controlInfo.bSssAutoMate;
    }
}
//控制器
@ccclass
export default class Prefab_ControlSettingCtrl extends BaseControl {

	@property({
		tooltip : "恢复默认设置",
		type : cc.Node
	})
	resetBtn : cc.Node = null;

	@property({
		tooltip : "切换账号",
		type : cc.Node
	})
	changeAccount : cc.Node = null;

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

	@property({
		tooltip : "智能出牌",
		type : cc.Node
	})
	sssAutoMate : cc.Node = null;

    onLoad () {
    	//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
		this.initMvc(Model,View);
    },

    //定义网络事件
	defineNetEvents()
	{

	}
	//定义全局事件
	defineGlobalEvents()
	{

	}

	connectUi()
	{
		this.connect(G_UiType.button, this.ui.button_resetBtn, this._onClick_resetBtn, '点击恢复默认设置')
		this.connect(G_UiType.button, this.ui.button_changeAccount, this.changeAccount_cb, '切换账号')
		this.connect(G_UiType.toggle, this.ui.button_mjClickToggle, this.mjControl_cb, '点击出牌设置')
		this.connect(G_UiType.toggle, this.ui.button_mjDragToggle, this.mjControl_cb, '点击拖动出牌设置')
		this.connect(G_UiType.toggle, this.ui.button_sssAutoMate, this.sssAutoMate_cb, '点击智能带牌设置')
	}

    start () {

    }

    private _onClick_resetBtn (event) : void {
		//console.log('恢复默认设置')
		this.ui.button_mjClickToggle.getComponent(cc.Toggle).isChecked = true;
		this.ui.button_mjDragToggle.getComponent(cc.Toggle).isChecked = true;
		this.ui.button_sssAutoMate.getComponent(cc.Toggle).isChecked = true;
		SettingMgr.getInstance().setProperty(true, 'controlInfo', 'bMjClick');
		SettingMgr.getInstance().setProperty(true, 'controlInfo', 'bMjDrag');
		SettingMgr.getInstance().setProperty(true, 'controlInfo', 'bSssAutoMate');
		//console.log('恢复默认设置',this.model.controlInfo);
    }

    private changeAccount_cb(event){
    	//切换到登录界面
		//console.log('切换账号');
		LoginMgr.getInstance().logout();		
    }

    private mjControl_cb(event){
    	let mjClickToggle = this.ui.button_mjClickToggle.getComponent(cc.Toggle)
		let mjDragToggle = this.ui.button_mjDragToggle.getComponent(cc.Toggle)
    	let clickNode = event.currentTarget;
    	if (clickNode.name == "clickToggle") {
    		//console.log('点击出牌设置')
			SettingMgr.getInstance().setProperty(!this.model.controlInfo.bMjClick, 'controlInfo', 'bMjClick');
    	}
    	if (clickNode.name == "dragToggle") {
			//console.log('拖动出牌设置')
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

    private sssAutoMate_cb(event){
   		//console.log(event.currentTarget.getComponent(cc.Toggle).isChecked)
   		let clickNode = event.currentTarget;
   		//发送智能带牌状态为not isChecked
   		SettingMgr.getInstance().setProperty(!this.model.controlInfo.bSssAutoMate, 'controlInfo', 'bSssAutoMate');
    	this.model.controlInfo = SettingMgr.getInstance().getControlInfo();
		//console.log('controlInfo:',this.model.controlInfo);
	}
}
