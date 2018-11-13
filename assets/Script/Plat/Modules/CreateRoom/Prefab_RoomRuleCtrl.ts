import BaseControl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UiMgr from "../../GameMgrs/UiMgr";
import ModuleMgr from "../../GameMgrs/ModuleMgr";
import RoomMgr from "../../GameMgrs/RoomMgr";
import RoomOptionCfg from "../../CfgMgrs/RoomOptionCfg";
import GameFreeMgr from "../../GameMgrs/GameFreeMgr";
import GameCateCfg from "../../CfgMgrs/GameCateCfg";
import SubGameMgr from "../../GameMgrs/SubGameMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_RoomRuleCtrl;
//模型，数据处理
class Model extends BaseModel{
	roomId=null;
    roomRule = null;
    gameId=null;
	gamecode=null;
	bUpdated=null;
	constructor()
	{
		super();
		this.updateRule()
	}
	updateRule(){
        this.roomRule = RoomMgr.getInstance().getFangKaCfg()
        this.roomId = RoomMgr.getInstance().getFangKaPassword()
		this.gameId = RoomMgr.getInstance().getEnterFangKaGameId()
		let game=GameCateCfg.getInstance().getGameById(this.gameId);
		this.gamecode=game.code;
		
        this.bUpdated=SubGameMgr.getInstance().gameIsUpdated(this.gamecode);
	}

    updateSubGameState(){ 
        this.bUpdated=SubGameMgr.getInstance().gameIsUpdated(this.gamecode);
    }	
	getRoomId(){
		return this.roomId;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		btn_close:null,
		btn_enter:null,
		ruleContent : ctrl.ruleContent,
        scrollBar : ctrl.scrollBar,
		labelItem : ctrl.labelItem,
		fanfeiText:null,
        Prefab_downloadsubgame:ctrl.Prefab_downloadsubgame,
        node_downloadsubgame:null,//下载子游戏的界面 
        node_roomsetting:ctrl.node_roomsetting,//房间设置节点 
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi(); 
		this.showRule();
	}
	//初始化ui
	initUi()
	{
		this.ui.btn_close=ctrl.btn_close;
		this.ui.btn_close.active = false;
		this.ui.btn_enter=ctrl.btn_enter; 
		this.ui.fanfeiText=ctrl.fanfeiText;
        //下载子游戏的节点
        this.ui.node_downloadsubgame=cc.instantiate(this.ui.Prefab_downloadsubgame); 
		this.node.addChild(this.ui.node_downloadsubgame);  
		//判断游戏是安装或更新完毕
		this.updateSubGameState();
	}
	showRule(){
        let arrContent = RoomOptionCfg.getInstance().getContentTransToString(this.model.gameId, this.model.roomRule)
		let arrTitle = RoomOptionCfg.getInstance().getTitleTransToString(this.model.gameId, this.model.roomRule)
		let fangfei = RoomOptionCfg.getInstance().getFanfei(this.model.gameId, this.model.roomRule)
		for (let i = 0; i < arrContent.length; i++) {
			let item = cc.instantiate(this.ui.labelItem)
			item.parent = this.ui.ruleContent
			item.getChildByName('labelTitle').getComponent(cc.Label).string = arrTitle[i]
			item.getChildByName('labelContent').getComponent(cc.Label).string = arrContent[i]
		}
		let isFree = GameFreeMgr.getInstance().isFree(this.model.gameId)
		if(isFree){
			this.ui.fanfeiText.string = '限时免费无需支付房费!'
			this.ui.fanfeiText.node.color = new cc.Color(255,0,0);
		}else{
			this.ui.fanfeiText.string = fangfei;
		}
	}

    updateSubGameState()
    {
        //判断游戏是安装或更新完毕 
        this.ui.node_downloadsubgame.active=!this.model.bUpdated;
		this.ui.node_roomsetting.active=this.model.bUpdated;
    }
	OpenAddGrayLayer() {
		this.addGrayLayer();
	}

	openCloseBtn(){
		this.ui.btn_close.active = true;
	}
}
//c, 控制
@ccclass
export default class Prefab_RoomRuleCtrl extends BaseControl {
	//这边去声明ui组件
	@property({
		tooltip : "关闭",
		type : cc.Node
	})
	btn_close : cc.Node = null;

	@property({
		tooltip : "进入",
		type : cc.Node
	})
	btn_enter:cc.Node = null; 

	@property({
        tooltip : '支付方式与房费',
        type : cc.Label
    })
	fanfeiText : cc.Label = null;
	
    @property({
        tooltip : '房间规则描述content',
        type : cc.Node
    })
    ruleContent : cc.Node = null;

    @property({
        tooltip : 'scroll bar',
        type : cc.Node
    })
    scrollBar : cc.Node = null;

    @property({
        tooltip : 'labelItem',
        type : cc.Prefab
    })
    labelItem : cc.Prefab = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离
    
    @property({
        tooltip : '房间设置',
        type : cc.Node
    })
    node_roomsetting : cc.Node = null;
    
    private loadSubGameCtl=null;

    @property(cc.Prefab)
    Prefab_downloadsubgame:cc.Prefab = null; 

	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;

        this.initMvc(Model,View); 
        this.loadSubGameCtl = this.ui.node_downloadsubgame.getComponent('DownLoadSubGameCtrl');
        this.loadSubGameCtl.registerCompleteCb(this.subGameDownLoadCompleted.bind(this))
        this.loadSubGameCtl.updateGameId(this.model.gameId);

	}
    onDestroy(){
        this.loadSubGameCtl.unRegisterCompleteCb();
        super.onDestroy();
    }	
    //子游戏下载完成
    subGameDownLoadCompleted(){
        this.model.updateSubGameState();
		this.view.updateSubGameState();//更新子游戏状态，判断是否已经下载
		
		if(this.model.bUpdated)
		{ 
			let roomId = this.model.getRoomId(); 
			RoomMgr.getInstance().reqFangKaCfg(roomId);
		}
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
		this.connect(G_UiType.image, this.ui.btn_enter, this.btn_enter_cb, "进入"); 
	}
	start () {
	}

	OpenAddGrayLayer(){
		this.view.OpenAddGrayLayer();
	}

	//网络事件回调begin
	//end
	//全局事件回调begin
	openCloseBtn(){
		this.view.openCloseBtn();
		this.connect(G_UiType.image, this.ui.btn_close, this.btn_close_cb, "关闭按钮");
	}

	//end
	//按钮或任何控件操作的回调begin
	private btn_close_cb ():void {
		let parentNode = this.node.parent
		//console.log('节点名称', parentNode.name)
		if(parentNode.name == 'Prefab_JoinRoom'){
			parentNode.getComponent('Prefab_JoinRoomCtrl').finish()
		}
		this.finish();
	}

	private btn_enter_cb(){ 
		//console.log("btn_enter_cb", this.model.getRoomId());
		let roomId = this.model.getRoomId();
		RoomMgr.getInstance().reqFangKaVerify(roomId);
	}
}
