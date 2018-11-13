/*
author: YOYO
日期:2018-02-05 10:04:43

自己的卡牌操作
*/
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import Prefab_bull_settleCtrl from "../../Tbnn/BullModules/Prefab_bull_settleCtrl";
import QznnConst from "../QznnMgr/QznnConst";
import QznnLogic from "../QznnMgr/QznnLogic";
import GEventDef from "../../../Plat/GameMgrs/GEventDef";
import BullCardsMgr from "../../../GameCommon/Bull/BullCardsMgr";
import BullPosMgr from "../../../GameCommon/Bull/BullPosMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
const C_cardAttr = "_cardInfo";
let ctrl : QznnMyCardsCtrl;

//模型，数据处理
class Model extends BaseModel{
    maxHandlerCardNum:number = null                 //最大操作手牌数量
    cardOffRate:number = null                       //卡牌的间隔
    moveStartPos:cc.Vec2 = null                     //移动的起始位置
    touchUpY:number = null                          //点击卡牌后上升的高度
    myViewSeatId:number = null                      //自己的UI座位
    touchUpNum:number = null                        //选中的卡牌数量
    maxTouchUpNum:number = null                     //最大的选卡数量
    list_cardsLogicId:Array<number> = null          //当局手上的握着的牌列表
    seatCount:number = null
	constructor()
	{
		super();

        this.myViewSeatId = 0;
        this.maxHandlerCardNum = 5;
        this.cardOffRate = QznnConst.config.bigCardOffWRate;
        this.moveStartPos = cc.p(0, 0);
        this.touchUpY = 15;
        this.maxTouchUpNum = 3;

        this.touchUpNum = 0;
        this.seatCount = RoomMgr.getInstance().getSeatCount();
    }
    
    //重新开局
    resetData(){
        this.list_cardsLogicId = null;
        this.touchUpNum = 0;
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    model:Model
    list_myCards:Array<cc.Node> = null
    list_hideCards:Array<cc.Node> = null
    num_showCards:number = null
    
	ui={
        //在这里声明ui
        atlas_cards:null,
        node_btn_tanpai:null,
        node_btn_tanpaiTip:null,
        node_btn_cuopai:null,
        node_btn_openCard:null,
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
        this.initUi();

        this.list_hideCards = [];
        this.list_myCards = [];
        this.num_showCards = 0;
	}
	//初始化ui
	initUi()
	{
        this.ui.atlas_cards = ctrl.atlas_cards;
        this.ui.node_btn_tanpai = ctrl.node_btn_tanpai;
        this.ui.node_btn_tanpaiTip = ctrl.node_btn_tanpaiTip;
        this.ui.node_btn_cuopai = ctrl.node_btn_cuopai;
        this.ui.node_btn_openCard = ctrl.node_btn_openCard;
    }

    /**
     * 
     * 显示一组卡牌
     */
    showCard(cardsNum:number){
        let i,
            cardNode:cc.Node;
        for(i = 0; i < this.model.maxHandlerCardNum; i ++){
            cardNode = this.list_myCards[i];
            if(!cardNode){
                cardNode = BullCardsMgr.addMyCard();
                this.list_myCards.push(cardNode);
            }
            cardNode.zIndex = i;
            if(cardsNum > 0 && cardNode.active == false){
                cardsNum -= 1;
                cardNode.active = true;
                cardNode.opacity = 255;
                cardNode.color = cc.Color.WHITE;
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
    giveCards (giveNum:number){
        let i,
            cardNode:cc.Node,
            startPos,
            targetPos,
            endPos,
            moveTime,
            intervalTime;

        startPos = this.model.moveStartPos;
        targetPos = this.getGiveTargetPos(0);
        moveTime = QznnConst.config.cardIntervalTime;
        intervalTime = QznnConst.config.cardMoveTime;

        //create all
        this.showCard(giveNum);

        for(i = 0; i < giveNum; i ++){
            cardNode = this.list_myCards[giveNum - i - 1];
            if(cardNode){
                cardNode.position = startPos;
                cardNode.zIndex = i + 1;
                endPos = cc.p(targetPos.x, targetPos.y);
                endPos.x += i * this.model.cardOffRate * cardNode.width;
                let act1 = cc.delayTime(i * intervalTime);
                let act2 = cc.moveTo(moveTime, endPos);
                if(i == giveNum - 1){
                    let act3 = cc.callFunc(ctrl.onMyGiveCardEnd, ctrl);
                    cardNode.runAction(cc.sequence(act1, act2, act3));
                }else{
                    cardNode.runAction(cc.sequence(act1, act2));
                }
            }
        }
    }

    hideAllCards(){
        for(let i = 0; i < this.list_myCards.length; i ++){
            let card = this.list_myCards[i];
            card.active = false;
        }
    }

    openAllCards (valueList, cb){
        BullCardsMgr.openCards(this.list_myCards, valueList, cb);
    }

    exchangeTouchState(cardNode:cc.Node){
        if(cardNode[C_cardAttr].initPosY){
            cardNode.y = cardNode[C_cardAttr].initPosY;
            cardNode[C_cardAttr].initPosY = null;
            this.model.touchUpNum -= 1;
            this.model.touchUpNum = Math.max(this.model.touchUpNum, 0);
        }else{
            if(this.model.touchUpNum < this.model.maxTouchUpNum){
                cardNode[C_cardAttr].initPosY = cardNode.y;
                cardNode.y += this.model.touchUpY;
                this.model.touchUpNum += 1;
            }            
        }
    }

    //盖住所有的卡牌
    coverAllCards(){
        BullCardsMgr.coverCards(this.list_myCards);
    }

    openTouch (){
        this.node.on(cc.Node.EventType.TOUCH_START, ctrl.onTouchStart, ctrl);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, ctrl.onTouchMove, ctrl);
        this.node.on(cc.Node.EventType.TOUCH_END, ctrl.onTouchEnd, ctrl);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, ctrl.onTouchCancel, ctrl);
    }
    closeTouch(){
        this.node.off(cc.Node.EventType.TOUCH_START, ctrl.onTouchStart, ctrl);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, ctrl.onTouchMove, ctrl);
        this.node.off(cc.Node.EventType.TOUCH_END, ctrl.onTouchEnd, ctrl);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, ctrl.onTouchCancel, ctrl);
    }

    getGiveTargetPos(viewSeatId:number){
        return BullPosMgr.getInstance().getGiveCardPos(viewSeatId);
    }

    //是否显示摊牌按钮
    setTanpaiBtnShow(isShow:Boolean){
        this.ui.node_btn_tanpai.active = isShow;
        this.ui.node_btn_tanpaiTip.active = isShow;
    }

    //显示提示
    showTiShi (){
        let cardsList = this.model.list_cardsLogicId;
        let resultObj = BullCardsMgr.getCardResult(cardsList);
        QznnLogic.getInstance().emit_showResultType(resultObj.resultType);
        if(resultObj.resultType != 0){
            //有牛，卡牌上需要提示
            let curCard, startList = resultObj.cardIdList.slice(0, 3);
            for(let i = 0; i < this.list_myCards.length; i ++){
                curCard = this.list_myCards[i];
                for(let j = 0; j < startList.length; j ++){
                    if(startList[j] == curCard[C_cardAttr].logicValue){
                        curCard.opacity = 190;
                        startList.splice(j, 1);
                        break;
                    }
                }
            }
        }
    }

    //控制搓牌的显隐
    setCuoPaiBtnShow (isShow:Boolean){
        this.ui.node_btn_cuopai.active = isShow;
    }
    //控制翻牌按钮的显隐
    setOpenCardBtnShow(isShow:Boolean){
        this.ui.node_btn_openCard.active = isShow;
    }

    //================================= private
}
//c, 控制
@ccclass
export default class QznnMyCardsCtrl extends BaseCtrl {
    model:Model = null
    view:View = null
    private list_touchPos:Array<cc.Vec2> = null
    private ctrl_calculate = null
	//这边去声明ui组件
    @property({
        type:cc.SpriteAtlas,
        displayName:"cardsAtlas"
    })
    atlas_cards:cc.SpriteAtlas = null
    @property({
        type:cc.Node,
        displayName:"tanpaiBtn"
    })
    node_btn_tanpai:cc.Node = null
    @property({
        type:cc.Node,
        displayName:"tanpaiTipBtn"
    })
    node_btn_tanpaiTip:cc.Node = null
    @property(cc.Node)
    node_btn_cuopai:cc.Node = null
    @property(cc.Node)
    node_btn_openCard:cc.Node = null
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
        this.initMvc(Model,View);
        BullCardsMgr.initData(this, this.ui.atlas_cards);
	}

	//定义网络事件
	defineNetEvents()
	{
        this.n_events = {};
        this.n_events[QznnConst.clientEvent.onGiveCards] = this.onStartGive;
        this.n_events[QznnConst.clientEvent.onSettle] = this.onSettle_bull;
        this.n_events[QznnConst.clientEvent.onTanPai] = this.onTanPai;
        this.n_events[QznnConst.clientEvent.onStart] = this.onStart;
        this.n_events[QznnConst.clientEvent.onProcess] = this.onProcess;
        this.n_events['onPrepare'] = this.onPrepare;
	}
	//定义全局事件
	defineGlobalEvents()
	{
        this.g_events[GEventDef.bull_cuopaiEnd] = this.onCuopaiEnd;
	}
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.image, this.ui.node_btn_tanpai, this.node_btn_tanpai_cb, '点击摊牌');
        this.connect(G_UiType.image, this.ui.node_btn_tanpaiTip, this.node_btn_tanpaiTip_cb, '点击摊牌提示');
        this.connect(G_UiType.image, this.ui.node_btn_cuopai, this.node_btn_cuopai_cb, '点击搓牌');
        this.connect(G_UiType.image, this.ui.node_btn_openCard, this.node_btn_openCard_cb, '点击翻牌');
	}
	start () {
        // this.view.giveCards(5);

        // this.view.openTouch();
	}
    //网络事件回调begin
    
    //游戏开始
    onStart(){
        this.view.hideAllCards();
    }
    onPrepare(msg){
        if(msg.seatid == RoomMgr.getInstance().getMySeatId()){
            //自己准备，清理所有上一局的表现
            this.view.hideAllCards();
        }
    }
    onProcess(msg){
        if(msg.process==QznnConst.process.start){ 
            //游戏重新开始
            this.view.hideAllCards();
            this.model.touchUpNum = 0;
		}else if(msg.process==QznnConst.process.grabDealer){
            //开始抢庄
            QznnLogic.getInstance().openChooseGrab();
        }else if(msg.process==QznnConst.process.chooseChip){
            //开始下注
        }
    }
    /*
    cardsNum:null,                  //发牌的数量
            matchid:null,                   //赛事id
            myCardsList:null                //自己的卡牌列表
    */
    onStartGive(msg){
        //console.log('********on my  StartGive* = ', msg)
        this.model.list_cardsLogicId = msg.myCardsList;
        this.view.giveCards(msg.myCardsList.length);
        //延时后打开算牌ui
        let time = QznnConst.config.cardIntervalTime*QznnConst.config.maxGroupCardsNum+QznnConst.config.cardMoveTime;
        time *= this.model.seatCount;
        setTimeout(()=>{
            this.onGiveAllCardEnd();
        }, time * 1000)
    }
    //所有卡牌发牌结束
    onGiveAllCardEnd(){
        //console.log('onGiveCardEnd===')
        this.view.openTouch();
        this.view.setTanpaiBtnShow(true);
    }
    /*有人摊牌
    seatId:null,                        //摊牌玩家的位置id
            cardLogicIdList:null                //摊牌玩家手上的牌列表
            resultType:null,                    //结果类型，牛几
    */
    onTanPai(msg){
        //console.log('onTanPai=== ',msg)
        if(msg.seatId == RoomMgr.getInstance().myseatid){
            this.view.closeTouch();
            if(this.ctrl_calculate){
                this.ctrl_calculate.finish();
                this.ctrl_calculate = null;
            }
            // this.view.coverAllCards();
            let targetPos = this.view.getGiveTargetPos(this.model.myViewSeatId);
            BullCardsMgr.showTanPai(this.view.list_myCards, msg.cardLogicIdList, targetPos);
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
        //console.log('****************onSettle = ', msg)

        //将没有摊牌的玩家摊牌
        let logicId = RoomMgr.getInstance().getMySeatId();
        let resultObj = msg.dict_notTanPai[logicId];
        if(resultObj){
            let targetPos = this.view.getGiveTargetPos(this.model.myViewSeatId);
            BullCardsMgr.showTanPai(this.view.list_myCards, resultObj.cardIdList, targetPos);

            this.view.setTanpaiBtnShow(false);
        }
        this.view.closeTouch();
        if(this.ctrl_calculate){
            this.ctrl_calculate.finish();
            this.ctrl_calculate = null;
        }
        //显示结算
        QznnLogic.getInstance().openSettle((uiCtrl:Prefab_bull_settleCtrl)=>{
            if(msg.winSeatId == logicId){
                uiCtrl.showWin();
            }else{
                uiCtrl.showFail();
            }
        
        });
    }

	//end
    //全局事件回调begin
    
    //搓牌结束
    onCuopaiEnd (msg){
        if(msg == 1){
            //完成搓牌
            this.node_btn_openCard_cb();
        }else{
            //未完成
        }
    }

	//end
    //按钮或任何控件操作的回调begin

    //点击翻牌
    private node_btn_openCard_cb (){
        this.view.setOpenCardBtnShow(false);
        this.view.setCuoPaiBtnShow(false);

        this.view.openAllCards(this.model.list_cardsLogicId, ()=>{
            this.view.openTouch();
            this.view.setTanpaiBtnShow(true);
        });
    }
    //点击搓牌
    private node_btn_cuopai_cb(){
        this.view.setCuoPaiBtnShow(false);
        QznnLogic.getInstance().openCuopai(()=>{
            QznnLogic.getInstance().emit_cuopai(this.model.list_cardsLogicId);
        });
    }
    //点击摊牌
    private node_btn_tanpai_cb(curNode:cc.Node){
        //console.log('node_btn_tanpai_cb===')
        this.view.setTanpaiBtnShow(false);
        
        QznnLogic.getInstance().reqTanpai();
    }
    //点击摊牌提示
    private node_btn_tanpaiTip_cb(curNode:cc.Node){
        //console.log('点击摊牌提示')
        this.view.showTiShi();
    }

    //发牌结束回调
    public onMyGiveCardEnd(){
        //console.log('on_giveCardsEnd', this.model.list_cardsLogicId)
    }
    //点击了卡牌容器
    public onTouchStart(event){
        let pos = event.touch.getLocation();
        this.list_touchPos = [];
        this.list_touchPos.push(pos);
    }
    //暂时停用多选，启用单选
    public onTouchMove(event){
        // let pos = event.touch.getLocation();
        // this.list_touchPos.push(pos);
        // this.checkCardsTouch(this.view.list_myCards, [pos]);
    }
    public onTouchEnd(event){
        let cards = this.checkCardsTouch(this.view.list_myCards, this.list_touchPos);

        let i,
            list_down = [],
            list_up = [];
        for(i = 0; i < cards.length; i ++){
            let isDown = Boolean(cards[i][C_cardAttr].initPosY);
            if(isDown){
                //down
                list_down.push(this._getCardValue(cards[i][C_cardAttr].logicValue));
            }else{
                //up
                list_up.push(this._getCardValue(cards[i][C_cardAttr].logicValue));
            }
        }
        if(cards.length > 0){
            if(this.ctrl_calculate){
                this.ctrl_calculate.delValues(list_down);
                this.ctrl_calculate.addValues(list_up);
            }else{
                QznnLogic.getInstance().openCalculate((ctrl)=>{
                    this.ctrl_calculate = ctrl;
                    this.ctrl_calculate.delValues(list_down);
                    this.ctrl_calculate.addValues(list_up);
                });
            }
        }

        //一次最多只能选中三张卡牌
        // cards = cards.slice(0, 3);
        for(let i = 0; i < cards.length; i ++){
            cards[i].opacity = 255;
            //console.log('click card VALUE= ', BullCardsMgr.getSixValue(cards[i][C_cardAttr].logicValue));
            this.view.exchangeTouchState(cards[i]);
        }
        this.list_touchPos = null;
    }
    public onTouchCancel(event){
        this.list_touchPos = null;
    }

    //end
    
    private _getCardValue(logicValue:number){
        let sixValue:string = BullCardsMgr.getSixValue(logicValue);
        return sixValue.slice(-1);
    }

    //handler here ======================================

    //检查是否卡牌已经被点击
    checkCardsTouch(cardsList:Array<cc.Node>, posList:Array<cc.Vec2>):Array<cc.Node>{
        let i, j,
            // cardsList = this.list_myCards,
            cardNode:cc.Node = null,
            cardRect,
            winSizeW2 = cc.director.getWinSize().width/2,
            winSizeH2 = cc.director.getWinSize().height/2,
            curX,
            curY,
            list_touchCards:Array<cc.Node> = [];
        for(i = 0; i < cardsList.length; i ++){
            cardNode = cardsList[i];
            if(cardNode.active && cardNode[C_cardAttr].isOpen){
                curX = cardNode.x+winSizeW2 - cardNode.width/2;
                curY = cardNode.y+winSizeH2 - cardNode.height/2;
                if(cardNode.zIndex == this.model.maxHandlerCardNum){
                    //最后一张
                    cardRect = cc.rect(curX, curY, cardNode.width, cardNode.height);
                }else{
                    cardRect = cc.rect(curX, curY, this.model.cardOffRate*cardNode.width, cardNode.height);
                }
                for(j = 0; j < posList.length; j ++){
                    if(cc.rectContainsPoint(cardRect, posList[j])) {
                        cardNode.opacity = 120;
                        list_touchCards.push(cardNode);
                        break;
                    }
                }
            }
        }
        return list_touchCards
    }

    onDestroy(){
        BullCardsMgr.clearData();
        super.onDestroy();
    }
}