/*
author: JACKY
日期:2018-04-16 15:23:15
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import ServerMgr from "../../../AppStart/AppMgrs/ServerMgr";
import UserMgr from "../../GameMgrs/UserMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : GameVideoCtrl;
//模型，数据处理
class Model extends BaseModel{
	public gamename = null;
	public recordcode = null;
	public loadurl = null;
	constructor()
	{
		super();

	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		btn_share_video: null,
		btn_exit:null,
		video_view:null,
	};
	node:cc.Node
	model:Model
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
		this.addGrayLayer();
		this.ui.btn_share_video = ctrl.btn_share_video;
		this.ui.btn_exit = ctrl.btn_exit;
		this.ui.video_view = ctrl.video_view;
	}
}
//c, 控制
@ccclass
export default class GameVideoCtrl extends BaseCtrl {
	view:View
	model:Model
	//这边去声明ui组件

	@property(cc.Node)
	btn_share_video:cc.Node = null

	@property(cc.Node)
	btn_exit:cc.Node = null

	@property(cc.WebView)
	video_view:cc.WebView = null
	
	// @property(cc.Prefab)
	// prefab_video_replay:cc.Prefab = null
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
		this.connect(G_UiType.image, this.ui.btn_share_video, this.btn_share_video_cb, '点击分享录像')
        this.connect(G_UiType.image, this.ui.btn_exit, this.btn_exit_cb, '点击关闭')
	}
	start () {
	}
	setRecordInfo(game,recordcode)
	{
		let url=ServerMgr.getInstance().getGameVideoUrl(game.code,recordcode); 
		//console.log("url=",url);
		this.ui.video_view.url = url; 
		this.model.gamename=game.name;
		this.model.recordcode = recordcode;
		this.model.loadurl = url;
	}
	//点击分享录像
    private btn_share_video_cb(node){
		//console.log('btn_share_video_cb')
		if (cc.sys.isNative)
			{
				let userinfo=UserMgr.getInstance().getMyInfo();
				G_PLATFORM.wxShareContent(0,`${userinfo.nickname}分享了${this.model.gamename}录像`,`录像编号：${this.model.recordcode}`, this.model.loadurl);
			}
    }
    //点击关闭
    private btn_exit_cb(node){
        //console.log('btn_exit_cb')
        this.finish();
    }
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
}