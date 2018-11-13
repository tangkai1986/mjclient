
/*
author: YOYO
日期:2018-05-03 16:10:25
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
const CompetitionType = {
	"btn_lianxi": 0,
	"btn_hongbao": 1,
	"btn_dajiang": 2,
	"btn_club": 3,
}
//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: Prefab_CompetitionPanelCtrl;
//模型，数据处理
class Model extends BaseModel {
	public gameType = null;
	constructor() {
		super();

	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	ui = {
		//在这里声明ui
		ButtonList: null,
		btn_close: ctrl.btn_close,
		lianxisaiView: ctrl.lianxisaiView,
		hongbaosaiView: ctrl.hongbaosaiView,
		dajiangsaiView: ctrl.dajiangsaiView,
		clubsaiView: ctrl.clubsaiView,
		buttonFather: ctrl.buttonFather,
		scrollPage: ctrl.scrollPage,
	};
	node: cc.Node
	model: Model
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
		this.addGrayLayer();
	}

	//显示指定的页面
	showScroll() {
		switch (this.model.gameType) {
			case 0: this.addItem(this.ui.lianxisaiView); break;
			case 1: this.addItem(this.ui.hongbaosaiView); break;
			case 2: this.addItem(this.ui.dajiangsaiView); break;
			case 3: this.addItem(this.ui.clubsaiView); break;
		}
	}
	addItem(pre) {
		this.ui.scrollPage.removeAllChildren();
		let item = cc.instantiate(pre);
		item.parent = this.ui.scrollPage;
	}
	//初始化ui
	initUi() {
		this.addGrayLayer();
		this.ui.ButtonList = this.ui.buttonFather.children;
	}
}
//c, 控制
@ccclass
export default class Prefab_CompetitionPanelCtrl extends BaseCtrl {
	view: View
	model: Model
	//这边去声明ui组件
	@property(cc.Node)
	btn_close: cc.Node = null;
	@property(cc.Prefab)
	lianxisaiView: cc.Prefab = null;
	@property(cc.Prefab)
	hongbaosaiView: cc.Prefab = null;
	@property(cc.Prefab)
	dajiangsaiView: cc.Prefab = null;
	@property(cc.Prefab)
	clubsaiView: cc.Prefab = null;
	@property(cc.Node)
	buttonFather: cc.Node = null;
	@property(cc.Node)
	scrollPage: cc.Node = null;
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

	}
	//绑定操作的回调
	connectUi() {
		this.connect(G_UiType.button, this.ui.btn_close, this.btn_close_cb, '点击关闭')
		for (let i = 0; i < this.ui.ButtonList.length; i++) {
			this.connect(G_UiType.button, this.ui.ButtonList[i], this.ButtonList_cb, '点击切换按钮')
		}
	}
	start() {

	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	btn_close_cb() {
		this.finish();
	}

	ButtonList_cb(event) {
		let btn_name = event.currentTarget.name;
		this.model.gameType = CompetitionType[btn_name];
		this.view.showScroll();
	}
	//end
}