/*
author: YOYO
日期:2018-04-20 10:36:05
*/
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseModel from "../../../Plat/Libs/BaseModel";
import GEventDef from "../../../Plat/GameMgrs/GEventDef";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import MpnnLogic from "../BullMgr/MpnnLogic";
import MpnnConst from "../BullMgr/MpnnConst";
import LocalStorage from "../../../Plat/Libs/LocalStorage";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Mpnn_cuopaiCtrl;
//模型，数据处理
class Model extends BaseModel{
	pokeBack:null;
	constructor()
	{
		super();
		this.pokeBack =LocalStorage.getInstance().getBullCardBGCfg();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		card_mask_number:ctrl.card_mask_number,
		card_mask_jqk:ctrl.card_mask_jqk,
		card_back:ctrl.card_back,
		card_value:ctrl.card_value,
		btn_liangPai:ctrl.btn_liangPai,
		btn_close:ctrl.btn_close,
	};
	node:cc.Node
	model:Model
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{	
		this.ui.card_value.active = false;
		this.addGrayLayer();
		this.initCardBack();
	}
	initCardBack(){
		let cardBack = '0x00';
		switch(this.model.pokeBack){
			case 1:cardBack = '0x00_1';break;
			case 2:cardBack = '0x00_2';break;
			case 3:cardBack = '0x00';break;
			case 4:cardBack = '0x00_4';break;
		}
		let path = 'Plat/GameRoomCommon/BigPoker/bull2_'+cardBack;
		cc.loader.loadRes(path, cc.SpriteFrame, (err, assets)=>{
            if(err){
                cc.error(err)
            }else{
				this.ui.card_back.getComponent(cc.Sprite).spriteFrame = assets;
				this.ui.card_value.active = true;
            }
		})
	}
	initCardValue(cardValue){
		let path = 'Plat/GameRoomCommon/BigPoker/bull2_'+this.getSixValue(cardValue);
		cc.loader.loadRes(path, cc.SpriteFrame, (err, assets)=>{
            if(err){
                cc.error(err)
            }else{
                this.ui.card_value.getComponent(cc.Sprite).spriteFrame = assets;
            }
        })
	}
	hideMask(){
		//this.ui.card_mask.active = false;
		this.ui.card_mask_number.runAction(cc.fadeOut(0.5));
		this.ui.card_mask_jqk.runAction(cc.fadeOut(0.5));
		this.ui.card_back.active = false;
	}
	ghostHide(){
		this.ui.card_mask_jqk.active = false;
		this.ui.card_mask_number.active = false;
	}
	moveCardBack(event,offX,offY){
		let Movedelta = event.touch.getDelta()
		this.ui.card_back.x += Movedelta.x;
		this.ui.card_back.y += Movedelta.y;
		if(offX >= this.ui.card_value.width/3 || offY>= this.ui.card_value.height/3){
			this.hideMask();
			let delay_time=setTimeout(() => {
				clearTimeout(delay_time);
				MpnnLogic.getInstance().emit_cuopaiEnd(1);
			}, 1000);
			//this.ui.btn_liangPai.active = false;
		}
	}
	getSixValue(logicNum){
        logicNum = parseInt(logicNum);
        let str = logicNum < 14 ?  "0x0" : "0x";
        return str + logicNum.toString(16);
	}
	chooseMsk(value) {
		let cardValue = this.getSixValue(value).split('');
		let word = cardValue[cardValue.length-1]
		if (word == 'b' || word == 'c' || word == 'd') {
			this.ui.card_mask_jqk.active = true;
			this.ui.card_mask_number.active = false;
		} else {
			this.ui.card_mask_jqk.active = false;
			this.ui.card_mask_number.active = true;
		}
	}
}
//c, 控制
@ccclass
export default class Mpnn_cuopaiCtrl extends BaseCtrl {
	view:View
	model:Model
	delay_time = null
	//这边去声明ui组件
	@property(cc.Node)
	btn_liangPai:cc.Node = null
	@property(cc.Node)
	card_mask_number:cc.Node = null
	@property(cc.Node)
	card_mask_jqk:cc.Node = null
	@property(cc.Node)
	card_back:cc.Node = null
	@property(cc.Node)
	card_value:cc.Node = null
	@property(cc.Node)
	btn_close:cc.Node = null
	

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
		this.n_events[MpnnConst.clientEvent.onProcess] = this.onProcess;
        this.n_events[MpnnConst.clientEvent.onSyncData] = this.onSyncData;
	}
	//定义全局事件
	defineGlobalEvents()
	{
		this.g_events[GEventDef.bull_cuopai] = this.onStartCuopai;//开始搓牌
        this.g_events[GEventDef.bull_cuopaiEnd] = this.bull_cuopaiEnd;//搓牌结束
	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image, this.ui.btn_liangPai, this.btn_liangPai_cb, '点击亮牌');
		this.connect(G_UiType.image, this.ui.btn_close, this.btn_close_cb, '点击关闭搓牌');
	}
	start () {
		//this.onStartCuopai(0x07)
	}
	//网络事件回调begin
	onProcess(msg){
        switch(msg.process){
            case MpnnConst.process.settle:
                //游戏结算
                this.finish();
            break
        }
    }
    onSyncData(){
        this.finish();
    }
	//end
	//全局事件回调begin
	onStartCuopai(msg){
		let value = msg[0]
		//判断是不是鬼牌
		if(value == 78 || value == 79){
			this.view.ghostHide();
		}
		this.view.chooseMsk(msg[0]);
		//判断是不是鬼牌
		//console.log("开始搓牌")
		this.view.initCardValue(value)
		this.nodeOn();
	}
	nodeOn(){
		this.card_back.on(cc.Node.EventType.TOUCH_START,this.touchStart,this);
		this.card_back.on(cc.Node.EventType.TOUCH_MOVE,this.touchMove,this)
	}
	nodeOff(){
		this.card_back.off(cc.Node.EventType.TOUCH_START,this.touchStart,this);
		this.card_back.off(cc.Node.EventType.TOUCH_MOVE,this.touchMove,this)
	}
	bull_cuopaiEnd(msg){
		this.finish();
	}
	//end
	//按钮或任何控件操作的回调begin
	btn_liangPai_cb(){
		this.view.hideMask();
		this.delay_time = this.scheduleOnce(() => {
			this.finish();
			MpnnLogic.getInstance().emit_cuopaiEnd(1);
		}, 1)

	}
	btn_close_cb(){
		this.gemit('cuopaiclose');
		this.finish();
	}
	touchStart(event){
		
	}
	touchMove(event){
		//let dis = cc.pDistance(this.ui.card_back.position,this.ui.card_value.position)
		let offX = Math.abs(this.ui.card_value.x - this.ui.card_back.x);
		let offY = 	Math.abs(this.ui.card_value.y - this.ui.card_back.y);
		this.view.moveCardBack(event,offX,offY)
	}
	onDestroy(){
		clearTimeout(this.delay_time)
		super.onDestroy(); 
	}

	//end
}