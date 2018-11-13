/*
author: JACKY
日期:2018-01-12 16:09:05
*/ 
  
 
import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import BaseView from "../../Plat/Libs/BaseView";
import BaseModel from "../../Plat/Libs/BaseModel";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr"; 
import { MahjongDef } from "./MahjongDef";

 



//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : MahjongEventCtrl;
//模型，数据处理
class Model extends BaseModel{

	carddatas=null; 
	curEvent=null;
	myself=null;
	mahjongResMgr=RoomMgr.getInstance().getResMgr();
	mahjongLogic=RoomMgr.getInstance().getLogic();
	mahjongDef=RoomMgr.getInstance().getDef();
	mahjongAudio=RoomMgr.getInstance().getAudio();
	mahjongCards = RoomMgr.getInstance().getCards();
	roomValue = RoomMgr.getInstance().getFangKaCfg();
	disablepass=false;
	int_chipaiHeightLeap = 0;
	//mahjongCards=null;
	animcfg = {};
	constructor()
	{
		super();
		this.clear();
		
		this.animcfg[this.mahjongDef.event_hu]='Btnhu';//胡
		this.animcfg[this.mahjongDef.event_qianggang_hu]='Btnqiangganghu';//抢杠胡
		this.animcfg[this.mahjongDef.event_angang]='Btngang';//暗杠
		this.animcfg[this.mahjongDef.event_bugang]='Btngang';//补杠
		this.animcfg[this.mahjongDef.event_gang]='Btngang';//杠
		this.animcfg[this.mahjongDef.event_peng]='Btnpeng';//碰
		this.animcfg[this.mahjongDef.event_chi]='Btnchi';//吃
		this.animcfg[this.mahjongDef.event_zimo]='Btnzimo';//自摸 
		this.animcfg[this.mahjongDef.event_sanjindao]='Btnsanjindao';//三金倒
		this.animcfg[this.mahjongDef.event_danyou]='Btnyoujin';//游金
		this.animcfg[this.mahjongDef.event_shuangyou]='Btnshuangyou';//双游
		this.animcfg[this.mahjongDef.event_sanyou]='Btnsanyou';//三游
		this.animcfg[this.mahjongDef.event_bazhanghua]='Btnbazhanghua';//八张花
		this.animcfg[this.mahjongDef.event_qiangjinhu]='Btnqiangjinhu';//抢金胡
		this.animcfg[this.mahjongDef.event_sijindao]='Btnsijindao';//四金倒
		this.animcfg[this.mahjongDef.event_wujindao]='Btnwujindao';//五金倒
		this.animcfg[this.mahjongDef.event_liujindao]='Btnliujindao';//六金倒
		this.animcfg[this.mahjongDef.event_tianhu]='Btntianhu';//天胡
		this.animcfg[this.mahjongDef.event_gaibaoqiangjin]='Btngaibaoqiangjin';//盖宝抢金 
		this.int_chipaiHeightLeap=ctrl.int_chipaiHeightLeap;
	}
	updateData(msg){
		if(!msg)
		{
			return;
		}
		//注释起来,msg在录像模式下是没值的 
		this.disablepass=msg.disablepass;
	}
	updateMySelf(){ 
		let seatid=RoomMgr.getInstance().getMySeatId(); 
		if(seatid==null)
		{
			return ;
		}
		this.myself=this.mahjongLogic.getInstance().players[seatid];
		this.mahjongCards = this.mahjongLogic.getInstance().getMahjongCards();
	}
	setCurEventIndex(index)
	{
		this.curEvent=this.myself.events[index];
		var cur_op=this.mahjongDef.op_cfg[this.curEvent] 
		this.carddatas=null; 
		if (cur_op==this.mahjongDef.op_chi){
			this.carddatas=this.myself.getCardsCandChi(); 
		}
		else if (cur_op==this.mahjongDef.op_angang){
			this.carddatas=this.myself.getCardsCanAnGang();  
		} 
		else if (cur_op==this.mahjongDef.op_bugang){
			this.carddatas=this.myself.getCardsCanBuGang();  
		} 
	}
 
	clear(  ){
		// body
		this.disablepass=false;
		this.curEvent=null;
	}
	recover(  ){
		// body
		let seatid=RoomMgr.getInstance().getMySeatId();
		this.myself=this.mahjongLogic.getInstance().players[seatid];
		this.mahjongCards = this.mahjongLogic.getInstance().getMahjongCards(); 
		this.animcfg[this.mahjongDef.event_hu]='Btnhu';//胡
		this.animcfg[this.mahjongDef.event_qianggang_hu]='Btnqiangganghu';//抢杠胡
		this.animcfg[this.mahjongDef.event_angang]='Btngang';//暗杠
		this.animcfg[this.mahjongDef.event_bugang]='Btngang';//补杠
		this.animcfg[this.mahjongDef.event_gang]='Btngang';//杠
		this.animcfg[this.mahjongDef.event_peng]='Btnpeng';//碰
		this.animcfg[this.mahjongDef.event_chi]='Btnchi';//吃
		this.animcfg[this.mahjongDef.event_zimo]='Btnzimo';//自摸 
		this.animcfg[this.mahjongDef.event_sanjindao]='Btnsanjindao';//三金倒
		this.animcfg[this.mahjongDef.event_danyou]='Btnyoujin';//游金
		this.animcfg[this.mahjongDef.event_shuangyou]='Btnshuangyou';//双游
		this.animcfg[this.mahjongDef.event_sanyou]='Btnsanyou';//三游
		this.animcfg[this.mahjongDef.event_bazhanghua]='Btnbazhanghua';//八张花
		this.animcfg[this.mahjongDef.event_qiangjinhu]='Btnqiangjinhu';//抢金胡
		this.animcfg[this.mahjongDef.event_sijindao]='Btnsijindao';//四金倒
		this.animcfg[this.mahjongDef.event_wujindao]='Btnwujindao';//五金倒
		this.animcfg[this.mahjongDef.event_liujindao]='Btnliujindao';//六金倒
		this.animcfg[this.mahjongDef.event_tianhu]='Btntianhu';//天胡
		this.animcfg[this.mahjongDef.event_gaibaoqiangjin]='Btngaibaoqiangjin';//盖宝抢金 
		this.int_chipaiHeightLeap=ctrl.int_chipaiHeightLeap;

	}
	getHuType()
	{
		return this.myself.getHuType();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		btnOpArr:null,
		btn_cancel:null,
		three:null,
		four:null, 
		hunode:null,
		threecardpanels:null,
		fourcardpanels:null,
		hucards:[],
		node_empty:null,
	};
	threecardfaces={};
	fourcardfaces={};
	fourcardbacks={};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{ 
		this.node.active=false;
		this.ui.btnOpArr=[ctrl.btn_0,ctrl.btn_1,ctrl.btn_2,ctrl.btn_3]; 
		this.ui.btn_cancel=ctrl.btn_cancel;
		this.ui.three=ctrl.three;
		this.ui.four=ctrl.four; 
		this.ui.hunode=ctrl.hunode;
		this.ui.threecardpanels=[]
		this.ui.fourcardpanels=[]
		this.threecardfaces=[]
		this.fourcardfaces=[]
		this.fourcardbacks=[];
		this.ui.node_empty=ctrl.node_empty;
		for (let i = 0;i<3;++i){ 
			let cardpanel=this.ui.three.getChildByName(`panel_${i}`); 
			this.ui.threecardpanels.push(cardpanel);
			cardpanel.active=false
			cardpanel.tag=i;
			let faces=[];
			for (let j=0; j<3;++j){ 
				let cardnode=cardpanel.getChildByName(`card_${j}`);
				let face=cardnode.getChildByName('face'); 
				faces.push(face);
			}
			this.threecardfaces.push(faces);
		}
		for (let i = 0;i<4;++i){ 
			let cardpanel=this.ui.four.getChildByName(`panel_${i}`); 
			this.ui.fourcardpanels.push(cardpanel);
			cardpanel.active=false;
			cardpanel.tag=i;
			let faces=[];
			let backs=[];
			for (let j = 0;j<4;++j){ 
				let cardnode=cardpanel.getChildByName(`card_${j}`);
				let face=cardnode.getChildByName('face'); 
				faces.push(face);
				if(j<3) {
					backs.push(cardnode.parent.getChildByName(`backcard_${j}`));
				}
			}
			this.fourcardbacks.push(backs);
			this.fourcardfaces.push(faces); 
		}

		for(var i = 0;i<14;++i)
		{
			var card=this.ui.hunode.getChildByName(`card_${i}`);
			this.ui.hucards.push(card); 
		} 

	}
 
	recover(){
		// body
		this.clear();

		if(this.model.myself.state!=MahjongDef.state_event){
			return;
		}
		// body 
	 
		this.show();
	}  
	clear(){
		// body
		this.node.active=false
		this.ui.hunode.active=false;
		for (var i = 0;i<this.ui.threecardpanels.length;++i){ 
			this.ui.threecardpanels[i].active=false;
		}
		for (let i = 0; i < this.threecardfaces.length; ++i) {
			let cardFace = this.threecardfaces[i];
			for (let j =0;j<cardFace.length;++j){
				let cardNodPos = cardFace[j].parent.getPosition();
				cardFace[j].parent.setPosition(cc.p(cardNodPos.x,0));
				cardFace[j].parent.color = new cc.Color(255,255,255);
			}
		}
		for (var i = 0;i<this.ui.fourcardpanels.length;++i){ 
			this.ui.fourcardpanels[i].active=false;
		}
	} 
	show(  ){
		// body 
		this.node.active=true; 
 
		this.ui.btn_cancel.active=true;
		this.ui.btn_cancel.getComponent(cc.Animation).play('Btnguo');
		for(let i = 0;i<this.ui.btnOpArr.length;++i)
		{
			let btnDo=this.ui.btnOpArr[i];
			let eventLength=this.model.myself.events.length;
			if(i<eventLength)
			{
				let event=this.model.myself.events[eventLength-1-i];
		
				if(this.model.disablepass)
				{ 
					this.ui.btn_cancel.active=false;
				} 
				
				if(event==MahjongDef.event_shuangyou&&this.model.mahjongCards.getCardCount()!=13)
				{
					this.ui.btn_cancel.active=false;
				}				
				btnDo.active=true;
				//播放动画
				let name = this.model.animcfg[event];
				//name=null; 
				console.log("event",event)
				if(event==MahjongDef.event_zimo) {
					let hutype=this.model.getHuType();
					switch(hutype)
					{
						case MahjongDef.hutype_131:
							name = "Btnshisanyao";
						break;
						case MahjongDef.hutype_hunyise:
							name = "Btnhunyise";
						break;
						case MahjongDef.hutype_qingyise:
							name = "Btnqingyise";
						break;
						case MahjongDef.hutype_jinque:
							name = "Btnjinque";
						break;
						case MahjongDef.hutype_jinlong:
							name = "Btnjinlong";
						break;
					}
				}
				if(event==MahjongDef.event_hu) {
					let hutype=this.model.getHuType();
					switch(hutype)
					{
						case MahjongDef.hutype_hunyise:
							name = "Btnhunyise";
						break;
						case MahjongDef.hutype_qingyise:
							name = "Btnqingyise";
						break;
						case MahjongDef.hutype_jinque:
							name = "Btnjinque";
						break;
						case MahjongDef.hutype_jinlong:
							name = "Btnjinlong";
						break;
					}
				}
				btnDo.getComponent(cc.Animation).play(name);
			} 
			else
			{
				btnDo.active=false;
			} 
		} 
	}

	showSubSel()
	{
		//显示牌面 
		var event=this.model.curEvent; 
		var cur_op=MahjongDef.op_cfg[event]
		if (cur_op==MahjongDef.op_chi ){ 
			this.updateChi();
		} 
		else if (cur_op==MahjongDef.op_angang ){ 
			this.updateAnGang(); 
		} 
		else if (cur_op==MahjongDef.op_bugang ){ 
			this.updateBuGang(); 
		} 
	}
	updateHu(  ){
		var cardpairs=this.model.carddatas.cardpairs; 
    	this.ui.hunode.active=true; 
		for(let i = 0;i<this.ui.hucards.length;++i)
		{
			this.ui.hucards[i].active=false;
		}
		var index=0;
		for (let i=0;i<cardpairs.length;++i){
			var cardarr=cardpairs[i];
			for (let k = 0;k<cardarr.length;++k){ 
				var mjnode=this.ui.hucards[index]; 
				mjnode.active=true;
				index++;
				var face=mjnode.getChildByName('face');
				var cardvalue=cardarr[k];  
                face.getComponent(cc.Sprite).spriteFrame = this.model.mahjongResMgr.getInstance().getCardSpriteFrame(cardvalue); 
			} 
		}  
	}
	updateChi(  ){
		// body 
		this.ui.btn_cancel.active=true;
		this.ui.btn_cancel.getComponent(cc.Animation).play('Btnguo');
		for (var i = 0;i<this.model.carddatas.length;++i){
			var chiinfo=this.model.carddatas[i];
			var cards=chiinfo.cards;
			var cardpanel=this.ui.threecardpanels[i];
			cardpanel.active=true
			var cardface=this.threecardfaces[i];
			for (var j =0;j<cards.length;++j){
				var cardvalue=cards[j];
				var face=cardface[j];
				if(chiinfo.index==j) {
					let cardNodePosition = face.parent.getPosition();
					face.parent.setPosition(cc.p(cardNodePosition.x,cardNodePosition.y+this.model.int_chipaiHeightLeap));
					face.parent.color = new cc.Color(167,244,164);
				}
                face.getComponent(cc.Sprite).spriteFrame = this.model.mahjongResMgr.getInstance().getCardSpriteFrame(cardvalue); 
			} 
		}
	}
	hideAllSelection()
	{
		if(!this.model.carddatas)
		{
			return;
		}
		for (let i = 0;i<this.model.carddatas.length;++i){
			let threecardpanel=this.ui.threecardpanels[i];
			if(threecardpanel.active==true)
			{
				threecardpanel.active=false;
				let chiinfo=this.model.carddatas[i];
				let cards=chiinfo.cards;
				let cardface=this.threecardfaces[i];
				for (let j =0;j<cards.length;++j){
					var face=cardface[j];
					if(chiinfo.index==j) {
						let cardNodePosition = face.parent.getPosition();
						face.parent.setPosition(cc.p(cardNodePosition.x,0));
					} 
				} 
			}

		}
		for(let  i = 0;i<this.model.carddatas.length;++i){
			let fourcardpanel=this.ui.fourcardpanels[i];
			if(fourcardpanel.active==true)
			{
				fourcardpanel.active=false;
			}
		}  
	}
	updatePeng(  ){
		// body 
		var cardpanel=this.ui.threecardpanels[0];
		cardpanel.active=true;
		var cardface=this.threecardfaces[0];
		var cardvalue=this.model.mahjongLogic.getInstance().curcard;
		for (var j =0;j<3;++j){  
			var face=cardface[j];   
			face.getComponent(cc.Sprite).spriteFrame = this.model.mahjongResMgr.getInstance().getCardSpriteFrame(cardvalue); 
		}
	}
	updateGang(  ){
		// body  
		var cardpanel=this.ui.fourcardpanels[0];
		cardpanel.active=true;
		var cardface=this.fourcardfaces[0];
		var cardvalue=this.model.mahjongLogic.getInstance().curcard;
		for (var j =0;j<4;++j){  
			var face=cardface[j];
			face.getComponent(cc.Sprite).spriteFrame = this.model.mahjongResMgr.getInstance().getCardSpriteFrame(cardvalue); 
		}
	}
	updateAnGang(  ){
		// body 
		for(var  i = 0;i<this.model.carddatas.length;++i){
			var cardvalue=this.model.carddatas[i];
			var cardpanel=this.ui.fourcardpanels[i];
			cardpanel.active=true;
			var cardface=this.fourcardfaces[i];
			let cardback=this.fourcardbacks[i];

			for (var j =0;j<4;++j){   
				var face=cardface[j];
				if(j<3) {
					face.parent.active = false;
					cardback[j].active = true;
					continue;
				}
				face.getComponent(cc.Sprite).spriteFrame = this.model.mahjongResMgr.getInstance().getCardSpriteFrame(cardvalue); 
			} 
		}   
	}
	updateBuGang(  ){
		// body 
		for(var  i = 0;i<this.model.carddatas.length;++i){
			var cardvalue=this.model.carddatas[i];
			var cardpanel=this.ui.fourcardpanels[i];
			cardpanel.active=true;
			var cardface=this.fourcardfaces[i];
			for (var j =0;j<4;++j){   
				var face=cardface[j];
				face.parent.active = true;
				face.getComponent(cc.Sprite).spriteFrame = this.model.mahjongResMgr.getInstance().getCardSpriteFrame(cardvalue); 
			} 
		}   
	}
	hideAllOpBtns()
	{
		for(let i = 0;i<this.ui.btnOpArr.length;++i)
		{
			this.ui.btnOpArr[i].active = false;
		}
		this.ui.btn_cancel.active=false;
	}
}
//c, 控制
@ccclass
export default class MahjongEventCtrl extends BaseCtrl {
	//这边去声明ui组件

	@property(cc.Node)
	btn_0=null;
	@property(cc.Node)
	btn_1=null;
	@property(cc.Node)
	btn_2=null;
	@property(cc.Node)
	btn_3=null;
	@property(cc.Node)
	btn_cancel=null; 
	@property(cc.Node)
	three=null;  
	@property(cc.Node)
	four=null;  
	@property(cc.Node)
	hunode=null;   

	//胡牌的牌
	@property(cc.Node)
	card_0=null; 
	@property(cc.Node)
	card_1=null; 
	@property(cc.Node)
	card_2=null; 
	@property(cc.Node)
	card_3=null;
	@property(cc.Node)
	card_4=null;
	@property(cc.Node)
	card_5=null;
	@property(cc.Node)
	card_6=null;
	@property(cc.Node)
	card_7=null;
	@property(cc.Node)
	card_8=null;
	@property(cc.Node)
	card_9=null;
	@property(cc.Node)
	card_10=null;
	
	@property(cc.Node)
	card_11=null; 
	
	@property(cc.Node)
	card_12=null;
	
	@property(cc.Node)
	card_13=null;

	@property({
		tooltip : "麻将吃牌增高长度",
		type : cc.Integer
	})
	int_chipaiHeightLeap:cc.Integer=0;
	@property(cc.Node)
	node_empty=null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离
 
	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model,View);
		this.usersUpdated();
		this.onSyncData();
	}

	//定义网络事件
	defineNetEvents()
	{
		this.n_events={ 
			//网络消息监听列表
			onEvent:this.onEvent,
			onProcess:this.onProcess,   
			onOp:this.onOp,
			onSyncData:this.onSyncData, 
		}
	}
	//定义全局事件
	defineGlobalEvents()
	{
		//全局消息
		this.g_events={ 
			'usersUpdated':this.usersUpdated,   
		} 
	}
	usersUpdated()
	{
		this.model.updateMySelf();
	}
	clickEvent(index)
	{
		let videoMode = RoomMgr.getInstance().getVideoMode();
		if(videoMode)
		{
			return;
		} 
		
		//点击了某个事件
		let eventLength=this.model.myself.events.length;//是和事件优先级相反的排版
		this.model.setCurEventIndex(eventLength-1-index); 
		let event=this.model.curEvent;
		if(this.model.carddatas)
		{
			if(this.model.carddatas.length>1)
			{
				this.view.hideAllOpBtns();
				this.view.showSubSel();
				return;
			} 
		} 
		this.playerOp(0);
	}
	//绑定操作的回调
	connectUi()
	{  		
		for(let i = 0;i<this.ui.btnOpArr.length;++i)
		{
			var btnOp=this.ui.btnOpArr[i];
			var cb = function()
			{
				this.clickEvent(i);
			}
			var cancelcb = function()
			{ 
				
			}
			this.connect(G_UiType.button, btnOp, 
				{"startCallBack":null, "moveCallBack":null, "endCallBack":cb.bind(this), "cancelCallBack":cancelcb.bind(this)},
				`操作${i}`)
			
		} 
		this.connect(G_UiType.button,this.ui.btn_cancel,{"startCallBack":null, "moveCallBack":null, "endCallBack":this.btn_cancel_cb, "cancelCallBack":cancelcb.bind(this)},'取消事件') 
		for (let i=0;i<this.ui.threecardpanels.length;++i){
			var cardpanel=this.ui.threecardpanels[i]; 
			cardpanel.on(cc.Node.EventType.TOUCH_END, function (event) {
				//加入操作日志
				this.touchPanel(i) 
			},this);	
		}
		for (let i=0;i<this.ui.fourcardpanels.length;++i){
			var cardpanel=this.ui.fourcardpanels[i];
			cardpanel.on(cc.Node.EventType.TOUCH_END, function (event) {
				//加入操作日志
				this.touchPanel(i) 
			},this);
		}
		this.connect(G_UiType.image,this.ui.node_empty,this.node_emptycb,"点击背景");
	}
	start () {
	}
	//网络事件回调begin
	
	onSyncData(msg){
		// body
		let seatid=RoomMgr.getInstance().getMySeatId();
		if(seatid==null)
		{
			return;
		}
		//console.log("onSyncData",msg)
		this.model.updateData(msg);
		this.ui.hunode.active=false;
		this.model.recover();
		this.view.recover();
 
	}
	onOp(  ){
		// body 
		this.model.clear();
		this.view.clear() 
	} 
	//事件通知
	onEvent(msg){ 
		if(this.model.myself.state!=MahjongDef.state_event){

			return;
		} 
		// body 
		this.model.clear();
		this.model.updateData(msg);
		this.view.clear();
		this.view.show();
	}
 
	process_ready(msg){
		// body
		this.model.clear();
		this.view.clear()
	}
	onProcess(msg){ 
		if (msg.process==MahjongDef.process_ready){ 
			this.process_ready(msg);
		}
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	btn_cancel_cb(  ){
		// body 
		let videoMode = RoomMgr.getInstance().getVideoMode();
		if(videoMode)
		{
			return;
		}
		this.model.mahjongLogic.getInstance().playerCancel()
		this.view.clear()
	}
	//end
	playerOp(id){ 
		let videoMode = RoomMgr.getInstance().getVideoMode();
		if(videoMode)
		{
			return;
		}
		// body
		if (this.model.curEvent==MahjongDef.event_chi){  
			var chiinfo=this.model.carddatas[id];
			var index=chiinfo.index;
			this.model.mahjongLogic.getInstance().playerOp(this.model.curEvent,index);
		}
		else if ((this.model.curEvent==MahjongDef.event_angang) || (this.model.curEvent==MahjongDef.event_bugang)){ 
			var card=this.model.carddatas[id];
			this.model.mahjongLogic.getInstance().playerOp(this.model.curEvent,card); 
		} 
		else {
			this.model.mahjongLogic.getInstance().playerOp(this.model.curEvent);
		}
		this.view.clear()
	}
	touchPanel(index){  
		
		this.playerOp(index) 
	}
	node_emptycb(node,event)
	{
		let videoMode = RoomMgr.getInstance().getVideoMode();
		if(videoMode)
		{
			return;
		}
		if(this.model.disablepass)
		{ 
			return;
		}
		this.view.hideAllSelection();
		this.view.show(); 
	}
}
