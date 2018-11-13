/*
author: YOYO
日期:2018-02-06 11:39:18
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import BehaviorMgr from "../../GameMgrs/BehaviorMgr";
import UiMgr from "../../GameMgrs/UiMgr";
import UserMgr from "../../GameMgrs/UserMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl :  Prefab_rankItemCtrl;
//模型，数据处理
class Model extends BaseModel{
	private m_rank:number = null
	private m_icon:number = null
    private m_name:number = null
    private m_award:string = null
	constructor()
	{
		super();

		var player_data = BehaviorMgr.getInstance().getRankItemData();
		this.m_rank = player_data._index;
		this.m_icon = player_data._icon;
		this.m_name = player_data._name;
		this.m_award = player_data._award;
	}
	public getRankIndex(){
		return this.m_rank;
	}
	public getRankIcon(){
		return this.m_icon;
	}
	public getRankName(){
		return this.m_name;
	}
	public getRankAward(){
		return this.m_award;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		node_rank_pic:null,
		node_rank_text:null,
		rank_text:null,
		rank_pic:null,
		player_icon:null,
		player_name:null,
		award_text:null,
		spriteFrame_rank1:null,
		spriteFrame_rank2:null,
		spriteFrame_rank3:null,
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
		this.ui.node_rank_pic = ctrl.node_rank_pic;
        this.ui.node_rank_text = ctrl.node_rank_text;
        this.ui.rank_text = ctrl.rank_text;
        this.ui.rank_pic = ctrl.rank_pic;
        this.ui.player_icon = ctrl.player_icon;
        this.ui.player_name = ctrl.player_name;
        this.ui.award_text = ctrl.award_text;
        this.ui.spriteFrame_rank1 = ctrl.spriteFrame_rank1;
        this.ui.spriteFrame_rank2 = ctrl.spriteFrame_rank2;
		this.ui.spriteFrame_rank3 = ctrl.spriteFrame_rank3;
		
		this.refreshRankIndex();
		this.refreshRankIcon();
		this.refreshRankName();
		this.refreshRankAward();
	}
	//设置相对应状态
	public refreshRankIndex(){
		var index = this.model.getRankIndex()
		this.ui.node_rank_pic.active = false;
		this.ui.node_rank_text.active = false;
		if (index == 1) {
			this.ui.node_rank_pic.active = true;
			if(this.ui.spriteFrame_rank1)
				this.ui.rank_pic.spriteFrame = this.ui.spriteFrame_rank1;
		}else if (index == 2){
			this.ui.node_rank_pic.active = true;
			if(this.ui.spriteFrame_rank2)
				this.ui.rank_pic.spriteFrame = this.ui.spriteFrame_rank2;
		}else if (index == 3){
			this.ui.node_rank_pic.active = true;
			if(this.ui.spriteFrame_rank3) 
				this.ui.rank_pic.spriteFrame = this.ui.spriteFrame_rank3;
		}else{
			this.ui.node_rank_text.active = true;
			this.ui.rank_text.string = index;
		}
	}
	public refreshRankIcon(){
		//测试数据
		var myInfo = UserMgr.getInstance().getMyInfo();
		UiMgr.getInstance().setUserHead(this.ui.player_icon, myInfo.headid, myInfo.headurl);
	}
	public refreshRankName(){
		this.ui.player_name.string = this.model.getRankName();
	}
	public refreshRankAward() {
		this.ui.award_text.string = this.model.getRankAward();
	}
}
//c, 控制
@ccclass
export default class  Prefab_rankItemCtrl extends BaseCtrl {
	//这边去声明ui组件

	@property(cc.Node)
	node_rank_pic:cc.Node = null

	@property(cc.Node)
	node_rank_text:cc.Node = null

	@property(cc.Label)
	rank_text:cc.Label = null

	@property(cc.Sprite)
	rank_pic:cc.Sprite = null

	@property(cc.Node)
	player_icon:cc.Node = null

	@property(cc.Label)
	player_name:cc.Label = null

	@property(cc.Label)
	award_text:cc.Label = null

	@property(cc.SpriteFrame)
	spriteFrame_rank1:cc.SpriteFrame = null
	
	@property(cc.SpriteFrame)
	spriteFrame_rank2:cc.SpriteFrame = null
	
	@property(cc.SpriteFrame)
    spriteFrame_rank3:cc.SpriteFrame = null

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
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
}