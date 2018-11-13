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
import LoginMgr from "../../GameMgrs/LoginMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_downLoadGamePanelCtrl;
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
        this.roomRule = RoomMgr.getInstance().getFangKaCfg() 
		this.gameId = RoomMgr.getInstance().getEnterFangKaGameId() 
		let game=GameCateCfg.getInstance().getGameById(this.gameId);
		this.gamecode=game.code;
		
        this.bUpdated=SubGameMgr.getInstance().gameIsUpdated(this.gamecode);
	} 

    updateSubGameState(){ 
        this.bUpdated=SubGameMgr.getInstance().gameIsUpdated(this.gamecode);
    }	 
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui 
		btn_enter:null, 
		fanfeiText:null,
        Prefab_downloadsubgame:ctrl.Prefab_downloadsubgame,
		node_downloadsubgame:null,//下载子游戏的界面  
		btn_close:ctrl.btn_close,
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.addGrayLayer();
		this.initUi();  
	}
	//初始化ui
	initUi()
	{ 
        //下载子游戏的节点
        this.ui.node_downloadsubgame=cc.instantiate(this.ui.Prefab_downloadsubgame); 
		this.node.addChild(this.ui.node_downloadsubgame);  
		//判断游戏是安装或更新完毕
		this.updateSubGameState();
	} 

    updateSubGameState()
    {
        //判断游戏是安装或更新完毕 
        this.ui.node_downloadsubgame.active=!this.model.bUpdated;  
    } 
 
}
//c, 控制
@ccclass
export default class Prefab_downLoadGamePanelCtrl extends BaseControl { 
  
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离
 
    private notifyCb=null
    private loadSubGameCtl=null;

    @property(cc.Prefab)
    Prefab_downloadsubgame:cc.Prefab = null; 

    @property(cc.Node)
    btn_close:cc.Node = null; 
	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;

        this.initMvc(Model,View); 
        this.loadSubGameCtl = this.ui.node_downloadsubgame.getComponent('DownLoadSubGameCtrl');
        this.loadSubGameCtl.registerCompleteCb(this.subGameDownLoadCompleted.bind(this))
        this.loadSubGameCtl.updateGameId(this.model.gameId);

	}
	regCompleteCb(cb)
	{
		this.notifyCb=cb;
	}
    onDestroy(){
        this.loadSubGameCtl.unRegisterCompleteCb();
        super.onDestroy();
    }	
    //子游戏下载完成
    subGameDownLoadCompleted(){
        this.model.updateSubGameState();
		this.view.updateSubGameState();//更新子游戏状态，判断是否已经下载
		//已经下载完了,就自动进游戏服
		if(this.model.bUpdated)
		{ 
			if(this.notifyCb)
			{
				this.notifyCb();
			}
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
		this.connect(G_UiType.image, this.ui.btn_close, this.finish, `关闭下载页面`);
	}
	start () {
	}
 

	//网络事件回调begin
	//end
	//全局事件回调begin
 
	//end 
 
}
