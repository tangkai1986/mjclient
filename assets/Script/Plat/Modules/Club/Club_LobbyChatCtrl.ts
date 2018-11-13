/*
author: HJB
日期:2018-02-23 15:28:44
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UserMgr from "../../GameMgrs/UserMgr";

import RichTextMgr from "../../GameMgrs/RichTextMgr";
import BehaviorMgr from "../../GameMgrs/BehaviorMgr";
import ClubChatMgr from "../../GameMgrs/ClubChatMgr";
import UiMgr from "../../GameMgrs/UiMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Club_LobbyChatCtrl;

//测试数据，走配表
const CHAT_POS_TYPE = cc.Enum({
    POS_PLAYER:0,
    POS_FRIEND:1
})
//模型，数据处理
class Model extends BaseModel{
	private chat_max = 0;
	char_offset_x = 150;
	char_offset_y = 140;
	private myinfo=null;
	constructor()
	{
		super();
		//在这边去获取数据层的数据
        this.myinfo=UserMgr.getInstance().getMyInfo();
		
		this.chat_max = ClubChatMgr.getInstance().getClubChatMax();
	}
	public getChatStripMax(){
		return this.chat_max;
	}
	public getUserId(){
		return this.myinfo.id
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		node_chat_list:null,
		scroll_chatView:null,
		node_chatStrip1:null,
		node_chatStrip2:null,
		node_room_enter:null,
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
		this.ui.node_chat_list = ctrl.node_chat_list;
		this.ui.scroll_chatView = ctrl.scroll_chatView;
		
		this.ui.node_chatStrip1 = ctrl.node_chatStrip1;
		this.ui.node_chatStrip2 = ctrl.node_chatStrip2;

		this.ui.node_room_enter = ctrl.node_room_enter;
	}
	//设置条目icon
	setChatStripIcon(node, icon){
		let node_icon = node.getChildByName("player_icon");
		if (icon != null){
			if (typeof icon == "number")
				UiMgr.getInstance().setUserHead(node_icon, icon);
			else
				UiMgr.getInstance().setUserHead(node_icon, 0, icon);
		}
	}
	//设置条目name
	setChatStripName(node, name){
		let node_name =node.getChildByName("player_name");
		var text_name = node_name.getComponent(cc.Label);
		text_name.string = name;
	}

	addRoomEnter(node, id){
		let node_enter = cc.instantiate(this.ui.node_room_enter)
		node_enter.parent = node
		// if (id == this.model.getUserId()){
		// 	node_enter.x = (node.width - node_enter.width)/2 -this.model.char_offset_x;
		// }
		// else{
		// 	node_enter.x = -(node.width - node_enter.width)/2 + this.model.char_offset_x;
		// }
		node_enter.x = 0;
		node_enter.y =  - this.model.char_offset_y/2;
		node.height = node.height + node_enter.height/4
	}
	//设置条目内容
	setChatStripContent(node, data){
		
		let btn_strip = null,
			color = "#89704C",
			node_chat =node.getChildByName("chat_text"),
			node_botton =node.getChildByName("chat_botton"),
			node_icon = node.getChildByName("player_icon"),
			node_name = node.getChildByName("player_name"),
			node_pic = node.getChildByName("player_pic");
		
		node_botton.active = false;
		node_icon.active = false;
		node_name.active = false;
		var rich_chat = node_chat.getComponent(cc.RichText);
		var rich_data = RichTextMgr.getInstance();
		var chat_x = 30;
		rich_chat.string = "";
		switch (data.type){
			case CLUB_CHAT_TYPE.TYPE_LABEL:
				node_chat.active = true;
				rich_chat.string = rich_data.richTextColor(data.text, color);
				node_botton.active = true;
				node_botton.width = node_chat.width + chat_x;
				break;
			case CLUB_CHAT_TYPE.TYPE_BLEND:
				node_chat.active = true;
				rich_chat.string = rich_data.richTextBlend(data.text, color);
				node_botton.active = true;
				node_botton.width = node_chat.width + chat_x;
				break;
			case CLUB_CHAT_TYPE.TYPE_VOICE:
				node_pic.active = true;
				btn_strip = node_pic;
				break;
			case CLUB_CHAT_TYPE.TYPE_ROOM_ENTER:
				BehaviorMgr.getInstance().setClubRoomData(data.room_data);
				this.addRoomEnter(node, data.id);
				break;
			default:
				break;
		}
		return btn_strip
	}
	//data {pos, icon, name, type, text, room_data}
	addChatStrip(data){
		let add_node = null;

		if (data.id == this.model.getUserId()){
			add_node = cc.instantiate(this.ui.node_chatStrip2)
		}
		else{
			add_node = cc.instantiate(this.ui.node_chatStrip1)
		}
		if (add_node == null){
			return
		}
		add_node.active = true;
		add_node.x = 0;
		add_node.parent = this.ui.node_chat_list;
		//头像添加
		this.setChatStripIcon(add_node, data.icon);
		//名字添加
		this.setChatStripName(add_node, data.name);
		//聊天内容
		let btn_strip = this.setChatStripContent(add_node, data);

		this.refreshChatList();

		return btn_strip
	}
	//刷新聊天列表
	refreshChatList(){
		let height = 0,
			layout = this.ui.node_chat_list.getComponent(cc.Layout),
			gapTop = layout.paddingTop,
			gapBottom = layout.paddingBottom,
			gapY = layout.spacingY,
			count = this.ui.node_chat_list.childrenCount;
		//清理聊天上限显示
		if (count > this.model.getChatStripMax()){
			this.ui.node_chat_list.children[0].destroy();
			count = this.ui.node_chat_list.childrenCount;
		}
		height = height + gapTop;
		height = height + gapBottom;
		height = height + (count-1) * gapY;
		for (var i = 0; i < count; i++){
			let node = this.ui.node_chat_list.children[i];
			height = height + node.height;
		}
		//设置拖拽层容器大小
		if (this.ui.node_chat_list.height < height){
			this.ui.node_chat_list.height = height;
			this.ui.scroll_chatView.scrollToBottom(0);
		}
	}
	removeChatList(){
		this.ui.node_chat_list.destroyAllChildren();
		this.ui.node_chat_list.removeAllChildren();
		this.ui.node_chat_list.height = this.ui.node_chat_list.parent.height;
	}
}
//c, 控制
@ccclass
export default class Club_LobbyChatCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property(cc.Node)
	node_chat_list:cc.Node = null

	@property(cc.ScrollView)
	scroll_chatView:cc.ScrollView = null

	@property(cc.Node)
	node_chatStrip1:cc.Node = null

	@property(cc.Node)
	node_chatStrip2:cc.Node = null

	@property(cc.Prefab)
	node_room_enter:cc.Prefab = null
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model,View);

		this.initChatContent();
	}
	private initChatContent(){
		let club_id = BehaviorMgr.getInstance().getClubSelectId(),
			chat_list = ClubChatMgr.getInstance().getClubChat(club_id),
			chat_count = chat_list.length;
			//console.log('chat_list',chat_list)
		if (chat_count != null){
			for (let i = 0; i< chat_count; i++){
				let data = chat_list[i];
				this.view.addChatStrip(data);
			}
		}
	}

	//定义网络事件
	defineNetEvents()
	{
		this.n_events = {
			"ws.onClubChat":this.ws_onClubChat,
		}
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{	
	}

	start () {
	}
	//网络事件回调begin
	private ws_onClubChat(msg){
		//console.log("ws_onClubChat2",msg);
		if (msg.type == CLUB_CHAT_TYPE.TYPE_ROOM_MODIFICATION){
			if (msg.room_data.state == 0){
				this.view.removeChatList();
				this.initChatContent();
			}
			return;
		}
		else if (msg.type == CLUB_CHAT_TYPE.TYPE_ROOM_EXIT)
		{
			this.view.removeChatList();
			this.initChatContent();
			return;
		}
		let club_id = BehaviorMgr.getInstance().getClubSelectId();
		if (club_id == msg.clubid){	
			this.view.removeChatList();
			this.initChatContent();		
			// this.view.addChatStrip(msg);
		}
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
}