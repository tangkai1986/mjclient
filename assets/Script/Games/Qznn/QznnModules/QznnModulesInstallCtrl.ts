/*
author: YOYO
日期:2018-03-02 11:25:04
牛牛模块初始安装
*/
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import QznnConst from "../QznnMgr/QznnConst";
import QznnLogic from "../QznnMgr/QznnLogic";
import GEventDef from "../../../Plat/GameMgrs/GEventDef";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : QznnModulesInstallCtrl;
//模型，数据处理
class Model extends BaseModel{
    resultGoldUpH:number = null         //移动的高度
	constructor()
	{
		super();
        this.resultGoldUpH = 100;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    private node_resultGold:cc.Node = null

	ui={
        //在这里声明ui
        node_parent_bg:null,
        node_parent_seat:null,
        node_parent_upUi:null,
        //===
        prefab_background:null,
        prefab_roomInfo:null,
        prefab_tipClock:null,
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
        this.ui.node_parent_bg = ctrl.node_parent_bg;
        this.ui.node_parent_seat = ctrl.node_parent_seat;
        this.ui.node_parent_upUi = ctrl.node_parent_upUi;
        this.ui.prefab_roomInfo = ctrl.prefab_roomInfo;
        this.ui.prefab_background = ctrl.prefab_background;
        this.ui.prefab_tipClock = ctrl.prefab_tipClock;
    }

    initModules(cb:Function){
        //将玩家座位安装到对应的位置上
        let curNode:cc.Node = cc.instantiate(this.ui.prefab_background);
        curNode.parent = this.ui.node_parent_bg;
        curNode.active = true;
        //add room info
        curNode = cc.instantiate(this.ui.prefab_roomInfo);
        curNode.parent = this.ui.node_parent_bg;
        //add tipClock
        curNode = cc.instantiate(this.ui.prefab_tipClock);
        curNode.parent = this.ui.node_parent_upUi;
        cb();
        cb = null
    }

    //===========================

    //播放金币结果的特效
    private playResultGoldAni(curNode:cc.Node){
        curNode.active = true;
        if(!curNode['_initPosY']) curNode['_initPosY'] = curNode.y;
        else curNode.y = curNode['_initPosY'];
        curNode.scale = 0.2;
        let time1 = 0.5;
        let act1 = cc.moveTo(time1, curNode.x, curNode.y + this.model.resultGoldUpH);
        let act2 = cc.scaleTo(time1, 1);
        let act3 = cc.delayTime(time1+0.5);
        let act4 = cc.callFunc(function(){
            curNode.active = false;
        }, this);
        curNode.runAction(cc.spawn(act1, act2));
        curNode.runAction(cc.sequence(act3, act4));
    }

}
//c, 控制
@ccclass
export default class QznnModulesInstallCtrl extends BaseCtrl {
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
        displayName:"roomBG"
    })
    prefab_background:cc.Prefab = null
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
	{}
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
    //网络事件回调begin

	//end
    //全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
    //end
    
    //加载组件完成，开始游戏
    private startGame(){
        RoomMgr.getInstance().enterRoom();
    }
}