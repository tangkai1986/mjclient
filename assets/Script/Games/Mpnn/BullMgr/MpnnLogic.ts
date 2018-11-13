import BaseMgr from "../../../Plat/Libs/BaseMgr";
import MpnnPlayer from "./MpnnPlayer";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import MpnnConst from "./MpnnConst";
import GEventDef from "../../../Plat/GameMgrs/GEventDef";
import BunchInfoMgr from "../../../Plat/GameMgrs/BunchInfoMgr";
import MpnnAudioMgr from"../../../Games/Mpnn/BullMgr/MpnnAudioMgr"
import BullPosMgr from "../../../GameCommon/Bull/BullPosMgr";
import BullCardsMgr from "../../../GameCommon/Bull/BullCardsMgr";
import GameAudioCfg from "../../../Plat/CfgMgrs/GameAudioCfg";
import LoginMgr from "../../../Plat/GameMgrs/LoginMgr";
import ServerMgr from "../../../AppStart/AppMgrs/ServerMgr";
import AppInfoMgr from "../../../AppStart/AppMgrs/AppInfoMgr";
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
const chipIndex = {
    0:[1,2],
    1:[2,4],
    2:[4,8],
    3:[5,10],
}
const payType = {
    0:"房主支付",
    1:"AA支付",
    2:"赢家支付",
}
export default class MpnnLogic extends BaseMgr {
    private seatcount:number
    private players:{}
    private cur_waitTime:number                          //当局某环节需要等待的时间
    private grablist:any
    private grabmax:number
    private chiplist:any
    private buychiplist:any
    private delaerSeatId:number
    private isGrabing:number
    private isExtraGrabing:boolean
    private extraChip:number
    private enterSeatIds:any
    //=================逻辑控制值
    private baseChipValue:number
    private fangkacfg:any
    private curWinId:number                              //当前这局的胜利座位id
    private seatNodeCfg                                  //座位上的相关配置
    private dict_playingSeats                            //在座位上且有在进行游戏
    private serverTimeOff:number
    private isWatcher:Boolean                            //自己是否是旁观者
    constructor()   
    {
        super();
        this.initRoomCfg();
        this.routes={};
        this.routes['onPrepare'] = this.onPrepare;
        this.routes['http.reqSettle'] = this.http_reqSettle;
        this.routes['connector.entryHandler.enterRoom'] = this.onEnterRoom;
        this.routes[MpnnConst.clientEvent.onProcess] = this.onProcess;
        this.routes[MpnnConst.clientEvent.onInitRoom_Mpnn] = this.onInitRoom_Mpnn;
        this.routes[MpnnConst.clientEvent.onSettle] = this.onSettle_bull;
        this.routes[MpnnConst.clientEvent.onSyncData] = this.onSyncData;
        this.routes[MpnnConst.clientEvent.onMidEnter] = this.onMidEnter;

        this.routes[MpnnConst.clientEvent.onChooseGrab] = this.onChooseGrab;
        this.routes[MpnnConst.clientEvent.onConfirmGrab] = this.onConfirmGrab;
        this.routes[MpnnConst.clientEvent.onChooseChip] = this.onChooseChip;
        this.routes[MpnnConst.clientEvent.onChipInfo] = this.onChipInfo;
    }
    private initRoomCfg (){
        this.seatcount=RoomMgr.getInstance().getSeatCount();//座位个数  
        this.fangkacfg = RoomMgr.getInstance().getFangKaCfg();
        this.baseChipValue = this.fangkacfg.v_minChip;
        let minchip = this.fangkacfg.v_minChip;
        this.players={};  
        this.grablist={};
        this.chiplist={};
        this.buychiplist = {};
        this.enterSeatIds = new Array;
        this.grabmax = 0;
        this.cur_waitTime = 0;          //进程时间回传
        this.curWinId = -1;
        this.serverTimeOff = 0;
        this.isWatcher = false;
        this.delaerSeatId = 0;
        this.isGrabing = 0;
        this.isExtraGrabing = false;
        this.extraChip = 0;
        //创建四个角色
        for (let i = 0; i<this.seatcount; i++)
        {
            this.players[i]=new MpnnPlayer();
            this.players[i].init(i,this)
            this.grablist[i] = 0;
            this.chiplist[i] = chipIndex[minchip][0];
            this.buychiplist[i] = 0
        }

        BullCardsMgr.initTeshuLimit();
    }

    clearData (){
        this.cur_waitTime = 0;
    }

    destroy (){
        super.destroy();
        delete MpnnLogic._instance;
        BullPosMgr.getInstance().clear();
    }

    isShowStartBtn (){
        let isShow = RoomMgr.getInstance().isShowStartBtn();
    }

    //native邀请好友
    native_invite (){
        if (cc.sys.isNative){
            let roominfo =RoomMgr.getInstance().roominfo;
            let roomvalue=RoomMgr.getInstance().getFangKaCfg(); 
			let appname=AppInfoMgr.getInstance().getAppName();
            G_PLATFORM.wxShareRoom(G_PLATFORM.WX_SHARE_TYPE.WXSceneSession, `${appname}好友房间邀请`, `${RoomMgr.getInstance().getGameName()} 房间号:${roominfo.password} 局数：${roomvalue.v_roundcount}局 人数：${roomvalue.v_seatcount}人 ${payType[roomvalue.v_paytype]}`, roominfo.password);
        }
    }

    //===============发送数据

    sendTanpai(){
        this.send_msg('room.roomHandler.playerOp', {oprType:MpnnConst.oprEvent.oprTanPai});
    }
    //发起测试的设置牌型
    sendTestCards (cardsList){
        this.send_msg('room.roomHandler.playerOp', {oprType:MpnnConst.oprEvent.oprTestCards,dictCards:cardsList});
    }
    //发起测试的开始游戏
    sendTestStart (){
        this.send_msg('room.roomHandler.playerOp', {oprType:MpnnConst.oprEvent.oprTestStart});
    }
    //发送抢庄
    sendChooseGrab(multiple){
        //console.log('发送抢庄sendChooseGrab=, '+multiple)
        let myseatid = RoomMgr.getInstance().getMySeatId();
        this.grablist[myseatid] = multiple;
        this.send_msg('room.roomHandler.playerOp', {oprType:MpnnConst.oprEvent.oprChooseGrab, grabRate:multiple});
    }
    //发送下注
    sendChooseChip(chipCount){
        //console.log('发送下注sendChooseChip=, '+chipCount)
        let myseatid = RoomMgr.getInstance().getMySeatId()
        this.chiplist[myseatid] = chipCount;
        this.send_msg('room.roomHandler.playerOp', {oprType:MpnnConst.oprEvent.oprChooseChip, chipValue:chipCount});
    }

    //发送买码
    sendBuyChip(chipCount){
        //console.log('发送下注sendChooseChip=, '+chipCount)
        //buychiplist
        //let myseatid = RoomMgr.getInstance().getMySeatId()
        //this.chiplist[myseatid] = chipCount;
        this.send_msg('room.roomHandler.playerOp', {oprType:MpnnConst.oprEvent.oprBuyChip, chipValue:chipCount});
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
    //==============
    //接收到这个消息以后，才算是正式进入房间
    onEnterRoom(msg){
        //MpnnAudioMgr.getInstance().playBGM();
    }
    //接受到总结算
    http_reqSettle(msg){
        //console.log('接收到平台的结算信息= ', msg);
    }
    //初始房间的数据
    onInitRoom_Mpnn(msg){
        //console.log('初始房间的数据onInitRoom_Mpnn=, '+msg)
        // this.openCardsTest();

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
        this.dict_playingSeats = {};
        let room = RoomMgr.getInstance();
        let users = room.users;
        for(let seatId in users){
            this.dict_playingSeats[seatId] = users[seatId];
        }
        this.serverTimeOff = msg.serverTime - Date.now();
        this.cur_waitTime = msg.waitTime;
        this.baseChipValue = msg.curChipValue;
        if (msg.dictChooseGrab != null){
            for (let key in msg.dictChooseGrab){
                this.grablist[key] = msg.dictChooseGrab[key];
            }
        }
        if (msg.dictChooseChip != null){
            for (let key in msg.dictChooseChip){
                this.chiplist[key] = msg.dictChooseChip[key];
            }
        }
        this.delaerSeatId = Number(msg.dealerSeatId);
        if (msg.idleSeatIdList != null && msg.idleSeatIdList.length != null){
            for (let key in msg.idleSeatIdList){
                let bAdd = true;
                let teatid = msg.idleSeatIdList[key];
                for (let odd in this.enterSeatIds){
                    let seatid = this.enterSeatIds[key];
                    if (teatid == seatid){
                        bAdd =false;
                        break;
                    }
                }
                if (bAdd){
                    this.enterSeatIds.push(teatid);
                }
            }
        }
    }
    //有玩家准备
    onPrepare(msg){
        if(msg.seatid == RoomMgr.getInstance().getMySeatId()){
            //自己准备，清理所有上一局的表现
            this.clearData();
            GameAudioCfg.getInstance().playGameProcessAudio("audio_start",false); 
        }
    }
    //进程管理
    onProcess(msg){
        var myDate=new Date();
        switch(msg.process){
            case MpnnConst.process.start:
                //游戏重新开始
                this.cur_waitTime = 0;
                this.curWinId = -1;
                this.isWatcher = false;
                this.serverTimeOff = msg.serverTime - Date.now();
                break
            case MpnnConst.process.giveCards:
                //开始发牌
                this.cur_waitTime = msg.waitTime;
                GameAudioCfg.getInstance().playGameProcessAudio('audio_fapai',false);
                break
            case MpnnConst.process.chooseChip:
                this.cur_waitTime = msg.waitTime;
                break
            case MpnnConst.process.calculate:
                this.cur_waitTime = msg.waitTime;
                break
            case MpnnConst.process.settle:
                //游戏结算
                this.cur_waitTime = 0;
                this.extraChip = 0;
                if (this.enterSeatIds.length != null){
                    delete this.enterSeatIds//
                    this.enterSeatIds = new Array;
                }
                this.fangkacfg = RoomMgr.getInstance().getFangKaCfg();
                let minchip = this.fangkacfg.v_minChip;
                for (let i = 0; i<this.seatcount; i++)
                {
                    this.grablist[i] = 0;
                    this.chiplist[i] = chipIndex[minchip][0];
                    this.buychiplist[i] = 0
                }
                this.isWatcher = false;
                break
            //配合服务端设置（配合测试数据，遗留不删）
            /*case MpnnConst.process.start:
                //console.log("---------mpnn_test start---------", myDate.getMinutes(), myDate.getSeconds());
                break;
            case MpnnConst.process.giveCards:
                //console.log("---------mpnn_test giveCards---------", myDate.getMinutes(), myDate.getSeconds());
                this.sendChooseGrab(this.fangkacfg.v_grabbanker);
                break;
            case MpnnConst.process.chooseChip:
                //console.log("---------mpnn_test chooseChip---------", myDate.getMinutes(), myDate.getSeconds());
                let myseatid = RoomMgr.getInstance().getMySeatId();
                if (this.delaerSeatId != myseatid){
                    let minchip = this.fangkacfg.v_minChip;
                    this.sendChooseChip(chipIndex[minchip][1]*2);
                }
                break;
            case MpnnConst.process.calculate:
                //console.log("---------mpnn_test calculate---------", myDate.getMinutes(), myDate.getSeconds());
                break;
            case MpnnConst.process.settle:
                //console.log("---------mpnn_test settle---------", myDate.getMinutes(), myDate.getSeconds());
                break;*/
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
        this.isExtraGrabing = false;
        this.curWinId = msg.winSeatId;
    }
    //自己是中途加入的
    onMidEnter(msg){
        //console.log('中途入场的', msg)
        if (msg.enterSeatId == RoomMgr.getInstance().getMySeatId()){
            this.cur_waitTime = msg.waitTime;
            this.serverTimeOff = msg.serverTime - Date.now();
            this.isWatcher = true;
            this.dict_playingSeats = {};
            let room = RoomMgr.getInstance();
            let users = room.users;
            for(let seatId in users){
                this.dict_playingSeats[seatId] = users[seatId];
            }
        }
        if (msg.idleSeatIdList != null && msg.idleSeatIdList.length != null){
            for (let key in msg.idleSeatIdList){
                let bAdd = true;
                let teatid = msg.idleSeatIdList[key];
                for (let odd in this.enterSeatIds){
                    let seatid = this.enterSeatIds[key];
                    if (teatid == seatid){
                        bAdd =false;
                        break;
                    }
                }
                if (bAdd){
                    this.enterSeatIds.push(teatid);
                }
            }
        }
        //console.log("this.model.watcherSeatId.length",this.enterSeatIds);
    }
    //获取当前其他玩家的抢庄倍数
    onChooseGrab(msg){
        //console.log('抢庄倍数', msg)
        this.grablist[msg.seatId] = msg.grabRate;
        this.grabmax = msg.grabRate>this.grabmax?msg.grabRate:this.grabmax;
    }
    //确认庄家
    onConfirmGrab(msg){
        //console.log('定庄玩家', msg)
        this.delaerSeatId = Number(msg.delaerSeatId);
        this.isGrabing = msg.isGrabing;
        //定庄后确认庄家倍数为0
        if (this.grablist[this.delaerSeatId] == 0){
            this.isExtraGrabing = true;
            this.grablist[this.delaerSeatId] = 1;
        }else{
            this.isExtraGrabing = false;
        }
    }
    //闲家下注
    onChooseChip(msg){
        GameAudioCfg.getInstance().playGameProcessAudio('audio_raise',false)
        this.chiplist[msg.seatId] = msg.chipValue;
    }
    //閑家推注
    onChipInfo(msg){
        this.extraChip = msg.tuizhuValue;
        this.gemit('updateExtraChip');
        //console.log("闲家推注的注码："+msg.tuizhuValue);
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
        this.start_sub_module(G_MODULE.Mpnn_cuopai, cb);
    }
    //打开总结算界面
    openTotalSettle (){
        this.start_sub_module(G_MODULE.Bull_totalSettle);
    }
    //打开牌型测试界面
    openCardsTest (){
        this.start_sub_module('GameCommon/Bull/Bull_cardsTest');
    }

    //======================
    
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
        return this.isWatcher
    }
    //获取所有人庄家倍数状态
    getGrablist(){
        return this.grablist;
    }
    //获取最大装束
    getGrabmax(){
        return this.grabmax;
    }
    //获取投注讯息
    getChiplist(){
        return this.chiplist;
    }
    //庄家的seadid
    getDelaerSeatId(){
        return this.delaerSeatId;
    }
    //是否抢庄 0：不抢庄  1：抢庄
    getIsGrabing(){
        return this.isGrabing;
    }
    //为特殊情况 忽略所有人的倍数 强制所有人出现抢庄动画
    getExtraGrabing(){
        return this.isExtraGrabing;
    }
    //推注注碼 為0 為無注碼
    getExtraChip(){
        return this.extraChip;
    }

    //中途加入的人员列表
    getEnterSeatIds(){
        return this.enterSeatIds;
    }

    //单例处理
    private static _instance:MpnnLogic;
    public static getInstance ():MpnnLogic{
        if(!this._instance){
            this._instance = new MpnnLogic();
        }
        return this._instance;
    }
}
