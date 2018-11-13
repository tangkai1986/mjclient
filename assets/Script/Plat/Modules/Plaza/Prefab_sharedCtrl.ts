/*
author: YOYO
日期:2018-01-12 11:02:08
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import WxSdkMgr from "../../SdkMgrs/WxSdk";
import FrameMgr from "../../GameMgrs/FrameMgr";
import RoomMgr from "../../GameMgrs/RoomMgr";
import ShareMgr from "../../GameMgrs/ShareMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_sharedCtrl;
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
		node_friendCircle:null,
		node_click:null,
		node_weixin:null,
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
		this.ui.node_click = ctrl.node_click;
		this.ui.node_weixin = ctrl.node_weixin;
		this.ui.node_friendCircle = ctrl.node_friendCircle;
	}
}
//c, 控制
@ccclass
export default class Prefab_sharedCtrl extends BaseCtrl {
	//这边去声明ui组件
    @property(cc.Node)
    node_weixin:cc.Node = null

    @property(cc.Node)
	node_friendCircle:cc.Node = null
	
    @property(cc.Node)
    node_click:cc.Node = null
    
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
        this.connect(G_UiType.image, this.node_weixin, this.node_weixin_cb, '点击微信好友分享')
        this.connect(G_UiType.image, this.node_friendCircle, this.node_friendCircle_cb, '点击朋友圈分享')
        this.connect(G_UiType.image, this.node_click, this.node_close_cb, '点击关闭')
	}
	start () {
	}
	//网络事件回调begin	
	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin
    
    private node_close_cb(event){
        //console.log('node_close_cb',ShareMgr.getInstance().shareButtonFlag)
		ShareMgr.getInstance().shareButtonFlag=false;
        this.finish();
    }
    private node_weixin_cb(event){
		//console.log('node_weixin_cb',ShareMgr.getInstance().shareButtonFlag);
		// p
		if (cc.sys.isNative)
        {				
			this.finish();	
			if(ShareMgr.getInstance().shareButtonFlag) {
				G_PLATFORM.wxShareSpecificImage(G_PLATFORM.WX_SHARE_TYPE.WXSceneSession,'resources/Share/img_share.jpg');
			}
			else{	
				G_PLATFORM.wxShareImage(G_PLATFORM.WX_SHARE_TYPE.WXSceneSession);
			}		
		}
    }
    private node_friendCircle_cb(event){
        //console.log('node_phone_cb',ShareMgr.getInstance().shareButtonFlag)
        if (cc.sys.isNative)
        {
        	this.finish();
			if(ShareMgr.getInstance().shareButtonFlag) {
				G_PLATFORM.wxShareSpecificImage(G_PLATFORM.WX_SHARE_TYPE.WXSceneTimeline,'resources/Share/img_share.jpg');	
			}
			else{
				G_PLATFORM.wxShareImage(G_PLATFORM.WX_SHARE_TYPE.WXSceneTimeline);
			}			
		}
	}

	//end
}