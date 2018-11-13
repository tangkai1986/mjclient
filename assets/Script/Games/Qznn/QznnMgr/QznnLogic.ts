import BaseMgr from "../../../Plat/Libs/BaseMgr";
import QznnPlayer from "./QznnPlayer";
import QznnConst from "./QznnConst";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import GEventDef from "../../../Plat/GameMgrs/GEventDef";
import LoginMgr from "../../../Plat/GameMgrs/LoginMgr";

/** 
 * auto : yoyo
 * 通比牛牛的逻辑
*/

interface t_userInfo {
    bettype:number,
    bowner:any,
    gameid:number,
    gamestarted:any,
    id:number,
    inroom:any,
    password:number,
    prepared:any,
    rid:number,
    roundcount:number,
    seatcount:number,
    seatid:number,
    verified:any
}
export default class QznnLogic extends BaseMgr{
    private seatcount:number = null
    private players:{} = null
    private curDealerLogicSeatId:number = null                  //当局庄家的座位ID
    private cur_chipList:Array<number> = null                   //当局的筹码列表
    private cur_waitTime:number = null                          //当局某环节需要等待的时间
    private curWinId:number                                     //当前这局的胜利座位id
    private dict_curChipValue                                   //当局的下注信息
    constructor(){
        super();
        this.cur_waitTime = 0;
        this.curWinId = -1;
        this.players={};  
        this.seatcount=RoomMgr.getInstance().getSeatCount();//座位个数  
        //创建四个角色
        for (var i = 0; i<this.seatcount; i++)
        {
            this.players[i]=new QznnPlayer();
            this.players[i].init(i,this)
        }  

        this.routes={ 
            onSyncData:this.onSyncData,
        }
        this.routes[QznnConst.clientEvent.onInitRoom_qznn] = this.onInitRoom_qznn;
        this.routes[QznnConst.clientEvent.onConfirmDealer] = this.onConfirmDealer;
        this.routes[QznnConst.clientEvent.onProcess] = this.onProcess;
        this.routes[QznnConst.clientEvent.onSettle] = this.onSettle_bull;
        this.routes['onPrepare'] = this.onPrepare;
    }
    //清理数据
    clearData (){
        this.curDealerLogicSeatId = null;
        this.cur_waitTime = 0;
    }

    clear (){
        delete QznnLogic._instance;
        QznnLogic._instance=null;
    }

    //====================网络操作

    //请求抢庄
    reqGrab(isGrab:Boolean){
        let grabIndex = isGrab ? 1 : 0;
        this.send_msg('room.roomHandler.playerOp', {
            oprType:QznnConst.oprEvent.oprGrabDealer,
            isGrab:grabIndex
        });
    }
    //请求摊牌
    reqTanpai(){
        this.send_msg('room.roomHandler.playerOp', {oprType:QznnConst.oprEvent.oprTanPai});
    }
    //请求下注
    reqChooseChip(value){
        this.send_msg('room.roomHandler.playerOp', {
            oprType:QznnConst.oprEvent.oprChooseChip,
            chipValue:value
        });
    }

    //==========================模块之间的交互

    //通知模块，显示当前的牌型结果
    emit_showResultType(data){
        G_FRAME.globalEmitter.emit('modules_showResultType', data);
    }
    //金币飞行指令 @tagStr: 标志文本，金币飞行结束后，会发送附带该文本的通知，可以判断是谁的金币飞行结束了
    emit_flyGold(startPos:cc.Vec2, targetPos:cc.Vec2,tagStr?:string){
        G_FRAME.globalEmitter.emit(GEventDef.bull_flyGold, {
            startPos:startPos,
            targetPos:targetPos,
            tagStr:tagStr
        });
    }
    //金币飞行结束
    emit_flyGoldEnd(tagStr){
        G_FRAME.globalEmitter.emit(GEventDef.bull_flyGoldEnd, tagStr);
    }
    //发起搓牌
    emit_cuopai(msg){
        G_FRAME.globalEmitter.emit(GEventDef.bull_cuopai, msg);
    }
    //搓牌结束
    emit_cuopaiEnd(msg){
        G_FRAME.globalEmitter.emit(GEventDef.bull_cuopaiEnd, msg);
    }

    //======================= 动态打开某个模块

    //打开金币闪动特效模块
    openGoldFalsh(cb){
        this.start_sub_module(G_MODULE.Bull_goldFalsh, cb);        
    }
    //打开选择是否抢庄的模块
    openChooseGrab(){
        this.start_sub_module(G_MODULE.qznn_chooseGrab);
    }
    //打开结算界面模块
    openSettle (cb){
        this.start_sub_module(G_MODULE.Bull_settle, cb, "Prefab_bull_settleCtrl");
    }
    //打开算牌ui模块
    openCalculate(cb){
        this.start_sub_module(G_MODULE.Bull_calculate, cb, "Bull_calculateCtrl");
    }
    //打开是否抢庄的预制体
    addGrabFlag(cb){
        this.start_sub_module(G_MODULE.qznn_grabFlag, cb);
    }
    //打开庄字预制体
    addDealerWord(cb){
        this.start_sub_module(G_MODULE.qznn_dealerWord, cb);
    }
     //打开庄家选中预制体
     addDealerSelect(cb){
        this.start_sub_module(G_MODULE.qznn_dealerSelected, cb);
    }
    //返回大厅平台
    toPlaza(){
        LoginMgr.getInstance().disconnectGameSvr();
    }
    //打开玩家下注ui
    openChooseChipUI(){
        this.start_sub_module(G_MODULE.qznn_chooseChip);
        // this.start_sub_module("SubLayer/Games/Qznn/Prefab_bull_chooseChipCtrl");
    }
    //打开闹钟预制体
    openClock(){
        // this.start_sub_module(G_MODULE.qznn_chooseChip);
        this.start_sub_module('SubLayer/Plat/GameRoomCommon/Bull_clockCtrl');
    }
    //打开总结算界面
    openTotalSettle (){
        this.start_sub_module(G_MODULE.Bull_totalSettle);
    }
    //打开搓牌界面
    openCuopai (cb:Function){
        this.start_sub_module(G_MODULE.Bull_cuopai, cb);
    }
   
    //=========================
    //初始化房间信息
    onInitRoom_qznn(msg){
        this.cur_chipList = msg.chipValueList;
    }
    //网络事件监听
    onSyncData(msg){
        //console.log('===================')
        //console.log(msg)
    }
    //接收到确认庄家的消息
    onConfirmDealer(msg){
        this.curDealerLogicSeatId = msg.dealerSeatId;
    }
    //有玩家准备
    onPrepare(msg){
        if(msg.seatid == RoomMgr.getInstance().getMySeatId()){
            //自己准备，清理所有上一局的表现
            this.clearData();
        }
    }
    //进程管理
    onProcess(msg){
        switch(msg.process){
            case QznnConst.process.start:
                //游戏重新开始
                this.cur_waitTime = 0;
                this.curWinId -1;
            break
            case QznnConst.process.grabDealer:
                //开始抢庄
                this.cur_waitTime = msg.waitTime;
            break
            case QznnConst.process.chooseChip:
                //开始下注
                this.cur_waitTime = msg.waitTime;
            break
            case QznnConst.process.giveCards:
                //开始发牌
                this.cur_waitTime = msg.waitTime;
            break
            case QznnConst.process.settle:
                //游戏结算
                this.cur_waitTime = 0;
            break
        }
    }
    //有闲家下注
    // onPeopleChooseChip(msg){
    //     let logicSeatId = msg.chooseSeatId;
    //     // let value = msg.chipValue;
    // }
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
        //显示结算
        this.curWinId = msg.winSeatId;
    }

    //================

    //获取玩家信息
    getPlayerInfo (seatId:number){
        return this.players[seatId];
    }
    //自己是不是庄家
    getIsDealer (){
        return Boolean(this.curDealerLogicSeatId == RoomMgr.getInstance().getMySeatId());
    }
    //获取庄家的座位id
    getDealerViewSeatId (){
        return RoomMgr.getInstance().getViewSeatId(this.curDealerLogicSeatId);
    }
    //获取当前这局的下注筹码选项
    getChipValueList (){
        return this.cur_chipList;
    }
    //获取当前操作需要的等待时间
    getCurWaitTime(){
        return Math.ceil((this.cur_waitTime-Date.now())/1000);
    }
    //获取自己的服务端位置id
    getMyLogicSeatId (){
        return RoomMgr.getInstance().getMySeatId()
    }
    //获取当前的投注信息
    getCurChipInfo (){
        return this.dict_curChipValue
    }
    //自己是否是赢家
    getIsMyWin (){
        return RoomMgr.getInstance().getMySeatId() == this.curWinId;
    }

    //单例处理
    private static _instance:QznnLogic;
    public static getInstance ():QznnLogic{
        if(!this._instance){
            this._instance = new QznnLogic();
        }
        return this._instance;
    }
}