import LocalStorage from "../../Plat/Libs/LocalStorage";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";
import BaseMgr from "../../Plat/Libs/BaseMgr";
let NiuNiu = require("NiuNiuFP");

//牛牛卡牌

const C_cardAttr = "_cardInfo";
const CONFIGS = {
    otherCardSizeRate:0.6,                      //其他玩家卡牌之间的间隔
    cardIntervalTime:0.1,                       //发牌间隔
    cardMoveTime:0.25,                          //卡牌移动的时间
    moveStartPos:cc.p(0,0),                     //卡牌发牌的起始位置
    bigCardOffWRate:1.08,                       //大张卡牌发牌后的卡牌间隔
    halfRate:2,                                 //单张卡牌宽度和所有排列长度一半之间的倍数
}
const C_CardType = cc.Enum({
    block : 0,//方块
    flower : 1,//梅花
    redHeart : 2,//红心
    blackHeart : 3//黑桃
}) 

class BullCardsMgr extends BaseMgr{
    atlas_myCards:cc.SpriteAtlas = null
    atlas_otherCards:cc.SpriteAtlas = null
    node_handler:cc.Node = null
    ctrl_handler:any = null
    SpriteFrameState:any = null
    lastcard:any = null
    allcard = []
    /**
     * 
     * @param handler 自己的卡牌操作类
     * @param atlas_cards 卡牌值的切换图集
     */
    initData(handler, atlas_cards){
        this.ctrl_handler = handler;
        this.node_handler = handler.node;
        this.atlas_myCards = atlas_cards;
        this.SpriteFrameState = 3;
        // cc.sys.localStorage.setItem("SpriteFrameState",this.SpriteFrameState);
        LocalStorage.getInstance().setBullCardBGCfg(this.SpriteFrameState);
    }
    setOtherCardsAtlas (atlas_cards){
        this.atlas_otherCards = atlas_cards;
    }
    destroy(){
        super.destroy();
        delete BullCardsMgr._instance;
    }
    
    setSpriteFrameState(state:Number){
        this.SpriteFrameState = state;
        // cc.sys.localStorage.setItem("SpriteFrameState",this.SpriteFrameState);
        LocalStorage.getInstance().setBullCardBGCfg(this.SpriteFrameState);
    }
    clearData(){
        this.atlas_myCards = null;
        this.atlas_otherCards = null;
        this.ctrl_handler = null;
        this.node_handler = null;
        BullCardsMgr._instance = null;
    }
    /**
     * 
     * @param logicNum 逻辑值，返回二进制命名
     */
    getSixValue(logicNum){
        logicNum = parseInt(logicNum);
        let str = logicNum < 14 ?  "0x0" : "0x";
        return str + logicNum.toString(16);
    }
    /**
     * 
     * @param cardNode 需要更新值的卡牌节点对象
     */
    setCardValue(cardNode:cc.Node){
        let value = parseInt(cardNode[C_cardAttr].logicValue);
        let sixValue = this.getSixValue(value);
        let name;
        let frame;
        if(sixValue == "0x00"){                                   //如果是背面
            switch(LocalStorage.getInstance().getBullCardBGCfg()){
                case 1:
                    sixValue += "_1";                                           //改变精灵帧的名字
                break
                case 2:
                    sixValue += "_2"; 
                break
                case 3:
                    sixValue = "0x00";
                break
                case 4:
                    sixValue += "_4"; 
                break
            }
        }
        if(cardNode[C_cardAttr].cardScale == 1){
            //自己的手牌
            name = "bull1_"+sixValue;
            frame = this.atlas_myCards.getSpriteFrame(name);
        }else{
            //其他人的手牌
            name = "bull_"+sixValue;
            frame = this.atlas_otherCards.getSpriteFrame(name);
        }
        if(frame){
            cardNode.getComponent(cc.Sprite).spriteFrame = frame;
            // cardNode.width *= cardNode[C_cardAttr].cardScale;
            // cardNode['_changeW'] = cardNode.width;
            // cardNode.height *= cardNode[C_cardAttr].cardScale;
            // cardNode['_changeH'] = cardNode.height;
        }else{
            cc.error('atlas lost frame= '+name+', user value= ',value);
        }
    }
    /**
     * 带有特效的发牌
     * @param isMyself 是否是自己的卡牌
     * @param cardsList 卡牌对象列表
     * @param targetPos 卡牌飞行的终点
     * @param cb 发牌结束后的回调
     * @param isNoEffect 是否不需要播放特效
     */
    giveCards (flyData){
        let isMyself = flyData.isMyself;
        let cardsList = flyData.cardsList;
        let targetPos = flyData.targetPos;
        let cb = flyData.cb;
        let isNoEffect = flyData.isNoEffect;
        let i, maxNum, curCardRate,
            cardNode:cc.Node,
            startPos,basePosX,
            endPos,
            moveTime,
            intervalTime;

        startPos = CONFIGS.moveStartPos;
        moveTime = CONFIGS.cardMoveTime;
        intervalTime = CONFIGS.cardIntervalTime;
        maxNum = cardsList.length;
        if(isMyself){
            curCardRate = CONFIGS.bigCardOffWRate;
        }else{
            curCardRate = CONFIGS.otherCardSizeRate;
        }
        for(i = 0; i < maxNum; i ++){
            cardNode = cardsList[maxNum - i - 1];
            if(cardNode){
                this.allcard.push(cardNode);
                cardNode.stopAllActions();
                cardNode.position = startPos;
                cardNode.zIndex = i + 1;
                endPos = cc.p(targetPos.x, targetPos.y);
                endPos.x += -(cardNode.width*curCardRate*CONFIGS.halfRate) + i * curCardRate * cardNode.width;
                if(isNoEffect){
                    cardNode.position = endPos;
                }else{
                    let act1 = cc.delayTime(i * intervalTime);
                    let act2 = cc.moveTo(moveTime, endPos);
                    if(i == maxNum - 1){
                        //发完牌了
                        let act3 = cc.callFunc(()=>{
                            if(cb) cb();
                        }, this);
                        cardNode.runAction(cc.sequence(act1, act2, act3));
                    }else{
                        cardNode.runAction(cc.sequence(act1, act2));
                    }
                }
            }
        }
    }
    //增加一张自己的卡牌
    addMyCard(){
        let curNode = new cc.Node();
        curNode.parent = this.node_handler;
        curNode.addComponent(cc.Sprite);
        curNode[C_cardAttr] = {
            logicValue:0,
            isOpen:false,
            initPosY:null,
            cardScale:1
        }
        this.setCardValue(curNode);
        return curNode
    }
    //增加一张他人的卡牌
    addOtherCard(){
        let curNode = new cc.Node();
        curNode.parent = this.node_handler;
        curNode.addComponent(cc.Sprite);
        curNode[C_cardAttr] = {
            logicValue:0,
            initPosY:null,
            isOpen:false,
            cardScale:CONFIGS.otherCardSizeRate
        }
        this.setCardValue(curNode);
        return curNode
    }
    /**
     * 隐藏所有的卡牌
     * @param cardsList 需要翻到背面的卡牌列表
     */
    coverCards(cardsList:Array<cc.Node>){
        let len = cardsList.length;
        for(let i = 0; i < len; i ++){
            this._coverCard(cardsList[i]);
        }
    }
    /**
     * 打开一组牌
     * @param cardsList 需要翻开牌的列表
     * @param valueList 翻牌后需要显示的值列表
     */
    openCards(cardsList:Array<cc.Node>, valueList:Array<number>, cb?:Function){
        let cardNode;
        for(let i = 0; i < cardsList.length; i ++){
            cardNode = cardsList[i];
            if(cardNode.active){
                cardNode[C_cardAttr].logicValue = valueList[i];
                this._openCard(cardNode, cb);
                cb = null
            }
        }
    }
    opencardsBycount(count:number,cardsList:Array<cc.Node>, valueList:Array<number>, cb?:Function){
        let cardNode;
        for(let i = 0; i < cardsList.length; i ++){
            if(i<count){
                this.lastcard = cardsList[i];
                this.lastcard.active = false;
                this.lastcard[C_cardAttr].logicValue = valueList[i];
            }
            else{
                cardNode = cardsList[i];
                if(cardNode.active){
                    cardNode[C_cardAttr].logicValue = valueList[i];
                    this._openCard(cardNode, cb);
                    cb = null
                }
            }
            
        }
    }
    //显示最后一张牌
    showlastcards(){
        this.lastcard.active = true;
    }
    //打开最后一张牌
    openlastcard(cb){
        this._openCard(this.lastcard,cb)
    }
    //摊牌显示,需要先清理先前的显示残留
    showTanPai(cardsList:Array<cc.Node>, valueList:Array<number>, resultType){
        this.resetCardsToTarget(cardsList);
        // let curList = this.resortTanPai(cardsList);
        this.resetCardsValue(cardsList, valueList);
        this.setGroupGray(cardsList, resultType, valueList);
    }
    //将卡牌队列直接显示到对应坐标
    resetCardsToTarget (cardsList:Array<cc.Node>){
        let giveNum = cardsList.length,
            i,
            cardNode,
            endPos;
        for(i = 0; i < giveNum; i ++){
            cardNode = cardsList[giveNum - i - 1];
            this._resetCard(cardNode);
        }
    }
    //根据结果置灰一组牌
    setGroupGray (cardsList:Array<cc.Node>, resultType, valueList){
        let isTeshupai = parseInt(resultType) > 10;
        if(isTeshupai) return;
        let isHaveBull = parseInt(resultType) > 0;
        let len = cardsList.length;
        let bullValueList = valueList.slice(0, 3);
        let curCardNode:cc.Node;
        for(let i = len-1; i >= 0; i --){
            curCardNode = cardsList[i];
            if(isHaveBull){
                // if(i < 3){
                //     cardsList[i].color = new cc.Color(121,121,121);
                // }
                if(bullValueList.indexOf(curCardNode[C_cardAttr].logicValue) != -1){
                    curCardNode.color = new cc.Color(121,121,121);
                }
            }else{
                curCardNode.color = new cc.Color(121,121,121);
            }
        }
    }

    //返回整理后的卡牌列表和结果
    getCardResult(cardIdList){
        let noKingList = NiuNiu.getNoKingList(cardIdList);
        let result = NiuNiu.getCardsResult(noKingList);
        if(result.type == NiuNiu.CardType.OX_VALUE0){
            //没有特殊牌
            ////console.log('没有特殊牌',result)
            let haveKing = noKingList.length != cardIdList.length;
            if(haveKing){
                //有大小王
                ////console.log('有大小王')
                return NiuNiu.getWanglaiMaxValue(noKingList, cardIdList);
            }else{
                return NiuNiu.getOXResult(cardIdList);
            }
        }else{
            ////console.log('有特殊牌',result)
            //有特殊牌
            return {
                cardIdList:result.cards,
                resultType:result.type
            }
        }
    }
    //重置列表的卡牌值
    private resetCardsValue(cardNodeList:Array<cc.Node>, valueList?:Array<number>){
        let cardNode:cc.Node;
        for(let i = 0; i < cardNodeList.length; i ++){
            cardNode = cardNodeList[i];
            cardNode.scaleX = 1;
            if(valueList) cardNode[C_cardAttr].logicValue = valueList[i];
            this.setCardValue(cardNode);
        }
    }
    //放入多个数, 获取牛值
    private _getBullResult(cardIdList){
        let total = 0, curValue;
        for(let i = 0; i < cardIdList.length; i ++){
            curValue = cardIdList[i] & 0x0f;
            if(curValue > 10) curValue = 10;
            total += curValue;
        }
        return total%10
    }

    //======================

    /**
     *  摊牌后卡牌的整理,api内会做清理，所有卡牌动作都会被清理
     * @param cardsList 传入整理好的5张牌的list，会将后两张特殊表现，突出牛几
     */
    private resortTanPai(cardsList:Array<cc.Node>){
        cardsList = this.reSortCardByPosX(cardsList.concat([]));
        let len = cardsList.length,
            card;
        for(let i = 0; i < cardsList.length; i ++){
            card = cardsList[i];
            if(i >= (len - 2)){
                card.zIndex = 0;
                card.y += card.height*0.35;
                card.x -= card.width*0.9;
            }
        }
        return cardsList
    }

    /**
     * 根据x值大小排序
     * @param cardsList 需要根据x坐标重新整理的卡牌列表
     */
    private reSortCardByPosX(cardsList:Array<cc.Node>){
        let self = this;
        let resort = function(a, b){
            return a.x - b.x;
        }
        cardsList = cardsList.sort(resort);
        return cardsList
    }
    private _resetCard(cardNode:cc.Node){
        //cardNode.stopAllActions();
        cardNode.opacity = 255;
        if(cardNode[C_cardAttr].initPosY) cardNode.y = cardNode[C_cardAttr].initPosY;
        // cardNode[C_cardAttr].logicValue = 0;
        cardNode[C_cardAttr].isOpen = false;
        cardNode[C_cardAttr].initPosY = null;
    }
    private _hideCard (cardNode:cc.Node){
        cardNode.active = false;
        cardNode[C_cardAttr].isOpen = false;
        // this.num_showCards -= 1;
        // this.list_hideCards.push(cardNode);
    }
    private _coverCard(cardNode:cc.Node){
        cardNode[C_cardAttr].logicValue = 0;
        this.setCardValue(cardNode);
    }
    private _openCard(cardNode:cc.Node, cb?:Function){
        let intervalTime = 0.3;
        cardNode[C_cardAttr].isOpen = true;
        let act1 = cc.scaleTo(intervalTime, 0, 1);
        let act2 = cc.callFunc(()=>{
            act1 = cc.scaleTo(intervalTime, 1, 1);
            this.setCardValue(cardNode);
            if(cb){
                let act3 = cc.callFunc(()=>{
                    cb();
                }, this);
                cardNode.runAction(cc.sequence(act1, act3));
            }else{
                cardNode.runAction(act1);
            }
        });
        cardNode.runAction(cc.sequence(act1, act2));
    }
    //初始化房间的特殊牌限制规则
    initTeshuLimit (){
        let cfg = RoomMgr.getInstance().getFangKaCfg();
        ////console.log('这里是房间配置=== ', cfg);
        let limitList = [];
        //葫芦牛
        if(parseInt(cfg.v_huluNiuLimit) == 0){
            limitList.push(NiuNiu.CardType.OX_THREE_SAME_TWAIN);
        }
        //顺子牛
        if(parseInt(cfg.v_shunziNiuLimit) == 0){
            limitList.push(NiuNiu.CardType.OX_ORDER_NUMBER);
        }
        //同花牛
        if(parseInt(cfg.v_tonghuaNiuLimit) == 0){
            limitList.push(NiuNiu.CardType.OX_FIVE_SAME_FLOWER);
        }
        //五花牛
        if(parseInt(cfg.v_wuhuaNiuLimit) == 0){
            limitList.push(NiuNiu.CardType.OX_FIVE_KING);
        }
        //炸弹牛
        if(parseInt(cfg.v_zhadanNiuLimit) == 0){
            limitList.push(NiuNiu.CardType.OX_FOUR_SAME);
        }
        //五小牛
        if(parseInt(cfg.v_wuxiaoNiuLimit) == 0){
            limitList.push(NiuNiu.CardType.OX_FIVE_CALVES);
        }
        NiuNiu.setLimitList(limitList);
    }

    //单例
    private static _instance:BullCardsMgr;
    public static getInstance ():BullCardsMgr{
        if(!this._instance){
            this._instance = new BullCardsMgr();
        }
        return this._instance;
    }
}

export default BullCardsMgr.getInstance()



// 葫芦
// 牛牛
// 顺子
// 同花
// 五花
// 五小牛
// 炸弹牛

// OX_VALUE0: 0,									//混合牌型
// OX_ORDER_NUMBER: 12,                           //顺子
// OX_FIVE_SAME_FLOWER: 13,                       //同花
// OX_THREE_SAME_TWAIN: 14,                       //葫芦
// OX_FOUR_SAME: 15,								//炸弹
// OX_FIVE_KING: 17,								//五花
// OX_FIVE_CALVES: 18								//五小牛