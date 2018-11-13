/*
author: YOYO
日期:2018-02-05 10:05:18

他人的卡牌操作
*/
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import QznnConst from "../QznnMgr/QznnConst";
import QznnLogic from "../QznnMgr/QznnLogic";
import BullCardsMgr from "../../../GameCommon/Bull/BullCardsMgr";
import BullPosMgr from "../../../GameCommon/Bull/BullPosMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
const C_cardAttr = "_cardInfo";
let ctrl : Qznn_OthersCardsCtrl;
//模型，数据处理
class Model extends BaseModel{
    moveStartPos:cc.Vec2 = null
    maxHandlerCardNum:number = null                 //最大操作手牌数量
    cardOffRate:number = null                       //卡牌的间隔占卡牌本身的比例
    lowScaleRate:number = null                      //缩小的比例
    curGiveCardsNum:number = null                   //当前的发牌数量
    seatsCount:number = null
    timeoutId:number = null
	constructor()
	{
        super();
        this.moveStartPos = cc.p(0, 0);
        this.maxHandlerCardNum = 5;
        this.cardOffRate = QznnConst.config.minCardOffWRate;
        this.lowScaleRate = 0.5;
        this.seatsCount = RoomMgr.getInstance().getSeatCount();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    dict_cards:{} = null
	ui={
        //在这里声明ui
        atlas_cards:null
	};
    node=null;
    model:Model
	constructor(model){
		super(model);
		this.node=ctrl.node;
        this.initUi();
        
        this.dict_cards = {};
	}
	//初始化ui
	initUi()
	{
        this.ui.atlas_cards = ctrl.atlas_cards;
    }
    
    /**
     * 
     * 显示某个座位上的一组多张卡牌
     * @param viewSeatId: 视图上的座位id
     * @param cardsNum: 显示的卡牌数量
     */
    showCard(viewSeatId:number, cardsNum:number){
        if(!this.dict_cards[viewSeatId]) this.dict_cards[viewSeatId] = [];
        let i,
            cardNode;
        for(i = 0; i < this.model.maxHandlerCardNum; i ++){
            cardNode = this.dict_cards[viewSeatId][i];
            if(!cardNode){
                cardNode = BullCardsMgr.addOtherCard();
                this.dict_cards[viewSeatId].push(cardNode);
            }
            cardNode.zIndex = i;
            if(cardsNum > 0 && cardNode.active == false){
                cardsNum -= 1;
                cardNode.active = true;
                cardNode.active = true;
                cardNode.opacity = 255;
                cardNode[C_cardAttr].logicValue = 0;
                cardNode[C_cardAttr].isOpen = false;
                BullCardsMgr.setCardValue(cardNode);
            }
        }
    }
    /**
     * 发牌
     * @param giveNum 发牌的数量
     */
    giveCards (viewSeatId:number, giveNum:number){
        let i,
            cardNode:cc.Node,
            startPos,
            targetPos,
            endPos,
            moveTime,
            intervalTime;

        startPos = this.model.moveStartPos;
        targetPos = this.getGiveTargetPos(viewSeatId);
        moveTime = QznnConst.config.cardMoveTime;
        intervalTime = QznnConst.config.cardIntervalTime;

        //create all
        this.showCard(viewSeatId, giveNum);

        for(i = 0; i < giveNum; i ++){
            cardNode = this.dict_cards[viewSeatId][giveNum - i - 1];
            if(cardNode){
                cardNode.position = startPos;
                cardNode.zIndex = i + 1;
                endPos = cc.p(targetPos.x, targetPos.y);
                endPos.x += i * this.model.cardOffRate * cardNode.width;
                let act1 = cc.delayTime(i * intervalTime);
                let act2 = cc.moveTo(moveTime, endPos);
                if(i == giveNum - 1){
                    let act3 = cc.callFunc(ctrl.onGiveCardsEnd, ctrl);
                    cardNode.runAction(cc.sequence(act1, act2, act3));
                }else{
                    cardNode.runAction(cc.sequence(act1, act2));
                }
            }
        }
    }

    //隐藏所有的卡牌
    coverAllCards(viewSeatId:number){
        BullCardsMgr.coverCards(this.dict_cards[viewSeatId]);
    }

    hideAllCards(){
        for(let seatId in this.dict_cards){
            let cardsList = this.dict_cards[seatId];
            for(let i = 0; i < cardsList.length; i ++){
                let card = cardsList[i];
                card.active = false;
            }
        }
    }

    getGiveTargetPos(viewSeatId:number){
        return BullPosMgr.getInstance().getGiveCardPos(viewSeatId);
    }

    getCardListByViewId(viewSeatId:number){
        return this.dict_cards[viewSeatId];
    }
    //======================
}
//c, 控制
@ccclass
export default class Qznn_OthersCardsCtrl extends BaseCtrl {
    model:Model = null
    view:View = null
    list_giveSeatId:Array<number> = null
    roundIndex:number = null                //为了逐个位置发牌
    //这边去声明ui组件
    @property({
        type:cc.SpriteAtlas,
        displayName:"cardsAtlas"
    })
    atlas_cards:cc.SpriteAtlas = null
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
        this.initMvc(Model,View);
        BullCardsMgr.setOtherCardsAtlas(this.ui.atlas_cards);
	}

	//定义网络事件
	defineNetEvents()
	{
        this.n_events = {};
        this.n_events[QznnConst.clientEvent.onGiveCards] = this.onStartGive;
        this.n_events[QznnConst.clientEvent.onTanPai] = this.onTanPai;
        this.n_events[QznnConst.clientEvent.onStart] = this.onStart;
        this.n_events[QznnConst.clientEvent.onSettle] = this.onSettle_bull;
        this.n_events['onPrepare'] = this.onPrepare;

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

    //游戏开始
    onStart(){
        this.clearData();
        this.view.hideAllCards();
    }
    onPrepare(msg){
        if(msg.seatid == RoomMgr.getInstance().getMySeatId()){
            //自己准备，清理所有上一局的表现
            this.clearData();
            this.view.hideAllCards();
        }
    }
    /*
    cardsNum:null,                  //发牌的数量
            matchid:null,                   //赛事id
            myCardsList:null                //自己的卡牌列表
    */
    onStartGive(msg){
        //console.log('开始给牌=====',  msg)
        //延时执行，先发玩家自己的牌
        let time = QznnConst.config.cardIntervalTime*QznnConst.config.maxGroupCardsNum+QznnConst.config.cardMoveTime;
        this.model.timeoutId = setTimeout(()=>{
            this.model.curGiveCardsNum = msg.cardNum;
            this.roundIndex = 1;
            this._inGiveRound();
        }, time * 1000);
    }
    /*有人摊牌
    seatId:null,                        //摊牌玩家的位置id
            cardLogicIdList:null                //摊牌玩家手上的牌列表
            resultType:null,                    //结果类型，牛几
    */
    onTanPai(msg){
        //console.log('onTanPai=== ',msg)
        let id = msg.seatId;
        if(id != RoomMgr.getInstance().myseatid){
            let viewSeatId = RoomMgr.getInstance().getViewSeatId(id);
            let nodeList = this.view.dict_cards[viewSeatId];
            let targetPos = this.view.getGiveTargetPos(viewSeatId);
            BullCardsMgr.showTanPai(nodeList, msg.cardLogicIdList, targetPos);
        }
    }
    /*结算
    winSeatId:null,                     //胜利的座位id
            scoreInfo:null,                     //胜利的相关信息（输赢分值）{}
            servertime_now:null,                //服务器时间(客户端同步时间并计算间隔)
            servertime_next:null,               //服务器时间(客户端同步时间并计算间隔)
            dict_notTanPai:null                 //没有摊牌的玩家列表
    scoreInfo = {1:10}
    dict_noTanPai = {cardIdList:[1,2,4], resultType:3}
    */
    onSettle_bull(msg){
        //console.log('********others********onSettle = ', msg)

        //将没有摊牌的玩家摊牌
        let myLogicId = RoomMgr.getInstance().getMySeatId();
        let seatId,
            resultObj,
            viewSeatId;
        for(seatId in msg.dict_notTanPai){
            if(seatId != myLogicId){
                resultObj = msg.dict_notTanPai[seatId];
                viewSeatId = RoomMgr.getInstance().getViewSeatId(seatId);
                let targetPos = this.view.getGiveTargetPos(viewSeatId);
                BullCardsMgr.showTanPai(this.view.getCardListByViewId(viewSeatId), resultObj.cardIdList, targetPos);
            }
        }
    }
	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin
    
    //发牌结束回调
    public onGiveCardsEnd(){
        //console.log('on_giveCardsEnd')
        // this.view.openAllCards([40, 1, 13, 22, 34]);
        this._inGiveRound();
    }
    //end

    clearData (){
        clearTimeout(this.model.timeoutId);
    }
    
    private _inGiveRound(){
        if(this.roundIndex >= this.model.seatsCount){
            //发牌结束
        }else{
            this.view.giveCards(this.roundIndex, this.model.curGiveCardsNum);
            this.roundIndex += 1;
        }
    }

    onDestroy(){
        clearTimeout(this.model.timeoutId);
        super.onDestroy();
    }
}