import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UserMgr from "../../GameMgrs/UserMgr";
import TaskMgr from "../../GameMgrs/TaskMgr";
import Prefab_shopCtrl from "../Shop/Prefab_shopCtrl";
import FirstChargeTaskMgr from "../../GameMgrs/FirstChargeTaskMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_FirstChargeTaskCtrl;
//模型，数据处理
class Model extends BaseModel{
	public isFirstRecharge=null;
	constructor()
	{
		super();
		this.updateFirstRecharge()
	}

	updateFirstRecharge(){
		this.isFirstRecharge = UserMgr.getInstance().getMyInfo().is_get_reward;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		chargeBtn: ctrl.chargeBtn,
		rewardBtn:ctrl.rewardBtn,
		
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
		this.updateFirstBtn();
	}
	updateButton(){
		let sprite = this.ui.chargeBtn.getComponentInChildren(cc.Sprite);
		let imagePath = 'Plat/items/img_xzjq'
		cc.loader.loadRes(imagePath, cc.SpriteFrame, function (err, spriteFrame) {
                if (err) return cc.error("no find image path: %s", imagePath)
                sprite.spriteFrame = spriteFrame
        });
	}
	//切换首充按钮与领取按钮
	updateFirstBtn(){
		if(this.model.isFirstRecharge == 0){
			this.ui.chargeBtn.active = true;
			this.ui.rewardBtn.active = false;
		}else if(this.model.isFirstRecharge == 1){
			this.ui.chargeBtn.active = false;
			this.ui.rewardBtn.active = true;
		}
	}
}
//c, 控制
@ccclass
export default class Prefab_FirstChargeTaskCtrl extends BaseCtrl {
	view:View = null
	model:Model = null
	//这边去声明ui组件
	@property({
		tooltip:'充值按钮',
		type:cc.Node
	})
	chargeBtn: cc.Node = null;
	@property({
		tooltip:'领取奖励按钮',
		type:cc.Node
	})
	rewardBtn: cc.Node = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
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
		this.connect(G_UiType.button, this.ui.chargeBtn, this.chargeBtnCB, "点击前往充值");
		this.connect(G_UiType.button, this.ui.rewardBtn, this.rewardBtnCB, "领取首充奖励");
	}

	start () {
	}

	chargeBtnCB () {
		this.start_sub_module(G_MODULE.Shop);
		TaskMgr.getInstance().closeTaskPanel();
	}
	rewardBtnCB(){
		FirstChargeTaskMgr.getInstance().FirstCharge();
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
}