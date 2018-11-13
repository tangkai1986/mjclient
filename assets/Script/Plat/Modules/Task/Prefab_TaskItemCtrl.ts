import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

import TaskMgr from "../../GameMgrs/TaskMgr";
import FrameMgr from "../../GameMgrs/FrameMgr";
import ShareMgr from "../../GameMgrs/ShareMgr";
import ServerMgr from "../../../AppStart/AppMgrs/ServerMgr";
import AppInfoMgr from "../../../AppStart/AppMgrs/AppInfoMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
enum IS_RECEIVE
{
	noreceive = 0,
	received,
}
enum TASK_TYPE
{
	match = 2,
	winmatch,
	share,
}
let ctrl : Prefab_TaskItemCtrl;
//模型，数据处理
class Model extends BaseModel{
	task = null;
	bReceive = false;
	inviteInfo = null;
	constructor()
	{
		super();
		this.task = TaskMgr.getInstance().getTaskItemInfo();
		this.bReceive = this.task.is_receive == IS_RECEIVE.received;
		this.inviteInfo = ShareMgr.getInstance().getShareTaskData();
	}
	refTaskInfo(data){
		this.task = data;
		this.bReceive = this.task.is_receive == IS_RECEIVE.received;		
		this.inviteInfo = ShareMgr.getInstance().getShareTaskData();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		taskName: ctrl.taskName,
		taskLbl: ctrl.taskLbl,
		taskPb: ctrl.taskPb,
		rewardCount: ctrl.rewardCount,
		goBtn: ctrl.goBtn,
		recBtn: ctrl.recBtn,
		recLab: ctrl.recLab
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
		this.refreshBtnUI();
	}
	refreshBtnUI(){		
		let taskInfo = this.model.task;
		this.ui.taskName.string = taskInfo.name;
		this.ui.taskLbl.string = `${taskInfo.step}/${taskInfo.target}`;
		this.ui.taskPb.progress = taskInfo.step / taskInfo.target;
		this.ui.rewardCount.string = taskInfo.amount;	
		//console.log("reftaskInfo", this.model.task);			
		this.ui.recLab.active = this.model.bReceive;	
		let isReceive = this.model.task.is_receive;
		if(isReceive == IS_RECEIVE.received){
			this.ui.goBtn.active = false;
			this.ui.recBtn.active = false;
			return
		}
		this.ui.goBtn.active = taskInfo.step!=taskInfo.target;
		this.ui.recBtn.active = taskInfo.step==taskInfo.target;	
	}
}
//c, 控制
@ccclass
export default class Prefab_TaskItemCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property({
		tooltip:'任务名',
		type: cc.Label
	})
	taskName: cc.Label = null;

	@property({
		tooltip:'任务进度',
		type: cc.Label
	})
	taskLbl: cc.Label = null;

	@property({
		tooltip:'任务进度条',
		type: cc.ProgressBar
	})
	taskPb: cc.ProgressBar = null;

	@property({
		tooltip:'奖励数目',
		type: cc.Label
	})
	rewardCount: cc.Label = null;

	@property({
		tooltip:'前往按钮',
		type: cc.Node
	})
	goBtn: cc.Node = null;

	@property({
		tooltip:'领取按钮',
		type: cc.Node
	})
	recBtn: cc.Node = null;

	@property({
		tooltip:'已领取字样',
		type: cc.Node
	})
	recLab: cc.Node = null;

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
			'http.reqDailyActivityReceive': this.http_reqDailyActivityReceive,
			'http.reqDailyActivity': this.http_reqDailyActivity,
			'http.reqDailyShare': this.http_reqDailyShare,
		}
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.button, this.ui.goBtn, this.goBtnCB, "点击前往任务");
		this.connect(G_UiType.button, this.ui.recBtn, this.recBtnCB, "领取奖励");
	}
	start () {
	}

	http_reqDailyActivityReceive(msg){		
		//console.log("http_reqDailyActivityReceive",msg);
		let tipString = msg.msg;
		if (msg.reward_type == this.model.task.reward_type){
			FrameMgr.getInstance().showTips(tipString, null, 35, cc.color(220,24,63), cc.p(0,0), "Arial", 1500);
			//有待商榷的协议发送
			//TaskMgr.getInstance().reqDailyActivity();
		}
	}

	http_reqDailyActivity(msg){		
		//console.log("http_reqDailyActivity",msg);
		let task = null;
		for(let i = 0; i<msg.length; i++){
			if(msg[i].reward_type == this.model.task.reward_type){
				task = msg[i];
			}
		}
		//console.log("task_reward_type",task.reward_type);
		//console.log("task_target",task.target);
		//console.log("task_name",task.name);
		//console.log("task_step",task.step);
		//console.log("task_is_receive",task.is_receive);
		this.model.refTaskInfo(task);
		this.view.refreshBtnUI();	
		if(this.model.bReceive){
			let parentNode = this.node.parent;
			this.node.removeFromParent();
			this.node.parent = parentNode;
		}
	}

	http_reqDailyShare(msg){
		//console.log("http_reqDailyShare",msg);
		//多余的协议
		//TaskMgr.getInstance().reqDailyActivity();
	}

	goBtnCB () {
		let type = this.model.task.reward_type;
		if (type == TASK_TYPE.match || type == TASK_TYPE.winmatch){
			this.start_sub_module(G_MODULE.createRoom);
			TaskMgr.getInstance().closeTaskPanel();
		}
		if(cc.sys.isNative && type == TASK_TYPE.share){
			let appname=AppInfoMgr.getInstance().getAppName();
			G_PLATFORM.wxShareContent(G_PLATFORM.WX_SHARE_TYPE.WXSceneTimeline, `《${appname}》`, "正宗泉州麻将，iphone X免费领，每天登录送现金", this.model.inviteInfo.url);
		}
	}

	recBtnCB () {
		//console.log('rewardtype', this.model.task.reward_type);
		TaskMgr.getInstance().reqDailyActivityReceive(this.model.task.reward_type);
	}
}
