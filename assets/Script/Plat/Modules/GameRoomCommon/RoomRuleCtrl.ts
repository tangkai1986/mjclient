/*
author: JACKY
日期:2018-03-07 14:47:59
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import ServerMgr from "../../../AppStart/AppMgrs/ServerMgr";
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_QzmjRuleCtrl;

// var ruleText = {
// 	1:{1:'关于金牌: ',2:' 金牌：相当于混牌，百搭，其功能是可以替代除花牌之外的任何牌金牌如何产生：翻金，庄家补牌结束后，跳牌处的人扔出两个骰子，根据点数从牌墙最后一张牌数数，最后落在哪张上翻开即为 金。 金牌可以为花牌，当金牌为黑花时，红花需要补牌，否则，黑花需要补牌。'},  
// 	2:{1:'关于单游：',2:'当手上拿金牌作为将牌的时候可以将一张将牌打出，这样在下一圈内摸到任何牌均可胡牌，此时胡牌陈为单游。'}, 
// 	3:{1:'关于双游： ',2:'如果单游时摸到的牌为金牌，此时可以将金牌打出，金牌打出后，开始双游,本圈内所有玩家都只能自摸，不能吃胡。'}, 
// 	4:{1:'关于三游： ',2:'双游时如果继续摸到金牌，此时仍旧将金牌打出，视为三游，三游时其他玩家不允许摸牌，三游的玩家直接胡牌'},
// }

//模型，数据处理
class Model extends BaseModel{
	constructor()
	{
		super();

	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		BtnExit:null,
		BtnOpen:null,
		BtnRetract:null,
		content:null,
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
		this.addGrayLayer(); 
	}
	//初始化ui
	initUi()
	{
		this.ui.BtnExit = ctrl.BtnExit; 
		this.ui.BtnOpen = ctrl.BtnOpen;
		this.ui.BtnRetract = ctrl.BtnRetract;
		this.ui.content = ctrl.content;
		
	}
	//2为展开 1为收起
	showContent(type){
		let url=ServerMgr.getInstance().getGameRuleUrl('qzmj',type);
		//this.ui.web_down_content.url = url 
		if(type==1){
			this.ui.content.url = url;
			this.ui.BtnOpen.active = true;
			this.ui.BtnRetract.active = false; 
		}
		else {
			this.ui.content.url = url;
			this.ui.BtnOpen.active = false;
			this.ui.BtnRetract.active = true; 
		}
	}
}
//c, 控制
@ccclass
export default class Prefab_QzmjRuleCtrl extends BaseCtrl {
	view:View = null
	model:Model = null
	//这边去声明ui组件
	@property({
		tooltip : "关闭按钮",
		type : cc.Node
	})
	BtnExit : cc.Node = null;

	@property({
		tooltip : "展开按钮",
		type : cc.Node
	})
	BtnOpen : cc.Node = null;

	@property({
		tooltip : "收起按钮",
		type : cc.Node
	})
	BtnRetract : cc.Node = null;

	@property({
		tooltip : "规则内容",
		type : cc.WebView
	})
	content : cc.WebView = null;

	@property({
		tooltip : "内容预制体",
		type : cc.Prefab
	})
	Prefab_autograph : cc.Prefab = null;

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
		this.connect(G_UiType.image, this.ui.BtnExit, this.onBtnExit_cb, '退出房间')
		this.connect(G_UiType.button, this.ui.BtnOpen, this.onBtnOpen_cb, '展开规则')
		this.connect(G_UiType.button, this.ui.BtnRetract, this.onBtnRetract_cb, '收起规则')
	}
	start () {
		this.view.showContent(1);
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	onBtnExit_cb(event){
		this.finish();
	}
	onBtnOpen_cb(event){
		//展开
		this.view.showContent(2);
	}
	onBtnRetract_cb(event){
		this.view.showContent(1);
	}
	//end
}