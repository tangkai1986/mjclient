
/*
author: YOYO
日期:2018-03-15 13:58:45
*/
import BaseView from "../../../Plat/Libs/BaseView";
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import MpnnLogic from "../BullMgr/MpnnLogic";
import MpnnConst from "../BullMgr/MpnnConst";
import GEventDef from "../../../Plat/GameMgrs/GEventDef";
import BullPosMgr from "../../../GameCommon/Bull/BullPosMgr";
const chipIndex = {
    0:[1,2],
    1:[2,4],
    2:[4,8],
    3:[5,10],
}
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Mpnn_chipValueCtrl;
let BullConst = null;
//模型，数据处理
class Model extends BaseModel{
    seatsCount:number
    curLogic:MpnnLogic
    chipList:any = null;
    palyerList:any = null;
    delaerSeatId:any = null;
    GrabList:any = null;
    grabbanker:any = null;
    minChip:any = null;
	constructor()
	{
        super();
        
        this.seatsCount = RoomMgr.getInstance().getSeatCount();
        BullConst = MpnnConst;
        this.curLogic = MpnnLogic.getInstance();
    }
    getAllPlayerChip(){
        this.minChip = chipIndex[RoomMgr.getInstance().getFangKaCfg().v_minChip][0]
        this.GrabList = MpnnLogic.getInstance().getGrablist();
        this.grabbanker = RoomMgr.getInstance().getFangKaCfg().v_grabbanker;
        this.chipList = MpnnLogic.getInstance().getChiplist();
        this.palyerList = MpnnLogic.getInstance().getValidSeats();
        this.delaerSeatId = MpnnLogic.getInstance().getDelaerSeatId();
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
        for(let viewSeatId = 0; viewSeatId < this.model.seatsCount; viewSeatId ++){
            if(RoomMgr.getInstance().getLogicSeatId(viewSeatId) == null){
                //该位置上没有人
            }else{
                this.showChipOnly(viewSeatId, this.model.curLogic.getBaseChipValue());
            }
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
            this.setChipValue(room.getViewSeatId(seatId), this.model.curLogic.getBaseChipValue());
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
            this.setChipValue(RoomMgr.getInstance().getViewSeatId(seatId), this.model.curLogic.getBaseChipValue());
        }
    }
    //进入算牌阶段后显示未下注玩家的默认下注筹码
    setAllplayerChip(){
        let seatId;
        for (seatId in this.model.chipList) {
            if(seatId != this.model.delaerSeatId){
                let isGrabing = null;
                let viewSeatId = RoomMgr.getInstance().getViewSeatId(seatId);
                if (this.model.palyerList[seatId] == null) {
                    //该位置上没有人
                } else if(this.model.chipList[seatId] == this.model.minChip){
                    isGrabing = this.model.GrabList[seatId] == this.model.GrabList[this.model.delaerSeatId] && this.model.GrabList[this.model.delaerSeatId]!= 0 && this.model.GrabList[this.model.delaerSeatId] == this.model.grabbanker? true:false;
                    let value = null;
                    if(isGrabing){
                        value = this.model.chipList[seatId] * 2;
                    }else{
                        value = this.model.chipList[seatId];
                    }
                    this.showChipOnly(viewSeatId, value);
                }
            }
        }
    }

    //设置筹码的数值
    setChipValue(viewSeatId: number, chipValue: number) {
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
    showChipOnly(viewSeatId:number, chipValue:number){
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
export default class Mpnn_chipValueCtrl extends BaseCtrl {
	view:View = null
	model:Model = null
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
        this.n_events = {};
        this.n_events[BullConst.clientEvent.onProcess] = this.onProcess;
        this.n_events[BullConst.clientEvent.onSyncData] = this.onSyncData;
        this.n_events[BullConst.clientEvent.onMidEnter] = this.onMidEnter;
        this.n_events[MpnnConst.clientEvent.onChooseChip] = this.onChooseChip;
        this.n_events['room.roomHandler.nextRound'] = this.onNextRound;
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
                //this.view.showAllChipValue();
            break
            case BullConst.process.calculate:
                this.model.getAllPlayerChip();
                this.view.setAllplayerChip();
            break
        }
    }
    onChooseChip(msg){
        let logseatId = MpnnLogic.getInstance().getMyLogicSeatId();
        let viewSeatId = RoomMgr.getInstance().getViewSeatId(msg.seatId)
        this.view.setChipValue(viewSeatId,msg.chipValue)
    }
    //断线重连
    onSyncData(msg) {
        let process = msg.processType
        if(process == 3 || process == 4){
            let seatID;
            for(seatID in msg.dictChooseChip){
                if(seatID != MpnnLogic.getInstance().getDelaerSeatId()){
                    let viewSeatId = RoomMgr.getInstance().getViewSeatId(seatID);
                    this.view.showChipOnly(viewSeatId, msg.dictChooseChip[seatID]);
                }
            }
        }
    }
    //自己是中途入场的
    onMidEnter (msg){
        if (msg.enterSeatId == RoomMgr.getInstance().getMySeatId()){
            this.view.showSeatChipValue(msg.dict_chipValue);
        }
    }
   //有人准备
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