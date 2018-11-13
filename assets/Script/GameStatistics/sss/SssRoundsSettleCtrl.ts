import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import BaseModel from "../../Plat/Libs/BaseModel";
import BaseView from "../../Plat/Libs/BaseView";
import { SssDef } from "../../Games/Sss/SssMgr/SssDef";
import BunchInfoMgr from "../../Plat/GameMgrs/BunchInfoMgr";

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: Prefab_SssSettleRoundCtrl;
//模型，数据处理
class Model extends BaseModel {
	roundData = null;
	constructor() {
		super();
		this.roundData = BunchInfoMgr.getInstance().getBunchInfo().meiju;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	model: Model;
	ui = {
		//在这里声明ui
		content: ctrl.content,
		item: ctrl.item
	};
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi() {
		for (let i = 0; i < this.model.roundData.length; ++i) {
			let newNode = cc.instantiate(this.ui.item);
			newNode.getComponent('SssSettleRoundItemCtrl').init(this.model.roundData[i][1], i);
			this.ui.content.addChild(newNode);
		}
	}
}
//c, 控制
@ccclass
export default class Prefab_SssSettleRoundCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property({
		tooltip: "内容节点",
		type: cc.Node
	})
	content: cc.Node = null;

	@property({
		tooltip: "item预制",
		type: cc.Prefab
	})
	item: cc.Prefab = null;
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

	}
	start() {

	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
}