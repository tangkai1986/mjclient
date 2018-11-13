/*
author: YOYO
日期:2018-02-01 15:12:03
tip: 牛牛房间控制体
*/
import BaseView from "../../../Plat/Libs/BaseView";
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import MpnnLogic from "../BullMgr/MpnnLogic";
import MpnnConst from "../BullMgr/MpnnConst";
import FrameMgr from "../../../Plat/GameMgrs/FrameMgr";
import UserMgr from "../../../Plat/GameMgrs/UserMgr";
import QuitMgr from "../../../Plat/GameMgrs/QuitMgr";
import BaseMgr from "../../../Plat/Libs/BaseMgr";
import GEventDef from "../../../Plat/GameMgrs/GEventDef";
import MpnnAudioMgr from"../../../Games/Mpnn/BullMgr/MpnnAudioMgr"
import BullPosMgr from "../../../GameCommon/Bull/BullPosMgr";
import MpnnAudio from "../BullMgr/MpnnAudio";
import Audio from"../../../Plat/CfgMgrs/AudioCfg"
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : MpnnRoomCtrl;
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
        if(!RoomMgr.getInstance().isFirstRound()){
            this.ui.node_btn_prepare.active = !(RoomMgr.getInstance().preparemap[RoomMgr.getInstance().getMySeatId()]);
        }
    }
    setMyPreparedShow(isShow:Boolean){
        this.ui.node_btn_prepare.active = isShow;
    }
    //控制开始游戏按钮的显隐
    setStartBtnShow (isShow:Boolean){
        this.ui.btn_startGame.active = isShow;
    }
    //设置坐下按钮的显隐
    setSitdownShow (isShow:Boolean){
        this.ui.node_btn_sitDown.active = isShow;
    }
    setInvitingShow(isShow:Boolean){
        this.ui.node_btn_invite.active = isShow;
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

}
//c, 控制
@ccclass
export default class MpnnRoomCtrl extends BaseCtrl {
    view:View = null;
    model:Model = null;
    private cur_waitTime:number    
    private curWinId:number   
    
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
        displayName:"邀请好友"
    })
    node_btn_invite:cc.Node = null

    //test
    isFirst:Boolean
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离

	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
        ctrl = this;
        //初始化逻辑
        RoomMgr.getInstance().setGameLibs(MpnnConst, null, MpnnLogic, MpnnAudio, null);
		//数据模型
        this.initMvc(Model,View);
        
        //console.log(RoomMgr.getInstance().getFangKaCfg())
        //console.log(RoomMgr.getInstance().LogicCls)
	}

	//定义网络事件
	defineNetEvents()
	{
        this.n_events={
			//网络消息监听列表
            'onLeaveRoom':this.onLeaveRoom,     //某个玩家离开
            'room.roomHandler.exitRoom':this.room_roomHandler_exitRoom,
			'http.reqDisbandRoom':this.http_reqDisbandRoom,
            'http.reqRoomInfo':this.http_reqRoomInfo,
            'onEnterRoom':this.EnterRoom,
        }
        this.n_events['http.reqSettle'] = this.onReqSettle;
        this.n_events['onPrepare'] = this.onPrepare;
        this.n_events['connector.entryHandler.enterRoom'] = this.onEnterRoom;
        this.n_events[MpnnConst.clientEvent.onSyncData] = this.onSyncData;
        this.n_events['room.roomHandler.nextRound'] = this.onNextRound;
        this.n_events['onReEnterRoom'] = this.onReEnterRoom;
        this.n_events[MpnnConst.clientEvent.onInitRoom_Mpnn] = this.onInitRoom_Mpnn;    
        this.n_events[MpnnConst.clientEvent.onMidEnter] = this.onMidEnter; 
	}
	//定义全局事件
	defineGlobalEvents(){
        this.g_events['usersUpdated'] = this.usersUpdated
	}
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.image, this.ui.node_btn_sitDown, this.node_btn_sitDown_cb, '点击坐下');
        this.connect(G_UiType.image, this.ui.node_btn_prepare, this.node_btn_prepare_cb, '点击准备');
        this.connect(G_UiType.image, this.ui.btn_startGame, this.btn_startGame_cb, '点击房主开始游戏');
        this.connect(G_UiType.image, this.ui.node_btn_invite, this.btn_invite_cb, '点击邀请好友');
	}
	start () {
        if (this.isIPhoneX()) {
            this.resetDesignResolution(this.node.getComponent(cc.Canvas))
        }
        //console.log('MpnnRoomCtrl通比牛牛房卡信息(赢家支付)', RoomMgr.getInstance().getFangKaCfg());
    }

    //网络事件回调begin

    //接收到这个消息以后，才算是正式进入房间
    onEnterRoom(msg){
        if(!RoomMgr.getInstance().isRoomFull()){
            this.view.setInvitingShow(!MpnnLogic.getInstance().getIsMyWatcher() && RoomMgr.getInstance().isFirstRound())
        }
        //console.log("msgmsgmsg",msg);
        if(!msg.isGameStarted){
            this.view.setInvitingShow(true);
        }
        //console.log("game onEnterRoom:", msg);
        this.view.setStartBtnShow(RoomMgr.getInstance().isShowStartBtn());
        this.view.setSitdownShow(!msg.bwatch && !msg.gamestarted && RoomMgr.getInstance().getRoundIndex() == 0 && !RoomMgr.getInstance().isPlayerPrepare());
       //进入房间且不是第一局就直接开启自动检测
       if(!RoomMgr.getInstance().isFirstRound() && msg.bwatch){
            //this.process_cheatcheck();
       }
    }
    //有人进入房间
    EnterRoom(){
        //人员是否满了
        if(!RoomMgr.getInstance().isRoomFull()){
            this.view.setInvitingShow(!MpnnLogic.getInstance().getIsMyWatcher() && RoomMgr.getInstance().isFirstRound())
        }else{
            this.view.setInvitingShow(false);
        }
        //判断所有人是否都准备
        this.view.setStartBtnShow(RoomMgr.getInstance().isShowStartBtn());

        //房间内是否在游戏中
        if(RoomMgr.getInstance().isGameStarted()){
            RoomMgr.getInstance().reqCheating();
            this.view.setInvitingShow(false);   
        }
        //判断是不是在第一局
        if(!RoomMgr.getInstance().isFirstRound()){
            //发送数据给服务器更新作弊图标状态
            RoomMgr.getInstance().reqCheating();   
        }
    }
    http_reqRoomInfo() 
	{
        //console.log("RoomMgr.getInstance().roomtype=",RoomMgr.getInstance().roomtype)
        // this.model.roomInfo = RoomMgr.getInstance().roominfo;
		// if(RoomMgr.getInstance().roomtype==1){
        //     //房卡
		// }else if(RoomMgr.getInstance().roomtype==0){
        //     //金币场
        // }
    }  
    http_reqDisbandRoom(){
		//解散房间
		//周边平台与子游戏间，子游戏与平台间的切换要统一管理
		MpnnLogic.getInstance().toPlaza();
    }
    room_roomHandler_exitRoom(  ){
		// body
		//返回游戏选择界面,理论上还要释放资源
        MpnnLogic.getInstance().toPlaza();
    }
    //有人准备
    onPrepare(msg){
        let mySeatId = RoomMgr.getInstance().getMySeatId();
        if(msg.seatid == mySeatId){
            this.view.setMyPreparedShow(false);
        }
        //房间管理器符合开房标准
        // if(RoomMgr.getInstance().isAllPlayerPrepare()){
        //     if(!this.isShowCheat){
        //         RoomMgr.getInstance().reqCheating();   
        //     }else{
        //         //this.process_cheatcheck();              //开启作弊检测
        //     }
        //     this.isShowCheat = false;
        // }
        this.view.setStartBtnShow(RoomMgr.getInstance().isShowStartBtn());
    }
    //重新开始房间
    onReEnterRoom(msg){
        this.view.setStartBtnShow(RoomMgr.getInstance().isShowStartBtn());
    }
    //玩家都准备完毕
    onInitRoom_Mpnn(){
        if(RoomMgr.getInstance().isFirstRound()){
            this.process_cheatcheck();
        }
        this.view.setInvitingShow(false);
        this.view.setStartBtnShow(false);
    }
    //房间正式结算通知
    onReqSettle (msg){
        //console.log('onReqSettle', msg);
        if(RoomMgr.getInstance().isBunchFinish()){
            //游戏总结算
            //console.log('进入总结算')
            setTimeout(()=>{
                //this.updateBtnActive();
                MpnnLogic.getInstance().openTotalSettle();
            }, 2000)
        }else{
            //每局结算
            // MpnnLogic.getInstance().openSettle((curCtrl)=>{
            //     if(MpnnLogic.getInstance().getIsMyWin()){
            //         //自己赢钱
            //         curCtrl.showWin();
            //     }else{
            //         //自己输钱
            //         curCtrl.showFail();
            //     }
            // })
            this.view.setMyPreparedShow(true);
            this.view.setInvitingShow(true);
        }
    }
    //有玩家离开房间
    onLeaveRoom(){
        this.view.setStartBtnShow(RoomMgr.getInstance().isShowStartBtn());
    }
    //进入下一局
    onNextRound(msg){
        // RoomMgr.getInstance().prepare();
        this.view.setStartBtnShow(RoomMgr.getInstance().isShowStartBtn());
    }
    //自己是属于中途进入的
    onMidEnter(msg){
        //console.log("msg.enterSeatId",msg);
        //遍历中途加入玩家列表是否有自己的ID
        for(let i =0;i<msg.idleSeatIdList.length;i++){
            if (msg.idleSeatIdList[i] == RoomMgr.getInstance().getMySeatId()){
                this.view.setMyPreparedShow(false);
                this.view.setSitdownShow(false);
                this.view.setInvitingShow(false);
                this.process_cheatcheck();              //开启作弊检测
                G_FRAME.globalEmitter.emit('setAllTableLaebl');
            }
        }
    }

    onSyncData(msg){
        if(msg.processType == MpnnConst.process.giveCards){
            this.view.setInvitingShow(false);
        }else if(msg.processType == MpnnConst.process.chooseChip){
            this.view.setInvitingShow(false);
        }else if(msg.processType == MpnnConst.process.calculate){
            this.view.setInvitingShow(false);
        }else if(msg.processType == MpnnConst.process.settle){
            this.view.setInvitingShow(true);
        }
        // //console.log("msgmsgmsg",msg);
        // if(!msg.isGameStarted){
        //     this.view.setInvitingShow(true);
        // }
    }
    
    //process-----------------
	//end
    //全局事件回调begin
    
    usersUpdated(){
        this.view.updateMyPrepared();
    }
    //打开防作弊模块
    process_cheatcheck() {
        this.start_sub_module(G_MODULE.RoomPreventionCheating);
    }
	//end
    //按钮或任何控件操作的回调begin

    //房主开始游戏
    private btn_startGame_cb(){
        if(RoomMgr.getInstance().isRoomOwner(RoomMgr.getInstance().getMySeatId())){
            RoomMgr.getInstance().manualStart();
        }
    }
    //点击坐下
    private node_btn_sitDown_cb(btnNode:cc.Node){
        btnNode.active = false;
        RoomMgr.getInstance().prepare();
       // MpnnAudioMgr.getInstance().playReadyAudio();
    }
    //点击准备
    private node_btn_prepare_cb(btnNode:cc.Node){
        btnNode.active = false;
        if(RoomMgr.getInstance().isBunchFinish()){
            //总结算了
        }else{
            RoomMgr.getInstance().nextRound();
        }
        this.gemit("removeGrabAniSigh");
    }
    //点击邀请好友
    btn_invite_cb () {
        MpnnLogic.getInstance().native_invite();
	} 
    
    //end

    onDestroy(){   
		RoomMgr.getInstance().destroy();
		super.onDestroy(); 
	}
}
