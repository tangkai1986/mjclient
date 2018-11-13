import BaseMgr from "../Libs/BaseMgr";
import UserMgr from "./UserMgr";
import BetMgr from "./BetMgr";
import LoginMgr from "./LoginMgr";
import VerifyMgr from "./VerifyMgr";
import CreateRoomMgr from "./CreateRoomMgr";
import YySdkMgr from "../SdkMgrs/YySdk";
import FrameMgr from "./FrameMgr";
import GameCateCfg from "../CfgMgrs/GameCateCfg";
import SeatMgr from "./SeatMgr"; 
import viewLogicSeatConvertMgr from "./viewLogicSeatConvertMgr";
import BunchInfoMgr from "./BunchInfoMgr"; 
import QEventDef from "./GEventDef";
import UserDefaultCfg from "../CfgMgrs/UserDefaultCfg";
import NetNotify from "../NetCenter/NetNotify";
import LocalStorage from "../Libs/LocalStorage";
import GameAudioCfg from "../CfgMgrs/GameAudioCfg";
import GameNet from "../NetCenter/GameNet";
import GEventDef from "./GEventDef";
import RecordMgr from "./RecordMgr";

/**
 * VerifyMgr
 * table
 * g
 * GameType
 * gfun
 * 
 */

let Other_player_enter = "other_player_enter";    //其他玩家进入音效
let Other_player_leave = "other_player_leave";    //其他玩家离开音效
let Win = "win";                                  //胜利音乐
let Lose = "lose";                                //失败音乐
let liuju = "liuju";                              //流局音乐
  
export default class RoomMgr extends BaseMgr{
    bVideoMode=false;
    DefCls=null;
    LogicCls=null;
    ResMgrCls=null;
    AudioCls=null;  
    CardsCls=null;  
    roominfo = null
    roomtype:number = null                        //0表示金币场1表示房卡
    fangKaCfg=null//房卡配置
    routes={}
    //=========
    password:any = null
    users={}
    preparemap={}
    myseatid:any = null
    bGameIsStarted:Boolean = null
    rid:any = null  
    autoPrepare=false;
    roundindex=0;//第几局
    playercount=0;
    bunchInfo=null;
    bunchFinish=false;
    enterFangKaGameId=null
    voicestates={};//语音状态
    matchid=null;
    ipWarnningSeats={};//ip警告标记
    distWarningSeats={};//距离警告的标记
    uidseatmap={};//通过uid寻找座位号
    enterFangKaClubId=null;//茶馆房间的茶馆id
    enterFangKaPaysource=null;//茶馆房间的支付方式
    b_inRoom=false;//在房间中的状态初始化为false
    b_bunchStarted=false;
    m_applyDissolutionSeatId=null;
    m_applySeats={};//申请解散的座位信息
    fangzhuroomtype = null;
    fangzhuroomstart = false;//房主支付类型的房间是否已经开始游戏
    inrooms={};
    m_offline:any = null;       //玩家离线记录
    seatCount=null;
    onlineAutoDisRoomTickTime=0;//自动拒绝的剩余时间
    offlineAutoDisRoomTickTime=0;//离线自动同意的剩余时间
    curSecond=null;//当前开始录音时间
    endSecend=null;//结束录音时间
    offlineVoiceLength=0;
    offlineVoiceSpeek=false; 
    private willBackFromHide=false;//是否将从后台回来
    private bwatch=false;//是否是旁观者
    private bLoadingGame=false;
    private bInClub=false;
    private hasEnterRoomSvr=false;//已经进房间服了
    private enterBackGroundStartTime=0;
    //离线语音队列
    public voiceArr=[];
    //当前正在播放的语音信息
    public curPlayingVoiceData=null;
    private timerDisband=null;
    constructor (){
        super();
        this.curSecond = 0;  
        this.endSecend = 0;
        this.roundindex=0;
        this.roominfo=null; 
        this.enterFangKaClubId=0;
        this.enterFangKaPaysource=0;
        this.m_offline = new Array;
        this.resetData();     

        this.routes = {
            'http.reqCreateFangKaVerify':this.http_reqCreateFangKaVerify,   
            'onEnterRoom':this.onEnterRoom,  
            'onReEnterRoom':this.onReEnterRoom, 
            
            'onLeaveRoom':this.onLeaveRoom,
            'onPrepare':this.onPrepare, 
            'onSyncData':this.onSyncData,
            'onStartGame':this.onStartGame,         
            'connector.entryHandler.enterRoom':this.connector_entryHandler_enterRoom,  
            'room.roomHandler.nextRound':this.room_roomHandler_nextRound,  
            'onGameFinished':this.onGameFinished,  
            'http.reqFangKaEntry':this.http_reqFangKaEntry, 
            'http.reqCreateFangKaRoom':this.http_reqCreateFangKaRoom, 

            
            'http.reqFangKaVerify':this.http_reqFangKaVerify,
            'http.reqRoomInfo':this.http_reqRoomInfo,  
            'room.roomHandler.exitRoom':this.room_roomHandler_exitRoom, 
            'http.reqFangKaCfg':this.http_reqFangKaCfg, 
			'onDisbandRoom':this.onDisbandRoom,
            'onVoiceStateChanged':this.onVoiceStateChanged,  
			'http.reqCheating' : this.http_reqCheating,
            'connector.entryHandler.enterPlat':this.connector_entryHandler_enterPlat,
            'connector.entryHandler.enterGameSvr':this.connector_entryHandler_enterGameSvr,
            'onApplyDissolutionRoom':this.onApplyDissolutionRoom,
            'onAgreeDissolutionRoom':this.onAgreeDissolutionRoom,
            'onRefuseDissolutionRoom':this.onRefuseDissolutionRoom,
            'onDissolutionRoom':this.onDissolutionRoom,
            'onCancelPrepare':this.onCancelPrepare,
            'onUserOffLine':this.onUserOffLine,
            'http.reqSettle':this.http_reqSettle,
            'onChangeRoomMaster':this.onChangeRoomMaster,
            'onRoomVoice':this.onRoomVoice,//接受到别人发给的语音
        } 
        G_FRAME.globalEmitter.on("EnterBackground", this.EnterBackground.bind(this), this)
        G_FRAME.globalEmitter.on("EnterForeground", this.EnterForeground.bind(this), this)
        G_FRAME.globalEmitter.on(GEventDef.voice_JoinRoomOk, this.onJoinVoiceRoom.bind(this), this)
        G_FRAME.globalEmitter.on(GEventDef.voice_ApplyMessageKeySuccessOk, this.onApplyMessageKeySuccess.bind(this), this)
        G_FRAME.globalEmitter.on(GEventDef.voice_UploadFileCompleteOk, this.onUploadFileComplete.bind(this), this)
        G_FRAME.globalEmitter.on(GEventDef.voice_PlayRecordedFileOk, this.onPlayRecordedFile.bind(this), this)
        G_FRAME.globalEmitter.on(GEventDef.voice_PlayRecordedFileCompleteOk, this.onPlayRecordedFileComplete.bind(this), this)
    }
    setInClub(bValue)
    {
        this.bInClub=bValue;
    }
    //获取是否是在录音中的状态
    isRecording(){
        return this.offlineVoiceSpeek;
    }
    //开始录音
    startRecording(){ 
        this.offlineVoiceSpeek=true;
        this.pauseMusic();
    }
    //结束录音
    stopRecording(){ 
        this.offlineVoiceSpeek=false;
        this.resumeMusic();
    }
    isInClub(){
        return this.bInClub;
    }
    setLoadingGame(bValue)
    {
        this.bLoadingGame=bValue;
    }
    isLoadingGame(){
        return this.bLoadingGame;
    }
    //设置播放录像模式
    setVideoMode(bVideoMode)
    {
        this.bVideoMode=bVideoMode;
    }    
    //获取播放录像模式
    getVideoMode(){
        return this.bVideoMode;
    }
    setMySeatId(seatId)
    {
        this.myseatid=seatId;
        SeatMgr.getInstance().setMySeatId(this.myseatid);
        viewLogicSeatConvertMgr.getInstance().setMySeatId(this.myseatid,this.roominfo.seatcount);
        //console.log("我的座位setMySeatId=",seatId,this.myseatid)
    }    
    //回放模式下的房间信息设置
    setRoomInfo(roomInfo)
    {
        this.roominfo=roomInfo;
        SeatMgr.getInstance().setRoomInfo(this.roominfo);
    }
    setFangKaCfg(fangKaCfg)
    {
        this.fangKaCfg=fangKaCfg;
        //console.log("fangKaCfg",fangKaCfg);
        
    }
    setRoundIndex(roundindex)
    {
        this.roundindex=roundindex;
    }
    clearVoiceData()
    {
        this.curPlayingVoiceData=null;
        this.offlineVoiceSpeek=false; 
        this.voiceArr=[];//清空录音队列
        YySdkMgr.getInstance().StopPlayFile();
    }
    //由于前后台切换很多问题，这边就将前后台切换断网处理去除
    EnterBackground () {
        this.clearVoiceData();
        this.enterBackGroundStartTime=(new Date()).getTime();
        this.willBackFromHide=true;   
    }
    EnterForeground () {
        //切换前台后离线语音相关数据清空
        this.clearVoiceData();
        //进入后台长达一分钟就重启 
        if(this.enterBackGroundStartTime!=0)
        {
            //客户建议改成15分钟
            if((new Date()).getTime()-this.enterBackGroundStartTime>15*60*1000)
            { 
                cc.audioEngine.stopAll();
                cc.game.restart();
                return ;
            }
        } 
        this.enterBackGroundStartTime=(new Date()).getTime();
        //防止重复禁入前台
        // if(this.willBackFromHide){
        //     GameNet.getInstance().disconnect();//显示出来的时候就
        // }
        // this.willBackFromHide=false;
        //修复下拉通知后未进入断线重连  
        //前后台切换先不掉线
        //GameNet.getInstance().disconnect();//显示出来的时候就 
    }
    //成功初始化房间语音
    onJoinVoiceRoom(){
        //console.log('Listener : js成功初始化房间语音')
        YySdkMgr.getInstance().setVoiceInitOk();
    }
    setvoiceLength(voiceLength)
    {
        this.offlineVoiceLength = voiceLength;
    }
    //申请许可成功
    onApplyMessageKeySuccess(){
        //console.log('Listener : js成功初始化房间离线语音')
        YySdkMgr.getInstance().setVoiceInitOk();
    }
    //上传录音文件成功回调
    onUploadFileComplete(fileID,length){  
        //在底层调用了StopRecording后会再将录音上传至gvoice服务器,上传完成后就有现在的回调
        //在这个回调中要将录音文件id和时间长度发到服务器上,让服务器帮忙广播这个语音文件id       
        let msg={
            data:{
                fileId:fileID,
                length:this.offlineVoiceLength,
            },
        }
        this.send_msg("room.roomHandler.roomVoice",msg); 
        //再去检查录音过程中是否收到了他人的离线语音
        this.checkAndPlayVoice();
    }
    //是否在下载并播放他人语音中
    isPlayingRecord(){
        return this.curPlayingVoiceData!=null;
    }
    //检查并播放他人离线语音
    checkAndPlayVoice()
    { 
        //不在房间中,就不处理接收到的离线语音
        if(!this.b_inRoom)
        {
            return;
        }
        //如果是正在下载他人离线语音中,也不去处理
        if(this.curPlayingVoiceData)
        {
            return;
        }
        //如果是自己正在录音中,也不去播放他人离线语音
        if(this.offlineVoiceSpeek)
        {
            return;
        }
        //如果没有离线语音信息,就直接返回
        if(this.voiceArr.length<=0)
        {
            return;
        } 
        //先取出最早收到的语音信息
        this.curPlayingVoiceData=this.voiceArr[0];
        //再将这个信息从队列中移除
        this.voiceArr.remove(0);
        //去下载李先语音,并且底层会自动在下载完成后开始播放
        YySdkMgr.getInstance().DownloadRecordedFile(this.curPlayingVoiceData.data.fileId); 
    }
    //网络事件回调begin
    onRoomVoice(msg){
        //这边是收到服务器的广播
        //在房间中才接收
    
        if(!this.b_inRoom)
        {
            return;
        }
        //服务器只会广播给除说话者以外的房间玩家,自己说的话自己不可能收到的
        //将他人的离线语音添加到队列中
        this.voiceArr.push(msg); 
        //并且检查是否可以播放
        this.checkAndPlayVoice();
    }
    // 下载完饼开始播放他人离线语音的回调
    onPlayRecordedFile(){ 
    }
    //播放他人离线语音完成的回调
    onPlayRecordedFileComplete()
    { 
        //将当前的离线语音信息置空
        this.curPlayingVoiceData=null;
        //再次检测是否还有离线语音可以播放
        this.checkAndPlayVoice();
    }    
    pauseMusic(){ 
        //播放语音回调       
        //console.log("pause Music");
        if(this.AudioCls){
            this.AudioCls.getInstance().pauseBGM();
            this.AudioCls.getInstance().pauseGameYYAudio();
            this.AudioCls.getInstance().pauseGameProcessAudio();
        }		
    } 
    resumeMusic(){ 
        //播放完成回调      
        //console.log("resume Music");
        if(this.AudioCls){
            this.AudioCls.getInstance().resumeBGM();
            this.AudioCls.getInstance().resumeGameYYAudio();
            this.AudioCls.getInstance().resumeGameProcessAudio();
        }		
    }   
    onChangeRoomMaster(msg){
        this.roominfo.owner=msg.newMasterUid
    }
    http_reqSettle(msg)
    { 
        let settle=JSON.parse(msg.settle);  
        let win_seatid=settle.win_seatid;
        if(win_seatid==null)
        {
            //说明流局
            GameAudioCfg.getInstance().playGameProcessAudio(liuju,false);
            //console.log("流局",win_seatid);
        }
        else
        {
            if(win_seatid==this.myseatid)
            {
                //游戏胜利
                GameAudioCfg.getInstance().playGameProcessAudio(Win,false);
                //console.log("胜利",win_seatid);
            }
            else
            {
                //游戏失败
                GameAudioCfg.getInstance().playGameProcessAudio(Lose,false);
                //console.log("失败",win_seatid);
            }
        }
    }
    //用户下线
    onUserOffLine(msg){
        let count = msg.seatIDs.length;
        for(let i = 0; i<count;  i++){
            this.m_offline.push(msg.seatIDs[i]);
        }
        //console.log("1this.m_offline:", this.m_offline);
    }
    getoffline(){
        //console.log("2this.m_offline:", this.m_offline);
        return this.m_offline;
    }
    manualStart(){ 
        this.send_msg('room.roomHandler.manualStart');
    }
    connector_entryHandler_enterPlat()
    {
        //监听这个消息后要判断是否在房间中再做响应的处理
        if(this.b_inRoom)
        {
            //去恢复房间
            this.enterRoom();
        }
    }
    //进入了游戏房间
    connector_entryHandler_enterGameSvr()
    {
        //监听这个消息后要判断是否在房间中再做响应的处理
        if(this.b_inRoom)
        {
            //去恢复房间
            this.enterRoom();
        }
    }
    //房间满了没
    isRoomFull(){
        for(let seatId=0;seatId<this.roominfo.seatcount;++seatId)
        {
            if(this.users[seatId]==null)
            {
                return false;
            }
        }
        return true;
    }
    //同意
    onAgreeDissolutionRoom(msg){
        this.m_applySeats[msg.seatId]=1;
    }
    //拒绝
    onRefuseDissolutionRoom(msg){
        this.m_applySeats[msg.seatId]=2;
    }
    //解散房间
    onDissolutionRoom(msg){     
        this.m_applySeats={};
        this.m_applyDissolutionSeatId=null;   
    }
    clearDisbandTimer(){
        if(this.timerDisband)
        {
            clearTimeout(this.timerDisband)
            this.timerDisband=null;
        }
    }
    destroy(){
        //清理房间,这边需要把各种语音状态也清理
        //如果在录音中就停止录音
        this.clearDisbandTimer();
        if(this.offlineVoiceSpeek)
        {
            YySdkMgr.getInstance().StopRecording();
        }
        //如果是正在播放声音,就停止声音
        if(this.curPlayingVoiceData)
        {
            YySdkMgr.getInstance().StopPlayFile();
        }
        super.destroy()
        delete RoomMgr._instance;
        RoomMgr._instance=null; 
        RoomMgr.getInstance();
        SeatMgr.getInstance().clear();
        viewLogicSeatConvertMgr.getInstance().clear();
        YySdkMgr.getInstance().LeaveRoom(); 
        if(this.AudioCls)
        {
            this.AudioCls.getInstance().destroy();
        } 
        RecordMgr.getInstance().destroy();//录像回放管理
        //console.log("destroy 罗积累=",this.LogicCls)
        this.LogicCls.getInstance().destroy();//清理逻辑层
    }
    swithVoiceState(voicestate)
    {
        let msg={
            voicestate:voicestate,
        }
        // LocalStorage.getInstance().setVoicestateCfg(voicestate);
        this.send_msg('room.roomHandler.swithVoiceState',msg); 
    }
    getVoiceState(seatId)
    {
        return this.voicestates[seatId];
    }
    //声音状态改变
    onVoiceStateChanged(msg)
    {
        //如果是收到自己的操作变化不理会 
        this.voicestates[msg.seatid]=msg.voicestate; 
    }
    setGameLibs(defcls,resmgrcls,logiccls,audiocls,cardscls)
    {
        this.DefCls=defcls;
        this.ResMgrCls=resmgrcls;
        this.LogicCls=logiccls;
        this.AudioCls=audiocls;
        this.CardsCls=cardscls;
        logiccls.getInstance();//启动游戏逻辑
        if(audiocls)
        {
            audiocls.getInstance().playBGM();
        }
        //console.log("罗积累=",this.LogicCls)
    }
    getDef(){
        return  this.DefCls;
    }
    getResMgr(){
        return  this.ResMgrCls;
    }
    getLogic(){
        return  this.LogicCls;
    }
    getAudio(){
        return  this.AudioCls;
    }
    getCards(){
        return  this.CardsCls;
    }
    isBunchFinish(){
        return this.bunchFinish;
    }
    getBunchInfo(){
        return this.bunchInfo;
    }
    getRoundIndex(){
        return this.roundindex;
    }
    isFirstRound(){
        return this.roundindex==0;
    }
    showFinalSettle(){ 
        let gameid = BetMgr.getInstance().getGameId();
        this.bunchInfoSetMemberList();
        BunchInfoMgr.getInstance().showFinalSettle(gameid);
    }
    onDisbandRoom(msg){
        //console.log("onDisbandRoom",msg,this.roundindex,this.fangKaCfg,this.fangzhuroomstart)
       let delayShow=()=>{ 
            this.clearDisbandTimer(); 
            this.timerDisband = window.setTimeout(()=>{
                this.clearDisbandTimer(); 
                this.DisbandRoomCall(this,msg)
            },10);
       }
       if(this.roundindex>0)
       {
           delayShow();
       } 
       else if(this.roundindex==0&&this.fangKaCfg.v_paytype!=null&&this.fangKaCfg.v_paytype!=0){
        
           delayShow();
       }
       else if(this.roundindex == 0&&this.fangKaCfg.v_paytype==0){
            var okcb=function(){
                LoginMgr.getInstance().disconnectGameSvr();
            } 
            //房主支付并已开始游戏
            if(this.fangzhuroomstart){
                delayShow();
            }else{
                //房主为开始游戏直接退到大厅
                if(this.isRoomOwner(this.myseatid)){
                    //bug
                    this.DisbandRoomCall(this,msg);
                }
                else{
                    FrameMgr.getInstance().showMsgBox("房主已经解散房间，本次房间您无需支付任何费用，确定后返回大厅",okcb.bind(this))
                }
               
            }
           
       } 
      
	}
    broadCastroomDestroy(){
        this.gemit(GEventDef.mj_destroyRoom);//广播解散房间
    }
    DisbandRoomCall(data,msg){
        this.broadCastroomDestroy();
        if(msg.needfianlsettle)
        {
            if(this.playercount == 2 || this.playercount == 3){
                FrameMgr.getInstance().showHintBox("全部玩家同意解散房间，房间解散，确定后进行房间总结算",()=>{  
                    data.showFinalSettle();
                })
            }else{
                FrameMgr.getInstance().showHintBox("大部分玩家同意解散房间，房间解散，确定后进行房间总结算",()=>{ 
                    data.showFinalSettle();
                })
            }           
        }
        else
        {
            //解散房间
            var okcb=function(){
                LoginMgr.getInstance().disconnectGameSvr();
            } 
            FrameMgr.getInstance().showHintBox('全部玩家同意解散房间，本次房间您无需支付任何费用，确定后返回大厅。',okcb.bind(this)) 
            data.m_offline = null;  
        }
    }
    setAutoPrepare(bPrepare)
    {
        this.autoPrepare=bPrepare
    }
    checkRoomParam(roominfo,cfg)
    {
        if(!roominfo||!cfg)
        {
            return false;
        } 
        return true;
    }
    //===================所有的请求回调
    http_reqFangKaEntry(msg)
    {       
        //合并了roominfo到http_reqFangKaEntry中
        //console.log("http_reqFangKaEntry msg=",JSON.stringify(msg))
        if(!this.checkRoomParam(msg.roominfo,msg.cfg))
        {
            //这边是房卡房间没了
            return;
        }
        this.http_reqRoomInfo({roominfo:msg.roominfo}); 
        this.http_reqFangKaCfg({cfg:msg.cfg}); 
        //在这里去断开大厅的网络连接
        LoginMgr.getInstance().disconnectDaTing();
    } 
    http_reqCreateFangKaRoom(msg)
    {        
        //合并了roominfo到http_reqCreateFangKaRoom中
        //console.log("http_reqCreateFangKaRoom msg=",msg)
        this.http_reqRoomInfo({roominfo:msg.roominfo}); 
        this.http_reqFangKaCfg({cfg:msg.cfg}); 
        //在这里去断开大厅的网络连接
        LoginMgr.getInstance().disconnectDaTing();
    }
    
    //房间聊天
    roomChat(msg)
    {
        this.send_msg('room.roomHandler.roomChat',msg); 
    }
    
    reqCheating()
    {
        let msg={
            rid:this.rid,
        } 
        this.send_msg('http.reqCheating',msg);
    } 
 
 
    //获取我的房间状态
    reqMyRoomState()
    {
        this.send_msg('http.reqMyRoomState');//获取我的房间状态
    }
 
 
    reqFangKaEntry()
    {
        this.send_msg('http.reqFangKaEntry');//进入房卡房间
    }
    http_reqFangKaVerify()
    {
        this.reqFangKaEntry()
    }
    reqFangKaVerify(password)
    { 
        // 记录加入房间的游戏ID
        BetMgr.getInstance().setGameId(this.enterFangKaGameId);
        this.password=password;
        let msg={
            'password':password,
        }
        this.send_msg('http.reqFangKaVerify',msg);//进入房卡房间 
    }
    http_reqFangKaCfg(msg)
    {
        //console.log('http_reqFangKaCfg msg-=',msg)
        this.enterFangKaGameId=msg.cfg.gameid;
        this.enterFangKaClubId=msg.cfg.clubid;
        this.enterFangKaPaysource=msg.cfg.pay_source;
        this.fangKaCfg=JSON.parse(msg.cfg.cfg);
        this.fangzhuroomtype = this.fangKaCfg.v_paytype;
    }
    getEnterFangKaClubId(){
       return this.enterFangKaClubId
    }
    getEnterFangKaPaysource(){
        return this.enterFangKaPaysource
    }
    getFangKaPassword(){
        return this.password
    }
    getEnterFangKaGameId(){
        return this.enterFangKaGameId
    }
    //获取房间配置
    getFangKaCfg(){
        return this.fangKaCfg;
    }
    reqFangKaCfg(password)
    {
        this.password=password;
        let msg={
            'password':password,
        }
        this.send_msg('http.reqFangKaCfg',msg);//获取房卡配置
    }

    resetData()
    {
        this.users={};
        this.preparemap={};
        //录像模式下不要重置视角座位
        if(!this.bVideoMode)
        {
            this.myseatid=null; 
        }  
        this.m_applyDissolutionSeatId=null;
        if(this.bunchFinish)
        {
            this.bunchInfo=null;
            this.bunchFinish=false;
        }
    }
    onApplyDissolutionRoom(msg)
    { 
        this.m_applySeats[msg.seatId]=1;
        this.m_applyDissolutionSeatId=msg.seatId;
        this.offlineAutoDisRoomTickTime=msg.offlineAutoDisRoomTickTime;
        this.onlineAutoDisRoomTickTime=msg.onlineAutoDisRoomTickTime;//自动拒绝的剩余事件
        this.start_sub_module(G_MODULE.ApplyDisbandRoom);//申请解散
    }
    getApplyDissolutionSeatId(){ 
        return this.m_applyDissolutionSeatId;
    }
    isGameStarted(){
        return  this.bGameIsStarted;
    }
    onSyncData(msg)
    {   
        console.log("onsyncdata",msg);
        this.b_bunchStarted=true;
    }
  
    http_reqRoomInfo(msg)
    {
        this.roominfo=msg.roominfo; 
         
        this.rid=this.roominfo.id;  
        SeatMgr.getInstance().setRoomInfo(this.roominfo);
    }
    updateSeatCount()
    {
    }
    reqRoomInfo()
    { 
        this.send_msg('http.reqRoomInfo');//获取房间信息
    } 
    //麻将进度
    onStartGame(msg) 
    { 
        this.bwatch=false;//重置旁观者状态
        this.bGameIsStarted=true;
        this.b_bunchStarted=true;
        this.roundindex= msg.roundindex;
        this.playercount=msg.playercount;
        this.fangzhuroomstart = true;
    }
    //是否是旁观者
    isWather(){
        return  this.bwatch;
    }
    reqSettle()
    {
        // body
        let msg={
            'matchid':this.matchid,
        }
        this.send_msg('http.reqSettle',msg);//获取结算
    } 

    onGameFinished(msg)
    {
         console.log("onGameFinished",JSON.stringify(msg))
        // body
        this.bwatch=false;//作为非旁观者
        this.preparemap={};//重置准备状态
        this.bGameIsStarted=false; 
        this.matchid=msg.matchid; 
        this.bunchInfoSetMemberList();
        this.updateBunchInfo(msg.bunchInfo);
        // body 
        UserMgr.getInstance().reqMyInfo();
        this.reqSettle();
    }
    bunchInfoSetMemberList()
    {
        let memberList = [];
        for(let logicseatid in this.users)
        { 
            let  uid = this.users[logicseatid];
            memberList[logicseatid]={};
            let info=UserMgr.getInstance().getUserById(uid);
            if(!info)
            {
                info={id:uid,headid:1,nickname:""};
            }
            memberList[logicseatid] = info
            memberList[logicseatid].bowner = false;
            if(this.isRoomOwner(logicseatid))
            {
                memberList[logicseatid].bowner = true;
            } 
            
        }
        BunchInfoMgr.getInstance().setMembelist(memberList);
    }
    movieFinished() {
        this.send_msg("room.roomHandler.movieFinished");
    }
 
    nextRound(){
        // body  
        this.send_msg('room.roomHandler.nextRound');
    }
    onPrepare(msg)
    {
        // body
        this.preparemap[msg.seatid]=true;
    }
    onCancelPrepare(msg)
    {
        // body
        this.preparemap[msg.seatid]=false; 
    }
    
    
    prepare()
    {
        // body 
        this.send_msg('room.roomHandler.prepare');         
    }
    cancelprepare(){
        
        this.send_msg('room.roomHandler.cancelprepare',null);
    }
    
    onEnterRoom(msg) 
    {  
        if(!this.willBackFromHide){
            GameAudioCfg.getInstance().playGameProcessAudio(Other_player_enter,false);
        } 
        let uid=msg.user;
        this.users[msg.seatid]=uid   
        this.uidseatmap[uid]=msg.seatid;
        this.voicestates[msg.seatid]=msg.voicestate;  
        this.inrooms[msg.seatid]=true;
        UserMgr.getInstance().reqUsers([uid]);
    }
    onReEnterRoom(msg)
    {
        // body  
        this.preparemap[msg.seatid]=true;   
             
    }

    onLeaveRoom(msg)
    {  
        GameAudioCfg.getInstance().playGameProcessAudio(Other_player_leave,false);
        delete this.users[msg.seatid]
        delete this.preparemap[msg.seatid] 
    }
   
    updateRoomUsers(msg)
    {  
        this.resetData();
        // body 
        var uids=[]
    
        for(let key in msg.seats)
        {
            let seatid=parseInt(key);
            let uid=msg.seats[key]; 
            this.uidseatmap[uid]=seatid;
            if(uid!=null)
            {
                this.users[seatid]=uid;
                if(msg.prepares)
                {
                    this.preparemap[seatid]=msg.prepares[key];
                }
                if(msg.voicestates)
                {
                    this.voicestates[seatid]=msg.voicestates[key];
                }
                uids.push(uid)
            }
        } 
        this.bunchInfoSetMemberList();
        //录像模式下，是根据录像码去决定视角位置
        if(!this.bVideoMode)
        {
            // 设置我的seatid
            var myuid= LoginMgr.getInstance().getUid()  
            for(var logicseatid in this.users)
            { 
                var  uid = this.users[logicseatid]  
                if (uid && myuid== uid )  
                {   
                    this.myseatid=parseInt(logicseatid);  
                    SeatMgr.getInstance().setMySeatId(this.myseatid);
                    viewLogicSeatConvertMgr.getInstance().setMySeatId(this.myseatid,this.roominfo.seatcount);
                    break;
                } 
            } 
        }
        UserMgr.getInstance().reqUsers(uids);  
        this.gemit(QEventDef.usersUpdated)//发送全局事件让模块刷新自己的房间内用户
    }
     
  
    getMySeatId()
    {
        // body 
        return this.myseatid;
    }
    isBunchStarted(){
        return this.b_bunchStarted;
    }
    exitRoom()
    {   
        // body
        this.send_msg('room.roomHandler.exitRoom');
    } 
    applyDissolutionRoom()
    {
        this.send_msg('room.roomHandler.applyDissolutionRoom');
    }
    agreeDissolutionRoom()
    {
        this.send_msg('room.roomHandler.agreeDissolutionRoom');
    }
    refuseDissolutionRoom()
    {
        this.send_msg('room.roomHandler.refuseDissolutionRoom');
    }
    room_roomHandler_exitRoom(msg){ 

        LoginMgr.getInstance().disconnectGameSvr();
    }
    getRoundCount(){
        return this.roominfo.v_roundcount;
    }
    getSeatCount(){
        return this.roominfo.seatcount;
    }
    getApplySeats(){
        return this.m_applySeats;
    }
    getPlayerCount(){
        return this.playercount; 
    }
    getViewSeatId(logicSeatId)
    {
        // body 
        return SeatMgr.getInstance().getViewSeatId(logicSeatId); 
    }
    getLogicSeatId(viewSeatId)
    {
        return SeatMgr.getInstance().getLogicSeatId(viewSeatId); 
    }
    //获取房间信息
    getRoomInfo(){
        return this.roominfo;
    }
    isRoomOwner(seatId)
    {
        let uid=this.users[seatId];
        return uid==this.roominfo.owner;
    }
    getRoomOwner (){
        return this.roominfo.owner
    }
    getFangFei()
    {
        return this.roominfo.fangfei;
    }
    //座位上是否有人正在游戏 @seatViewId: 客户端id
    isSeatPlaying(seatViewId){
        return Boolean(this.users[this.getLogicSeatId(seatViewId)])
    }
    getGameName()
    {
        return GameCateCfg.getInstance().getGameById(BetMgr.getInstance().getGameId()).name;
    }
    //是否需要显示房主开房按钮
    isShowStartBtn (){
        if(this.bGameIsStarted || !this.isFirstRound()) return false;
        // //console.log('游戏未开始')
        //游戏类型是否卡牌
        let gameid = BetMgr.getInstance().getGameId();
        let gameCate = GameCateCfg.getInstance().getGameById(gameid).cate;
        if(gameCate == 2){//是卡牌
            // //console.log('是卡牌游戏')
            //开房配置是否允许手动开局
            if(this.fangKaCfg.v_startModel == 0){//手动开房
                // //console.log('开房配置是否允许手动开局')
                //自己是否房主
                // //console.log('ower== ',this.roominfo.owner,' myseatId=',this.myseatid)
                if(this.isRoomOwner(this.myseatid)){//是房主
                    // //console.log('自己是否房主',this.preparemap)
                    //准备人数是否大于2
                    let prepareNum = 0;
                    for(let key in this.preparemap){
                        if(this.preparemap[key]) prepareNum += 1;
                    }
                    if(prepareNum>=2 && prepareNum == Object.keys(this.users).length){
                        // //console.log('是否所有人都准备了')
                        //可以手动开房
                        return true
                    }
                }
            }
        }
        return false;
    }
    //当前玩家是否都准备了
    isAllPlayerPrepare(){
        let prepareNum = 0;
        for(let key in this.preparemap){
            if(this.preparemap[key]) prepareNum += 1;
        }
        if(prepareNum>=2 && prepareNum == Object.keys(this.users).length){
            // //console.log('是否所有人都准备了')
            //可以手动开房
            return true
        }
        return false;
    }
    //自己玩家是否都准备了
    isPlayerPrepare(){
        let seatid = this.myseatid;
        if(this.preparemap[seatid]){
            // //console.log('是否所有人都准备了')
            //可以手动开房
            return true
        }
        return false;
    }
  
	http_reqCheating(msg){
		let result=msg.result;
		for(let key in result)
		{ 
			let uid=parseInt(key);
			let info=result[key];
            let seatid=this.uidseatmap[uid]; 
			if(info.ip_res)
			{

				let userinfo=UserMgr.getInstance().getUserById(uid);
				this.ipWarnningSeats[seatid]=true;
			}
			if(info.lal_res)
			{
				let userinfo=UserMgr.getInstance().getUserById(uid);
				this.distWarningSeats[seatid]=true;
			} 
		} 
    }
    getIpWarnningBySeatId(seatid)
    {
        return this.ipWarnningSeats[seatid];
    }
    
    getDistWarnningBySeatId(seatid)
    {
        return this.distWarningSeats[seatid];
    }
    
    //判断是否是在房间中
    isInRoom(){
        return this.b_inRoom;
    }
    enterRoom()
    {
  
        // body
        this.b_inRoom=true;
        // let voiceState=UserDefaultCfg.getInstance().getVoiceState();
        // if(LocalStorage.getInstance().getVoicestateCfg()) {
        //     voiceState = LocalStorage.getInstance().getVoicestateCfg();
        // }
        let voiceState = 3;
        if(cc.sys.isNative){
            if(G_PLATFORM.getMicrophoneMute() && G_PLATFORM.getSpeakerphoneOn()){
                voiceState = 1;
            }else if(!G_PLATFORM.getMicrophoneMute() && G_PLATFORM.getSpeakerphoneOn()){
                voiceState = 2;
            }else if(!G_PLATFORM.getMicrophoneMute() && !G_PLATFORM.getSpeakerphoneOn()){
                voiceState = 3;
            }
            //console.log("getMicrophoneMute",G_PLATFORM.getMicrophoneMute());
            //console.log("getSpeakerphoneOn",G_PLATFORM.getSpeakerphoneOn());
            //console.log("state",voiceState);
        }        
        let msg={
            voicestate:voiceState,
        }
        this.send_msg('connector.entryHandler.enterRoom',msg);
    }
    getUidBySeatId(seatId)
    {
        return this.users[seatId];
    }
    getSeatIdByUid(uid){
        for(let seatId in this.users){
            if(uid == this.users[seatId]) return seatId;
        }
        return null
    }
    //更新一把的信息
    updateBunchInfo(bunchInfo)
    {      
        let leiji={};
        for(let k in bunchInfo.leiji)
        {
            leiji[parseInt(k)]=bunchInfo.leiji[k]
        } 
 
        let meiju=[];
        for(let i = 0;i<bunchInfo.meiju.length;++i)
        {
            let item={};
            let tmpitem=bunchInfo.meiju[i];
            for(let k in tmpitem)
            {
                item[parseInt(k)]=tmpitem[k]
            }
            meiju.push(item);
        }
        this.bunchInfo=bunchInfo;
        this.bunchInfo.seatcount=this.roominfo.seatcount;
        this.bunchInfo.meiju=meiju;
        this.bunchInfo.leiji=leiji;
        this.roundindex=bunchInfo.roundIndex;//更新到下一局了，在服务器发之前就设置了
        this.bunchFinish=false;
        this.bunchInfo.roomOwner=this.roominfo.owner;        
        this.bunchInfo.roomValue=this.fangKaCfg;
        //console.log("fangKaCfg1",this.fangKaCfg);
        
        //一课特殊计算
        if(this.fangKaCfg.b_yike)
        {
            if(this.bunchInfo.scorefinish){
                this.bunchFinish=true;
            }
        }
        else
        {
            if(this.roundindex == this.fangKaCfg.v_roundcount){
                this.bunchFinish=true;
            }
        } 
        BunchInfoMgr.getInstance().setBunchInfo(this.bunchInfo);
        BunchInfoMgr.getInstance().setRoomId(this.roominfo.password);
		return false;
    }    
    connector_entryHandler_enterRoom(msg)
    { 
        console.log("connector_entryHandler_enterRoom",JSON.stringify(msg))
        this.b_bunchStarted=msg.bunchStarted;
        this.bwatch=msg.bwatch;
        this.updateBunchInfo(msg.bunchInfo);
        this.updateRoomUsers(msg); 
        this.startYaYaSdk(); 
        this.offlineAutoDisRoomTickTime=msg.offlineAutoDisRoomTickTime;//离线自动应答解散剩余时间
        this.onlineAutoDisRoomTickTime=msg.onlineAutoDisRoomTickTime;//在线自动应答解散剩余时间
        this.bGameIsStarted=msg.gamestarted; 
        this.m_applySeats={};
        if(msg.applyseatId!=null)
        {
            this.m_applyDissolutionSeatId=msg.applyseatId; 
            for(let key in msg.applySeats)
            {
                let seatid=parseInt(key);
                this.m_applySeats[seatid]=msg.applySeats[seatid];
            } 
            this.start_sub_module(G_MODULE.ApplyDisbandRoom);//弹出申请解散
        }
        
    }
    room_roomHandler_nextRound(msg)
    {
        this.updateRoomUsers(msg);   
    }
    reqCreateFangKaRoom()
    {
        //创建房卡房间 
        this.send_msg('http.reqCreateFangKaRoom') 
    }

    http_reqCreateFangKaVerify(msg)
    {
        //收到保存成功后就刷新最新的设置   
        this.reqCreateFangKaRoom(); 
    } 
    reqCreateFangKaVerify()
    {  
        if(VerifyMgr.getInstance().checkUnSettled()){//有未恢复的
            return  
        }
        var gameid = BetMgr.getInstance().getGameId()
        var roomRuleInfo = CreateRoomMgr.getInstance().getRoomRuleInfo(gameid)
        var clubid = 0;
        if(this.isInClub())
        {
            //茶馆创建房间才要上传茶馆id
            clubid=CreateRoomMgr.getInstance().getClubId()
        }
        //console.log("roomRuleInfo=",roomRuleInfo)
        var paysource = CreateRoomMgr.getInstance().getClubPaysource()
        //钻石数量判定
        if(paysource == 2 && clubid ){
            let clubGold = VerifyMgr.getInstance().checkClubGold(clubid,roomRuleInfo.v_fangfei)
            if(!clubGold){
                FrameMgr.getInstance().showTips("茶馆钻石不足");
                return;
            }
            //console.log('这是公费创建房间')
        }else{
            let costJudge = VerifyMgr.getInstance().checkGold(roomRuleInfo.v_fangfei)
            if (!costJudge) {
                let okcb = function () {
                    this.start_sub_module(G_MODULE.Shop);
                }
                FrameMgr.getInstance().showDialog("钻石不足，是否前往充值？", okcb, "钻石不足", null);
                return;
            }
            //console.log('这是自费创建房间')
        }
        //roomRuleInfo.v_seatcount = 2;
        // roomRuleInfo.v_roundcount = 1;
        if (gameid == 13) {
            if (roomRuleInfo.v_extendRule == 3) {
                if (!this.sssPeihua(roomRuleInfo)) {
                    let text = "配花数量不足"
                    FrameMgr.getInstance().showTips(text, null, 35, cc.color(255, 0, 0), cc.p(0, 0), "Arial", 1500);
                    return
                }
            } else {
                roomRuleInfo.v_allotFlowerData = [1, 1, 1, 1]
            }
        }

        var msg = {
            'gameid': gameid,
            'roomvalue': roomRuleInfo,
            'clubid': clubid,
            'paysource': paysource,
        }
        //console.log('创建包厢上传数据', msg)
        this.send_msg('http.reqCreateFangKaVerify',msg)
        //清除茶馆信息
        CreateRoomMgr.getInstance().setProperty(1, "paysource");
        CreateRoomMgr.getInstance().setProperty(0, "clubId");
        //上次开房的选项记录存入本地
        let gameCode = GameCateCfg.getInstance().getGameById(gameid).code;
        // let gameRuleName = gameCode + 'RoomRuleInfoGroups';
        let roomRuleInfoGroups = CreateRoomMgr.getInstance().getInfoGroups(gameid)
        roomRuleInfoGroups[LoginMgr.getInstance().getUid().toString()] = roomRuleInfo;
        // cc.sys.localStorage.setItem(gameRuleName, JSON.stringify(roomRuleInfoGroups));
        LocalStorage.getInstance().setRoomRuleInfoGroups(gameCode, roomRuleInfoGroups);
        //console.log('存入本地的数据', roomRuleInfo) 
        //构造一个房卡cfg,免得后续请求
        let localFangKaCfg=JSON.stringify(roomRuleInfo);
        let localMsg={
            cfg:{
                gameid:gameid,
                clubid:clubid,
                cfg:localFangKaCfg,
            }
        }
        this.http_reqFangKaCfg(localMsg);
    }
    //大菠萝配花数量判定
    sssPeihua(roomRuleInfo){
        if(roomRuleInfo.v_extendRule == 3){
            let isOK = false;
            let peiHuaCount = 0;
            let peiHuaData = roomRuleInfo.v_allotFlowerData
            for(let i = 0;i<peiHuaData.length;i++){
                peiHuaCount+=peiHuaData[i];
            }
            if(roomRuleInfo.v_seatcount <= 4){
                isOK = peiHuaCount==4?true:false;
            }else{
                isOK = peiHuaCount==roomRuleInfo.v_seatcount?true:false;
            }
            return isOK;
        }
        
    }
    startYaYaSdk () {
        let userinfo = UserMgr.getInstance().getMyInfo();
        
        //console.log("startYaYaSdk",userinfo.id, userinfo.nickname, this.rid)
   
		YySdkMgr.getInstance().InitYaYaSdk(userinfo.id, userinfo.nickname, this.rid, "1");
    }
    //单例处理
    private static _instance:RoomMgr
    public static getInstance ():RoomMgr{
        if(!this._instance){
            this._instance = new RoomMgr();
        }
        return this._instance;
    }
    
}
