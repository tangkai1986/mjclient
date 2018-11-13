import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import CreateRoomMgr from "../../GameMgrs/CreateRoomMgr";
import BetMgr from "../../GameMgrs/BetMgr";
import RoomCostCfg from "../../CfgMgrs/RoomCostCfg";

const {ccclass, property} = cc._decorator;
const ROOM_CONFIGS_NAME = ['v_youjintype','v_specialrule']
const ROOM_CONFIGS_NAME2 = ['v_chasui','v_fanhu']
let ctrl : Prefab_CreateQgmj;

class Model extends BaseModel{
	roomRuleInfo : any = {}
    jinLimitInfo  = []
    payTypeInfo = []
    payType = []
	gameid : any = {}
    roomcfg : any = []
    chasui=null;
    fanhu=null;
	constructor()
	{
		super();
		BetMgr.getInstance().setGameId(2);
        this.gameid = BetMgr.getInstance().getGameId();
        //console.log('gameId', this.gameid)
        this.roomRuleInfo = CreateRoomMgr.getInstance().getRoomRuleInfo(this.gameid)
        this.roomcfg={
        	v_roundcount:[1,2,3],
        	v_paytype:[0,1,2],
        	v_youjintype:[0,1],
            b_hupai:[0,1,2],
            v_chasui:[0,1],
            v_fanhu:[0,1],
            b_jinxianzhi:[0,1,2,3]
        }
        this.chasui =this.roomRuleInfo.v_chasui;
        this.fanhu = this.roomRuleInfo.v_fanhu;
        this.jinLimitInfo = ['有金可平胡，双金可平胡', '有金可平胡，双金至少自摸', '有金至少自摸，双金至少游金', '有金至少游金']
        this.payType = [0,1,2]
        this.payTypeInfo = ['房主支付房费','AA支付房费','赢家支付房费']
	}
}

class View extends BaseView{
    constructor(model){
        super(model);
		this.node=ctrl.node;
        this.initUi();
    }
    ui = {
        roundSet:ctrl.roundSet,
        payTypeSet:ctrl.payTypeSet,
        jinLimitSet:ctrl.jinLimitSet,
        roundSetMenu:ctrl.roundSetMenu,
        payTypeSetMenu:ctrl.payTypeSetMenu,
        jinLimitSetMenu:ctrl.jinLimitSetMenu,
        youjinType:ctrl.youjinType,
        specialRule:ctrl.specialRule,
        payCount:ctrl.payCount,
        payTypeLabel:ctrl.payTypeLabel,
    }
    public initUi(){
        this.initPage(this.model.roomRuleInfo);
    }

    refreshFangfei() {
        let roomInfo = this.model.roomRuleInfo;
        let roomCost = RoomCostCfg.getInstance().getRoomCost('qgmj', roomInfo.b_yike, roomInfo.v_roundcount, roomInfo.v_seatcount, roomInfo.v_paytype);
        CreateRoomMgr.getInstance().setProperty(roomCost, 'roomRuleInfo', this.model.gameid, 'v_fangfei');
        this.ui.payCount.string = "×" + roomCost;
    }

    arrIndex(value,arr){
        for(let i = 0 ;i<arr.length;i++){
            if(arr[i] == value){
                return i.toString();
            }
        }
    }

    initCheck(roomRuleInfo){
        let groups = [];   
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
    		if (data[i]==value) {
    			groupChildren[i].getComponent(cc.Toggle).check()
    		}
    	}
    }

    initSpecial(roomRuleInfo){
        let group = this.ui.specialRule.getChildByName('ToggleContainer').children;
        for(let i = 0;i<group.length;i++){
            let value = ROOM_CONFIGS_NAME2[i];
            if(roomRuleInfo[value]){
                group[i].getComponent(cc.Toggle).check();
            }
        }
        
    }

    toggleCheck(){
        let roundIndex = this.model.roomRuleInfo.v_roundcount.toString();
        let round = this.arrIndex(roundIndex,this.model.roomcfg.v_roundcount)
        let pay = this.model.roomRuleInfo.v_paytype.toString();
        let jin = this.model.roomRuleInfo.b_jinxianzhi.toString();
        this.ui.roundSet.getChildByName('menu').getChildByName('dropMenu').getChildByName(round).getComponent(cc.Toggle).check();
        this.ui.jinLimitSet.getChildByName('menu').getChildByName('dropMenu').getChildByName(jin).getComponent(cc.Toggle).check();
        this.ui.payTypeSet.getChildByName('menu').getChildByName('dropMenu').getChildByName(pay).getComponent(cc.Toggle).check();
    }

    updatePayLabel(value){
        switch(value){
            case 0:this.ui.payTypeLabel.string = '首局结算时房主支付';break;
            case 1:this.ui.payTypeLabel.string = '首局结算时所有玩家各支付';break;
            case 2:this.ui.payTypeLabel.string = '总结算时赢家按比例共支付';break;
        }
    }

    initPage(roomRuleInfo){
        this.ui.roundSet.getComponentInChildren(cc.Label).string = roomRuleInfo.v_roundcount ? '局数:' + roomRuleInfo.v_roundcount + '局':'一课' ;
        this.ui.payTypeSet.getComponentInChildren(cc.Label).string = this.model.payTypeInfo[roomRuleInfo.v_paytype];
        this.ui.jinLimitSet.getComponentInChildren(cc.Label).string = this.model.jinLimitInfo[roomRuleInfo.b_jinxianzhi]
        this.updatePayLabel(roomRuleInfo.v_paytype)
        this.initCheck(roomRuleInfo);
        this.toggleCheck();
        this.initSpecial(roomRuleInfo)
        // this.refreshFangfei()
    }
}

@ccclass
export default class Prefab_CreateQgmj extends BaseCtrl {

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
    roundSet: cc.Node = null;

    @property({
    	tooltip : '支付设置下拉按钮',
    	type : cc.Node
    })
    payTypeSet: cc.Node = null;

    @property({
    	tooltip : '金牌限制下拉按钮',
    	type : cc.Node
    })
    jinLimitSet: cc.Node = null;

    @property({
    	tooltip : '局数设置下拉菜单',
    	type : cc.Node
    })
    roundSetMenu: cc.Node = null;

    @property({
    	tooltip : '支付设置下拉菜单',
    	type : cc.Node
    })
    payTypeSetMenu: cc.Node = null;

    @property({
    	tooltip : '金牌限制下拉菜单',
    	type : cc.Node
    })
    jinLimitSetMenu: cc.Node = null;

    @property({
    	tooltip : '游金方式设置',
    	type : cc.Node
    })
    youjinType: cc.Node = null;

    @property({
    	tooltip : '特殊规则',
    	type : cc.Node
    })
    specialRule: cc.Node = null;
    

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
		this.g_events = {
            
        } 
	}


	//绑定操作的回调
    connectUi () {
        let Btn = [this.view.ui.roundSet, this.view.ui.payTypeSet, this.view.ui.jinLimitSet,]
        for(let i = 0;i<Btn.length;i++){
            this.connect(G_UiType.text, Btn[i], this.buttonCB, '下拉菜单按钮');
        }
        let youjinTypeItem = this.youjinType.getChildByName('ToggleContainer').children;
        for(let i = 0; i < youjinTypeItem.length; i++){
            this.connect(G_UiType.toggle, youjinTypeItem[i], this.toggleCB, '切换游金方式选项');
        }
        let specialItems = this.specialRule.getChildByName('ToggleContainer').children;
        for(let i = 0; i < specialItems.length; i++){
            this.connect(G_UiType.toggle, specialItems[i], this.toggleCB, '切换特殊玩法选项');
        }
        let roundItems = this.roundSetMenu.getChildByName('dropMenu').children;
        for(let i = 0; i < roundItems.length; i++){
            this.connect(G_UiType.button, roundItems[i], this.roundMenuCB, '切换局数选择选项');
        }
        let payItems = this.payTypeSetMenu.getChildByName('dropMenu').children;
        for(let i = 0; i < payItems.length; i++){
            this.connect(G_UiType.button, payItems[i], this.dropMenuCB, '切换支付选择选项');
        }
        let jinLimitItems = this.jinLimitSetMenu.getChildByName('dropMenu').children;
        for(let i = 0; i < jinLimitItems.length; i++){
            this.connect(G_UiType.button, jinLimitItems[i], this.dropMenuCB, '切换金牌限制选择选项');
        }
        this.node.on(cc.Node.EventType.TOUCH_START, this.closeDropMenu, this);
	}

    start () {
        
    }

    closeDropMenu(){
        this.view.ui.roundSetMenu.active = false;
        this.view.ui.payTypeSetMenu.active = false;
        this.view.ui.jinLimitSetMenu.active = false;
    }

    buttonCB(event){
        switch(event.name){
            case "v_roundcount": this.closeMenu(this.view.ui.roundSetMenu); break;
            case "v_paytype": this.closeMenu(this.view.ui.payTypeSetMenu); break;
            case "b_jinxianzhi": this.closeMenu(this.view.ui.jinLimitSetMenu); break;
        }
        this.view.toggleCheck()
    }
    closeMenu(node){
        if(node.active){
            this.closeDropMenu();
        }else{
            this.closeDropMenu();
            node.active = true;
        }
    }
    //局数选择按钮
    roundMenuCB(event){
        let index = Number(event.currentTarget.name);
        this.view.ui.roundSet.getComponentInChildren(cc.Label).string = '圈数:' + this.model.roomcfg.v_roundcount[index] + '圈' ;
        this.model.roomRuleInfo.v_roundcount = this.model.roomcfg.v_roundcount[index];
        CreateRoomMgr.getInstance().setProperty(this.model.roomcfg.v_roundcount[index], 'roomRuleInfo', this.model.gameid, 'v_roundcount');
        //console.log(this.model.roomRuleInfo.v_roundcount);
        //console.log('开房数据',this.model.roomRuleInfo);
        //this.refFangfei();
        this.closeDropMenu();
    }
    //其他下拉菜单按钮
    dropMenuCB(event){
        let value = event.currentTarget.parent.parent.parent.name;
        let index = Number(event.currentTarget.name);
        let info, lab;
        switch (value) {
            case "v_paytype": info = this.model.payTypeInfo; lab = this.view.ui.payTypeSet.getComponentInChildren(cc.Label);this.view.updatePayLabel(index);break;
            case "b_jinxianzhi": info = this.model.jinLimitInfo;lab = this.view.ui.jinLimitSet.getComponentInChildren(cc.Label);break;
        }
        this.model.roomRuleInfo[value] = this.model.roomcfg[value][index];
        CreateRoomMgr.getInstance().setProperty(this.model.roomRuleInfo[value], 'roomRuleInfo', this.model.gameid, value);
        lab.string =info[index];
        //console.log('开房数据',this.model.roomRuleInfo);
        //this.refFangfei();
        this.closeDropMenu();
    }

    //page one 单选
    toggleCB(event, childIndex){
        this.closeDropMenu()
        let name = event.currentTarget.parent.parent.name;
        let index = event.currentTarget.name;
        if(name == 'v_specialrule'){
            switch(index){
                case "v_chasui":this.setCharsui();break;
                case "v_fanhu":this.setFanhu();break;
            }
            return
        }
        let value = this.model.roomcfg[name][index];
        CreateRoomMgr.getInstance().setProperty(value, 'roomRuleInfo', this.model.gameid, name);
        //console.log(`${name}`, this.model.roomRuleInfo[name]);
        //console.log('开房数据',this.model.roomRuleInfo);
    }
    setCharsui(){
        let value = this.model.chasui?0:1;
        this.model.chasui = value;
        CreateRoomMgr.getInstance().setProperty(value, 'roomRuleInfo', this.model.gameid, 'v_chasui');
        //console.log('开房数据',this.model.roomRuleInfo);
    }
    setFanhu(){
        let value = this.model.fanhu?0:1;
        this.model.fanhu = value;
        CreateRoomMgr.getInstance().setProperty(value, 'roomRuleInfo', this.model.gameid, 'v_fanhu');
        //console.log('开房数据',this.model.roomRuleInfo);
    }

    refFangfei(){
        this.view.refreshFangfei();
    }
    
    // update (dt) {},
}
