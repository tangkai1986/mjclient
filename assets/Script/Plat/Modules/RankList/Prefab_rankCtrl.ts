/*
author: YOYO
日期:2018-02-06 11:39:18
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import BehaviorMgr from "../../GameMgrs/BehaviorMgr";
import Prefab_rankItemCtrl from "./Prefab_rankItemCtrl";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl :  Prefab_rankCtrl;
const RANK_LIST_TYPE = cc.Enum({
    RankData:0,
    RankType:1
})

const RANK_TYPE = cc.Enum({
    RankMj:0,
    RankDdz:1
})

const RANK_FILTE = cc.Enum({
    RankAll:0,
    RankRoom:1
})

//模型，数据处理
class Model extends BaseModel{
	private rank_type:number = null
	private rank_filte:number = null
	private rank_begin:number = null
	private rank_record:boolean = true
	private rank_type_call:boolean = true
	private rank_list = null
	constructor()
	{
		super();
		this.rank_type = RANK_LIST_TYPE.RankData;
		this.rank_filte = RANK_FILTE.RankAll;
		this.rank_list = new Array;
		this.rank_begin = 0;
		this.rank_record = true;
		this.rank_type_call = false;
		//临时数据
		this.addRankData();
	}
	public cutRankType(){
		if (this.rank_type == RANK_LIST_TYPE.RankData){
			this.rank_type = RANK_LIST_TYPE.RankType;
		}else {
			this.rank_type = RANK_LIST_TYPE.RankData;
		}
		return this.rank_type;
	}
	public getRankType(){
		return this.rank_type;
	}

	public cutRankFilte(state){
		this.rank_filte = state;
	}
	public getRankFilte(){
		return this.rank_filte;
	}
	public getRankBegin(){
		return this.rank_begin;
	}
	public setRankBegin(num){
		this.rank_begin = num;
	}

	public setRankRecord(state){
		this.rank_record = state;
	}
	public getRankRecord(){
		return this.rank_record;
	}
	public setRankTypeCall(state){
		this.rank_type_call = state;
	}
	public getRankTypeCall(){
		return this.rank_type_call;
	}

	//临时模拟数据

	//设置列表数据
	public setRankData () {
		this.rank_list.splice(0, this.rank_list.length);
		this.addRankData();
	}
	public addRankData(){
		var count = 20;
		for (let i = this.rank_begin; i< this.rank_begin + count ; i++){
			this.rank_list [i] = {
				_index : i + 1,							//排行名次
				_id: i + 1,								//玩家ID
				_icon : i,							//这是个icon
				_name : "逗比"+i,					  //玩家名字
				_award : "这是个文本",				//奖励
				_sex : (i%2)==1?"男":"女",				//性别
				_site : "国外"+i,						//地址
			}
		}
	}

	public getRankData(){
		return this.rank_list;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		node_sprite_all:null,
		node_left_close:null,
		node_right_close:null,
		node_topCutTypeBtns:null,
		node_topCutBtns:null,
		node_rankView:null,
		node_typeView:null,
		node_rankList:null,
		node_typeList:null,
		player_data:null,
		scroll_rankView:null,
		node_select1:null,
    	node_select2:null,
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
		//在这里声明ui
		this.ui.node_sprite_all = ctrl.node_sprite_all;
		this.ui.node_left_close = ctrl.node_left_close;
		this.ui.node_right_close = ctrl.node_right_close;
		this.ui.node_topCutTypeBtns = ctrl.node_topCutTypeBtns;
		this.ui.node_topCutBtns = ctrl.node_topCutBtns;
		this.ui.node_rankView = ctrl.node_rankView;
		this.ui.node_typeView = ctrl.node_typeView;
		this.ui.node_rankList = ctrl.node_rankList;
		this.ui.node_typeList = ctrl.node_typeList;
		this.ui.player_data = ctrl.player_data;
		this.ui.scroll_rankView = ctrl.scroll_rankView;
		this.ui.node_select1 = ctrl.node_select1;
    	this.ui.node_select2 = ctrl.node_select2;
		
		this.enterRankAction();
	}
	public enterRankAction(){
		this.ui.node_sprite_all.x -= this.ui.node_sprite_all.width;
		this.ui.node_sprite_all.pauseSystemEvents(true);
		var moveBy = cc.moveBy(0.3, cc.p(this.ui.node_sprite_all.width, 0));
		var callback = cc.callFunc(()=>{
			this.ui.node_sprite_all.resumeSystemEvents(true);
		});
		this.ui.node_sprite_all.runAction(cc.sequence(moveBy, callback));
	}
	public exitRankAction(exitCall){
		this.ui.node_sprite_all.pauseSystemEvents(true);
		var moveBy = cc.moveBy(0.3, cc.p(-this.ui.node_sprite_all.width, 0));
		var callback = cc.callFunc(()=>{
			exitCall();
		});
		this.ui.node_sprite_all.runAction(cc.sequence(moveBy, callback));
	}

	public cutRankType(){
		this.ui.node_rankView.active = false;
		this.ui.node_typeView.active = false;
		var rank_type = this.model.cutRankType()
		if (rank_type == RANK_LIST_TYPE.RankData){
			this.ui.node_rankView.active = true;
		}else{
			this.ui.node_typeView.active = true;
		}
	}

	public cutRankFilte(){
		var rank_filte = this.model.getRankFilte();
		if (rank_filte == RANK_FILTE.RankRoom){
			rank_filte = RANK_FILTE.RankAll;
		}else {
			rank_filte = RANK_FILTE.RankRoom;
		}
		this.model.cutRankFilte(rank_filte);
		this.ui.node_select1.active = false;
		this.ui.node_select2.active = false;
		if (rank_filte == RANK_FILTE.RankAll){
			this.ui.node_select1.active = true;
		}else{
			this.ui.node_select2.active = true;
		}

		this.clearRankList();
		this.model.setRankData();
	}

	public addRankPlayer(i){
		let curNode:cc.Node = cc.instantiate(this.ui.player_data);
		curNode.parent = this.ui.node_rankList;
        return curNode;
	}
	public setRankHeight(count){
		let curNode:cc.Node = cc.instantiate(this.ui.player_data),
			layout = this.ui.node_rankList.getComponent(cc.Layout),
			layoutGap = layout.spacingY;

		this.ui.node_rankList.height = count * (curNode.height + layoutGap);
	}
	public clearRankList(){
		this.ui.node_rankList.destroyAllChildren();
		this.model.setRankBegin(0);
		this.model.setRankRecord(true); 
	}
	public RankScrollTop(){
		this.ui.scroll_rankView.stopAutoScroll();
		this.ui.scroll_rankView.scrollToTop(0);
	}
	
}
//c, 控制
@ccclass
export default class  Prefab_rankCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property(cc.Node)
	node_sprite_all:cc.Node = null

	@property(cc.Node)
	node_left_close:cc.Node = null

	@property(cc.Node)
	node_right_close:cc.Node = null
	
	@property(cc.Node)
	node_topCutTypeBtns:cc.Node = null
	
	@property(cc.Node)
	node_topCutBtns:cc.Node = null
	
	@property(cc.Node)
	node_rankView:cc.Node = null
	
	@property(cc.Node)
	node_typeView:cc.Node = null

	@property(cc.Node)
	node_rankList:cc.Node = null
	
	@property(cc.Node)
	node_typeList:cc.Node = null
	
	@property(cc.Prefab)
	player_data:cc.Prefab = null
	
	@property(cc.Node)
	node_select1:cc.Node = null
	
	@property(cc.Node)
	node_select2:cc.Node = null
	
	@property(cc.ScrollView)
	scroll_rankView:cc.ScrollView = null

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
            //'http.reqMailData' : this.http_reqMailDataCB,
		}
		
		this.http_reqRankDataCB();
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image, this.ui.node_left_close, this.node_close_cb, "左关闭界面")
		this.connect(G_UiType.image, this.ui.node_right_close, this.node_close_cb, "右关闭界面")
		this.connect(G_UiType.image, this.ui.node_topCutTypeBtns, this.cut_type_cb, "切换列表类型")
		this.connect(G_UiType.image, this.ui.node_topCutBtns, this.cut_filte_cb, "切换列表内容")
		this.connect(G_UiType.scroll, this.ui.node_rankList, this.rank_view_cb, "切换列表内容")
		
		this.connect(G_UiType.button, this.node_sprite_all, ()=>{}, "屏蔽层");
	}
	start () {
	}
	private addTypeCallBak(){
		if (this.model.getRankTypeCall() == true){
			return 
		}
		let node_list = this.ui.node_typeList.children;
		let node_count = this.ui.node_typeList.childrenCount;
		for (let i = 0; i < node_count; i++){
			let node_data = node_list[i];
			this.connect(G_UiType.image, node_data, this.rank_type_item_cb, '切换列表内容2');
		}
		this.model.setRankTypeCall(true);
	}

	//网络事件回调begin
	//end
	private http_reqRankDataCB(){
		//this.model.setRankData();
		this.refreshRank();
	}
	//全局事件回调begin
	//end
	public refreshRank(){
		var rank_list = this.model.getRankData();
		var itemNum = rank_list.length;
		this.view.setRankHeight(itemNum);
		var begin_num = this.model.getRankBegin();
		if (begin_num == 0){
			this.view.RankScrollTop();
		}
        for(let i = begin_num; i < itemNum; i ++){
			var odd = rank_list[i];
			BehaviorMgr.getInstance().setRankItemData(odd);
			let curItemComp = this.view.addRankPlayer(odd._index);
			this.connect(G_UiType.image, curItemComp, (node, event)=>{
                var index = i;
                this._onClick_item(index, node, event)
            }, '切换玩家'+i);
		}
		this.model.setRankBegin(itemNum);
		this.model.setRankRecord(true); 
	}
	//按钮或任何控件操作的回调begin
	//end
	private node_close_cb(node, event){
		//console.log('node_close_cb')
		this.view.exitRankAction(()=>{this.finish();});
	}

	private rank_view_cb(node, event){
		if (event.type == cc.Node.EventType.TOUCH_MOVE){
			var rank_list = this.model.getRankData()
			var itemNum = rank_list.length;
			var node_height = node.height - this.ui.node_rankView.height
			if ((node_height * 0.25 * 4) < node.y
			&& this.model.getRankRecord() == true
			&& itemNum < 100) {
				this.model.setRankRecord(false); 
				this.model.addRankData();
				this.refreshRank();
			}
		}
	}

	private cut_filte_cb(node, event){
		this.view.cutRankFilte();

		this.refreshRank();
	}

	private rank_type_item_cb(node, event){
		this.view.cutRankType();
		//切换类型不一的排行列表
		switch(node.name){
			case "Prefab_mj":
				this.view.clearRankList();
				this.model.setRankData();
				this.refreshRank();
				break;
			case "Prefab_ddz":
				this.view.clearRankList();
				this.model.setRankData();
				this.refreshRank();
				break;
			default:

			break
		}
	}

	private _onClick_item(index, node, event){
		if (event.type == "touchcancel")return;
		var rank_list = this.model.getRankData();
		let odd = rank_list[index];
		BehaviorMgr.getInstance().setRankItemData(odd);
		this.start_sub_module(G_MODULE.RoleDetail);
	}

	private cut_type_cb(node, event){
		this.view.cutRankType();
		this.addTypeCallBak();
	}
}