import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import CreateRoomMgr from "../../GameMgrs/CreateRoomMgr";
import BetMgr from "../../GameMgrs/BetMgr";
import RoomCostCfg from "../../CfgMgrs/RoomCostCfg";
import GameFreeMgr from "../../GameMgrs/GameFreeMgr";
import RoomMgr from "../../GameMgrs/RoomMgr";

const {ccclass, property} = cc._decorator;
const ROOM_CONFIGS_NAME = ['v_roundcount','v_seatcount','v_paytype','b_jinxianzhi','t_youjin','v_difen','v_youjintype']
let ctrl : Prefab_CreateQzmj;
class Model extends BaseModel{
	roomRuleInfo : any = {}
	gameid : any = {}
    roomcfg : any = []
    isFree = null;//是否限时免费
	constructor()
	{
        super();
        this.isFree = GameFreeMgr.getInstance().isFree(1);
		BetMgr.getInstance().setGameId(1);
        this.gameid = BetMgr.getInstance().getGameId();
        //console.log('gameId', this.gameid)
        this.roomRuleInfo = CreateRoomMgr.getInstance().getRoomRuleInfo(this.gameid)
        this.roomcfg={
            b_yike:[0,1],
        	v_roundcount:[0,8,16],
        	v_seatcount:[2,3,4],
            v_paytype:[0,1],            
            b_jinxianzhi:[0,1],
            t_youjin:[3,4],
            v_difen:[5,8],
        	v_youjintype:[0,1],
            t_bazhanghua:[3,4]
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
        roundCount:ctrl.roundCount,
        setCount:ctrl.setCount,
        payMethod:ctrl.payMethod,
        playMethod:ctrl.playMethod,
        jinBeishu:ctrl.jinBeishu,
        difen:ctrl.difen,
        youjinType:ctrl.youjinType,
        payCount:ctrl.payCount,
        payTypeLabel:ctrl.payTypeLabel,        
    }
    //初始化ui
    public initUi(){
        this.initPage(this.model.roomRuleInfo);
    }
    //初始化页面
    initPage(roomRuleInfo){
        this.initCheck(roomRuleInfo);
        this.updatePayLabel(roomRuleInfo.v_paytype);
        this.ui.payCount.node.parent.active = !this.model.isFree;
        this.refreshFangfei();
    }    
    //初始化单选按钮
    initCheck(roomRuleInfo){
        let groups = [];
        groups.push(this.ui.roundCount);
        groups.push(this.ui.setCount);
        groups.push(this.ui.payMethod);
        groups.push(this.ui.playMethod);
        groups.push(this.ui.jinBeishu);
        groups.push(this.ui.difen);
        groups.push(this.ui.youjinType);
        for(let i = 0; i<groups.length; i++){
            let groupChildren = groups[i].getChildByName('ToggleContainer').children;
            for(let j = 0; j<groupChildren.length; j++) {
                this.initCheckState(groupChildren, ROOM_CONFIGS_NAME[i],roomRuleInfo)
            }
        }     
    }
    //初始化单选按钮状态    
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
                groupChildren[i].getComponent(cc.Toggle).check();
            } 
        }        
    }
    //改变支付Label
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
    //刷新房费
    refreshFangfei() {
        let roomInfo = this.model.roomRuleInfo;
        let roomCost = RoomCostCfg.getInstance().getRoomCost('qzmj', roomInfo.b_yike, roomInfo.v_roundcount, roomInfo.v_seatcount, roomInfo.v_paytype)
        if(this.model.isFree) roomCost = 0;
        CreateRoomMgr.getInstance().setProperty(roomCost, 'roomRuleInfo', this.model.gameid, 'v_fangfei');
        this.ui.payCount.string = roomCost;
    }
}

@ccclass
export default class Prefab_CreateQzmj extends BaseCtrl {
    @property({
    	tooltip : '局数设置',
    	type : cc.Node
    })
    roundCount: cc.Node = null;

    @property({
    	tooltip : '人数设置',
    	type : cc.Node
    })
    setCount: cc.Node = null;

    @property({
    	tooltip : '支付方式',
    	type : cc.Node
    })
    payMethod: cc.Node = null;

    @property({
    	tooltip : '玩法规则',
    	type : cc.Node
    })
    playMethod: cc.Node = null;

    @property({
    	tooltip : '游金倍数',
    	type : cc.Node
    })
    jinBeishu: cc.Node = null;

    @property({
    	tooltip : '底分设置',
    	type : cc.Node
    })
    difen: cc.Node = null;

    @property({
    	tooltip : '游金方式',
    	type : cc.Node
    })
    youjinType: cc.Node = null;
    
    @property({
        tooltip : '支付标签',
        type : cc.Label
    })
    payTypeLabel: cc.Label = null;

    @property({
        tooltip : '支付金额',
        type : cc.Label
    })
    payCount: cc.Label = null;

    onLoad () {
    	//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
        this.initMvc(Model,View);
        this.refFangfei();
    }
    //定义网络事件
	defineNetEvents () {}
	//定义全局事件
	defineGlobalEvents () {
		//定义全局事件
		this.g_events = {
            'RefreshQZMJRoomUi':this.RefreshQZMJRoomUi,
        } 
    }
    //点击切换选项
    toggleConnect(groups, callback){
        for(let i = 0; i<groups.length; i++){
            if(groups[i].getChildByName('ToggleContainer')){
                let groupChildren = groups[i].getChildByName('ToggleContainer').children;
                for (let j = 0; j < groupChildren.length; j++) {
                    let cb = function () { callback(i, j) }
                    this.connect(G_UiType.toggle, groupChildren[j], cb, '切换选项')
                }
            }
        }
    }
	//绑定操作的回调
    connectUi () {
        let groups = [];
        groups.push(this.view.ui.roundCount);
        groups.push(this.view.ui.setCount);
        groups.push(this.view.ui.payMethod);
        groups.push(this.view.ui.playMethod);
        groups.push(this.view.ui.jinBeishu);
        groups.push(this.view.ui.difen);
        groups.push(this.view.ui.youjinType);
        this.toggleConnect(groups, this.toggleCB.bind(this))
	}
    //page one 单选
    toggleCB(groupIndex, childIndex){
        let name = ROOM_CONFIGS_NAME[groupIndex];
        let value = this.model.roomcfg[name][childIndex];
        CreateRoomMgr.getInstance().setProperty(value, 'roomRuleInfo', this.model.gameid, name);
        if(name == 't_youjin'){
            CreateRoomMgr.getInstance().setProperty(value, 'roomRuleInfo', this.model.gameid, 't_bazhanghua');
        }
        if(name == 'v_roundcount'){
            if(this.model.roomRuleInfo.v_roundcount == 0){
                CreateRoomMgr.getInstance().setProperty(1, 'roomRuleInfo', this.model.gameid, 'b_yike');
            }else{
                CreateRoomMgr.getInstance().setProperty(0, 'roomRuleInfo', this.model.gameid, 'b_yike');
            }
        }
        //console.log(`${name}`, this.model.roomRuleInfo[name]);
        //console.log('开房数据',this.model.roomRuleInfo);
        let commonRule = CreateRoomMgr.getInstance().getCommonRule(this.model.gameid);
        cc.log(commonRule); 
        this.refFangfei();
    }
    //刷新房费
    refFangfei(){
        this.view.updatePayLabel(this.model.roomRuleInfo.v_paytype);
        this.view.refreshFangfei();
    }
    //刷新房间ui
	RefreshQZMJRoomUi(){
		let gameId = BetMgr.getInstance().getGameId()
		let commonRule = CreateRoomMgr.getInstance().getCommonRule(gameId)
        let index = CreateRoomMgr.getInstance().getEditItemIndex();
		if(commonRule[index].ruleInfo){     
            this.view.initPage(commonRule[index].ruleInfo);
		}
    }
    // update (dt) {},
}
