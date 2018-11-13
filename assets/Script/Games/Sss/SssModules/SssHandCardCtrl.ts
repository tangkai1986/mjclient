import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import { SssDef } from "../SssMgr/SssDef";
import SssLogic from "../SssMgr/SssLogic";
import LocalStorage from "../../../Plat/Libs/LocalStorage";
import { date } from "../../../../jszip/defaults";

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: SssHandCardCtrl;
//模型，数据处理
class Model extends BaseModel {
	roomValue = null;
	seatId = null;
	logicSeatId = null; //逻辑座位
	handCard = [];
	finalCard = [];
	cardType = [];
	dunScore = [];
	specialType = 0;
	horseCard = {};
	sssAudio = RoomMgr.getInstance().getAudio();
	myWatchState = false;
	cardBgState = 3;
	constructor() {
		super();
		this.roomValue = SssLogic.getInstance().getRoomValue();
		this.seatId = ctrl.seatId;
		this.logicSeatId = RoomMgr.getInstance().getLogicSeatId(ctrl.seatId);
		this.myWatchState = ctrl.myWatchState;
		this.updateCardBg();
	}

	updateHandCard() {
		this.handCard = SssLogic.getInstance().getMyHandCard();
	}

	updateSettleInfo() {
		this.finalCard = SssLogic.getInstance().getFinalCard(this.logicSeatId) || [];
		this.cardType = SssLogic.getInstance().getCardType(this.logicSeatId);
		this.dunScore = SssLogic.getInstance().getScore(this.logicSeatId);
		this.horseCard = SssLogic.getInstance().getMaCardMap();
	}

	updateCardBg() {
		this.cardBgState = LocalStorage.getInstance().getSssCardBGCfg() || 3;
	}

	clear() { }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	model: Model;
	ui = {
		//在这里声明ui
		cardPanel: ctrl.cardPanel,
		cardTypePanel: ctrl.cardTypePanel,
		cardAtlas: ctrl.cardAtlas,
		cardTypeAtlas: ctrl.cardTypeAtlas,
		scorePanel: ctrl.scorePanel,
		scoreFont: ctrl.scoreFont,
		scoreBg: ctrl.scoreBg,
		gun: ctrl.gun,
		dankong: ctrl.dankong,
		specialCard: ctrl.specialCard,
		waitCard: ctrl.waitCard,
		cardTypes: [],
		cardNodes: [],
		scoreLbls: [],
	};
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
		this.daqiangTO = null;
		this.specialTO = null;
		this.gunAnimFinish = null;
	}
	//初始化ui
	initUi() {
		for (let i = 0; i < 3; ++i) {
			this.ui.cardPanel.children[i].zIndex = i;
			this.ui.cardNodes.push(this.ui.cardPanel.children[i]);
			this.ui.cardTypes.push(this.ui.cardTypePanel.children[i]);
			this.ui.scoreLbls.push(this.ui.scorePanel.children[i]);
		}
		this.clear();
	}

	clear() {
		this.changeAllCard(false);
		this.ui.cardPanel.active = false;
		this.ui.specialCard.active = false;
		this.ui.gun.active = false;
		for (let i = 0; i < 3; ++i) {
			this.ui.scoreLbls[i].getComponent(cc.Sprite).spriteFrame = this.ui.scoreBg[0];
			this.ui.scoreLbls[i].getChildByName('count').getComponent(cc.Label).font = this.ui.scoreFont[0];
			this.ui.scoreLbls[i].getChildByName('count').getComponent(cc.Label).string = '+0水';
			this.ui.scoreLbls[i].active = false;
			this.ui.cardTypes[i].active = false;
		}
		this.node.getChildByName('qiangkongPanel').destroyAllChildren();
		let cardList = this.ui.waitCard.getChildByName("cardLayout").children;
		let name = this.model.cardBgState == 3 ? 'bull_0x00' : `bull_0x00_${this.model.cardBgState}`;
		for (let i = 0; i < cardList.length; ++i) {
			cardList[i].getComponent(cc.Sprite).spriteFrame = this.ui.cardAtlas.getSpriteFrame(name);
		}
	}

	recover() { }

	flipCard(index) {
		if (this.model.finalCard.length <= 0) return;
		let node = this.ui.cardNodes[index],
			cards = this.model.finalCard[index],
			dunSort = SssLogic.getInstance().getDunSort(index),
			time = 0.45 * dunSort.indexOf(this.model.logicSeatId);
		// if (!cards) return;
		// if(time < 0) return;
		let delay1 = cc.delayTime(time);
		let cb1 = cc.callFunc(() => {
			node.zIndex += 1;
			for (let i = 0; i < node.children.length; ++i) {
				let name = cards[i] < 16 ? 'bull_0x0' + cards[i].toString(16) : 'bull_0x' + cards[i].toString(16);
				node.children[i].getComponent(cc.Sprite).spriteFrame = this.ui.cardAtlas.getSpriteFrame(name);
				if (this.model.roomValue.v_buyHorse == 1 && cards[i] == this.model.roomValue.v_buyHorseData) {
					node.children[i].children[0].active = true;
					node.children[i].color = cc.color(240, 241, 162);
				}
			}
		}, this);
		let scaleUp = cc.scaleTo(0.1, 1.5);
		let cb2 = cc.callFunc(() => {
			let data = this.model.cardType;
			let code = SssDef.cardTypeNames[data[index]];
			if (index == 0 && data[index] == SssDef.CT_THREE) code = (SssDef.cardTypeNames[SssDef.CT_THREE] + 10).toString();
			if (index == 1 && data[index] == SssDef.CT_FIVE_THREE_DEOUBLE) code = (SssDef.cardTypeNames[SssDef.CT_FIVE_THREE_DEOUBLE] + 10).toString();
			this.ui.cardTypes[index].getComponent(cc.Sprite).spriteFrame = this.ui.cardTypeAtlas.getSpriteFrame(`cardtype_${code}`);

			this.model.sssAudio.getInstance().playCardTypeAudio(code || '', 0);
			this.ui.cardTypes[index].active = true;
		}, this);
		let delay2 = cc.delayTime(0.2);
		let scaleDown = cc.scaleTo(0.1, 1);
		let cb3 = cc.callFunc(() => {
			this.ui.cardTypes[index].active = false;
			node.zIndex -= 1;
		}, this);

		let action = cc.sequence(delay1, cb1, scaleUp, cb2, delay2, scaleDown, cb3);
		node.runAction(action);
	}

	refreshDunScore(index) {
		let type;
		if (index < 2) {
			if (this.model.dunScore[index] >= 0) {
				type = 0;
				this.ui.scoreLbls[index].getChildByName('count').getComponent(cc.Label).string = `+${this.model.dunScore[index]}水`;
			} else {
				type = 1;
				this.ui.scoreLbls[index].getChildByName('count').getComponent(cc.Label).string = `${this.model.dunScore[index]}水`;
			}
			this.ui.scoreLbls[index].getComponent(cc.Sprite).spriteFrame = this.ui.scoreBg[type];
			this.ui.scoreLbls[index].getChildByName('count').getComponent(cc.Label).font = this.ui.scoreFont[type];
			let p = this.ui.scoreLbls[index].position;
			let delay = cc.delayTime(0.2);
			let moveDown = cc.moveTo(0.05, cc.p(0, -60.1));
			let cb = cc.callFunc(() => {
				this.ui.scoreLbls[index].active = false;
				this.ui.scoreLbls[index].position = p;
				if (index == 0) this.ui.scoreLbls[2].active = true;
				this.refreshTotalScore(this.model.dunScore[index]);
			});
			let action = cc.sequence(delay, moveDown, cb);
			this.ui.scoreLbls[index].active = true;
			this.ui.scoreLbls[index].runAction(action);
		} else if (index == 2) {
			this.refreshTotalScore(this.model.dunScore[index]);
		}
	}

	refreshTotalScore(score) {
		let totoal = 0;
		let scale1 = cc.scaleTo(0.08, 1.5, 0.5);
		let scale2 = cc.scaleTo(0.08, 0.5, 1.5);
		let scale3 = cc.scaleTo(0.08, 1, 1);
		let scorePanel = this.ui.scoreLbls[2];
		let scoreString = scorePanel.getChildByName('count').getComponent(cc.Label).string;
		let curScore = parseInt(scoreString.substring(0, scoreString.length - 1));
		totoal = curScore + score;
		let callback = () => {
			let type;
			if (totoal >= 0) {
				type = 0;
				scorePanel.getChildByName('count').getComponent(cc.Label).string = `+${totoal}水`;
			} else {
				type = 1;
				scorePanel.getChildByName('count').getComponent(cc.Label).string = `${totoal}水`;
			}
			scorePanel.getComponent(cc.Sprite).spriteFrame = this.ui.scoreBg[type];
			scorePanel.getChildByName('count').getComponent(cc.Label).font = this.ui.scoreFont[type];
		};
		let action = cc.sequence(scale1, scale2, scale3, cc.callFunc(callback));
		scorePanel.runAction(action);
		this.model.sssAudio.getInstance().playChangeScore();
	}

	startDaqiang(msg) {
		if (msg.from == this.model.logicSeatId) {
			this.ui.gun.active = true;
			let anim = this.ui.gun.getComponent(cc.Animation);
			this.gunAnimFinish = () => {
				this.ui.gun.active = false;
				this.refreshTotalScore(msg.score);
				this.ui.gun.getComponent(cc.Animation).off("finished", this.gunAnimFinish, this);
			}
			anim.on('finished', this.gunAnimFinish, this);
			let cardContainer = this.node.parent;
			let gunSeat = cardContainer.getChildByName(`handCard_${RoomMgr.getInstance().getViewSeatId(msg.from)}`).getPosition();
			let bGundataSeat = cardContainer.getChildByName(`handCard_${RoomMgr.getInstance().getViewSeatId(msg.target)}`).getPosition();
			let pos = { x: bGundataSeat.x - gunSeat.x, y: bGundataSeat.y - gunSeat.y };
			this.ui.gun.rotation = -(Math.atan2(pos.y, pos.x) * 180 / Math.PI - 45);
			this.model.sssAudio.getInstance().playGun();
			let animState = anim.play();
			animState.repeatCount = 3;
		} else if (msg.target == this.model.logicSeatId) {
			let dankongCB = () => {
				this.createDankong();
			}
			ctrl.schedule(dankongCB, 0.15, 2);
			this.daqiangTO = setTimeout(() => {
				this.refreshTotalScore(-(msg.score));
			}, 450);
		}
	}

	createDankong() {
		let newNode = new cc.Node();
		this.node.getChildByName('qiangkongPanel').addChild(newNode);
		let sp = newNode.addComponent(cc.Sprite);
		sp.spriteFrame = this.ui.dankong;
		let x = 40 - (Math.random() * 80);
		let y = 50 - (Math.random() * 100);
		newNode.setPosition(x, y);
	}

	showSpecialCard(msg) {
		let showSpecialLoop = (i, time) => {
			if (i >= msg.data.length) return;
			if (msg.data[i].seatid == this.model.logicSeatId) {
				this.ui.specialCard.active = false;
				this.changeAllCard(true);
				this.ui.scoreLbls[2].active = true;
				this.refreshTotalScore(msg.data[i].totalScore);
			} else if (this.model.logicSeatId != null) {
				if (msg.data[i].cardType > this.model.specialType) {
					let multiple = Math.pow(2, (this.model.horseCard[msg.data[i].seatid] + this.model.horseCard[this.model.logicSeatId]));
					this.refreshTotalScore(-(msg.data[i].cardTypeScore * multiple));
				}
			}
			this.specialTO = setTimeout(() => {
				showSpecialLoop(i + 1, time);
			}, time);
		};
		showSpecialLoop(msg.start, 3000);
	}

	showWaitCard() {
		this.ui.waitCard.active = true;
	}

	hideWaitCard() {
		this.ui.waitCard.active = false;
		this.ui.cardPanel.active = true;
	}

	changePierCard(index) {
		let node = this.ui.cardNodes[index],
			cards = this.model.finalCard[index];
		for (let i = 0; i < node.children.length; ++i) {
			let name = cards[i] < 16 ? 'bull_0x0' + cards[i].toString(16) : 'bull_0x' + cards[i].toString(16);
			node.children[i].getComponent(cc.Sprite).spriteFrame = this.ui.cardAtlas.getSpriteFrame(name);
			if (this.model.roomValue.v_buyHorse == 1 && cards[i] == this.model.roomValue.v_buyHorseData) {
				node.children[i].children[0].active = true;
				node.children[i].color = cc.color(240, 241, 162);
			}
		}
	}

	changeAllCard(brightOrCover: boolean) {
		this.model.finalCard = SssLogic.getInstance().getFinalCard(this.model.logicSeatId);
		let name, cards;
		for (let i = 0; i < this.ui.cardNodes.length; ++i) {
			for (let j = 0; j < this.ui.cardNodes[i].childrenCount; ++j) {
				if (brightOrCover) {
					cards = this.model.finalCard[i];
					name = cards[j] < 16 ? 'bull_0x0' + cards[j].toString(16) : 'bull_0x' + cards[j].toString(16);
					if (this.model.roomValue.v_buyHorse == 1 && cards[j] == this.model.roomValue.v_buyHorseData) {
						this.ui.cardNodes[i].children[j].children[0].active = true;
						this.ui.cardNodes[i].children[j].color = cc.color(240, 241, 162);
					}
				} else {
					name = this.model.cardBgState == 3 ? 'bull_0x00' : `bull_0x00_${this.model.cardBgState}`;
					this.ui.cardNodes[i].children[j].color = cc.color(255, 255, 255);
					this.ui.cardNodes[i].children[j].children[0].active = false;
				}
				this.ui.cardNodes[i].children[j].getComponent(cc.Sprite).spriteFrame = this.ui.cardAtlas.getSpriteFrame(name);
			}
			this.ui.cardNodes[i].scale = 1;
		}
	}

	clearAllTimeout() {
		if (this.specialTO !== null) clearTimeout(this.specialTO);
		if (this.daqiangTO !== null) clearTimeout(this.daqiangTO);
	}

	clearAllAction() {
		// E/jswrapper( 4134): ERROR: Uncaught TypeError: Cannot read property 'length' of undefined, location: src/project.dev.js:0:0
		// E/jswrapper( 4134): STACK:
		// E/jswrapper( 4134): [0]View.clearAllAction@src/project.dev.js:67091
		// E/jswrapper( 4134): [1]SssHandCardCtrl.EnterForeground@src/project.dev.js:67162
		// E/jswrapper( 4134): [2]WM_Emitter.emit@src/project.dev.js:74924
		// E/jswrapper( 4134): [3]anonymous@src/project.dev.js:17799
		// E/jswrapper( 4134): [4]84.EventListeners.invoke@src/jsb_polyfill.js:14243
		// E/jswrapper( 4134): [5]85.proto.emit@src/jsb_polyfill.js:14422
		// E/jswrapper( 4134): [6]anonymous@src/jsb_polyfill.js:31789
		let CNC = this.ui.cardNodes.children;
		if (CNC) for (let key = 0; key < CNC.length; key++) CNC[key].stopAllActions()
		let SLC = this.ui.scoreLbls.children;
		if (SLC) for (let key = 0; key < SLC.length; key++) SLC[key].stopAllActions()
	}
	clearAllAnimation() {
		this.ui.gun.getComponent(cc.Animation).off("finished", this.gunAnimFinish, this)
	}
	updateCardBg() {
		for (let i = 0; i < this.ui.cardNodes.length; ++i) {
			for (let j = 0; j < this.ui.cardNodes[i].childrenCount; ++j) {
				let bgName = this.model.cardBgState == 3 ? 'bull_0x00' : `bull_0x00_${this.model.cardBgState}`;
				if (this.ui.cardNodes[i].children[j].getComponent(cc.Sprite).spriteFrame.name.indexOf("bull_0x00") >= 0) {
					this.ui.cardNodes[i].children[j].getComponent(cc.Sprite).spriteFrame = this.ui.cardAtlas.getSpriteFrame(bgName);
				}
			}
		}

		let cardList = this.ui.waitCard.getChildByName("cardLayout").children;
		let name = this.model.cardBgState == 3 ? 'bull_0x00' : `bull_0x00_${this.model.cardBgState}`;
		for (let i = 0; i < cardList.length; ++i) {
			cardList[i].getComponent(cc.Sprite).spriteFrame = this.ui.cardAtlas.getSpriteFrame(name);
		}
	}
}
//c, 控制
@ccclass
export default class SssHandCardCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property({
		tooltip: '牌的节点',
		type: cc.Node
	})
	cardPanel: cc.Node = null;

	@property({
		tooltip: '扑克牌图集',
		type: cc.SpriteAtlas
	})
	cardAtlas: cc.SpriteAtlas = null;

	@property({
		tooltip: '牌型父节点',
		type: cc.Node
	})
	cardTypePanel: cc.Node = null;

	@property({
		tooltip: '牌型图集',
		type: cc.SpriteAtlas
	})
	cardTypeAtlas: cc.SpriteAtlas = null;

	@property({
		tooltip: '分数label',
		type: cc.Node
	})
	scorePanel: cc.Node = null;

	@property({
		tooltip: "分数字体",
		type: [cc.Font]
	})
	scoreFont: cc.Font[] = [];

	@property({
		tooltip: "分数底",
		type: [cc.SpriteFrame]
	})
	scoreBg: cc.SpriteFrame[] = [];

	@property({
		tooltip: '枪',
		type: cc.Node
	})
	gun: cc.Node = null;

	@property({
		tooltip: "弹孔",
		type: cc.SpriteFrame
	})
	dankong: cc.SpriteFrame = null;

	@property({
		tooltip: "特殊牌型",
		type: cc.Node
	})
	specialCard: cc.Node = null;

	@property({
		tooltip: "等待牌",
		type: cc.Node
	})
	waitCard: cc.Node = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离
	model: Model;
	view: View;
	seatId: number;
	uid: number;
	myWatchState: boolean;
	touched: boolean = false;
	onLoad() {
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model, View);
		this.bipaiTo = null;
		this.peipaiTO = null;
		this.gameHide = false;
	}

	//定义网络事件
	defineNetEvents() {
		this.n_events = {
			"onProcess": this.onProcess,
			"onStartGame": this.onStartGame,
			"onCardFinish": this.onCardFinish,
			"onLeaveRoom": this.onLeaveRoom,
			"onGameSettle": this.onGameSettle,
			"onSyncData": this.onSyncData,
			"onMidEnter": this.onMidEnter,
		}
	}
	//定义全局事件
	defineGlobalEvents() {
		this.g_events = {
			"sss_startBipai": this.room_startbipai,
			"sss_startDaqiang": this.room_startdaqiang,
			"sss_specialCard": this.room_specialcard,
			'sss_quanleida': this.room_quanleida,
			'sss_roundEnd': this.sss_roundEnd,
			"sss_changeCardBg": this.sss_changeCardBg,
			"EnterForeground": this.EnterForeground
		}
	}
	//绑定操作的回调
	connectUi() {

	}

	clearAllTimeout() {
		if (this.bipaiTo !== null) clearTimeout(this.bipaiTo);
		if (this.peipaiTO !== null) clearTimeout(this.peipaiTO);
	}

	EnterForeground() {
		// 理论上切回到前台要把所有 setTimeout, animation, action, schedule 全部清除掉
		this.clearAllTimeout();
		this.view.clearAllTimeout();
		this.view.clearAllAction();
		this.view.clearAllAnimation();
		ctrl.unscheduleAllCallbacks();
		this.gameHide = true;
	}
	//网络事件回调begin
	onProcess(msg) {
		if (msg.process == SssDef.process_peipai || msg.process == SssDef.process_dengdaijiesuan) {
			// 掉线回来如果是配牌或则是等待结算状态, 应该把这个值设回 false
			this.gameHide = false;
		}
		if (this.model.myWatchState) return;
		if (msg.process == SssDef.process_fapai) {
			if (msg.seatid == this.model.logicSeatId) {
				this.model.updateHandCard();
			}
		} else if (msg.process == SssDef.process_peipai) {
			this.peipaiTO = setTimeout(() => {
				this.view.showWaitCard();
			}, 1500);
		}
	}

	onStartGame() {
		this.model.myWatchState = false;
		this.gameHide = false;
	}

	onCardFinish(msg) {
		if (msg.seatid == this.model.logicSeatId && msg.state == SssDef.state_dengdaijiesuan) {
			this.model.specialType = msg.isSpecial;
			this.view.hideWaitCard();
			if (this.model.seatId == 0) {
				this.ui.specialCard.active = this.model.specialType > 0;
				this.ui.cardPanel.on("touchend", this.touchMyselfCard, this);
			}
		}
	}

	onLeaveRoom(msg) {
		if (this.model.logicSeatId == msg.seatid) {
			this.model.clear();
			this.view.clear();
			// QgmjAudio.getInstance().OtherPlayerLeaveAudio();
			//console.log("leave");
			this.finish();
		}
	}

	onGameSettle() {
		if (RoomMgr.getInstance().isGameStarted()) return;
		if (this.gameHide) return;
		this.model.updateSettleInfo();
		this.ui.specialCard.active = this.model.specialType > 0;
		if (this.model.seatId == 0) {
			this.ui.cardPanel.off("touchend", this.touchMyselfCard, this);
			this.touched = false;
			this.view.changeAllCard(false);
		}
	}

	onSyncData(msg) {
		if (msg.process == SssDef.process_peipai || msg.process == SssDef.process_dengdaijiesuan) {
			// 掉线回来如果是配牌或则是等待结算状态, 应该把这个值设回 false
			this.gameHide = false;
		}
		if (this.model.myWatchState) return;
		if (msg.process == SssDef.process_peipai) {
			let info = msg.allSeatInfo[this.model.logicSeatId];
			if (info.state == SssDef.state_peipai) {
				this.view.showWaitCard();
			} else if (info.state == SssDef.state_dengdaijiesuan) {
				this.model.specialType = info.IsSpecialCard;
				this.view.hideWaitCard();
				if (this.model.seatId == 0) {
					this.ui.specialCard.active = this.model.specialType > 0;
					this.ui.cardPanel.on("touchend", this.touchMyselfCard, this);
				}
			}
		} else if (msg.process == SssDef.process_gamesettle) {
			let clientTime = SssLogic.getInstance().curTime;
			if (msg.roundend_time > clientTime) {
				this.model.updateSettleInfo();
				this.view.hideWaitCard();
				this.model.specialType = msg.settle_data.wanjiasettle[this.model.logicSeatId].isteshupaixing;
				this.ui.specialCard.active = this.model.specialType > 0;
				let settlePlayNum = SssLogic.getInstance().settlePlayerNum,
					restTime = SssLogic.getInstance().getAnimTime() - (msg.roundend_time - clientTime),
					bipaiTime = 1350 * settlePlayNum,
					daqiangTime = bipaiTime + 750 * SssLogic.getInstance().daqiangIndex.length;
				// //console.log("cardsync", restTime, msg.roundend_time - clientTime);
				if (restTime > 0 && restTime <= daqiangTime) {
					if (this.model.specialType != 0) return;
					this.recoveryBipaiAnim(restTime, settlePlayNum);
					if (restTime > bipaiTime) this.recoveryDaqiangAnim(restTime - bipaiTime);
				} else if (restTime > daqiangTime) {
					if (this.model.specialType == 0) {
						this.recoveryBipaiAnim(restTime, settlePlayNum);
						this.recoveryDaqiangAnim(restTime - bipaiTime);
					}
					if (SssLogic.getInstance().specialCard.length != 0) {
						this.recoverySpecialCardAnim(restTime - daqiangTime);
					} else if (SssLogic.getInstance().quanleidaIndex != null) {
						if (SssLogic.getInstance().getAnimTime() - restTime <= 250) {
							let quanleida = SssLogic.getInstance().quanleida;
							this.view.refreshTotalScore(quanleida[this.model.logicSeatId]);
						}
					}
				}
			}
		}
	}

	recoveryBipaiAnim(restTime, settlePlayNum) {
		for (let i = 1; i < 4; ++i) {
			if (restTime <= i * 450 * settlePlayNum || i == 3) {
				let scores = 0;
				for (let j = 0; j < i; ++j) {
					this.view.changePierCard(j);
					scores += this.model.dunScore[j];
				}
				this.ui.scoreLbls[2].active = true;
				this.view.refreshTotalScore(scores);
				return;
			}
		}
	}

	recoveryDaqiangAnim(restTime) {
		let index = Math.ceil(restTime / 750),
			daqiangIndex = SssLogic.getInstance().daqiangIndex;
		for (let i = 0; i < index; ++i) {
			let data = daqiangIndex[i];
			if (!data) return;
			if (data.from == this.model.logicSeatId) {
				this.view.refreshTotalScore(data.score);
			} else if (data.target == this.model.logicSeatId) {
				for (let i = 0; i < 3; ++i) {
					this.view.createDankong();
				}
				this.view.refreshTotalScore(-(data.score));
			}
		}
	}

	recoverySpecialCardAnim(restTime) {
		let index = Math.ceil(restTime / 3000),
			specialCard = SssLogic.getInstance().specialCard;
		for (let i = 0; i < index; ++i) {
			if (!specialCard[i]) return;
			if (specialCard[i].seatid == this.model.logicSeatId) {
				this.ui.specialCard.active = false;
				this.view.changeAllCard(true);
				this.ui.scoreLbls[2].active = true;
				this.view.refreshTotalScore(specialCard[i].totalScore);
			} else if (this.model.logicSeatId != null) {
				if (specialCard[i].cardType > this.model.specialType) {
					let multiple = Math.pow(2, (this.model.horseCard[specialCard[i].seatid] + this.model.horseCard[this.model.logicSeatId]));
					this.view.refreshTotalScore(-(specialCard[i].cardTypeScore * multiple));
				}
			}
		}
		this.view.showSpecialCard
	}

	onMidEnter(msg) {
		if (this.model.logicSeatId == msg.seatid) {
			return this.model.myWatchState = true;
		}
		let playerinfo = msg.allSeatInfo[this.model.logicSeatId];
		if (playerinfo.state == SssDef.state_peipai) {
			this.view.showWaitCard();
		}
		if (playerinfo.state == SssDef.state_dengdaijiesuan) {
			this.model.specialType = playerinfo.IsSpecialCard;
			this.view.hideWaitCard();
		}
	}
	//end
	//全局事件回调begin

	room_startbipai(msg) {
		if (this.model.myWatchState) return;
		if (this.model.logicSeatId == null) {
			return;
		}
		if (this.model.specialType == 0) {
			this.bipaiTo = setTimeout(() => {
				this.view.refreshDunScore(msg.index);
			}, msg.time);
			this.view.flipCard(msg.index);
		}
	}

	room_startdaqiang(msg) {
		if (this.model.myWatchState) return;
		this.view.startDaqiang(msg);
	}

	room_specialcard(msg) {
		if (this.model.myWatchState) return;
		this.view.showSpecialCard(msg);
	}

	room_quanleida(msg) {
		if (this.model.myWatchState) return;
		if (this.model.logicSeatId != null) {
			this.view.refreshTotalScore(msg[this.model.logicSeatId]);
		}
	}

	sss_roundEnd() {
		//console.log("手牌初始化");
		this.EnterForeground();
		this.view.clear();
	}

	sss_changeCardBg() {
		this.model.updateCardBg();
		this.view.updateCardBg();
	}
	//end
	//按钮或任何控件操作的回调begin
	touchMyselfCard() {
		this.view.changeAllCard(!this.touched);
		this.touched = !this.touched;
	}
	//end
	setVidAndUid(obj) {
		this.uid = obj.uid;
		this.seatId = obj.viewID
	}
	setWatchState(state) {
		this.myWatchState = state;
	}
}