/*
author: HJB
日期:2018-02-27 17:06:51
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

import FrameMgr from "../../GameMgrs/FrameMgr";
import RichTextMgr from "../../GameMgrs/RichTextMgr";
import CreateRoomMgr from "../../GameMgrs/CreateRoomMgr";
import BehaviorMgr from "../../GameMgrs/BehaviorMgr";
import ClubMgr from "../../GameMgrs/ClubMgr";
import ClubChatMgr from "../../GameMgrs/ClubChatMgr";
import ChatFillterMgr from "../../GameMgrs/ChatFillterMgr";
import SwitchMgr from "../../GameMgrs/SwitchMgr";
import VerifyMgr from "../../GameMgrs/VerifyMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Club_LobbyDownCtrl;

//测试数据，走配表
const CHAT_POS_TYPE = cc.Enum({
    POS_PLAYER:0,
    POS_FRIEND:1
})

const CHAT_TYPE = cc.Enum({
    TYPE_LABEL:0,		//普通文字类型
	TYPE_BLEND:1,		//混合文字图片类型
	TYPE_VOICE:2,		//语音类型
	TYPE_ROOM_ENTER:3, 	//进入房间
	TYPE_ROOM_FINISH:4,	//房间结束
})

const CREATE_ROOM_STATE = cc.Enum({
    SELF_PAY:1,
    CLUB_PAY:2
})


//模型，数据处理
class Model extends BaseModel{
	private iconCallOpen:boolean = false;
	private roomCallOpen:boolean = false;
	private chat_content:string = "";
	private chat_placeholder:string = "";
	private nowRoomOpen:boolean = false;
	private creatRoomSwitch:any = null;//自费创建房间开关
	constructor()
	{
		super();
		this.creatRoomSwitch = SwitchMgr.getInstance().get_switch_add_club_expense();
	}
	public setIconCallOpen(data){
		this.iconCallOpen = data
	}
	public getIconCallOpen(){
		return this.iconCallOpen
	}
	public setRoomCallOpen(data){
		this.roomCallOpen = data
	}
	public getRoomCallOpen(){
		return this.roomCallOpen
	}
	public getChatContent(){
		return this.chat_content;
	}
	public setChatContent(data){
		this.chat_content = data;
	}
	public getChatPlaceholder(){
		return this.chat_placeholder;
	}
	public setChatPlaceholder(data){
		this.chat_placeholder = data;
	}
	public setNowRoomOpen(data){
		this.nowRoomOpen = data
	}
	public getNowRoomOpen(){
		return this.nowRoomOpen
	}
	public updateSwitch(msg){
		this.creatRoomSwitch = msg.cfg.switch_add_club_expense;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		prefab_room_frame:null,
		pode_chat_frame:null,
		prefab_notice_frame:null,
		node_chat_frame:null,
		node_notice_frame:null,
		node_frame:null,
		btn_voice:null,
		btn_icon:null,
		btn_send:null,
		node_editbox_content:null,
		editbox_content:null,
		node_iconContent: null,
		node_iconClose:null,
		node_iconList:null,
		node_chat:null,
		node_room:null,
		btn_openCreate:null,
		btn_closeCreate:null,
		btn_baseRoom:null,
		btn_publicRoom:null,
		btn_nowRoom:null,
		node_room_frame:null,
		btn_nowChat:null,
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
		this.ui.prefab_room_frame = ctrl.prefab_room_frame;
		this.ui.pode_chat_frame = ctrl.pode_chat_frame;
		this.ui.prefab_notice_frame = ctrl.prefab_notice_frame;
		this.ui.node_frame = ctrl.node_frame;
		this.ui.btn_voice = ctrl.btn_voice;
		this.ui.btn_icon = ctrl.btn_icon;
		this.ui.btn_send = ctrl.btn_send;
		this.ui.node_editbox_content = ctrl.node_editbox_content;
		this.ui.editbox_content = ctrl.editbox_content;
		this.ui.node_iconContent = ctrl.node_iconContent;
		this.ui.node_iconClose = ctrl.node_iconClose;
		this.ui.node_iconList = ctrl.node_iconList;
		this.ui.node_chat = ctrl.node_chat;
		this.ui.node_room = ctrl.node_room;
		this.ui.btn_openCreate = ctrl.btn_openCreate;
		this.ui.btn_closeCreate = ctrl.btn_closeCreate;
		this.ui.btn_baseRoom = ctrl.btn_baseRoom;
		this.ui.btn_publicRoom = ctrl.btn_publicRoom;
		this.ui.btn_nowRoom = ctrl.btn_nowRoom;
		this.ui.btn_nowChat = ctrl.btn_nowChat;
		
		this.addRightFrame();
		this.OpenRoomList();
	}

	
	//
	OpenIconList(){
		this.ui.node_iconContent.active = true;
		//this.ui.node_iconContent.resumeSystemEvents(true)
	}
	CloseIconList(){
		this.ui.node_iconContent.active = false;
		this.ui.node_iconContent.pauseSystemEvents(true);
	}
	addEditboxContent(str){
		var rich_data = RichTextMgr.getInstance();
		this.model.chat_content = this.model.chat_content + rich_data.richTextPicToName(str)
		this.ui.editbox_content.string = this.model.chat_content
	}
	OpenNodeRoom(){
		this.ui.node_room.active = true;
		//this.ui.node_room.resumeSystemEvents(true);
	}

	CloseNodeRoom(){
		this.ui.node_room.active = false;
		this.ui.node_room.pauseSystemEvents(true);
	}
	OpenRoomList(){
		if (this.model.getNowRoomOpen()){
			this.ui.node_room_frame = cc.instantiate(this.ui.prefab_room_frame)
			this.ui.node_frame.addChild(this.ui.node_room_frame);

			this.ui.node_chat_frame.active = false;

			this.ui.node_notice_frame.active = false;

			this.ui.btn_nowRoom.active = false;
			this.ui.btn_nowChat.active = true;
		}else{
			if (this.ui.node_room_frame != null){
				this.ui.node_room_frame.destroy();
				this.ui.node_room_frame = null;
			}

			this.ui.node_chat_frame.active = true;

			this.ui.node_notice_frame.active = true;

			this.ui.btn_nowRoom.active = false;
			this.ui.btn_nowChat.active = false;
		}
	}

	
	addRightFrame(){
		this.ui.node_notice_frame = cc.instantiate(this.ui.prefab_notice_frame);
		this.ui.node_frame.addChild(this.ui.node_notice_frame);
		this.ui.node_chat_frame = cc.instantiate(this.ui.pode_chat_frame);
		this.ui.node_frame.addChild(this.ui.node_chat_frame);
	}

}
//c, 控制
@ccclass
export default class Club_LobbyDownCtrl extends BaseCtrl {
	//这边去声明ui组件

	@property(cc.Prefab)
	prefab_room_frame:cc.Prefab = null

	@property(cc.Prefab)
	pode_chat_frame:cc.Prefab = null

	@property(cc.Prefab)
	prefab_notice_frame:cc.Prefab = null

	@property(cc.Node)
	node_frame:cc.Node = null

	@property(cc.Node)
	btn_voice:cc.Node = null

	@property(cc.Node)
	btn_icon:cc.Node = null

	@property(cc.Node)
	btn_send:cc.Node = null

	@property(cc.Node)
	node_editbox_content:cc.Node = null

	@property(cc.EditBox)
	editbox_content:cc.EditBox = null

	@property(cc.Node)
	node_iconContent:cc.Node = null

	@property(cc.Node)
	node_iconClose:cc.Node = null

	@property(cc.Node)
	node_iconList:cc.Node = null

	@property(cc.Node)
	node_chat:cc.Node = null

	@property(cc.Node)
	node_room:cc.Node = null

	@property(cc.Node)
	btn_openCreate:cc.Node = null

	@property(cc.Node)
	btn_closeCreate:cc.Node = null

	@property(cc.Node)
	btn_baseRoom:cc.Node = null

	@property(cc.Node)
	btn_publicRoom:cc.Node = null

	@property(cc.Node)
	btn_nowRoom:cc.Node = null

	@property(cc.Node)
	btn_nowChat:cc.Node = null


	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model,View);
		
		//配置占位字符（控件中的文字修改为配置文字）需改
		this.model.setChatPlaceholder(this.ui.editbox_content.placeholder);
	}

	//定义网络事件
	defineNetEvents()
	{
		this.n_events = {
			"ws.reqSendClubChat":this.ws_reqSendClubChat,
			'http.reqGameSwitch':this.http_reqGameSwitch,
		}
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image, this.ui.btn_voice,this.btn_voice_cb,"语音按钮");
		this.connect(G_UiType.image, this.ui.btn_icon,this.btn_icon_cb,"表情按钮");
		this.connect(G_UiType.image, this.ui.btn_send,this.btn_send_cb,"发送按钮");
		this.connect(G_UiType.edit, this.ui.node_editbox_content,this.editbox_content_cb,"发送按钮");
		this.connect(G_UiType.image, this.ui.node_iconClose,this.node_iconClose_cb,"关闭表情界面");
		this.connect(G_UiType.image, this.ui.btn_openCreate,this.btn_publicRoom_cb,"开启房间控制");
		this.connect(G_UiType.image, this.ui.btn_closeCreate,this.btn_closeCreate_cb,"关闭房间控制");
		this.connect(G_UiType.image, this.ui.btn_nowRoom,this.btn_nowRoom_cb,"房间列表");
		this.connect(G_UiType.image, this.ui.btn_nowChat,this.btn_nowChat_cb,"聊天列表");
	}
	

	addIconCallBak(){
		if (this.model.getIconCallOpen() == true){
			return 
		}
		this.model.setIconCallOpen(true);
		let count = this.view.ui.node_iconList.childrenCount,
			btns = this.view.ui.node_iconList.children;
		//console.log("count:"+count);
		
		for(var i=0; i<count; i++)
		{  
			let curBtn = btns[i];
            this.connect(G_UiType.image, curBtn, this.node_icon_cb, '图标:btn_'+i)
		} 
	}

	addRoomCallBak(){
		if (this.model.getRoomCallOpen() == true){
			return 
		}
		this.model.setRoomCallOpen(true);
		this.connect(G_UiType.image, this.ui.btn_baseRoom,this.btn_baseRoom_cb,"普通创建");
		this.connect(G_UiType.image, this.ui.btn_publicRoom,this.btn_publicRoom_cb,"特殊创建");
	}

	start () {
	}
	//网络事件回调begin
	private ws_reqSendClubChat(){
		this.model.setChatContent("");
		this.ui.editbox_content.string = "";
	}
	private http_reqGameSwitch(msg){
		this.model.updateSwitch(msg);

	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end

	private btn_voice_cb(node, event){

	}

	private btn_icon_cb(node, event){
		this.addIconCallBak();
		this.view.OpenIconList();
	}

	private btn_send_cb(node, event){
		//console.log("btn_send_cb");
		let content = this.model.getChatContent();
		if (content == ""){
			FrameMgr.getInstance().showTips(this.model.getChatPlaceholder());
			return
		}
		let club_id = BehaviorMgr.getInstance().getClubSelectId();
		let chat_data = {
			club_id:club_id,
            type:CHAT_TYPE.TYPE_BLEND,
            text:content,
		}
		//console.log("btn_send_cb", chat_data)
		ClubChatMgr.getInstance().reqSendClubChat(chat_data);
		//改变茶馆排序
		// ClubMgr.getInstance().reqClubTop(club_id)
		this.gemit("refreshClubList")
	}

	private editbox_content_cb(str, event){
		//console.log("editbox_content_cb");
		if (str == "editing-did-ended"){
			let content = this.ui.editbox_content.string;
			content = ChatFillterMgr.getInstance().warningStrGsub(content);
			this.model.setChatContent(content);
		}
	}

	private node_iconClose_cb(node, event){
		this.view.CloseIconList();
	}

	private node_icon_cb(node, event){
		let icon_pic = node.getComponent(cc.Sprite);
		this.view.addEditboxContent(icon_pic.spriteFrame.name);
		this.view.CloseIconList();
	}
	private btn_openCreate_cb(node, event){
        //判断有没有恢复房间
		if(this.model.creatRoomSwitch == 2){
			this.btn_publicRoom_cb(null,null);
			return
		}
		this.addRoomCallBak();
		this.view.OpenNodeRoom();
	}
	private btn_closeCreate_cb(node, event){
		this.view.CloseNodeRoom();
	}
	private btn_baseRoom_cb(node, event){
        if(VerifyMgr.getInstance().checkUnSettled()){
            return;
        }
		//console.log("btn_baseRoom_cb");
		this.view.CloseNodeRoom();
		let club_id = BehaviorMgr.getInstance().getClubSelectId();
		CreateRoomMgr.getInstance().setProperty(club_id, "clubId");
		CreateRoomMgr.getInstance().setProperty(CREATE_ROOM_STATE.SELF_PAY, "paysource");
		this.start_sub_module(G_MODULE.createRoom);
		//改变茶馆排序
		// ClubMgr.getInstance().reqClubTop(club_id)
		this.gemit("refreshClubList")
	}
	private btn_publicRoom_cb(node, event){
        if(VerifyMgr.getInstance().checkUnSettled()){
            return;
        }
		//console.log("btn_publicRoom_cb");
		this.view.CloseNodeRoom();
		let club_id = BehaviorMgr.getInstance().getClubSelectId(),
			club_info = ClubMgr.getInstance().getClubInfo(club_id);
		// if (club_info.openGame == OPEN_GAME_MGR.MANAGE){
		// 	let user_identity = ClubMgr.getInstance().getClubIdentity(club_id);
		// 	if (user_identity == IDENTITY_TYPE.MEMBER){
		// 		FrameMgr.getInstance().showMsgBox("您没有公费开房的权限", ()=>{}, "提示");
		// 		return ;
		// 	}
		// }
		CreateRoomMgr.getInstance().setProperty(club_id, "clubId");
		CreateRoomMgr.getInstance().setProperty(CREATE_ROOM_STATE.CLUB_PAY, "paysource");
		this.start_sub_module(G_MODULE.createRoom);
		//改变茶馆排序
		// ClubMgr.getInstance().reqClubTop(club_id)
		this.gemit("refreshClubList")
	}
	private btn_nowRoom_cb(node, event){
		this.model.setNowRoomOpen(true);
		this.view.OpenRoomList();
		if (!this.model.getNowRoomOpen()){
			this.gemit("chat_room_refresh");
		}
	}
	private btn_nowChat_cb(node, event){
		this.model.setNowRoomOpen(false);
		this.view.OpenRoomList();
		if (!this.model.getNowRoomOpen()){
			this.gemit("chat_room_refresh");
		}
	}
}