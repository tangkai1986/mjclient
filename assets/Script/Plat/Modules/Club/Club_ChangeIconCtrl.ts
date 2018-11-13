/*
author: HJB
日期:2018-03-05 10:35:51
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

import ClubMgr from "../../GameMgrs/ClubMgr";
import BehaviorMgr from "../../GameMgrs/BehaviorMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Club_ChangeIconCtrl;
//模型，数据处理
class Model extends BaseModel{
	private club_id = null
	constructor()
	{
		super();
		this.club_id = BehaviorMgr.getInstance().getClubSelectId()
	}
	public getClubId(){
		return this.club_id;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		node_close:null,
		icon_list:null,
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
		this.ui.node_close = ctrl.node_close;
		this.ui.icon_list = ctrl.icon_list;
	}
}
//c, 控制
@ccclass
export default class Club_ChangeIconCtrl extends BaseCtrl {
	//这边去声明ui组件

	@property(cc.Node)
	node_close:cc.Node = null

	@property(cc.Node)
	icon_list:cc.Node = null

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
			"http.reqClubChangeAvater":this.http_reqClubChangeAvater,
		}
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image, this.ui.node_close,this.node_close_cb,"退出");
		let count = this.ui.icon_list.childrenCount;
		for (let i = 0; i < count; i++){
			let node = this.ui.icon_list.children[i];
			this.connect(G_UiType.image, node, (node, event)=>{
				let index =i+1;
				this.node_icon_cb(index, node, event);
			},"图标点击");
		}
	}
	start () {
	}
	//网络事件回调begin
	private http_reqClubChangeAvater(){
		this.finish();
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private node_close_cb(node, event){
		//console.log('node_close_cb')
		this.finish();
	}

	private node_icon_cb(index, node, event){
		//console.log('node_icon_cb')
		let id = this.model.getClubId();
		ClubMgr.getInstance().reqClubChangeIcon(id, index);
		this.changClubList();
	}

	//end
	changClubList(){
		//改变茶馆排序
		// let club_id = this.model.getClubId();
		// ClubMgr.getInstance().reqClubTop(club_id)
		this.gemit("refreshClubList")
	}
}