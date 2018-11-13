import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_AnnouncementPanelCtrl;
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
		closeBtn: ctrl.closeBtn,
		webPage_content:ctrl.webPage_content,
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
		this.initWebView()
	}
	//禁止IOS上网页的拖动回弹效果
	initWebView(){
		if(cc.sys.os == cc.sys.OS_IOS && this.ui.webPage_content.setBounces!= null){
			this.ui.webPage_content.setBounces(false);
		}
	}
}
//c, 控制
@ccclass
export default class Prefab_AnnouncementPanelCtrl extends BaseCtrl {
	view:View = null
	model:Model = null
	//这边去声明ui组件
	@property({
		tooltip: '关闭按钮',
		type: cc.Node
	})
	closeBtn: cc.Node = null;
	@property(cc.WebView)
	webPage_content:cc.WebView = null;
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
		this.g_events={
			'ge_close_gonggao':this.ge_close_gonggao, 
			'backPressed':this.backPressed,
		} 
	}
	backPressed(){
		this.finish();
	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.button, this.ui.closeBtn, this.finish, `关闭公告界面`);
	}
	start () {
	}
	ge_close_gonggao()
	{
		//console.log("ge_close_gonggao");
		
		this.finish();
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
}