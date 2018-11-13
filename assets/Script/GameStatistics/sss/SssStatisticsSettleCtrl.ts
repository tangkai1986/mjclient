import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import BaseModel from "../../Plat/Libs/BaseModel";
import BaseView from "../../Plat/Libs/BaseView";
import UiMgr from "../../Plat/GameMgrs/UiMgr"; 
import BunchInfoMgr from "../../Plat/GameMgrs/BunchInfoMgr";
import viewLogicSeatConvertMgr from "../../Plat/GameMgrs/viewLogicSeatConvertMgr";

//MVC模块,
const { ccclass, property } = cc._decorator;
let ctrl: Prefab_SssSettleTotalCtrl;
//模型，数据处理
class Model extends BaseModel {
	bunchInfo = null;
	datas = null;
	mySeatId = null;
	owner = null;
	roomValue = null;
	costList = null;
	users = null;
	constructor() {
		super();
		this.bunchInfo = BunchInfoMgr.getInstance().getBunchInfo();
		this.datas = this.bunchInfo.leiji;
		this.owner = this.bunchInfo.roomOwner;
		this.roomValue = this.bunchInfo.roomValue;
		this.costList = this.bunchInfo.costs;
		this.mySeatId = viewLogicSeatConvertMgr.getInstance().myseatid;
		this.users = BunchInfoMgr.getInstance().getMembelist();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	model: Model;
	ui = {
		//在这里声明ui
		item: ctrl.item,
		titleAltas: ctrl.titleAltas
	};
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi() {
		for (let key = 0; key < BunchInfoMgr.getInstance().getSeatCount(); ++key) {
			let itemData = this.model.datas[key.toString()];
			if (!itemData) continue;
			let user = this.model.users[key];
			if (!user) continue;
			let curNode = key == this.model.mySeatId ? this.node.children[0] : (() => {
				var node = cc.instantiate(this.ui.item);
				this.node.addChild(node);
				node.getChildByName('payCount').active = false;
				return node;
			})();
			curNode.active = true;
			curNode.getChildByName('fangzhu').active = (user.id == this.model.owner) || user.bowner;
			curNode.getChildByName('ID').getComponent(cc.Label).string = user.logicid;
			if (itemData.zongshuying >= 0) {
				curNode.getChildByName('totalScore').color = cc.color(185, 56, 43);
				curNode.getChildByName('totalScore').getComponent(cc.Label).string = `+${itemData.zongshuying}`;
			} else {
				curNode.getChildByName('totalScore').color = cc.color(56, 185, 43);
				curNode.getChildByName('totalScore').getComponent(cc.Label).string = itemData.zongshuying;
			}
			UiMgr.getInstance().setUserHead(curNode.getChildByName('headImg'), (user.headid || (typeof user.url == "number" && user.url)), (user.headurl || (typeof user.url == "string" && user.url)));
			curNode.getChildByName('name').getComponent(cc.Label).string = user.nickname.length > 6 ? `${user.nickname.substring(0, 5)}...` : user.nickname;
			curNode.getChildByName('logo').active = true;
			curNode.getChildByName('logo').getComponent(cc.Sprite).spriteFrame = this.ui.titleAltas.getSpriteFrame(`title_${itemData.biaoqian}`);
			if (this.model.roomValue.v_paytype == 2 && itemData.zongshuying > 0) {
				curNode.getChildByName('payCount').active = true;
				curNode.getChildByName('payCount').getComponent(cc.Label).string = this.model.costList[user.id];
			}
		}
	}
}
//c, 控制
@ccclass
export default class Prefab_SssSettleTotalCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property({
		tooltip: "item预制",
		type: cc.Node
	})
	item: cc.Node = null;

	@property({
		tooltip: '称号图集',
		type: cc.SpriteAtlas
	})
	titleAltas: cc.SpriteAtlas = null;
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
