/*
author: YOYO
日期:2018-02-06 20:36:26
*/
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import TbnnConst from "../BullMgr/TbnnConst";
import TbnnLogic from "../BullMgr/TbnnLogic";
import GEventDef from "../../../Plat/GameMgrs/GEventDef";
import BullPosMgr from "../../../GameCommon/Bull/BullPosMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Tbnn_goldPoolCtrl;
//模型，数据处理
class Model extends BaseModel{
    onceFlyNum:number = null                    //单次飞行金币的数量
    minFlySpeed:number = null                   //最低飞行速度
    maxFlySpeed:number = null                   //最高飞行速度
    chipFlyNum:number = null                    //筹码飞行的数量
    flyGoldSpeed:number
	constructor()
	{
		super();

        this.onceFlyNum = 7;
        this.minFlySpeed = 50;
        this.maxFlySpeed = 100;
        this.flyGoldSpeed = 80

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
    model:Model
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
    flyGold(startPos:cc.Vec2, targetPos:cc.Vec2, cb?:Function, endCb?:Function){
        // let startPos = this.getPosByViewSeatId(startViewId);
        // let targetPos = this.getPosByViewSeatId(targetViewId);
        let golds = this._createGroupGold(this.model.onceFlyNum);
        let flyInfo = {
            groupList:golds,
            startPos:startPos,
            targetPos:targetPos,
            flySpeed:this.model.flyGoldSpeed,
            cb:cb,
            endCb:endCb,
        }
        //console.log('这里飞行金币startPos= ',flyInfo.startPos,', targetPos=',flyInfo.targetPos);
        this.flyGroupToTarget(flyInfo);
        return golds
    }
    //飞行筹码
    flyChips(startPos:cc.Vec2, targetPos:cc.Vec2,  cb?:Function, endCb?:Function){
        let golds = this._createGroupGold(this.model.chipFlyNum);
        let flyInfo = {
            groupList:golds,
            startPos:startPos,
            targetPos:targetPos,
            flySpeed:this.model.maxFlySpeed,
            cb:cb,
            endCb:endCb,
        }
        this.flyGroupToTarget(flyInfo);
    }
    //用现有的金币做飞行
    flyByGolds (startPos:cc.Vec2, targetPos:cc.Vec2, golds, cb?:Function, endCb?:Function){
        let flyInfo = {
            groupList:golds,
            startPos:startPos,
            targetPos:targetPos,
            flySpeed:this.model.flyGoldSpeed,
            cb:cb,
            endCb:endCb,
        }
        this.setGroupGoldShow(golds);
        //console.log('这里用现成的金币金币startPos= ',flyInfo.startPos,', targetPos=',flyInfo.targetPos);
        this.flyGroupToTarget(flyInfo);
    }

    //获取最大位置数量
    getMaxSeatsCount (){
        return RoomMgr.getInstance().getSeatCount();
    }
    //根据座位id获取座位坐标
    getPosByViewSeatId(viewSeatId:number){
        return BullPosMgr.getInstance().getSeatPos(viewSeatId);
    }
    //隐藏所有的节点
    hideAll (){
        let curNode;
        for(let i = 0; i < this._list_cache.length; i ++){
            curNode = this._list_cache[i];
            curNode.stopAllActions();
            if(curNode.active){
                this._hideOneGold(curNode);
            }
        }
    }
    //=================

    private flyGroupToTarget(flyInfo){
        let groupList = flyInfo.groupList,
            startPos = flyInfo.startPos,
            targetPos = flyInfo.targetPos,
            flySpeed = flyInfo.flySpeed,
            cb = flyInfo.cb,
            endCb = flyInfo.endCb;
        let i,
            curNodeNum = groupList.length;
        for(i = 0; i < groupList.length; i ++){
            let goldNode = groupList[i];
            goldNode.stopAllActions();
            goldNode.position = this._getRandomPos(startPos);
            // goldNode.active = true;
            let act1 = cc.moveTo(this.getRandomArea(this.model.minFlySpeed, flySpeed)/100, targetPos);
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
    private _createGroupGold(num:number){
        let i,
            goldNode:cc.Node,
            list_golds = [];
        for(i = 0; i < num; i ++){
            goldNode = this._getOneGold();
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
    //将一堆金币初始化到显示状态
    private setGroupGoldShow (golds){
        let curGold;
        for(let i = 0; i < golds.length; i ++){
            curGold = golds[i];
            curGold.active = true;
            this._list_hideGold.splice(this._list_hideGold.indexOf(curGold));
        }
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
export default class Tbnn_goldPoolCtrl extends BaseCtrl {
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
        this.n_events[TbnnConst.clientEvent.onSettle] = this.onSettle_bull;
        this.n_events[TbnnConst.clientEvent.onSyncData] = this.onSyncData;
	}
	//定义全局事件
	defineGlobalEvents()
	{
        this.g_events[GEventDef.bull_flyGold] = this.onModules_flyGold;
        this.g_events[GEventDef.usersUpdated] = this.usersUpdated;
	}
	//绑定操作的回调
	connectUi()
	{
	}
	start () {
        // setTimeout(()=>{
        //     this.test();
        // }, 2000);
    }
    test(){
        this.view.flyGold(cc.p(-522,-278), cc.p(2,-173), null, ()=>{
            //最后一个金币落下
            //console.log('飞行结最后一个金币落下束，发送消息1')
            // TbnnLogic.getInstance().emit_flyGoldEnd(tagStr);
        });
        this.view.flyGold(cc.p(535,27), cc.p(303,-75), null, ()=>{
            //最后一个金币落下
            //console.log('飞行结最后一个金币落下束，发送消息2')
            // TbnnLogic.getInstance().emit_flyGoldEnd(tagStr);
        });
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
        let startPosList = [];
        let room = RoomMgr.getInstance();
        let posMgr = BullPosMgr.getInstance();
        for(let seatId in msg.scoreInfo){
            if(seatId == msg.winSeatId) continue;
            startPosList.push(posMgr.getSeatPos(room.getViewSeatId(seatId)));
        }
        let dataList = [
            {
                targetPos:cc.p(0, 0),
                startPosList:startPosList
            },
            {
                targetPos:posMgr.getSeatPos(winViewSeatId),
                startPosList:[cc.p(0, 0)]
            }
        ]
        this.flyGolds(dataList, ()=>{
            this.playGetGoldEffect(winViewSeatId);
        });
    }
    onSyncData (){
        //清理所有金币
        this.view.hideAll();
    }
    //更新玩家信息
    usersUpdated(){
        //清理所有金币
        this.view.hideAll();
    }
	//end
    //全局事件回调begin

    //有事件需要做金币飞行动作
    onModules_flyGold(msg){
        //console.log('接收到金币飞行的消息', msg)
        let startPos = msg.startPos;
        let targetPos = msg.targetPos;
        let flyType = msg.flyType;//是飞行金币还是，下注筹码
        let tagStr = msg.tagStr;
        this.view.flyGold(startPos, targetPos, null, ()=>{
            //最后一个金币落下
            //console.log('飞行结束，发送消息',tagStr)
            TbnnLogic.getInstance().emit_flyGoldEnd(tagStr);
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
    //         targetPos: cc.Vect2,
    //         startPosList : [cc.Vect2, cc.Vect2, cc.Vect2],
    //     },
    //     {
    //         targetPos: cc.Vect2,
    //         startPosList : [cc.Vect2, cc.Vect2, cc.Vect2]
    //     }
    // ]
    flyGolds(dataList:Array<{}>, cb:Function){
        dataList = dataList.concat([]);
        let flyData, showGolds = [];
        let flyFunc = (curData)=>{
            let i,
                j,
                curStartPos,
                curGroupNum;

            curGroupNum = curData.startPosList.length;
            for(j = 0; j < curData.startPosList.length; j ++){
                curStartPos = curData.startPosList[j];
                if(dataList.length == 0){
                    //最后一次，飞行到赢家
                    this.view.flyByGolds(curStartPos, curData.targetPos, showGolds,null, ()=>{
                        if(cb) cb();
                    })
                }else{
                    let golds = this.view.flyGold(curStartPos, curData.targetPos, ()=>{
                        //第一个金币落下
                        
                    }, ()=>{
                        curGroupNum -= 1;
                        if(curGroupNum < 1){
                            //一个回合飞行结束
                            let newData = dataList.splice(0, 1)[0];
                            if(newData) flyFunc(newData);
                        }
                    })
                    showGolds = showGolds.concat(golds);
                }
            }
        }
        flyData = dataList.splice(0, 1)[0];
        if(flyData) flyFunc(flyData);
    }
    
    //播放获取金币的特效
    playGetGoldEffect (winLogicId){
        //最后一个金币落下
        if(!this.dict_anis) this.dict_anis = {};
        if(this.dict_anis[winLogicId]){
            //获取动画组件，再播放一次
            // this.node.runAction(this.dict_anis[flyData.winLogicId]);
            this.dict_anis[winLogicId].play();
        }else{
            TbnnLogic.getInstance().openGoldFalsh((curPrefab, curNode)=>{
                this.dict_anis[winLogicId] = curNode.getComponent(cc.Animation);
                let curPos = this.view.getPosByViewSeatId(winLogicId);
                let visibleSize = cc.director.getVisibleSize();
                curNode.position = cc.p(curPos.x+visibleSize.width/2, curPos.y+visibleSize.height/2);
                this.dict_anis[winLogicId].play();
            }); 
        }

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
        // this.view.flyChips(startSeatId, targetPos, cb);
    }
}