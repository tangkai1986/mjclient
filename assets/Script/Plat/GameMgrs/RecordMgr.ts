import BaseMgr from "../Libs/BaseMgr"; 
import NetNotify from "../NetCenter/NetNotify";
 
import RoomMgr from "./RoomMgr"; 
import GEventDef from "./GEventDef";
import GameNet from "../NetCenter/GameNet"; 
import ModuleMgr from "./ModuleMgr";
import BetMgr from "./BetMgr";
import { MahjongDef } from "../../GameCommon/Mahjong/MahjongDef";
import UserMgr from "./UserMgr";
import FrameMgr from "./FrameMgr";
import GameCateCfg from "../CfgMgrs/GameCateCfg";
import SubGameMgr from "./SubGameMgr";
  
export default class RecordMgr extends BaseMgr{ 
    private record;
    process=null; 
    buhuaIndex=0;
    loopIndex=0;
    recordFrags=[];
    loopInfos=null;
    loopCount=0;
    looptimer=null;
    loopInterTime=600; 
    inputRecord='';
    recordcode='';
	mahjongLogic=null; 
    bVideoMode=false;
    gameId=null;
    seats=null;
    timer=null
    bOtherRecord=false;//标志是否是其他人的录像
    private mySeatId=null;//我自己的座位信息
    constructor (){
        super();  
        this.routes = {
            'http.reqMatchRecord':this.http_reqMatchRecord,   
        }
    }
    //正在播放录像  
    isVideoMode(){
        return this.bVideoMode;
    }
    getRecordCode(){
        return this.recordcode;
    }
    getLoopIndex(){
        return this.loopIndex;
    }
    getLoopCount(){
        return this.loopCount;
    }
 
    reqMatchRecord(recordCode)
    {
        //游戏id 
        //录像码 
        this.inputRecord=recordCode; 
        let realRecord=null; 
        this.bOtherRecord=false;
        if(recordCode.length>9)
        {
            //取前面9位
            this.bOtherRecord=true;
            realRecord=recordCode.substring(0,9); 
        }
        else
        {
            //真实录像码是和自己的座位平起来的
            realRecord=recordCode
        }
        let msg={recordcode:realRecord};
        this.send_msg('http.reqMatchRecord',msg)
    } 
    http_reqMatchRecord(msg)
    {        
        this.gameId=msg.gameid;  
        let game=GameCateCfg.getInstance().getGameById(this.gameId)
        if(SubGameMgr.getInstance().getSubGameState(game.code)!=0)
        {
            FrameMgr.getInstance().showTips(`请先下载【${game.name}】`, null,35, cc.color(255,0,0), cc.p(0,0), "Arial", 1000); 
            return;
        }
        //从
        let record=JSON.parse(msg.record);  
        let cache=record.cache; 
        let seatInfos=record.seats;
        let roundIndex=record.roundindex; 
        let seatCount=0;
        this.seats={};
        //统计出人数,和找到自己的位置
        let mySeatId=null;
        let myUid=UserMgr.getInstance().getUid();
        for(let key in seatInfos)
        {  
            let uid=seatInfos[key].uid; 
            this.seats[key]=uid;
            if(uid==myUid)
            {
                mySeatId=parseInt(key);
            }
            seatCount++; 
        } 
        //如果是查看其他人的录像,则不用去理会自己的位置
        if(this.bOtherRecord)
        {
            //如果是查看其他人录像,则录像码为10位
            this.recordcode=this.inputRecord;
            let seatIdStr=this.recordcode.substring(9);
            //在这里就把我的座位记下来
            this.mySeatId=parseInt(seatIdStr); 
            if(this.mySeatId<0||this.mySeatId>=seatCount)
            { 
			    FrameMgr.getInstance().showTips('此录像不存在,请检查你的录像码', null,35, cc.color(255,0,0), cc.p(0,0), "Arial", 1000); 
                return;//不用去理会,因为座位对不上
            }
        }
        else
        {
            //查看自己录像,则mySeatId为查找的seatId
            this.mySeatId=mySeatId; 
            this.recordcode=`${this.inputRecord}${this.mySeatId}`;
        } 
        this.record={};
        //以下的计算是为了过滤掉不属于当前位置玩家的事件
        for(let key in cache)
        {
            let process=parseInt(key)
            let myLoopInfos=[];
            if(process==MahjongDef.process_loop)
            {
                let loopInfos=cache[key]; 
                for(let i=0;i<loopInfos.length;++i)
                {
                    let item=loopInfos[i];
                    let type=item[0];
                    if(type==MahjongDef.looprc_event)
                    {
                        let value=item[1];
                        if(value.seatId==this.mySeatId)
                        {
                            let param=value.param;
                            let events=param.events;
                            let finalEvents=[];
                            for(let j=0;j<events.length;++j)
                            {
                                let event=events[j];
                                if(event==MahjongDef.event_chupai||event==MahjongDef.event_gaipai)
                                { 
                                    continue;
                                }
                                finalEvents.push(event);
                            }
                            if(finalEvents.length>0)
                            {
                                let disablepass=param.disablepass;
                                myLoopInfos.push([type,{events:finalEvents,disablepass:disablepass}]); 
                            }
                        }   
                        else{
 
                        }
                    }
                    else
                    {
                        myLoopInfos.push(item);
                    }
                }
                this.record[process]=myLoopInfos;

            } 
            else
            {
                this.record[process]=cache[key]; 
            }
        }  
        
        this.bVideoMode=true;
        
        BetMgr.getInstance().setGameId(this.gameId);
        RoomMgr.getInstance().setVideoMode(true);
        //不管是茶馆还是房卡都统一成房卡，反正都是回放
        let roomInfo={seatcount:seatCount,v_roundcount:1,roomtype:2,gamecate:1};
        RoomMgr.getInstance().setRoomInfo(roomInfo);
        RoomMgr.getInstance().setFangKaCfg({});   
        //这个很重要，视角位置一定要在游戏加载前完成设置
        RoomMgr.getInstance().setMySeatId(this.mySeatId)   
        this.start_sub_module(G_MODULE.LoadingGame);  
    }
    //开始播放  
    startPlaying(){  
        RoomMgr.getInstance().updateRoomUsers({seats:this.seats}); 
        //跳转子游戏  
        this.loopInfos=this.record[MahjongDef.process_loop]
        this.loopCount=this.loopInfos.length;    
        this.mahjongLogic=RoomMgr.getInstance().getLogic().getInstance();   
        this.setProcess(MahjongDef.process_fapai);
    }
    //获取录像数据
    getRecord()
    {
        return this.record;
    } 
    //单例处理
    private static _instance:RecordMgr
    public static getInstance ():RecordMgr{
        if(!this._instance){
            this._instance = new RecordMgr();
        }
        return this._instance;
    } 
    setProcess(process)
    { 
        this.process=process;
        switch(process)
        { 
            case MahjongDef.process_fapai:
                this.process_fapai();
            break;
            case MahjongDef.process_buhua:
                this.process_buhua();
            break;
            case MahjongDef.process_kaijin:
                this.process_kaijin();
            break;
            case MahjongDef.process_loop: 
                this.process_loop(); 
            break;
            case MahjongDef.process_gamesettle:
                this.process_gamesettle();
            break; 
        } 
    }
    //定庄
    process_dingzhuang(){
        let data=this.record[MahjongDef.process_dingzhuang]; 
  
        let next=function()
        { 
            this.setProcess(MahjongDef.process_fapai)
        }
        this.broadCast(MahjongDef.onProcess,data,0,next); 
    }
    //发牌
    process_fapai(){
        let data=this.record[MahjongDef.process_fapai];  
        let next=function()
        {
            this.setProcess(MahjongDef.process_buhua);
        }.bind(this)
        this.broadCast(MahjongDef.onProcess,data,2,next);
    }
    //补花
    process_buhua(){
        let needbuhua=false;
        let buhuaarr=this.record[MahjongDef.process_buhua]
        if(buhuaarr==null)
        {
            needbuhua=false;
        }
        else{
            if(this.buhuaIndex<buhuaarr.length)
            {
                needbuhua=true;
            }
        }
        if(needbuhua)
        { 
            let huapaiarr=buhuaarr[this.buhuaIndex].value[0];//花牌
            let bupaiarr=buhuaarr[this.buhuaIndex].value[1];//补牌 
            let buhuaposes=buhuaarr[this.buhuaIndex].value[2];//不花位置
            this.buhuaIndex++;
            let param = {   
                process:this.process,
                huapaiarr:huapaiarr,//四个位置的花牌
                bupaiarr:bupaiarr,//四个位置的补牌 
                buhuaposes:buhuaposes,
            };  
            let next=function()
            { 
                this.setProcess(MahjongDef.process_buhua)
            }
            this.broadCast(MahjongDef.onProcess,param,2,next); 
            return;
        }
        this.setProcess(MahjongDef.process_kaijin);
    }
    //开金
    process_kaijin(){
        let param=this.record[MahjongDef.process_kaijin] 
        let next=function()
        {
            this.setProcess(MahjongDef.process_loop);
        } 
        this.broadCast(MahjongDef.onProcess,param,2,next); 
    }
    //主循环
    process_loop(){
        let param={process:this.process};
        this.broadCast(MahjongDef.onProcess,param);  
        this.startLoop(); 
    }
    clearLoopTimer(){ 
        if(this.looptimer!=null)
        { 
            clearInterval(this.looptimer);
            this.looptimer=null;
        }
    }
    destroy()
    {
        if(this.timer)
        {
            clearTimeout(this.timer);
            this.timer=null;
        }
        this.clearLoopTimer();
        delete RecordMgr._instance;
        RecordMgr._instance=null;
    }
    runLoop(){ 
        if(this.loopIndex>=this.loopCount)
        {   
            this.clearLoopTimer(); 
            this.setProcess(MahjongDef.process_gamesettle); 
            return; 
        } 
        let loopType=this.loopInfos[this.loopIndex][0];//类型，如操作或牌权切换
        let loopData=this.loopInfos[this.loopIndex][1];//如牌权信息或操作信息
        if(loopData.card)
        {
            loopData.card=parseInt(loopData.card)
        } 
        let event=null;
        switch(loopType)
        {
            case MahjongDef.looprc_op: 
                event=MahjongDef.onOp; 
            break;
            case MahjongDef.looprc_seatchange: 
                event=MahjongDef.onSeatChange; 
            break;
            case MahjongDef.looprc_event: 
                event=MahjongDef.onEvent; 
            break;
        }  
        let frag=this.mahjongLogic.getRecordFrag();
        this.recordFrags[this.loopIndex]=frag;
        NetNotify.getInstance().dealResp(event,loopData)
        GameNet.getInstance().emit(event,loopData);
        this.loopIndex++;  
        this.gemit(GEventDef.loopChanged)//发送全局事件让模块刷新自己的房间内用户
    }
    //开始循环
    startLoop(){ 
        this.looptimer=setInterval(this.runLoop.bind(this),this.loopInterTime);
    } 
    stopLoop(){
        this.clearLoopTimer();
    }
    //结算
    process_gamesettle(){ 
        let param={process:this.process};
        this.broadCast(MahjongDef.onProcess,param); 
        this.broadCast('http.reqSettle',{settle:JSON.stringify(this.record[MahjongDef.process_gamesettle].value)});  
    } 
    
    broadCast(route,param,time=0,next=null){ 
        if(!param)
        {
            param={};
        }        
        let dofun=function()
        {  
            //调用本地逻辑和分发
            NetNotify.getInstance().dealResp(route,param)
            GameNet.getInstance().emit(route,param);
        } 
        this.timer = setTimeout(
          () => { 
            clearTimeout(this.timer);
            this.timer=null
            dofun.bind(this)();
            //洗完牌拿牌
            if(next)
                next.bind(this)();
          },
          time*1000
        );
    } 
    gotoPreStep(){ 
        if(this.loopIndex<=0)
        {
            return;
        }
        this.loopIndex=this.loopIndex-1;
        let data=this.recordFrags[this.loopIndex]; 
        this.broadCast('onSyncData',JSON.parse(data));  
    }
    gotoNextStep(){
        this.runLoop();
    }
    replay(){
        this.loopIndex=0;
        let data=this.recordFrags[this.loopIndex]; 
        this.broadCast('onSyncData',JSON.parse(data));
        this.setProcess(MahjongDef.process_loop); 
    }
}