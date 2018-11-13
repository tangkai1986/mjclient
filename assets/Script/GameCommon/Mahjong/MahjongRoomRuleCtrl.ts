import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import BaseView from "../../Plat/Libs/BaseView";
import BaseModel from "../../Plat/Libs/BaseModel";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";  
import BetMgr from "../../Plat/GameMgrs/BetMgr";
import { MahjongDef } from "./MahjongDef";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : MahjongRoomRuleCtrl;
//模型，数据处理
class Model extends BaseModel{
	roominfo=null;
	roomvalue=null;
	roundIndex=null;
	constructor()
	{
		super();
		this.roominfo=RoomMgr.getInstance().roominfo;		
		this.roundIndex=RoomMgr.getInstance().getRoundIndex();
		if(this.roominfo.roomtype==2||this.roominfo.roomtype==3)
		{
			this.roomvalue=RoomMgr.getInstance().getFangKaCfg();
		}
	}
	updateRoundInfo() {
		this.roundIndex = RoomMgr.getInstance().getRoundIndex();
	}
	clear(  )
	{ 
	}  
	recover(  )
	{
		// body
		this.clear(); 
	} 
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//房间规则
		panel_rule:null,
		lbl_title:null,
		lbl_rule:null,
		//第几局
		panel_round:null,
		lbl_di:null,				
		// lbl_roundindex:null,		
		// lbl_curRound:null,	
		// lbl_fengefu:null,	
		// lbl_totalRounds:null,		
		//房间号
		panel_roomid:null,		
		lbl_roomID:null,		
		//准备前高亮字体
		panel_gl:null,
		lbl_gl_title:null,
		lbl_gl_rule:null,
		lbl_gl_roomID:null,	
		lbl_gl_di:null,
		lbl_gl_roundindex:null,
		lbl_gl_roomName:null,
		// lbl_gl_fengefu:null,
		// lbl_gl_curRound:null,
		// lbl_gl_totalRounds:null,		
	}; 

	//private node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node; 
		this.initUi(); 	
	}
	//初始化ui
	initUi()
	{
		//房间规则
		this.ui.panel_rule=ctrl.panel_rule;
		this.ui.lbl_title=ctrl.panel_rule.getChildByName("lbl_title").getComponent(cc.Label);
		this.ui.lbl_rule=ctrl.panel_rule.getChildByName("lbl_rule").getComponent(cc.Label);
		//第几局
		this.ui.panel_round=ctrl.panel_round;
		this.ui.lbl_di=ctrl.panel_round.getChildByName("lbl_di").getComponent(cc.Label);
		// this.ui.lbl_roundindex=ctrl.panel_round.getChildByName("lbl_roundindex").getComponent(cc.Label);		
		// this.ui.lbl_fengefu=ctrl.panel_round.getChildByName("lbl_fengefu").getComponent(cc.Label);
		// this.ui.lbl_curRound=ctrl.panel_round.getChildByName("lbl_curRound").getComponent(cc.Label);
		// this.ui.lbl_totalRounds=ctrl.panel_round.getChildByName("lbl_totalRounds").getComponent(cc.Label);
		//房间号
		this.ui.panel_roomid=ctrl.panel_roomid;
		this.ui.lbl_roomID=ctrl.panel_roomid.getChildByName("lbl_roomID").getComponent(cc.Label);
		//准备前高亮字体
		this.ui.panel_gl=ctrl.panel_gl;
		this.ui.lbl_gl_title=ctrl.panel_gl.getChildByName("lbl_gl_title").getComponent(cc.Label);
		this.ui.lbl_gl_rule=ctrl.panel_gl.getChildByName("lbl_gl_rule").getComponent(cc.Label);
		this.ui.lbl_gl_roomID=ctrl.panel_gl.getChildByName("lbl_gl_roomID").getComponent(cc.Label);
		this.ui.lbl_gl_di=ctrl.panel_gl.getChildByName("lbl_gl_di").getComponent(cc.Label);
		this.ui.lbl_gl_roundindex=ctrl.panel_gl.getChildByName("lbl_gl_roundindex").getComponent(cc.Label);
		this.ui.lbl_gl_roomName=ctrl.panel_gl.getChildByName("lbl_gl_roomName").getComponent(cc.Label);
		// this.ui.lbl_gl_fengefu=ctrl.panel_gl.getChildByName("lbl_gl_fengefu").getComponent(cc.Label);
		// this.ui.lbl_gl_curRound=ctrl.panel_gl.getChildByName("lbl_gl_curRound").getComponent(cc.Label);
		// this.ui.lbl_gl_totalRounds=ctrl.panel_gl.getChildByName("lbl_gl_totalRounds").getComponent(cc.Label);
		this.clear();
		this.initRoundInfo();
		this.initRoomId();	
	}
    //初始化局数信息
	initRoundInfo(){ 
		//初始化牌权  
		this.updateRoundInfo(); 
		switch(this.model.roominfo.roomtype)
		{
			case 1:
				this.ui.panel_round.active=false;
				this.ui.panel_rule.active=false;
			break;
			case 2:
			case 3:
				{
					this.ui.panel_round.active=true; 
					this.ui.panel_rule.active=true;
					if(this.model.roomvalue.b_yike>0)
					{
						//在一课的情况下
						// this.ui.lbl_fengefu.node.active=false;
						// this.ui.lbl_gl_fengefu.node.active=false;					
						// this.ui.lbl_curRound.node.active=false;
						// this.ui.lbl_gl_curRound.node.active=false;
						// this.ui.lbl_totalRounds.node.active=false;
						// this.ui.lbl_gl_totalRounds.node.active=false;						
						// this.ui.lbl_roundindex.node.active=true;
						// this.ui.lbl_gl_roundindex.node.active=true;
					}  
					else{
						//非一课的情况下
						// this.ui.lbl_di.node.active=false;
						// this.ui.lbl_gl_di.node.active=false;
						// this.ui.lbl_roundindex.node.active=false;
						// this.ui.lbl_gl_roundindex.node.active=false;
					}
				}
			break;
		} 
	}
	updateRoundInfo(){
		let gameName = BetMgr.getInstance().getGameName();
		let gameid =  BetMgr.getInstance().getGameId();
		//console.log("gameid",gameid);		
		if(!this.model.roomvalue) {
			return;
		}
		if(this.model.roomvalue.b_yike > 0){
			this.ui.lbl_title.string=`${gameName}-`+"一课";
			this.ui.lbl_gl_title.string=`${gameName}-`+"一课";
		}else{
			this.ui.lbl_title.string=`${gameName}-`+this.model.roomvalue.v_roundcount+'局';
			this.ui.lbl_gl_title.string=`${gameName}-`+this.model.roomvalue.v_roundcount+'局';
		}
		if(gameid == 1){
			//泉州麻将
			let index = "游金"+this.model.roomvalue.t_youjin+"倍"+"  底分"+this.model.roomvalue.v_difen+"水";
			this.ui.lbl_rule.string=this.model.roomvalue.v_youjintype == 1?"明游  "+index:"暗游  "+index;
			this.ui.lbl_gl_rule.string=this.model.roomvalue.v_youjintype == 1?"明游  "+index:"暗游  "+index;
		}
		else if(gameid == 5){
			let fanghu = "";
			if(this.model.roomvalue.v_fangfu == 0){
				fanghu="放胡双倍单赔  ";
			}else if(this.model.roomvalue.v_fangfu == 1){
				fanghu="放胡单赔  ";
			}else if(this.model.roomvalue.v_fangfu == 2){
				fanghu="放胡全赔  ";
			}
			this.ui.lbl_rule.string=fanghu+(this.model.roomvalue.b_qinghunyise == 1?"清混一色  ":"")+(this.model.roomvalue.b_daihuapai == 1?"带花牌  ":"")+(this.model.roomvalue.b_jinlong == 1?"金龙  ":"");			
			this.ui.lbl_gl_rule.string=fanghu+(this.model.roomvalue.b_qinghunyise == 1?"清混一色  ":"")+(this.model.roomvalue.b_daihuapai == 1?"带花牌  ":"")+(this.model.roomvalue.b_jinlong == 1?"金龙  ":"");
		}
		else if(gameid == 6){
			//龙岩麻将			
			this.ui.lbl_rule.string=(this.model.roomvalue.b_quanzimo == 0?"半自摸玩法  ":"全自摸玩法  ")+(this.model.roomvalue.t_zhuangfanbei == 2?"庄家翻倍  ":"庄家不翻倍  ")+"游金"+this.model.roomvalue.t_youjin+"倍";
			this.ui.lbl_gl_rule.string=(this.model.roomvalue.b_quanzimo == 0?"半自摸玩法  ":"全自摸玩法  ")+(this.model.roomvalue.t_zhuangfanbei == 2?"庄家翻倍  ":"庄家不翻倍  ")+"游金"+this.model.roomvalue.t_youjin+"倍";
		}
		// this.ui.lbl_roundindex.string=this.model.roundIndex;
		this.ui.lbl_gl_roundindex.string=this.model.roundIndex+1;
		// this.ui.lbl_curRound.string=this.model.roundIndex;
		// this.ui.lbl_gl_curRound.string=this.model.roundIndex;
		// this.ui.lbl_totalRounds.string=this.model.roomvalue.v_roundcount;
		// this.ui.lbl_gl_totalRounds.string=this.model.roomvalue.v_roundcount; 
	}
	initRoomId(){ 
		switch(this.model.roominfo.roomtype)
		{
			case 1:
				{ 
					this.ui.panel_roomid.active=false; 
				}
			break;
			case 2:
			case 3:
				{
					//console.log("调用了这里i",this.model.roominfo.roomtype)
					this.ui.panel_roomid.active=true;					
					this.ui.lbl_roomID.string= `${this.model.roominfo.password}`;
					this.ui.lbl_gl_roomID.string= `${this.model.roominfo.password}`;	
				}
			break;
		} 
	}
	recover(  ){
		// body
		this.clear();
		// this.updateJin();
	}
 
	//清除
	clear()
	{
		// body 
	} 
}
//c, 控制
@ccclass
export default class MahjongRoomRuleCtrl extends BaseCtrl { 

	@property({
		tooltip:"房间规则",
		type:cc.Node
	})
	panel_rule:cc.Node=null
	@property({
		tooltip:"房间号",
		type:cc.Node
	})
	panel_roomid:cc.Node=null
	@property({
		tooltip:"第几局",
		type:cc.Node
	})
	panel_round:cc.Node=null
	@property({
		tooltip:"准备前高亮数字",
		type:cc.Node
	})
	panel_gl:cc.Node=null

	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;  
		this.initMvc(Model,View); 
	}
	start () {     
	}
	onDestroy(){
		super.onDestroy(); 
	}
	//定义网络事件
	defineNetEvents()
	{
        this.n_events={
			'onStartGame':this.onStartGame,			               
			onSyncData:this.onSyncData,
            'connector.entryHandler.enterRoom':this.connector_entryHandler_enterRoom,
            'room.roomHandler.nextRound':this.room_roomHandler_nextRound,
            'onGameFinished':this.onGameFinished,  
		}	
	} 
	
	//定义全局事件
	defineGlobalEvents()
	{
		this.g_events={
		} 
	}
	//绑定操作的回调
	connectUi()
	{  
	}
	room_roomHandler_nextRound(){
		//再来一局
		this.model.clear();
		this.view.clear(); 
		this.view.initRoundInfo();
	}
	connector_entryHandler_enterRoom(){
		//每次恢复游戏都是重进房间
		this.model.clear();
		this.view.clear(); 
		this.view.initRoundInfo(); 
	}
	onStartGame(){
		this.view.ui.panel_gl.active=true;
		this.ui.lbl_gl_title.node.active = false;
		this.ui.lbl_gl_rule.node.active = false;
		this.ui.lbl_gl_roomID.node.active = false;
		this.ui.lbl_gl_roomName.node.active = false;
		this.model.updateRoundInfo();
		this.view.updateRoundInfo(); 
	}
	onGameFinished(){
		this.model.updateRoundInfo();
		this.view.updateRoundInfo(); 
	}
	onSyncData(){
		if(RoomMgr.getInstance().isGameStarted()){
			this.view.ui.panel_gl.active=true;
			this.ui.lbl_gl_title.node.active = false;
			this.ui.lbl_gl_rule.node.active = false;
			this.ui.lbl_gl_roomID.node.active = false;
			this.ui.lbl_gl_roomName.node.active = false;
			this.model.updateRoundInfo();
			this.view.updateRoundInfo(); 
		}		
	}
}
