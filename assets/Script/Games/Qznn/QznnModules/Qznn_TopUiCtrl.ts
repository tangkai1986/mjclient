/*
author: YOYO
日期:2018-03-02 16:44:08
*/
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import UserMgr from "../../../Plat/GameMgrs/UserMgr";
import FrameMgr from "../../../Plat/GameMgrs/FrameMgr";
import QznnConst from "../QznnMgr/QznnConst";
import QznnLogic from "../QznnMgr/QznnLogic";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : QznnTopUiCtrl;
//模型，数据处理
class Model extends BaseModel{
    intervalID:number = null            //
	constructor()
	{
		super();

    }
    //自己是否处于准备状态
    getIsMyPrepare (){
        let seatId = RoomMgr.getInstance().getMySeatId();
        return RoomMgr.getInstance().preparemap[seatId];
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    intervalID:number = null
    node_grabFlag:cc.Node = null                //是否抢庄标志的集合
    node_dealerWord:cc.Node = null;
	ui={
        //在这里声明ui
        node_seats:null,
        node_img_grabAni:null,
        node_dealerFlag:null,
        sprite_thinking:null,
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
        this.ui.node_seats = ctrl.node_seats;    
        this.ui.node_img_grabAni = ctrl.node_img_grabAni;      
        this.ui.node_dealerFlag = ctrl.node_dealerFlag;   
    }
    //显示抢庄特效, viewSeatId : 从0开始
    showGrabAni(startViewSeatId:number, endViewSeatId:number){
        let maxSeatCount = this.ui.node_seats.children.length;
        let intervalTime = 1 * 1000;
        let intervalTimes = endViewSeatId>startViewSeatId?(endViewSeatId-startViewSeatId)+1:((maxSeatCount-1)-endViewSeatId+startViewSeatId);
        let curTimes = 0;
        //增加一个轮回
        // intervalTimes+=maxSeatCount;

        this.ui.node_img_grabAni.active = true;
        let curPos = this.getGrabAniPos(startViewSeatId);
        this.ui.node_img_grabAni.position = curPos;
        this.model.intervalID = setInterval(()=>{
            curTimes+=1;
            if(curTimes >= intervalTimes){
                clearInterval(this.model.intervalID);
                this.ui.node_img_grabAni.active = false;
                this.showConfirmDealer();
            }else{
                curPos = this.getGrabAniPos((startViewSeatId+curTimes)%maxSeatCount);
                this.ui.node_img_grabAni.position = curPos;
            }
        }, intervalTime);
    }

    //显示是否抢庄的标志
    showOneGrabFlag (viewSeatId:number, grabIndex:number){
        if(!this.node_grabFlag){
            QznnLogic.getInstance().addGrabFlag((prefab, prefabNode)=>{
                this.node_grabFlag = prefabNode;
                let flg = this.node_grabFlag.children[viewSeatId];
                if(flg){
                    flg.active = true;
                    let isGrab = Boolean(grabIndex);
                    flg.children[0].active = isGrab;
                    flg.children[1].active = !isGrab;
                }
            });
        }else{
            let flg = this.node_grabFlag.children[viewSeatId];
            if(flg){
                flg.active = true;
                let isGrab = Boolean(grabIndex);
                flg.children[0].active = isGrab;
                flg.children[1].active = !isGrab;
            }
        }
    }
    //清理所有抢庄标志
    clearGrabFlag(){
        if(this.node_grabFlag){
            this.node_grabFlag.destroy();
            this.node_grabFlag = null;
        }
    }
    //确定庄家的位置
    setDealerFlag(viewSeatId:number){
        let pos = this.ui.node_seats.children[viewSeatId].position;
        if(!this.node_dealerWord){
            QznnLogic.getInstance().addDealerWord((prefab, prefabNode)=>{
                this.node_dealerWord = prefabNode;
                this.node_dealerWord.position = pos;
                this.node_dealerWord.parent = this.node;
            });
        }

    }
    clearDealerFlag(){
       this.node_dealerWord = null;
    }

    //清理
    clear(){
        this.clearGrabFlag();
        this.clearDealerFlag();
    }

    //============

    //显示确定庄家的特效
    private showConfirmDealer (){
        // let targetPos = this.ui.node_img_grabAni.position;
        this.ui.node_img_grabAni.active = true;

        let time1 = 0.5;
        let act1 = cc.scaleTo(time1, 2);
        let act2 = cc.callFunc(()=>{
            this.ui.node_img_grabAni.scale = 1;
            this.ui.node_img_grabAni.active = false;
            ctrl.onGrabAniEnd();
        }, this);
        this.ui.node_img_grabAni.runAction(cc.sequence(act1, act2));
    }

    private getMasterPos(viewSeatId:number){
        let seatNode = this.ui.node_seats.children[viewSeatId];
        return cc.p(seatNode.x+seatNode.width/2, seatNode.y+seatNode.height/2);
    }

    private getGrabAniPos(viewSeatId:number){
        return this.ui.node_seats.children[viewSeatId].position;
    }
}
//c, 控制
@ccclass
export default class QznnTopUiCtrl extends BaseCtrl {
    view:View = null
    model:Model = null
    //这边去声明ui组件
    //seat info
    @property(cc.Node)
    node_seats:cc.Node = null
    // icons
    @property(cc.Node)
    node_img_grabAni:cc.Node = null
    @property(cc.Node)
    node_dealerFlag:cc.Node = null
    @property(cc.Prefab)
    Prefab_thinking:cc.Prefab = null
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
        //全局消息
        this.n_events={ 
            'onPrepare':this.onPrepare
        }
        this.n_events[QznnConst.clientEvent.onProcess] = this.onProcess;
        this.n_events[QznnConst.clientEvent.onPeopleGrab] = this.onPeopleGrab;
        this.n_events[QznnConst.clientEvent.onConfirmDealer] = this.onConfirmDealer;
	}
	//定义全局事件
	defineGlobalEvents()
	{
	}
	//绑定操作的回调
	connectUi(){}
	start () {
        
	}
    //网络事件回调begin
    onPrepare(msg){
        if(msg.seatid == RoomMgr.getInstance().getMySeatId()){
            this.view.clear();
        }
    }
    //有玩家选择了是否抢庄
    onPeopleGrab(msg){
        //console.log('有玩家选择了是否抢庄onPeopleGrab == ', msg);
        let seatId = msg.grabSeatId;
        let grabIndex = parseInt(msg.isGrab);
        this.view.showOneGrabFlag(RoomMgr.getInstance().getViewSeatId(seatId), grabIndex);
    }
    //确定庄家
    onConfirmDealer(msg){
        this.view.showGrabAni(0, RoomMgr.getInstance().getViewSeatId(msg.dealerSeatId))
    }
    //进程跟进
    onProcess(msg){
        if(msg.process==QznnConst.process.start){ 
            //游戏重新开始
            this.view.clear();
		}else if(msg.process==QznnConst.process.grabDealer){
            //开始抢庄
        }else if(msg.process==QznnConst.process.chooseChip){
            //开始下注
        }
    }

	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin
    
    //抢庄动画结束
    onGrabAniEnd(){
        //console.log('抢庄动画结束')
        // let viewSeatId = QznnLogic.getInstance().getDealerViewSeatId();
        let viewSeatId = 3;
        if(viewSeatId != null){
            this.view.setDealerFlag(viewSeatId);
        }
    }
    //end
    
    onDestroy(){
        clearInterval(this.model.intervalID);
        super.onDestroy();
    }
}