/*
author: HJB
日期:2018-03-02 15:52:33
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

import BehaviorMgr from "../../GameMgrs/BehaviorMgr"
import ClubMgr from "../../GameMgrs/ClubMgr"
import UserMgr from "../../GameMgrs/UserMgr"
import FrameMgr from "../../GameMgrs/FrameMgr"

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Club_LobbyNoticeCtrl;
//模型，数据处理
class Model extends BaseModel{
	private club_id:number = null;
	private now_club_notice:string = null;
	private new_club_notice:string = null;
	private club_state:boolean = null;
	private user_identity:string = null;
	public _moveTime:number = null;
	constructor()
	{
		super();
		this.now_club_notice = "";
		this.new_club_notice = "";
		this.user_identity = IDENTITY_TYPE.MEMBER;
		this.club_state = false;
		this.club_id = BehaviorMgr.getInstance().getClubSelectId();
		this.refreshClubNotice();
		this.refreshIdentity();
	}
	public refreshIdentity(){
		this.user_identity = ClubMgr.getInstance().getClubIdentity(this.club_id);
	}
	public getNowClubNotice(){
		return this.now_club_notice;
	}
	public getNewClubNotice(){
		return this.new_club_notice;
	}
	public setClubNotice(str){
		this.new_club_notice = str;
	}
	public refreshClubNotice(){
		let clubData = ClubMgr.getInstance().getClubListData(this.club_id);
		this.now_club_notice = clubData.notice;
	}
	public setClubState(state){
		this.club_state = state;
	}
	public getClubState(){
		return this.club_state;
	}
	public getIdentity(){
		return this.user_identity;
	}
	public getClubId(){
		return this.club_id;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	private _delayTime = null;
	private _moveDistanceX = null;
	private _moveTime = null;
	private label_noticepos = null;
	ui={
		//在这里声明ui
		node_showNotice:null,
		node_setNotice:null,
		btn_setNotice:null,
		btn_saveNotice:null,
		label_notice:null,
		node_edit:null,
		edit_notice:null,
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
		this.ui.node_showNotice = ctrl.node_showNotice;
		this.ui.node_setNotice = ctrl.node_setNotice;
		this.ui.btn_setNotice = ctrl.btn_setNotice;
		this.ui.btn_saveNotice = ctrl.btn_saveNotice;
		this.ui.label_notice = ctrl.label_notice;
		this.ui.node_edit = ctrl.node_edit;
		this.ui.edit_notice = this.ui.node_edit.getComponent(cc.EditBox);

		this.cutNoticeCtrl();
		this.refreshNotice();
	}
	move(){
		
		if (this.ui.node_showNotice.width < this.ui.label_notice.node.width){
			this.ui.label_notice.node.x = this.ui.btn_setNotice.x+this.ui.label_notice.node.width/2
			this.ui.label_notice.node.stopAllActions(false);
			let callback = cc.callFunc(()=>{
				this.ui.label_notice.node.x = this.ui.btn_setNotice.x+this.ui.label_notice.node.width/2;//设置文字滚动的qishi位置;
			});
			let movex = -(this.ui.node_showNotice.width+this.ui.label_notice.node.width*1.2);
			let speed = 100;
			this.model._moveTime = Math.abs(movex/speed);
			let moveBy = cc.moveBy(this.model._moveTime, movex, 0);
			var seq =  cc.repeatForever(cc.sequence(moveBy,callback));
			this.ui.label_notice.node.runAction(seq);
			
		}else{
			this.ui.label_notice.node.x = 0;
			this.ui.label_notice.node.stopAllActions(true);
		}
	}
	cutNoticeCtrl(){
		if (this.model.getIdentity() == IDENTITY_TYPE.MEMBER){
			this.ui.btn_setNotice.active = false;
			this.ui.btn_setNotice.pauseSystemEvents(true);
			this.ui.btn_saveNotice.active = false;
			this.ui.btn_saveNotice.pauseSystemEvents(true);
			return 
		}
		if (this.model.getClubState()){
			this.ui.node_showNotice.active = false;
			this.ui.node_showNotice.pauseSystemEvents(true);
			this.ui.node_setNotice.active = true;
			this.ui.node_setNotice.resumeSystemEvents(true);
		}else{
			this.ui.node_setNotice.active = false;
			this.ui.node_setNotice.pauseSystemEvents(true);
			this.ui.node_showNotice.active = true;
			this.ui.node_showNotice.resumeSystemEvents(true);
		}
	}

	refreshNotice(){
		this.ui.label_notice.string = this.model.getNowClubNotice();
		this.ui.edit_notice.string = this.model.getNowClubNotice();
		this.move();
	}
}
//c, 控制
@ccclass
export default class Club_LobbyNoticeCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property(cc.Node)
	node_showNotice:cc.Node = null

	@property(cc.Node)
	node_setNotice:cc.Node = null

	@property(cc.Node)
	btn_setNotice:cc.Node = null

	@property(cc.Node)
	btn_saveNotice:cc.Node = null

	@property(cc.Label)
	label_notice:cc.Label = null

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
		this.n_events = {
			"http.reqClubChangeNotice":this.http_reqClubChangeNotice,
		}
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.button, this.ui.btn_setNotice,this.btn_setNotice_cb,"设置");
		this.connect(G_UiType.button, this.ui.btn_saveNotice,this.btn_saveNotice_cb,"保存");	
		this.connect(G_UiType.edit, this.ui.node_edit,this.node_edit_cb,"监听输入框");	
	}
	start () {
	}
	//网络事件回调begin
	private http_reqClubChangeNotice(){
		this.model.refreshClubNotice();
		this.view.refreshNotice();
		FrameMgr.getInstance().showTips("公告修改成功", null, 35, cc.color(0,255,50));
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private btn_setNotice_cb(node, event){
		this.model.setClubState(true);
		this.view.cutNoticeCtrl();
	}
	private btn_saveNotice_cb(node, event){
		this.model.setClubState(false);
		this.view.cutNoticeCtrl();
		if (this.model.getNowClubNotice() == this.model.getNewClubNotice()){
			return 
		}
		ClubMgr.getInstance().reqClubChangeNotice(this.model.getClubId(), this.model.getNewClubNotice())
		this.changClubList();
	}
	private node_edit_cb(str, event){
		if (str == "editing-did-ended"){
			let content = this.ui.edit_notice.string;
			this.model.setClubNotice(content);
		}
	}
	//end
	changClubList(){
		//改变茶馆排序
		// let club_id = this.model.getClubId();
		// ClubMgr.getInstance().reqClubTop(club_id)
		this.gemit("refreshClubList")
	}
}