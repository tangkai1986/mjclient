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
const AUDIOSTATE = {
	speak:1,
	nothing:3,
	listen:2
}
let ctrl : Bull_voiceCtrl;
//模型，数据处理
class Model extends BaseModel{
	constructor()
	{
		super();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	model:Model
	voice = null;
	ui={
		//在这里声明ui
		prefab_voice: null
	};
	node=null;
	private dict_flagImg 	
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
		this.ui.prefab_voice = ctrl.prefab_voice;
	}
	addVoice(viewSeat, state){
		if(!this.dict_flagImg) this.dict_flagImg = {};
		if(viewSeat == 0)return;
		let curNode = this.dict_flagImg[viewSeat];
		if(!curNode){
			curNode = cc.instantiate(this.ui.prefab_voice);
			//坐标
            let pos = BullPosMgr.getInstance().getSeatVoicePos(viewSeat);
            pos.x -= curNode.width/2;
            pos.y += curNode.height/2;
			//增加
			curNode.position = pos;
			this.node.addChild(curNode);
			this.dict_flagImg[viewSeat] = curNode;
		}
		this.checkState(curNode, state);
	}
	checkState (curNode:cc.Node, state){
		if(state == AUDIOSTATE.speak)
		{
			curNode.children[0].active = true;
			curNode.children[1].active = false;
			curNode.children[2].active = false;
		}
		else if(state == AUDIOSTATE.nothing){
			curNode.children[0].active = false;
			curNode.children[1].active = false;
			curNode.children[2].active = true;
		}else if(state == AUDIOSTATE.listen){
			curNode.children[0].active = false;
			curNode.children[1].active = true;
			curNode.children[2].active = false;
		}
	}
	//let action = cc.blink(2, 10);
	deleteVoice(viewSeatId){
		if(this.dict_flagImg[viewSeatId]){
			this.dict_flagImg[viewSeatId].destroy();
			delete this.dict_flagImg[viewSeatId]
		}
	}
}
//c, 控制
@ccclass
export default class Bull_voiceCtrl extends BaseCtrl {
	view:View = null
	model:Model = null
	seatID:Number = 0;
	//这边去声明ui组件
	@property({
		tooltip:"voice",
		type:cc.Prefab
	})
	prefab_voice:cc.Prefab = null;
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
       this.n_events['onVoiceStateChanged'] = this.onVoiceStateChanged;
       this.n_events['onEnterRoom'] = this.onEnterRoom;
	   this.n_events['connector.entryHandler.enterRoom'] = this.onEnterRoom1;
	   this.n_events['onLeaveRoom']= this.onLeaveRoom;
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
        // this.view.addVoice(0, AUDIOSTATE.listen);
        // this.view.addVoice(1, AUDIOSTATE.speak);
	}
	//网络事件回调begin
	onVoiceStateChanged(msg)	//我点击当前的喇叭图标，发送的数据是这个
	{
		////console.log("更改了声音显示=",msg)
        this.updateVoice(msg.seatid);
    }
    onEnterRoom(msg){
        this.updateVoice(msg.seatid);
    }
    onEnterRoom1(msg){
        for(let seatId in msg.voicestates){
          this.updateVoice(seatId);
        }
    }
	onLeaveRoom(msg){
		let seatid = msg.seatid;
		let viewSeatId =  RoomMgr.getInstance().getViewSeatId(seatid);
		this.view.deleteVoice(viewSeatId);
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
    //end
    
    private updateVoice (logicSeatId){
        let voiceState = RoomMgr.getInstance().getVoiceState(logicSeatId);
		let viewSeatId = RoomMgr.getInstance().getViewSeatId(logicSeatId);

		this.view.addVoice(viewSeatId, voiceState);
    }
}