import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import SettingMgr from "../../../Plat/GameMgrs/SettingMgr";
import { SssDef } from "../SssMgr/SssDef";
import SssLogic from "../SssMgr/SssLogic";
import SssResMgr from "../SssMgr/SssResMgr";
import SssAudio from "../SssMgr/SssAudio";
import SssCards from "../SssMgr/SssCards";
import FrameMgr from "../../../Plat/GameMgrs/FrameMgr";
import YySdkMgr from "../../../Plat/SdkMgrs/YySdk";
import LocalStorage from "../../../Plat/Libs/LocalStorage";
import LoaderMgr from "../../../AppStart/AppMgrs/LoaderMgr";
import ServerMgr from "../../../AppStart/AppMgrs/ServerMgr";
import AppInfoMgr from "../../../AppStart/AppMgrs/AppInfoMgr";

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: SssRoomCtrl;
//模型，数据处理
class Model extends BaseModel {
	mySeatId = null;
	roomInfo = null;
	roomValue = null;
	myPrepared = null;
	roundIndex = null;
	posCfg = null;
	myBwatchState = false;
	bTopolect = null;
	tableState = null;
	club_id=null;
	sssAudio = RoomMgr.getInstance().getAudio();
	paytypeList = ["房主支付", "AA支付", "赢家支付"];
	constructor() {
		super();
		this.updateRoomInfo();
		this.updateTableBg();
		this.bTopolect = SettingMgr.getInstance().getMusicInfo().bTopolectSwitch;
		SettingMgr.getInstance().setProperty(false, 'musicInfo', 'bTopolectSwitch');
	}

	updateRoomInfo() {
		this.roomInfo = RoomMgr.getInstance().getRoomInfo();
		this.roomValue = RoomMgr.getInstance().getFangKaCfg();
		this.posCfg = SssDef.seatCfg[this.roomInfo.seatcount];
	}

	updateRoundInfo() {
		this.roundIndex = RoomMgr.getInstance().getRoundIndex();
	}

	updateMySeatId() {
		this.mySeatId = RoomMgr.getInstance().getMySeatId();
	}

	updateMyPrepared() {
		this.myPrepared = RoomMgr.getInstance().preparemap[this.mySeatId]
	}

	onChangeRoomMaster(msg) {
		this.roomInfo = RoomMgr.getInstance().getRoomInfo();
	}

	updateTableBg() {
		this.tableState = LocalStorage.getInstance().getSssRoomBGCfg() || 1;
	}

	clear() { }

	recover() { }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	model: Model;
	ui = {
		//在这里声明ui
		//背景
		bg: ctrl.bg,
		//按钮
		btn_invite: ctrl.btn_invite,
		btn_cleanCard: ctrl.btn_cleanCard,
		btn_prepare: ctrl.btn_prepare,
		btn_gameStart: ctrl.btn_gameStart,
		rule: ctrl.rule,
		chat: ctrl.chat,
		setting: ctrl.setting,
		record: ctrl.record,
		//label
		lbl_roundIndex: ctrl.lbl_roundIndex,
		lbl_roomId: ctrl.lbl_roomId,
		lbl_roundCount: ctrl.lbl_roundCount,
		lbl_extendRule: ctrl.lbl_extendRule,
		lbl_gameRule: ctrl.lbl_gameRule,
		//容器
		seatContain: ctrl.seatContain,
		cardContain: ctrl.cardContain,
		bubblePanel: ctrl.bubblePanel,
		//预制
		pre_seat: ctrl.pre_seat,
		pre_card: ctrl.pre_card,
		pre_bubble: ctrl.pre_bubble,
		//动画
		xipaiAnim: ctrl.xipaiAnim,
		//精灵
		clock: ctrl.clock,
		watchImg: ctrl.watchImg,
		//字体
		lbl_font: ctrl.lbl_font
	};
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
		this.specialTO = null;
		this.animFinished = null;
	}
	//初始化ui
	initUi() {
		this.updateLblContent();
		this.updateTableBg();
	}

	updateLblContent() {
		this.ui.lbl_roomId.string = `房间号：${this.model.roomInfo.password}`;
		this.ui.lbl_roundIndex.string = "第1局";
		this.ui.lbl_roundCount.string = `大菠萝-${this.model.roomInfo.roundcount}局`;
		this.ui.lbl_extendRule.node.active = this.model.roomValue.v_extendRule > 0;
		if (this.model.roomValue.v_extendRule == 3) {
			let data = this.model.roomValue.v_allotFlowerData;
			this.ui.lbl_extendRule.string = `配花：方块${data[0]}/草花${data[1]}/红桃${data[2]}/黑桃${data[3]}`;
		} else if (this.model.roomValue.v_extendRule == 4) {
			this.ui.lbl_extendRule.string = "加一色";
		}
		this.ui.lbl_gameRule[0].node.active = !!(this.model.roomValue.v_crazyField);
		this.ui.lbl_gameRule[1].node.active = !!(this.model.roomValue.v_jokerCard);
		this.ui.lbl_gameRule[2].node.active = !!(this.model.roomValue.v_buyHorse);
		let horseColor = parseInt(this.model.roomValue.v_buyHorseData / 16);
		let horseNumer = this.model.roomValue.v_buyHorseData % 16;
		this.ui.lbl_gameRule[2].string = `买码-${SssDef.cardColor[horseColor]}${SssDef.cardNumber[horseNumer]}`;
	}

	updateRoundInfo() { 
		let roundIndex=this.model.roundIndex + 1
		let roundCount=RoomMgr.getInstance().getFangKaCfg().v_roundcount
		if(roundIndex>=roundCount)
		{
			roundIndex=roundCount
		}
		this.ui.lbl_roundIndex.string = `第${roundIndex}局`; 
	}

	updateClock() {
		let nextReadyTime = SssLogic.getInstance().getNextReadyTime();
		if (nextReadyTime != 0) {
			let curTime = Date.now().toString().substring(4);
			//console.log("当前时间", curTime)
			let loopTime = parseInt((nextReadyTime - curTime) / 1000) + 10;
			//console.log("倒计时从哪里开始", loopTime)
			if (loopTime < 0) loopTime = 10;
			this.startCountDown(loopTime)
		}
	}

	updateInviteBtn() {
		if (SssLogic.getInstance().getBiPaiState()) return;
		// 是否第一局
		let isFirstRound = RoomMgr.getInstance().isFirstRound();
		// 房间是否满人
		let isRoomFull = RoomMgr.getInstance().isRoomFull();
		// 游戏是否开始
		let isGameStarted = RoomMgr.getInstance().isGameStarted();
		// 游戏是否开始
		let isBipai = SssLogic.getInstance().getBiPaiState();
		// 本家准备状态
		let myReadyState = this.model.myPrepared;
		// 本家是否可以显示开始游戏按钮
		let isShowStartBtn = RoomMgr.getInstance().isShowStartBtn();
		this.ui.btn_invite.active = !isRoomFull && !isGameStarted && !isBipai;
		this.ui.btn_cleanCard.active = !isFirstRound && !isGameStarted && !myReadyState && !isBipai;
		this.ui.btn_prepare.active = !isGameStarted && !myReadyState && !isBipai;
		this.ui.btn_gameStart.active = isShowStartBtn;
	}

	hideAllBtn() {
		this.ui.btn_invite.active = false;
		this.ui.btn_cleanCard.active = false;
		this.ui.btn_prepare.active = false;
		this.ui.btn_gameStart.active = false;
	}

	playAnim(animName, delayTime) {
		let anim = this.node.getChildByName("animNode").getComponent(cc.Animation);
		if (this.animFinished) anim.off("finished", this.animFinished, this)
		if (this.playAnimTO) clearTimeout(this.playAnimTO);
		this.animFinished = () => {
			this.playAnimTO = setTimeout(() => {
				this.node.getChildByName("animNode").getComponent(cc.Sprite).spriteFrame = null;
				if (animName == "Sss_bipai") {
					SssLogic.getInstance().send_bipai(0);
				}
			}, delayTime);
			anim.off("finished", this.animFinished, this)
		}
		anim.on("finished", this.animFinished, this);
		anim.play(animName);
	}

	playStartAnim() {
		this.playAnim("Sss_start", 0);
	}

	playXipaiAnim() {
		let animNode = cc.instantiate(this.ui.xipaiAnim);
		this.node.addChild(animNode);
		let anim = animNode.getComponent(cc.Animation);
		let finish = () => {
			ctrl.SssState.shuffling = false;
			animNode.destroy();
			anim.off("finished", finish, this);
		};
		anim.on("finished", finish, this);
		anim.play();
	}

	playBipaiAnim() {
		this.playAnim("Sss_bipai", 0);
		this.model.sssAudio.getInstance().playStartCompare();
	}

	playSpecialCardAnim(type, time) {
		this.playAnim(`specialCard_${type}`, time);
	}

	playQuanleidaAnim() {
		this.playAnim("Sss_quanleida", 0);
	}

	startCountDown(time) {
		this.ui.clock.active = true;
		this.ui.clock.getChildByName('label').getComponent(cc.Label).string = time;
		ctrl.schedule(ctrl.countDown, 1, time);
	}

	unCountDown() {
		ctrl.unschedule(ctrl.countDown);
		this.ui.clock.active = false;
		this.ui.clock.getChildByName('label').getComponent(cc.Label).string = '80';
	}

	updateTableBg() {
		let url = "Games/Sss/common/table_" + this.model.tableState;
		LoaderMgr.getInstance().loadRes(url, (assert) => {
			this.ui.bg[0].spriteFrame = new cc.SpriteFrame(assert);
			this.ui.bg[1].spriteFrame = new cc.SpriteFrame(assert);
		});
	}

	updateAllLabel() {
		let gameState = RoomMgr.getInstance().isFirstRound() && !RoomMgr.getInstance().isGameStarted() ? 0 : 2;
		let fontIndex = gameState + (this.model.tableState - 1);
		this.ui.lbl_roundCount.font = this.ui.lbl_font[fontIndex];
		//this.ui.lbl_roundIndex.font = this.ui.lbl_font[fontIndex];
		this.ui.lbl_roomId.font = this.ui.lbl_font[fontIndex];
		this.ui.lbl_extendRule.font = this.ui.lbl_font[fontIndex];
		for (let i = 0; i < this.ui.lbl_gameRule.length; ++i)
			this.ui.lbl_gameRule[i].font = this.ui.lbl_font[fontIndex];
	}

	clearAllAnimation() {
		this.node.getChildByName("animNode").getComponent(cc.Animation).off("finished", this.animFinished, this);
	}
	clearAllTimeout() {
		if (this.specialTO !== null) clearTimeout(this.specialTO);
		this.clear();
	}

	refreshWatchImg() {
		this.ui.watchImg.active = this.model.myBwatchState;
	}

	onChangeRoomMaster(msg) {

	}

	clear() {
		this.ui.seatContain.destroyAllChildren();
		this.ui.cardContain.destroyAllChildren();
		this.ui.bubblePanel.destroyAllChildren();
		this.node.getChildByName("animNode").getComponent(cc.Animation).stop();
		this.node.getChildByName("animNode").getComponent(cc.Sprite).spriteFrame = null;
	}

	recover() { }
}
//c, 控制
@ccclass
export default class SssRoomCtrl extends BaseCtrl {
	model: Model;
	view: View;
	gameHide=false;
	SssState = {
		dissRoom: false,
		shuffling: false
	};
	//这边去声明ui组件
	@property({
		tooltip: '背景',
		type: [cc.Sprite]
	})
	bg: cc.Sprite[] = [];

	@property({
		tooltip: '邀请按钮',
		type: cc.Node
	})
	btn_invite: cc.Node = null;

	@property({
		tooltip: '洗牌按钮',
		type: cc.Node
	})
	btn_cleanCard: cc.Node = null;

	@property({
		tooltip: '准备按钮',
		type: cc.Node
	})
	btn_prepare: cc.Node = null;

	@property({
		tooltip: '局数Lbl',
		type: cc.Label
	})
	lbl_roundIndex: cc.Label = null;

	@property({
		tooltip: '房间号Lbl',
		type: cc.Label
	})
	lbl_roomId: cc.Label = null;

	@property({
		tooltip: "总局数",
		type: cc.Label
	})
	lbl_roundCount: cc.Label = null;

	@property({
		tooltip: "扩展玩法",
		type: cc.Label
	})
	lbl_extendRule: cc.Label = null;

	@property({
		tooltip: "玩法",
		type: [cc.Label]
	})
	lbl_gameRule: cc.Label[] = [];

	@property({
		tooltip: '座位父节点',
		type: cc.Node
	})
	seatContain: cc.Node = null;

	@property({
		tooltip: '牌父节点',
		type: cc.Node
	})
	cardContain: cc.Node = null;

	@property({
		tooltip: '座位预制',
		type: [cc.Prefab]
	})
	pre_seat: cc.Prefab[] = [];

	@property({
		tooltip: '牌预制',
		type: cc.Prefab
	})
	pre_card: cc.Prefab = null;

	@property({
		tooltip: '洗牌动画预制',
		type: cc.Prefab
	})
	xipaiAnim: cc.Prefab = null;

	@property({
		tooltip: '设置按钮',
		type: cc.Node
	})
	setting: cc.Node = null;

	@property({
		tooltip: '规则按钮',
		type: cc.Node
	})
	rule: cc.Node = null;

	@property({
		tooltip: '战绩按钮',
		type: cc.Node
	})
	record: cc.Node = null;

	@property({
		tooltip: '快捷聊天按钮',
		type: cc.Node
	})
	chat: cc.Node = null;

	@property({
		tooltip: '电量',
		type: cc.Node
	})
	Node_battery: cc.Node = null;

	@property({
		tooltip: '网络',
		type: cc.Node
	})
	Node_network: cc.Node = null;

	@property({
		tooltip: '时间',
		type: cc.Label
	})
	Label_curTime: cc.Label = null;

	@property({
		tooltip: '倒计时时钟',
		type: cc.Node
	})
	clock: cc.Node = null;

	@property({
		tooltip: "手动开始按钮",
		type: cc.Node
	})
	btn_gameStart: cc.Node = null;

	@property({
		tooltip: "气泡预制",
		type: [cc.Prefab]
	})
	pre_bubble: cc.Prefab[] = [];

	@property({
		tooltip: "气泡父节点",
		type: cc.Node
	})
	bubblePanel: cc.Node = null;

	@property({
		tooltip: '字体',
		type: [cc.Font]
	})
	lbl_font: cc.Font[] = [];

	@property({
		tooltip: "旁边标识",
		type: cc.Node
	})
	watchImg: cc.Node = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离

	//生命周期函数
	onLoad() {
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		RoomMgr.getInstance().setGameLibs(SssDef, SssResMgr, SssLogic, SssAudio, SssCards);
		//数据模型
		this.initMvc(Model, View);
		SssLogic.getInstance();
		RoomMgr.getInstance().enterRoom();
		// 界面时间刷新频率为1秒, 可根据实际情况修改
		this.schedule(this.updateCurDate.bind(this), 1);

		if (cc.sys.isNative) {
			G_PLATFORM.getCurNetWorkData()
			G_PLATFORM.getBatteryPercent()
		}
		this.specialTO = null;
		this.peipaiTO = null;
		this.gameHide = false;
	}

	start() {
		if (this.isIPhoneX()) {
			this.resetDesignResolution(this.node.getComponent(cc.Canvas))
		}
	}

	onDestroy() {
		this.unschedule(this.updateCurDate);
		SettingMgr.getInstance().setProperty(this.model.bTopolect, "musicInfo", "bTopolectSwitch")
		RoomMgr.getInstance().destroy();
		super.onDestroy();
	}
	//end
	updateCurDate() {
		let curDate = new Date();
		let hours = curDate.getHours();
		let minutes = curDate.getMinutes();
		this.Label_curTime.string = `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}`
	}
	//定义网络事件
	defineNetEvents() {
		this.n_events = {
			"onEnterRoom": this.onEnterRoom,	// 其他玩家进入房间
			"connector.entryHandler.enterRoom": this.connector_entryHandler_enterRoom,	// 自己进入房间
			"onPrepare": this.onPrepare,		// 准备
			"onStartGame": this.onStartGame,	// 游戏开始
			"onProcess": this.onProcess,		// 游戏流程
			"onLeaveRoom": this.onLeaveRoom,		// 退出房间
			"room.roomHandler.xiPai": this.room_roomHandler_xiPai,	// 洗牌
			"onGameSettle": this.onGameSettle,	// 获取结算
			'room.roomHandler.nextRound': this.room_roomHandler_nextRound,	// 下一局
			"onDissolutionRoom": this.onDissolutionRoom,	// 房间解散
			onReEnterRoom: this.onReEnterRoom,
			onSyncData: this.onSyncData,	// 断线同步数据
			onMidEnter: this.onMidEnter,	// 中途进入消息
			onChangeRoomMaster: this.onChangeRoomMaster,	// 房主变更  
            'onGameFinished':this.onGameFinished,  
		};
	}
	//定义全局事件
	defineGlobalEvents() {
		this.g_events = {
			'batteryChange': this.onBatteryChange,	// 电量变化通知
			'networkChange': this.onNetWorkChange,	// 信号变化通知
			'sss_specialCard': this.sss_specialCard,	// 特殊牌
			'sss_quanleida': this.sss_quanleida,		// 全垒打
			'sss_roundEnd': this.sss_roundEnd,			// 比牌完毕
			"sss_changeTableBg": this.sss_changeTableBg,	// 背景改变
			"EnterForeground": this.EnterForeground
		};
	}

	clearAllTimeout() {
		if (this.specialTO !== null) clearTimeout(this.specialTO);
		if (this.peipaiTO !== null) clearTimeout(this.peipaiTO);
	}

	EnterForeground() {
		// 理论上切回到前台要把所有 setTimeout, animation, action, schedule 全部清除掉
		this.clearAllTimeout();
		this.view.clearAllTimeout();
		this.view.clearAllAnimation();
		this.view.unCountDown();
		this.view.hideAllBtn();
		this.gameHide = true;
	}
	//绑定操作的回调
	connectUi() {
		this.connect(G_UiType.button, this.ui.btn_prepare, this.btn_prepare_cb, '点击准备');
		this.connect(G_UiType.button, this.ui.btn_invite, this.btn_invite_cb, '点击邀请')
		this.connect(G_UiType.button, this.ui.btn_cleanCard, this.btn_cleanCard_cb, '点击洗牌')
		this.connect(G_UiType.button, this.ui.setting, this.setting_cb, '点击设置')
		this.connect(G_UiType.button, this.ui.rule, this.rule_cb, '点击规则')
		this.connect(G_UiType.button, this.ui.record, this.record_cb, '点击战绩')
		this.connect(G_UiType.button, this.ui.chat, this.chat_cb, '点击快捷聊天')
		this.connect(G_UiType.button, this.ui.btn_gameStart, this.gameStart_cb, '点击开始');
	}
	//网络事件回调begin
	onPrepare(msg) {
		this.model.updateMyPrepared();
		this.view.updateInviteBtn();
	}

	onReEnterRoom() {
		this.view.updateInviteBtn();
	}

	onStartGame() {
		this.gameHide = false;
		this.SssState.shuffling = false;
		this.model.myBwatchState = false;
		this.view.refreshWatchImg();
		this.view.unCountDown();
		this.view.updateInviteBtn();
		this.view.updateAllLabel();
		this.model.updateRoundInfo();
		this.view.updateRoundInfo();
		this.view.playStartAnim();
		RoomMgr.getInstance().reqCheating();
	}
	onGameFinished(){
		this.model.updateRoundInfo();
		this.view.updateRoundInfo();
	}
	onProcess(msg) {
		if (msg.process == SssDef.process_peipai || msg.process == SssDef.process_dengdaijiesuan) {
			// 掉线回来如果是配牌或则是等待结算状态, 应该把这个值设回 false
			this.gameHide = false;
		}
		if (msg.process == SssDef.process_peipai) {
			if (this.SssState.dissRoom || this.model.myBwatchState) return;
			this.peipaiTO = setTimeout(() => {
				if (!cc.director.getScene().getChildByName("Prefab_SssSetCards")) {
					this.start_sub_module(G_MODULE.SssSetCard);
					this.view.startCountDown(80);
				}
			}, 1500);
		} else if (msg.process == SssDef.process_cheatcheck) {
			this.start_sub_module(G_MODULE.RoomPreventionCheating);
		}
	}

	onGameSettle() {
		this.view.unCountDown();
		if (RoomMgr.getInstance().isGameStarted()) return;
		if (this.gameHide) {
			this.view.updateClock();
			this.ui.btn_cleanCard.active = true;
			this.ui.btn_prepare.active = true;
			return;
		}
		SssLogic.getInstance().setBiPaiState(true);
		this.view.playBipaiAnim();
	}

	onLeaveRoom(msg) {
		this.view.updateInviteBtn();
	}

	onEnterRoom(msg) {
		this.view.updateInviteBtn();
		if (this.ui.cardContain.getChildByName(`handCard_${RoomMgr.getInstance().getViewSeatId(msg.seatid)}`)) return;
		this.createSeatAndCard({ viewID: RoomMgr.getInstance().getViewSeatId(msg.seatid), uid: msg.user });
	}

	onMidEnter(msg) {
		console.error("啊啊啊啊啊啊 onMidEnter", msg)
		if (!RoomMgr.getInstance().isGameStarted()) return;
		this.view.updateInviteBtn();
	}

	onChangeRoomMaster(msg) {
		this.model.onChangeRoomMaster(msg)
		this.view.onChangeRoomMaster(msg)
		this.view.updateInviteBtn();
	}

	createSeatAndCard(obj) {
		let cfg, seat, card, bubble;
		cfg = this.model.posCfg[obj.viewID];
		if(!cfg) return;
		seat = cc.instantiate(this.ui.pre_seat[cfg.seatType]);
		card = cc.instantiate(this.ui.pre_card);
		bubble = cc.instantiate(this.ui.pre_bubble[cfg.seatType]);
		seat.setPosition(cfg.seatPos[0], cfg.seatPos[1]);
		card.setPosition(cfg.cardPos[0], cfg.cardPos[1]);
		card.setScale(cfg.cardScale);
		card.name = `handCard_${obj.viewID}`;
		obj.type = cfg.seatType;
		bubble.setPosition(cfg.seatPos[0], cfg.seatPos[1] - 15);
		seat.getComponent("SssSeatCtrl").setVidAndUid(obj);
		card.getComponent("SssHandCardCtrl").setVidAndUid(obj);
		bubble.getComponent("Sss_bubbleCtrl").initProperty(obj);
		if (RoomMgr.getInstance().getMySeatId() == RoomMgr.getInstance().getLogicSeatId(obj.viewID)) {
			card.getComponent("SssHandCardCtrl").setWatchState(this.model.myBwatchState)
		}
		this.ui.seatContain.addChild(seat);
		this.ui.cardContain.addChild(card);
		this.ui.bubblePanel.addChild(bubble);
	}

	connector_entryHandler_enterRoom(msg) {
		//每次恢复游戏都是重进房间
		this.model.clear();
		this.view.clear();
		this.model.updateMySeatId();
		this.model.updateMyPrepared();
		this.model.updateRoundInfo();
		this.model.myBwatchState = msg.bwatch;
		this.view.refreshWatchImg();
		this.view.updateInviteBtn();
		this.view.updateRoundInfo();
		this.view.updateAllLabel();
		this.view.updateClock();
		for (let key in msg.seats) {
			let viewID = RoomMgr.getInstance().getViewSeatId(key);
			this.createSeatAndCard({ viewID: viewID, uid: msg.seats[key] });
		}
	}

	room_roomHandler_xiPai() {
		this.model.sssAudio.getInstance().playXiPai();
		this.view.playXipaiAnim();
	}

	room_roomHandler_nextRound() {
		this.model.updateMyPrepared();
		this.view.updateInviteBtn();
	}

	onDissolutionRoom(msg) {
		this.SssState.dissRoom = msg.result;
		if (msg.result) this.view.unCountDown();
	}

	onSyncData(msg) {
		if (!RoomMgr.getInstance().isGameStarted()) {
			this.model.updateMyPrepared();
		}
		if (msg.process == SssDef.process_peipai || msg.process == SssDef.process_dengdaijiesuan) {
			// 掉线回来如果是配牌或则是等待结算状态, 应该把这个值设回 false
			this.gameHide = false;
		}
		if (msg.process == SssDef.process_peipai) {
			if (msg.state == SssDef.state_peipai) {
				if (this.peipaiTO !== null) clearTimeout(this.peipaiTO);
				if (!cc.director.getScene().getChildByName("Prefab_SssSetCards")) {
					this.start_sub_module(G_MODULE.SssSetCard);
					this.view.startCountDown(80);
				}
			}
		} else if (msg.process == SssDef.process_gamesettle) {
			let clientTime = SssLogic.getInstance().curTime,
				restTime = msg.roundend_time - clientTime;
			if (msg.roundend_time > clientTime) {
				this.view.hideAllBtn();
				this.view.unCountDown();
				if (restTime >= SssLogic.getInstance().getAnimTime()) {
					this.view.playBipaiAnim();
				}
			}
		}
	}
	//end
	//全局事件回调begin
	sss_specialCard(msg) {
		let showSpectalLoop = (i, time) => {
			if (i >= msg.data.length) return;
			this.model.sssAudio.getInstance().playSpecialBGM();
			this.model.sssAudio.getInstance().playCardTypeAudio(msg.data[i].cardType, 1);
			this.view.playSpecialCardAnim(msg.data[i].cardType, 2000);
			this.specialTO = setTimeout(() => {
				showSpectalLoop(i + 1, time);
			}, time);
		};
		showSpectalLoop(msg.start, 3000);
	}

	sss_quanleida() {
		this.model.sssAudio.getInstance().playQuanLeiDa();
		this.view.playQuanleidaAnim();
	}

	sss_changeTableBg() {
		this.model.updateTableBg();
		this.view.updateTableBg();
		this.view.updateAllLabel();
	}
	// 监听电量变化
	onBatteryChange(msg) {
		cc.log("电量变化？？", msg);
		let proportion = parseInt(msg / 10);
		let imageName = "";
		if (6 <= proportion) imageName = "dl_1";
		else if (3 <= proportion) imageName = "dl_2";
		else imageName = "dl_3";
		// 写法有问题
		// 没有找到游戏内引用游戏外资源的函数
		// 这里先直接loader
		// liquan
		cc.loader.loadRes(`Icons/${imageName}`, cc.SpriteFrame, (err, sprite) => {
			if (err) return cc.error(`no find Icons/${imageName}`);
			let childrens = this.Node_battery.children;
			for (let i = 0; i < childrens.length; i++) {
				childrens[i].active = i < proportion;
				(i < proportion) && (childrens[i].getComponent(cc.Sprite).spriteFrame = sprite);
			}
		});
	}

	// 监听网络变化
	onNetWorkChange(msg) {
		let imageName = `${msg.type}_${msg.level}`;
		cc.loader.loadRes(`Icons/${imageName}`, cc.SpriteFrame, (err, sprite) => {
			if (err) return cc.error(`no find Icons/${imageName}`);
			this.Node_network.getComponent(cc.Sprite).spriteFrame = sprite;
		});
	}

	sss_roundEnd() {
		this.model.updateMyPrepared();
		this.view.updateInviteBtn();
		this.view.updateClock()
	}
	//end
	//按钮或任何控件操作的回调begin
	btn_prepare_cb() {
		if (!RoomMgr.getInstance().isFirstRound()) {
			this.view.unCountDown();
		}
		RoomMgr.getInstance().prepare();
	}

	btn_invite_cb() {
		//console.log("club_id",this.model.roomInfo.no);
		if (cc.sys.isNative) {
			let roomvalue = RoomMgr.getInstance().getFangKaCfg();
			let appname = AppInfoMgr.getInstance().getAppName();
			if(this.model.roomInfo.club_id == 0){
				G_PLATFORM.wxShareRoom(G_PLATFORM.WX_SHARE_TYPE.WXSceneSession, `${appname}好友房间邀请`, `${RoomMgr.getInstance().getGameName()} 房间号:${this.model.roomInfo.password} 局数：${roomvalue.v_roundcount}局 人数：${roomvalue.v_seatcount}人 ${this.model.paytypeList[roomvalue.v_paytype]}`, this.model.roomInfo.password);
			}else{
				G_PLATFORM.wxShareRoom(G_PLATFORM.WX_SHARE_TYPE.WXSceneSession, `${appname} 茶馆ID:${this.model.roomInfo.no}`, `${RoomMgr.getInstance().getGameName()} 房间号:${this.model.roomInfo.password} 局数：${roomvalue.v_roundcount}局 人数：${roomvalue.v_seatcount}人 茶馆支付`, this.model.roomInfo.password);
			}
		}
	}
	btn_cleanCard_cb() {
		if (this.SssState.shuffling) return;
		FrameMgr.getInstance().showDialog("是否花费1钻石进行洗牌？", SssLogic.getInstance().send_xipai.bind(SssLogic.getInstance()), "确认洗牌", () => { this.SssState.shuffling = false; });
		this.SssState.shuffling = true;
	}
	setting_cb() {
		this.start_sub_module(G_MODULE.RoomSetting);
	}
	rule_cb() {
		this.start_sub_module(G_MODULE.GameRule);
	}
	record_cb() {
		this.start_sub_module(G_MODULE.SssRecord);
	}

	chat_cb() {
		this.start_sub_module(G_MODULE.RoomChat);
	}

	gameStart_cb() {
		if (RoomMgr.getInstance().isRoomOwner(RoomMgr.getInstance().getMySeatId())) {
			RoomMgr.getInstance().manualStart();
		}
	}
	//end

	countDown() {
		let time = parseInt(this.ui.clock.getChildByName('label').getComponent(cc.Label).string) - 1;
		this.ui.clock.getChildByName('label').getComponent(cc.Label).string = time;
		if (time < 10) {
			this.model.sssAudio.getInstance().playClock();
		}
		if (time <= 0) {
			this.ui.clock.getChildByName('label').getComponent(cc.Label).string = '80';
			this.ui.clock.active = false;
			this.unschedule(this.countDown);
		}
	}
}
