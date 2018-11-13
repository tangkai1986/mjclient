import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import BaseModel from "../../Plat/Libs/BaseModel";
import BaseView from "../../Plat/Libs/BaseView";
import { SssDef } from "../../Games/Sss/SssMgr/SssDef";
import BunchInfoMgr from "../../Plat/GameMgrs/BunchInfoMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : SssSettleRoundItemCtrl;
//模型，数据处理
class Model extends BaseModel{
	roundData = null;
	round = null
	constructor()
	{
		super();
		this.roundData = ctrl.roundData;
		this.round = ctrl.round;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	model: Model;
	ui={
		//在这里声明ui
		titleLbl: ctrl.titleLbl,
		arrowBtn: ctrl.arrowBtn,
		singlePanel: ctrl.singlePanel,
		detailPanel: ctrl.detailPanel,
		singleItem: ctrl.singleItem,
		detailItem: ctrl.detailItem
	};
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
		this.refreshTitle();
	}
	//初始化ui
	initUi()
	{
		for(let i = 0; i < BunchInfoMgr.getInstance().getSeatCount(); ++i){
			let userData = this.model.roundData[i.toString()];
			if(!userData) continue;
			let users = BunchInfoMgr.getInstance().getMembelist();
			if(!users[i]) continue;
			let singleItem = cc.instantiate(this.ui.singleItem);
			singleItem.getChildByName('name').getComponent(cc.Label).string = users[i].nickname.length > 5 ? `${users[i].nickname.substring(0,5)}...` : users[i].nickname;
			if(userData.zongfen >= 0) {
				singleItem.getChildByName('score').children[0].getComponent(cc.Label).string = `+${userData.zongfen}`;
			} else {
				singleItem.getChildByName('score').children[0].color = cc.color(56, 185, 43);
				singleItem.getChildByName('score').children[0].getComponent(cc.LabelOutline).color = cc.color(56, 185, 43);
				singleItem.getChildByName('score').children[0].getComponent(cc.Label).string = userData.zongfen;
			}
			if(userData.xiazhubeizhu != null){
				singleItem.getChildByName('score').children[1].active = true;
				singleItem.getChildByName('score').children[1].getComponent(cc.Label).string = `(${userData.xiazhubeizhu}倍)`;
			}
			if(userData.isteshupaixing > 0){
				singleItem.getChildByName('paixing').active = true;
				singleItem.getChildByName('paixing').getComponent(cc.Label).string = SssDef.specialCardNames[userData.isteshupaixing];
			}
			singleItem.getChildByName('fengexian').active = i == 0;
			this.ui.singlePanel.addChild(singleItem);

			let detailItem = cc.instantiate(this.ui.detailItem);
			detailItem.getComponent('sssSettleDetailItemCtrl').init(userData, i);
			this.ui.detailPanel.addChild(detailItem);
		}
	}

	refreshTitle() {
		let round = this.model.round + 1;
		if(round <= 10) {
			this.ui.titleLbl.string = `第${SssDef.chineseNumber[round]}局`;
		} else if (round > 10 && round < 20) {
			this.ui.titleLbl.string = `第十${SssDef.chineseNumber[round % 10]}局`;
		} else {
			this.ui.titleLbl.string = `第${SssDef.chineseNumber[parseInt(round / 10)]}十${SssDef.chineseNumber[round % 10]}局`;
		}
	}
}
//c, 控制
@ccclass
export default class SssSettleRoundItemCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property({
		tooltip: '标题',
		type: cc.Label
	})
	titleLbl: cc.Label = null;

	@property({
		tooltip: '箭头按钮',
		type: cc.Node
	})
	arrowBtn: cc.Node = null;

	@property({
		tooltip: '简单信息父节点',
		type: cc.Node
	})
	singlePanel: cc.Node = null;

	@property({
		tooltip: '简单信息item',
		type: cc.Prefab
	})
	singleItem: cc.Prefab = null;

	@property({
		tooltip: '详细信息父节点',
		type: cc.Node
	})
	detailPanel: cc.Node = null;

	@property({
		tooltip: '详细信息item',
		type: cc.Prefab
	})
	detailItem: cc.Prefab = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离
	roundData: any = null;
	round: any = null;

	onLoad() {
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model,View);
	}

	//定义网络事件
	defineNetEvents()
	{

	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
		this.node.on('touchend', this.touchEnd, this);
	}
	start () {

	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	touchEnd () {
		if (this.ui.arrowBtn.scaleY < 0) {
			this.ui.singlePanel.active = false;
			this.ui.detailPanel.active = true;
			this.ui.arrowBtn.scaleY = 1;
		} else {
			this.ui.singlePanel.active = true;
			this.ui.detailPanel.active = false;
			this.ui.arrowBtn.scaleY = -1;
		}
		
	}
	//end
	init(value, round) {
		this.roundData = value;
		this.round = round;
	}
}