/*
author: JACKY
日期:2018-01-22 17:10:38
*/
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseModel from "../../../Plat/Libs/BaseModel";
import ModuleMgr from "../../../Plat/GameMgrs/ModuleMgr";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import QgmjLogic from "../QgmjMgr/QgmjLogic"; 
import {g_deepClone} from "../../../Plat/Libs/Gfun";
 
import SwitchMgr from "../../../Plat/GameMgrs/SwitchMgr"; 
import { MahjongDef } from "../../../GameCommon/Mahjong/MahjongDef";
 
 

let Green = new cc.Color(24,221,40),Red = new cc.Color(255,78,0), Yellow = new cc.Color(255,222,0);
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : QgmjSettleCtrl;
//模型，数据处理
class Model extends BaseModel{
	playerSettleInfos=null;
	win_seatid=0;
	seatcount=0;
	b_drawGame=false
	sharingSwitch=null//每局结算分享开关
	bViewAgain=false; 
	mahjongDef=RoomMgr.getInstance().getDef(); 
	constructor()
	{
		super();
		this.initData();
		this.sharingSwitch = SwitchMgr.getInstance().get_switch_settlement_sharing();
	}
	initData()
	{
		let qzmjLogicInstance = QgmjLogic.getInstance();
		if(qzmjLogicInstance != null)
		{
			this.win_seatid=qzmjLogicInstance.win_seatid;
			if(this.win_seatid==null)
			{
				this.b_drawGame=true;
			}
			this.playerSettleInfos=qzmjLogicInstance.roundSettle.wanjiashuis;
			//console.log("玩家信息：",this.playerSettleInfos);
			this.seatcount = qzmjLogicInstance.seatcount;
		}
	}
	setAsViewAgain(){
		this.bViewAgain=true;
	}
	updateSwitch(msg){
		this.sharingSwitch = msg.cfg.switch_settlement_sharing;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		node_drawgame:ctrl.node_drawgame,
		img_liuju:null,
		btn_gameInfo:null,
		btn_share:null,
		btn_again:null,
		node_score:null,
		btn_close:null,
		btn_exit:null,
		node_userList:null,
		//赢家
		winNodes:[],		
		win_bg:null,
		win_totalInfo:[],
		win_totalShui:[],
		win_detailShui:[],
		win_genzhuang:[],
		win_hutime:[],
		//输家
		loseNodes:[],
		lose_bg:null,
		lose_totalInfo:[],
		lose_forEachOtherShui:[],
		lose_detailShui:[],
		lose_totalShui:[],
		lose_genzhuang:[],
		//作弊检测
		node_CheatPrevetion:null,
		sprite_zjs:null,
		clippingNode:null,
		lbl_js:null,
		lbl_zjs:null,
		lbl_hide:null,
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
		this.ui.lbl_hide = ctrl.lbl_hide;
		this.ui.lbl_hide.node.active=false;
		this.ui.clippingNode = this.node.getChildByName("backgroudClickNode");
		this.ui.node_drawgame.active=this.model.b_drawGame;
		this.ui.img_liuju = this.ui.node_drawgame.getChildByName("img_liuju").getComponent(cc.Animation);
		if(this.model.b_drawGame){
			this.ui.img_liuju.play();
		}
		this.ui.btn_gameInfo = ctrl.btn_gameInfo;
		this.ui.btn_share = ctrl.btn_share;
		this.ui.btn_again = ctrl.btn_again;
		this.ui.node_score = ctrl.node_score;
		this.ui.btn_close = ctrl.btn_close;
		this.ui.btn_exit = ctrl.btn_exit;
		this.ui.sprite_zjs = ctrl.sprite_zjs;
		this.ui.sprite_zjs.node.active = false;
		this.ui.lbl_zjs = ctrl.lbl_zjs;
		this.ui.lbl_js = ctrl.lbl_js;
		this.ui.lbl_zjs.node.active = false;
		this.ui.lbl_js.node.active = true;
		if(RoomMgr.getInstance().isBunchFinish()) {
			this.ui.sprite_zjs.node.active = true;
			this.ui.lbl_zjs.node.active = true;
			this.ui.lbl_js.node.active = false;
		}
		this.ui.node_userList=[];
		this.ui.node_userList.push(ctrl.node_user_0);
		this.ui.node_userList.push(ctrl.node_user_1);
		this.ui.node_userList.push(ctrl.node_user_2);
		this.ui.node_userList.push(ctrl.node_user_3);
		ctrl.node_user_0.active = false;
		ctrl.node_user_1.active = false;
		ctrl.node_user_2.active = false;
		ctrl.node_user_3.active = false;
        if(this.model.b_drawGame)
		{
			return;
		}
		for (let logicseatid = 0; logicseatid < this.model.seatcount; ++logicseatid) {
			let viewSeatId = RoomMgr.getInstance().getViewSeatId(logicseatid);
			let node_user=this.ui.node_userList[viewSeatId];
			node_user.active = true;
			let winNode = node_user.getChildByName("win");
			let loseNode = node_user.getChildByName("lose");
			this.ui.winNodes[viewSeatId] = winNode;
			this.ui.loseNodes[viewSeatId] = loseNode;
			this.ui.win_totalInfo[viewSeatId] = winNode.getChildByName("totalInfo").getComponent(cc.Label);
			this.ui.win_totalShui[viewSeatId] = winNode.getChildByName("totalShui").getComponent(cc.Label);
			this.ui.win_detailShui[viewSeatId] = winNode.getChildByName("detailShui").getComponent(cc.Label);			
			this.ui.win_genzhuang[viewSeatId] = winNode.getChildByName("genzhuang").getComponent(cc.Label);
			this.ui.win_hutime[viewSeatId] = winNode.getChildByName("hutime").getChildByName("img_hutime").getComponent(cc.Sprite);
			this.ui.lose_totalInfo[viewSeatId] = loseNode.getChildByName("totalInfo").getComponent(cc.Label);
			this.ui.lose_forEachOtherShui[viewSeatId] = loseNode.getChildByName("forEachOtherShui").getComponent(cc.Label);
			this.ui.lose_detailShui[viewSeatId] = loseNode.getChildByName("detailShui").getComponent(cc.Label);
			this.ui.lose_totalShui[viewSeatId] = loseNode.getChildByName("totalShui").getComponent(cc.Label);
			this.ui.lose_genzhuang[viewSeatId] = loseNode.getChildByName("genzhuang").getComponent(cc.Label);
		}
		this.showUserInfo();
		this.showShareBtn()
	} 
	updateTipLabel(){
		if(this.model.bViewAgain)
		{
			this.ui.lbl_hide.node.active=true;
			this.ui.lbl_js.node.active=false;
			this.ui.lbl_zjs.node.active=false;
		}
	}
	showUserInfo()
	{ 			
		for (let logicseatid = 0; logicseatid < this.model.seatcount; ++logicseatid) {
			// 根据logicseatid来获取对应数据logicId
			let viewSeatId = RoomMgr.getInstance().getViewSeatId(logicseatid);
			let winflag=false;
			if (logicseatid == this.model.win_seatid) {
				this.ui.winNodes[viewSeatId].active = true;
				this.ui.loseNodes[viewSeatId].active = false;
				winflag=true;
			}else{
				this.ui.winNodes[viewSeatId].active = false;
				this.ui.loseNodes[viewSeatId].active = true;
				winflag=false;
			}
			// 各种水的显示
			this.showfan(viewSeatId,logicseatid);
			// 总计显示
			this.showTotalloseWin(viewSeatId,logicseatid);
		}
	}
	showfan(viewid,logicseatid)
	{
		let playerSettleInfo = this.model.playerSettleInfos[logicseatid.toString()];
		let shui = "";
		let winOrLoseNode = null;
		if (playerSettleInfo.winflag == 1) {
			winOrLoseNode = this.ui.win_detailShui[viewid];
		}
		else{
			winOrLoseNode = this.ui.lose_detailShui[viewid];
		}
		for (let fanIdx=0; fanIdx<playerSettleInfo.xijieshui.length; fanIdx++) {
			winOrLoseNode.node.active = true;
			shui = shui + MahjongDef.gangkenames[playerSettleInfo.xijieshui[fanIdx][0]] +"("+ playerSettleInfo.xijieshui[fanIdx][2] + "),";
		}
		winOrLoseNode.string = shui.substring(0,shui.length - 1);
		if (!winOrLoseNode.string) {
			winOrLoseNode.string = "无";
		}
	}
	showTotalloseWin(viewid,logicseatid)
	{
		let playerSettleInfo = this.model.playerSettleInfos[logicseatid.toString()];
		let hutime = "";
		let yingzhuangjia = "";
		let yingxianjia = "";
		let shuyingfenshu = "";
		let yingbeishu = "";
		let difen = "";
		let lianzhuang = "";
		let yingjiapaifen = "";
		let shuyingjiafen = "";
		let paifen = "";
		if (playerSettleInfo.winflag == 1) {
			//赢家信息
			this.ui.win_hutime[viewid].string = playerSettleInfo.hutime;
	        cc.loader.loadRes(`Mahjong/Textures/JieSuan/img_hutime_${this.ui.win_hutime[viewid].string}`, cc.SpriteFrame, (err, sprite)=>{
	            if (err) return cc.error(`no find GameCommon/Mahjong/Textures/JieSuan/img_hutime_${this.ui.win_hutime[viewid].string}`);
				this.ui.win_hutime[viewid].spriteFrame = sprite;
	        });
			//赢庄家小于等于0时隐藏赢庄家
			yingzhuangjia = playerSettleInfo.yingzhuangjia <= 0?"":"赢庄家" + "(" + playerSettleInfo.yingzhuangjia + ")";	
			//赢各闲家水
			let index = 0;
			for (let fanIdx=0; fanIdx<playerSettleInfo.yingxianjia.length; fanIdx++) {
				index += playerSettleInfo.yingxianjia[fanIdx];
			}
			//赢闲家小于等于0时隐藏赢闲家
			yingxianjia = playerSettleInfo.yingxianjia <= 0?"":"赢闲家" + "(" + Math.abs(index) + ")";
			this.ui.win_totalInfo[viewid].string = yingzhuangjia&&yingxianjia?yingzhuangjia+ "+" +yingxianjia:yingzhuangjia+yingxianjia;
			//总水
			this.ui.win_totalShui[viewid].string = playerSettleInfo.shuyingfenshu+"水";
			//跟庄		
			this.ui.win_genzhuang[viewid].string = "跟庄:" + playerSettleInfo.gengzhuang+"水";
			this.ui.win_genzhuang[viewid].node.active = true;
			if(playerSettleInfo.gengzhuang==0) {
				this.ui.win_genzhuang[viewid].node.active = false;
			}
		}
		else{
			//输家信息
			difen = "-[底" + (playerSettleInfo.zhuangflag == 0?playerSettleInfo.difan:playerSettleInfo.difan/Math.pow(2,playerSettleInfo.lianzhuang+1));
			if(playerSettleInfo.lianzhuang == 0){
				lianzhuang = "×庄家2";
			}else if(playerSettleInfo.lianzhuang > 0){
				lianzhuang = "×连庄" + Math.pow(2,playerSettleInfo.lianzhuang+1);
			}
			if(!playerSettleInfo.zhuangflag && this.model.win_seatid != QgmjLogic.getInstance().zhuangseat)
			{
				lianzhuang="";
			}
			
			yingjiapaifen = "+赢家牌分"+Math.abs(playerSettleInfo.zongshui)+"]";
			hutime = "×"+MahjongDef.hutimenames[playerSettleInfo.hutime];
			yingbeishu = playerSettleInfo.yingbeishu;	
			shuyingjiafen = "="+playerSettleInfo.shujiashuyingjiafen;
			this.ui.lose_totalInfo[viewid].string = difen + lianzhuang + yingjiapaifen + hutime + yingbeishu + shuyingjiafen;
			//总水
			this.ui.lose_totalShui[viewid].string = playerSettleInfo.shuyingfenshu+"水";
			//跟庄
			this.ui.lose_genzhuang[viewid].string = "跟庄:" + playerSettleInfo.gengzhuang+"水";
			if(playerSettleInfo.gengzhuang==0) {
				this.ui.lose_genzhuang[viewid].node.active = false;
			}
			//牌分
			let index = 0;
			for (let fanIdx=0; fanIdx<playerSettleInfo.xijieshui.length; fanIdx++) {	
				index += playerSettleInfo.xijieshui[fanIdx][2];			
			}			
			//相互算水
			this.ui.lose_forEachOtherShui[viewid].string = "牌分"+"("+index+"),"+"输家互算："+playerSettleInfo.xianghusuanshui;
		}
	}
	showShareBtn(){
		this.ui.btn_share.active = this.model.sharingSwitch == 1?true:false;
	}
}
//c, 控制
@ccclass
export default class QgmjSettleCtrl extends BaseCtrl {
	
	//这边去声明ui组件
	@property({
		tooltip:"流局",
		type:cc.Node
	})
	node_drawgame:cc.Node = null
	@property({
		tooltip:"详细结算信息",
		type:cc.Node
	})
	btn_gameInfo:cc.Node = null	
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
		tooltip:"分数",
		type:cc.Node
	})
	node_score:cc.Node = null
	@property({
		tooltip:"关闭",
		type:cc.Node
	})
	btn_close:cc.Node = null
	@property({
		tooltip:"退出",
		type:cc.Node
	})
	btn_exit:cc.Node = null
	//玩家节点
	@property({
		tooltip:"玩家0",
		type:cc.Node
	})
	node_user_0:cc.Node = null
	@property({
		tooltip:"玩家1",
		type:cc.Node
	})
	node_user_1:cc.Node = null
	@property({
		tooltip:"玩家2",
		type:cc.Node
	})
	node_user_2:cc.Node = null
	@property({
		tooltip:"玩家3",
		type:cc.Node
	})
	node_user_3:cc.Node = null
	@property({
		tooltip:"总结算图片",
		type:cc.Sprite
	})
	sprite_zjs:cc.Sprite = null
	@property({
		tooltip:"总结算提示",
		type:cc.Label
	})
	lbl_zjs:cc.Label = null
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
		this.connect(G_UiType.image, this.btn_gameInfo, this.btn_gameInfo_cb,'详细结算信息');
		this.connect(G_UiType.image, this.btn_share, this.btn_share_cb,'微信分享' );
		this.connect(G_UiType.image, this.btn_again, this.btn_again_cb, '再来一局'); 
		this.connect(G_UiType.image, this.btn_exit, this.btn_exit_cb, '退出');
		this.connect(G_UiType.image, this.ui.clippingNode,this.btn_again_cb,'再来一局');
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
	//按钮或任何控件操作的回调begin
	btn_gameInfo_cb(){
		//console.log("btn_gameInfo_cb");
 
	}
	btn_share_cb(){
        //console.log('btn_share_cb')
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
	btn_exit_cb(){
		//退出房间
	}
	//end
}
