/*
author: JACKY
日期:2018-03-07 11:07:57
*/
import BaseControl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UiMgr from "../../GameMgrs/UiMgr";
import ModuleMgr from "../../GameMgrs/ModuleMgr";
import SettingMgr from "../../GameMgrs/SettingMgr"; 
import { SssDef } from "../../../Games/Sss/SssMgr/SssDef";

//MVC模块,
const {ccclass, property} = cc._decorator;
const CONFIGS = {
    option:{
        baseCtrl:1,//基础操作
        audioCtrl:2//声音控制
    }
}
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
        node_toggle1 : null,
        node_toggle2 : null,
        Prefab_audioCtrl : null,
        Prefab_baseCtrl : null,
        node_content:null
	};
    node=null;
    private node_baseCtrl:cc.Node
    private node_audioCtrl:cc.Node
    private curOption:number
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
        this.ui.node_toggle1 = ctrl.node_toggle1;
        this.ui.node_toggle2 = ctrl.node_toggle2; 
        this.ui.node_content = ctrl.node_content;
        this.ui.Prefab_baseCtrl = ctrl.Prefab_baseCtrl;
        this.ui.Prefab_audioCtrl = ctrl.Prefab_audioCtrl;
    }

    //切换选项
    setOption(chooseOption:number){
        if(this.curOption == chooseOption) return;
        this.curOption = chooseOption;
        this.updateOptionBtn();
        switch(chooseOption){
            case CONFIGS.option.baseCtrl:
                this.addBaseCtrl();
            break
            case CONFIGS.option.audioCtrl:
                this.addAudioCtrl();
            break
        }
    }

    private updateOptionBtn (){
        let toggleList1 = this.ui.node_toggle1.children, toggleList2 = this.ui.node_toggle2.children;
        switch(this.curOption){
            case CONFIGS.option.baseCtrl:
                toggleList1[1].active = true;
                toggleList2[1].active = false;
            break
            case CONFIGS.option.audioCtrl:
                toggleList1[1].active = false;
                toggleList2[1].active = true;
            break
        }
    }

    private addBaseCtrl (){
        if(!this.node_baseCtrl){
            this.node_baseCtrl = cc.instantiate(this.ui.Prefab_baseCtrl);
            this.node_baseCtrl.parent = this.ui.node_content;
        }
        this.node_baseCtrl.active = true;
        if(this.node_audioCtrl) this.node_audioCtrl.active = false;
    }
    private addAudioCtrl (){
        if(!this.node_audioCtrl){
            this.node_audioCtrl = cc.instantiate(this.ui.Prefab_audioCtrl);
            this.node_audioCtrl.parent = this.ui.node_content;
        }
        this.node_audioCtrl.active = true;
        if(this.node_baseCtrl) this.node_baseCtrl.active = false;
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
	@property(cc.Node)
	node_toggle1 : cc.Node = null;
	@property(cc.Node)
    node_toggle2 : cc.Node = null;
    //===========content
    @property(cc.Node)
    node_content:cc.Node = null
	@property({
		tooltip : "游戏声音部件",
		type : cc.Prefab
	})
	Prefab_audioCtrl : cc.Prefab = null;
	@property({
		tooltip : "操作设置部件",
		type : cc.Prefab
	})
	Prefab_baseCtrl : cc.Prefab = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
		this.initMvc(Model,View);
		// //console.log('myInfo:', this.model.myInfo);
        this.view.setOption(CONFIGS.option.baseCtrl);
        SettingMgr.getInstance().setIsPlaza(false);
	}

	//定义网络事件
	defineNetEvents()
	{
        this.n_events = {
            "onProcess": this.onProcess,
            'onStartGame':this.onStartGame, 
			"onDissolutionRoom": this.onDissolutionRoom,
            onGameFinished:this.onGameFinished,        
        }
	}
	//定义全局事件
	defineGlobalEvents()
	{
		//全局消息
		this.g_events={ 
            'room_closesetting':this.room_closesetting  
		} 
		
	}
	room_closesetting(){
		this.finish();
	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.button, this.ui.node_CloseBtn, this._onClick_Close, '点击关闭')
		this.connect(G_UiType.image, this.ui.node_toggle1, this.ControlSetting_cb, '切换到操作设置')
		this.connect(G_UiType.image, this.ui.node_toggle2, this.MusicSetting_cb, '切换到音乐设置')
	}
	start () {
	}
    //网络事件回调begin
    onProcess(msg) {
		if (msg.process == SssDef.process_peipai) {
			this.finish();
		}else if(msg.process == SssDef.process_gamesettle){
			this.finish();
		}
	}
    onStartGame(msg) { 
		this.finish(); 
	}
	onDissolutionRoom(msg) {
		if(msg.result) {
			this.finish();
		}
	}
	onGameFinished(msg)
	{  
        this.finish();  
	}
	//end
	//全局事件回调begin
	//end


	//按钮或任何控件操作的回调begin
	/**
	 * 点击关闭
	 * @param event 
	 */

	private _onClick_Close (event) : void {
        if (SettingMgr.getInstance().getGameID() == 13 && this.view.node_audioCtrl) {
            this.view.node_audioCtrl.getComponent('RoomAudioSettingCtrl').SssClosePanel()
        }
		let msg = {
			controlInfo:null,
			musicInfo:null,
			notifyInfo:null,
		}
		msg.controlInfo = SettingMgr.getInstance().getControlInfo();
		msg.musicInfo = SettingMgr.getInstance().getMusicInfo();
		msg.notifyInfo = SettingMgr.getInstance().getNotifyInfo();
		//保存到本地
		this.finish();
    }
    //切换到操作设置
    private ControlSetting_cb(){
        //console.log('ControlSetting')
        this.view.setOption(CONFIGS.option.baseCtrl);
    }

    //切换到音乐设置
    private MusicSetting_cb(){
        //console.log('MusicSetting')
        this.view.setOption(CONFIGS.option.audioCtrl);
        this.view.node_audioCtrl.getComponent('RoomAudioSettingCtrl').noTopolectOption()
    }
    //end
}