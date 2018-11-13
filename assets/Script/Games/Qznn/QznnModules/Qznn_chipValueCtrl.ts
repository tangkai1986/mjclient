/*
author: YOYO
日期:2018-03-15 13:58:45
*/
import BaseView from "../../../Plat/Libs/BaseView";
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import GEventDef from "../../../Plat/GameMgrs/GEventDef";
import QznnLogic from "../QznnMgr/QznnLogic";
import QznnConst from "../QznnMgr/QznnConst";
import BullPosMgr from "../../../GameCommon/Bull/BullPosMgr";


//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Tbnn_chipValueCtrl;
let BullConst = null;
//模型，数据处理
class Model extends BaseModel{
    seatsCount:number
    curLogic:QznnLogic
	constructor()
	{
        super();
        
        this.seatsCount = RoomMgr.getInstance().getSeatCount();
        BullConst = QznnConst;
        this.curLogic = QznnLogic.getInstance();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    model:Model
    private curNodeCfg:cc.Node      //根据当前的人数，刷新最新的配置
	ui={
		//在这里声明ui
	};
	node:cc.Node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
        this.curNodeCfg = this.node.getChildByName('seats_'+this.model.seatsCount);
    }
    
    //设置筹码的数值
    setChipValue(viewSeatId:number, chipValue:number){
        let curNode = this.curNodeCfg.children[viewSeatId];
        if(curNode){
            //飞行金币
            let startPos = BullPosMgr.getInstance().getSeatPos(viewSeatId);
            let targetPos = curNode.position;
            let tagStr = 'chipValue_'+viewSeatId;
            this.model.curLogic.emit_flyGold(startPos, targetPos, tagStr);
            //刷新值，并先隐藏
            curNode.children[0].children[0].getComponent(cc.Label).string = chipValue+'';
            curNode.active = false;
        }
    }
    showChipVlaue (viewSeatId){
        this.curNodeCfg.children[viewSeatId].active = true;
    }
    //批量发起投注表现（通比牛牛底注一样，用的是房间的底注）
    showAllChipValue (){
        let dict = QznnLogic.getInstance().getCurChipInfo();
        for(let viewSeatId = 0; viewSeatId < this.model.seatsCount; viewSeatId ++){
            if(RoomMgr.getInstance().getLogicSeatId(viewSeatId) == null){
                //该位置上没有人
            }else{
                this.setChipValue(viewSeatId, dict[viewSeatId]);
            }
        }
    }
}
//c, 控制
@ccclass
export default class Tbnn_chipValueCtrl extends BaseCtrl {
	view:View = null
	model:Model = null
	//这边去声明ui组件

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
        this.n_events = {};
        this.n_events[BullConst.clientEvent.onProcess] = this.onProcess;
	}
	//定义全局事件
	defineGlobalEvents()
	{
        this.g_events = {};
        this.g_events[GEventDef.bull_flyGoldEnd] = this.onModules_flyGoldEnd
	}
	//绑定操作的回调
	connectUi()
	{
	}
	start () {

	}
    //网络事件回调begin
    //进程管理
    onProcess(msg){
        switch(msg.process){
            case BullConst.process.start:
                //游戏重新开始
                this.view.showAllChipValue();
            break
        }
    }
	//end
    //全局事件回调begin
    
    //金币飞行结束
    onModules_flyGoldEnd(msg:string){
        //console.log('金币飞行结束onModules_flyGoldEnd', msg)
        let viewSeatId = msg.split('_')[1];
        this.view.showChipVlaue(viewSeatId);
    }
	//end
	//按钮或任何控件操作的回调begin
	//end
}