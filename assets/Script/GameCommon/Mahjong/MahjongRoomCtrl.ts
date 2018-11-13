/*
author: JACKY
日期:2018-01-11 15:29:26
*/


import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import BaseView from "../../Plat/Libs/BaseView";
import BaseModel from "../../Plat/Libs/BaseModel";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";  
 
 
import YySdkMgr from "../../Plat/SdkMgrs/YySdk";
import FrameMgr from "../../Plat/GameMgrs/FrameMgr";
import BetMgr from "../../Plat/GameMgrs/BetMgr";
import RecordMgr from "../../Plat/GameMgrs/RecordMgr";
import { MahjongDef } from "./MahjongDef";
import ServerMgr from "../../AppStart/AppMgrs/ServerMgr";
import AppInfoMgr from "../../AppStart/AppMgrs/AppInfoMgr";
import MahjongLoder from "../../Plat/GameMgrs/MahjongLoader";
import SettingMgr from "../../Plat/GameMgrs/SettingMgr";
import GameNet from "../../Plat/NetCenter/GameNet";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : MahjongRoomCtrl;
//模型，数据处理
class Model extends BaseModel{ 
	mySeatId=null;
	myPrepared=null;
	myself=null; 
	jin=null; 
	roominfo=null;
	roomvalue=null;
	roundcount:number=0;
	club_id=null;
	mahjongResMgr=RoomMgr.getInstance().getResMgr();
	mahjongLogic=RoomMgr.getInstance().getLogic();
	mahjongDef=RoomMgr.getInstance().getDef();
	mahjongAudio=RoomMgr.getInstance().getAudio();
	
	mahjongCards=this.mahjongLogic.getInstance().getMahjongCards();	
	//通用
	paytypeList=["房主支付","AA支付"];
	//福州
	fangfu=["放胡双倍单赔","放胡单赔","放胡全赔"];
	//龙岩
	jinxianzhi=["金牌不限制游金","双金必须游金","单金必须游金，双金必须游金"];
	constructor()
	{
		super();
		this.roominfo=RoomMgr.getInstance().roominfo;
		console.log("this.roominfo",this.roominfo)
		if(this.roominfo.roomtype==2||this.roominfo.roomtype==3)
		{
			this.roomvalue=RoomMgr.getInstance().getFangKaCfg();
		} 
		let gameid = BetMgr.getInstance().getGameId();
		if(gameid != 1)
		{
			SettingMgr.getInstance().setProperty(false, 'musicInfo', 'bTopolectSwitch');
			////console.log("mahjonggameid",gameid);
		}		
	}
	updateMyInfo(  )
	{
		// body 
		this.mySeatId=RoomMgr.getInstance().getMySeatId();
		this.myPrepared=RoomMgr.getInstance().preparemap[this.mySeatId] 
	 
		this.myself=this.mahjongLogic.getInstance().players[this.mySeatId]
	}  
 
	updateMyPrepared(  )
	{
		// body
		this.myPrepared=RoomMgr.getInstance().preparemap[this.mySeatId]  
	} 
 
	clear(  )
	{ 
	}  
	recover(  )
	{
		// body
		this.clear(); 
	}
	
 
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui 
		btn_prepare:null,
		btn_cancelprepare:null,
		btn_invite:null,
		//剩余牌数
		lbl_cardcount:null,  
		panel_cardcount:null,
		btn_zhanji:null,
		node_majiangs:null, 
		btn_fapaiGm:null, 
		btn_setting:null, 
		btn_switchCardWithWall:null, 
		btn_chat:null,
		//游戏规则
		btn_gameRule:null,
		node_effects:null,
		btn_maikefen:null,
		img_grayLayer:null,
		btn_lastSettle:null, 
		Node_myseat:null,
		panel_videoPlay:null, 
		btn_refreshNet:ctrl.btn_refreshNet,
	}; 
	prefabnames=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.ui.Node_myseat=ctrl.Node_myseat;
		if(this.model.mahjongCards.getCardCount()==13) {
			let myseatPos = this.ui.Node_myseat.getPosition();
			this.ui.Node_myseat.setPosition(myseatPos.x,myseatPos.y-40);
		} 
		this.initUi(); 
	}
	updateInviteBtn(){
		if(RoomMgr.getInstance().isFirstRound())
		{
			this.ui.btn_invite.active=!RoomMgr.getInstance().isRoomFull();
		}
	}
	//初始化ui
	initUi()
	{  
		this.ui.btn_prepare=ctrl.btn_prepare; 
		this.ui.btn_cancelprepare=ctrl.btn_cancelprepare; 
		this.ui.btn_invite=ctrl.btn_invite; 
		this.ui.btn_prepare.active=false;
		this.ui.btn_invite.active=false;
		this.ui.btn_cancelprepare.active=false;
		//设置
		this.ui.btn_setting=ctrl.btn_setting; 
		this.ui.btn_chat=ctrl.btn_chat; 
		this.ui.btn_switchCardWithWall=ctrl.btn_switchCardWithWall;
		this.ui.btn_fapaiGm=ctrl.btn_fapaiGm; 
		this.ui.lbl_cardcount=ctrl.lbl_cardcount;
		//剩余牌数
		this.ui.panel_cardcount=ctrl.panel_cardcount; 
	    //战绩
		this.ui.btn_zhanji=ctrl.btn_zhanji;
		this.ui.node_majiangs=ctrl.node_majiangs;
	    //游戏规则
		this.ui.btn_gameRule = ctrl.btn_gamerule 
        this.ui.btn_maikefen = ctrl.btn_maikefen;
        this.ui.img_grayLayer = ctrl.img_grayLayer;
		this.ui.btn_lastSettle = ctrl.btn_lastSettle;
		this.ui.btn_lastSettle.active=false;
		this.ui.btn_prepare.active=!this.model.myPrepared  
		this.ui.btn_cancelprepare.active=this.model.myPrepared  
		this.ui.panel_cardcount.active=false
		if(cc.sys.isNative) {
		 	this.ui.btn_switchCardWithWall.active=false;
		 	this.ui.btn_fapaiGm.active=false;
		}
	}
	onnodeeffectsFinished()
	{
		this.ui.img_grayLayer.opacity=0;
	}
    
	updateLeftCardCount(  )
	{ 
		let count=this.model.mahjongLogic.getInstance().getLeftCardCount();
		if(isNaN(count))
		{
			count=0;
		}
		this.ui.lbl_cardcount.string=count;
	} 
 
	recover(  ){
		// body
		this.clear();
	}
 
	//清除
	clear()
	{
		// body 
		this.ui.lbl_cardcount.node.active=false
		this.ui.panel_cardcount.active=false 
		this.ui.btn_lastSettle.active=false;
	}  
    showCardCount(){
		this.ui.lbl_cardcount.node.active=true;
		this.ui.panel_cardcount.active=true;
	}
	showMahjongPrefabs(){
	 
		  
	}
	hideInviteAndPrepare(){
		this.ui.btn_cancelprepare.active=false;
		this.ui.btn_prepare.active=false;
		this.ui.btn_invite.active=false;
	}
	updatelastSettle(flag)
	{
		this.ui.btn_lastSettle.active=false;
	}
 
}
//c, 控制
@ccclass
export default class MahjongRoomCtrl extends BaseCtrl { 
	//这边去声明ui组件
	@property({
		tooltip:"房间规则",
		type:cc.Prefab
	})
	Prefab_MahjongRoomRule:cc.Prefab=null;

	@property(cc.SpriteAtlas)
	Atlas_table=null; 
	   
    //麻将周边资源	
	@property(cc.Node)
	node_majiangs=null;
    @property(cc.Node)
	btn_prepare=null;	

    @property(cc.Label)
	lbl_cardcount=null;  
    @property(cc.Node)
	panel_cardcount=null; 
    @property(cc.Node)
	btn_chat=null;
	@property(cc.Node)
	btn_gamerule=null; 
	@property(cc.Node)
	btn_cancelprepare=null; 
	@property(cc.Node)
	btn_invite=null; 
   
    @property({
		tooltip : "麻将界面设置按钮",
		type : cc.Node
	})
	btn_setting : cc.Node = null;
    @property({
		tooltip : "麻将界面换底牌按钮",
		type : cc.Node
	})
	btn_switchCardWithWall : cc.Node = null;
    @property({
		tooltip : "麻将界面换底牌顺序按钮",
		type : cc.Node
	})
	btn_fapaiGm : cc.Node = null;  
	  
 
     
	@property(cc.Node)
	btn_zhanji=null;   
	
	@property(cc.Node)
	btn_maikefen=null;
 
	Def=null;
	ResMgr=null;
	Logic=null; 

    @property(cc.Node)
    Node_battery=null;
    @property(cc.Node)
	Node_network=null;
    @property(cc.Label)
    Label_curTime=null;
	@property(cc.Node)
	img_grayLayer=null;
    @property({
		tooltip : "上局详情",
		type : cc.Node
	})
	btn_lastSettle : cc.Node = null;    
    @property(cc.Node)
	Node_myseat=null;
	
    @property({
		tooltip : "功能操作集合",
		type : cc.Node
	})
	node_ctrls : cc.Node = null;   
 
    @property(cc.Node)
    btn_refreshNet=null;
	
 

	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;  
		this.initMvc(Model,View); 
        // 初始化网络和电池状态
        if (cc.sys.isNative) {
            G_PLATFORM.getCurNetWorkData()
            G_PLATFORM.getBatteryPercent()
        }
        // 界面时间刷新频率为1秒, 可根据实际情况修改
        this.schedule(this.updateCurDate.bind(this), 1);
        //this.onBatteryChange(40);
		//this.onNetWorkChange({type:"moblie", level:4});
		//非录像模式下的进入房间
		if(RoomMgr.getInstance().getVideoMode())
		{
			this.node_ctrls.active=false;
		} 
		this.ui.btn_prepare.active= false;
		this.model.mahjongResMgr.getInstance().setTableAtlas(this.Atlas_table);
		this.addMahjongPrefabs();
		if(this.isIPhoneX()){
			this.view.ui.btn_chat.getComponent(cc.Widget).right = -540;
		}else{
			this.view.ui.btn_chat.getComponent(cc.Widget).right = -630;
		}
		////console.log("widget right chat", this.view.ui.btn_chat.getComponent(cc.Widget).right);
	} 
	isIPhoneX () {
        let size = cc.view.getFrameSize();
        ////console.log("设备 size", size)
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
	addMahjongPrefabs(){
		//麻将预制体 
		let handcard_0='HandMaJiang3D_0';
		let handcard_1='HandMaJiang3D_1';
		let handcard_2='HandMaJiang3D_2';
		let handcard_3='HandMaJiang3D_3';
		if(this.model.mahjongCards.getCardCount()==13)
		{
			handcard_0='HandMaJiang3D_13_0';
			handcard_1='HandMaJiang3D_13_1';
			handcard_2='HandMaJiang3D_13_2';
			handcard_3='HandMaJiang3D_13_3';
		}
		let op_animPos={
			op_anim0:{x:8,y:-164},
			op_anim1:{x:390,y:40},
			op_anim2:{x:10,y:214},
			op_anim3:{x:-418,y:18},
			Node_effects:{x:0,y:0},
			MahjongOtherStateTip_1:{x:210.1,y:95.5},
			MahjongOtherStateTip_2:{x:-3,y:178},
			MahjongOtherStateTip_3:{x:-217.6,y:95.6},
		}
		let prefamahjongbarr=['MahjongClock3D','MahjongDice','GroupMaJiang3D_0','GroupMaJiang3D_1','GroupMaJiang3D_2','GroupMaJiang3D_3',
		handcard_3,handcard_2,handcard_1,
		'PoolMaJiang3D_2','PoolMaJiang3D_1','PoolMaJiang3D_3','PoolMaJiang3D_0',
		'Hua_0','Hua_1','Hua_2','Hua_3',
		'MahjongMyStateTip','Mahjong_jin',handcard_0,'MahjongEvent','op_anim0','op_anim1','op_anim2','op_anim3',
		'Node_effects','MahjongOtherStateTip_1','MahjongOtherStateTip_2','MahjongOtherStateTip_3']		
		if(RoomMgr.getInstance().getVideoMode())
		{
			let name=`VideoPlay` 
			this.ui.panel_videoPlay = MahjongLoder.getInstance().getNode(name)
			if(!this.ui.panel_videoPlay)
			{
				let prefab=MahjongLoder.getInstance().getPrefab(name)
				this.ui.panel_videoPlay = cc.instantiate(prefab); 
			}    
			this.node.addChild(this.ui.panel_videoPlay); 
		}
		else
		{
			this.ui.btn_refreshNet.active=true;
			prefamahjongbarr.insert(0,'MahjongRoomRule');
		} 
		let loadFirstNames=[handcard_0,handcard_1,handcard_2,handcard_3,'Mahjong_jin','MahjongClock3D','Node_effects']
		let loadedDic={}
		//加载剩余的
		let loadOthers=()=>{   
			for(let i=0;i<prefamahjongbarr.length;++i)
			{   
				let prefabName=prefamahjongbarr[i]
				if(loadedDic[prefabName]){
					continue;
				}
				let prefabNode = MahjongLoder.getInstance().getNode(prefabName)
				if(!prefabNode)
				{
					let prefab=MahjongLoder.getInstance().getPrefab(prefabName)
					prefabNode=cc.instantiate(prefab);
				}  
				loadedDic[prefabName]=true; 
				let zorder=i+1;
				prefabNode.setLocalZOrder(zorder);
				let position=op_animPos[prefabName]
				if(position)
				{
					prefabNode.setPosition(cc.p(position.x,position.y))
					this.node.addChild(prefabNode);
				}
				else
				{
					this.ui.node_majiangs.addChild(prefabNode); 
				} 
			} 
		}
		//优先加载准备时候必须显示的
		let firstLoadedCount=0;
		let firstLoadCount=loadFirstNames.length;
		for(let i=0;i<firstLoadCount;++i)
		{  
			let prefabName=loadFirstNames[i]
			 
			let prefabNode = MahjongLoder.getInstance().getNode(prefabName)
			if(!prefabNode)
			{
				let prefab=MahjongLoder.getInstance().getPrefab(prefabName)
				prefabNode=cc.instantiate(prefab);
			} 
			loadedDic[prefabName]=true; 
			if(prefabName=='Node_effects')
			{ 				
				this.ui.node_effects=prefabNode.getComponent('cc.Animation')
				this.ui.node_effects.getComponent('cc.Animation').on('finished', this.view.onnodeeffectsFinished, this);	
				
				this.node.addChild(prefabNode);
			}
			else
			{
				let zorder=prefamahjongbarr.findIdx(prefabName)+1;
				prefabNode.setLocalZOrder(zorder);
				this.ui.node_majiangs.addChild(prefabNode);
			} 
			firstLoadedCount++; 
			if(firstLoadedCount==firstLoadCount)
			{  
				loadOthers()
				if(RoomMgr.getInstance().getVideoMode())
				{ 
					RecordMgr.getInstance().startPlaying();
				}   
				else
				{
					// this.ui.btn_prepare.active= true;
					RoomMgr.getInstance().enterRoom()
				}
			}  
		}	 
	}	
    updateCurDate () {
        let curDate = new Date();
        let hours = curDate.getHours();
        let minutes = curDate.getMinutes();
        this.Label_curTime.string = `${hours<10?"0"+hours:hours}:${minutes<10?"0"+minutes:minutes}`
    }

	onDestroy(){   
        this.unschedule(this.updateCurDate);
		RoomMgr.getInstance().destroy();
		super.onDestroy(); 
	}
	//定义网络事件
	defineNetEvents()
	{
        this.n_events={
			//网络消息监听列表
			'onLeaveRoom':this.onLeaveRoom, 
			'onEnterRoom':this.onEnterRoom, 
			onSeatChange:this.onSeatChange,               
			onSyncData:this.onSyncData,
			onProcess:this.onProcess, 
			'onPrepare':this.onPrepare, 
			'onCancelPrepare':this.onCancelPrepare,
			
			'http.reqSettle':this.http_reqSettle,   
			'onStartGame':this.onStartGame,
			//'onRoomChat':this.onRoomChat,  
            'connector.entryHandler.enterRoom':this.connector_entryHandler_enterRoom,
            'room.roomHandler.nextRound':this.room_roomHandler_nextRound,
		}	
	} 
	
	//定义全局事件
	defineGlobalEvents()
	{
		//全局消息
		this.g_events={
			'usersUpdated':this.usersUpdated,   
            'batteryChange':this.onBatteryChange,
			'networkChange':this.onNetWorkChange,
		} 
	}
	//绑定操作的回调
	connectUi()
	{  
        this.connect(G_UiType.image, this.ui.btn_prepare, this.btn_prepare_cb, '点击准备')
        this.connect(G_UiType.image, this.ui.btn_cancelprepare, this.btn_cancelprepare_cb, '取消准备')
        this.connect(G_UiType.image, this.ui.btn_invite, this.btn_invite_cb, '点击邀请')
		this.connect(G_UiType.image, this.ui.btn_setting, this.btn_setting_cb, '点击设置')
		this.connect(G_UiType.image, this.ui.btn_switchCardWithWall, this.btn_switchCardWithWall_cb, '点击换底牌按钮');
		this.connect(G_UiType.image, this.ui.btn_fapaiGm, this.btn_fapaiGm_cb, '点击改变发牌顺序');
		this.connect(G_UiType.image, this.ui.btn_zhanji, this.btn_zhanji_cb, '点击战绩'); 
		this.connect(G_UiType.image, this.ui.btn_chat, this.btn_chat_cb, '点击聊天');
		this.connect(G_UiType.image, this.ui.btn_gameRule, this.btn_gameRule_cb, '点击房间规则'); 
		this.connect(G_UiType.button, this.ui.btn_lastSettle, this.btn_lastSettle_cb,"点击上局详情"); 
		this.connect(G_UiType.button, this.ui.btn_refreshNet, this.btn_refreshNet_cb,"刷新网络"); 
	}
	btn_refreshNet_cb(){
		GameNet.getInstance().disconnect();//断开网络重新连接,刷新牌面
	}
	room_roomHandler_nextRound(){
		//再来一局
		this.model.clear();
		this.view.clear(); 
		this.view.updatelastSettle(true);
		this.updateMyPrepared();
	}
	connector_entryHandler_enterRoom(msg){
		//每次恢复游戏都是重进房间
		////console.log("connector_entryHandler_enterRoom");
		if(!msg.gamestarted)
		{
			RoomMgr.getInstance().prepare();
		}
		this.model.clear();
		this.view.clear(); 
		this.view.updateInviteBtn();
	}
	onStartGame(){
		this.view.hideInviteAndPrepare();
		if(this.model.roundcount>0){
			RoomMgr.getInstance().reqCheating();//发送反作弊请求
		}		
	}
	start () {   
	}
	btn_cancelprepare_cb(){
		//取消准备
		RoomMgr.getInstance().cancelprepare()
	}
	btn_invite_cb(){
		//邀请好友
		////console.log(RoomMgr.getInstance().getGameName());
		////console.log("btn_invite_cb roominfo",this.model.roominfo);
		////console.log("btn_invite_cb roomvalue",this.model.roomvalue);
		let roomvalue=RoomMgr.getInstance().getFangKaCfg();
		let gameid = BetMgr.getInstance().getGameId();
		let appname=AppInfoMgr.getInstance().getAppName();		
        if (cc.sys.isNative){	
			let rule = '';		
			if(gameid == 1){
				//泉州
				rule = (roomvalue.v_youjintype==0?'暗游':'明游') +' '+ (roomvalue.t_youjin==3?'游金3倍':'游金4倍') +' '+ (roomvalue.v_difen==5?'5底':'8底') +' '+ (roomvalue.b_jinxianzhi==0?'单金不平胡':'双金不平胡');
			}else if(gameid == 5){
				//福州
				rule = this.model.fangfu[roomvalue.v_fangfu] +' '+ (roomvalue.b_qinghunyise==1?'清混一色':'') +' '+ (roomvalue.b_daihuapai==1?'带花牌':'') +' '+ (roomvalue.b_jinlong==1?'金龙':'');
			}else if(gameid == 6){
				//龙岩
				rule = (roomvalue.b_quanzimo==0?'半自摸':'全自摸') +' '+ (roomvalue.t_zhuangfanbei==2?'翻倍':'不翻倍') +' '+ (roomvalue.t_youjin==4?'游金4倍':'游金5倍') +' '+ this.model.jinxianzhi[roomvalue.b_jinxianzhi];
			}
			////console.log("btn_invite_cb rule",rule);	
			let roundcount = '';
			if(roomvalue.v_roundcount == 0){
				roundcount = '一课';
			}else{
				roundcount = roomvalue.v_roundcount + '局';
			}
			////console.log("btn_invite_cb roundcount",roundcount);
			let userArray = Object.keys(RoomMgr.getInstance().users);
			let userNeeds = roomvalue.v_seatcount - userArray.length;
			if(this.model.roominfo.club_id == 0){
				G_PLATFORM.wxShareRoom(G_PLATFORM.WX_SHARE_TYPE.WXSceneSession, `${RoomMgr.getInstance().getGameName()} 房间号:${this.model.roominfo.password} ${userArray.length}缺${userNeeds}`, ` ${roundcount} ${roomvalue.v_seatcount}人 ${this.model.paytypeList[roomvalue.v_paytype]} ${rule}`, this.model.roominfo.password)
			}else{
				if(!this.model.roominfo.no) {
					this.model.roominfo = RoomMgr.getInstance().roominfo;
				}
				G_PLATFORM.wxShareRoom(G_PLATFORM.WX_SHARE_TYPE.WXSceneSession, `${RoomMgr.getInstance().getGameName()} 茶馆ID:${this.model.roominfo.no} ${userArray.length}缺${userNeeds}`, `房间号:${this.model.roominfo.password} ${roundcount} ${roomvalue.v_seatcount}人 茶馆支付 ${rule}`, this.model.roominfo.password)
			}
		}
	}
	onCancelPrepare(msg)
	{
		var viewseatid=RoomMgr.getInstance().getViewSeatId(msg.seatid) 
		if(msg.seatid==this.model.mySeatId){ 
			this.updateMyPrepared();
		} 
	}
	//网络事件回调begin 
	onSyncData(  ){
		// body  
		this.model.recover();
		this.view.recover();
		this.model.updateMyInfo();//更新我的信息
		this.ui.lbl_cardcount.node.active=true
		this.ui.panel_cardcount.active=true
		this.view.updateLeftCardCount(); 
		this.view.hideInviteAndPrepare(); 
	}
	onSeatChange(msg){
		// body
		this.view.updateLeftCardCount(); 
	}
	usersUpdated(){
	    
		this.model.updateMyInfo();//更新我的信息
		this.view.initUi();
		this.updateMyPrepared();//更新我的装备状态
	} 

    // 监听电量变化
    onBatteryChange (msg) {
		cc.log("电量变化？？", msg);
		let proportion = parseInt(msg/10);
		let imageName = "";
		if (6<=proportion) imageName = "dl_1";
		else if (3<=proportion) imageName = "dl_2";
		else imageName = "dl_3";
		// 写法有问题
		// 没有找到游戏内引用游戏外资源的函数
		// 这里先直接loader
		// liquan
		cc.loader.loadRes(`Icons/${imageName}`, cc.SpriteFrame, (err, sprite)=>{
			if (err) return cc.error(`no find Icons/${imageName}`);
			if(cc.isValid(this.Node_battery) && this.Node_battery) {
				let childrens = this.Node_battery.children;
				for (let i=0; i<childrens.length; i++) {
					childrens[i].active = i<proportion;
					(i<proportion)&&(childrens[i].getComponent(cc.Sprite).spriteFrame = sprite);
				}
			}
		});
    }

    // 监听网络变化
    onNetWorkChange (msg) {
        cc.log("网络变化？？", msg);
        let imageName = `${msg.type}_${msg.level}`;
        cc.loader.loadRes(`Icons/${imageName}`, cc.SpriteFrame, (err, sprite)=>{
            if (err) return cc.error(`no find Icons/${imageName}`);
			if(cc.isValid(this.Node_network) && this.Node_network) {
	            this.Node_network.getComponent(cc.Sprite).spriteFrame = sprite;
	        }
        });
    }
	updateMyPrepared(  ){
		// body
		this.model.updateMyPrepared();
		////console.log("游戏开始了没有=",RoomMgr.getInstance().isGameStarted())
		if(RoomMgr.getInstance().isGameStarted())
		{
			this.ui.btn_prepare.active= false;
			this.ui.btn_cancelprepare.active= false; 
		}
		else
		{
			this.ui.btn_prepare.active= !this.model.myPrepared 
			this.ui.btn_cancelprepare.active= this.model.myPrepared 
		}
	}
	
	onPrepare(msg)
	{
		var viewseatid=RoomMgr.getInstance().getViewSeatId(msg.seatid) 
		if(msg.seatid==this.model.mySeatId){ 
			this.updateMyPrepared();
		} 
	}
	http_reqSettle(  ){
		// body 

 		this.start_sub_module(G_MODULE.Settle);//显示结算 
	}
	drawGame(){
		
	}
	onProcess(msg){
		this.view.updateLeftCardCount();
		if (msg.process==MahjongDef.process_kaijin ){ 
            this.process_kaijin();
		}
		else if (msg.process==MahjongDef.process_fapai ){  
			this.view.showCardCount(); 
			this.view.updateLeftCardCount();
		}
		else if( msg.process==MahjongDef.process_ready){ 
			this.process_ready();
		}
		else if (msg.process==MahjongDef.process_dingzhuang){
			this.process_dingzhuang();
		} 
		else if (msg.process==MahjongDef.process_cheatcheck){
			this.process_cheatcheck();
		} 
        else if (msg.process==MahjongDef.process_buhua){ 
            this.process_buhua(msg);
        }
        else if( msg.process==MahjongDef.process_haidilaoyue){ 
            this.process_haidilaoyue(msg);  
        } 
	}
	 
    process_kaijin() {
        this.ui.node_effects.play('MahjongProcess_kaijin');
    }
    process_buhua(msg) {
    	
		////console.log("process_buhua",msg);
        // this.ui.node_effects.play('MahjongProcess_buhua');
    }
    process_haidilaoyue(msg)
    {
        this.start_sub_module(G_MODULE.Fzmjhaidilaoyue);
    }
    process_cheatcheck() {
        this.start_sub_module(G_MODULE.RoomPreventionCheating);
    }
	process_dingzhuang()
	{ 
	}    
	process_ready(){
		// body
        let curDate = new Date();
		////console.log("process_ready",curDate.getTime());
		this.model.clear();
		this.view.clear();
        // 播放开局特效
		this.ui.img_grayLayer.opacity=120;
        // this.ui.node_effects.play();
	}
	onLeaveRoom(msg){
		if(RoomMgr.getInstance().isFirstRound())
		{
			this.view.updateInviteBtn();
		} 
	}
	onEnterRoom(msg)
	{
		if(RoomMgr.getInstance().isFirstRound())
		{
			this.view.updateInviteBtn();
		} 
	}
	 

	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private btn_setting_cb () : void {
		 this.start_sub_module(G_MODULE.RoomSetting);
		// let node = cc.instantiate(this.Prefab_Setting);
		// cc.find("Canvas").addChild(node);
	}
	
	private btn_switchCardWithWall_cb(event):void{
		
		this.start_sub_module(G_MODULE.SwitchCardWithWallGm) 
	}
	private btn_fapaiGm_cb(event):void{
		this.start_sub_module(G_MODULE.FaPaiGm)
	}
	
	btn_prepare_cb( ){ 
		RoomMgr.getInstance().prepare()
 
	}  
	btn_help_cb(){ 
		this.start_sub_module(G_MODULE.RoomRule);
	}
 
    btn_chat_cb(){
		this.start_sub_module(G_MODULE.RoomChat); 
	}
 
	btn_zhanji_cb()
	{
		this.start_sub_module(G_MODULE.GambleRecord);
	}
	initWithLibs(Def,ResMgr,Logic)
	{ 
		this.Def=Def;
		this.ResMgr=ResMgr;
		this.Logic=Logic;
	}
 
	btn_gameRule_cb(event){
		this.start_sub_module(G_MODULE.GameRule);
	}
	btn_lastSettle_cb()
	{
		//根据建军要求屏蔽战绩回放按钮
		// let lastindexslash = G_MODULE.Settle.lastIndexOf("/");
		// let scriptName = G_MODULE.Settle.substring(lastindexslash+1,G_MODULE.Settle.length)+"Ctrl";
		// this.start_sub_module(G_MODULE.Settle,function(settleCtrl){
		// 	settleCtrl.setAsViewAgain();
		// },scriptName);//显示结算 
	}
}
