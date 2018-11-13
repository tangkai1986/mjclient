/*
author: HJB
日期:2018-03-16 15:09:54
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import BehaviorMgr from "../../GameMgrs/BehaviorMgr";
import GameRecordMgr from "../../GameMgrs/GameRecordMgr";
import GameCateCfg from "../../CfgMgrs/GameCateCfg";
import BunchInfoMgr from "../../GameMgrs/BunchInfoMgr";

const RECORD_MEMBER_COUNT = {
	ONE_LINE_BIG:3,
	ONE_LINE_MEDIUM:4,
	TWE_LINE_BIG:6,
	TWE_LINE_MEDIUM:8,
	TWE_LINE_SMALL:10,
}

const RECORD_PAY_NAME = {
	0:"房主支付",
	1:"AA制",
	2:"赢家支付"
}

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_RecordStripCtrl;
//模型，数据处理
class Model extends BaseModel{
	private record_data:any = null;
	private record_type:number = 0;
	private record_club:number = 0;
	constructor()
	{
		super();
		this.record_type = GameRecordMgr.getInstance().getGameType();
		this.record_club = GameRecordMgr.getInstance().getRecordClub();
		this.record_data = BehaviorMgr.getInstance().getGameRecordData();
	}
	getRecordType(){
		return this.record_type;
	}
	getRecordClub(){
		return this.record_club;
	}
	getRecordMember(){
		return this.record_data.memberlist;
	}
	getRecordDataType(){
		return this.record_data.type;
	}
	getStrRecordDataType(){
		// //console.log("getRecordDataType", this.record_data.type);
		let games = GameCateCfg.getInstance().getGameById(this.record_data.type);
		// //console.log(games);
		let type_name = games.name;
		return type_name;
	}
	getRecordDataTime(){
		return this.record_data.time;
	}
	getRecordDataClub(){
		return this.record_data.club_id;
	}
	getStrRecordDataClub(){
		return this.record_data.club_name;
	}
	getRecordDataPayType(){
		return this.record_data.pay_type;
	}
	getRecordDataPayCount(){
		return this.record_data.pay_count;
	}
	getRecordDataId(){
		return this.record_data.id;
	}
	getRecordRound(){
		return this.record_data.round;
	}
	getRecordBunchid(){
		return this.record_data.bunchid
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		prefab_content_small:null,
		prefab_content_medium:null,
		prefab_content_big:null,
		node_self:null,
		node_bottom:null,
		btn_type:null,
		btn_club:null,
		type_check:null,
		club_check:null,
		btn_frame:null,
		label_type:null,
		label_time:null,
		label_club:null,
		label_round:null,
		label_pay_type:null,
		label_pay_count:null,
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
		this.ui.prefab_content_small = ctrl.prefab_content_small;
		this.ui.prefab_content_medium = ctrl.prefab_content_medium;
		this.ui.prefab_content_big = ctrl.prefab_content_big;
		this.ui.node_self = ctrl.node_self;
		this.ui.node_bottom = ctrl.node_bottom;
		this.ui.btn_type = ctrl.btn_type;
		this.ui.btn_club = ctrl.btn_club;
		this.ui.type_check = ctrl.type_check;
		this.ui.club_check = ctrl.club_check;
		this.ui.btn_frame = ctrl.btn_frame;
		this.ui.label_type = ctrl.label_type;
		this.ui.label_time = ctrl.label_time;
		this.ui.label_club = ctrl.label_club;
		this.ui.label_round = ctrl.label_round;
		this.ui.label_pay_type = ctrl.label_pay_type;
		this.ui.label_pay_count = ctrl.label_pay_count;

		this.refreshUi();
	}
	refreshUi(){
		this.refreshFrameHeight();
		this.refreshGameType();
		this.refreshRecordClub();
		this.refreshRecordTime();
		this.refreshRecordRound();
		this.refreshRecordPayType();
		this.refreshRecordPayCount();
		this.refreshMemberList();
	}

	refreshGameType(){
		this.ui.label_type.string = this.model.getStrRecordDataType();
		if (this.model.getRecordType() != 0){
			this.ui.type_check.active = true;
		}else{
			this.ui.type_check.active = false;
		}
	}
	refreshRecordClub(){
		this.ui.label_club.string = this.model.getStrRecordDataClub();
		//console.log("refreshRecordClub", this.model.getRecordClub());
		if (this.model.getRecordClub() == 0){
			this.ui.club_check.active = false;
		}else{
			this.ui.club_check.active = true;
		}
	}
	refreshRecordTime(){
		this.ui.label_time.string = this.model.getRecordDataTime();
	}
	refreshRecordRound(){
		let strRound = ""+this.model.getRecordRound()+"局";
		if (this.model.getRecordRound() == 0){
			strRound = "1课";
		}
		this.ui.label_round.string = strRound;
	}
	refreshRecordPayType(){
		if(this.model.getRecordDataClub() == -2){
			this.ui.label_pay_type.string = RECORD_PAY_NAME[this.model.getRecordDataPayType()];
		}else{
			this.ui.label_pay_type.string = "茶馆支付";
		}		
	}
	refreshRecordPayCount(){
		this.ui.label_pay_count.string = this.model.getRecordDataPayCount();
	}

	refreshFrameHeight(){
		let member = this.model.getRecordMember();
		if (member.length <= RECORD_MEMBER_COUNT.ONE_LINE_MEDIUM){
			this.ui.btn_frame.height = this.ui.btn_frame.height / 2;
			this.ui.node_self.height -= this.ui.btn_frame.height;
			this.ui.node_bottom.height -= this.ui.btn_frame.height;
		}
	}

	addRecordPlayer(length){
		let player = null;
		if (length <= RECORD_MEMBER_COUNT.TWE_LINE_SMALL 
			&& length > RECORD_MEMBER_COUNT.TWE_LINE_MEDIUM)
			player = cc.instantiate(this.ui.prefab_content_small);
		else if ((length <= RECORD_MEMBER_COUNT.TWE_LINE_MEDIUM 
			&& length > RECORD_MEMBER_COUNT.TWE_LINE_BIG) || (
				length <= RECORD_MEMBER_COUNT.ONE_LINE_MEDIUM 
			&& length > RECORD_MEMBER_COUNT.ONE_LINE_BIG
			))
			player = cc.instantiate(this.ui.prefab_content_medium);
		else
			player = cc.instantiate(this.ui.prefab_content_big);

		this.ui.btn_frame.addChild(player);
	}

	refreshMemberList(){
		let member = this.model.getRecordMember(),
			count = member.length;

		for (let i = 0; i < count; i++){
			let data = member[i];
			BehaviorMgr.getInstance().setRecordPlayerData(data);
			this.addRecordPlayer(count);
		}
	}
}
//c, 控制
@ccclass
export default class Prefab_RecordStripCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property(cc.Prefab)
	prefab_content_small:cc.Prefab = null

	@property(cc.Prefab)
	prefab_content_medium:cc.Prefab = null

	@property(cc.Prefab)
	prefab_content_big:cc.Prefab = null

	@property(cc.Node)
	node_self:cc.Node = null

	@property(cc.Node)
	node_bottom:cc.Node = null

	@property(cc.Node)
	btn_type:cc.Node = null

	@property(cc.Node)
	btn_club:cc.Node = null

	@property(cc.Node)
	type_check:cc.Node = null

	@property(cc.Node)
	club_check:cc.Node = null

	@property(cc.Node)
	btn_frame:cc.Node = null

	@property(cc.Label)
	label_type:cc.Label = null

	@property(cc.Label)
	label_time:cc.Label = null

	@property(cc.Label)
	label_club:cc.Label = null

	@property(cc.Label)
	label_round:cc.Label = null

	@property(cc.Label)
	label_pay_type:cc.Label = null

	@property(cc.Label)
	label_pay_count:cc.Label = null

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
		this.connect(G_UiType.image, this.ui.btn_type,this.btn_type_cb,"切换类型");
		this.connect(G_UiType.image, this.ui.btn_club,this.btn_club_cb,"切换茶馆");
		this.connect(G_UiType.button, this.ui.btn_frame,this.btn_frame_cb,"点击详情");
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private btn_type_cb(node, event){
		//console.log("btn_type_cb");
		let type = this.model.getRecordDataType();
		if (this.model.getRecordType() != 0){
			type = 0;
		}
		GameRecordMgr.getInstance().reqGambleRecordList(
			1,
			null,
			type,
		);
	}
	private btn_club_cb(node, event){
		let club = this.model.getRecordDataClub();
		if (this.model.getRecordClub() != 0){
			club = 0;
		}
		GameRecordMgr.getInstance().reqGambleRecordList(
			1,
			null,
			null,
			club,
		);
	}
	private btn_frame_cb(node, event){
		//console.log("btn_frame_cb");
		BunchInfoMgr.getInstance().reqGambleRecord(this.model.getRecordBunchid());
	}
	//end
}