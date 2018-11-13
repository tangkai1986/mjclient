/*
author: YOYO
日期:2018-03-02 11:25:04
牛牛模块初始安装
*/
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import LoaderMgr from "../../../AppStart/AppMgrs/LoaderMgr";
import MpnnConst from "../BullMgr/MpnnConst";
import GEventDef from "../../../Plat/GameMgrs/GEventDef";
import LocalStorage from "../../../Plat/Libs/LocalStorage";
import FrameMgr from "../../../Plat/GameMgrs/FrameMgr";
import YySdkMgr from "../../../Plat/SdkMgrs/YySdk";

//MVC模块,
const {ccclass, property} = cc._decorator;
const CONFIGS = {
    localBGName : 'bull_backgroundTable'
}
let ctrl : MpnnModulesInstallCtrl;
//模型，数据处理
class Model extends BaseModel{
    mySeatId=null;
    resultGoldUpH:number = null         //移动的高度
    seatCount:number = null             //最大座位数
    bgState
    voiceState=null;//声音状态
	maikefeng_on=null;//麦克风状态
	laba_on=null;//喇叭状态
	constructor()
	{
		super();
        this.resultGoldUpH = 100;
        this.seatCount = RoomMgr.getInstance().getSeatCount();
    }
	switchMaiKeFengState(){ 
		let voicestate=null;
		if(this.maikefeng_on)
		{ 
			voicestate=3; 
		}
		else{ 
			voicestate=1; 
		}
		return voicestate;
	}
    initBGState (){
        this.bgState = LocalStorage.getInstance().getBullRoomBGCfg();
        if(!this.bgState){
            this.bgState = 1;
            LocalStorage.getInstance().setBullRoomBGCfg(this.bgState);
        }
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    model:Model
    private node_resultGold:cc.Node = null
    private prefab_backGround:any =null
    // private background_table:any = null
	ui={
        //在这里声明ui
		btn_newmaimaikefeng : null,
        node_parent_bg:null,
        node_parent_seat:null,
        node_parent_upUi:null,
        //===
        prefab_roomInfo:null,
        prefab_background6:null,
        prefab_background8:null,
        prefab_tipClock:null,
        prefab_roomAround:null,
        //===
        prefab_mpnnroomrule:null,
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
        this.initUi();
        // this.background_table = 1;
        // cc.sys.localStorage.setItem("background_table",this.background_table);
	}
	//初始化ui
	initUi()
	{
        this.ui.btn_newmaimaikefeng = ctrl.btn_newmaimaikefeng;
        this.ui.prefab_roomAround = ctrl.prefab_roomAround;
        this.ui.node_parent_bg = ctrl.node_parent_bg;           //这个是背景的父亲
        this.ui.node_parent_seat = ctrl.node_parent_seat;
        this.ui.node_parent_upUi = ctrl.node_parent_upUi;
        this.ui.prefab_roomInfo = ctrl.prefab_roomInfo;
        this.ui.prefab_background6 = ctrl.prefab_background6;     //这个是6人场的背景
        this.ui.prefab_background8 = ctrl.prefab_background8;     //这个是8人场的背景
        //=================
        this.ui.prefab_tipClock = ctrl.prefab_tipClock;
        this.ui.prefab_mpnnroomrule = ctrl.prefab_mpnnroomrule;
    }

    initModules(cb:Function){
        //add bg 判断人数是几人
        if(this.model.seatCount <= 6){
            this.prefab_backGround= cc.instantiate(this.ui.prefab_background6);
        }else{
            this.prefab_backGround= cc.instantiate(this.ui.prefab_background8);
        }
        this.prefab_backGround.parent = this.ui.node_parent_bg;
        this.prefab_backGround.active = true;
        //更新到正确的背景
        this.model.initBGState();
        this.updateBackGroundSpriteFrame();
        //this.updateMpnnSpriteFrame();

        //add room info
        let curNode:cc.Node = cc.instantiate(this.ui.prefab_roomInfo);
        curNode.parent = this.ui.node_parent_bg;
        //add tipClock
        curNode = cc.instantiate(this.ui.prefab_tipClock);
        curNode.parent = this.ui.node_parent_upUi;

        curNode = cc.instantiate(this.ui.prefab_mpnnroomrule);
        curNode.parent = this.ui.node_parent_bg;

        //add RoomAround
        curNode = cc.instantiate(this.ui.prefab_roomAround);
        curNode.parent = this.ui.node_parent_upUi;
        curNode.zIndex =1;
        cb();
        cb = null
    }
    updateBackGroundSpriteFrame(){
        this.getBGImg((frame)=>{
            this.prefab_backGround.children[0].getComponent(cc.Sprite).spriteFrame = frame;
            this.prefab_backGround.children[1].getComponent(cc.Sprite).spriteFrame = frame;
        });
    }
    private getBGImg (cb:Function){
        let state = this.model.bgState;
        let bgName6 = 'img_6rnn';
        let bgName8 = 'img_8rnn';
        let blueStr = state == 1 ? '' : '_blue';
        let curBGName = '';
        if(this.model.seatCount <= 6){
            curBGName = bgName6 + blueStr;
        }else{
            curBGName = bgName8 + blueStr;
        }
        let url = "Icons/tbnnBGChange/"+curBGName;
        LoaderMgr.getInstance().loadRes(url,(assert)=>{
            cb(new cc.SpriteFrame(assert));
        })
    }
}
//c, 控制
@ccclass
export default class MpnnModulesInstallCtrl extends BaseCtrl {
    view:View = null
    model:Model = null
    //这边去声明ui组件
    @property({
        type:cc.Node,
        displayName:"background"
    })
    node_parent_bg:cc.Node = null
    @property({
        type:cc.Node,
        displayName:"seatParent"
    })
    node_parent_seat:cc.Node = null
    @property({
        type:cc.Node,
        displayName:"upUi"
    })
    node_parent_upUi:cc.Node = null
    //===================
    @property({
        type:cc.Prefab,
        displayName:"bgPrefab6"
    })
    prefab_background6:cc.Prefab = null

    @property({
        type:cc.Prefab,
        displayName:"bgPrefab8"
    })
    prefab_background8:cc.Prefab = null

    @property({
        type:cc.Prefab,
        displayName:"mpnn_roomrule"
    })
    prefab_mpnnroomrule:cc.Prefab = null

    @property({
        type:cc.Prefab,
        displayName:"roomInfo"
    })
    prefab_roomInfo:cc.Prefab = null
    @property({
        type:cc.Prefab,
        displayName:"tipClock"
    })
    prefab_tipClock:cc.Prefab = null
    @property({
        type:cc.Prefab,
        displayName:"roomAround"
    })
    prefab_roomAround:cc.Prefab = null
    //==================

    @property(cc.Node)
    btn_newmaimaikefeng : cc.Node = null;
    
    //测试工具
    
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
	defineGlobalEvents(){
        this.g_events = {
            'setBackGroundSpriteFrame':this.setBackGroundSpriteFrame,
        } 
	}
	//绑定操作的回调
	connectUi()
	{
	}
	start () {
        this.view.initModules(()=>{
            //test 应该走在ui请求结束后
            this.startGame();
        })
    }
    // //网络事件回调begin
    //end
    
    //全局事件回调begin
    //end
    
    //按钮或任何控件操作的回调begin
    //end
    
    //加载组件完成，开始游戏
    private startGame(){   
        RoomMgr.getInstance().enterRoom() 
    }
    private setBackGroundSpriteFrame(){
        this.model.initBGState();
        this.view.updateBackGroundSpriteFrame();
    }
}