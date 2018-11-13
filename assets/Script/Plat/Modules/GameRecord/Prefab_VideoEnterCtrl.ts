/*
author: HJB
日期:2018-03-17 12:23:09
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import GameCateCfg from "../../CfgMgrs/GameCateCfg";
import BunchInfoMgr from "../../GameMgrs/BunchInfoMgr";
import RecordMgr from "../../GameMgrs/RecordMgr";
import FrameMgr from "../../GameMgrs/FrameMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_VideoEnterCtrl;
//模型，数据处理
class Model extends BaseModel{
	private video_num:string = null;
	private club_id = null;
	constructor()
	{
		super();
		this.video_num = "";
	}
	public getVideoNum(){
		return this.video_num;
	}
	public setVideoNum(num){
		this.video_num = num;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		btn_close:null,
		btn_confirm:null,
		node_edit:null,
		edit_video:null
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
		this.ui.btn_close = ctrl.btn_close;
		this.ui.btn_confirm = ctrl.btn_confirm;
		this.ui.node_edit = ctrl.node_edit;
		this.ui.edit_video = this.ui.node_edit.getComponent(cc.EditBox);
	}

}
//c, 控制
@ccclass
export default class Prefab_VideoEnterCtrl extends BaseCtrl {
	//这边去声明ui组件

	@property(cc.Node)
	btn_close:cc.Node = null

	@property(cc.Node)
	btn_confirm:cc.Node = null

	@property(cc.Node)
	node_edit:cc.Node = null

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
		this.n_events={
			"http.reqMatchGameId":this.http_reqMatchGameId, 
		}
	}
	http_reqMatchGameId(msg)
	{
		let recordcode=this.model.getVideoNum();
		let game=GameCateCfg.getInstance().getGameById(msg.gameid);
 
		this.start_sub_module(G_MODULE.GameVideo,function(prefabComp,prefabNode){
			prefabComp.setRecordInfo(game,recordcode);
		}
		,'GameVideoCtrl');
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image, this.ui.btn_close,this.btn_close_cb,"退出");
		this.connect(G_UiType.image, this.ui.btn_confirm,this.btn_confirm_cb,"确认");	
		this.connect(G_UiType.edit, this.ui.node_edit,this.node_edit_cb,"监听输入框");	
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	
	private btn_close_cb(node, event){
		//console.log('btn_close_cb')
		this.finish();
	}

	private btn_confirm_cb(node, event){
		let recordcode=this.model.getVideoNum();
		if(recordcode.length<=0)
		{
			FrameMgr.getInstance().showTips('请输入录像码', null,35, cc.color(255,0,0), cc.p(0,0), "Arial", 1000); 
			return;
		}
		if(recordcode.length!=10)
		{	
			FrameMgr.getInstance().showTips('录像码长度为10位', null,35, cc.color(255,0,0), cc.p(0,0), "Arial", 1000);  
			return;
		}
		RecordMgr.getInstance().reqMatchRecord(recordcode);  
	}
	private node_edit_cb(str, event){
		//console.log("node_edit_cb");
		if (str == "editing-did-ended"){
			let content = this.ui.edit_video.string;
			this.model.setVideoNum(content);
		}
	}
	//end
}