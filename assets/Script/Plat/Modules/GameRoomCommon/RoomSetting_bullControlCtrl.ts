/*
author: YOYO
日期:2018-04-04 17:17:43
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import LocalStorage from "../../Libs/LocalStorage";
import BullCardsMgr from "../../../GameCommon/Bull/BullCardsMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : RoomSetting_bullControlCtrl;

const POKEBACK = cc.Enum({
	ORANGE_01:1,
	BULE_01:2,
	ORANGE_02:3,	//当前默认的牌 0x00
	BULE_02:4,
})
const CONFIGS = {
    localBGName : 'bull_backgroundTable'
}
//模型，数据处理
class Model extends BaseModel{
	private pokeBack:any = null
	private tableState:any = null
	constructor()
	{
		super();
		// this.pokeBack =cc.sys.localStorage.getItem("SpriteFrameState");
		this.pokeBack =LocalStorage.getInstance().getBullCardBGCfg();
		// this.tableState = cc.sys.localStorage.getItem(CONFIGS.localBGName);
		this.tableState = LocalStorage.getInstance().getBullRoomBGCfg();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	
	ui={
		//在这里声明ui
		changePoke:null,
		changeTable:null
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
		this.initPoketoggleCheck(this.model.pokeBack);
		this.initTableToggleCheck(this.model.tableState);
	}
	//初始化ui
	initUi()
	{
		this.ui.changePoke = ctrl.changePoke;
		this.ui.changeTable = ctrl.changeTable;
	}
	initPoketoggleCheck(state){
		if(state == POKEBACK.ORANGE_01){
			this.ui.changePoke.children[0].getComponent(cc.Toggle).check();
		}else if(state == POKEBACK.BULE_01){
			this.ui.changePoke.children[1].getComponent(cc.Toggle).check();
		}else if(state == POKEBACK.ORANGE_02){
			this.ui.changePoke.children[2].getComponent(cc.Toggle).check();
		}else if(state == POKEBACK.BULE_02){
			this.ui.changePoke.children[3].getComponent(cc.Toggle).check();
		}
	}
	initTableToggleCheck(state){
		if(state == 1){
			this.ui.changeTable.children[0].getComponent(cc.Toggle).check();
		}else if(state == 2){
			this.ui.changeTable.children[1].getComponent(cc.Toggle).check();
		}
	}
}
//c, 控制
@ccclass
export default class RoomSetting_bullControlCtrl extends BaseCtrl {
	view:View = null
	model:Model = null
	//这边去声明ui组件
	@property({
		tooltip:"更换扑克牌",
		type:cc.Node
	})
	changePoke:cc.Node = null;

	@property({
		tooltip:"更换牌桌",
		type:cc.Node
	})
	changeTable:cc.Node = null;
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
		for(let i =0 ;i<this.changePoke.childrenCount;i++){
			let Toggle = this.changePoke.children[i];
			this.connect(G_UiType.toggle, Toggle, this.changePoke_cb, '更换扑克牌');
		}
		for(let i =0 ;i<this.changeTable.childrenCount;i++){
			let Toggle = this.changeTable.children[i];
			this.connect(G_UiType.toggle, Toggle, this.changeTable_cb, '更换牌桌');
		}
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	
	//切换扑克背面图片
	changePoke_cb(){
		if(this.changePoke.children[0].getComponent(cc.Toggle).isChecked){
			BullCardsMgr.setSpriteFrameState(1);
		}else if(this.changePoke.children[1].getComponent(cc.Toggle).isChecked){
			BullCardsMgr.setSpriteFrameState(2);
		}else if(this.changePoke.children[2].getComponent(cc.Toggle).isChecked){
			BullCardsMgr.setSpriteFrameState(3);
		}else if(this.changePoke.children[3].getComponent(cc.Toggle).isChecked){
			BullCardsMgr.setSpriteFrameState(4);
		}
	}
	//更换牌桌图片
	changeTable_cb(){
		if(this.changeTable.children[0].getComponent(cc.Toggle).isChecked){
            // cc.sys.localStorage.setItem(CONFIGS.localBGName,1);
            LocalStorage.getInstance().setBullRoomBGCfg(1);
			//再一次初始化桌面
			G_FRAME.globalEmitter.emit('setBackGroundSpriteFrame');
			G_FRAME.globalEmitter.emit('setAllTableLaebl'); 
			G_FRAME.globalEmitter.emit('setRoomInfoFont'); 
			 
		}else if(this.changeTable.children[1].getComponent(cc.Toggle).isChecked){
            // cc.sys.localStorage.setItem(CONFIGS.localBGName,2);
            LocalStorage.getInstance().setBullRoomBGCfg(2);
			G_FRAME.globalEmitter.emit('setBackGroundSpriteFrame'); 
			G_FRAME.globalEmitter.emit('setAllTableLaebl'); 
			G_FRAME.globalEmitter.emit('setRoomInfoFont');    
			//再一次初始化桌面
		}
	}
	//end
}