/*
author: YOYO
日期:2018-03-30 09:53:27
*/
import BullPosMgr from "./BullPosMgr";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";
import BaseModel from "../../Plat/Libs/BaseModel";
import BaseView from "../../Plat/Libs/BaseView";
import BaseCtrl from "../../Plat/Libs/BaseCtrl";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Bull_preventionCheating;
//模型，数据处理
class Model extends BaseModel{
	uid=null; 
	ipWarnning=false;//ip警告
	distWarnning=false;//距离警告
	waiguaWarnning=false;//外挂警告
	constructor()
	{
		super();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	model:Model
	ui={
		//在这里声明ui
		prefab_preventionCheating:null,
	};
    private dict_one
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
        this.initUi();
		this.dict_one = {};
		
	}
	//初始化ui
	initUi(){
	    this.ui.prefab_preventionCheating = ctrl.prefab_preventionCheating;
	}
	
	
    showOne (viewSeat,isGps,isCheat,isIp){
        let targetNode = this.getOne(viewSeat);
        let children = targetNode.children;
        let gps = children[0];
        let cheat = children[1];
        let ip = children[2];

        gps.active = Boolean(isGps);
        cheat.active = Boolean(isCheat);
        ip.active = Boolean(isIp);
    }
    private getOne (viewSeatId:number):cc.Node{
		let curNode = this.dict_one[viewSeatId];
        if(!curNode){
            curNode = cc.instantiate(this.ui.prefab_preventionCheating);
            curNode.parent = this.node;
            let posMgr = BullPosMgr.getInstance();
            let curPos = posMgr.getSeatCheckPos(viewSeatId);
            let minSeat = posMgr.getMinSeatId();
            curPos.x += viewSeatId < minSeat ? -curNode.width/2 : curNode.width/2;
            curNode.position = curPos;
            this.dict_one[viewSeatId] = curNode;
        }
        return curNode;
	}
	deleteOne(viewSeatId:number){
		if(this.dict_one[viewSeatId]){
			this.dict_one[viewSeatId].destroy();
			delete this.dict_one[viewSeatId]
		}
	}
}
//c, 控制
@ccclass
export default class Bull_preventionCheating extends BaseCtrl {
	view:View = null
	model:Model = null

	//这边去声明ui组件
	
	@property({
		tooltip:"防作弊",
		type:cc.Prefab
	})
	prefab_preventionCheating:cc.Prefab = null;
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
			'http.reqCheating':this.http_reqCheating, 
			'onLeaveRoom':this.onLeaveRoom,
	   }
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
	http_reqCheating(msg){	//我点击当前的喇叭图标，发送的数据是这个
		let result = msg.result;
		let room = RoomMgr.getInstance();
		for(let uid in result){
			let seatId = room.getSeatIdByUid(uid);
			//if(Object.prototype.toString.call(parseInt(seatId)) != "[object Number]") continue;
			if(seatId == null)continue;
			let viewSeatId  = room.getViewSeatId(seatId);
			let ipWarnning=room.getIpWarnningBySeatId(seatId);
			let distWarnning=room.getDistWarnningBySeatId(seatId)
			//在自己的座位上不生成作弊图标
			if(viewSeatId!="0"){
				this.view.showOne(room.getViewSeatId(seatId),distWarnning,false,ipWarnning);
			}
		}
	}
	onLeaveRoom(msg){
		let seatId = msg.seatid;
		let viewSeatId  = RoomMgr.getInstance().getViewSeatId(seatId);
		this.view.deleteOne(viewSeatId);
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
}