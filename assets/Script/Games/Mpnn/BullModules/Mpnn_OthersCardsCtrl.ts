/*
author: YOYO
日期:2018-02-05 10:05:18

他人的卡牌操作
*/
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import MpnnConst from "../BullMgr/MpnnConst";
import MpnnLogic from "../BullMgr/MpnnLogic";
import GEventDef from "../../../Plat/GameMgrs/GEventDef";
import BullCardsMgr from "../../../GameCommon/Bull/BullCardsMgr";
import BullPosMgr from "../../../GameCommon/Bull/BullPosMgr";
import MpnnAudio from "../BullMgr/MpnnAudio";
//MVC模块,
const {ccclass, property} = cc._decorator;
const C_cardAttr = "_cardInfo";
let ctrl : Mpnn_OthersCardsCtrl;
//模型，数据处理
class Model extends BaseModel{
    moveStartPos:cc.Vec2 = null
    maxHandlerCardNum:number = null                 //最大操作手牌数量
    cardOffRate:number = null                       //卡牌的间隔占卡牌本身的比例
    lowScaleRate:number = null                      //缩小的比例
    curGiveCardsNum:number = null                   //当前的发牌数量
    seatPlayeingNum:number = null
    timeoutId:number = null
    myseatId:number = null
    delaerSeatId:number = null
    mycardrecord=[]
    allcards = []
    list_playerSeat
	constructor()
	{
        super();
        this.moveStartPos = cc.p(0, 0);
        this.maxHandlerCardNum = 5;
        this.cardOffRate = MpnnConst.config.minCardOffWRate;
        this.lowScaleRate = 0.5;
        this.seatPlayeingNum = RoomMgr.getInstance().getSeatCount();
        this.myseatId = MpnnLogic.getInstance().getMyLogicSeatId();
        this.delaerSeatId = MpnnLogic.getInstance().getDelaerSeatId();
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    dict_cards:{} = null
	ui={
        //在这里声明ui
        atlas_cards:null,
        lastcard:null,
	};
	node=null;
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
                this.dict_cards[viewSeatId][i] = cardNode;
             }
            this.model.allcards.push(this.dict_cards[viewSeatId][i])
            cardNode.zIndex = i;
            if(cardsNum > 0 && cardNode.active == false){
                cardsNum -= 1;
                cardNode.active = true;
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
    giveCards (viewSeatId:number, giveNum:number){
        this.showCard(viewSeatId, giveNum);
        for(let key in this.dict_cards){
            //console.log(this.dict_cards[key]);
        }
        let flyData = {
            isMyself:false,
            cardsList:this.dict_cards[viewSeatId],
            targetPos:this.getGiveTargetPos(viewSeatId),
            cb:ctrl.onGiveCardsEnd.bind(ctrl)
        }
        BullCardsMgr.giveCards(flyData);
         //this.ui.lastcard.active = false;
        
            this.noshowlast(false);
         
        
    }
    //在某个位置刷新一副牌，可以显示对应的牌面
    setCardsOnly (viewSeatId:number, resultObj?){
        let giveNum = 5;
        this.showCard(viewSeatId, giveNum);
        let flyData = {
            isMyself:false,
            cardsList:this.dict_cards[viewSeatId],
            targetPos:this.getGiveTargetPos(viewSeatId),
            cb:ctrl.onGiveCardsEnd.bind(ctrl),
            isNoEffect:true
        }
        BullCardsMgr.giveCards(flyData);
        if(resultObj){
            //摊牌
            BullCardsMgr.showTanPai(this.dict_cards[viewSeatId], resultObj.cardIdList, resultObj.resultType);
            MpnnLogic.getInstance().emit_showResultType({
                resultType:resultObj.resultType,
                seatId:viewSeatId
            });
        }
    }

    //盖住所有的卡牌
    coverAllCards(viewSeatId:number){
        BullCardsMgr.coverCards(this.dict_cards[viewSeatId]);
    }

    setAllIsShow(isShow:Boolean){
        //console.log('setAllIsShow========================', isShow)
        if(this.dict_cards){
            for(let seatId in this.dict_cards){
                let cardsList = this.dict_cards[seatId];
                for(let i = 0; i < cardsList.length; i ++){
                    let card = cardsList[i];
                    card.stopAllActions();
                    card.active = isShow;
                }
            }
        }
    }
    nostopShow(isShow:Boolean){
        if(this.dict_cards){
            for(let seatId in this.dict_cards){
                let cardsList = this.dict_cards[seatId];
                for(let i = 0; i < cardsList.length; i ++){
                    let card = cardsList[i];
                    card.active = isShow;
                }
            }
        }
    }
    noshowlast(isShow:Boolean){
        //console.log('setAllIsShow========================', isShow)
        if(this.dict_cards){
            for(let seatId in this.dict_cards){
                let cardsList = this.dict_cards[seatId];
                for(let i = 0; i < cardsList.length; i ++){
                    let draw = cardsList.length-1;
                    if(i==draw){
                    let card = cardsList[i];
                    card.active = isShow;
                    }
                    
                }
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
export default class Mpnn_OthersCardsCtrl extends BaseCtrl {
    model:Model = null
    view:View = null
    list_giveSeatId:Array<number> = null
    list_roundSeatId
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
        this.n_events[MpnnConst.clientEvent.onGiveCards] = this.onStartGive;
        this.n_events[MpnnConst.clientEvent.onTanPai] = this.onTanPai;
        this.n_events[MpnnConst.clientEvent.onStart] = this.onStart;
        this.n_events[MpnnConst.clientEvent.onProcess] = this.onProcess;
        this.n_events[MpnnConst.clientEvent.onSettle] = this.onSettle_bull;
        this.n_events[MpnnConst.clientEvent.onSyncData] = this.onSyncData;
        this.n_events[MpnnConst.clientEvent.onMidEnter] = this.onMidEnter;
        this.n_events['onPrepare'] = this.onPrepare;

	}
	//定义全局事件
	defineGlobalEvents()
	{
        this.g_events[GEventDef.usersUpdated] = this.usersUpdated
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
        this.view.setAllIsShow(false);
    }
    onProcess(msg){
       if (msg.process==MpnnConst.process.calculate){
           //console.log('***************************************')
            this.view.nostopShow(true);
            //  this.ui.lastcard.active = true;\
            this.view.noshowlast(true);
        }else if(msg.process ==MpnnConst.process.chooseChip){
            let  fangjianCfg = RoomMgr.getInstance().getFangKaCfg();
            if(fangjianCfg.v_playerbuyLimit==1)
            {
                this.view.nostopShow(false);
            }
        }
     }
    onPrepare(msg){
        if(msg.seatid == RoomMgr.getInstance().getMySeatId()){
            //自己准备，清理所有上一局的表现
            this.clearData();
            this.view.setAllIsShow(false);

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

        this.list_roundSeatId = [];
        let validDict = MpnnLogic.getInstance().getValidSeats();
        //console.log(validDict)
        let room = RoomMgr.getInstance();
        // for(let seatId in validDict){
        //     if(seatId != RoomMgr.getInstance().getMySeatId()){
        //         this.list_roundSeatId.push(room.getViewSeatId(seatId));
        //     }
        // }
        // this.list_roundSeatId = this.list_roundSeatId.sort(function(a,b){
        //     return a < b
        // })
        //console.log(this.list_roundSeatId)

        //发牌给自己
        
        let time = MpnnConst.config.cardIntervalTime+MpnnConst.config.cardMoveTime;
        this.model.timeoutId = setTimeout(()=>{
            this.model.curGiveCardsNum = 5;
            for(let seatId in validDict){
                if(seatId != room.getMySeatId()){
                    this.view.giveCards(room.getViewSeatId(seatId), 5);
                }
            }
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
            // let targetPos = this.view.getGiveTargetPos(viewSeatId);
            BullCardsMgr.showTanPai(nodeList, msg.cardLogicIdList, msg.resultType);
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
                // let targetPos = this.view.getGiveTargetPos(viewSeatId);
                BullCardsMgr.showTanPai(this.view.getCardListByViewId(viewSeatId), resultObj.cardIdList, resultObj.resultType);
            }
        }
    }
    //断线重连
    onSyncData(msg){
        if(msg.processType == MpnnConst.process.giveCards){
            let count
            for(let seatId in RoomMgr.getInstance().users){
                count=RoomMgr.getInstance().getViewSeatId(seatId);
                if(seatId!=RoomMgr.getInstance().getMySeatId()){
                    this.view.giveCards(count, this.model.curGiveCardsNum);
                }
            }
        }
        else if(msg.processType == MpnnConst.process.chooseChip){
            let count
            for(let seatId in RoomMgr.getInstance().users){
                count=RoomMgr.getInstance().getViewSeatId(seatId);
                if(seatId!=RoomMgr.getInstance().getMySeatId()){
                    this.view.giveCards(count, this.model.curGiveCardsNum);
                }
            }
        }
        else if(msg.processType == MpnnConst.process.calculate){
            let count
           
            for(let seatId in RoomMgr.getInstance().users){
                count=RoomMgr.getInstance().getViewSeatId(seatId);
                if(seatId!=RoomMgr.getInstance().getMySeatId()){
                    this.view.giveCards(count, this.model.curGiveCardsNum);
                    this.view.noshowlast(true);
                }
            }
        }
        // else{
        //     //清理卡牌
        //     this.view.setAllIsShow(false);
        // }
    }
    //自己属于中途加入
    onMidEnter (msg){
        //console.log("这是中途加入的消息",msg);
        let enterseat = MpnnLogic.getInstance().getEnterSeatIds();
        for(let enterseatID in enterseat){
            for(let i=0;i<this.model.mycardrecord.length;i++)
            {
                if(enterseat[enterseatID]==this.model.mycardrecord[i]){
                    return
                }
            }
        }
        for(let enterseatID in enterseat){
             let draw = enterseat[enterseatID];
            if (enterseat[enterseatID] == RoomMgr.getInstance().getMySeatId()){
                let count
                for(let seatId in RoomMgr.getInstance().users){
                    count=RoomMgr.getInstance().getViewSeatId(seatId);
                    if(seatId!=RoomMgr.getInstance().getMySeatId()){
                        this.view.giveCards(count, this.model.curGiveCardsNum);
                        this.view.noshowlast(true);
                        this.model.mycardrecord.push(enterseat[enterseatID]);
                    }
                }
            }
         }
        
     
    }
    //end
    //全局事件回调begin
    usersUpdated(){
        //清理卡牌
        this.view.setAllIsShow(false);
    }
	//end
    //按钮或任何控件操作的回调begin
    
    //发牌结束回调
    public onGiveCardsEnd(){
        // //console.log('on_giveCardsEnd')
        // // this.view.openAllCards([40, 1, 13, 22, 34]);
        // this._inGiveRound();
    }
    //end

    clearData (){
        clearTimeout(this.model.timeoutId);
    }
    
    private _inGiveRound(){
        // if(this.list_roundSeatId)
        // {
        //     let viewSeatId = this.list_roundSeatId.pop();
        //     if(viewSeatId){
        //         this.view.giveCards(viewSeatId, this.model.curGiveCardsNum);
        //     }
        // }
        if(this.list_roundSeatId){
            let viewSeatId = this.list_roundSeatId
                 for(let key in viewSeatId){
                    this.view.giveCards(viewSeatId[key], this.model.curGiveCardsNum);
                 }
         }
       
    }

    onDestroy(){
        clearTimeout(this.model.timeoutId);
        super.onDestroy();
    }
}