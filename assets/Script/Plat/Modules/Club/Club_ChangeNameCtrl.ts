/*
author: HJB
日期:2018-03-02 18:24:33
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

import ClubMgr from "../../GameMgrs/ClubMgr";
import BehaviorMgr from "../../GameMgrs/BehaviorMgr";
import FrameMgr from "../../GameMgrs/FrameMgr";
import ChatFillterMgr from "../../GameMgrs/ChatFillterMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Club_ChangeNameCtrl;
//模型，数据处理
class Model extends BaseModel{
	private name:string = null;
	private club_id = null;
	constructor()
	{
		super();
		this.name = "";
		this.club_id = BehaviorMgr.getInstance().getClubSelectId()
	}
	public getClubName(){
		return this.name;
	}
	public setClubName(name){
		this.name = name;
	}
	public getClubId(){
		return this.club_id;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		btn_close:null,
		node_edit:null,
		btn_confirm:null,
		edit_club_name:null,
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
		this.ui.node_edit = ctrl.node_edit;
		this.ui.btn_confirm = ctrl.btn_confirm;
		this.ui.edit_club_name = this.ui.node_edit.getComponent(cc.EditBox);
	}
}
//c, 控制
@ccclass
export default class Club_ChangeNameCtrl extends BaseCtrl {
	//这边去声明ui组件

	@property(cc.Node)
	btn_close:cc.Node = null

	@property(cc.Node)
	node_edit:cc.Node = null

	@property(cc.Node)
	btn_confirm:cc.Node = null

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
			"http.reqClubChangeName":this.http_reqClubChangeName,
		}
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
	private http_reqClubChangeName(){
		this.finish();
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private btn_close_cb(node, event){
		//console.log('btn_close_cb')
		this.finish();
	}

	private btn_confirm_cb(node, event){
		//console.log('btn_confirm_cb')
		if (this.model.getClubName() == ""){
			FrameMgr.getInstance().showTips("请输入茶馆名称！")
			return 
		}else if(ChatFillterMgr.getInstance().isEmojiCharacter(this.model.getClubName())){
			FrameMgr.getInstance().showTips("输入非法字符，请重新输入")
			return 
		}
		ClubMgr.getInstance().reqClubChangeName(this.model.getClubId(), this.model.getClubName());
		this.changClubList();
	}
	private node_edit_cb(str, event){
		//console.log("node_edit_cb");
		if (str == "editing-did-ended"){
			let content = this.ui.edit_club_name.string;
			this.model.setClubName(content);
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