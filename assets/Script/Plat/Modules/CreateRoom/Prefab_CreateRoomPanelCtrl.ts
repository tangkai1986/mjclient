import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import RoomMgr from "../../GameMgrs/RoomMgr";

import LoginMgr from "../../GameMgrs/LoginMgr";
import Prefab_DefaultRuleItemCtrl from "./Prefab_DefaultRuleItemCtrl";
import RoomRuleMoreSuggestionCtrl from "./RoomRuleMoreSuggestionCtrl";
import CreateRoomMgr from "../../GameMgrs/CreateRoomMgr";
import BetMgr from "../../GameMgrs/BetMgr";
import GameCateCfg from "../../CfgMgrs/GameCateCfg";
import JbcCfg from "../../CfgMgrs/JbcCfg";
import VerifyMgr from "../../GameMgrs/VerifyMgr";
import LocalStorage from "../../Libs/LocalStorage";
import LoaderMgr from "../../../AppStart/AppMgrs/LoaderMgr";
import GameFreeMgr from "../../GameMgrs/GameFreeMgr";
import SubGameMgr from "../../GameMgrs/SubGameMgr";

const {ccclass, property} = cc._decorator;
let ctrl : Prefab_CreateRoomPanelCtrl;
const CONFIGS = {
    gameInfoUrl:"SubLayer/Plat/CreateRoom/GameCreateInfo/CreateRoom_",//每一个游戏创建房间的预制体路径
}
class Model extends BaseModel{
    curGameItem=null;
    games=null;
    gameid=null;
    nowDate = null;
    gamecode=null;
	bUpdated=null;
	constructor()
	{
        super();
        this.games = GameCateCfg.getInstance().getGames();
        this.gameid = BetMgr.getInstance().getGameId();
        let index = GameCateCfg.getInstance().getGameIndex(this.gameid);
        this.nowDate = GameFreeMgr.getInstance().getNowDate();
        this.updateGameSel(index)
    }
    updateSubGameState(){ 
        this.bUpdated=SubGameMgr.getInstance().gameIsUpdated(this.gamecode);
    }
    updateGameSel(index)
    {

        let item=this.games[index];
        if(!item)
        {
            return false;
        }
        this.curGameItem=this.games[index];
        this.gameid = this.curGameItem.id;
        this.gamecode=this.curGameItem.code;//游戏code
        this.bUpdated=SubGameMgr.getInstance().gameIsUpdated(this.gamecode);
        return true;
    }
}

class View extends BaseView{
    constructor(model){
        super(model);
		this.node=ctrl.node;
		this.addGrayLayer();
        this.initUi();
        //this.initQzmjPanel();
        this.initPage();
    }
    ui = {
    	btnClose: ctrl.ClosePanel,
    	btnDefaultRule: ctrl.DefaultRule,
    	btnCreateRoom: ctrl.CreateRoom,
    	nodeSubGameContent: ctrl.SubGameContent,
    	nodeToggleContainer: ctrl.ToggleContainer,
		// toggleQzmj: ctrl.Qzmj,
		// toggleNN: ctrl.NN,
    	nodePanelContent: ctrl.PanelContent,
		prefabsubGameItem: ctrl.subGameItem,
        btnGameItems: [],
        gameFreeTip:ctrl.gameFreeTip,
        Prefab_downloadsubgame:ctrl.Prefab_downloadsubgame,
        node_downloadsubgame:null,//下载子游戏的界面 
        node_roomsetting:ctrl.node_roomsetting,//房间设置节点 
	}
	
    public initUi(){
        for(let i=0;i<this.model.games.length;++i)
        {
            let item=this.model.games[i];
            let prefabNode = cc.instantiate(this.ui.prefabsubGameItem);
            prefabNode.name = item.code;
            prefabNode.active = true;
            switch(item.id){
                case 13:item.name = "大菠萝";break;
                case 19:item.name = "明牌拼十";break;
                case 20:item.name = "欢乐拼十";break;
            }
            prefabNode.getChildByName('freeMark').active = GameFreeMgr.getInstance().isFree(item.id);
            prefabNode.getChildByName('Background').getChildByName('New Label').getComponent(cc.Label).string = item.name;
            let path = 'Plat/creatRoom/title_'+item.code;
            //加载选中后的图片
            cc.loader.loadRes(path, cc.SpriteFrame, (err, assets)=>{
                if(err){
                    cc.error(err)
                }else{
                    if(cc.isValid(prefabNode) && prefabNode) {
                        prefabNode.getChildByName('checkmark').getChildByName('gameName').getComponent(cc.Sprite).spriteFrame = assets;
                    }
                }
            })
            this.ui.nodeToggleContainer.addChild(prefabNode);
            this.ui.btnGameItems.push(prefabNode);
        }
        let node =this.ui.btnDefaultRule.getChildByName('Label')
        let label = node.getComponent(cc.Label);
        label.string = '无'//'commonRule[0].ruleName'
        //下载子游戏的节点
        this.ui.node_downloadsubgame=cc.instantiate(this.ui.Prefab_downloadsubgame); 
        this.node.addChild(this.ui.node_downloadsubgame); 
    }
    //记忆上次玩的游戏
    initPage(){
        this.ui.nodePanelContent.destroyAllChildren();
        if(!this.model.gameid){
            this.model.gameid = 1;
        }
        let gameName = this.getGameCodeName(this.model.gameid);
        for(let i = 0;i<this.ui.btnGameItems.length;i++){
            if(this.ui.btnGameItems[i].name == gameName){
                this.ui.btnGameItems[i].getComponent(cc.Toggle).check();
            }
        }
        BetMgr.getInstance().setGameId(this.model.gameid);
        this.updataPanel(this.model.gameid)
        this.costFreeTip(this.model.gameid)
        this.updateSubGameState();//更新子游戏状态，判断是否已经下载
    }
    updateSubGameState()
    {
        //判断游戏是安装或更新完毕 
        this.ui.node_downloadsubgame.active=!this.model.bUpdated;
        this.ui.node_roomsetting.active=this.model.bUpdated;
    }
    updataPanel(gameid){
        if(!this.model.bUpdated)
        {
            return;
        } 
        ctrl.isLoad = true;
        LoaderMgr.getInstance().loadRes(CONFIGS.gameInfoUrl+this.getGameCodeName(gameid), (prefab)=>{
            ctrl.isLoad = false;
            if(prefab){
                let curNode:cc.Node = cc.instantiate(prefab); 
                curNode.parent = this.ui.nodePanelContent;
            }
        })
    }

    costFreeTip(gameid){
        let list = [];
        let isFree = GameFreeMgr.getInstance().isFree(gameid);
        this.ui.gameFreeTip.active = isFree;
        if(!isFree) return
        list = GameFreeMgr.getInstance().getFreeDetial(gameid)
        for(let i=0;i<list.length;i++){
            if(list[i].start < this.model.nowDate && list[i].end > this.model.nowDate){
                let startTime = GameFreeMgr.getInstance().formatDate(list[i].start)
                let endTime = GameFreeMgr.getInstance().formatDate(list[i].end)
                let timeText = `（限免时间${startTime}-${endTime}）`
                this.ui.gameFreeTip.getChildByName('time').getComponent(cc.Label).string =timeText;
                return
            }
        }
    }

    private getGameCodeName (gameid){
        for(let i = 0; i < this.model.games.length; i ++){
            if(this.model.games[i].id == gameid){
                return this.model.games[i].code;
            }
        }
        return "";
    }
}

@ccclass
export default class Prefab_CreateRoomPanelCtrl extends BaseCtrl {
    isLoad:Boolean
    @property({
    	tooltip : '关闭创建房间',
    	type : cc.Node
    })
    ClosePanel: cc.Node = null;

    @property({
    	tooltip : '默认规则',
    	type : cc.Node
    })
    DefaultRule : cc.Node = null;

    @property({
    	tooltip : '创建按钮',
    	type : cc.Node
    })
    CreateRoom : cc.Node = null;

    @property({
    	tooltip : '左侧子游戏按钮容器',
    	type : cc.Node
    })
    SubGameContent : cc.Node = null;

    @property({
    	tooltip : 'toggle组件父节点',
    	type : cc.Node
    })
    ToggleContainer : cc.Node = null;
	
    @property({
    	tooltip : '界面容器',
    	type : cc.Node
    })
    PanelContent: cc.Node = null;
    @property({
        tooltip : '子游戏按钮预置',
        type : cc.Node
    })
    subGameItem : cc.Node = null;

    @property({
        tooltip : '限免提示',
        type : cc.Node
    })
    gameFreeTip : cc.Node = null;
 
    
    @property({
        tooltip : '房间设置',
        type : cc.Node
    })
    node_roomsetting : cc.Node = null;
    
    private loadSubGameCtl=null;

    @property(cc.Prefab)
    Prefab_downloadsubgame:cc.Prefab = null; 
    onLoad () {
    	//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
        this.initMvc(Model,View);
        this.isLoad = false;
        
        this.loadSubGameCtl = this.ui.node_downloadsubgame.getComponent('DownLoadSubGameCtrl');
        this.loadSubGameCtl.registerCompleteCb(this.subGameDownLoadCompleted.bind(this))
        this.loadSubGameCtl.updateGameId(this.model.gameid);
    } 
    onDestroy(){
        this.loadSubGameCtl.unRegisterCompleteCb();
        super.onDestroy();
    }
    //子游戏下载完成
    subGameDownLoadCompleted(){
        if(this.model.bUpdated)
        {
            return;
        }
        this.model.updateSubGameState();
        this.view.updateSubGameState();//更新子游戏状态，判断是否已经下载 
        this.view.updataPanel(this.model.gameid)
    }
    //定义网络事件
	defineNetEvents () {}
	//定义全局事件
	defineGlobalEvents () {

        this.g_events = {
            'RefreshDefaultRuleLabel':this.RefreshDefaultRuleLabel,
        } 
    }
	//绑定操作的回调
    connectUi () {
        this.connect(G_UiType.button, this.view.ui.btnClose, this.click_Close, '关闭界面');
        this.connect(G_UiType.button, this.view.ui.btnCreateRoom, this.createRoomCB, '点击创建房间');
        this.connect(G_UiType.button, this.view.ui.btnDefaultRule, this.defaultRuleCB, '点击默认规则');
        for(let i=0;i<this.ui.btnGameItems.length;++i)
        {
            let btn=this.ui.btnGameItems[i];
            let cb=function()
            {
                this.clickSubGameCB(i);
            }
            this.connect(G_UiType.button, btn, cb, "游戏页签"); 
        }
	}

    start () {

    } 

    
	click_Close(event){
        if(this.isLoad) return;
		this.finish();
	}

	createRoomCB(event){
        if(this.isLoad) return;
        //console.log("付费第三款")
        if (CreateRoomMgr.getInstance().getbCommomRule()) {
            //把房间配置信息赋值给默认规则
            let gameId = BetMgr.getInstance().getGameId()
            let Groups = CreateRoomMgr.getInstance().getCommonRuleGroups(gameId)
            let commonRule = CreateRoomMgr.getInstance().getCommonRule(gameId)          //这句得到的是本地默认规则
            cc.log(commonRule);
            let qzmjRoomRuleInfo = CreateRoomMgr.getInstance().getRoomRuleInfo(gameId);
            let index = CreateRoomMgr.getInstance().getEditItemIndex();
            for (let key in qzmjRoomRuleInfo) {                                           //这样子不会指向地址
                //console.log(qzmjRoomRuleInfo[key])
                commonRule[index].ruleInfo[key] = qzmjRoomRuleInfo[key]
            }
            //刷新房间界面
            CreateRoomMgr.getInstance().RefreshRoomUi(gameId);
            CreateRoomMgr.getInstance().setbCommomRule(false);
            //修改需要修改的数据
            Groups[LoginMgr.getInstance().getUid().toString()] = commonRule
            //console.log('需要存入本地默认规则的数据', Groups, commonRule)
            let games = GameCateCfg.getInstance().getGames()
            let gameCode = games[gameId - 1].code
            // let localStorageItemName = gameCode + 'CommonRuleGroups'
            //存入localStorage
            // cc.sys.localStorage.setItem(localStorageItemName, JSON.stringify(Groups));
            LocalStorage.getInstance().setCommonRuleGroups(gameCode, Groups);
        }
        RoomMgr.getInstance().reqCreateFangKaVerify()
        
	}

	defaultRuleCB(event){
		//console.log('点击默认规则')
		this.start_sub_module(G_MODULE.DefaultRule);
	}

	clickSubGameCB(index){ 
        if(this.isLoad) return;
        let ret=this.model.updateGameSel(index);
        if(!ret){
            return
        }
		if(this.view.ui.nodePanelContent.children){
			this.view.ui.nodePanelContent.destroyAllChildren();
        }
        BetMgr.getInstance().setGameId(this.model.gameid);
        this.view.updataPanel(this.model.gameid);
        this.view.costFreeTip(this.model.gameid)
        this.view.updateSubGameState();//更新子游戏状态，判断是否已经下载
        //下载游戏的控制器设置游戏code
        this.loadSubGameCtl.updateGameId(this.model.gameid);
	}
    RefreshDefaultRuleLabel(){
        let node =this.DefaultRule.getChildByName('Label')
        let label = node.getComponent(cc.Label);
        label.string = CreateRoomMgr.getInstance().getDefaultRuleName();
    }
    // update (dt) {},
}
