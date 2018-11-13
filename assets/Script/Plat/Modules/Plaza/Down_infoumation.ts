/*
author: JACKY
日期:2018-01-10 17:17:40
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UiMgr from "../../GameMgrs/UiMgr";
import UserMgr from "../../GameMgrs/UserMgr";
import ModuleMgr from "../../GameMgrs/ModuleMgr";
import WxSdkMgr from "../../SdkMgrs/WxSdk"
import TaskMgr from "../../GameMgrs/TaskMgr";
import MailMgr from "../../GameMgrs/MailMgr";
import SwitchMgr from "../../GameMgrs/SwitchMgr";
import redPushMgr from '../../GameMgrs/redPushMgr';


//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : NodeBottomCtrl;
//模型，数据处理
class Model extends BaseModel{
	public shopSwitch = null;
	public welfareRed = null
	public mailRed = null
	public myinfo = null;
	constructor()
	{
		super();
		this.shopSwitch = SwitchMgr.getInstance().get_switch_shop();
		this.updateRedPush()
	}
	updateSwitch(msg){
		this.shopSwitch = msg.cfg.switch_shop;
	}
	updateRedPush(){
		this.welfareRed = redPushMgr.getInstance().getwelfareRed();
		this.mailRed = redPushMgr.getInstance().getMailRed();
	}
	getMyInfo()
	{
		this.myinfo = UserMgr.getInstance().getMyInfo();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        btn_shop:ctrl.btn_shop,
		btn_welfare:ctrl.btn_welfare,
        btn_mail:ctrl.btn_mail,
        btn_more:ctrl.btn_more,
		welfareRed:ctrl.welfareRed,
		mailRed:ctrl.mailRed,
		btn_zhanji:ctrl.btn_zhanji,
		node_diamondTip:ctrl.node_diamondTip,
	};
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
		this.ui.btn_shop.active = false;
		this.showShop();
		this.updateRedState();
		
	}
	//红点初始化
	updateRedState(){
		//this.ui.welfareRed.active = this.model.welfareRed;
		//this.ui.mailRed.active = this.model.mailRed;
	}
	updateMailRed(bool){
		//this.ui.mailRed.active = bool;
	}
	updateDailyRed(bool){
		//this.ui.welfareRed.active = bool;
	}
	//开关控制
	showShop(){
		this.ui.btn_shop.active = this.model.shopSwitch==1?true:false;
	}
	hideDiamondTip()
	{
		this.ui.node_diamondTip.active = false;
	}
	disableBtn_welfare()
	{
		this.ui.btn_welfare._isTouchEnabledEx = false;
	}
}
//c, 控制
@ccclass
export default class NodeBottomCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property(cc.Node)
	btn_shop:cc.Node = null;

    @property(cc.Node)
    btn_welfare:cc.Node = null;

	@property(cc.Node)
	btn_mail:cc.Node = null;

	@property(cc.Node)
	btn_more:cc.Node = null;
	@property(cc.Node)
	btn_zhanji:cc.Node = null;

	@property({
    	tooltip : '福利红点标识',
    	type : cc.Node
    })
	welfareRed: cc.Node = null;
	@property({
    	tooltip : '送钻石提示',
    	type : cc.Node
    })
	node_diamondTip: cc.Node = null;
	
	@property({
    	tooltip : '邮件红点标识',
    	type : cc.Node
    })
    mailRed: cc.Node = null;
 
	
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离

	onLoad (){
		//创建mvc模式中模型和视图-0
		//控制器
		ctrl = this;
		//初始化mvc
		this.initMvc(Model,View);
	}

	//定义网络事件
	defineNetEvents()
	{
		this.n_events={
			'http.reqGameSwitch':this.http_reqGameSwitch,
			'http.reqUnread':this.http_reqUnread,
            'http.reqMyInfo':this.http_reqMyInfo, 

        }
	}
	//定义全局事件
	defineGlobalEvents()
	{
		this.g_events = {
			mailRedPush_update:this.mailRedPush_update,//更新邮件红点
			welfareRedPush_update:this.welfareRedPush_update,//更新福利红点
			closBindAgent:this.closBindAgent,
		}
	}
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.button,this.ui.btn_shop,this.btn_shop_cb,"点击商城");
        this.connect(G_UiType.button,this.ui.btn_welfare,this.btn_welfare_cb,"点击福利");
        this.connect(G_UiType.button,this.ui.btn_mail,this.btn_mail_cb,"点击邮件");
        this.connect(G_UiType.button,this.ui.btn_more,this.btn_more_cb,"点击更多");
        this.connect(G_UiType.button,this.ui.btn_zhanji,this.btn_zhanjicb,"点击战绩");
	}
	start () {

	}
	//进入游戏时初始化红点状态
	http_reqUnread(){
		this.model.updateRedPush();
		this.view.updateRedState();
	}
	http_reqMyInfo()
	{
		this.model.getMyInfo();
		if(this.model.myinfo.promoters_id && this.model.myinfo.promoters_id!=0) {
			this.view.hideDiamondTip();
			this.view.disableBtn_welfare();
		}
	}
	//网络事件回调begin
	http_reqGameSwitch(msg){
		this.model.updateSwitch(msg);
		this.view.showShop();
	}
	//end
	//全局事件回调begin

	//更新红点状态
	mailRedPush_update(bool){
		this.view.updateMailRed(bool);
	}
	welfareRedPush_update(bool){
		this.view.updateDailyRed(bool);
	}
	private closBindAgent():void{
		this.view.hideDiamondTip();
		this.view.disableBtn_welfare();
	}
	// }
	//end
	//按钮或任何控件操作的回调begin
	private btn_shop_cb (event){
        this.start_sub_module(G_MODULE.Shop);
	}
    private btn_welfare_cb (event) {
        this.start_sub_module(G_MODULE.bindAgent);
        //this.start_sub_module(G_MODULE.Task)
	}
	private btn_matchVideo_cb(event)
	{
        this.start_module(G_MODULE.MatchVideo);
	}
	private btn_mail_cb (event){
        this.start_sub_module(G_MODULE.Announcement);
		//this.start_sub_module(G_MODULE.Mail);
	}
    private btn_more_cb (event) {
    	this.start_sub_module(G_MODULE.bingPhone);
		//this.start_sub_module(G_MODULE.More);
	}
	private btn_goldMatch_cb (event) {
		this.start_sub_module(G_MODULE.Tranning);
	}
	private btn_zhanjicb(event)
	{
        this.start_sub_module(G_MODULE.RecordList);
	}
	//end
}
