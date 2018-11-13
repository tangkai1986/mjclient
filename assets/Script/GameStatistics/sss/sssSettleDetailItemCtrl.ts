import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import BaseModel from "../../Plat/Libs/BaseModel";
import BaseView from "../../Plat/Libs/BaseView";
import BunchInfoMgr from "../../Plat/GameMgrs/BunchInfoMgr";
import { SssDef } from "../../Games/Sss/SssMgr/SssDef";

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: sssSettleDetailItemCtrl;
//模型，数据处理
class Model extends BaseModel {
	userData = null;
	seatId = null;
	userInfo = null;
	roomValue = null;
	owner = null;
	constructor() {
		super();
		this.roomValue = BunchInfoMgr.getInstance().getBunchInfo().roomValue;
		this.userData = ctrl.userData;
		this.seatId = ctrl.seatId;
		this.updateUserInfo();
	}

	updateUserInfo() {
		let users = BunchInfoMgr.getInstance().getMembelist();
		this.userInfo = users[this.seatId];
		this.owner = BunchInfoMgr.getInstance().getBunchInfo().roomOwner;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	model: Model;
	ui = {
		//在这里声明ui
		nameLbl: ctrl.nameLbl,
		cardPanel: ctrl.cardPanel,
		cardTypePanel: ctrl.cardTypePanel,
		cardScorePanel: ctrl.cardScorePanel,
		scorePanel: ctrl.scorePanel,
		scoreFont: ctrl.scoreFont,
		cardAltas: ctrl.cardAltas,
		masterImg: ctrl.masterImg,
		cardTypeAltas: ctrl.cardTypeAltas,
		specialAltas: ctrl.specialAltas
	};
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi() {
		this.ui.masterImg.active = (this.model.userInfo.id == this.model.owner) || this.model.userInfo.bowner;
		this.ui.nameLbl.string = this.model.userInfo.nickname.length > 5 ? `${this.model.userInfo.nickname.substring(0, 5)}...` : this.model.userInfo.nickname;
		let cards = this.model.userData.settleCard;
		for (let i = 0; i < this.ui.cardPanel.children.length; ++i) {
			if (this.model.userData.alldunfen.length > 0) {
				if (this.model.userData.alldunfen[i] >= 0) {
					this.ui.cardScorePanel.children[i].getComponent(cc.Label).string = `+${this.model.userData.alldunfen[i]}`;
				} else {
					this.ui.cardScorePanel.children[i].color = cc.color(0, 255, 0);
					this.ui.cardScorePanel.children[i].getComponent(cc.LabelOutline).color = cc.color(0, 255, 0);
					this.ui.cardScorePanel.children[i].getComponent(cc.Label).string = this.model.userData.alldunfen[i];
				}
				this.ui.cardScorePanel.children[i].active = true;
			}

			if (this.model.userData.allduntype.length > 0) {
				let name;
				if (i == 0 && this.model.userData.allduntype[i] == SssDef.CT_THREE) {
					name = 'cardtype_' + (SssDef.cardTypeNames[SssDef.CT_THREE] + 10).toString();
				} else if (i == 1 && this.model.userData.allduntype[i] == SssDef.CT_FIVE_THREE_DEOUBLE) {
					name = 'cardtype_' + (SssDef.cardTypeNames[SssDef.CT_FIVE_THREE_DEOUBLE] + 10).toString();
				} else {
					name = 'cardtype_' + SssDef.cardTypeNames[this.model.userData.allduntype[i]];
				}
				this.ui.cardTypePanel.children[i].active = true;
				this.ui.cardTypePanel.children[i].getComponent(cc.Sprite).spriteFrame = this.ui.cardTypeAltas.getSpriteFrame(name);
			}

			let node = this.ui.cardPanel.children[i];
			for (let j = 0; j < node.children.length; ++j) {
				let name = cards[i][j] < 14 ? 'bull_0x0' + cards[i][j].toString(16) : 'bull_0x' + cards[i][j].toString(16);
				node.children[j].getComponent(cc.Sprite).spriteFrame = this.ui.cardAltas.getSpriteFrame(name);
				if (this.model.roomValue.v_buyHorse == 1 && cards[i][j] == this.model.roomValue.v_buyHorseData) {
					node.children[j].children[0].active = true;
					node.children[j].color = cc.color(240, 241, 162);
				}
			}
		}

		if (this.model.userData.zongfen < 0) {
			this.ui.scorePanel.getComponent(cc.Label).font = this.ui.scoreFont[1];
			this.ui.scorePanel.getComponent(cc.Label).string = `${this.model.userData.zongfen}水`;
		} else {
			this.ui.scorePanel.getComponent(cc.Label).font = this.ui.scoreFont[0];
			this.ui.scorePanel.getComponent(cc.Label).string = `+${this.model.userData.zongfen}水`;
		}

		if (this.model.userData.isteshupaixing > 0) {
			this.ui.cardTypePanel.children[2].active = true;
			this.ui.cardTypePanel.children[2].getComponent(cc.Sprite).spriteFrame = this.ui.specialAltas.getSpriteFrame(this.model.userData.isteshupaixing);
		}
	}
}
//c, 控制
@ccclass
export default class sssSettleDetailItemCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property({
		tooltip: 'nameLbl',
		type: cc.Label
	})
	nameLbl: cc.Label = null;

	@property({
		tooltip: '牌节点',
		type: cc.Node
	})
	cardPanel: cc.Node = null;

	@property({
		tooltip: '牌型节点',
		type: cc.Node
	})
	cardTypePanel: cc.Node = null;

	@property({
		tooltip: '牌分节点',
		type: cc.Node
	})
	cardScorePanel: cc.Node = null;

	@property({
		tooltip: '总分',
		type: cc.Node
	})
	scorePanel: cc.Node = null;

	@property({
		tooltip: '总分字体',
		type: [cc.Font]
	})
	scoreFont: cc.Font[] = [];

	@property({
		tooltip: '牌图集',
		type: cc.SpriteAtlas
	})
	cardAltas: cc.SpriteAtlas = null;

	@property({
		tooltip: '房主标志',
		type: cc.Node
	})
	masterImg: cc.Node = null;

	@property({
		tooltip: '牌型图集',
		type: cc.SpriteAtlas
	})
	cardTypeAltas: cc.SpriteAtlas = null;

	@property({
		tooltip: '特殊牌型图集',
		type: cc.SpriteAtlas
	})
	specialAltas: cc.SpriteAtlas = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离
	userData: any = null;
	seatId: any = null;

	onLoad() {
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model, View);
	}

	//定义网络事件
	defineNetEvents() {

	}
	//定义全局事件
	defineGlobalEvents() {

	}
	//绑定操作的回调
	connectUi() {
	}
	start() {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
	init(value, seatid) {
		this.userData = value;
		this.seatId = seatid;
	}
}