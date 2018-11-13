/*
author: Justin
日期:2018-01-10 21:34:44
*/
import BaseControl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UiMgr from "../../GameMgrs/UiMgr";
import ModuleMgr from "../../GameMgrs/ModuleMgr";
import SettingMgr from "../../GameMgrs/SettingMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_SettingCtrl;
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
        node_CloseBtn : null,
        button_ControlSetting : null,
        button_MusicSetting : null,
        button_NotifySetting : null,
        prefab_MusicItem : null,
        prefab_OptionItem : null,
        prefab_NotifyItem : null,
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
        this.ui.node_CloseBtn = ctrl.CloseBtn;
        this.ui.button_ControlSetting = ctrl.ControlSetting;
        this.ui.button_ControlSetting.interactable = false
        this.ui.button_MusicSetting = ctrl.MusicSetting;
        this.ui.button_NotifySetting = ctrl.NotifySetting;
    }
}
//c, 控制
@ccclass
export default class Prefab_SettingCtrl extends BaseControl {
	//这边去声明ui组件
	@property({
		tooltip : "关闭界面按钮",
		type : cc.Node
	})
	CloseBtn : cc.Node = null;

	@property({
		tooltip : "切换到操作设置",
		type : cc.Node
	})
	ControlSetting : cc.Node = null;

	@property({
		tooltip : "切换到游戏声音",
		type : cc.Node
	})
	MusicSetting : cc.Node = null;

	@property({
		tooltip : "切换到推送通知",
		type : cc.Node
	})
	NotifySetting : cc.Node = null;

	@property({
		tooltip : "游戏声音部件",
		type : cc.Prefab
	})
	Prefab_MusicItem : cc.Prefab = null;

	@property({
		tooltip : "操作设置部件",
		type : cc.Prefab
	})
	Prefab_OptionItem : cc.Prefab = null;

	@property({
		tooltip : "推送通知部件",
		type : cc.Prefab
	})
	Prefab_NotifyItem : cc.Prefab = null;

	
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
		this.initMvc(Model,View);
		//console.log('myInfo:', this.model.myInfo);
		this.showChildView(this.Prefab_OptionItem);
		SettingMgr.getInstance().setIsPlaza(true);
	}

	showChildView (prefabItem) {
		if (this.node.getChildByName("sub_view_item")) {
			this.node.getChildByName("sub_view_item").removeFromParent();
		}
		if (!prefabItem) return;
		let item = cc.instantiate(prefabItem);
		item.setName("sub_view_item");
		this.node.addChild(item);
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
		this.connect(G_UiType.button, this.ui.node_CloseBtn, this._onClick_Close, '点击关闭')
		this.connect(G_UiType.button, this.ui.button_ControlSetting, this.ControlSetting_cb, '切换到操作设置')
		this.connect(G_UiType.button, this.ui.button_MusicSetting, this.MusicSetting_cb, '切换到音乐设置')
		this.connect(G_UiType.button, this.ui.button_NotifySetting, this.NotifySetting_cb, '切换到推送设置')
	}
	start () {
	}
    //网络事件回调begin
	//end
	//全局事件回调begin
	//end


	//按钮或任何控件操作的回调begin
	/**
	 * 点击关闭
	 * @param event 
	 */
	private _onClick_Close (event) : void {
		let msg = {
			controlInfo:null,
			musicInfo:null,
			notifyInfo:null,
		}
		msg.controlInfo = SettingMgr.getInstance().getControlInfo();
		msg.musicInfo = SettingMgr.getInstance().getMusicInfo();
		msg.notifyInfo = SettingMgr.getInstance().getNotifyInfo(); 
		this.finish();
    }
    //切换到操作设置
    private ControlSetting_cb(){
    	this.showChildView(this.Prefab_OptionItem);
    	//console.log('ControlSetting')
    }

    //切换到音乐设置
    private MusicSetting_cb(){
     	this.showChildView(this.Prefab_MusicItem);
    	//console.log('MusicSetting')
    }

    //切换到推送设置
    private NotifySetting_cb(){
    	this.showChildView(this.Prefab_NotifyItem);
    	//console.log('NotifySetting')
    }
    //end
}