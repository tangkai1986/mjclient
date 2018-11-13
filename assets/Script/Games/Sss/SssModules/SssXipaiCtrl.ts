import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";
import LocalStorage from "../../../Plat/Libs/LocalStorage";

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: SssXipaiCtrl;
//模型，数据处理
class Model extends BaseModel {
	cardBgState: number = 3;
	constructor() {
		super();
		this.updateCardBg();
	}

	updateCardBg() {
		this.cardBgState = LocalStorage.getInstance().getSssCardBGCfg() || 3;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	model: Model;
	ui = {
		//在这里声明ui
		cards: ctrl.cards,
		cardAtlas: ctrl.cardAtlas
	};

	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi() {
		this.updateCardBg();
	}

	updateCardBg() {
		for (let i = 0; i < 6; ++i) {
			let bgName = this.model.cardBgState == 3 ? 'bull1_0x00' : `bull1_0x00_${this.model.cardBgState}`;
			this.ui.cards[i].spriteFrame = this.ui.cardAtlas.getSpriteFrame(bgName);
		}
	}
}
//c, 控制
@ccclass
export default class SssXipaiCtrl extends BaseCtrl {
	model: Model;
	view: View;
	//这边去声明ui组件
	@property({
		tooltip: "牌",
		type: [cc.Sprite]
	})
	cards: cc.Sprite[] = [];

	@property({
		tooltip: "牌图集",
		type: cc.SpriteAtlas
	})
	cardAtlas: cc.SpriteAtlas = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


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
		this.g_events = {
			"sss_changeCardBg": this.sss_changeCardBg
		}
	}
	//绑定操作的回调
	connectUi() {

	}
	start() {

	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	sss_changeCardBg() {
		this.model.updateCardBg();
		this.view.updateCardBg();
	}
	//end
	//按钮或任何控件操作的回调begin
	//end
}