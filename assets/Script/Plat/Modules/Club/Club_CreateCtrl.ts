/*
author: YOYO
日期:2018-02-22 15:29:28
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

import ClubMgr from "../../GameMgrs/ClubMgr";
import FrameMgr from "../../GameMgrs/FrameMgr";
import UserMgr from "../../GameMgrs/UserMgr";
import ChatFillterMgr from "../../GameMgrs/ChatFillterMgr";
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Club_CreateCtrl;
//模型，数据处理
class Model extends BaseModel{
	private iconCallOpen:boolean = false;
	private iconId:number = 0;
	private name:string = null;
	constructor()
	{
		super();
		this.name = "";
	}
	public setIconCallOpen(data){
		this.iconCallOpen = data
	}
	public getIconCallOpen(){
		return this.iconCallOpen
	}
	public getIconId(){
		return this.iconId;
	}
	public setIconId(id){
		this.iconId = id;
	}
	public getClubName(){
		return this.name;
	}
	public setClubName(name){
		this.name = name;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		btn_close:null,
		btn_create:null,
		btn_icon_open:null,
		btn_icon_close:null,
		btn_icon_frame:null,
		btn_icons:null,
		node_club_name:null,
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
		this.ui.btn_create = ctrl.btn_create;
		this.ui.btn_icon_open = ctrl.btn_icon_open;
		this.ui.btn_icon_close = ctrl.btn_icon_close;
		this.ui.btn_icon_frame = ctrl.btn_icon_frame;
		this.ui.btn_icons = ctrl.btn_icons;
		this.ui.node_club_name = ctrl.node_club_name;
		this.ui.edit_club_name = ctrl.edit_club_name;
	}

	refreshIcon(node){
		let pic = this.ui.btn_icon_open.getComponent(cc.Sprite),
			btns = node;
		if (btns == null){
			//console.log("node : null :"+node);
			return 
		}
		let sprPic = btns.getComponent(cc.Sprite);
		pic.spriteFrame = sprPic.spriteFrame;
	}

	OpenIconList(){
		this.ui.btn_icon_frame.active = true;
	}
	CloseIconList(){
		this.ui.btn_icon_frame.active = false;
	}
}
//c, 控制
@ccclass
export default class Club_CreateCtrl extends BaseCtrl {
	//这边去声明ui组件

	@property(cc.Node)
	btn_close:cc.Node = null

	@property(cc.Node)
	btn_create:cc.Node = null

	@property(cc.Node)
	btn_icon_open:cc.Node = null

	@property(cc.Node)
	btn_icon_close:cc.Node = null

	@property(cc.Node)
	btn_icon_frame:cc.Node = null

	@property(cc.Node)
	btn_icons:cc.Node = null

	@property(cc.Node)
	node_club_name:cc.Node = null

	@property(cc.EditBox)
	edit_club_name:cc.EditBox = null
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
		this.n_events = {
			"http.reqClubCreate":this.http_reqClubCreate,
		}
	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image, this.ui.btn_close,this.btn_close_cb,"关闭界面");
		this.connect(G_UiType.image, this.ui.btn_create,this.btn_create_cb,"创建界面");
		this.connect(G_UiType.image, this.ui.btn_icon_open,this.btn_icon_open_cb,"开启头像选择");
		this.connect(G_UiType.image, this.ui.btn_icon_close,this.btn_icon_close_cb,"关闭头像选择");	
		this.connect(G_UiType.edit, this.ui.node_club_name,this.node_club_name_cb,"监听输入框");	
	
	}
	addTypeCallBak(){
		if (this.model.getIconCallOpen() == true){
			return 
		}
		this.model.setIconCallOpen(true);
		let count = this.view.ui.btn_icons.childrenCount,
			btns = this.view.ui.btn_icons.children;
		//console.log("count:"+count);
		
		for(let i=0; i<count; i++)
		{  
			let curBtn = btns[i];
            this.connect(G_UiType.image, curBtn, (node, event)=>{
				let index = i+1;
				this.node_icon_cb(index, node, event);
			}, '图标:btn_'+i)
		} 
	}

	start () {
	}
	//网络事件回调begin
	private http_reqClubCreate(){
		ClubMgr.getInstance().reqClubList();
		UserMgr.getInstance().reqMyInfo();
		this.finish();
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin

	//点击关闭
	private btn_close_cb(node, event){
		//console.log('btn_close_cb')
		this.finish();
	}
	private btn_create_cb(node, event){
		//console.log("btn_create_cb:"+this.model.getClubName());
		if (this.model.getClubName() == ""){
			FrameMgr.getInstance().showTips("请输入茶馆名称！")
			return 
		}else if(ChatFillterMgr.getInstance().isEmojiCharacter(this.model.getClubName())){
			FrameMgr.getInstance().showTips("输入非法字符，请重新输入")
			return 
		}
		ClubMgr.getInstance().reqCreate(this.model.getIconId(), this.model.getClubName());
	}
	private node_club_name_cb(str, event){
		//console.log("node_club_name_cb");
		if (str == "editing-did-ended"){
			let content = this.ui.edit_club_name.string;
			this.model.setClubName(content);
		}
	}
	private btn_icon_open_cb(node, event){
		this.view.OpenIconList();
		this.addTypeCallBak();
	}
	private btn_icon_close_cb(node, event){
		this.view.CloseIconList();
	}
	private node_icon_cb(index, node, event){
		this.model.setIconId(index);
		this.view.refreshIcon(node);
		this.view.CloseIconList();
	}
	//end
}