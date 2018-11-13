/*
author: JACKY
日期:2018-01-22 17:10:38
*/
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseModel from "../../../Plat/Libs/BaseModel";
import ModuleMgr from "../../../Plat/GameMgrs/ModuleMgr";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import FzmjLogic from "../FzmjMgr/FzmjLogic"; 
import {g_deepClone} from "../../../Plat/Libs/Gfun";
import UserMgr from "../../../Plat/GameMgrs/UserMgr";

import SwitchMgr from "../../../Plat/GameMgrs/SwitchMgr"; 
import { MahjongDef } from "../../../GameCommon/Mahjong/MahjongDef";
import MahjongResMgr from "../../../GameCommon/Mahjong/MahjongResMgr";
import { MahjongGeneral } from "../../../GameCommon/Mahjong/MahjongGeneral";
import ShareMgr from "../../../Plat/GameMgrs/ShareMgr";
 


let Green = new cc.Color(24,221,40),Red = new cc.Color(255,0,0), Yellow = new cc.Color(255,222,0), Blue = new cc.Color(4,152,177);
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : FzmjSettleCtrl;
//模型，数据处理
class Model extends BaseModel{
	playerSettleInfos=null;
	win_seatid=0;
	seatcount=0;
	b_drawGame=false
	sharingSwitch=null//每局结算分享开关
	bViewAgain=false;
	curcard=null;
	opcardarr=null;
	handcards=null;
	mahjongCards=null;
	constructor()
	{
		super();
		this.initData();
		this.sharingSwitch = SwitchMgr.getInstance().get_switch_settlement_sharing();
	}
	initData()
	{
		let fzmjLogicInstance = FzmjLogic.getInstance();
		if(fzmjLogicInstance != null)
		{
			this.win_seatid=fzmjLogicInstance.win_seatid;
			if(this.win_seatid==null)
			{
				this.b_drawGame=true;
			}
			this.playerSettleInfos=fzmjLogicInstance.roundSettle.wanjiashuis;
			//console.log("玩家信息：",this.playerSettleInfos);
			this.seatcount = fzmjLogicInstance.seatcount;

			this.curcard=fzmjLogicInstance.curcard;
			this.opcardarr=fzmjLogicInstance.roundSettle.opcards;
			this.handcards=g_deepClone(fzmjLogicInstance.roundSettle.handcards);
			this.mahjongCards = fzmjLogicInstance.mahjongcards;
		}
	}
	setAsViewAgain(){
		this.bViewAgain=true;
	}
	updateSwitch(msg){
		this.sharingSwitch = msg.cfg.switch_settlement_sharing;
	}
	getHuType(handcard)
	{
		let pai=handcard.concat();
		pai.sort();
		let huinfo=this.mahjongCards.IsHu(pai)
		if(!huinfo)
		{
			return null;
		}
		return huinfo.hutype;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		node_drawgame:ctrl.node_drawgame,
		img_liuju:null,
		btn_share:null,
		btn_again:null,
		node_userList:null,
		//作弊检测
		clippingNode:null,
		lbl_js:null,
		lbl_hide:null,
		settletip:null,
		nodePlayer1Cards:null,
		nodePlayer2Cards:null,
		nodePlayer3Cards:null,
		nodePlayer4Cards:null,
		nodePlayer1head:null,
		nodePlayer2head:null,
		nodePlayer3head:null,
		nodePlayer4head:null,
		imgBanker:null,
		fanInfos:[],
		difans:[],
		playerNames:[],
		totalpanvalues:[],
		txtScores:[],
		lbl_winTimes:null,
		sprite_huType:null,
		node_bg:null,
		node_hutype:null,
		button_close:null
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node; 
		this.initUi();
		this.addGrayLayer();
	}
	//初始化ui
	initUi()
	{
		this.ui.nodePlayer1Cards  = ctrl.nodePlayer1Cards;
		this.ui.nodePlayer2Cards  = ctrl.nodePlayer2Cards;
		this.ui.nodePlayer3Cards = ctrl.nodePlayer3Cards;
		this.ui.nodePlayer4Cards = ctrl.nodePlayer4Cards;
		this.ui.nodePlayer1head = ctrl.nodePlayer1head;
		this.ui.nodePlayer2head = ctrl.nodePlayer2head;
		this.ui.nodePlayer3head = ctrl.nodePlayer3head;
		this.ui.nodePlayer4head = ctrl.nodePlayer4head;
		this.ui.lbl_winTimes = ctrl.lbl_winTimes;
		this.ui.sprite_huType = ctrl.sprite_huType;
		this.ui.node_hutype = ctrl.node_hutype;
		this.ui.node_bg = ctrl.node_bg;
		this.ui.btn_share = ctrl.btn_share;
		this.ui.btn_again = ctrl.btn_again;
		this.ui.button_close =ctrl.button_close;
		if(FzmjLogic.getInstance().bViewMode){
			this.ui.button_close.active = true;
			this.ui.btn_again.active  = false;
		}
		this.ui.node_userList=[];
		this.ui.node_userList.push(ctrl.nodePlayer1Cards);
		this.ui.node_userList.push(ctrl.nodePlayer2Cards);
		this.ui.node_userList.push(ctrl.nodePlayer3Cards);
		this.ui.node_userList.push(ctrl.nodePlayer4Cards);
		this.ui.totalpanvalues.push(ctrl.nodePlayer1Cards.getChildByName("totalpan_value").getComponent(cc.Label));
		this.ui.totalpanvalues.push(ctrl.nodePlayer2Cards.getChildByName("totalpan_value").getComponent(cc.Label));
		this.ui.totalpanvalues.push(ctrl.nodePlayer3Cards.getChildByName("totalpan_value").getComponent(cc.Label));
		this.ui.totalpanvalues.push(ctrl.nodePlayer4Cards.getChildByName("totalpan_value").getComponent(cc.Label));
		this.ui.txtScores.push(ctrl.nodePlayer1Cards.getChildByName("txt_score").getComponent(cc.Label));
		this.ui.txtScores.push(ctrl.nodePlayer2Cards.getChildByName("txt_score").getComponent(cc.Label));
		this.ui.txtScores.push(ctrl.nodePlayer3Cards.getChildByName("txt_score").getComponent(cc.Label));
		this.ui.txtScores.push(ctrl.nodePlayer4Cards.getChildByName("txt_score").getComponent(cc.Label));
		this.ui.fanInfos.push(ctrl.nodePlayer1Cards.getChildByName("fanInfo").getComponent(cc.Label));
		this.ui.fanInfos.push(ctrl.nodePlayer2Cards.getChildByName("fanInfo").getComponent(cc.Label));
		this.ui.fanInfos.push(ctrl.nodePlayer3Cards.getChildByName("fanInfo").getComponent(cc.Label));
		this.ui.fanInfos.push(ctrl.nodePlayer4Cards.getChildByName("fanInfo").getComponent(cc.Label));
		this.ui.difans.push(ctrl.nodePlayer1head.getChildByName("difan").getComponent(cc.Label))
		this.ui.difans.push(ctrl.nodePlayer2head.getChildByName("difan").getComponent(cc.Label));
		this.ui.difans.push(ctrl.nodePlayer3head.getChildByName("difan").getComponent(cc.Label));
		this.ui.difans.push(ctrl.nodePlayer4head.getChildByName("difan").getComponent(cc.Label));
		this.ui.playerNames.push(ctrl.nodePlayer1head.getChildByName("txt_name").getComponent(cc.Label));
		this.ui.playerNames.push(ctrl.nodePlayer2head.getChildByName("txt_name").getComponent(cc.Label));
		this.ui.playerNames.push(ctrl.nodePlayer3head.getChildByName("txt_name").getComponent(cc.Label));
		this.ui.playerNames.push(ctrl.nodePlayer4head.getChildByName("txt_name").getComponent(cc.Label));
		this.ui.imgBanker = ctrl.imgBanker;
		this.ui.lbl_hide = ctrl.lbl_hide;
		this.ui.lbl_hide.node.active=false;
		this.ui.clippingNode = this.node.getChildByName("backgroudClickNode");
		this.ui.settletip = this.node.getChildByName("settletip");
		//整个节点点击控制--客户要去点击关闭窗口才可关闭
		this.ui.clippingNode.active=false;
		this.ui.settletip.active=false;
		this.ui.node_drawgame.active=this.model.b_drawGame;
		this.ui.img_liuju = this.ui.node_drawgame.getChildByName("img_liuju").getComponent(cc.Animation);
		if(this.model.b_drawGame){
			this.ui.img_liuju.play();
			ctrl.nodePlayer1Cards.active = false;
			ctrl.nodePlayer2Cards.active = false;
			ctrl.nodePlayer3Cards.active = false;
			ctrl.nodePlayer4Cards.active = false;
			ctrl.nodePlayer1head.active = false;
			ctrl.nodePlayer2head.active = false;
			ctrl.nodePlayer3head.active = false;
			ctrl.nodePlayer4head.active = false;
			ctrl.node_bg.active = false;
			ctrl.imgBanker.node.active = false;
			ctrl.node_hutype.active = false;
			return;
		}
		this.showUserInfo();
		this.showShareBtn()
	} 
	updateTipLabel(){
		// if(this.model.bViewAgain)
		// {
		// 	this.ui.lbl_hide.node.active=true;
		// 	this.ui.lbl_js.node.active=false;
		// }
	}
	showUserInfo()
	{ 			
		for (let logicseatid in this.model.playerSettleInfos) {

            let  uid = RoomMgr.getInstance().getUidBySeatId(logicseatid);
            let info=UserMgr.getInstance().getUserById(uid);
            if(!info)
            {
                info={id:uid,headid:1,nickname:""};
            }
            this.ui.playerNames[logicseatid].node.active = true;
            this.ui.playerNames[logicseatid].string = info.nickname;
			// 各种水的显示
			this.showfan(logicseatid);
			//显示手牌
			this.showHandCards(logicseatid);
			// 总计显示
			this.showTotalloseWin(parseInt(logicseatid));
		}
	}
	showfan(logicseatid)
	{
		let playerSettleInfo = this.model.playerSettleInfos[logicseatid.toString()];
		let shui = "";
		if(playerSettleInfo.zhuangflag) {
			let userNode = this.ui.node_userList[logicseatid];
			cc.loader.loadRes('Mahjong/Textures/settle/greenRect', cc.SpriteFrame, function (err, spriteFrame) {
			    if (err) {
			        cc.error(err.message || err);
			        return;
			    }
				if(cc.isValid(userNode) && userNode) {
					userNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
				}
			});
			let zhuangPos = this.ui.imgBanker.node.getPosition();
			this.ui.imgBanker.node.setPositionY(zhuangPos.y-130*(logicseatid));
			if(playerSettleInfo.winflag == 1 && playerSettleInfo.lianzhuang > 0) {
				shui = "连庄X" + playerSettleInfo.lianzhuang + " ";
			}
		}
		shui = shui + "花 "+playerSettleInfo.huafen+" 分"+"  杠 "+playerSettleInfo.gangfen+" 分"+"  金 "+playerSettleInfo.jinfen+" 分  ";
		if(MahjongDef.hutypenames[playerSettleInfo.specialhutype]){
			shui = shui + MahjongDef.hutypenames[playerSettleInfo.specialhutype] +" "+ playerSettleInfo.specialfen+" 分";
		}		
		this.ui.fanInfos[logicseatid].node.active = true;
		this.ui.fanInfos[logicseatid].string = shui;
		if (!this.ui.fanInfos[logicseatid].string) {
			this.ui.fanInfos[logicseatid].string = "无";
		}
		this.ui.difans[logicseatid].node.active = true;
		this.ui.difans[logicseatid].string = playerSettleInfo.difan+"底";
	}
	showTotalloseWin(logicseatid)
	{
		let playerSettleInfo = this.model.playerSettleInfos[logicseatid.toString()];
		let score = 0;
		this.ui.txtScores[logicseatid].node.active = true;
		//this.ui.totalpanvalues[logicseatid].node.active = true;
		if(playerSettleInfo.shuyingfenshu>0) {
			score = "+"+ playerSettleInfo.shuyingfenshu;
			this.ui.txtScores[logicseatid].node.color =Red;
		}
		else
		{
			score = playerSettleInfo.shuyingfenshu;
			this.ui.txtScores[logicseatid].node.color =Blue;
		}
		this.ui.txtScores[logicseatid].string = score;
		this.ui.totalpanvalues[logicseatid].string = playerSettleInfo.zongshui;
		if (playerSettleInfo.winflag == 1) {
		    this.ui.lbl_winTimes.string = "/"+playerSettleInfo.yingbeishu;
		    let self = this;
		    let hutime = playerSettleInfo.hutime;
			cc.loader.loadRes(`Mahjong/Textures/settle/hu${hutime}`, cc.SpriteFrame, function (err, spriteFrame) {
			    if (err) {
			        cc.error(err.message || err);
			        return;
			    }
				if(cc.isValid(self.ui.sprite_huType) && self.ui.sprite_huType) {
			    	self.ui.sprite_huType.spriteFrame = spriteFrame;
			    }
			});
		}
	}
	showShareBtn(){
		this.ui.btn_share.active = this.model.sharingSwitch == 1?true:false;
	}
	showHandCards(playeridx)
	{
		let playerSettleInfo = this.model.playerSettleInfos[playeridx.toString()];
		let nodeleap = 10;
		let nodeNum = 1;
		let cardList = null;
		cardList = this.ui.node_userList[playeridx].getChildByName("cardList");
		// 吃碰杠牌
		for (var j = 0; j < this.model.opcardarr[playeridx].length; j++) {
			// MahjongDef.op_angang=2;//暗杠
			// MahjongDef.op_gang=3;//杠
			// MahjongDef.op_peng=4;//碰
			// MahjongDef.op_chi=5;//吃
			// MahjongDef.op_bugang=7;//补牌 
			switch (this.model.opcardarr[playeridx][j]['op']) {
				case MahjongDef.op_angang:
					for (var k = 1; k <= 4; k++) {
						var cardNode = cardList.getChildByName("node"+nodeNum).getChildByName("card"+k);
						cardList.getChildByName("node"+nodeNum).getChildByName("angangNode").active = true;
						cardNode.active = true;
						var spriteFrame = MahjongResMgr.getInstance().getCardSpriteFrame(this.model.opcardarr[playeridx][j]['value']);
						cardNode.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = spriteFrame; 
						let isJoker=MahjongGeneral.isJoker(this.model.opcardarr[playeridx][j]['value']);
						cardNode.getChildByName('jin').active = isJoker;
						if(isJoker) {
			    			cardNode.color=new cc.Color(255,255,0);
			    		}else{
			   				cardNode.color=new cc.Color(255,255,255);
			   			}
					}
					nodeNum++;
					break;
				case MahjongDef.op_gang:
				case MahjongDef.op_bugang:
					for (var k = 1; k <= 4; k++) {
						var cardNode = cardList.getChildByName("node"+nodeNum).getChildByName("card"+k);
						cardNode.active = true;
						var spriteFrame = MahjongResMgr.getInstance().getCardSpriteFrame(this.model.opcardarr[playeridx][j]['value']);
						cardNode.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = spriteFrame; 
						let isJoker=MahjongGeneral.isJoker(this.model.opcardarr[playeridx][j]['value']);
						cardNode.getChildByName('jin').active = isJoker;
						if(isJoker) {
			    			cardNode.color=new cc.Color(255,255,0);
			    		}else{
			   				cardNode.color=new cc.Color(255,255,255);
			   			}
					}
					nodeNum++;
					break;
				case MahjongDef.op_peng:
					for (var k = 1; k <= 3; k++) {
						var cardNode = cardList.getChildByName("node"+nodeNum).getChildByName("card"+k);
						cardNode.active = true;
						var spriteFrame = MahjongResMgr.getInstance().getCardSpriteFrame(this.model.opcardarr[playeridx][j]['value']);
						cardNode.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = spriteFrame; 
						let isJoker=MahjongGeneral.isJoker(this.model.opcardarr[playeridx][j]['value']);
						cardNode.getChildByName('jin').active = isJoker;
						if(isJoker) {
			    			cardNode.color=new cc.Color(255,255,0);
			    		}else{
			   				cardNode.color=new cc.Color(255,255,255);
			   			}
					}
					nodeNum++;
					break;
				case MahjongDef.op_chi:
					for (var k = 1; k <= 3; k++) {
						var cardNode = cardList.getChildByName("node"+nodeNum).getChildByName("card"+k);
						cardNode.active = true;
						var spriteFrame = MahjongResMgr.getInstance().getCardSpriteFrame(this.model.opcardarr[playeridx][j]['value'][k-1]);
						cardNode.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = spriteFrame; 
						let isJoker=MahjongGeneral.isJoker(this.model.opcardarr[playeridx][j]['value'][k-1]);
						cardNode.getChildByName('jin').active = isJoker;
						if(isJoker) {
			    			cardNode.color=new cc.Color(255,255,0);
			    		}else{
			   				cardNode.color=new cc.Color(255,255,255);
			   			}
					}
					nodeNum++;
					break;
			}
		} 
		// 手牌	
		var k = 1;
		var HandCardLoop = 0;
		for (var j = 0; j < this.model.handcards[playeridx].length; j++) {
			if (j != 0 && j%3 == 0) {
				nodeNum++;
				HandCardLoop++;
				k = 1;
				var node = cardList.getChildByName("node"+nodeNum);
				node.setPosition(cc.v2(node.getPosition().x-nodeleap*HandCardLoop,node.getPosition().y));
			}
			if(nodeNum==6&&k==2) {
				cardList.getChildByName("node"+nodeNum).getChildByName("hucardFrame").active = true;
			}
			var cardNode = cardList.getChildByName("node"+nodeNum).getChildByName("card"+k);
			cardNode.active = true;
			var spriteFrame = MahjongResMgr.getInstance().getCardSpriteFrame(this.model.handcards[playeridx][j]);
			cardNode.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = spriteFrame;
			let isJoker=MahjongGeneral.isJoker(this.model.handcards[playeridx][j]);
			cardNode.getChildByName('jin').active = isJoker;
			if(isJoker) {
    			cardNode.color=new cc.Color(255,255,0);
    		}else{
   				cardNode.color=new cc.Color(255,255,255);
   			}
			k++;
		} 
	}
}
//c, 控制
@ccclass
export default class FzmjSettleCtrl extends BaseCtrl {
	
	//这边去声明ui组件
	@property({
		tooltip:"流局",
		type:cc.Node
	})
	node_drawgame:cc.Node = null
	@property({
		tooltip:"微信分享",
		type:cc.Node
	})
	btn_share:cc.Node = null
	@property({
		tooltip:"再来一局",
		type:cc.Node
	})
	btn_again:cc.Node = null
	@property({
		tooltip:"结算提示",
		type:cc.Label
	})
	lbl_js:cc.Label = null

	
	@property({
		tooltip:"隐藏结算",
		type:cc.Label
	})
	lbl_hide:cc.Label = null
	@property({
		tooltip : "玩家牌数据1",
		type : cc.Node
	})
	nodePlayer1Cards : cc.Node = null;
	@property({
		tooltip : "玩家牌数据2",
		type : cc.Node
	})
	nodePlayer2Cards : cc.Node = null;
	@property({
		tooltip : "玩家牌数据3",
		type : cc.Node
	})
	nodePlayer3Cards : cc.Node = null;
	@property({
		tooltip : "玩家牌数据4",
		type : cc.Node
	})
	nodePlayer4Cards : cc.Node = null;
	@property({
		tooltip : "玩家头像1",
		type : cc.Node
	})
	nodePlayer1head : cc.Node = null;
	@property({
		tooltip : "玩家头像2",
		type : cc.Node
	})
	nodePlayer2head : cc.Node = null;
	@property({
		tooltip : "玩家头像3",
		type : cc.Node
	})
	nodePlayer3head : cc.Node = null;
	@property({
		tooltip : "玩家头像4",
		type : cc.Node
	})
	nodePlayer4head : cc.Node = null;
	@property({
		tooltip : "庄家图片",
		type : cc.Sprite
	})
	imgBanker : cc.Sprite = null;
	@property({
		tooltip : "胡牌类型",
		type : cc.Sprite
	})
	sprite_huType : cc.Sprite = null;
	@property({
		tooltip : "胡牌倍数",
		type : cc.Label
	})
	lbl_winTimes : cc.Label = null;
	@property({
		tooltip : "背景",
		type : cc.Node
	})
	node_bg : cc.Node = null;
	@property({
		tooltip : "胡节点",
		type : cc.Node
	})
	node_hutype : cc.Node = null;
	@property({
		tooltip:"关闭按钮",
		type:cc.Node
	})
	button_close : cc.Node = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离

	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this; 
		//数据模型
		this.initMvc(Model,View);
        // if(!this.model.b_drawGame)
		// {
		// 	this.model.initData();
		// 	this.view.showUserInfo();
		// }  
	}

	//定义网络事件
	defineNetEvents()
	{
		this.n_events={
			//网络消息监听列表  
			onProcess:this.onProcess,
			onSyncData:this.onSyncData,
        } 	
	}
	//定义全局事件
	defineGlobalEvents()
	{
		//全局消息
		this.g_events={ 
			'usersUpdated':this.usersUpdated,   
			'http.reqGameSwitch':this.http_reqGameSwitch,
		}
	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image, this.btn_share, this.btn_share_cb,'微信分享' );
		this.connect(G_UiType.image, this.btn_again, this.btn_again_cb, '再来一局'); 
		this.connect(G_UiType.image, this.ui.clippingNode,this.btn_again_cb,'再来一局');
		this.connect(G_UiType.button, this.ui.button_close, this.finish, `关闭福州麻将每局结算`);
	}
	onSyncData(){
		this.finish();
	}
	start () {
	}
	//网络事件回调begin
	usersUpdated(){
		this.finish();
	}
	setAsViewAgain(){
		this.model.setAsViewAgain();
		this.view.updateTipLabel();
	}
	http_reqGameSwitch(msg){
		this.model.updateSwitch(msg);
		this.view.showShareBtn();
	}
	onProcess(msg)
	{
		if (msg.process==MahjongDef.process_ready){ 
			this.process_ready(); 
		} 
	}
    process_ready(){
    	this.finish();
    }
	//end
	//全局事件回调begin
	//end
	btn_share_cb(){
		//console.log('btn_share_cb',ShareMgr.getInstance().shareButtonFlag)
		ShareMgr.getInstance().shareButtonFlag=false;
        this.start_sub_module(G_MODULE.Shared);
	}
	btn_again_cb(){
		//是否是查看上局战绩进来的
		if(this.model.bViewAgain){
			this.finish()
		}
		else
		{
			if(RoomMgr.getInstance().isBunchFinish())
			{
				//表示一把结束了
				RoomMgr.getInstance().showFinalSettle(); 
				this.finish();
			}
			else
			{
				RoomMgr.getInstance().nextRound();
			}
		}
	}
	//end
}
