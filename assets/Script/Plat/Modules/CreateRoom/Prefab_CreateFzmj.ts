import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import CreateRoomMgr from "../../GameMgrs/CreateRoomMgr";
import BetMgr from "../../GameMgrs/BetMgr";
import RoomCostCfg from "../../CfgMgrs/RoomCostCfg";
import GameFreeMgr from "../../GameMgrs/GameFreeMgr";
import RoomMgr from "../../GameMgrs/RoomMgr";

const {ccclass, property} = cc._decorator;
const ROOM_CONFIGS_NAME = ['v_roundcount','v_seatcount','v_paytype','v_fangfu']
let ctrl : Prefab_CreateFzmj;

class Model extends BaseModel{
	roomRuleInfo : any = {}
	gameid : any = {}
    roomcfg : any = []
    isFree = null;//是否限时免费
	constructor()
	{
        super();
        this.isFree = GameFreeMgr.getInstance().isFree(5);
		BetMgr.getInstance().setGameId(5);
        this.gameid = BetMgr.getInstance().getGameId();
        //console.log('gameId', this.gameid)
        this.roomRuleInfo = CreateRoomMgr.getInstance().getRoomRuleInfo(this.gameid)
        this.roomcfg={
        	v_roundcount:[8,16],
        	v_seatcount:[2,3,4],
            v_paytype:[0,1],
        	v_fangfu:[0,1,2]
        }
	}
}

class View extends BaseView{
    constructor(model){
        super(model);
		this.node=ctrl.node;
        this.initUi();
    }
    ui = {
        roundcountSet:ctrl.roundcountSet,
        peopleSet:ctrl.peopleSet,
        payTypeSet:ctrl.payTypeSet,
        youjinType:ctrl.youjinType,
        payCount:ctrl.payCount,
        payTypeLabel:ctrl.payTypeLabel,
        playMethod:ctrl.playMethod,
        ruleBtnList:[]
    }
    public initUi(){
        this.initPage(this.model.roomRuleInfo);
    }

    refreshFangfei() {
        let roomInfo = this.model.roomRuleInfo;
        let roomCost = RoomCostCfg.getInstance().getRoomCost('fzmj', 0, roomInfo.v_roundcount, roomInfo.v_seatcount, roomInfo.v_paytype)
        if(this.model.isFree) roomCost = 0;
        CreateRoomMgr.getInstance().setProperty(roomCost, 'roomRuleInfo', this.model.gameid, 'v_fangfei');
        this.ui.payCount.string = roomCost.toString();
    }

    initCheck(roomRuleInfo){
        let groups = [];
        groups.push(this.ui.roundcountSet);
        groups.push(this.ui.peopleSet);
        groups.push(this.ui.payTypeSet);
        groups.push(this.ui.youjinType);
        for(let i = 0; i<groups.length; i++){
    		let groupChildren = groups[i].getChildByName('ToggleContainer').children;
    		for(let j = 0; j<groupChildren.length; j++) {
    			this.initCheckState(groupChildren, ROOM_CONFIGS_NAME[i],roomRuleInfo)
    		}
    	}
    }

    initCheckState(groupChildren, toggleName,roomRuleInfo){
        let data = this.model.roomcfg[toggleName];
        let value = roomRuleInfo[toggleName];
        for (let i=0; i<data.length; i++) {
            if(RoomMgr.getInstance().isInClub()&&toggleName=='v_paytype')
            { 
                //强制被客户改成茶馆支付了
                this.model.roomcfg[toggleName][i]=0;//强制设置为一种支付方式
                groupChildren[1].active=false;
                groupChildren[0].getComponent(cc.Toggle).check();
                this.model.roomRuleInfo.v_paytype = 0;
                groupChildren[0].getChildByName('lab').getComponent(cc.Label).string='茶馆支付';
                continue;
            } 
    		if (data[i]==value) {
    			groupChildren[i].getComponent(cc.Toggle).check()
    		}
    	}
    }

    updatePayLabel(value){
        switch(value){
            case 0:
                this.ui.payTypeLabel.string = '首局结算时房主支付';
                if(RoomMgr.getInstance().isInClub()){
                this.ui.payTypeLabel.string = '首局结算时茶馆支付'; 
                }
                break;
            case 1:this.ui.payTypeLabel.string = '首局结算时所有玩家各支付';break;
        }
    }

    initPlayMethod(){
        this.ui.ruleBtnList = this.ui.playMethod.getChildByName('ToggleContainer').children;
        for(let i = 0; i < this.ui.ruleBtnList.length; ++i){
			let value = this.model.roomRuleInfo[this.ui.ruleBtnList[i].name];
			if(value){
				this.ui.ruleBtnList[i].getComponent(cc.Toggle).check();
			}
        }
    }

    initPage(roomRuleInfo){       
        this.initCheck(roomRuleInfo);
        this.initPlayMethod();
        this.refreshFangfei();
        this.updatePayLabel(roomRuleInfo.v_paytype);
        this.ui.payCount.node.parent.active = !this.model.isFree;
    }
}

@ccclass
export default class Prefab_CreateFzmj extends BaseCtrl {

    onLoad () {
    	//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
        this.initMvc(Model,View);
    }

    @property({
        tooltip : '局数设置下拉按钮',
        type : cc.Node
    })
    roundcountSet: cc.Node = null;

    @property({
        tooltip : '人数设置下拉按钮',
        type : cc.Node
    })
    peopleSet: cc.Node = null;

    @property({
    	tooltip : '支付设置下拉按钮',
    	type : cc.Node
    })
    payTypeSet: cc.Node = null;

    @property({
    	tooltip : '计分方式设置',
    	type : cc.Node
    })
    youjinType: cc.Node = null;

    @property({
        tooltip : '玩法容器',
    	type : cc.Node
    })
    playMethod: cc.Node = null;
    
    @property({
        tooltip : '支付方式显示',
        type : cc.Label
    })
    payTypeLabel: cc.Label = null;

    @property({
        tooltip : '支付金额',
        type : cc.Label
    })
    payCount: cc.Label = null;

    //定义网络事件
	defineNetEvents () {}
	//定义全局事件
	defineGlobalEvents () {
		//定义全局事件
	}    

	//绑定操作的回调
    connectUi () {
        //点击单选
        let groups = [];
        groups.push(this.view.ui.roundcountSet);
        groups.push(this.view.ui.peopleSet);
        groups.push(this.view.ui.payTypeSet);
        groups.push(this.view.ui.youjinType);
        this.toggleConnect(groups, this.toggleCB.bind(this))
        for(let i =0; i < this.ui.ruleBtnList.length; ++i){
			this.connect(G_UiType.toggle, this.ui.ruleBtnList[i], () => {this.checkToggleCB(i);}, "切换选择玩法");
		}
    }
    //切换单选按钮
    toggleConnect(groups, callback){
        for(let i = 0; i<groups.length; i++){
            if(groups[i].getChildByName('ToggleContainer')){
                let groupChildren = groups[i].getChildByName('ToggleContainer').children;
                for (let j = 0; j < groupChildren.length; j++) {
                    let cb = function () { callback(i, j) }
                    this.connect(G_UiType.toggle, groupChildren[j], cb, '切换单选按钮');
                }
            }
        }
    }
    //page one 单选
    toggleCB(groupIndex, childIndex){
        let name = ROOM_CONFIGS_NAME[groupIndex]
        let value = this.model.roomcfg[name][childIndex]
        CreateRoomMgr.getInstance().setProperty(value, 'roomRuleInfo', this.model.gameid, name)
        //console.log(`${name}`, this.model.roomRuleInfo[name])
        //console.log('开房数据',this.model.roomRuleInfo)
        this.view.updatePayLabel(this.model.roomRuleInfo.v_paytype);
        this.refFangfei();
    }
    //点击切换玩法
    checkToggleCB (index) {
		let toggleName;
		switch(index){
			case 0: toggleName = 'b_qinghunyise'; break;
			case 1: toggleName = 'b_daihuapai'; break;
			case 2: toggleName = 'b_jinlong'; break;
		}
		if(this.ui.ruleBtnList[index].getComponent(cc.Toggle).isChecked){
			CreateRoomMgr.getInstance().setProperty(1, "roomRuleInfo", this.model.gameid, toggleName);
		}else{
			CreateRoomMgr.getInstance().setProperty(0, "roomRuleInfo", this.model.gameid, toggleName);
		}
		//console.log(this.model.roomRuleInfo);
	}

    refFangfei(){
        this.view.refreshFangfei();
    }
    // update (dt) {},
}
