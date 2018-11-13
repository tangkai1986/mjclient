/*
author: YOYO
日期:2018-02-06 20:36:26
*/
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import QznnConst from "../../Qznn/QznnMgr/QznnConst";
import QznnLogic from "../QznnMgr/QznnLogic";
import GEventDef from "../../../Plat/GameMgrs/GEventDef";
import BullPosMgr from "../../../GameCommon/Bull/BullPosMgr";


//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Qznn_goldPoolCtrl;
//模型，数据处理
class Model extends BaseModel{
    onceFlyNum:number = null                    //单次飞行金币的数量
    minFlySpeed:number = null                   //最低飞行速度
    maxFlySpeed:number = null                   //最高飞行速度
    chipFlyNum:number = null                    //筹码飞行的数量
	constructor()
	{
		super();
        this.onceFlyNum = 7;
        this.minFlySpeed = 30;
        this.maxFlySpeed = 70;
        this.chipFlyNum = 8;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    private _list_cache:Array<cc.Node> = null
    private _list_hideGold:Array<cc.Node> = null
	ui={
        //在这里声明ui
        sprite_goldImg:null,
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
        this.initUi();
        
        this._list_cache = [];
        this._list_hideGold = [];
	}
	//初始化ui
	initUi()
	{
        this.ui.sprite_goldImg = ctrl.sprite_goldImg;
    }
    /**
     * 根据初始id和目标id，飞行一组金币
     * @param startViewId 起始的座位id
     * @param targetViewId 目标的座位id
     * @param cb 飞行结束的回调
     */
    flyGold(startViewId:number, targetViewId:number, cb?:Function, endCb?:Function){
        let startPos = this.getPosByViewSeatId(startViewId);
        let targetPos = this.getPosByViewSeatId(targetViewId);
        let golds = this._createGroupGold(this.model.onceFlyNum, startPos);
        this.flyGroupToTarget(golds, targetPos, cb, endCb);
    }
    //飞行筹码
    flyChips(startSeatId:number, targetPos:cc.Vec2,  cb?:Function, endCb?:Function){
        let startPos = this.getPosByViewSeatId(startSeatId); 
        this.flyByPos(startPos, targetPos, cb);
    }
    flyByPos (startPos:cc.Vec2, targetPos:cc.Vec2, cb?:Function, endCb?:Function){
        let golds = this._createGroupGold(this.model.chipFlyNum, startPos);
        this.flyGroupToTarget(golds, targetPos, cb, endCb);
    }
    //获取最大位置数量
    getMaxSeatsCount (){
        return RoomMgr.getInstance().getSeatCount();
    }
    //根据座位id获取座位坐标
    getPosByViewSeatId(viewSeatId:number){
        return BullPosMgr.getInstance().getSeatPos(viewSeatId);
    }
    
    //=================

    private flyGroupToTarget(groupList:Array<cc.Node>, targetPos:cc.Vec2, cb:Function, endCb?:Function){
        let i,
            curNodeNum = groupList.length;
        for(i = 0; i < groupList.length; i ++){
            let goldNode = groupList[i];
            let act1 = cc.moveTo(this.getRandomArea(this.model.minFlySpeed, this.model.maxFlySpeed)/100, targetPos);
            let act2 = cc.callFunc(function(){
                this._hideOneGold(goldNode);
                curNodeNum -= 1;
                if(curNodeNum < 1){
                    if(endCb){
                        endCb();
                        endCb = null;
                    }
                }
                if(cb){
                    cb();
                    cb = null;
                }
            }, this);
            goldNode.runAction(cc.sequence(act1, act2));
        }
    }
    private _createGroupGold(num:number, targetPos:cc.Vec2){
        let i,
            goldNode:cc.Node,
            list_golds = [];
        for(i = 0; i < num; i ++){
            goldNode = this._getOneGold();
            goldNode.position = this._getRandomPos(targetPos);
            list_golds.push(goldNode);
        }
        return list_golds
    }
    private _getOneGold(){
        let curNode = this._list_hideGold.pop();
        if(!curNode){
            curNode = new cc.Node();
            curNode.parent = this.node;
            curNode.addComponent(cc.Sprite).spriteFrame = this.ui.sprite_goldImg;
            this._list_cache.push(curNode);
        }
        curNode.active = true;
        return curNode;
    }
    private _hideOneGold(curNode:cc.Node){
        curNode.active = false;
        this._list_hideGold.push(curNode);
    }
    private _getRandomPos(curPos:cc.Vec2){
        let curW = 25,
            curH = 50;
        let nodeW = this.getRandomArea(0, curW) * (Math.random() > 0.5 ? 1 : -1),
            nodeH = this.getRandomArea(0, curH) * (Math.random() > 0.5 ? 1 : -1);
        return cc.p(curPos.x + nodeW, curPos.y + nodeH);
    }
    //返回数值包括最大最小值
    private getRandomArea (downNum, upNum){
        return parseInt(Math.random()*(upNum - downNum + 1) + downNum);
    }
}
//c, 控制
@ccclass
export default class Qznn_goldPoolCtrl extends BaseCtrl {
    view:View = null
    model:Model = null
    private dict_anis:{}        //金币背景特效
	//这边去声明ui组件
    @property({
        type:cc.SpriteFrame,
        displayName:"goldImg"
    })
    sprite_goldImg:cc.SpriteFrame = null
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
        this.n_events = {};
        this.n_events[QznnConst.clientEvent.onSettle] = this.onSettle_bull;
	}
	//定义全局事件
	defineGlobalEvents()
	{
        this.g_events[GEventDef.bull_flyGold] = this.onModules_flyGold
	}
	//绑定操作的回调
	connectUi()
	{
	}
	start () {
        
	}
    //网络事件回调begin

    /*结算
    winSeatId:null,                     //胜利的座位id
            scoreInfo:null,                     //胜利的相关信息（输赢分值）{}
            servertime_now:null,                //服务器时间(客户端同步时间并计算间隔)
            servertime_next:null,               //服务器时间(客户端同步时间并计算间隔)
    scoreInfo = {1:10}
    */
    onSettle_bull(msg){
        //console.log('onSettle_bull金币结算==',msg)
        //飞行金币
        let winViewSeatId = RoomMgr.getInstance().getViewSeatId(msg.winSeatId);
        let failIdList = [];
        let maxSeatNum = this.view.getMaxSeatsCount();
        for(let i = 0; i < maxSeatNum; i ++){
            if(i != winViewSeatId){
                failIdList.push(i);
            }
        }
        let dataList = [
            {
                winId:winViewSeatId,
                failIdList:failIdList
            }
        ]
        this.flyGolds(dataList);
    }

	//end
    //全局事件回调begin
    
    //有事件需要做金币飞行动作
    onModules_flyGold(msg){
        //console.log('接收到金币飞行的消息', msg)
        let startPos = msg.startPos;
        let targetPos = msg.targetPos;
        let tagStr = msg.tagStr;
        this.view.flyByPos(startPos, targetPos, null, ()=>{
            //最后一个金币落下
            //console.log('飞行结束，发送消息',tagStr)
            QznnLogic.getInstance().emit_flyGoldEnd(tagStr);
        });
    }

	//end
	//按钮或任何控件操作的回调begin
    //end
    
    /**
     * 根据输赢飞行金币, dataList 需要按照注释中的格式
     * 这里的id是逻辑位置id，即服务器位置id
     */
    // dataList = [
    //     {
    //         winId: 0,
    //         failIdList : [1, 2, 3]
    //     },
    //     {
    //         winId: 2,
    //         failIdList : [0, 1, 3]
    //     }
    // ]
    flyGolds(dataList:Array<{}>){
        dataList = dataList.concat([]);
        let flyData;
        let flyFunc = ()=>{
            let i,
                j,
                curId,
                curGroupNum;

            curGroupNum = flyData.failIdList.length;
            for(j = 0; j < flyData.failIdList.length; j ++){
                curId = flyData.failIdList[j];
                this.view.flyGold(curId, flyData.winId, ()=>{
                    //第一个金币落下
                    
                }, ()=>{
                    //最后一个金币落下
                    if(!this.dict_anis) this.dict_anis = {};
                    if(this.dict_anis[flyData.winId]){
                        //获取动画组件，再播放一次
                        this.dict_anis[flyData.winId].play();
                    }else{
                        QznnLogic.getInstance().openGoldFalsh((curPrefab, curNode)=>{
                            this.dict_anis[flyData.winId] = curNode.getComponent(cc.Animation);
                            curNode.position = this.view.getPosByViewSeatId(flyData.winId);
                        }); 
                    }
                    curGroupNum -= 1;
                    if(curGroupNum < 1){
                        //一个回合飞行结束
                        flyData = dataList.splice(0, 1)[0];
                        if(flyData) flyFunc();
                    }
                })
            }
        }
        flyData = dataList.splice(0, 1)[0];
        if(flyData) flyFunc();
    }

    // dataList = [
    //     {
    //         viewSeatId:0,
    //         goldValue: 1000
    //     },
    //     {
    //         viewSeatId:1,
    //         goldValue: -1000
    //     },
    //     {
    //         viewSeatId:2,
    //         goldValue: 1000
    //     },
    //     {
    //         viewSeatId:3,
    //         goldValue: -1000
    //     },
    // ]
    
    //下注
    chooseChip(startSeatId:number, targetPos:cc.Vec2, cb?:Function){
        this.view.flyChips(startSeatId, targetPos, cb);
    }
}