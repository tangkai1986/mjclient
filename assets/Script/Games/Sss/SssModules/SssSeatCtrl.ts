import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseModel from "../../../Plat/Libs/BaseModel";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import UserMgr from "../../../Plat/GameMgrs/UserMgr";
import UiMgr from "../../../Plat/GameMgrs/UiMgr";
import { SssDef } from "../SssMgr/SssDef";
import SssLogic from "../SssMgr/SssLogic";
import QuickAudioCfg from "../../../Plat/CfgMgrs/QuickAudioCfg";
import SwitchMgr from "../../../Plat/GameMgrs/SwitchMgr";

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: SssSeatCtrl;
//模型，数据处理
class Model extends BaseModel {
	myPrepared = null;
	roomInfo = null;
	seatId = null;//视图座位
	logicSeatId = null;//逻辑座位，服务器那边的座位
	uid = null;
	userInfo = null;
	score = 0;
	isWatch = false;
	ipWarnning = false;
	distWarnning = false;
	mySeatId = null;
	voiceState = null;
	sssAudio = RoomMgr.getInstance().getAudio();
	seatType = null;
	public RealTimeSpeechSwitch = null;//实时语音开关
	constructor() {
		super();
		this.uid = ctrl.uid;
		this.seatId = ctrl.seatId;
		this.logicSeatId = RoomMgr.getInstance().getLogicSeatId(ctrl.seatId);
		this.roomInfo = RoomMgr.getInstance().getRoomInfo();
		this.seatType = ctrl.seatType;
		this.RealTimeSpeechSwitch = SwitchMgr.getInstance().get_switch_real_time_speech();
		this.updateVoiceState();
		this.updateUserInfo();
		this.updateScore();
	}
	updateSwitch(msg){
        this.RealTimeSpeechSwitch = msg.cfg.switch_real_time_speech; 
    }   
	updateUserInfo() {
		this.userInfo = UserMgr.getInstance().getUserById(this.uid);
	}

	updateMyPrepared() {
		this.myPrepared = RoomMgr.getInstance().preparemap[this.logicSeatId]
	}

	updateScore() {
		if (RoomMgr.getInstance().getBunchInfo().leiji[this.logicSeatId]) {
			this.score = RoomMgr.getInstance().getBunchInfo().leiji[this.logicSeatId].zongshuying;
		}
	}

	updateCheatInfo() {
		this.ipWarnning = RoomMgr.getInstance().getIpWarnningBySeatId(this.logicSeatId);
		this.distWarnning = RoomMgr.getInstance().getDistWarnningBySeatId(this.logicSeatId);
	}

	updateVoiceState() { 
		this.voiceState = RoomMgr.getInstance().getVoiceState(this.logicSeatId);
	}

	onChangeRoomMaster() {
		this.roomInfo = RoomMgr.getInstance().getRoomInfo();
	}

	clear() { }

	recover() { }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	model: Model;
	ui = {
		//在这里声明ui
		headImg: ctrl.headImg,
		nickNameLbl: ctrl.nickNameLbl,
		scoreLbl: ctrl.scoreLbl,
		lightRing:ctrl.lightRing,
		masterImg: ctrl.masterImg,
		locationImg: ctrl.locationImg,
		plugImg: ctrl.plugImg,
		ipImg: ctrl.ipImg,
		preparFlag: ctrl.preparFlag,
		watchImg: ctrl.watchImg,
		voiceImg: ctrl.voiceImg,
		node_voice:ctrl.node_voice,//玩家语音聊天节点
		playTime:ctrl.playTime,//语音播放时间
	};
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi() {
		this.refreshPreparFlag();
		this.refreshWatchImg();
		this.refreshScoreLbl();
		this.showSwitch();
		if (this.model.seatType) {
			this.ui.watchImg.x = this.node.x > 0 ? -94 : 94;
		} else {
			this.ui.watchImg.y = this.node.y > 0 ? -52 : 52;
		}
		this.ui.voiceImg.node.active = this.model.seatId != 0;
		this.updateVoiceState();
		this.ui.node_voice.active = false;
	}

	refreshPreparFlag() {
		this.ui.preparFlag.active = this.model.myPrepared;
	}

	updateInfo() {
		this.ui.scoreLbl.string = this.model.score.toString();
		this.ui.masterImg.active = this.model.uid == this.model.roomInfo.owner;
		if (this.model.seatId == 0){this.ui.lightRing.active = true;}
		let userinfo = this.model.userInfo;
		if(!userinfo) return;
		this.ui.nickNameLbl.string = userinfo.nickname.length > 4 ? userinfo.nickname.substring(0, 4) : userinfo.nickname;
		UiMgr.getInstance().setUserHead(this.ui.headImg, userinfo.headid, userinfo.headurl);
	}

	refreshScoreLbl() {
		this.ui.scoreLbl.string = this.model.score.toString();
	}

	updateCheat() {
		if (this.model.ipWarnning) {
			this.ui.ipImg.active = true;
		}
		if (this.model.distWarnning) {
			this.ui.locationImg.active = true;
		}
	}
	onChangeRoomMaster() {
		this.ui.masterImg.active = this.model.uid == this.model.roomInfo.owner;
	}

	refreshWatchImg() {
		if (this.model.seatId == 0) return;
		this.ui.watchImg.active = this.model.isWatch;
	}

	updateVoiceState() {
		let img_name = { 1: "img_shuohua", 2: "img_bofang", 3: "img_voice_close" };
		let url = `Plat/GameRoomCommon/RoomUi/${img_name[this.model.voiceState]}`;
		cc.loader.loadRes(url, cc.SpriteFrame, (err, sp) => {
			if (err) return cc.error(`no find Icons/${img_name[this.model.voiceState]}`);
			this.ui.voiceImg.spriteFrame = sp;
		});
	}
	showSwitch(){
		this.ui.voiceImg.node.active = this.model.RealTimeSpeechSwitch == 1?true:false;
		if(this.model.seatId == 0){
			this.ui.voiceImg.node.active = false;
		}
    }

	clear() { }

	recover() { }
}
//c, 控制
@ccclass
export default class SssSeatCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property({
		tooltip: '头像',
		type: cc.Node
	})
	headImg: cc.Node = null;

	@property({
		tooltip: '昵称Lbl',
		type: cc.Label
	})
	nickNameLbl: cc.Label = null;

	@property({
		tooltip: '分数Lbl',
		type: cc.Label
	})
	scoreLbl: cc.Label = null;

	@property({
		tooltip: '光环',
		type: cc.Node
	})
	lightRing: cc.Node = null;

	@property({
		tooltip: '房主标识',
		type: cc.Node
	})
	masterImg: cc.Node = null;

	@property({
		tooltip: "准备标识",
		type: cc.Node
	})
	preparFlag: cc.Node = null;

	@property({
		tooltip: '定位图标',
		type: cc.Node
	})
	locationImg: cc.Node = null;

	@property({
		tooltip: '外挂图标',
		type: cc.Node
	})
	plugImg: cc.Node = null;

	@property({
		tooltip: 'IP图标',
		type: cc.Node
	})
	ipImg: cc.Node = null;

	@property({
		tooltip: "旁观中标识",
		type: cc.Node
	})
	watchImg: cc.Node = null;

	@property({
		tooltip: "声音状态标识",
		type: cc.Sprite
	})
	voiceImg: cc.Sprite = null;

	@property(cc.Node)
	node_voice=null;
	@property(cc.Label)
	playTime=null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离
	seatId: Number;
	uid: Number;
	model: Model;
	view: View;
	seatType: number;

	onLoad() {
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model, View);
		UserMgr.getInstance().reqUsers([this.model.uid]);
	}

	//定义网络事件
	defineNetEvents() {
		this.n_events = {
			"onPrepare": this.onPrepare,
			"onStartGame": this.onStartGame,
			"onLeaveRoom": this.onLeaveRoom,
			"http.reqUsers": this.http_reqUsers,
			'room.roomHandler.nextRound': this.room_roomHandler_nextRound,
			onSyncData: this.onSyncData,
			onMidEnter: this.onMidEnter,
			'http.reqCheating': this.http_reqCheating,
			onChangeRoomMaster: this.onChangeRoomMaster,
			'onVoiceStateChanged':this.onVoiceStateChanged,
			'http.reqGameSwitch':this.http_reqGameSwitch,
		}
	}
	//定义全局事件
	defineGlobalEvents() {
		//全局消息
		this.g_events = {
			'sss_roundEnd': this.sss_roundEnd,
			"voice_PlayRecordedFileOk":this.onPlayRecordedFile,
			"voice_PlayRecordedFileCompleteOk":this.onPlayRecordedFileComplete,
			"EnterBackground":this.EnterBackground,
			"EnterForeground":this.EnterForeground,
		}
	}
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
		if(seatId != this.model.logicSeatId){
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
	//绑定操作的回调
	connectUi() {
		this.connect(G_UiType.image, this.node, this.showUserDetail, '显示用户详情')
	}
	start() {

	}
	//网络事件回调begin
	http_reqGameSwitch(msg){
		this.model.updateSwitch(msg);
        this.view.showSwitch();
	}
	onPrepare(msg) {
		if (msg.seatid == this.model.logicSeatId) {
			this.model.updateMyPrepared();
			this.view.refreshPreparFlag();
		}
	}

	onStartGame() {
		this.ui.preparFlag.active = false;
		this.model.isWatch = false;
		this.view.refreshWatchImg();
	}

	http_reqUsers() {
		if (this.model.uid == null) {
			return;
		}
		this.model.updateUserInfo();
		this.view.updateInfo();
		this.model.updateScore();
		this.view.refreshScoreLbl();
		if (!RoomMgr.getInstance().isGameStarted()) {
			this.model.updateMyPrepared();
			this.view.refreshPreparFlag();
		}
	}

	onLeaveRoom(msg) {
		if (this.model.logicSeatId == msg.seatid) {
			this.model.clear();
			this.view.clear();
			// QgmjAudio.getInstance().OtherPlayerLeaveAudio();
			this.finish();
		}
	}

	room_roomHandler_nextRound() {
		this.model.updateMyPrepared();
		this.view.refreshPreparFlag();
	}

	onSyncData(msg) {
		if (!RoomMgr.getInstance().isGameStarted()) {
			this.model.updateMyPrepared();
			this.view.refreshPreparFlag();
		}
	}

	onMidEnter(msg) {
		if (this.model.logicSeatId == msg.seatid) {
			this.model.isWatch = true;
			this.view.refreshWatchImg();
			this.view.refreshScoreLbl();
		}
	}

	http_reqCheating(msg) {
		if (this.model.logicSeatId == null)
			return;
		//自己的位置也不显示作弊信息
		if (this.model.logicSeatId == RoomMgr.getInstance().getMySeatId())
			return;
		this.model.updateCheatInfo();
		this.view.updateCheat();
	}

	onChangeRoomMaster(msg) {
		this.model.onChangeRoomMaster()
		this.view.onChangeRoomMaster()
	}

	onVoiceStateChanged(msg) {
		if(this.model.seatId == 0 || msg.seatid != this.model.logicSeatId) {
			return;
		}
		this.model.updateVoiceState();
		this.view.updateVoiceState();
	}
	//end
	//全局事件回调begin

	sss_roundEnd() {
		if (this.model.logicSeatId != null) {
			this.model.mySeatId = RoomMgr.getInstance().getMySeatId()
			this.model.updateScore();
			this.view.refreshScoreLbl();
			this.model.updateMyPrepared();
			if ((this.model.mySeatId || this.model.mySeatId == 0) && this.model.mySeatId == this.model.logicSeatId) {
				if (this.model.score >= this.ui.scoreLbl.string) {
					this.model.sssAudio.getInstance().playCompareWin()
				}
				else {
					this.model.sssAudio.getInstance().playCompareLose()
				}
			}
		}
	}
	//end
	//按钮或任何控件操作的回调begin
	showUserDetail() {
		if (this.model.uid != null) {
			this.start_sub_module(G_MODULE.RoomUserInfo, (uiCtrl) => {
				uiCtrl.setUid(this.model.uid);
			}, 'RoomUserInfoCtrl')
		}
	}
	//end
	setVidAndUid(obj) {
		this.uid = obj.uid;
		this.seatId = obj.viewID;
		this.seatType = obj.type;
	}
}