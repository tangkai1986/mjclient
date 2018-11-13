/*
author: YOYO
日期:2018-03-02 16:44:08
*/
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import TbnnLogic from "../BullMgr/TbnnLogic";
import TbnnConst from "../BullMgr/TbnnConst";
import GEventDef from "../../../Plat/GameMgrs/GEventDef";
import BullPosMgr from "../../../GameCommon/Bull/BullPosMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Tbnn_TopUiCtrl;
//模型，数据处理
class Model extends BaseModel{
    intervalID:number = null            //
	constructor()
	{
		super();

    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    private dict_thinking
	ui={
        //在这里声明ui
        node_seats:null,
        node_img_grabAni:null,
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
        // this.ui.node_seats = ctrl.node_seats;   
        // this.ui.node_img_grabAni = ctrl.node_img_grabAni;       
    }
    // //显示抢庄特效, viewSeatId : 从0开始
    // showGrabAni(startViewSeatId:number, endViewSeatId:number){
    //     let maxSeatCount = this.ui.node_seats.children.length;
    //     let intervalTime = 1 * 1000;
    //     let intervalTimes = endViewSeatId>startViewSeatId?(endViewSeatId-startViewSeatId):((maxSeatCount-1)-endViewSeatId+startViewSeatId);
    //     let curTimes = 0;

    //     this.ui.node_img_grabAni.active = true;
    //     let curPos = this.getGrabAniPos(startViewSeatId);
    //     this.ui.node_img_grabAni.position = curPos;
    //     this.model.intervalID = setInterval(()=>{
    //         curTimes+=1;
    //         if(curTimes >= intervalTimes){
    //             clearInterval(this.model.intervalID);
    //             this.ui.node_img_grabAni.active = false;
    //             this.showConfirmDealer();
    //         }else{
    //             curPos = this.getGrabAniPos((startViewSeatId+curTimes)%maxSeatCount);
    //             this.ui.node_img_grabAni.position = curPos;
    //         }
    //     }, intervalTime);
    // }

    // //============

    // //显示确定庄家的特效
    // private showConfirmDealer (){
    //     // let targetPos = this.ui.node_img_grabAni.position;
    //     this.ui.node_img_grabAni.active = true;

    //     let time1 = 0.5;
    //     let act1 = cc.scaleTo(time1, 2);
    //     let act2 = cc.callFunc(()=>{
    //         this.ui.node_img_grabAni.scale = 1;
    //         this.ui.node_img_grabAni.active = false;
    //         ctrl.onGrabAniEnd();
    //     }, this);
    //     this.ui.node_img_grabAni.runAction(cc.sequence(act1, act2));
    // }

    // private getGrabAniPos(viewSeatId:number){
    //     return this.ui.node_seats.children[viewSeatId].position;
    // }
}
//c, 控制
@ccclass
export default class Tbnn_TopUiCtrl extends BaseCtrl {
    view:View = null
    model:Model = null
    //这边去声明ui组件
    //seat info
    // @property(cc.Node)
    // node_seats:cc.Node = null
    // // icons
    // @property(cc.Node)
    // node_img_grabAni:cc.Node = null
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
    //抢庄动画结束
    onGrabAniEnd(){
        //console.log('抢庄动画结束')

    }
    //end
    
    onDestroy(){
        clearInterval(this.model.intervalID);
        super.onDestroy();
    }
}