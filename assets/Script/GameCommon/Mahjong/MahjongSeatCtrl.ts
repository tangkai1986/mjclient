/*
author: JACKY
日期:2018-01-11 18:49:15
*/ 


import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import BaseView from "../../Plat/Libs/BaseView";
import BaseModel from "../../Plat/Libs/BaseModel";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";  

import UiMgr from "../../Plat/GameMgrs/UiMgr";
import QuickAudioCfg from "../../Plat/CfgMgrs/QuickAudioCfg";
import UserMgr from "../../Plat/GameMgrs/UserMgr";
import { MahjongDef } from "./MahjongDef";
import SwitchMgr from "../../Plat/GameMgrs/SwitchMgr";
import GEventDef from "../../Plat/GameMgrs/GEventDef";
 
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : MahjongSeatCtrl;
//模型，数据处理
class Model extends BaseModel{
	seatid=null;//视图座位
	uid=null; 
	logicseatid=null;//逻辑座位，服务器那边的座位
	userinfo=null;
	hucount=0;
	player=null;
	isZhuangJia=false;//庄家标记
	lianzhuang=0;//连庄次数
	voiceState=null;
	score=0;
	
	// isMaster=false;//房主标记
	cheatList = [false,false,false]; //3种作弊检测	
	mahjongResMgr=RoomMgr.getInstance().getResMgr();
	mahjongLogic=RoomMgr.getInstance().getLogic();
	mahjongDef=RoomMgr.getInstance().getDef();
	mahjongAudio=RoomMgr.getInstance().getAudio();
	ipWarnning=false;//ip警告
	distWarnning=false;//距离警告
	waiguaWarnning=false;//外挂警告
	prepared=false;	
	public RealTimeSpeechSwitch = null;//实时语音开关
	constructor()
	{
		super();		
		this.RealTimeSpeechSwitch = SwitchMgr.getInstance().get_switch_real_time_speech();
		this.updateVoiceState();
	}
	updateSwitch(msg){
        this.RealTimeSpeechSwitch = msg.cfg.switch_real_time_speech; 
    }    
	updatePrepared(  )
	{
		// body
		this.prepared=RoomMgr.getInstance().preparemap[this.logicseatid]  
	} 
	initSeat(id)
	{
		this.seatid=id;  
	}
    //找到屏幕拥有者的逻辑坐标  
	clear(  )
	{
		// body
		this.uid=null;
	}
    updateCheatInfo(){
		this.ipWarnning=RoomMgr.getInstance().getIpWarnningBySeatId(this.logicseatid);
		this.distWarnning=RoomMgr.getInstance().getDistWarnningBySeatId(this.logicseatid)
	}
    
	//更新声音状态
	updateVoiceState(){ 
		this.voiceState=RoomMgr.getInstance().getVoiceState(this.logicseatid);
	}
	//更新逻辑id
	updateLogicId(  )
	{
		// body
		this.logicseatid=RoomMgr.getInstance().getLogicSeatId(this.seatid);  
		if(this.logicseatid==null)
			return;
		this.player=this.mahjongLogic.getInstance().players[this.logicseatid]; 
		this.uid=RoomMgr.getInstance().users[this.logicseatid];  
		//console.log("this.logicseatid=",this.logicseatid,"this.uid=",this.uid) 
		this.voiceState=RoomMgr.getInstance().getVoiceState(this.logicseatid);
	} 
	//更新用户信息
	updateUserInfo() 
	{ 
		this.userinfo=UserMgr.getInstance().getUserById(this.uid); 
		//console.log("this.userinfo=",this.userinfo,"this.uid=",this.uid)	
	}
	updateScore()
	{
		let roomvalue=RoomMgr.getInstance().getFangKaCfg()
		let bunchInfo=RoomMgr.getInstance().getBunchInfo()
		if(bunchInfo==null)
		{ 
			if(roomvalue.b_yike){
				this.score=bunchInfo.scores[this.logicseatid]; 
			}
			else{
				this.score=0
			}
		}
		else
		{
			if(roomvalue.b_yike){ 
				this.score=bunchInfo.scores[this.logicseatid]; 
			} 
			else
			{
				//console.log("重新获取玩家的信息",bunchInfo)
				let leijiItem=bunchInfo.leiji[this.logicseatid];
				this.score=leijiItem.zongshuying; 
			}
		}
	}
	//更新庄家标记
	updateZhuang()
	{ 
		//第一局的时候庄家标记是根据定庄来定的
		this.isZhuangJia=this.mahjongLogic.getInstance().zhuangseat==this.logicseatid;
		this.lianzhuang=0;
		if(this.isZhuangJia)
		{
			if(RoomMgr.getInstance().isFirstRound())
			{
				this.lianzhuang=0;
			}
			else{
				this.lianzhuang=RoomMgr.getInstance().getBunchInfo().lianzhuang;
			}
		}
	}
	recover()
	{
		this.updateVoiceState();
		this.updateZhuang();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		img_frame:null,//头像背景
		img_head:null,//头像
		lbl_score:null,//昵称 
		img_zhuang:null,//庄家标记
		img_gps:null,//gps图标
		img_ip:null,//ip图标
		img_cheat:null,//ip图标
		img_voicestate:null,//声音状态
		lbl_lianzhuang:null,//连庄标记
		node_lianzhuang:null,//连庄标记
		node_prepared:null,//准备的标志
		node_chat:null,//玩家快捷聊天节点
		node_voice:null,//玩家语音聊天节点
		playTime:null,//语音播放时间
		bg_chat:null,
		img_exp:null,
		lab_chat:null,
		ExpressionAtlas:null,
	};
	zhuang_originpos=null
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node; 
		this.initUi();
	}
	//初始化ui
	initUi()
	{
		this.ui.node_prepared=ctrl.node_prepared;
		this.ui.img_frame=ctrl.img_frame;
		this.ui.img_head=ctrl.img_head;
		this.ui.lbl_score=ctrl.lbl_score; 
		this.ui.img_zhuang=ctrl.img_zhuang;
		this.ui.img_gps=ctrl.img_gps;
		this.ui.img_ip=ctrl.img_ip;
		this.ui.img_cheat=ctrl.img_cheat;
		this.ui.img_voicestate=ctrl.img_voicestate;
		this.showSwitch();
		this.updateVoiceState();
		this.ui.lbl_lianzhuang=ctrl.lbl_lianzhuang;
		this.ui.node_lianzhuang=ctrl.node_lianzhuang;//连庄
		this.ui.lbl_score.string=this.model.score;//总输赢
		this.ui.lbl_lianzhuang.string=this.model.lianzhuang;//总输赢
		this.ui.node_chat=ctrl.node_chat;//快捷聊天
		this.ui.node_voice=ctrl.node_voice;//语音聊天
		this.ui.playTime=ctrl.playTime;//语播波放时间
		this.ui.img_exp=ctrl.img_exp;
		this.ui.lab_chat=ctrl.lab_chat;
		this.ui.ExpressionAtlas=ctrl.ExpressionAtlas;
		this.ui.node_chat.active = false;
		this.ui.node_voice.active = false;
		this.ui.node_prepared.active=false;
		this.ui.bg_chat = this.ui.node_chat.getChildByName('chat_background').getChildByName('background') 
		this.zhuang_originpos= this.ui.img_zhuang.getPosition();		
		this.clear();
	}
	showSwitch(){
		this.ui.img_voicestate.active = this.model.RealTimeSpeechSwitch == 1?true:false;
		if(this.model.seatid == 0){
			this.ui.img_voicestate.active = false;
		}
    }
	updatePrepared()
	{ 
		this.ui.node_prepared.active=this.model.prepared;
	}  
	//清除
	clear( )
	{
		this.node.active=false;
		this.ui.img_zhuang.active=false;
		this.ui.img_zhuang.position=this.zhuang_originpos;
		this.ui.img_voicestate.active=false; 
		this.ui.lbl_score.string="" 
		this.ui.img_ip.active=false;
		this.ui.img_gps.active=false;
		this.ui.img_cheat.active=false; 
		this.ui.node_lianzhuang.active=false;
	} 
	updateZhuang()
	{
		this.ui.img_zhuang.active=this.model.isZhuangJia
	    
	   	this.ui.node_lianzhuang.active=this.model.lianzhuang>0  
	   	this.ui.lbl_lianzhuang.string=this.model.lianzhuang;
	}
    moveZhuang () {
        let pos = this.ui.img_zhuang.getPosition();
        // let worldPos = this.ui.img_zhuang.parent.convertToNodeSpace(cc.v2(640,400))
        // this.ui.img_zhuang.setPosition(worldPos);
        // this.ui.img_zhuang.runAction(cc.moveTo(0.5,pos), cc.callFunc(()=>{
        //     this.ui.img_zhuang.setPosition(pos);
        // }));
    }
	updateInfo()
	{ 
		this.node.active=true;
		let userinfo=this.model.userinfo
		if(!userinfo) return;
		//console.log("更新头像id=",userinfo)
        UiMgr.getInstance().setUserHead(this.ui.img_head, userinfo.headid, userinfo.headurl);		
	} 
	updateScore(){
		this.ui.lbl_score.string=this.model.score;//分数
	}
	updateVoiceState(){
		//暂时关闭头像声音状态显示		
		if(1)
		{
			return;
		}
		//状态1表示全开，2表示全关，3表示开语音关麦克风
		let statepic={1:'img_shuohua',2:"img_bofang",3:"img_voice_close"};
		let pic=statepic[this.model.voiceState]; 
		if(pic)
		{ 
			cc.loader.loadRes(`Plat/GameRoomCommon/RoomUi/${pic}`, cc.SpriteFrame, (err, sprite)=>{
				if (err) return cc.error(`no find Icons/${pic}`);
				this.ui.img_voicestate.active=true;
				if(this.model.seatid==0) {
					this.ui.img_voicestate.active=false;
				}
				if(cc.isValid(this.ui.img_voicestate) && this.ui.img_voicestate) {
					this.ui.img_voicestate.getComponent(cc.Sprite).spriteFrame=sprite;
				}
			}); 		    
		}
		else{
			this.ui.img_voicestate.active=false;
		}
	}
	updateCheat(){
		if(this.model.ipWarnning)
		{
			this.ui.img_ip.active=true;
		}
		if(this.model.distWarnning)
		{
			this.ui.img_gps.active=true;
		}
	}
	hidePrepareFlag(){
		this.ui.node_prepared.active=false;
	}
	addChatMsg(){

	}
}
//c, 控制
@ccclass
export default class MahjongSeatCtrl extends BaseCtrl {
	//这边去声明ui组件
    @property
    seatId:Number = 0;
    @property(cc.Node)
    img_frame = null;
    @property(cc.Node)
    img_head = null; 
    @property(cc.Label)
    lbl_score = null; 
    @property(cc.Node)
	img_zhuang = null; 
	@property(cc.Node)
	img_gps = null;
	@property(cc.Node)
	img_ip = null;
	@property(cc.Node)
	img_cheat = null;
	@property(cc.Node)
	img_voicestate=null;
    @property(cc.Label)
    lbl_lianzhuang = null;//连庄次数
	@property(cc.Node)
	node_lianzhuang=null;
	@property(cc.Node)
	node_prepared=null;//已准备的按钮
	@property(cc.Node)
	node_chat=null;
	@property(cc.Node)
	node_voice=null;
	@property(cc.Label)
	playTime=null;
	@property(cc.Sprite)
	img_exp=null;
	@property(cc.Label)
	lab_chat=null;
	@property({
		tooltip : "表情图集",
		type : cc.SpriteAtlas
	})
	ExpressionAtlas : cc.SpriteAtlas = null;
    // @property(cc.Node)
	// huatong = null;
	// @property(cc.Node)
    // yinliang = null;    
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离
	delay_time=null;

	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		this.initMvc(Model,View); 
		this.model.initSeat(this.seatId);
		//console.log("seatidX",this.isIPhoneX(),this.model.seatid);
		if(this.isIPhoneX()){
			if(this.model.seatid == 0 || this.model.seatid == 3){
				this.view.ui.img_frame.parent.getComponent(cc.Widget).left = 100;
			}else if(this.model.seatid == 1){
				this.view.ui.img_frame.parent.getComponent(cc.Widget).right = 100;
			}
		}else{
			this.view.ui.img_frame.parent.getComponent(cc.Widget).left = 11;
			if(this.model.seatid == 1){
				this.view.ui.img_frame.parent.getComponent(cc.Widget).right = 11;
			}		
		}
		//console.log("widget left",this.view.ui.img_frame.parent.getComponent(cc.Widget).left);
		//console.log("widget right",this.view.ui.img_frame.parent.getComponent(cc.Widget).right);
	}
	isIPhoneX () {
        let size = cc.view.getFrameSize();
        //console.log("设备 size", size)
        if(
            cc.sys.isNative && cc.sys.platform == cc.sys.IPHONE
			&& ((size.width == 2436 && size.height == 1125) 
			||(size.width == 1125 && size.height == 2436))
			// size.width == 812 && size.height == 375
        ) {
            return true;
        }
        return false;
    }
	clearTimer(){
		if(this.delay_time!=null)
		{
			clearTimeout(this.delay_time);
		}
		this.delay_time=null;
	}
	onDestroy(){
		this.clearTimer();
		super.onDestroy();
	}
	//定义网络事件
	defineNetEvents()
	{
        this.n_events={
			//网络消息监听列表
			'onEnterRoom':this.onEnterRoom,
			'onLeaveRoom':this.onLeaveRoom,
			onSyncData:this.onSyncData, 
			'onStartGame':this.onStartGame,
			onProcess:this.onProcess,
			'onPrepare':this.onPrepare, 
			'onCancelPrepare':this.onCancelPrepare,
			'http.reqUsers':this.http_reqUsers,
			'http.reqCheating' : this.http_reqCheating, 
			'onVoiceStateChanged':this.onVoiceStateChanged,
            'http.reqSettle':this.http_reqSettle, 
            'onReEnterRoom':this.onReEnterRoom, 
			'room.roomHandler.nextRound':this.room_roomHandler_nextRound,  
			'onRoomChat':this.onRoomChat,  
			'http.reqGameSwitch':this.http_reqGameSwitch,
        } 
	}
	http_reqGameSwitch(msg){
		this.model.updateSwitch(msg);
        this.view.showSwitch();
	}
	onReEnterRoom(msg){
		if(this.model.logicseatid==null)
			return;
		this.model.updatePrepared();
		this.view.updatePrepared(); 
	}
	room_roomHandler_nextRound(msg){
		if(this.model.logicseatid!=RoomMgr.getInstance().getMySeatId())
			return;
		this.model.updatePrepared();
		this.view.updatePrepared(); 
	}
	//定义全局事件
	defineGlobalEvents()
	{  
		//全局消息
		this.g_events={ 
			'usersUpdated':this.usersUpdated,  
			"voice_PlayRecordedFileOk":this.onPlayRecordedFile,
			"voice_PlayRecordedFileCompleteOk":this.onPlayRecordedFileComplete,
			"EnterBackground":this.EnterBackground,
			"EnterForeground":this.EnterForeground,
		}
	}   
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image,this.ui.img_head,this.showUserDetail,'点击显示用户详情')      
	}
	start () {
	}
	onStartGame(msg)
	{
		if(this.model.logicseatid==null)
			return;
		this.view.hidePrepareFlag();
	}
	onCancelPrepare(msg)
	{
		if(this.model.logicseatid==null)
			return;
		this.model.updatePrepared();
		this.view.updatePrepared(); 
	}
	onPrepare(msg)
	{
		if(this.model.logicseatid==null)
			return;
		this.model.updatePrepared();
		this.view.updatePrepared(); 
	}
	http_reqSettle(){
		if(this.model.logicseatid==null)
			return;
		this.model.updateScore();
		this.view.updateScore(); 
	}
	//网络事件回调begin
 
	onSyncData(msg)
	{
		//增加各种位置数据恢复
		this.model.initSeat(this.seatId);
	    this.model.updateLogicId();
		if(this.model.logicseatid==null)
			return; 
		this.model.recover();
		this.view.updateZhuang();
		this.ui.node_voice.active = false;
	} 
	onProcess(msg)
	{ 
		// if(this.model.logicseatid==null)
		// 	return
		if (msg.process==MahjongDef.process_dingzhuang)
		{
			this.onSyncData();
			this.process_dingzhuang(msg); 
		}  
		else if (msg.process==MahjongDef.process_ready)
		{
			this.onSyncData();
			this.process_ready(msg); 
		}   
		else if (msg.process==MahjongDef.process_fapai ){  
			this.onSyncData();
			if(RoomMgr.getInstance().getVideoMode())
			{
				//录像模式下发牌时确定了庄家
				this.process_dingzhuang(msg); 
			}
		}
 
	} 
	process_ready(msg)
	{
		if(this.model.logicseatid==null)
			return;
		//更新庄家标记
		if(!RoomMgr.getInstance().isFirstRound())
		{
			this.model.updateZhuang();
			this.view.updateZhuang();
		}
	} 
	onVoiceStateChanged(msg)
	{		
		if (this.model.logicseatid!=msg.seatid){ 
			return;
		}  
		//console.log("更改了声音显示=",msg)
		this.model.updateVoiceState();
		this.view.updateVoiceState();
	}
	usersUpdated(msg)
	{
		//console.log("收到全聚德usersUpdated")
		// body
		this.model.initSeat(this.seatId);
	    this.model.updateLogicId();
	    this.view.clear(); 
		this.model.recover();
		this.view.updateZhuang();

	    if(this.model.logicseatid==null)
	   		return;
	   
		this.model.updateVoiceState();
		this.view.updateVoiceState();
	} 
	process_dingzhuang(msg)
	{
		// body  
	    if(this.model.logicseatid==null)
			return;
		this.model.updateZhuang();
		this.view.updateZhuang(); 
        this.view.moveZhuang();
	} 
 
	onLeaveRoom(msg){ 
		if (this.model.logicseatid!=msg.seatid){ 
			return;
		}  
		this.model.clear(); 
		this.view.clear();		 
	}
	onEnterRoom(msg){ 
		this.onSyncData();
		this.model.updateZhuang();
		this.view.updateZhuang(); 
		if (this.model.logicseatid !=msg.seatid){ 
			return;
		}  
		this.model.uid=msg.user;
		this.model.updateVoiceState();
		this.view.updateVoiceState();	
			
	}
	http_reqCheating(msg){
		if(this.model.logicseatid==null)
			return;
		//自己的位置也不显示作弊信息
		if(this.model.logicseatid==RoomMgr.getInstance().getMySeatId())
			return;
		this.model.updateCheatInfo();
		this.view.updateCheat();
	}
	onRoomChat(msg){
		let id = msg.id;
		let seatId = msg.seatid;
		let type = msg.type;
		if(seatId != this.model.logicseatid){
			return
		}
		this.ui.node_chat.active = true;
		if(type == 1){//文本
			this.ui.img_exp.node.active = false;
			this.ui.lab_chat.node.active = true;
			let list = QuickAudioCfg.getInstance().getCfg()
			let value = list[id-1].text;
			this.ui.lab_chat.string = value;
			this.ui.bg_chat.width = this.ui.lab_chat.node.width+30;
			let sex = this.model.userinfo.sex; 
			QuickAudioCfg.getInstance().play(id,sex)
		}else if(type == 2){//表情
			this.ui.lab_chat.node.active = false;
			this.ui.img_exp.node.active = true;
			this.ui.img_exp.spriteFrame = this.ui.ExpressionAtlas.getSpriteFrame(id);
			this.ui.bg_chat.width = 50;
		}
		this.clearTimer(); 
		this.delay_time=setTimeout(() => {
			this.clearTimer(); 
            this.node_chat.active = false;
        }, 2000);
	}
	//end
	//全局事件回调begin
	// 播放语音回调
    onPlayRecordedFile(){
		//获取当前录音数据信息
		let curVoice=RoomMgr.getInstance().curPlayingVoiceData;	
		if(!curVoice)
		{
			//如果没有当前离线语音信息,就不去播放
			return;
		}
		//离线语音座位,如果不是头像拥有者的座位,就不去显示语音动画
		let seatId = curVoice.seatid; 
		if(seatId != this.model.logicseatid){
			return
		}	
		this.ui.node_voice.active = true;
		this.view.ui.playTime.string = Math.floor(curVoice.data.length) + "'";
    }
    //播放完成回调
    onPlayRecordedFileComplete()
    {	 
		this.ui.node_voice.active = false;
	}
	EnterBackground () {
        this.ui.node_voice.active = false;
	}
	EnterForeground () {
		this.ui.node_voice.active = false;
	}
	//end
	//按钮或任何控件操作的回调begin
	//end

	http_reqUsers(  ){
	// body 
		//console.log("获取了用户=",this.model.uid)
		if(this.model.uid==null){ 
			return;
		}
		this.model.updateUserInfo(); 
		this.view.updateInfo(); 
		this.model.updateScore();
		this.view.updateScore();
	}
 
	showUserDetail(  )
	{
		// body
		if (this.model.uid!=null){ 
			var ctrl=this.start_sub_module(G_MODULE.RoomUserInfo, (uiCtrl)=>{ 
			 
                uiCtrl.setUid(this.model.uid);
            },'RoomUserInfoCtrl')
		}
	} 
}
