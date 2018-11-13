/*
author: YOYO
日期:2018-03-16 13:53:24
*/
import LoaderMgr from "../../AppStart/AppMgrs/LoaderMgr";
import GEventDef from "../../Plat/GameMgrs/GEventDef";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";
import BaseModel from "../../Plat/Libs/BaseModel";
import BaseView from "../../Plat/Libs/BaseView";
import BaseCtrl from "../../Plat/Libs/BaseCtrl";

//MVC模块,
const {ccclass, property} = cc._decorator;
const C_attr = "_isMove";//是否有被移动过
let ctrl : Bull_cuopaiCtrl;
let BullConst;
let BullLogic;
//模型，数据处理
class Model extends BaseModel{
    w2:number                       //一半的界面宽度
    h2:number                       //一半的界面高度
    waitPos:cc.Vec2                 //卡牌等待处理的位置
    openAngle:number                //打开的角度
	constructor()
	{
        super();
        BullConst = RoomMgr.getInstance().getDef();
        BullLogic = RoomMgr.getInstance().getLogic().getInstance();
        let visibleSize = cc.director.getVisibleSize();
        this.w2 = visibleSize.width/2;
        this.h2 = visibleSize.height/2;
        this.waitPos = cc.p(-this.w2*0.3, -this.h2*1.2);
        this.openAngle = 2.5;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    model:Model
    list_cards:Array<cc.Node>
	ui={
        //在这里声明ui
        node_cardsList:null,
        node_btn_close:null
	};
    node=null;
    private list_asserts
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi(){
        this.ui.node_cardsList = ctrl.node_cardsList;
        this.ui.node_btn_close = ctrl.node_btn_close;
    }
    //根据数值初始化卡牌列表
    initCardGroup(cardValueList:Array<number>, cb:Function){
        let loadNum = 0;
        this.list_cards = [];
        for(let i = 0; i < cardValueList.length; i ++){
            this.createOneCard(i, cardValueList[i], ()=>{
                loadNum += 1;
                if(loadNum >= cardValueList.length){
                    //全部加载完成
                    cb();
                }
            })
        }
    }

    //创建一张卡牌
    createOneCard (index, cardValue, cb){
        if(!this.list_asserts) this.list_asserts = [];
        let url = 'Plat/GameRoomCommon/BigPoker/bull2_'+this.getSixValue(cardValue);
        cc.loader.loadRes(url, cc.SpriteFrame, (err, assets)=>{
            if(err){
                cc.error(err)
            }else{
                this.list_asserts.push(assets);
                let curNode = this.ui.node_cardsList.children[index];
                curNode.getComponent(cc.Sprite).spriteFrame = assets;
                curNode[C_attr] = false;
                this.initCardPos(curNode);
                this.list_cards[this.ui.node_cardsList.children.indexOf(curNode)] = curNode;
                cb();
                cb = null;
            }
        })
    }
    //卡牌入场
    doCardMoveIn (cb:Function){
        let cardsList = this.list_cards;
        for(let i = 0; i < cardsList.length; i ++){
            if(i ==0){
                this.doMoveIn(cardsList[i], ()=>{
                    cb();
                })
            }else{
                this.doMoveIn(cardsList[i]);
            }
        }
    }
    //让卡牌队列成扇形打开
    resortCards (){
        let cardsList = this.list_cards;
        let minIndex = 2,
            oneAngle = this.model.openAngle,
            curAngle;
        for(let i = 0; i < cardsList.length; i ++){
            if(i < minIndex){
                //左边
                curAngle = -(minIndex - i) * oneAngle;
                ////console.log('左边的角度',curAngle)
                this.doRotate(cardsList[i], curAngle, i == 0);
            }else if(i == minIndex){
                //中间
            }else{
                //右边
                curAngle = (i - minIndex) * oneAngle;
                ////console.log('右边的角度',curAngle)
                this.doRotate(cardsList[i], curAngle);
            }
        }
    }
    //退出界面动作
    doExit (){
        let curNode:cc.Node,
            isOpenAll = true;
        for(let i = 0; i < this.list_cards.length; i ++){
            curNode = this.list_cards[i];
            if(i == 0){
                this.doMoveIn(curNode, ()=>{
                    this.doClearRotation();
                })
            }else{
                this.doMoveIn(curNode)
            }
        }
    }
    //点击并移动卡牌
    openTouch (){
        this.ui.node_cardsList.on(cc.Node.EventType.TOUCH_START, ctrl.onTouchStart, ctrl);
        this.ui.node_cardsList.on(cc.Node.EventType.TOUCH_MOVE, ctrl.onTouchMove, ctrl);
        this.ui.node_cardsList.on(cc.Node.EventType.TOUCH_END, ctrl.onTouchEnd, ctrl);
        this.ui.node_cardsList.on(cc.Node.EventType.TOUCH_CANCEL, ctrl.onTouchCancel, ctrl);
    }
    closeTouch(){
        this.ui.node_cardsList.off(cc.Node.EventType.TOUCH_START, ctrl.onTouchStart, ctrl);
        this.ui.node_cardsList.off(cc.Node.EventType.TOUCH_MOVE, ctrl.onTouchMove, ctrl);
        this.ui.node_cardsList.off(cc.Node.EventType.TOUCH_END, ctrl.onTouchEnd, ctrl);
        this.ui.node_cardsList.off(cc.Node.EventType.TOUCH_CANCEL, ctrl.onTouchCancel, ctrl);
    }
    //获取是否已经完成搓牌
    getIsCuopaiDone (){
        let curNode:cc.Node,
            moveNum = 0;
        for(let i = 0; i < this.list_cards.length; i ++){
            curNode = this.list_cards[i];
            if(curNode[C_attr]){
                moveNum += 1;
            }
        }
        return moveNum >= 4;
    }

    //清理缓存的卡牌
    clearCacheCards (){
        if(this.list_asserts && this.list_asserts.length > 0){
            for(let i = 0; i < this.list_asserts.length; i ++){
                cc.loader.releaseAsset(this.list_asserts[i]);
            }
            this.list_asserts = null;
        }
    }

    //============

    private doClearRotation (){
        let curNode:cc.Node,
            time = 0.3;
        for(let i = 0; i < this.list_cards.length; i ++){
            curNode = this.list_cards[i];
            let act1 = cc.rotateTo(time, 0);
            if(i == 0){
                let act2 = cc.callFunc(()=>{
                    this.doCardsExit();
                }, this);
                curNode.runAction(cc.sequence(act1, act2))
            }else{
                curNode.runAction(act1);
            }
        }
    }
    private doCardsExit (){
        let curNode:cc.Node,
            time = 0.3;
        for(let i = 0; i < this.list_cards.length; i ++){
            curNode = this.list_cards[i];
            if(i == 0){
                this.doMoveOut(curNode, ()=>{
                    ctrl.onCuopaiEnd();
                })
            }else{
                this.doMoveOut(curNode);
            }
        }
    }
    private doMoveOut (curNode:cc.Node, cb?:Function){
        let time = 0.5;
        let act = cc.moveTo(time, cc.p(this.model.waitPos.x, -(this.model.h2+curNode.height)));
        if(cb){
            let act2 = cc.callFunc(cb, this);
            curNode.runAction(cc.sequence(act, act2));
        }else{
            curNode.runAction(act);
        }
    }
    private doMoveIn (curNode:cc.Node, cb?:Function){
        let time = 0.5;
        let act = cc.moveTo(time, this.model.waitPos);
        if(cb){
            let act2 = cc.callFunc(cb, this);
            curNode.runAction(cc.sequence(act, act2));
        }else{
            curNode.runAction(act);
        }
    }
    private doRotate (curNode:cc.Node, angle, isOpen?:Boolean){
        let time = 0.5;
        let act1 = cc.rotateTo(time, angle);
        if(isOpen){
            //这里开启卡牌的点击
            let act2 = cc.callFunc(this.openTouch, this);
            curNode.runAction(cc.sequence(act1, act2));
        }else{
            curNode.runAction(act1);
        }
    }
    private initCardPos (cardNode:cc.Node){
        cardNode.x = this.model.waitPos.x;
        cardNode.y = -(this.model.h2+cardNode.height);
    }
    private getSixValue(logicNum){
        logicNum = parseInt(logicNum);
        let str = logicNum < 14 ?  "0x0" : "0x";
        return str + logicNum.toString(16);
    }
}
//c, 控制
@ccclass
export default class Bull_cuopaiCtrl extends BaseCtrl {
	view:View = null
    model:Model = null
    private touchCard:cc.Node               //选中的卡牌
	//这边去声明ui组件
    @property(cc.Node)
    node_cardsList:cc.Node = null
    @property(cc.Node)
    node_btn_close:cc.Node = null
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
        this.n_events[BullConst.clientEvent.onProcess] = this.onProcess;
        this.n_events[BullConst.clientEvent.onSyncData] = this.onSyncData;
	}
	//定义全局事件
	defineGlobalEvents()
	{
        this.g_events[GEventDef.bull_cuopai] = this.onStartCuopai;
        this.g_events[GEventDef.usersUpdated] = this.usersUpdated;
	}
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.image, this.ui.node_btn_close, this.node_btn_close_cb, '点击关闭搓牌');
	}
	start () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchLimit, this);
    }
    finish(){
        var manager = cc.director.getCollisionManager();
        manager.enabled = false;
        super.finish();
    }
    //网络事件回调begin
    
    //游戏进程
    onProcess(msg){
        switch(msg.process){
            case BullConst.process.settle:
                //游戏结算
                this.finish();
            break
        }
    }
    onSyncData(){
        this.finish();
    }

	//end
    //全局事件回调begin
    usersUpdated(){
        this.finish();
    }
    //有消息需要请求搓牌
    onStartCuopai(msg){
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        //初始化卡牌
        this.view.initCardGroup(msg, ()=>{
            this.startCuopai();
        })
    }

	//end
    //按钮或任何控件操作的回调begin

    onCuopaiEnd (){
        BullLogic.emit_cuopaiEnd(this.view.getIsCuopaiDone()?1:0);
        ctrl.finish();
    }

    private touchLimit (){

    }
    
    //关闭页面
    private node_btn_close_cb(){
        this.view.closeTouch();
        this.view.doExit();
    }
    
    //点击了卡牌容器
    public onTouchStart(event){
        let pos = event.touch.getLocation();
        this.checkTouch(pos);
    }
    //暂时停用多选，启用单选
    public onTouchMove(event){
        let delta = event.touch.getDelta();
        if(this.touchCard){
            this.touchCard.x += delta.x;
            this.touchCard.y += delta.y;
            this.touchCard[C_attr] = true;
        }
    }
    public onTouchEnd(event){
        this.touchCard = null
        if(this.view.getIsCuopaiDone()){
            this.node_btn_close_cb();
        }
    }
    public onTouchCancel(event){
        this.touchCard = null
    }
    //end
    
    //检测点击了哪个卡牌
    private checkTouch (pos){
        let cardList = this.view.list_cards,
            len = cardList.length,
            curNode:cc.Node,
            curPos,
            curRect;
        for(let i = len -1; i >= 0; i --){
            curNode = cardList[i];
            let isTouch = cc.Intersection.pointInPolygon(pos, curNode.getComponent(cc.Collider).world.points);
            if(isTouch){
                //点击了一张卡牌
                this.touchCard = curNode;
                break
            }
        }
    }
    //开始搓牌
    private startCuopai(){
        this.view.doCardMoveIn(()=>{
            this.view.resortCards();
        });
    }

    onDestroy(){
        this.view.clearCacheCards();
        super.onDestroy();
    }
}