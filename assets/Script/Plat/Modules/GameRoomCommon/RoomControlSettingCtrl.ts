/*
author: JACKY
日期:2018-03-07 11:25:18
*/
 
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UiMgr from "../../GameMgrs/UiMgr";
import ModuleMgr from "../../GameMgrs/ModuleMgr";
import SettingMgr from "../../GameMgrs/SettingMgr";
 
import FrameMgr from "../../GameMgrs/FrameMgr";
import RoomMgr from "../../GameMgrs/RoomMgr";
import UserMgr from "../../GameMgrs/UserMgr";
import QuitMgr from "../../GameMgrs/QuitMgr";
import BaseCtrl from "../../Libs/BaseCtrl";
import GEventDef from "../../GameMgrs/GEventDef";
import SwitchMgr from "../../GameMgrs/SwitchMgr";
const {ccclass, property} = cc._decorator;
let ctrl : RoomControlSettingCtrl;
//模型，数据处理
class Model extends BaseModel{
	public controlInfo:any = null;
	public playMethodSwitch = null;
	constructor()
	{
		super();
		this.controlInfo = SettingMgr.getInstance().getControlInfo();
		this.playMethodSwitch = SwitchMgr.getInstance().get_switch_play_method();
	}
	updateSwitch(msg){
		this.playMethodSwitch = msg.cfg.switch_play_method; 
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        button_BtnExit:null,
		button_BtnRule:null,
		button_BtnCheating:null,
		prefab_mahjongSetting:null,
		prefab_bullSetting:null,
		prefab_sssSetting: null,
		node_content:null,
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
		this.ui.button_BtnExit = ctrl.BtnExit;
		this.ui.button_BtnRule = ctrl.BtnRule;
		this.ui.button_BtnRule.active = false;
		this.ui.button_BtnCheating = ctrl.BtnCheating;
		this.ui.prefab_bullSetting = ctrl.prefab_bullSetting;
		this.ui.prefab_mahjongSetting = ctrl.prefab_mahjongSetting;
		this.ui.prefab_sssSetting = ctrl.prefab_sssSetting;
		this.ui.node_content = ctrl.node_content;
		//console.log("controlInfo",this.model.controlInfo);
		let setting = null;
		switch(SettingMgr.getInstance().getGameID()) {
            case 1:
		 		setting = cc.instantiate(ctrl.prefab_mahjongSetting);
                break;
            case 2:
		 		setting = cc.instantiate(ctrl.prefab_mahjongSetting);
                break;
            case 13:
				setting = cc.instantiate(ctrl.prefab_sssSetting);
                break;
            case 18:
		 		setting = cc.instantiate(ctrl.prefab_bullSetting);
				break;
			case 19:
				setting = cc.instantiate(ctrl.prefab_bullSetting);
			   break;
            case 20:
		 		setting = cc.instantiate(ctrl.prefab_bullSetting);
                break;
			default:
		 		setting = cc.instantiate(ctrl.prefab_mahjongSetting);
			break;
		}
		this.ui.node_content.addChild(setting);
		this.showSwitch();
	}
	showSwitch(){
		this.ui.button_BtnRule.active = this.model.playMethodSwitch == 1?true:false;
	}
}
//控制器
@ccclass
export default class RoomControlSettingCtrl extends BaseCtrl {

	@property({
		tooltip : "退出房间",
		type : cc.Node
	})
	BtnExit : cc.Node = null;

	@property({
		tooltip : "游戏玩法",
		type : cc.Node
	})
	BtnRule : cc.Node = null;

	@property({
		tooltip : "防作弊检测",
		type : cc.Node
	})
	BtnCheating : cc.Node = null;
	@property({
		tooltip : "牛牛设置",
		type : cc.Prefab
	})
	prefab_bullSetting : cc.Prefab = null;
	@property({
		tooltip : "麻将设置",
		type : cc.Prefab
	})
	prefab_mahjongSetting : cc.Prefab = null;

	@property({
		tooltip : "大菠萝设置",
		type : cc.Prefab
	})
	prefab_sssSetting : cc.Prefab = null;

	@property({
		tooltip : "content",
		type : cc.Node
	})
	node_content : cc.Node = null;

    onLoad () {
    	//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
		this.initMvc(Model,View);
    }

    //定义网络事件
	defineNetEvents()
	{
		this.n_events={
            'http.reqGameSwitch':this.http_reqGameSwitch,
        }
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}

	connectUi()
	{
		this.connect(G_UiType.button, this.ui.button_BtnExit, this.onBtnExit_cb, '退出房间')
		this.connect(G_UiType.button, this.ui.button_BtnRule, this.onBtnRule_cb, '点击游戏玩法')
		this.connect(G_UiType.button, this.ui.button_BtnCheating, this.onBtnCheating_cb, '点击防作弊检测')
	}

    start () {

	}
	
	http_reqGameSwitch(msg){
        this.model.updateSwitch(msg)
        this.view.showSwitch();
	}
	
    private onBtnExit_cb (event) : void {
		let draw=RoomMgr.getInstance().isGameStarted
		//console.log("这是开始游戏的证明======",draw)
		if(RoomMgr.getInstance().isGameStarted()) {
			//旁观者退出游戏
			if(RoomMgr.getInstance().isWather()){
				FrameMgr.getInstance().showDialog("你还未参与游戏,可以自由退出", () => {
				this.gemit(GEventDef.room_closesetting);
				QuitMgr.getInstance().quit(); 
				}, "解散房间");
			}
			else
			{
				FrameMgr.getInstance().showDialog("      游戏已经开始，需要全部玩家用以后才可解散房间，是否确定发起解散房间投票？（第一局结束之前解散不会收取房费，第一局结束之后收取的房费不会返还。）", () => {
				this.gemit(GEventDef.room_closesetting);
				QuitMgr.getInstance().quit(); 
				}, "解散房间");
			}
		}
		else
		{
			let roundindex = RoomMgr.getInstance().getRoundIndex();
			if(roundindex==0){
				QuitMgr.getInstance().quit(); 
			}
			else if(roundindex>0){
				FrameMgr.getInstance().showDialog("      游戏已经开始，需要全部玩家用以后才可解散房间，是否确定发起解散房间投票？（第一局结束之前解散不会收取房费，第一局结束之后收取的房费不会返还。）", () => {
					this.gemit(GEventDef.room_closesetting);
					QuitMgr.getInstance().quit(); 
					}, "解散房间");
			}
		}
    }

    private onBtnRule_cb(event){
		this.gemit(GEventDef.room_closesetting);
		//this.start_sub_module(G_MODULE.RoomRule); 
		this.start_sub_module(G_MODULE.RuleDescription);
	}
	
	private onBtnCheating_cb(event){
		this.gemit(GEventDef.room_closesetting);
		this.start_sub_module(G_MODULE.RoomPreventionCheating); 
    }
}
