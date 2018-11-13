import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

import TaskMgr from "../../GameMgrs/TaskMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_DayTaskPanel;
//模型，数据处理
class Model extends BaseModel{
	tasks = null;
	constructor()
	{
		super();
		this.tasks = TaskMgr.getInstance().getTaskList();
	}

}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		taskContent: ctrl.taskPanel,
		pre_item: ctrl.taskItem,
		arrTaskItem:[]
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
		for(let i = 0; i < this.model.tasks.length; ++i){
			TaskMgr.getInstance().setTaskItemInfo(this.model.tasks[i]);
			let item = cc.instantiate(this.ui.pre_item);
			this.ui.taskContent.addChild(item);
			this.ui.arrTaskItem.push(item)
		}
		for(let i = 0; i < this.model.tasks.length; ++i){
			if(this.model.tasks[i].is_receive == 1){
				this.ui.arrTaskItem[i].removeFromParent()
				this.ui.taskContent.addChild(this.ui.arrTaskItem[i]);
			}
		}
	}
}
//c, 控制
@ccclass
export default class Prefab_DayTaskPanel extends BaseCtrl {
	//这边去声明ui组件
	@property({
		tooltip: '任务项容器',
		type: cc.Node
	})
	taskPanel: cc.Node = null;

	@property({
		tooltip: '任务项预制',
		type: cc.Prefab
	})
	taskItem: cc.Prefab = null;

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