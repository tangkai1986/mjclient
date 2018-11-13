/*
author: JACKY
日期:2018-01-22 17:10:38
*/
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseModel from "../../../Plat/Libs/BaseModel";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import FzmjLogic from "../FzmjMgr/FzmjLogic";  
import { MahjongGeneral } from "../../../GameCommon/Mahjong/MahjongGeneral";
import { MahjongDef } from "../../../GameCommon/Mahjong/MahjongDef";
 


let Green = new cc.Color(24,221,40),Red = new cc.Color(255,78,0), Yellow = new cc.Color(255,222,0),White = new cc.Color(255,255,255),
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : FzmjHaidilaoyueCtrl;
//模型，数据处理
class Model extends BaseModel{
	haidilaoyueInfo=null;
	
	mahjongResMgr=RoomMgr.getInstance().getResMgr();
	constructor()
	{
		super();
		this.initData();
	}
	initData()
	{
		let qzmjLogicInstance = FzmjLogic.getInstance();
		if(qzmjLogicInstance != null)
		{
			this.haidilaoyueInfo = qzmjLogicInstance.haidilaoyueInfo;
		}
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		node_haidilaoyue:ctrl.node_haidilaoyue,
		effect_haidilaoyue:null,
		haidilaoyueCards:[]
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node; 
		this.initUi();
		// this.addGrayLayer();
	}
	//初始化ui
	initUi()
	{
		this.ui.effect_haidilaoyue = this.ui.node_haidilaoyue.getChildByName("effect_haidilaoyue");
		this.ui.haidilaoyueCards.push(this.ui.effect_haidilaoyue.getChildByName("card_0"));
		this.ui.haidilaoyueCards.push(this.ui.effect_haidilaoyue.getChildByName("card_1"));
		this.ui.haidilaoyueCards.push(this.ui.effect_haidilaoyue.getChildByName("card_2"));
		this.ui.haidilaoyueCards.push(this.ui.effect_haidilaoyue.getChildByName("card_3"));
		if(this.model.haidilaoyueInfo) {
			this.showhaidilaoyue();
		}
	} 
	showhaidilaoyue()
	{
		this.ui.effect_haidilaoyue.active = true;
		for (let logicseatid = 0; logicseatid < this.model.haidilaoyueInfo.length; logicseatid++) {
			let viewSeatId = RoomMgr.getInstance().getViewSeatId(logicseatid);
			let card =this.ui.haidilaoyueCards[viewSeatId];
			let value=this.model.haidilaoyueInfo[logicseatid]; 
			if (value !=null && value !=undefined){
                let sign=card.getChildByName('sign');
				sign.active = true;
				let frame = this.model.mahjongResMgr.getInstance().getCardSpriteFrame(value)
				sign.getComponent(cc.Sprite).spriteFrame = frame;  
				card.active=true;
			}
			else
			{
				card.active=false;
			}
			let isJoker=MahjongGeneral.isJoker(value);
			card.getChildByName('jin').active = isJoker;
			if(isJoker) {
				card.getChildByName('majingBg').color=new cc.Color(255,255,0);
			}
			else
			{
				card.getChildByName('majingBg').color=White;
			}
		}
	}
}
//c, 控制
@ccclass
export default class FzmjHaidilaoyueCtrl extends BaseCtrl {
	
	//这边去声明ui组件
	@property({
		tooltip:"海底捞月",
		type:cc.Node
	})
	node_haidilaoyue:cc.Node = null
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
		this.n_events={
			//网络消息监听列表  
			onProcess:this.onProcess,
			'http.reqSettle':this.http_reqSettle 
        } 	
	}
	//定义全局事件
	defineGlobalEvents()
	{
		//全局消息
		this.g_events={ 
			'usersUpdated':this.usersUpdated
		}
	}
	//绑定操作的回调
	connectUi()
	{
	}
	start () {
	}
	//网络事件回调begin
	usersUpdated(){
		this.finish();
	}
	onProcess(msg)
	{
		if (msg.process==MahjongDef.process_ready){ 
			this.process_ready(); 
		}
	}
	http_reqSettle()
	{
		this.finish();
	}
    process_ready(){
    	this.finish();
    }
}
