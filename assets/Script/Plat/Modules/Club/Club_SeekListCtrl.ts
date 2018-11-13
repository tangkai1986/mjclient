/*
author: YOYO
日期:2018-02-22 15:30:09
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import BehaviorMgr from "../../GameMgrs/BehaviorMgr";
import ClubMgr from "../../GameMgrs/ClubMgr";
import FrameMgr from "../../GameMgrs/FrameMgr";
import SwitchMgr from "../../GameMgrs/SwitchMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Club_SeekListCtrl;
//模型，数据处理
class Model extends BaseModel{
	private seek_name:string = "";
	private seek_list = null;
	private creatSwitch = null;
	constructor()
	{
		super();
		this.seek_list = new Array();
		this.creatSwitch = SwitchMgr.getInstance().get_switch_add_club();
	}
	setSeekName(str){
		this.seek_name = str;
	} 
	getSeekName(){
		return this.seek_name;
	}
	setSeekList(list){
		this.seek_list = list;
	}
	refreshSeekList(){
		this.seek_list = ClubMgr.getInstance().getSeekList();
	}
	getSeekList(){
		return this.seek_list;
	}
	updateSwitch(msg){
		this.creatSwitch = msg.cfg.switch_add_club;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		btn_close:null,
		btn_seek:null,
		node_editseek:null,
		edit_seek: null,
		club_list:null,
		club_strip:null,
		node_create:null,
		node_club_seek:null,
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
		this.ui.btn_seek = ctrl.btn_seek;
		this.ui.node_editseek = ctrl.node_editseek;
		this.ui.edit_seek = ctrl.edit_seek;
		this.ui.club_list = ctrl.club_list;
		this.ui.club_strip = ctrl.club_strip;
		this.ui.node_create = ctrl.node_create;
		this.ui.node_club_seek = ctrl.node_club_seek;
		this.ui.node_create.active = false;
		this.showCreateBtn();
	}

	// 
	addClubStrip(){
		let club_node = cc.instantiate(this.ui.club_strip);
		this.ui.club_list.addChild(club_node);
	}
	removeAllClubStrip(){
		this.ui.club_list.destroyAllChildren();
	}

	refreshClubListHeight(){
		let count = this.ui.club_list.childrenCount,
			height = 0;
		if (count != 0){
			let layout = this.ui.club_list.getComponent(cc.Layout),
				gapTop = layout.paddingTop,
				gapBottom = layout.paddingBottom,
				gapY = layout.spacingY,
				node = this.ui.club_list.children[0];

			height = height + gapTop;
			height = height + gapBottom;
			height = height + (count-1) * gapY;
			height = height + node.height * count;
		}
		//设置拖拽层容器大小
		this.ui.club_list.height = height;
	}
	
	refreshClubList(){
		this.removeAllClubStrip();
		let club_list = this.model.getSeekList(),
			count = club_list.length;
		for (let i=0; i<count; i++){
			let data = club_list[i];
			BehaviorMgr.getInstance().setClubSeekData(data);
			this.addClubStrip();
		}
		this.refreshClubListHeight();
	}

	refreshSeekOff(){
		this.ui.node_club_seek.y = 0;
		this.ui.node_create.active = false;
		this.ui.node_create.pauseSystemEvents(true);
	}
	refreshSeekOn(){
		this.ui.node_club_seek.y = 29;
		this.ui.node_create.resumeSystemEvents(true);
	}
	showCreateBtn(){
		this.ui.node_create.active = this.model.creatSwitch == 1?true:false;
		if(!this.ui.node_create.active){
			this.refreshSeekOff();
		}else{
			this.refreshSeekOn();
		}
	}
}
//c, 控制
@ccclass
export default class Club_SeekListCtrl extends BaseCtrl {
	//这边去声明ui组件

	@property(cc.Node)
	btn_close:cc.Node = null

	@property(cc.Node)
	btn_seek:cc.Node = null

	@property(cc.Node)
	node_editseek:cc.Node = null

	@property(cc.EditBox)
	edit_seek:cc.EditBox = null

	@property(cc.Node)
	club_list:cc.Node = null

	@property(cc.Prefab)
	club_strip:cc.Prefab = null

	@property(cc.Node)
	node_create:cc.Node = null

	@property(cc.Node)
	node_club_seek:cc.Node = null

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
			"http.reqClubSeekList":this.http_reqClubSeekList,
			"http.reqClubApplyJoin":this.http_reqClubApplyJoin,
			"http.reqClubCreate":this.http_reqClubCreate,
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
		this.connect(G_UiType.image,this.ui.btn_close,this.btn_close_cb,"关闭界面");
		this.connect(G_UiType.edit,this.ui.node_editseek,this.editbox_content_cb,"获取控件数据");
		this.connect(G_UiType.image,this.ui.btn_seek,this.btn_seek_cb,"发送搜索");
		this.connect(G_UiType.image, this.ui.node_create,this.node_create_cb,"创建茶馆");
	}
	start () {
	}
	//网络事件回调begin
	http_reqClubSeekList(){
		this.model.refreshSeekList();
		this.view.refreshClubList();
	}
	
	private http_reqClubApplyJoin(){
		FrameMgr.getInstance().showTips("申请成功，请耐心等待", null, 35, cc.color(0,255,50));
	}
	private http_reqClubCreate(){
		FrameMgr.getInstance().showHintBox("创建茶馆成功！", ()=>{
			this.start_sub_module(G_MODULE.ClubLobby);
			this.finish();
		});
	}
	private http_reqGameSwitch(msg){
		this.model.updateSwitch(msg);
		this.view.showCreateBtn();
	}
	//end
	//全局事件回调begin
	public offCreate(){
		this.view.refreshSeekOff();
	}
	//end
	//按钮或任何控件操作的回调begin
	//点击关闭
	private btn_close_cb(node){
		//console.log('node_close_cb')
		this.finish();
	}

	private editbox_content_cb(str, event){
		//console.log("editbox_content_cb");
		if (str == "editing-did-ended"){
			let content = this.ui.edit_seek.string;
			this.model.setSeekName(content);
		}
	}

	private btn_seek_cb(node, event){
		//console.log('btn_seek_cb:'+this.model.getSeekName())
		let content = this.model.getSeekName();
		if (content == ""){
			FrameMgr.getInstance().showTips("搜索内容为空");
			this.ui.node_create.active = true;
			this.view.removeAllClubStrip();
			return
		}else{
			this.ui.node_create.active = false;
			ClubMgr.getInstance().reqClubSeekList(content);
		}		
	}

	private node_create_cb(node, event){
		this.start_sub_module(G_MODULE.ClubCreate);
	}
	//end
}