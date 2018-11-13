/*
author: YOYO
日期:2018-03-15 13:58:45
*/
import BaseView from "../../../Plat/Libs/BaseView";
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import TbnnLogic from "../BullMgr/TbnnLogic";
import TbnnConst from "../BullMgr/TbnnConst";
import GEventDef from "../../../Plat/GameMgrs/GEventDef";
import BullPosMgr from "../../../GameCommon/Bull/BullPosMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Tbnn_chipValueCtrl;
let BullConst = null;
//模型，数据处理
class Model extends BaseModel{
    seatsCount:number
    curLogic:TbnnLogic
	constructor()
	{
        super();
        
        this.seatsCount = RoomMgr.getInstance().getSeatCount();
        BullConst = TbnnConst;
        this.curLogic = TbnnLogic.getInstance();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    model:Model
    private curNodeCfg:cc.Node      //根据当前的人数，刷新最新的配置
    private dict_chips              //筹码列表
	ui={
        //在这里声明ui
        prefab_oneChip:null
	};
	node:cc.Node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
        this.initUi();
        
        this.dict_chips = {};
	}
	//初始化ui
	initUi()
	{
        this.ui.prefab_oneChip = ctrl.prefab_oneChip;
        this.curNodeCfg = this.node.getChildByName('seats_'+this.model.seatsCount);
    }
    
    //显示断线重连后的下注值
    setSyncChip (){
        let room = RoomMgr.getInstance();
        let users = room.users;
        for(let seatId in users){
            //console.log('显示该座位的凑吗= seatId=',seatId)
            this.showChipOnly(room.getViewSeatId(seatId), this.model.curLogic.getBaseChipValue());
        }
    }
    showChipValue (viewSeatId){
        let curNode = this.dict_chips[viewSeatId];
        if(curNode){
            curNode.active = true;
        }
    }
    //批量发起投注表现（通比牛牛底注一样，用的是房间的底注）
    showAllChipValue (){
        let room = RoomMgr.getInstance();
        let users = room.users;
        for(let seatId in users){
            if(!TbnnLogic.getInstance().getIsWatcher(seatId)){
                this.setChipValue(room.getViewSeatId(seatId), this.model.curLogic.getBaseChipValue());
            }
        }
    }
    //清除投注
    deleteAllChipValue(){
        let room = RoomMgr.getInstance();
        let users = room.users;
        for(let seatId in users){
            let curNode = this.getOneChip(RoomMgr.getInstance().getViewSeatId(seatId));
            curNode.active = false;
        }
    }
    //刷新对应座位的筹码值
    showSeatChipValue (chipDict){
        for(let seatId in chipDict){
            let viewSeatId = RoomMgr.getInstance().getViewSeatId(seatId)
            if(viewSeatId == undefined) continue;
            this.setChipValue(viewSeatId, this.model.curLogic.getBaseChipValue());
        }
    }

    //设置筹码的数值
    private setChipValue(viewSeatId:number, chipValue:number){
        let curNode = this.getOneChip(viewSeatId);
        if(curNode){
            let posMgr = BullPosMgr.getInstance();
            let startPos = posMgr.getSeatPos(viewSeatId);
            let targetPos = curNode.position;
            let tagStr = 'chipValue_'+viewSeatId;
            this.model.curLogic.emit_flyGold(startPos, targetPos, tagStr);
            //刷新值，并先隐藏
            curNode.children[0].getComponent(cc.Label).string = chipValue+'';
            curNode.active = false;
        }
    }
    //获取一个筹码显示
    private getOneChip (viewSeatId:number){
        let curNode = this.dict_chips[viewSeatId];
        if(!curNode){
            curNode = cc.instantiate(this.ui.prefab_oneChip);
            curNode.parent = this.node;
            curNode.position = BullPosMgr.getInstance().getChipPos(viewSeatId);
            this.dict_chips[viewSeatId] = curNode;
        }
        return curNode;
    }

    //直接显示下注值
    private showChipOnly(viewSeatId:number, chipValue:number){
        let curNode = this.getOneChip(viewSeatId);
        if(curNode){
            let tagStr = 'chipValue_'+viewSeatId;
            //刷新值，并先隐藏
            curNode.children[0].getComponent(cc.Label).string = chipValue+'';
            curNode.active = true;
        }
    }
}
//c, 控制
@ccclass
export default class Tbnn_chipValueCtrl extends BaseCtrl {
	view:View = null
    model:Model = null
    private midChipInfo
	//这边去声明ui组件
    @property(cc.Prefab)
    prefab_oneChip:cc.Prefab = null
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
        this.n_events[BullConst.clientEvent.onProcess] = this.onProcess;
        this.n_events[BullConst.clientEvent.onSyncData] = this.onSyncData;
        this.n_events[BullConst.clientEvent.onMidEnter] = this.onMidEnter;
        this.n_events['room.roomHandler.nextRound'] = this.onNextRound;
        this.n_events['connector.entryHandler.enterRoom'] = this.onMyEnterRoom;//自己进入的
        this.n_events['http.reqUsers'] = this.http_reqUsers;//自己的信息正确刷新了
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
        //console.log('++++ 这里进入start')
	}
    //网络事件回调begin
    //自己进入的
    onMyEnterRoom(msg){
        let room = RoomMgr.getInstance();
        this.view.deleteAllChipValue();
    }
    //进程管理
    onProcess(msg){
        switch(msg.process){
            case BullConst.process.start:
                //游戏重新开始
                this.view.showAllChipValue();
            break
        }
    }
    //断线重连
    onSyncData(){
        this.view.setSyncChip();
    }
    //自己是中途入场的
    onMidEnter (msg){
        //console.log('++++ 这里进入onMidEnter')
        this.midChipInfo = msg.dict_chipValue;
    }
    http_reqUsers(){
        //console.log('++++ 这里进入http_reqUsers')
        if(this.midChipInfo){
            this.view.showSeatChipValue(this.midChipInfo);
            this.midChipInfo = null;
        }
    }
   //自己准备下一局
   onNextRound(msg) {
        this.view.deleteAllChipValue();
    }
	//end
    //全局事件回调begin
    
    //金币飞行结束
    onModules_flyGoldEnd(msg:string){
        //console.log('金币飞行结束onModules_flyGoldEnd', msg)
        let viewSeatId = msg.split('_')[1];
        this.view.showChipValue(viewSeatId);
    }
	//end
	//按钮或任何控件操作的回调begin
	//end
}