/*
author: HJB
日期:2018-03-05 13:55:13
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

import BehaviorMgr from "../../GameMgrs/BehaviorMgr";
import BunchInfoMgr from "../../GameMgrs/BunchInfoMgr";
import GameCateCfg from "../../CfgMgrs/GameCateCfg";

const RECORD_PAY_NAME = {
	0:"房主支付",
	1:"AA支付",
	2:"赢家支付"
}

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Club_RecordStripCtrl;
//模型，数据处理
class Model extends BaseModel{
	private record_data = null;
	constructor()
	{
		super();
		this.record_data = BehaviorMgr.getInstance().getClubRecordData();
	}
	public getRecordData(){
		return this.record_data;
	}
	public getRoomType(){
		return this.record_data.type;
	}
	public getStrRecordType(){
		//console.log("getRecordDataType", this.record_data.type);
		let games = GameCateCfg.getInstance().getGameById(this.record_data.type);
		//console.log(games);
		let type_name = games.name;
		return type_name;
	}
	public getRoomName(){
		let count = this.record_data.memberlist.length;
		for (let i=0;i<count; i++){
			let data = this.record_data.memberlist[i];
			if (data.roomOwner == 1){
				if(data.name.length > 6){
					return data.name.substring(0,6);
				}else{
					return data.name;
				}				
			}
		}
		return "";
	}
	public getRoomPay(){
		let pay = RECORD_PAY_NAME[this.record_data.pay_type];
		return pay;
	}
	public getRoomPayCount(){
		return this.record_data.pay_count;
	}
	public getRoomTime(){
		return this.record_data.time;
	}
	public getRecordBunchid(){
		return this.record_data.bunchid
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		lable_type:null,
		lable_name:null,
		lable_pay:null,
		lable_pay_count:null,
		lable_time:null,
		btn_enter:null,
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
		this.ui.lable_type = ctrl.lable_type;
		this.ui.lable_name = ctrl.lable_name;
		this.ui.lable_pay = ctrl.lable_pay;
		this.ui.lable_pay_count = ctrl.lable_pay_count;
		this.ui.lable_time = ctrl.lable_time;
		this.ui.btn_enter = ctrl.btn_enter;

		this.refreshType();
		this.refreshName();
		this.refreshPay();
		this.refreshPayCount();
		this.refreshTime();
	}
	refreshType(){
		this.ui.lable_type.string = this.model.getStrRecordType();
	}
	refreshName(){
		this.ui.lable_name.string = this.model.getRoomName();
	}
	refreshPay(){
		this.ui.lable_pay.string = this.model.getRoomPay();
	}
	refreshPayCount(){
		this.ui.lable_pay_count.string = "*"+this.model.getRoomPayCount();
	}
	refreshTime(){
		this.ui.lable_time.string = this.model.getRoomTime();
	}
}
//c, 控制
@ccclass
export default class Club_RecordStripCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property(cc.Label)
	lable_type:cc.Label = null

	@property(cc.Label)
	lable_name:cc.Label = null

	@property(cc.Label)
	lable_pay:cc.Label = null

	@property(cc.Label)
	lable_pay_count:cc.Label = null

	@property(cc.Label)
	lable_time:cc.Label = null

	@property(cc.Node)
	btn_enter:cc.Node = null

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
		this.connect(G_UiType.image, this.ui.btn_enter,this.btn_enter_cb,"进入详情");
		
	}
	start () {
	}
	//网络事件回调begin

	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private btn_enter_cb(node, event){
		//console.log("btn_enter_cb");
		BunchInfoMgr.getInstance().reqGambleRecord(this.model.getRecordBunchid());
	}
	//end
}