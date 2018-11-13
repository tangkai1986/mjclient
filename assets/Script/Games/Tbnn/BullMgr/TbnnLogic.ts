import BaseMgr from "../../../Plat/Libs/BaseMgr";
import TbnnPlayer from "./TbnnPlayer";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import TbnnConst from "./TbnnConst";
import GEventDef from "../../../Plat/GameMgrs/GEventDef";
import BunchInfoMgr from "../../../Plat/GameMgrs/BunchInfoMgr";
import BullPosMgr from "../../../GameCommon/Bull/BullPosMgr";
import BullCardsMgr from "../../../GameCommon/Bull/BullCardsMgr";
import GameAudioCfg from "../../../Plat/CfgMgrs/GameAudioCfg";
import TbnnAudio from "./TbnnAudio";
import LoginMgr from "../../../Plat/GameMgrs/LoginMgr";
import ServerMgr from "../../../AppStart/AppMgrs/ServerMgr";
import AppInfoMgr from "../../../AppStart/AppMgrs/AppInfoMgr";
const PAYTYPE = {
	0:"房主支付",
	1:'AA支付',
	2:'赢家支付'
} 
//牛牛管理器
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
export default class TbnnLogic extends BaseMgr {
    private seatcount:number
    private players:{}
    private cur_waitTime:number                          //当局某环节需要等待的时间
    //=================逻辑控制值
    private baseChipValue:number                        //基础筹码
    private fangkacfg:any                               //房卡配置
    private curWinId:number                              //当前这局的胜利座位id
    private seatNodeCfg                                  //座位上的相关配置
    private dict_playingSeats                            //在座位上且有在进行游戏
    private serverTimeOff:number
    private isWatcher:Boolean                            //自己是否是旁观者
    private midEnterInfo
    private androidLog
    constructor()   
    {
        super();
        this.initRoomCfg();
        this.routes={};
        this.routes['onPrepare'] = this.onPrepare;
        this.routes['http.reqSettle'] = this.http_reqSettle;
        this.routes['connector.entryHandler.enterRoom'] = this.onEnterRoom;
        this.routes[TbnnConst.clientEvent.onProcess] = this.onProcess;
        this.routes[TbnnConst.clientEvent.onInitRoom_tbnn] = this.onInitRoom_tbnn;
        this.routes[TbnnConst.clientEvent.onSettle] = this.onSettle_bull;
        this.routes[TbnnConst.clientEvent.onSyncData] = this.onSyncData;
        this.routes[TbnnConst.clientEvent.onMidEnter] = this.onMidEnter;
    }
    private initRoomCfg (){
        this.seatcount=RoomMgr.getInstance().getSeatCount();//座位个数  
        this.fangkacfg = RoomMgr.getInstance().getFangKaCfg();
        this.baseChipValue = this.fangkacfg.v_minChip;

        this.players={};  
        this.cur_waitTime = 0;
        this.curWinId = -1;
        this.serverTimeOff = 0;
        this.isWatcher = false;
        //创建四个角色
        for (var i = 0; i<this.seatcount; i++)
        {
            this.players[i]=new TbnnPlayer();
            this.players[i].init(i,this)
        }
        BullCardsMgr.initTeshuLimit();
    }

    clearData (){
        this.cur_waitTime = 0;
    }

    destroy (){
        super.destroy();
        delete TbnnLogic._instance;
        BullPosMgr.getInstance().clear();
    }

    isShowStartBtn (){
        let isShow = RoomMgr.getInstance().isShowStartBtn();

    }
    //native邀请好友
    native_invite (){
        if (cc.sys.isNative){
            let gameName = RoomMgr.getInstance().getGameName();
            let roominfo =RoomMgr.getInstance().roominfo;
            let roomvalue=RoomMgr.getInstance().getFangKaCfg();
			let appname=AppInfoMgr.getInstance().getAppName();
            G_PLATFORM.wxShareRoom(G_PLATFORM.WX_SHARE_TYPE.WXSceneSession, `${appname}好友房间邀请`, `${gameName} 房间号:${roominfo.password} 局数：${roomvalue.v_roundcount}局 人数：${roomvalue.v_seatcount}人 ${PAYTYPE[roomvalue.v_paytype]}`, roominfo.password);
        }
    }
    addAndroidLog (str){
        if(!this.androidLog){
            this.start_sub_module('SubLayer/Games/Tbnn/test_androidLog', (comp)=>{
                this.androidLog = comp;
                this.androidLog.addLog(str);  
            }, "test_androidLog");
        }else{
            this.androidLog.addLog(str);
        }
    }   

    //===============发送数据

    sendTanpai(){
        this.send_msg('room.roomHandler.playerOp', {oprType:TbnnConst.oprEvent.oprTanPai});
    }
    //发起测试的设置牌型
    sendTestCards (cardsList){
        this.send_msg('room.roomHandler.playerOp', {oprType:TbnnConst.oprEvent.oprTestCards,dictCards:cardsList});
    }
    //发起测试的开始游戏
    sendTestStart (){
        this.send_msg('room.roomHandler.playerOp', {oprType:TbnnConst.oprEvent.oprTestStart});
    }

    //------发送房间内的本地数据通知
    //通知模块，显示当前的牌型结果
    emit_showResultType(data){
        G_FRAME.globalEmitter.emit(GEventDef.bull_showResultType, data);
    }
    //通知模块，自己的牌，发牌结束
    emit_giveCardsEnd(){
        G_FRAME.globalEmitter.emit(GEventDef.bull_giveCardEnd);
    }
    //金币飞行指令 @tagStr: 标志文本，金币飞行结束后，会发送附带该文本的通知，可以判断是谁的金币飞行结束了
    emit_flyGold(startPos:cc.Vec2, targetPos:cc.Vec2,tagStr?:string,flyType?){
        G_FRAME.globalEmitter.emit(GEventDef.bull_flyGold, {
            startPos:startPos,
            targetPos:targetPos,
            flyType:flyType,//是飞行金币还是，下注筹码
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
    //房间号颜色初始化 
    emit_roomIdColorChange (){
        G_FRAME.globalEmitter.emit(GEventDef.bull_setAllTableLaebl);
    }
    //==============
    //接收到这个消息以后，才算是正式进入房间
    onEnterRoom(msg){
        this.midEnterInfo = null;
    }
    //接受到总结算
    http_reqSettle(msg){
        //console.log('接收到平台的结算信息= ', msg);
    }
    //初始房间的数据
    onInitRoom_tbnn(msg){
        //console.log('初始房间的数据onInitRoom_tbnn=, '+msg)
         this.openCardsTest();

        this.dict_playingSeats = {};
        let room = RoomMgr.getInstance();
        let users = room.users;
        for(let seatId in users){
            this.dict_playingSeats[seatId] = users[seatId];
        }
    }
    syncData()
    {
        // body
        this.send_msg('room.roomHandler.syncData',null)
    } 

    onSyncData(msg){
        //console.log('========onSyncData===========')
        //console.log(msg)
        this.cur_waitTime = msg.settleTime;
        this.baseChipValue = msg.curChipValue;
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
            case TbnnConst.process.start:
                //游戏重新开始
                this.cur_waitTime = 0;
                this.curWinId = -1;
                this.isWatcher = false;
                this.serverTimeOff = msg.servertime - Date.now();
                break
            case TbnnConst.process.giveCards:
                //开始发牌
                this.cur_waitTime = msg.waitTime;
                TbnnAudio.getInstance().playGameProcessAudio("audio_fapai",false);
            break
            case TbnnConst.process.settle:
                //游戏结算
                this.midEnterInfo = null;
                this.cur_waitTime = 0;
                this.isWatcher = false;
            break
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
        //显示结算
        this.curWinId = msg.winSeatId;
    }
    //自己是中途加入的
    onMidEnter(msg){
        //console.log('自己是属于中途入场的', msg)
        this.midEnterInfo = msg;
        this.cur_waitTime = msg.settleTime;
        this.serverTimeOff = msg.serverTime - Date.now();
        this.isWatcher = true;
    }

    //======================= 动态打开某个模块
    //打开金币闪动特效模块
    openGoldFalsh(cb){
        this.start_sub_module(G_MODULE.Bull_goldFalsh, cb);        
    }
    //打开结算界面模块
    openSettle (cb){
        this.start_sub_module(G_MODULE.Bull_settle, cb, "Prefab_bull_settleCtrl");
    }
    //打开算牌ui模块
    openCalculate(cb){
        this.start_sub_module(G_MODULE.Bull_calculate, cb, "Bull_calculateCtrl");
    }
    //返回大厅平台
    toPlaza(){
        LoginMgr.getInstance().disconnectGameSvr();
    }
    //打开闹钟预制体
    openClock(){
        this.start_sub_module(G_MODULE.BullClock);
        // this.start_sub_module('SubLayer/Plat/GameRoomCommon/Bull_clockCtrl');
    }
    //打开搓牌界面
    openCuopai (cb:Function){
        this.start_sub_module(G_MODULE.Bull_cuopai, cb);
    }
    //打开总结算界面
    openTotalSettle (){
        this.start_sub_module(G_MODULE.Bull_totalSettle);
    }
    //打开牌型测试界面
    openCardsTest (){
        //this.start_sub_module('GameCommon/Bull/Bull_cardsTest');
    }
    //打开防作弊检测的动画
    openCheatCheck (){
        this.start_sub_module(G_MODULE.RoomPreventionCheating);
    }
    //======================
    
    //获取是否是旁观者
    getIsWatcher (logicSeatId){
        if(this.midEnterInfo) return this.isHaveKey(this.midEnterInfo.idleSeatIdList, logicSeatId);
        return false
    }
    //获取有在进行游戏的座位列表
    getValidSeats (){
        return this.dict_playingSeats;
    }
    //获取最大局数
    getMaxRounds (){
        // return this.fangkacfg.v_maxRounds
        return this.fangkacfg.v_roundcount
    }
    //获取基础的底注信息
    getBaseChipValue (){
        return this.baseChipValue
    }
    //获取当前操作需要的等待时间
    getCurWaitTime(){
        return Math.floor((this.cur_waitTime-(Date.now()+this.serverTimeOff))/1000);
    }
    //获取玩家信息
    getPlayerInfo (seatId:number){
        return this.players[seatId];
    }
    //获取自己的客户端位置id
    getMyViewSeatId (){
        return RoomMgr.getInstance().getViewSeatId(this.getMyLogicSeatId());
    }
    //获取自己的服务端位置id
    getMyLogicSeatId (){
        return RoomMgr.getInstance().getMySeatId()
    }
    //获取自己当前的金钱(需要http reqsettle发起后才能正确获取)
    getMyScore (logicSeatId){
        let bunchInfo = BunchInfoMgr.getInstance().getBunchInfo();
        if(bunchInfo && bunchInfo.leiji[logicSeatId]) return bunchInfo.leiji[logicSeatId].zongshuying
        return 0;
    }
    //获取累计的信息
    getLeijiInfo (){
        let bunchInfo = BunchInfoMgr.getInstance().getBunchInfo();
        if(bunchInfo) return bunchInfo.leiji;
        return null;
    }
    //自己是否是赢家
    getIsMyWin (){
        return RoomMgr.getInstance().getMySeatId() == this.curWinId;
    }
    //是否禁止搓牌
    getIsCuopaiLimit (){
        return parseInt(this.fangkacfg.v_cuopaiLimit);
    }
    //自己是否是旁观者
    getIsMyWatcher (){
        return this.getIsWatcher(this.getMyLogicSeatId());
    }

    private isHaveKey (list, key){
        for(let i = 0; i < list.length; i ++){
            if(list[i] == key) return true
        }
        return false;
    }

    //单例处理
    private static _instance:TbnnLogic;
    public static getInstance ():TbnnLogic{
        if(!this._instance){
            this._instance = new TbnnLogic();
        }
        return this._instance;
    }
}
