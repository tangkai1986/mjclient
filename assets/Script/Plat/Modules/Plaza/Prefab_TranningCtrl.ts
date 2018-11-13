/*
author: Justin
日期:2018-01-17 15:36:01
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel"; 
import BetMgr from "../../GameMgrs/BetMgr";
import VerifyMgr from "../../GameMgrs/VerifyMgr";
import RoomMgr from "../../GameMgrs/RoomMgr";
 
import ModuleMgr from "../../GameMgrs/ModuleMgr";
import GameCateCfg from "../../CfgMgrs/GameCateCfg";
import JbcCfg from "../../CfgMgrs/JbcCfg"; 
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_TranningCtrl;
//模型，数据处理
class Model extends BaseModel{
	curGameItem=null;
	curBetItem=null;
	games=null;
	bets=null;
	constructor()
	{
		super();
		this.games=GameCateCfg.getInstance().getGames();
		let gameid=BetMgr.getInstance().getGameId();
		let index=GameCateCfg.getInstance().getGameIndex(gameid);
		this.updateGameSel(index)
	}
	updateGameSel(index)
	{
		let item=this.games[index];
		if(!item)
		{
			return false;
		}
		this.curGameItem=this.games[index];
		this.bets=JbcCfg.getInstance().getCfgByGameCode(this.curGameItem.code); 
		return true;
	}
	updateBetSel(index)
	{ 
		this.curBetItem=this.bets[index];
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui 
		betList:null,
		gameList:null,
		quickStartBtn:null,
		gameItem:null,
		betItem:null,
		curGameName:null,
		CloseBtn:null,
		btnGameItems:[],
		btnBetItems:[],
	};
	node=null;
	model=null;
	constructor(model){	
		super(model);
		this.node=ctrl.node;
		this.model = model; 
		this.initUi();
		this.addGrayLayer();
	}
	//初始化ui
	initUi()
	{ 
		this.ui.betList=ctrl.prefab_betlist;
		this.ui.gameList=ctrl.gamelist;
		this.ui.quickStartBtn=ctrl.QuickStartBtn;
		this.ui.gameItem=ctrl.prefab_gameitem;
		this.ui.betItem=ctrl.prefab_betitem;
		this.ui.curGameName = ctrl.curGameName;
		this.ui.CloseBtn = ctrl.CloseBtn;
		for(let i=0;i<this.model.games.length;++i)
		{
			let item=this.model.games[i];
			let prefabNode = cc.instantiate(this.ui.gameItem); 
			prefabNode.getChildByName('label_Name').getComponent(cc.Label).string = item.name; 
			this.ui.gameList.addChild(prefabNode);
			this.ui.btnGameItems.push(prefabNode);
		} 
		this.updateBets();
	} 
	updateBets(){
		this.ui.betList.removeAllChildren();
		this.ui.btnBetItems=[]
		for(let i=0;i<this.model.bets.length;++i)
		{
			//console.log("绘制了")
			let item=this.model.bets[i]; 
			let prefabNode = cc.instantiate(this.ui.betItem);
			prefabNode.getChildByName('label_Name').getComponent(cc.Label).string = item.name;  
			this.ui.betList.addChild(prefabNode);
			this.ui.btnBetItems.push(prefabNode);
		} 
	}
}
//c, 控制
@ccclass
export default class Prefab_TranningCtrl extends BaseCtrl {
	//这边去声明ui组件
 
	@property(cc.Node)
	gamelist=null;

	@property(cc.Node)
	QuickStartBtn : cc.Node = null;

	@property(cc.Node)
	CloseBtn : cc.Node = null;

	@property(cc.Label)
	curGameName : cc.Label = null;
	
	@property(cc.Prefab)
	prefab_gameitem=null;
	@property(cc.Prefab)
	prefab_betitem=null;
	@property(cc.Node)
	prefab_betlist=null;
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
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image, this.ui.quickStartBtn, this.quickStartBtnCb, "快速游戏"); 
		this.connect(G_UiType.image, this.ui.CloseBtn, this.closeBtnBtnCb, "退出"); 
		
		for(let i=0;i<this.ui.btnGameItems.length;++i)
		{
			let btn=this.ui.btnGameItems[i];
			let cb=function()
			{
				this.choseGame(i);
			}
			this.connect(G_UiType.image, btn, cb, "选择游戏"); 
		}
		for(let i=0;i<this.ui.btnBetItems.length;++i)
		{
			let btn=this.ui.btnBetItems[i];
			let cb=function()
			{ 
				this.choseBet(i);
			}
			this.connect(G_UiType.image, btn, cb, "选择底注"); 
		}
	}
	choseBet(index)
	{
		this.model.updateBetSel(index);
		let bettype=this.model.curBetItem.bettype;
		BetMgr.getInstance().setBetType(bettype);
		this.JoinGoldRoom();
	}
	choseGame(index)
	{
		let ret=this.model.updateGameSel(index);
		this.ui.curGameName.string = this.model.games[index].name;
		if(!ret)
		{
			return;
		}
		this.view.updateBets();
		this.connectUi();
	}
	connectUiByNode(node,type,cb,op){
		this.connect(type, node, cb, op);
	}

	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private quickStartBtnCb () : void {
		BetMgr.getInstance().setBetType(1);
		this.JoinGoldRoom();
	}
	private closeBtnBtnCb () : void {
		this.finish();
	}

	
	 
	private JoinGoldRoom () : void { 
        BetMgr.getInstance().setGameId(this.model.curGameItem.id); 
		//在本地先判断下是否有足够金币加入金币场
		var ret=VerifyMgr.getInstance().checkCoin();
		if(!ret)
		{
			return;
		}
        //在这边验证加入 
        //金币场，直接从配置中读取座位数
        RoomMgr.getInstance().reqRoomVerify(false); 
	}
    //end
 
}