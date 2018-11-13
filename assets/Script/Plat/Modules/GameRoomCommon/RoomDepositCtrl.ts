/*
author: JACKY
日期:2018-01-12 16:08:12
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UiMgr from "../../GameMgrs/UiMgr";
import ModuleMgr from "../../GameMgrs/ModuleMgr";
import RoomMgr from "../../GameMgrs/RoomMgr"; 
import UserMgr from "../../GameMgrs/UserMgr"; 
import FrameMgr from "../../GameMgrs/FrameMgr";


//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : QzmjDepositCtrl;
//模型，数据处理
class Model extends BaseModel{
	mahjongResMgr=RoomMgr.getInstance().getResMgr();
	mahjongLogic=RoomMgr.getInstance().getLogic();
	mahjongDef=RoomMgr.getInstance().getDef();
	mahjongAudio=RoomMgr.getInstance().getAudio();
	constructor()
	{
		super();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		btn_quxiaotuoguan:null,
	}; 
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
		this.node.active=false; 
		this.ui.btn_quxiaotuoguan=ctrl.btn_quxiaotuoguan;
	}
	show(bShow=true){
		this.node.active=bShow;
	}
}
//c, 控制
@ccclass
export default class QzmjDepositCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property(cc.Node)
    btn_quxiaotuoguan=null;
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
			//网络消息监听列表
			onDeposit:this.onDeposit,
			onProcess:this.onProcess,
			'onGameFinished':this.onGameFinished,
		}
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image,this.ui.btn_quxiaotuoguan,this.btn_quxiaotuoguan_cb,'取消托管')
	}
	start () {
	}
	//网络事件回调begin

	onGameFinished(){
		// body
		this.view.show(false);
	}
	onProcess(msg){
		// body 
		if (msg.process==this.model.mahjongDef.process_ready ){ 
			this.view.show(false)
		}
	}
	//托管
	onDeposit(msg){
		// body 
		this.view.show(msg.deposit); 
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
	//构造函数
 
 
	btn_quxiaotuoguan_cb(){
		this.model.mahjongLogic.getInstance().tuoGuan(false)
	}  
}