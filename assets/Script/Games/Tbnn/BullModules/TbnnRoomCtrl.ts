/*
author: YOYO
日期:2018-02-01 15:12:03
tip: 牛牛房间控制体
*/
import BaseView from "../../../Plat/Libs/BaseView";
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import TbnnLogic from "../BullMgr/TbnnLogic";
import TbnnConst from "../BullMgr/TbnnConst";
import FrameMgr from "../../../Plat/GameMgrs/FrameMgr";
import UserMgr from "../../../Plat/GameMgrs/UserMgr";
import QuitMgr from "../../../Plat/GameMgrs/QuitMgr";
import BaseMgr from "../../../Plat/Libs/BaseMgr";
import GEventDef from "../../../Plat/GameMgrs/GEventDef";
import BullPosMgr from "../../../GameCommon/Bull/BullPosMgr";
import TbnnAudio from "../BullMgr/TbnnAudio";
import Audio from"../../../Plat/CfgMgrs/AudioCfg"
import LoginCtrl from "../../../Plat/Modules/Login/LoginCtrl";
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : TbnnRoomCtrl;
//模型，数据处理
class Model extends BaseModel{
    roomInfo:{
        bettype:null,
        gameid:null,
        gamestarted:null,
        id:null,
        matchid:null,
        owner:null,
        password:null,
        playercount:null,
        preparecount:null,
        roundcount:null,
        roundindex:null,
        seatcount:null
    } = null                            //请求到的房间信息
    roomid:number = null
    curRound:number = null              //当前局数

    time_startAni:number = null         //开始动画停留时间
    
	constructor()
	{
		super();
        this.time_startAni = 0.5;
    }
    
    getSeatCount(){
        return RoomMgr.getInstance().getSeatCount();
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    model:Model
    private dict_readyTag:{} = null             //保存所有的准备标志
    private intervalID:number = null            
	ui={
        //在这里声明ui
        node_btn_invite:null,
        node_chatPos:null,
        node_seatsConfig:null,
        node_seatParent:null,
        prefab_seat:null,
        node_giveCardPosConfig:null,
        node_btn_prepare:null,
        node_chipValuePos:null,
        node_resultTypePos:null,
        node_btn_sitDown:null,
        node_btn_backHall:null,
        node_btn_checkRecord:null,
        btn_startGame:null,
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
        this.ui.node_btn_invite = ctrl.node_btn_invite;
        this.ui.node_btn_backHall = ctrl.node_btn_backHall;
        this.ui.node_btn_checkRecord = ctrl.node_btn_checkRecord;
        this.ui.node_chatPos = ctrl.node_chatPos;
        this.ui.node_seatsConfig = ctrl.node_seatsConfig;
        this.ui.node_seatParent = ctrl.node_seatParent;
        this.ui.prefab_seat = ctrl.prefab_seat;
        this.ui.node_btn_prepare = ctrl.node_btn_prepare;     
        this.ui.node_giveCardPosConfig = ctrl.node_giveCardPosConfig;
        this.ui.node_chipValuePos = ctrl.node_chipValuePos;
        this.ui.node_resultTypePos = ctrl.node_resultTypePos;
        this.ui.node_btn_sitDown = ctrl.node_btn_sitDown;
        this.ui.btn_startGame = ctrl.btn_startGame;
        //初始化座位配置
        BullPosMgr.getInstance().setSeatConfigs(this.ui.node_seatsConfig);
        //发牌位置配置信息
        BullPosMgr.getInstance().setGiveCardPosCfg(this.ui.node_giveCardPosConfig);
        //筹码显示位置
        BullPosMgr.getInstance().setChipValuePosCfg(this.ui.node_chipValuePos);
        //结果金币显示
        BullPosMgr.getInstance().setResultTypePosCfg(this.ui.node_resultTypePos);
        //初始化聊天信息位置
        BullPosMgr.getInstance().setChatPosCfg(this.ui.node_chatPos);
        this.initSeats();
    }

    //根据自己的准备状态来控制准备按钮的显隐
    updateMyPrepared(){
        this.ui.node_btn_prepare.active = this.isShowPrepare();
    }
    //控制开始游戏按钮的显隐
    updateStartBtnShow (){
        this.ui.btn_startGame.active = RoomMgr.getInstance().isShowStartBtn();
        this.btnPos(this.ui.btn_startGame,this.ui.node_btn_invite,this.ui.node_btn_sitDown);
    }
    //设置坐下按钮的显隐
    updateSitdownShow (){
        this.ui.node_btn_sitDown.active = this.isShowSitdown();
        this.btnPos(this.ui.btn_startGame,this.ui.node_btn_invite,this.ui.node_btn_sitDown);
    }
    //邀请按钮
    updateInvitingShow(){
        this.ui.node_btn_invite.active = this.isShowInvite();
        this.btnPos(this.ui.btn_startGame,this.ui.node_btn_invite,this.ui.node_btn_sitDown);
    }
    //查看战绩和返回房间的按钮
    updateTotalSettleBtn (){
        this.ui.node_btn_backHall.active = true;
        this.ui.node_btn_checkRecord.active = true;
    }
    //初始化位置表现
    private initSeats(){
        let seatCount = this.model.getSeatCount();
        for(let i = 0; i < seatCount; i ++){
            let curNode = cc.instantiate(this.ui.prefab_seat);
            BullPosMgr.getInstance().setSeatSizeConfig(curNode);
            curNode.parent = this.ui.node_seatParent;
            curNode.position = BullPosMgr.getInstance().getSeatPos(i);
        }
    }
    //是否显示准备按钮
    private isShowPrepare(){
        let room = RoomMgr.getInstance();
        if(room.isFirstRound()) return false;
        if(room.isGameStarted()) return false;
        let myLogicSeatId = room.getMySeatId();
        if(room.preparemap[myLogicSeatId]) return false;    //如果已经准备了
        return true;
    }
    //判定是否显示邀请按钮
    private isShowInvite (){
        let room = RoomMgr.getInstance();
        if(room.isRoomFull()) return false;//房间未满
        if(room.isWather()) return false;//不是旁观者
        if(room.isGameStarted()) return false;//游戏未开始
        return true;
    }
    //判定是否显示坐下按钮
    private isShowSitdown (){
        let room = RoomMgr.getInstance();
        // if(room.isRoomFull()) return false;//房间未满
        if(!room.isFirstRound()) return false;//不是第一局
        if(room.isGameStarted()) return false;//游戏未开始
        let myLogicSeatId = room.getMySeatId();
        if(room.preparemap[myLogicSeatId]) return false;    //如果已经准备了
        return true;
    }
    private btnPos(btn1,btn2,btn3){
        let arr = [btn1,btn2,btn3]
        let index=0;
        let temp=0;
        for(let i=0; i<3; i++){
            this.saveFirstPos(arr[i]);
            if(arr[i].active){
                index++;
                temp=i;
            }
        }
        if(index==1){
            arr[temp].x= 0;
        }
    }
    private saveFirstPos (curNode:cc.Node){
        if(!curNode['_isFirstPos']) curNode['_isFirstPos'] = curNode.position;
        curNode.position = curNode['_isFirstPos'];
    }
}   
//c, 控制
@ccclass
export default class TbnnRoomCtrl extends BaseCtrl {
    view:View = null;
    model:Model = null;
    private cur_waitTime:number    
    private curWinId:number
    private isShowCheck:Boolean
    private timeId
    //这边去声明ui组件
    //nodes ----
    @property({
        type:cc.Node,
        displayName:"seatsConfig"
    })
    node_seatsConfig:cc.Node = null

    @property({
        type:cc.Node,
        displayName:"giveCardPosCfg"
    })
    node_giveCardPosConfig:cc.Node = null
    @property({
        type:cc.Node,
        displayName:"chipValuePos"
    })
    node_chipValuePos:cc.Node = null

    @property({
        type:cc.Node,
        displayName:"chatPos"
    })
    node_chatPos:cc.Node = null
    @property({
        type:cc.Node,
        displayName:"resultTypePos"
    })
    node_resultTypePos:cc.Node = null

    @property(cc.Node)
    node_seatParent:cc.Node = null
    @property(cc.Prefab)
    prefab_seat:cc.Prefab = null
    @property(cc.Node)
    node_btn_prepare:cc.Node = null//准备按钮
    @property(cc.Node)
    node_btn_sitDown:cc.Node = null//坐下按钮
    @property(cc.Node)
    btn_startGame:cc.Node = null//开始游戏按钮

    @property({
        type:cc.Node,
        displayName:"返回大厅"
    })
    node_btn_backHall:cc.Node = null

    @property({
        type:cc.Node,
        displayName:"查看战绩"
    })
    node_btn_checkRecord:cc.Node = null

    @property({
        type:cc.Node,
        displayName:"邀请好友"
    })
    node_btn_invite:cc.Node = null
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离

	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
        ctrl = this;
        //初始化逻辑
        RoomMgr.getInstance().setGameLibs(TbnnConst, null, TbnnLogic, TbnnAudio, null);
		//数据模型
        this.initMvc(Model,View);
        this.isShowCheck = false;
        //console.log(RoomMgr.getInstance().getFangKaCfg())
        //console.log(RoomMgr.getInstance().LogicCls)

	}

	//定义网络事件
	defineNetEvents()
	{
        this.n_events={
			//网络消息监听列表
            'onLeaveRoom':this.onLeaveRoom,                                     //某个玩家离开
            'room.roomHandler.exitRoom':this.room_roomHandler_exitRoom,
			'http.reqDisbandRoom':this.http_reqDisbandRoom,
            // 'http.reqRoomInfo':this.http_reqRoomInfo,
            'onEnterRoom':this.onOtherEnterRoom,//别人进来会推送
        }
        this.n_events['http.reqSettle'] = this.onReqSettle;
        this.n_events['onPrepare'] = this.onPrepare;
        this.n_events['connector.entryHandler.enterRoom'] = this.onMyEnterRoom;//自己进入的
        
        // this.n_events['room.roomHandler.nextRound'] = this.onNextRound;//再来一局的时候，自己接收到的消息
        // this.n_events['onReEnterRoom'] = this.onReEnterRoom;//在来一局的时候，其他人接收到的消息
        this.n_events['onChangeRoomMaster'] = this.onChangeRoomMaster;
        this.n_events[TbnnConst.clientEvent.onInitRoom_tbnn] = this.onInitRoom_tbnn;    
        this.n_events[TbnnConst.clientEvent.onMidEnter] = this.onMidEnter;
	}
	//定义全局事件
	defineGlobalEvents(){
        this.g_events['usersUpdated'] = this.usersUpdated
	}
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.image, this.ui.node_btn_sitDown, this.node_btn_sitDown_cb, '坐下');
        this.connect(G_UiType.image, this.ui.node_btn_prepare, this.node_btn_prepare_cb, '准备');
        this.connect(G_UiType.image, this.ui.node_btn_checkRecord, this.node_btn_checkRecord_cb, '查看战绩');
        this.connect(G_UiType.image, this.ui.node_btn_backHall, this.node_btn_backHall_cb, '返回大厅');
        this.connect(G_UiType.image, this.ui.btn_startGame, this.btn_startGame_cb, '房主开始游戏');
        this.connect(G_UiType.image, this.ui.node_btn_invite, this.btn_invite_cb, '点击邀请好友');
	}
	start () {
        //console.log('TbnnRoomCtrl通比牛牛房卡信息(赢家支付)', RoomMgr.getInstance().getFangKaCfg());
        if (this.isIPhoneX()) {
            this.resetDesignResolution(this.node.getComponent(cc.Canvas))
        }
    }

    //网络事件回调begin

    //自己进入的
    onMyEnterRoom(msg){
        //console.log('TbnnRoomCtrl自己进入了房间===================', msg)
        let room = RoomMgr.getInstance();
        this.view.updateInvitingShow();
        this.view.updateStartBtnShow();
        this.view.updateSitdownShow();
        this.view.updateMyPrepared();
        this.updateCheatcheck();
    }
    //别人进来
    onOtherEnterRoom(){
        if(!RoomMgr.getInstance().isFirstRound()||RoomMgr.getInstance().isGameStarted()){
            RoomMgr.getInstance().reqCheating();
        }
        this.view.updateInvitingShow();
        this.view.updateStartBtnShow();
    }
    //解散房间
    http_reqDisbandRoom(){
		TbnnLogic.getInstance().toPlaza();
    }
    //有人离开房间
    onLeaveRoom(){
        this.view.updateInvitingShow()
        this.view.updateStartBtnShow();
    }
    //房主发生了变化
    onChangeRoomMaster(msg){
        this.view.updateStartBtnShow();
    }
    // 
    room_roomHandler_exitRoom(  ){
        TbnnLogic.getInstance().toPlaza();
    }
    //有人准备
    onPrepare(msg){
        let mySeatId = RoomMgr.getInstance().getMySeatId();
        if(msg.seatid == mySeatId){
            this.view.updateMyPrepared();
        }
        this.view.updateStartBtnShow();
    }
    //玩家都准备完毕点击开始
    onInitRoom_tbnn(){
        if(RoomMgr.getInstance().isFirstRound()){
            //防作弊检测
            this.updateCheatcheck();
            this.view.updateSitdownShow();
        }
        this.view.updateInvitingShow();
        this.view.updateStartBtnShow();
    }
    //房间正式结算通知
    onReqSettle (msg){
        //console.log('onReqSettle', msg);
        if(RoomMgr.getInstance().isBunchFinish()){
            //游戏总结算
            //console.log('进入总结算')
            this.scheduleOnce(()=>{
                this.view.updateTotalSettleBtn();
            }, 2);
        }else{
            //每局结算
            this.view.updateMyPrepared();
            this.view.updateInvitingShow();     //人没满且游戏未开始就显示邀请好友
        }
    }
    //自己是属于中途进入的
    onMidEnter(){
        this.view.updateMyPrepared();
        this.view.updateSitdownShow();
        this.view.updateInvitingShow();
        this.updateCheatcheck();              //开启作弊检测
        TbnnLogic.getInstance().emit_roomIdColorChange();
    }
    
    //process-----------------
	//end
    //全局事件回调begin
    usersUpdated(){
        this.view.updateMyPrepared();
    }
    //打开防作弊模块
    updateCheatcheck() {
        if(!this.isShowCheck&&(RoomMgr.getInstance().isGameStarted() || !RoomMgr.getInstance().isFirstRound())){
            this.isShowCheck = true;
            TbnnLogic.getInstance().openCheatCheck();
        }
    }
	//end
    //按钮或任何控件操作的回调begin

    //房主开始游戏
    private btn_startGame_cb(){
        if(RoomMgr.getInstance().isRoomOwner(RoomMgr.getInstance().getMySeatId())){
            RoomMgr.getInstance().manualStart();
        }
        TbnnAudio.getInstance().playGameProcessAudio("audio_start",false);
    }
    //点击返回大厅
    private node_btn_backHall_cb(){
        TbnnLogic.getInstance().toPlaza();
    }
    //点击查看战绩
    private node_btn_checkRecord_cb(){
        TbnnLogic.getInstance().openTotalSettle();
    }
    //点击坐下
    private node_btn_sitDown_cb(btnNode:cc.Node){
        btnNode.active = false;
        RoomMgr.getInstance().prepare();
        TbnnAudio.getInstance().playGameProcessAudio("audio_ready",false);
    }
    //点击准备
    private node_btn_prepare_cb(btnNode:cc.Node){
        btnNode.active = false;
        if(RoomMgr.getInstance().isBunchFinish()){
            //总结算了
        }else{
            RoomMgr.getInstance().nextRound();
        }
        TbnnAudio.getInstance().playGameProcessAudio("audio_ready",false);
    }
    //点击邀请好友
    private btn_invite_cb () {
        TbnnLogic.getInstance().native_invite();
	}
    //end

    onDestroy(){   
        RoomMgr.getInstance().destroy();
        clearTimeout(this.timeId);
		super.onDestroy(); 
	}
}
