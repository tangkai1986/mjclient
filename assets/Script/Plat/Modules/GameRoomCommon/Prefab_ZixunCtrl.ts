/*
author: YOYO
日期:2018-04-03 13:49:28
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import CreateRoomMgr from'../../GameMgrs/CreateRoomMgr';
import BetMgr from "../../GameMgrs/BetMgr";
import CreateRoomOptionCfg  from'../../CfgMgrs/CreateRoomOptionCfg'
import RoomMgr from "../../GameMgrs/RoomMgr";
//MVC模块,
const {ccclass, property} = cc._decorator;
const intervalH = 20;
let ctrl : Prefab_ZixunCtrl;
//模型，数据处理
class Model extends BaseModel{
	private NNOptionData =null;
	private gameID = null;
	constructor()
	{
		super();
		this.gameID = BetMgr.getInstance().getGameId();
		this.NNOptionData = CreateRoomOptionCfg.getInstance().getNNOption(this.gameID);
	}
	getContent (key) {
        return this.NNOptionData.content[key];
    }
    getTitle (key) {
        return this.NNOptionData.title[key];
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		Content:null,
		ClickBg:null,
		ZixunContent:null,
		//arrItem : [],
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
		this.initOptionItem();
	}
	//初始化ui
	initUi()
	{
		this.ui.Content = ctrl.Content;
		this.ui.ClickBg = ctrl.ClickBg;
		this.ui.ZixunContent = ctrl.ZixunContent;
	}
	initOptionItem(){
        for (let key in this.model.NNOptionData.title) {
			let item = cc.instantiate(this.ui.ZixunContent)
            item.parent = this.ui.Content
            let content = this.model.getContent(key)		//内容
            let title = this.model.getTitle(key)			//标题
			let TitlenNode = item.children[0];
			let contentNode = item.children[1];   //实例化小项出来
			TitlenNode.getComponent(cc.Label).string = title;
			contentNode.getComponent(cc.Label).string = content;
			if(contentNode.height>(item.height-intervalH)){
				item.height = contentNode.height+intervalH;
			}
			this.setContentH(item);
        }
	}
	setContentH(node){
		this.ui.Content.height += node.height+10;
	}
}
//c, 控制
@ccclass
export default class Prefab_ZixunCtrl extends BaseCtrl {
	view:View = null
	model:Model = null
	//这边去声明ui组件

	@property({
		tooltip:'Content',
		type:cc.Node
	})
	Content : cc.Node = null;

	@property({
		tooltip:'背景点击层',
		type:cc.Node
	})
	ClickBg : cc.Node = null;

	@property({
		tooltip:'小项',
		type:cc.Prefab
	})
	ZixunContent : cc.Prefab = null;
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
		this.connect(G_UiType.text, this.ClickBg, this.clickBg_cb, '点击背景层');
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	clickBg_cb(){
		this.node.destroy();
	}
	//end
}