/*
author: HJB
日期:2018-02-23 15:26:28
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

import UiMgr from "../../GameMgrs/UiMgr";
import ClubMgr from "../../GameMgrs/ClubMgr";
import ClubChatMgr from "../../GameMgrs/ClubChatMgr";
import BehaviorMgr from "../../GameMgrs/BehaviorMgr";
import FrameMgr from "../../GameMgrs/FrameMgr";
import UserMgr from "../../GameMgrs/UserMgr";
import Club_SeekListCtrl from "./Club_SeekListCtrl";
import SwitchMgr from "../../GameMgrs/SwitchMgr";
import ServerMgr from "../../../AppStart/AppMgrs/ServerMgr";
import AppInfoMgr from "../../../AppStart/AppMgrs/AppInfoMgr";
import RoomMgr from "../../GameMgrs/RoomMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Club_LobbyCtrl;

//测试数据，走配表
const RIGHT_BTNS = cc.Enum({
    CLUB_CHAT:0,
    CLUB_ROOM:1
})


//模型，数据处理
class Model extends BaseModel{
	private club_list = null
	private club_index:number = null;
	private club_id = null
	private user_identity:number = null;
	public name_max:number = 4
	private creatSwitch = null;
	constructor()
	{
		super();
		this.club_list = ClubMgr.getInstance().getClubList();
		this.setClubIndex(0);
		this.creatSwitch = SwitchMgr.getInstance().get_switch_add_club();
	}
	getClubList(){
		this.club_list = ClubMgr.getInstance().getClubList();
		return this.club_list;
	}
	refreshClubList(){
		this.club_list = ClubMgr.getInstance().getClubList();
		let club_index = this.getClubIdToIndex(this.club_id);
		this.setClubIndex(club_index);
	}
	getClubData(){
		return this.club_list[this.club_index];
	}
	getClubIndex(){
		return this.club_index;
	}
	setClubIndex(index){
		this.club_index = index;
		if (this.club_list.length != 0){
			//console.log("setClubIndex", index, this.club_list);
			this.club_id = this.club_list[this.club_index].id
			BehaviorMgr.getInstance().setClubSelectId(this.club_id);
			this.user_identity = ClubMgr.getInstance().getClubIdentity(this.club_id);
		}
	}
	getClubId(){
		return this.club_id;
	}
	getClubIdToIndex(id){
		let list = this.getClubList();
		for (let i=0; i<list.length; i++){
			let data = list[i];
			if (id == data.id){
				return i;
			}
		}
		return 0;
	}
	public getIdentity(){
		return this.user_identity;
	}
	updateSwitch(msg){
		this.creatSwitch = msg.cfg.switch_add_club;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		prefab_top_btns:null,
		prefab_botton_frame:null,
		frame_top_btns:null,
		btn_close:null,
		node_top_frame:null,
		node_left_btns:null,
		node_left_create:null,
		node_left_enter1:null,
		node_left_enter:null,
		node_right_frame:null,
		node_club_member:null,
		node_club_diamond:null,
		node_room_frame:null,
		node_botton_frame:null,
		label_club_id:null,
		label_club_diamond:null,
		node_club_share:null,
		member_count_color:null
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
		this.ui.prefab_top_btns = ctrl.prefab_top_btns;
		this.ui.prefab_botton_frame = ctrl.prefab_botton_frame;
		this.ui.btn_close = ctrl.btn_close;
		this.ui.node_top_frame = ctrl.node_top_frame;
		this.ui.node_left_btns = ctrl.node_left_btns;
		this.ui.node_left_create = ctrl.node_left_create;
		this.ui.node_left_enter1 = ctrl.node_left_enter1;
		this.ui.node_left_enter = ctrl.node_left_enter;
		this.ui.node_right_frame = ctrl.node_right_frame;
		this.ui.node_club_member = ctrl.node_club_member;
		this.ui.node_club_diamond = ctrl.node_club_diamond;
		this.ui.label_club_id = ctrl.label_club_id;
		this.ui.label_club_diamond = ctrl.label_club_diamond;
		this.ui.node_club_share = ctrl.node_club_share;
		this.ui.member_count_color = ctrl.member_count_color;
		this.ui.node_left_create.active = false;
		this.showCreateBtn();

		//测试数据-----
		this.addRightFrame();
		// this.addTopFrame();
		//-----

		this.refreshClubId();
		this.refreshClubDiamond();
		this.refreshClubRecharge();
	}
	refreshResreshUi(){
		let list = this.model.getClubList();
		for (let i=0; i<list.length; i++){
			let data = list[i];
			let mCount = ""+data.nowCount+"/"+data.mMax
			var node_select = this.addClubMember(data.avater, data.name, data.gameCount, mCount,i);
			// this.refreshLeftMemberCount(data.id);
			if (this.model.getClubId() == data.id){
				let select = node_select.getComponent(cc.Toggle);
				select.check();
				this.refreshLeftMemberCount(data.id);
			}
		}
	}

	removeResreshUi(){
		this.ui.node_left_btns.destroyAllChildren();
		this.ui.node_left_btns.removeAllChildren();
	}
	refreshClubId(){
		this.ui.label_club_id.string = this.model.getClubData().no;
	}
	refreshClubDiamond(){
		//console.log("refreshClubDiamond", this.model.getClubData());
		this.ui.label_club_diamond.string = this.model.getClubData().diamond;
	}
	refreshClubRecharge(){
		if (this.model.getIdentity() == IDENTITY_TYPE.CAPTAIN){
			this.ui.node_club_diamond.active = true;
			this.ui.node_club_diamond.resumeSystemEvents(true);
		}else{
			this.ui.node_club_diamond.active = false;
			this.ui.node_club_diamond.pauseSystemEvents(true);
		}
	}
	refreshLeftIcon(id){
		let club_index = this.model.getClubIdToIndex(id),
		 	data = this.model.getClubList()[club_index],
		 	node_member = this.ui.node_left_btns.children[club_index];
		let node_icon = node_member.getChildByName("club_blackicon");

		//设置icon
		UiMgr.getInstance().setUserHead(node_icon, 0, data.avater);
	}

	refreshLeftName(id){
		let club_index = this.model.getClubIdToIndex(id),
			data = this.model.getClubList()[club_index],
		 	node_member = this.ui.node_left_btns.children[club_index];
		let node_name = node_member.getChildByName("club_name");
		//设置name
		let label_name = node_name.getComponent(cc.Label);
		label_name.string = this.CutOutChat(data.name, this.model.name_max);
	}
	refreshLeftCount(id){
		let club_index = this.model.getClubIdToIndex(id),
			data = this.model.getClubList()[club_index],
		 	node_member = this.ui.node_left_btns.children[club_index];
		let node_count = node_member.getChildByName("checkmark").getChildByName("count");
		//设置桌数
		let label_count = node_count.getComponent(cc.Label);
		label_count.string = ""+data.gameCount+"桌";
		node_member.getChildByName("nonTopNode").getChildByName("count").getComponent(cc.Label).string = ""+data.gameCount+"桌";
	}
	refreshLeftMemberCount(id){
		let club_index = this.model.getClubIdToIndex(id),
			data = this.model.getClubList()[club_index],
		 	Chat_down = this.ui.node_botton_frame.getChildByName("Chat_down");
		let node_count = Chat_down.getChildByName("member_count");
		//设置桌数
		let label_count = node_count.getComponent(cc.Label);
		label_count.string = "在线人数:"+data.nowCount+"/"+data.mMax;
		//console.log("在线人数",data,id);
		

		// let label_outline = node_count.getComponent(cc.LabelOutline);
		
		// if (this.model.getClubId() == id){
		// 	node_count.color = cc.color(0xff,0xff,0xff);
		// 	label_outline.color = cc.color(0xff,0xff,0xff);
		// }else{
		// 	node_count.color = this.ui.member_count_color;
		// 	label_outline.color = this.ui.member_count_color;
		// }
	}

	addClubMember(icon, name, count, mCount,idx){
		let node_member = cc.instantiate(this.ui.node_club_member);
		node_member.parent = this.ui.node_left_btns;
		node_member.active = true;
		node_member.x = 0;
		// node_member.x=10;
		// node_member.y = 0+node_member.height*idx;
		this.refreshClubMemberHeight();
		let node_icon = node_member.getChildByName("club_icon"),
		node_name = node_member.getChildByName("club_name"),
		node_count = node_member.getChildByName("checkmark").getChildByName("count"),
		nonTopNode_count = node_member.getChildByName("nonTopNode").getChildByName("count"),
		member_count = node_member.getChildByName("member_count");
		
		if(idx==0) {
			node_icon.active=false;
			node_member.getChildByName("top").active=false;
			// node_member.getChildByName("nonTopNode").active=false;
			// node_member.getChildByName("checkmark").active=true;
		}
		//设置icon
		UiMgr.getInstance().setUserHead(node_member.getChildByName("club_blackicon"), 0, icon);
		//设置name
		let label_name = node_name.getComponent(cc.Label);
		label_name.string = this.CutOutChat(name, this.model.name_max);
		//设置桌数
		let label_count = node_count.getComponent(cc.Label);
		label_count.string = count+"桌";		
		nonTopNode_count.getComponent(cc.Label).string = count+"桌";
		if(count < 10){
			label_count.string = count+" 桌";
			nonTopNode_count.getComponent(cc.Label).string = count+" 桌";
		}

		return node_member
	}

	refreshClubMemberHeight(){
		let count = this.ui.node_left_btns.childrenCount,
			height = 0;
		if (count != 0){
			let layout = this.ui.node_left_btns.getComponent(cc.Layout),
				gapTop = layout.paddingTop,
				gapBottom = layout.paddingBottom,
				gapY = layout.spacingY,
				node = this.ui.node_left_btns.children[0];

			height = height + gapTop;
			height = height + gapBottom;
			height = height + (count-1) * gapY;
			height = height + node.height * count;
		}
		//设置拖拽层容器大小
		this.ui.node_left_btns.height = height;
	}
	addRightFrame(){
		this.removeRightFrame();

		this.ui.node_botton_frame = cc.instantiate(this.ui.prefab_botton_frame);
		this.ui.node_right_frame.addChild(this.ui.node_botton_frame)
		this.addTopFrame();
	}

	removeRightFrame(){
		this.ui.node_right_frame.destroyAllChildren();
		this.refreshClubMemberHeight();
	}

	addTopFrame(){
		//console.log("this.ui.frame_top_btns", this.ui.frame_top_btns);
		if (this.ui.frame_top_btns != null){
			this.ui.frame_top_btns.destroy();
			this.ui.frame_top_btns = null;
		}
		this.ui.frame_top_btns = cc.instantiate(this.ui.prefab_top_btns);
		this.ui.node_right_frame.addChild(this.ui.frame_top_btns);
	}
	refreshLobbyOff(){
		this.ui.node_left_create.pauseSystemEvents(true)
		this.ui.node_left_enter1.resumeSystemEvents(true);
	}
	refreshLobbyOn(){
		this.ui.node_left_create.resumeSystemEvents(true)
		this.ui.node_left_enter1.pauseSystemEvents(true)
	}
	showCreateBtn(){
		this.ui.node_left_create.active = this.model.creatSwitch == 1?true:false;
		if(!this.ui.node_left_create.active){
			this.ui.node_left_create.active = false;
			this.ui.node_left_enter1.active = true;
			this.refreshLobbyOff();
		}else{
			this.ui.node_left_create.active = true;
			this.ui.node_left_enter1.active = false;
			this.refreshLobbyOn();
		}
	}
}
//c, 控制
@ccclass
export default class Club_LobbyCtrl extends BaseCtrl {
	//这边去声明ui组件

	@property(cc.Prefab)
	prefab_top_btns:cc.Prefab = null
	
	@property(cc.Prefab)
	prefab_botton_frame:cc.Prefab = null

	@property(cc.Node)
	btn_close:cc.Node = null

	@property(cc.Node)
	node_top_frame:cc.Node = null
	
	@property(cc.Node)
	node_left_btns:cc.Node = null

	@property(cc.Node)
	node_left_create:cc.Node = null

	@property(cc.Node)
	node_left_enter1:cc.Node = null

	@property(cc.Node)
	node_left_enter:cc.Node = null

	@property(cc.Node)
	node_right_frame:cc.Node = null

	@property(cc.Node)
	node_club_member:cc.Node = null

	@property(cc.Node)
	node_club_diamond:cc.Node = null

	@property(cc.Label)
	label_club_id:cc.Label = null

	@property(cc.Label)
	label_club_diamond:cc.Label = null

	@property(cc.Node)
	node_club_share:cc.Node = null;

	@property(cc.Color)
	member_count_color:cc.Color = null;

	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离

	onDestroy()
	{
		super.onDestroy();
		RoomMgr.getInstance().setInClub(false);
	}
	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model,View);
		this.refreshClubList();
		RoomMgr.getInstance().setInClub(true); 
	}

	//定义网络事件
	defineNetEvents()
	{
		this.n_events = {
			'http.reqClubList':this.http_reqClubList,
			'http.reqClubInfo':this.http_reqClubInfo,
			"http.reqClubDissolve":this.http_reqClubDissolve,
			"http.reqClubExit":this.http_reqClubExit,
			"http.reqClubChangeAvater":this.http_reqClubChangeIcon,
			"http.reqClubChangeName":this.http_reqClubChangeName,
			"http.reqClubJoin":this.http_reqClubJoin,
			"http.reqClubBlacklisRemove":this.http_reqClubBlacklisRemove,
			"http.reqClubKick":this.http_reqClubKick,
			"http.reqClubRecharge":this.http_reqClubRecharge,
			"http.reqClubTop":this.http_reqClubTop,
			"http.onClubInfo":this.http_onClubInfo,
			'http.reqGameSwitch':this.http_reqGameSwitch,
		}
	}
	//定义全局事件
	defineGlobalEvents()
	{
		this.g_events = {
			refreshClubList:this.refreshClubList,
		}
	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image, this.ui.btn_close,this.btn_close_cb,"关闭界面");
		this.connect(G_UiType.image, this.ui.node_left_create,this.node_left_create_cb,"创建茶馆");
		this.connect(G_UiType.image, this.ui.node_left_enter1,this.node_left_enter_cb,"创建茶馆");
		this.connect(G_UiType.image, this.ui.node_left_enter,this.node_left_enter_cb,"进入茶馆");
		this.connect(G_UiType.image, this.ui.node_club_diamond,this.node_club_diamond_cb,"添加茶馆钻石" );
		this.connect(G_UiType.image, this.ui.node_club_share,this.node_club_share_cb,"分享茶馆" );
	}
	refreshClubList(){		
		this.model.refreshClubList();
		this.view.removeResreshUi();
		this.view.refreshResreshUi();
		var clubNum = this.ui.node_left_btns.childrenCount;
        for(let i = 0; i < clubNum; i ++){
			var left_node = this.ui.node_left_btns.children[i];
			this.connect(G_UiType.button, left_node, (node, event)=>{
				var index = i;
				//console.log("refreshClubList 2", index, clubNum);
                this._onClick_item(index, node, event)
			}, '选择茶馆'+i);			
			let node_clubtop = this.ui.node_left_btns.children[i].getChildByName("top");
			let clubId = this.model.club_list[i].id;
			node_clubtop.tag = clubId;
			this.connect(G_UiType.image, node_clubtop,this.node_club_top_cb,"点击置顶"+i );
		}
	}
	start () {
	}
	//网络事件回调begin
	http_reqClubList(){
		this.model.refreshClubList();
		let list = this.model.getClubList();
		if (list.length == 0 || list.length == null){
			this.finish();
		}else{
			this.refreshClubList();
			this.view.addTopFrame();
			this.view.refreshClubId();
			this.view.refreshClubDiamond();
			this.view.addRightFrame();
			this.view.refreshLeftMemberCount(this.model.getClubId());
			this.view.refreshClubRecharge();
		}
	}
	private http_reqClubInfo(){
		this.model.refreshClubList();
		//this.view.addTopFrame();
		this.view.refreshLeftIcon(this.model.getClubId());
		this.view.refreshLeftName(this.model.getClubId());
		this.view.refreshLeftCount(this.model.getClubId());
		this.view.refreshClubId();
		this.view.refreshClubDiamond();
		this.view.addRightFrame();
		this.view.refreshLeftMemberCount(this.model.getClubId());
		this.view.refreshClubRecharge();
	}
	private http_reqClubDissolve(){
		FrameMgr.getInstance().showHintBox("茶馆解散成功", ()=>{});
	}
	private http_reqClubExit(){
		FrameMgr.getInstance().showHintBox("已退出茶馆", ()=>{});
	}

	private http_reqClubChangeIcon(){
		this.model.refreshClubList();
		this.view.refreshLeftIcon(this.model.getClubId());
	}
	private http_reqClubChangeName(){
		this.model.refreshClubList();
		this.view.refreshLeftName(this.model.getClubId());
	}
	private http_onClubInfo(msg){
		let data = msg.states;
		if (CLUB_INFO_STATE.EXIT == data.state){
			let user_id = UserMgr.getInstance().getUid();
			if (data.operation_id != user_id){
				this.model.refreshClubList();
				this.view.refreshLeftMemberCount(this.model.getClubId());
				if (data.change_id == user_id){
					if(data.club_name) {
						FrameMgr.getInstance().showMsgBox(`已踢出茶馆${data.club_name}`, ()=>{}, "提示");
					}
				}
			}
		}else if (CLUB_INFO_STATE.ENTER == data.state){
			let user_id = UserMgr.getInstance().getUid();
			if (data.change_id != user_id){
				this.model.refreshClubList();
				this.view.refreshLeftMemberCount(data.club_id);
			}
		}else if (CLUB_INFO_STATE.DISSOVE == data.state){
			// let user_id = UserMgr.getInstance().getUid();
			// if (data.operation_id != user_id){
			// 	FrameMgr.getInstance().showMsgBox(`茶馆${data.club_name}已解散`, ()=>{}, "提示");
			// }
		}
	}
	private http_reqClubJoin(msg){
		this.model.refreshClubList();
		this.view.refreshLeftMemberCount(msg.club_id);
		this.changClubList();
	}
	private http_reqClubBlacklisRemove(msg){
		this.model.refreshClubList();
		this.view.refreshLeftMemberCount(msg.club_id);
	}
	private http_reqClubKick(msg){
		this.model.refreshClubList();
		this.view.refreshLeftMemberCount(this.model.getClubId());
	}
	private http_reqClubTop(msg){
		//判断是否置顶成功，成功以后才请求刷新茶馆列表		
		//console.log("茶馆列表置顶消息",msg);
		if(msg == "置顶成功"){
			//FrameMgr.getInstance().showTips('置顶成功', null, 35, cc.color(0,255,0), cc.p(0,0), "Arial", 1000);
			ClubMgr.getInstance().reqClubList();
			this.model.refreshClubList();			
			this.view.removeResreshUi();
			this.view.refreshResreshUi();
		}else{
			FrameMgr.getInstance().showTips('置顶失败', null, 35, cc.color(255,0,0), cc.p(0,0), "Arial", 1000);
		}			
	}
	private http_reqClubRecharge(msg){
		this.model.refreshClubList();
		this.view.refreshClubDiamond();
	}
	private http_reqGameSwitch(msg){
		this.model.updateSwitch(msg);
		this.view.showCreateBtn();
	}

	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private btn_close_cb(node, event){
		//console.log('btn_close_cb')
		this.finish();
	}

	private node_left_create_cb(node, event){
		this.start_sub_module(G_MODULE.ClubCreate);
	}

	private node_left_enter_cb(node, event){
		this.start_sub_module(G_MODULE.ClubSeek, (uiRoom:Club_SeekListCtrl)=>{
			uiRoom.offCreate();
		}, "Club_SeekListCtrl");
	}
	private _onClick_item(index, node, event){
		if (this.model.getClubIndex() == index){
			return 
		}
		this.model.setClubIndex(index);
		let clubChatData = ClubChatMgr.getInstance().getClubChat(this.model.getClubId());
		if(clubChatData.length>0)
		{
			ClubMgr.getInstance().reqClubInfo(this.model.getClubId());
		}
		else{
			ClubMgr.getInstance().reqClubInfo(this.model.getClubId(),1);
		}
		this.view.refreshLeftMemberCount(this.model.getClubId());
	}
	private node_club_diamond_cb(node, event){
		this.start_sub_module(G_MODULE.ClubRecharge);
	}

	//分享
	private node_club_share_cb(node, event){
		if (cc.sys.isNative) {
			let club_index = this.model.getClubIdToIndex(this.model.getClubId()),
				data = this.model.getClubList()[club_index];
			let strContent = `${data.name}(ID:${this.model.getClubData().no})发来了一封邀请函，快来加入茶馆一起玩牌！`
			
			let appname=AppInfoMgr.getInstance().getAppName();
			G_PLATFORM.wxShareClub(G_PLATFORM.WX_SHARE_TYPE.WXSceneSession, `${appname}茶馆邀请`, strContent, this.model.getClubId());
		}
	}
	//置顶
	private node_club_top_cb(node){
		ClubMgr.getInstance().reqClubTop(node.tag);
	}
	//end
	changClubList(){
		//改变茶馆排序
		// let club_id = this.model.getClubId();
		// ClubMgr.getInstance().reqClubTop(club_id)
		this.gemit("refreshClubList")
	}
}