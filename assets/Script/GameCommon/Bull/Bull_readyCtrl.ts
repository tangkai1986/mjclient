/*
author: YOYO
日期:2018-03-02 15:26:14
准备图标
*/
import BullPosMgr from "./BullPosMgr";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";
import BaseModel from "../../Plat/Libs/BaseModel";
import BaseView from "../../Plat/Libs/BaseView";
import BaseCtrl from "../../Plat/Libs/BaseCtrl";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Bull_readyCtrl;
let BullConst = null
let BullLogic = null
//模型，数据处理
class Model extends BaseModel{
	constructor()
	{
		super();
        BullConst = RoomMgr.getInstance().getDef();
        BullLogic = RoomMgr.getInstance().getLogic().getInstance();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    private dict_readys                         //所有的准备图标
	ui={
        //在这里声明ui
        sprite_oneReady:null
	};
    node:cc.Node=null;
    nodeConfig:cc.Node = null
    model:Model
	constructor(model){
		super(model);
		this.node=ctrl.node;
        this.initUi();
        this.dict_readys = {};
	}
	//初始化ui
	initUi(){
        this.ui.sprite_oneReady = ctrl.sprite_oneReady;
        this.nodeConfig = this.node.getChildByName('seats_'+RoomMgr.getInstance().getSeatCount());
    }

    setReady(viewSeatId){
        let curNode = this.getOneReady(viewSeatId);
        if(curNode){
            curNode.active = true;
        }
    }
    hideReady(viewSeatId){
        let curNode = this.getOneReady(viewSeatId);
        if(curNode){
            curNode.active = false;
        }
    }
    
    hideAll(){
        let curNode:cc.Node;
        for(let viewId in this.dict_readys){
            curNode = this.dict_readys[viewId];
            curNode.active = false;
        }
    }
    //初始下准备的显示
    initPrepare (){
        if(BullLogic.getIsMyWatcher()) return;//自己只是旁观者
        ////console.log('强行刷新准备信息===', RoomMgr.getInstance().preparemap)
        let Room = RoomMgr.getInstance();
        for(let logicSeatId in Room.preparemap){
            let viewId = Room.getViewSeatId(logicSeatId);
            let isPrepare = Room.preparemap[logicSeatId];
            if(isPrepare){
                this.setReady(viewId);
            }else{
                if(this.dict_readys[viewId]){
                    this.dict_readys[viewId].active = false;
                }
            }
        }

    }
    getOneReady (viewSeatId){
        let curNode = this.dict_readys[viewSeatId];
        if(!curNode){
            curNode = new cc.Node();
            curNode.parent = this.node;
            curNode.addComponent(cc.Sprite).spriteFrame = this.ui.sprite_oneReady;
            curNode.position = BullPosMgr.getInstance().getSeatHeadPos(viewSeatId);
            this.dict_readys[viewSeatId] = curNode;
        }
        return curNode;
    }
}
//c, 控制
@ccclass
export default class Bull_readyCtrl extends BaseCtrl {
    view:View = null
    model:Model = null
	//这边去声明ui组件
    @property(cc.SpriteFrame)
    sprite_oneReady:cc.SpriteFrame = null
    
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
        this.n_events = {
            'onPrepare':this.onPrepare,
            // 'http.reqUsers':this.http_reqUsers, 
            'connector.entryHandler.enterRoom':this.connector_entryHandler_enterRoom,
        };
        this.n_events[BullConst.clientEvent.onProcess] = this.onProcess;
        this.n_events[BullConst.clientEvent.onMidEnter] = this.onMidEnter;
        this.n_events['onReEnterRoom'] = this.onReEnterRoom;
        this.n_events['onLeaveRoom'] = this.onLeaveRoom;
        this.n_events['room.roomHandler.nextRound'] = this.room_roomHandler_nextRound;
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
    
    onProcess(msg){
		if(msg.process==BullConst.process.start){ 
            ////console.log('游戏开始，清理准备')
            this.view.hideAll();
            // 同步服务端时间 msg.servertime
		}else if(msg.process==BullConst.process.settle){

        }else if(msg.process==BullConst.process.giveCards){
            
        }
    }
    
    onPrepare(msg){
        ////console.log('onPrepare进入准备的 id= ', msg)
        let viewId = RoomMgr.getInstance().getViewSeatId(msg.seatid);
        this.view.setReady(viewId);
    }
    //其他人准备进入下一局
    onReEnterRoom(msg){
        this.view.initPrepare();
    }
    //玩家离开
    onLeaveRoom(msg){
        let viewSeatId = RoomMgr.getInstance().getViewSeatId(msg.seatid);
        this.view.hideReady(viewSeatId);
    }
    //自己准备下一局
    room_roomHandler_nextRound(){
        this.view.initPrepare();
    }

    connector_entryHandler_enterRoom(msg){
        if(RoomMgr.getInstance().isGameStarted()){
            this.view.hideAll();
        }else{
            this.view.initPrepare();
        }
    }
    onMidEnter(){
        this.view.hideAll();
    }

	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
}