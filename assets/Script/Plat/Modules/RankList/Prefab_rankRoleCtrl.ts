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
let ctrl :  Prefab_rankRoleCtrl;
//模型，数据处理
class Model extends BaseModel{
	private m_id:number = null
	private m_icon:number = null
    private m_name:string = null
	private m_sex:string = null
	private m_site:string = null
	constructor()
	{
		super();

		let role_data = BehaviorMgr.getInstance().getRankItemData()
		
		this.m_id = role_data._id;
		this.m_icon = role_data._icon;
		this.m_name = role_data._name;
		this.m_sex = role_data._sex;
		this.m_site = role_data._site;
	}
	public getRoleId(){
		return this.m_id;
	}
	public getRoleIcon(){
		return this.m_icon;
	}
	public getRoleName(){
		return this.m_name;
	}
	public getRoleSex(){
		return this.m_sex;
	}
	public getRoleSite(){
		return this.m_site;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		node_rank_close:null,
		role_icon:null,
		role_id:null,
		role_name:null,
		role_sex:null,
		role_site:null,
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
		this.addGrayLayer();
	}
	//初始化ui
	initUi(){
		this.ui.node_rank_close = ctrl.node_rank_close;
		this.ui.role_icon = ctrl.role_icon;
		this.ui.role_id = ctrl.role_id;
		this.ui.role_name = ctrl.role_name;
		this.ui.role_sex = ctrl.role_sex;
		this.ui.role_site = ctrl.role_site;

		this.refreshIcon();
		this.refreshId();
		this.refreshName();
		this.refreshSex();
		this.refreshSite();
	}

	public refreshIcon(){
		//测试数据
		var myInfo = UserMgr.getInstance().getMyInfo();
		UiMgr.getInstance().setUserHead(this.ui.role_icon, myInfo.headid, myInfo.headurl);
	}
	public refreshId(){
		this.ui.role_id.string = this.model.getRoleId();
	}
	public refreshName(){
		this.ui.role_name.string = this.model.getRoleName();
	}
	public refreshSex(){
		this.ui.role_sex.string = this.model.getRoleSex();
	}
	public refreshSite(){
		this.ui.role_site.string = this.model.getRoleSite();
	}
}
//c, 控制
@ccclass
export default class  Prefab_rankRoleCtrl extends BaseCtrl {
	//这边去声明ui组件

	@property(cc.Node)
	node_rank_close:cc.Node = null

	@property(cc.Node)
	role_icon:cc.Node = null

	@property(cc.Label)
	role_id:cc.Label = null

	@property(cc.Label)
	role_name:cc.Label = null

	@property(cc.Label)
	role_sex:cc.Sprite = null

	@property(cc.Label)
	role_site:cc.Label = null


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
		this.connect(G_UiType.image, this.ui.node_rank_close, this.node_close_cb, '关闭界面')
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
	public node_close_cb(node, event){
		//console.log('node_close_cb')
		this.finish();
	}
}