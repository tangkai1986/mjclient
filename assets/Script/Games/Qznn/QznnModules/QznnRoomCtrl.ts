/*
author: YOYO
日期:2018-02-01 15:12:03
tip: 牛牛房间控制体,初始化房间的布局
*/
import BaseView from "../../../Plat/Libs/BaseView";
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import FrameMgr from "../../../Plat/GameMgrs/FrameMgr";
import UserMgr from "../../../Plat/GameMgrs/UserMgr";
import QznnLogic from "../QznnMgr/QznnLogic";
import QznnConst from "../QznnMgr/QznnConst";
import BullPosMgr from "../../../GameCommon/Bull/BullPosMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : QznnRoomCtrl;
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
    mySeatId:number = null
    myPrepared:any = null
    myself:any = null

    time_startAni:number = null         //开始动画停留时间
	constructor()
	{
		super();
        this.time_startAni = 0.5;
    }

    getSeatCount (){
        return RoomMgr.getInstance().getSeatCount();
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    // model:Model = null
    private dict_readyTag:{} = null             //保存所有的准备标志
    private intervalID:number = null            
	ui={
        //在这里声明ui
        node_seatsConfig:null,
        node_seatParent:null,
        prefab_seat:null,
        node_giveCardPosConfig:null,
        node_btn_prepare:null,
        node_btn_close:null,
        node_chipValuePos:null,
        node_resultTypePos:null,
        node_btn_sitDown:null,
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
        this.ui.node_seatsConfig = ctrl.node_seatsConfig;
        this.ui.node_seatParent = ctrl.node_seatParent;
        this.ui.prefab_seat = ctrl.prefab_seat;
        this.ui.node_btn_prepare = ctrl.node_btn_prepare;     
        this.ui.node_giveCardPosConfig = ctrl.node_giveCardPosConfig;
        this.ui.node_btn_close = ctrl.node_btn_close;
        this.ui.node_chipValuePos = ctrl.node_chipValuePos;
        this.ui.node_resultTypePos = ctrl.node_resultTypePos;
        this.ui.node_btn_sitDown = ctrl.node_btn_sitDown;
        //初始化座位配置
        BullPosMgr.getInstance().setSeatConfigs(this.ui.node_seatsConfig);
        //发牌位置配置信息
        BullPosMgr.getInstance().setGiveCardPosCfg(this.ui.node_giveCardPosConfig);
        //筹码显示位置
        BullPosMgr.getInstance().setChipValuePosCfg(this.ui.node_chipValuePos);
        //结果金币显示
        BullPosMgr.getInstance().setResultTypePosCfg(this.ui.node_resultTypePos);
        this.initSeats();
    }

    //根据自己的准备状态来控制准备按钮的显隐
    updateMyPrepared(){
        this.ui.node_btn_prepare.active = !(RoomMgr.getInstance().preparemap[RoomMgr.getInstance().getMySeatId()]);
    }
    setMyPreparedShow(isShow:Boolean){
        this.ui.node_btn_prepare.active = isShow;
    }

    //初始化位置表现
    private initSeats(){
        let seatCount = this.model.getSeatCount();
        for(let i = 0; i < seatCount; i ++){
            let curNode = cc.instantiate(this.ui.prefab_seat);
            curNode.parent = this.ui.node_seatParent;
            curNode.position = BullPosMgr.getInstance().getSeatPos(i);
        }
    }
}
//c, 控制
@ccclass
export default class QznnRoomCtrl extends BaseCtrl {
    view:View = null;
    model:Model = null;
    clockCtrl:any = null
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
        displayName:"resultTypePos"
    })
    node_resultTypePos:cc.Node = null
    @property(cc.Node)
    node_seatParent:cc.Node = null
    @property(cc.Prefab)
    prefab_seat:cc.Prefab = null
    @property(cc.Node)
    node_btn_prepare:cc.Node = null
    @property(cc.Node)
    node_btn_sitDown:cc.Node = null
    @property({
        type:cc.Node,
        displayName:"closeBtn"
    })
    node_btn_close:cc.Node = null
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
        //初始化逻辑
        RoomMgr.getInstance().setGameLibs(QznnConst, null, QznnLogic, null);
		//数据模型
        this.initMvc(Model,View);
	}

	//定义网络事件
	defineNetEvents()
	{
        this.n_events={
			//网络消息监听列表
            'room.roomHandler.exitRoom':this.room_roomHandler_exitRoom,
			'http.reqDisbandRoom':this.http_reqDisbandRoom, 
            'http.reqRoomInfo':this.http_reqRoomInfo, 
        } 
        this.n_events['onPrepare'] = this.onPrepare;
	}
	//定义全局事件
	defineGlobalEvents()
	{
	}
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.image, this.ui.node_btn_prepare, this.node_btn_prepare_cb, '点击准备');
        this.connect(G_UiType.image, this.ui.node_btn_close, this.node_btn_close_cb, '点击关闭');
        this.connect(G_UiType.image, this.ui.node_btn_sitDown, this.node_btn_sitDown_cb, '点击关闭');
	}
	start () {
        cc.director.setDisplayStats(false);
    }
    //网络事件回调begin
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
		QznnLogic.getInstance().toPlaza();
    }
    room_roomHandler_exitRoom(  ){
		// body
		//返回游戏选择界面,理论上还要释放资源
		QznnLogic.getInstance().toPlaza();
    }
    //有人准备
    onPrepare(msg){
        if(msg.seatid == RoomMgr.getInstance().getMySeatId()){
            this.view.setMyPreparedShow(false);
        }
    }
    //房间正式结算通知
    onReqSettle (msg){
        //console.log('onReqSettle', msg);
        if(RoomMgr.getInstance().isBunchFinish()){
            //游戏总结算
            //console.log('进入总结算')
            QznnLogic.getInstance().openTotalSettle();
        }else{
            //每局结算
            QznnLogic.getInstance().openSettle((curCtrl)=>{
                if(QznnLogic.getInstance().getIsMyWin()){
                    //自己赢钱
                    curCtrl.showWin();
                }else{
                    //自己输钱
                    curCtrl.showFail();
                }
            })
            this.view.setMyPreparedShow(true);
        }
    }
	//end
    //全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin

    //点击坐下
    private node_btn_sitDown_cb(btnNode:cc.Node){
        btnNode.active = false;
        if(RoomMgr.getInstance().isBunchFinish()){
            //总结算了
        }else{
            RoomMgr.getInstance().prepare();
        }
    }
    //点击准备
    private node_btn_prepare_cb(btnNode:cc.Node){
        btnNode.active = false;
        if(RoomMgr.getInstance().isBunchFinish()){
            //总结算了
        }else{
            RoomMgr.getInstance().prepare();
            //console.log('结算走准备=====')
        }
    } 
    //end
}