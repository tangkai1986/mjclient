/*
author: YOYO
日期:2018-03-27 10:07:58
*/
import FrameMgr from "../../Plat/GameMgrs/FrameMgr";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";
import BaseModel from "../../Plat/Libs/BaseModel";
import BaseView from "../../Plat/Libs/BaseView";
import BaseCtrl from "../../Plat/Libs/BaseCtrl";
 
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : BullRoomAroundCtrl;
//模型，数据处理
class Model extends BaseModel{
	mySeatId=null;
	
	constructor()
	{
		super();
	}
	
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		btn_gameRule :null,
		btn_set : null,
		btn_chat :null,
		btn_record : null,
		node_Electricity:null,
		label_curtime:null,
		node_internet:null,
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
		this.ui.label_curtime = ctrl.label_curtime;
		this.ui.node_Electricity = ctrl.node_Electricity;
		this.ui.node_internet = ctrl.node_internet;	
		this.ui.btn_chat = ctrl.node_btn_chat;
		this.ui.btn_gameRule = ctrl.node_btn_gameRule;
		this.ui.btn_set = ctrl.node_btn_set;
		this.ui.btn_record = ctrl.node_btn_record;
	}
	
}
//c, 控制
@ccclass
export default class BullRoomAroundCtrl extends BaseCtrl {
	view:View = null
	model:Model = null
	//这边去声明ui组件
	@property({
		tooltip:"游戏规则",
		type:cc.Node
	})
	node_btn_gameRule : cc.Node = null;

	@property({
		tooltip:"设置",
		type:cc.Node
	})
	node_btn_set : cc.Node = null;

	@property({
		tooltip:"战绩",
		type:cc.Node
	})
	node_btn_record : cc.Node = null;

	@property({
		tooltip:"聊天",
		type:cc.Node
	})
	node_btn_chat : cc.Node = null;

	@property({
		tooltip:"时间",
		type:cc.Label
	})
	label_curtime : cc.Label = null;

	@property({
		tooltip:"网络",
		type:cc.Node
	})
	node_internet : cc.Node = null;

	@property({
		tooltip:"电量",
		type:cc.Node
	})
	node_Electricity : cc.Node = null;

	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model,View);
		this.schedule(this.updateCurDate.bind(this), 1);

		
        if (cc.sys.isNative) {
            G_PLATFORM.getCurNetWorkData();
            G_PLATFORM.getBatteryPercent();
        }
	}

	updateCurDate () {
        let curDate = new Date();
        let hours = curDate.getHours();
        let minutes = curDate.getMinutes();
        this.label_curtime.string = `${hours<10?"0"+hours:hours}:${minutes<10?"0"+minutes:minutes}`
	}
	onDestroy(){   
        this.unschedule(this.updateCurDate);
		super.onDestroy(); 
	}
	//定义网络事件
	defineNetEvents()
	{
		
	}
	//定义全局事件
	defineGlobalEvents()
	{
		//全局消息
		this.g_events = {
			'batteryChange': this.onBatteryChange,
			'networkChange': this.onNetWorkChange,
		}
	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image, this.ui.btn_gameRule, this.btn_gameRule_cb, '点击房间规则');  
		this.connect(G_UiType.image, this.ui.btn_chat, this.btn_chat_cb, '点击聊天');
		this.connect(G_UiType.image, this.ui.btn_record, this.btn_zhanji_cb, '点击战绩');
		this.connect(G_UiType.image, this.ui.btn_set, this.setting_cb, '点击设置');  
	}
	start () {
	}
	// //网络事件回调begin

	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin

	setting_cb(){
		this.start_sub_module(G_MODULE.RoomSetting);
   	}
	
	btn_gameRule_cb(event){
		this.start_sub_module(G_MODULE.GameRule);
	}

	btn_chat_cb(event){
		this.start_sub_module(G_MODULE.RoomChat); 
	}

	btn_zhanji_cb(){
		this.start_sub_module(G_MODULE.GambleRecord); 
	}

	 // 监听电量变化
	 onBatteryChange (msg) {
		cc.log("电量变化？？", msg);
		let proportion = parseInt(msg/10);
		let imageName = "";
		if (6<=proportion) imageName = "dl_1";
		else if (3<=proportion) imageName = "dl_2";
		else imageName = "dl_3";
		// 写法有问题
		// 没有找到游戏内引用游戏外资源的函数
		// 这里先直接loader
		// liquan
		cc.loader.loadRes(`Icons/${imageName}`, cc.SpriteFrame, (err, sprite)=>{
			if (err) return cc.error(`no find Icons/${imageName}`);
			let childrens = this.node_Electricity.children;
			for (let i=0; i<childrens.length; i++) {
				childrens[i].active = i<proportion;
				(i<proportion)&&(childrens[i].getComponent(cc.Sprite).spriteFrame = sprite);
			}
		});
    }

    // 监听网络变化
    onNetWorkChange (msg) {
        cc.log("网络变化？？", msg);
        let imageName = `${msg.type}_${msg.level}`;
        cc.loader.loadRes(`Icons/${imageName}`, cc.SpriteFrame, (err, sprite)=>{
            if (err) return cc.error(`no find Icons/${imageName}`);
            this.node_internet.getComponent(cc.Sprite).spriteFrame = sprite;
        });
    }
	//end
}