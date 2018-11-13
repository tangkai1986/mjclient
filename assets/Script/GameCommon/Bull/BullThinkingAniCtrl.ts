/*
author: YOYO
日期:2018-04-14 19:53:32
*/
import BaseModel from "../../Plat/Libs/BaseModel";
import BaseView from "../../Plat/Libs/BaseView";
import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import GEventDef from "../../Plat/GameMgrs/GEventDef";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";
import BullPosMgr from "./BullPosMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : BullThinkingAniCtrl;
let BullConst;
let BullLogic;
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
    private dict_thinking
	ui={
        //在这里声明ui
        Prefab_thinking:null
	};
	node:cc.Node
	model:Model
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
        this.ui.Prefab_thinking = ctrl.Prefab_thinking;
    }
    
    //显示思考中，获取算牌中
    showThinking (viewSeatId:number){
        ////console.log('显示思考中，获取算牌中viewSeatId= ',viewSeatId)
        if(!this.dict_thinking) this.dict_thinking = {};
        if(!this.dict_thinking[viewSeatId]){
            let seatPos = BullPosMgr.getInstance().getSeatHeadPos(viewSeatId);
            if(seatPos){
                let aniNode = cc.instantiate(this.ui.Prefab_thinking);
                aniNode.parent = this.node;
                aniNode.position = seatPos;
                this.dict_thinking[viewSeatId] = aniNode;
            }
        }else{
            this.dict_thinking[viewSeatId].active = true;
            this.dict_thinking[viewSeatId].getComponent(cc.Animation).play();
        }
    }
    //清理所有思考中标志
    clearAllThinking(){
        if(this.dict_thinking){
            for(let viewSeatId in this.dict_thinking){
                this.dict_thinking[viewSeatId].active = false;
            }
        }
    }
    //清理某个人的思考中图标
    clearOneThinking(viewSeatId:number){
        ////console.log('清理某个人的思考中图标viewSeatId= ',viewSeatId)
        if(this.dict_thinking && this.dict_thinking[viewSeatId]){
            this.dict_thinking[viewSeatId].active = false;
        }
    }
}
//c, 控制
@ccclass
export default class BullThinkingAniCtrl extends BaseCtrl {
	view:View
    model:Model
    private midEnterInfo
    private isSync:Boolean
	//这边去声明ui组件
    @property(cc.Prefab)
    Prefab_thinking:cc.Prefab = null
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
        this.initMvc(Model,View);
        this.isSync = false;
	}

	//定义网络事件
	defineNetEvents()
	{
        this.n_events[BullConst.clientEvent.onTanPai] = this.onTanPai;
        this.n_events[BullConst.clientEvent.onProcess] = this.onProcess;
        this.n_events[BullConst.clientEvent.onSyncData] = this.onSyncData;
        this.n_events[BullConst.clientEvent.onMidEnter] = this.onMidEnter;
        this.n_events['connector.entryHandler.enterRoom'] = this.onMyEnterRoom;//自己进入的
        this.n_events['http.reqUsers'] = this.http_reqUsers;//自己的信息正确刷新了
	}
	//定义全局事件
	defineGlobalEvents()
	{
        this.g_events[GEventDef.bull_giveCardEnd] = this.onModules_giveCardsEnd
        this.g_events[GEventDef.usersUpdated] = this.usersUpdated
	}
	//绑定操作的回调
	connectUi()
	{
	}
	start () {
	}
    //网络事件回调begin
    //自己属于中途加入
    onMidEnter (msg){
        this.midEnterInfo = msg;
    }
    http_reqUsers(){
        if(this.midEnterInfo){
            let dictTanpai = this.midEnterInfo.dict_tanPai;
            let idleSeatIdList = this.midEnterInfo.idleSeatIdList;
            let room = RoomMgr.getInstance();
            let users = room.users;
            let myLogicSeatId = room.getMySeatId();
            for(let seatId in users){
                if(dictTanpai[seatId]){
                    //摊牌了
                    this.view.clearOneThinking(room.getViewSeatId(seatId));
                }else{
                    //未摊牌
                    ////console.log('没有摊牌的玩家作为seatId= ',seatId)
                    if(this.isHaveKey(idleSeatIdList, seatId)){
                        //是旁观者
                        ////console.log('是旁观者seatId= ',seatId)
                        this.view.clearOneThinking(room.getViewSeatId(seatId));
                    }else{
                        this.view.showThinking(room.getViewSeatId(seatId));
                    }
                }
            }
            this.midEnterInfo = null;
        }
    }
    private isHaveKey (list, key){
        for(let i = 0; i < list.length; i ++){
            if(list[i] == key) return true
        }
        return false;
    }
    //自己进入的
    onMyEnterRoom(msg){
        let room = RoomMgr.getInstance();
        this.view.clearAllThinking();
    }
    //断线重连
    onSyncData(msg){
        let dictTanpai = msg.tanpaiDict;
        let room = RoomMgr.getInstance();
        let users = room.users;
        this.isSync = true;
        for(let seatId in users){
            if(dictTanpai[seatId]){
                this.view.clearOneThinking(room.getViewSeatId(seatId));
            }else{
                this.view.showThinking(room.getViewSeatId(seatId));
            }
        }
    }
    //摊牌
    onTanPai(msg){
        let viewSeatId = RoomMgr.getInstance().getViewSeatId(msg.seatId);
        this.view.clearOneThinking(viewSeatId);
    }
    //游戏进程
    onProcess(msg){
        if(msg.process==BullConst.process.settle){ 
            //游戏结束时候
            this.isSync = false;
            this.view.clearAllThinking();
		}
    }
	//end
    //全局事件回调begin
    usersUpdated(){
        // //console.log('usersUpdated，清理所有的思考中动画')
        // this.view.clearAllThinking();
    }
    //发牌结束
    onModules_giveCardsEnd(){
        //所有人，显示算牌中,或者思考中
        if(this.isSync) {
            this.isSync = false;
            return;
        }
        let room = RoomMgr.getInstance();
        let users = room.users;
        for(let seatId in users){
            if(BullLogic.getIsWatcher){
                if(BullLogic.getIsWatcher(seatId)){
                    //旁观者
                }else{
                    this.view.showThinking(room.getViewSeatId(seatId));
                }
            }else{
                this.view.showThinking(room.getViewSeatId(seatId));
            }
        }
    }

	//end
	//按钮或任何控件操作的回调begin
	//end
}