/*
author: Justin
日期:2018-01-15 20:17:05
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_SignInCtrl;
//模型，数据处理
class Model extends BaseModel{
	GiftData : any;
	constructor()
	{
		super();
		this.GiftData = [
			{
				date : "一",
				count : 200,
				get : true
			},
			{
				date : "二",
				count : 500,
				get : false
			},
			{
				date : "三",
				count : 1200,
				get : false
			},
			{
				date : "四",
				count : 1500,
				get : false
			},
			{
				date : "五",
				count : 1700,
				get : false
			},
			{
				date : "六",
				count : 2000,
				get : false
			},
			{
				date : "七",
				count : 3000,
				get : false
			},
		];
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		layer_Gift : null,
		layer_Gift1 : null,
		prefab_Gift : null,
		btn_GetGift : null,
		btn_StartGame : null,
	};
	node=null;
	model=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.model=model;
		this.initUi();
		this.addGrayLayer();
	}
	//初始化ui
	initUi()
	{
		this.ui.layer_Gift = ctrl.GiftLayer;
		this.ui.layer_Gift1 = ctrl.GiftLayer1;
		this.ui.prefab_Gift = ctrl.PrefabGift;
		this.ui.btn_GetGift = ctrl.GetGiftBtn;
		this.ui.btn_StartGame = ctrl.StartGameBtn;
		for (let i = 0; i < this.model.GiftData.length; i ++) {
			let layer = this.ui.layer_Gift;
			if (i > 3) {
				layer = this.ui.layer_Gift1;
			}
			let node = cc.instantiate(this.ui.prefab_Gift);
			layer.addChild(node);
			node.getChildByName("label_Date").getComponent(cc.Label).string = "第"+this.model.GiftData[i].date+"天";
			node.getChildByName("label_Diamond").getComponent(cc.Label).string = this.model.GiftData[i].count;
			if (this.model.GiftData[i].get == true) {
				node.getChildByName("img_Getted").active = true;
				this.updateGift(i);
			} else {
				node.getChildByName("img_Getted").active = false;
			}
		}
		this.ui.btn_StartGame.active = false;
	}

	updateGift (id : number) : void {
		if (id > 3) {

		}
		let nodes = this.ui.layer_Gift.children;
		for (let i in nodes) {
			let childs = nodes[i].children;
			for (let j in childs) {
				childs[j].color = cc.Color.GRAY;
			}
		}
	}
}
//c, 控制
@ccclass
export default class Prefab_SignInCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property({
		tooltip : "关闭按钮",
		type : cc.Node
	})
	CloseBtn : cc.Node = null;

	@property({
		tooltip : "领取签到礼物",
		type : cc.Node
	})
	GetGiftBtn : cc.Node = null;

	@property({
		tooltip : "开始游戏",
		type : cc.Node
	})
	StartGameBtn : cc.Node = null;

	@property({
		tooltip : "领取的第一层Layer1",
		type : cc.Node
	})
	GiftLayer : cc.Node = null;

	@property({
		tooltip : "领取的第二层Layer2",
		type : cc.Node
	})
	GiftLayer1 : cc.Node = null;

	@property({
		tooltip : "奖励预制资源",
		type : cc.Prefab
	})
	PrefabGift : cc.Prefab = null;

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
		this.connect(G_UiType.image, this.CloseBtn, this.CloseBtn_cb.bind(this), "关闭");
		this.connect(G_UiType.image, this.GetGiftBtn, this.GetGift_cb.bind(this), "领取");
		this.connect(G_UiType.image, this.StartGameBtn, this.StartGame_cb.bind(this), "开始游戏");
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private CloseBtn_cb () : void {
		this.finish();
	}

	private GetGift_cb () : void {
		
	}

	private StartGame_cb () : void {
		this.finish();
	}
	//end
}