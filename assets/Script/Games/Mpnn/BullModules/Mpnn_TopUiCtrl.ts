/*
author: YOYO
日期:2018-03-02 16:44:08
*/
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import MpnnLogic from "../BullMgr/MpnnLogic";
import MpnnConst from "../BullMgr/MpnnConst";
import GEventDef from "../../../Plat/GameMgrs/GEventDef";
import BullPosMgr from "../../../GameCommon/Bull/BullPosMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Mpnn_TopUiCtrl;
//模型，数据处理
class Model extends BaseModel{
    intervalID:number = null            //
    users=null
    myseatId = null             
    delaerSeatId = null                 //庄家位置ID
    isGrabing = null                    //是否播放动画
    playerNum = null                    //玩家数量
    grablist = null                     //抢庄倍数list
    seatCount = null                    //座位数量
    ExtraGrabing = null                 //是否所有人都不抢庄
    watcherSeatId:any                  //旁观者座位id列表
    node_qzbs = null                    //存储庄家倍数显示节点
    gameStart_state = null              //是否在游戏中
    qz_action = null                    //抢庄动画序列
	constructor()
	{
        super();
    }
    updateId(){
        this.gameStart_state = true;
        this.myseatId = MpnnLogic.getInstance().getMyLogicSeatId();
        this.delaerSeatId = MpnnLogic.getInstance().getDelaerSeatId();
        this.isGrabing = MpnnLogic.getInstance().getIsGrabing();
        this.playerNum = RoomMgr.getInstance().getPlayerCount();
        this.grablist = MpnnLogic.getInstance().getGrablist();
        this.seatCount = RoomMgr.getInstance().getSeatCount();
        this.ExtraGrabing = MpnnLogic.getInstance().getExtraGrabing();
        this.watcherSeatId = MpnnLogic.getInstance().getEnterSeatIds();
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    private dict_thinking
	ui={
        //在这里声明ui
        node_seats:null,
        node_img_grabAni:null,
        prefab_bet_btn:ctrl.prefab_bet_btn,
        prefab_maima_btn:ctrl.prefab_maima_btn,
        prefab_Qzhuang_btn:ctrl.prefab_Qzhuang_btn
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
        this.ui.node_seats = ctrl.node_seats;   
        this.ui.node_img_grabAni = ctrl.node_img_grabAni;   
    }
    
    //抢庄倍数显示状态全false
    clearQiangX(){
        let seatCount = RoomMgr.getInstance().getSeatCount();
        let viewSeatId = RoomMgr.getInstance().getViewSeatId(this.model.delaerSeatId);
        let qiangXList = null;
        if(seatCount == 6){
            qiangXList = this.ui.node_seats.children[0].children;  
        }else if(seatCount == 7){
            qiangXList = this.ui.node_seats.children[1].children;
        }else if(seatCount == 8){
            qiangXList = this.ui.node_seats.children[2].children;
        }
        for(let i =0;i<qiangXList.length;i++){
            qiangXList[i].children[0].active = false;
            qiangXList[i].children[1].active = false;
        }
    }
    //显示庄家头上抢X倍数
    showzhuangjiaQX(){
        if(!this.model.gameStart_state){
            return;
        }
        let viewSeatId = RoomMgr.getInstance().getViewSeatId(this.model.delaerSeatId);
        let delaerGrab = this.model.grablist[this.model.delaerSeatId]; 
        //console.log("this.model.grablist",this.model.grablist,this.model.delaerSeatId,viewSeatId) ;
        let seatCount = RoomMgr.getInstance().getSeatCount();
        if(this.model.ExtraGrabing){
            this.ui.node_seats.getChildByName(`seats_${seatCount}`).children[viewSeatId].children[2].children[0].getComponent(cc.Label).string = 1;
        }else{
            this.ui.node_seats.getChildByName(`seats_${seatCount}`).children[viewSeatId].children[2].children[0].getComponent(cc.Label).string = delaerGrab;
        }
        this.ui.node_seats.getChildByName(`seats_${seatCount}`).children[viewSeatId].active = true;
        this.ui.node_seats.getChildByName(`seats_${seatCount}`).children[viewSeatId].children[2].active = true;
    }
    //庄家头上抢X倍数显示隐藏
    removeZhuangjiaQX(){
        
        let viewSeatId = RoomMgr.getInstance().getViewSeatId(this.model.delaerSeatId);
        if(viewSeatId!=null){
            let seatCount = RoomMgr.getInstance().getSeatCount();
            this.ui.node_seats.getChildByName(`seats_${seatCount}`).children[viewSeatId].children[2].active = false;
        }
    }
    // //显示抢庄动画
    showGrabAni(){
        //let maxSeatCount = this.ui.node_seats.children.length;
        let room = RoomMgr.getInstance();
        let users = room.users;
        let GrabAniViewSeatId = [];
        this.model.qz_action = new Array;
        let delaytime = 0.05;
        let delaerGrab = this.model.grablist[this.model.delaerSeatId];          //庄家抢庄倍数
        this.ui.node_img_grabAni.active = true;
        this.ui.node_img_grabAni.children[1].active = false;
        this.ui.node_img_grabAni.children[0].active = true;
        if(this.model.ExtraGrabing){
            delaerGrab-=1;
        }
        //console.log("this.model.watcherSeatId.length",this.model.watcherSeatId);
        for(let seatId in users){
            let bolEnter = true;
            if (this.model.watcherSeatId.length != null){
                for(let i=0;i<this.model.watcherSeatId.length;i++){
                    if(seatId ==this.model.watcherSeatId[i]){ //旁观者不作动画
                        bolEnter = false;
                        break;
                    }
                }
            }
            if(this.model.grablist[seatId] == delaerGrab && bolEnter){
                GrabAniViewSeatId.push(room.getViewSeatId(seatId));
            }
        }
        for(let i=0;i<GrabAniViewSeatId.length*2;i++){
            let GrabseatId = null;
            if(i<GrabAniViewSeatId.length){
                GrabseatId = i;
            }else{
                GrabseatId = i-GrabAniViewSeatId.length;
            }
            //let act = 0;
            this.model.qz_action.push(cc.moveTo(0,this.ui.node_seats.getChildByName(`seats_${this.model.seatCount}`).children[GrabAniViewSeatId[GrabseatId]].position));
            this.model.qz_action.push(cc.delayTime(delaytime));
        }
    }

    public showQzhuang_btn(msg){
        if(msg.dictChooseGrab){//断线重连
            if (this.node.getChildByName("Mpnn_qiangzhuang") || msg.dictChooseGrab[this.model.myseatId]) {
                return
            }
        }
        if (this.node.getChildByName("Mpnn_qiangzhuang")) {
            return
        }
        let QzhuangBtn = cc.instantiate(this.ui.prefab_Qzhuang_btn);
        QzhuangBtn.parent = this.node;
    }

    public showBet_btn(msg){
        if(msg.dictChooseChip){//断线重连
            if (this.node.getChildByName("Mpnn_Bets_btn") || msg.dictChooseChip[this.model.myseatId]) {
                return
            }
        }
        if (this.node.getChildByName("Mpnn_Bets_btn") || this.model.myseatId == this.model.delaerSeatId) {
            return
        }
        let betBtn = cc.instantiate(this.ui.prefab_bet_btn);
        betBtn.parent = this.node;
    }
    public showmaima_btn(){
        if(this.model.myseatId == this.model.delaerSeatId){
            return
        }
       let  fangjianCfg = RoomMgr.getInstance().getFangKaCfg();
       if(fangjianCfg.v_playerbuyLimit==1)
       {
        let maima = cc.instantiate(this.ui.prefab_maima_btn)
        maima.parent = this.node
       }
    }
    //确定庄家，显示标识
    showGrabAniSign(){
        let viewSeatId = RoomMgr.getInstance().getViewSeatId(this.model.delaerSeatId);
        let seatCount = RoomMgr.getInstance().getSeatCount();
        this.ui.node_img_grabAni.active = true;
        this.ui.node_img_grabAni.children[0].active = true;
        this.ui.node_img_grabAni.children[1].active = true;
        this.ui.node_img_grabAni.position = this.ui.node_seats.getChildByName(`seats_${seatCount}`).children[viewSeatId].position;
    }
    //移除庄家标识
    removeGrabAniSign(){
        this.ui.node_img_grabAni.x = -759;
        this.ui.node_img_grabAni.y = -309;
        this.ui.node_img_grabAni.active = false;
    }
    //显示是否抢庄与抢庄倍数
    showAllQiangX (){
        let room = RoomMgr.getInstance();
        let users = room.users;
        let grablist = MpnnLogic.getInstance().getGrablist();
        for(let seatId in users){
            let bolEnter = true;
            if (this.model.watcherSeatId.length != null){
                for(let i=0;i<this.model.watcherSeatId.length;i++){
                    if(seatId ==this.model.watcherSeatId[i]){ //旁观者不显示抢庄倍数
                        bolEnter = false;
                        break;
                    }
                }
            }
            if(bolEnter){
                this.setQiangX(room.getViewSeatId(seatId), grablist[seatId]);
            }  
        }
    }
    //明抢显示其他玩家抢庄倍数
    showOtherQiangX(seatId){
        let room = RoomMgr.getInstance();
        let users = room.users;
        let grablist = MpnnLogic.getInstance().getGrablist();
        this.setQiangX(room.getViewSeatId(seatId), grablist[seatId]);
        //console.log("grablist[seatId]",grablist[seatId])
    }
    private setQiangX(viewSeatId:number, QiangX:number){
        let seatCount = RoomMgr.getInstance().getSeatCount();
        let qiangXList = null;
        if(seatCount == 6){
            qiangXList = this.ui.node_seats.children[0].getChildByName(`seat_${viewSeatId}`).children;  
        }else if(seatCount == 7){
            qiangXList = this.ui.node_seats.children[1].getChildByName(`seat_${viewSeatId}`).children;
        }else if(seatCount == 8){
            qiangXList = this.ui.node_seats.children[2].getChildByName(`seat_${viewSeatId}`).children;
        }
        if(QiangX == 0 || this.model.ExtraGrabing){
                qiangXList[0].active = true;
                qiangXList[1].active = false;
            }else{
                qiangXList[0].active = false;
                qiangXList[1].active = true;
                qiangXList[1].children[0].getComponent(cc.Label).string = QiangX;
            }
    }
}
//c, 控制
@ccclass
export default class Mpnn_TopUiCtrl extends BaseCtrl {
    view:View = null
    model:Model = null
    betsShowTime = null
    //这边去声明ui组件
    //seat info
    @property(cc.Node)
    node_seats:cc.Node = null
    // icons
    @property(cc.Node)
    node_img_grabAni:cc.Node = null

    @property(cc.Prefab)
    prefab_bet_btn:cc.Prefab = null;

    @property(cc.Prefab)
    prefab_maima_btn:cc.Prefab = null;

    @property(cc.Prefab)
    prefab_Qzhuang_btn:cc.Prefab = null;
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
        this.n_events[MpnnConst.clientEvent.onProcess] = this.onProcess;
        this.n_events[MpnnConst.clientEvent.onSyncData] = this.onSyncData;
        this.n_events[MpnnConst.clientEvent.onConfirmGrab] = this.onConfirmGrab;
        this.n_events[MpnnConst.clientEvent.onChooseGrab] = this.onChooseGrab;
        this.n_events['connector.entryHandler.enterRoom'] = this.onEnterRoom;
	}
	//定义全局事件
	defineGlobalEvents()
	{
        this.g_events['removeGrabAniSigh'] = this.removeGrabAniSigh;
	}
	//绑定操作的回调
	connectUi()
	{
        
	}
	start () {
        
    }
    //发射允许下注显示通知
    showBet_Btn(){
        this.gemit("showBet_Btn");
    }

    delyTime(){
        if(this.model.isGrabing){
            this.view.showGrabAni();
            this.model.qz_action.push(cc.callFunc(()=>{
                this.view.clearQiangX();
                this.view.showGrabAniSign();
                this.view.showzhuangjiaQX();
                this.showBet_Btn();
            }))
            this.ui.node_img_grabAni.runAction(cc.sequence(this.model.qz_action));
        }else{
            this.view.clearQiangX();
            this.view.showGrabAniSign();
            this.view.showzhuangjiaQX();
            this.showBet_Btn();
        }
    }
    
    //网络事件回调begin
    onProcess(msg) {
        this.model.updateId();
        switch (msg.process) {
            case MpnnConst.process.giveCards:
                this.view.showQzhuang_btn(msg);
                break;
            case MpnnConst.process.chooseChip:
                //console.log("这是显示下注的流程："+msg.process)
                this.view.showmaima_btn();
                break;
            case MpnnConst.process.start:
                break;
            case MpnnConst.process.calculate:
                break;
        }
    }
    onSyncData(msg){
        this.model.updateId();
        switch (msg.processType) {
            case MpnnConst.process.giveCards:
                    this.view.showQzhuang_btn(msg);
                break;
            case MpnnConst.process.chooseChip:
                //console.log("这是显示下注的断线重连："+msg.process)
                this.view.clearQiangX();
                this.view.showGrabAniSign();
                this.view.showzhuangjiaQX();
                this.view.showBet_btn(msg);
                this.view.showmaima_btn();
                this.showBet_Btn();
                break;
            case MpnnConst.process.calculate:
                this.view.showGrabAniSign();
                this.view.showzhuangjiaQX();
                break;
            case MpnnConst.process.settle:
                this.view.showGrabAniSign();
                this.view.showzhuangjiaQX();
                break;
        }
    }
    onConfirmGrab(msg){
        this.model.updateId();
        this.view.showAllQiangX();
        this.view.showBet_btn(msg);
        this.delyTime();
    }
    onChooseGrab(msg){
        this.model.updateId();
        this.view.showOtherQiangX(msg.seatId);
    }
    onEnterRoom(msg){
        if(!msg.gamestarted){
            this.model.gameStart_state = msg.gamestarted;
			this.view.removeZhuangjiaQX();
		}
    }
	//end
    //全局事件回调begin
    removeGrabAniSigh(){
        this.view.removeGrabAniSign();
        this.view.removeZhuangjiaQX();
    }
	//end
    //按钮或任何控件操作的回调begin
    //end
    onDestroy(){
        this.betsShowTime = null;
        super.onDestroy();
    }
}