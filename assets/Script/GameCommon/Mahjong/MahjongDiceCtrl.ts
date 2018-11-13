/*
author: JACKY
日期:2018-01-12 16:08:22
*/
       
import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import BaseView from "../../Plat/Libs/BaseView";
import BaseModel from "../../Plat/Libs/BaseModel";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr"; 
import { MahjongDef } from "./MahjongDef";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : MahjongDiceCtrl;
//模型，数据处理
class Model extends BaseModel{
	list=null;
	step=null;
	dice1Value=null;
	dice2Value=null;
	mahjongResMgr=RoomMgr.getInstance().getResMgr();
	mahjongLogic=RoomMgr.getInstance().getLogic();
	mahjongDef=RoomMgr.getInstance().getDef();
	mahjongAudio=RoomMgr.getInstance().getAudio();
	constructor()
	{
		super();

		//在这里定义视图和控制器数据
		this.clear();
	}  
	initRandom(finalpoint){ 
		this.step=1;
		var pool = {}  
		this.list.push(finalpoint); 
	}
	initDices(data){
		this.dice1Value=Number(data.touzi1);
		this.dice2Value=Number(data.touzi2);
	}
	clear(){
		// body
		this.list=[];
		this.step=1;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		DiceAnim:null,
		Dice1:null,
		Dice2:null,	
        DingZhuang:null
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
		this.ui.Dice1=ctrl.Dice1;
		this.ui.Dice2=ctrl.Dice2;
		this.ui.DiceAnim=ctrl.DiceAnim;
		this.ui.DingZhuang=ctrl.DingZhuang;
		this.ui.DingZhuang.active = false;
		this.node.active=false;
		this.ui.DiceAnim.getComponent('cc.Animation').on('finished', this.onDiceFinished, this);	
	}
	runDice()
	{ 
		this.ui.DingZhuang.active = true;
		this.ui.DingZhuang.getComponent('cc.Animation').play();
		this.node.active=true; 
		this.ui.DiceAnim.getComponent('cc.Animation').play();
		//骰子音效
		this.model.mahjongAudio.getInstance().playDice();
	}
	clear(){
		this.ui.DingZhuang.getComponent('cc.Animation').stop();
		this.ui.DiceAnim.getComponent('cc.Animation').stop();
	}
	onDiceFinished(){
		this.ui.Dice1.getComponent(cc.Sprite).spriteFrame = this.model.mahjongResMgr.getInstance().getSpriteFrame(`dice1-ysz_${this.model.dice1Value}`);
		this.ui.Dice2.getComponent(cc.Sprite).spriteFrame = this.model.mahjongResMgr.getInstance().getSpriteFrame(`dice2-ysz2_${this.model.dice2Value}`);
		this.ui.DiceAnim.active = false;
		this.ui.Dice1.active = true;
		this.ui.Dice2.active = true;
		////console.log("dice1Finish",this.model.mahjongResMgr.getInstance().getSpriteFrame(`dice1-ysz_${this.model.dice1Value}`));
		////console.log("dice1Finish",this.model.mahjongResMgr.getInstance().getSpriteFrame(`dice2-ysz2_${this.model.dice2Value}`));
	}
	hideDice()
	{
        this.node.active=false;
	} 
}
//c, 控制
@ccclass
export default class MahjongDiceCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property({
		tooltip:"骰子动画",
		type:cc.Node
	})
	DiceAnim:Node = null

    @property({
		tooltip:"左边骰子",
		type:cc.Node
	})
	Dice1:Node=null;

    @property({
		tooltip:"右边骰子",
		type:cc.Node
	})
	Dice2:Node=null;

	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离 

    @property(cc.Node)
    DingZhuang=null;

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
		this.n_events={ 
			//网络消息监听列表
			onProcess:this.onProcess,
		}
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
 
	onProcess(msg){ 
		if (msg.process==MahjongDef.process_ready){ 
			this.process_ready();
		}
		else if(msg.process==MahjongDef.process_dingzhuang){ 
			this.process_dingzhuang(msg);
		} 
		else if(msg.process==MahjongDef.process_fapai){ 
			this.process_fapai(msg);
		} 
	}
	process_ready(){
		// body   
		this.model.clear();
		this.view.clear();
	}
	process_dingzhuang(msg)
	{
		this.model.initDices(msg);
		this.view.runDice(); 
	} 
	process_fapai(msg)
	{		
		this.view.hideDice();
	}
}
