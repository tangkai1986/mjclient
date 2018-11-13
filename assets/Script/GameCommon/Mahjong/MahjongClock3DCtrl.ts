/*
author: JACKY
日期:2018-01-12 16:15:11
*/      
  
import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import BaseView from "../../Plat/Libs/BaseView";
import BaseModel from "../../Plat/Libs/BaseModel";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";  
import { MahjongDef } from "./MahjongDef";
 

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : MahjongClock3DCtrl;
//模型，数据处理
class Model extends BaseModel{
	step=null;
	state=null;
	starttime=null;
	curtime=null;
	curseat=null;
	dirid=null; 
	mySeatId = null;
	mahjongResMgr=RoomMgr.getInstance().getResMgr();
	mahjongLogic=RoomMgr.getInstance().getLogic();
	mahjongDef=RoomMgr.getInstance().getDef();
	mahjongAudio=RoomMgr.getInstance().getAudio();
	dirs=null;
	constructor()
	{
		super();
		this.dirs=[]
		let seatcount=RoomMgr.getInstance().getSeatCount();
		let viewSeatCount=4;
		if(seatcount<=viewSeatCount/2)
        {
            for(let index=0;index<viewSeatCount;++index)
            {
                if(index%2==0)
                {
                    this.dirs.push(index);
                }
            }
        }
        else{
            for(let index=0;index<viewSeatCount;++index)
            {
                this.dirs.push(index);
            }
        }
		this.step=0;
		this.state=0;
		this.starttime=0; 
		this.curtime=0;
	}
    setState(state){
		this.state=state;
		this.step=0; 
	}
 
	resetTime(  ){
		// body
		this.starttime=Date.now();
		this.curtime=this.mahjongLogic.getInstance().maxoptime;
	} 
	recover(  ){
		// body
		this.updateSeatId();
	} 
	updateSeatId(){
		//directionbgIdx
		this.mySeatId = RoomMgr.getInstance().getMySeatId();
		////console.log("updateSeatIdthis.mySeatId=",this.mySeatId)
		this.curseat=this.mahjongLogic.getInstance().curseat;
		////console.log("updateSeatIdthis.curseat=",this.curseat)
		//directionIdx
		this.dirid =  RoomMgr.getInstance().getViewSeatId(this.curseat);
		////console.log("updateSeatIdthis.dirid=",this.dirid)
		if (this.dirid < 0 ){ 
			this.dirid=this.dirid+4;
		}
	} 
	runTo( steps ){
		this.step=this.step+1;
		if(this.step>=steps){ 
			return false;
		}
		return true;
	} 
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={ 
		sprite_gamedirection:null
	};
    tiparr=null;
	lbl_time=null;
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
		this.lbl_time=ctrl.lbl_time;
		this.tiparr=[ctrl.tip_0,ctrl.tip_1,ctrl.tip_2,ctrl.tip_3]
		this.node.active = false;
		this.ui.sprite_gamedirection = this.node.getChildByName('directionBg').getChildByName('game_direction').getComponent(cc.Sprite);
	} 
	tick(){	 
        this.lbl_time.active=true;
        this.lbl_time.color = this.model.curtime<=3?cc.Color.RED:cc.Color.WHITE;
		this.lbl_time.getComponent(cc.Label).string=this.model.curtime;  
        let opseatid = this.model.mahjongLogic.getInstance().curseat; 
	}  
	clear(  ){ 
		for (let i=0;i<this.tiparr.length;++i)
		{
			var sp=this.tiparr[i];
			sp.active=false;
		}  
		this.hideTime(); 
	}  
	//更新方向
	updateDir(  ){

	}
	initDirectionBg()
	{
		let realid=this.model.dirs[this.model.mySeatId];
		let self = this;
		self.ui.sprite_gamedirection.spriteFrame = this.model.mahjongResMgr.getInstance().getSpriteFrame(`game_direction_${realid}`);
		////console.log("realid",realid,this.model.mahjongResMgr.getInstance().getSpriteFrame(`game_direction_${realid}`));
		self.node.active = true;
		// this.ui.sprite_gamedirection.node.parent.parent.active = false;
	}
	showDirection()
	{
		this.node.active = true;
	}
	dirChange(){
		for (let i=0;i<this.tiparr.length;++i)
		{
			var sp=this.tiparr[i];
			sp.active=false;
		}
		let realid=this.model.dirs[this.model.mySeatId];
		////console.log("this.model.dirid=",this.model.dirid)
		let frame = this.model.mahjongResMgr.getInstance().getSpriteFrame(`game_direction_${realid}_${this.model.dirid}`);
		this.tiparr[this.model.dirid].getComponent(cc.Sprite).spriteFrame = frame;
		this.tiparr[this.model.dirid].active=true;
	}
	hideTime()
	{
		this.lbl_time.active=false; 
	}
	setNum(index,num)
	{

	}
}
//c, 控制
@ccclass
export default class MahjongClock3DCtrl extends BaseCtrl {
	//这边去声明ui组件
 
    @property(cc.Node)
	lbl_time=null;
    @property(cc.Node)
	tip_0=null;
    @property(cc.Node)
	tip_1=null;
    @property(cc.Node)
	tip_2=null;
    @property(cc.Node)
	tip_3=null; 
	//声明ui组件end

    timer=null;

	//这是ui组件的map,将ui和控制器或试图普通变量分离 
	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		////console.log("时钟进来了")
		this.initMvc(Model,View);
	}

	//定义网络事件
	defineNetEvents()
	{
		this.n_events={
			onProcess:this.onProcess,
			onSeatChange:this.onSeatChange,
			onSyncData:this.onSyncData,
			onEvent:this.onEvent, 
			onOp:this.onOp,  
			'onPrepare':this.onPrepare,     
			'onGameFinished':this.onGameFinished,
			'connector.entryHandler.enterRoom':this.connector_entryHandler_enterRoom,
		}
	}
	onPrepare(msg)
	{ 
		////console.log("时钟收到了准备")
        if(msg.seatid == RoomMgr.getInstance().getMySeatId()){
        	this.view.showDirection();
        }
	}
	connector_entryHandler_enterRoom()
	{
		this.model.updateSeatId();
		this.view.initDirectionBg();
	}
	onDestroy(){
		this.stopTick();
		super.onDestroy();
	}
	//定义全局事件
	defineGlobalEvents()
	{
		//全局消息
		this.g_events={ 
			'usersUpdated':this.usersUpdated,   
		} 
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
 
	onOp(msg){
		// body  
		var opseatid=msg.opseatid;
		if (msg.event==MahjongDef.event_chupai){ 
			opseatid=this.model.mahjongLogic.getInstance().curseat;
		}
		if (opseatid==RoomMgr.getInstance().getMySeatId()){
			this.stopTick();
		}
	}
	tick()
	{
		let elapse=Date.now()-this.model.starttime;
		elapse=parseInt(elapse/1000); 
		this.model.curtime=this.model.mahjongLogic.getInstance().maxoptime-elapse;
		if(this.model.curtime<0){
			this.model.curtime=0;			
		}
		if(this.model.curtime > 0 && this.model.curtime < 4){
			////console.log("当前时钟",this.model.curtime);
			this.model.mahjongAudio.getInstance().playClock();
		}
		this.view.tick()
        let opseatid = this.model.mahjongLogic.getInstance().curseat; 
	}
	startTick(  ){
		// body 
		//录像回放模式下倒计时不走
		if(RoomMgr.getInstance().getVideoMode())
		{
			return;
		}
		this.view.hideTime();
		this.model.resetTime();
		this.stopTick();
		this.timer = window.setInterval(this.tick.bind(this),1000);
		this.view.tick()
	}
	stopTick(  ){
		// body 
		if(this.timer)
		{
			window.clearInterval(this.timer);
			this.timer=null;
		} 
	}
	
	onEvent(  ){
		// body
		this.startTick() 
		this.model.resetTime();
		this.view.tick()
	}
    onSyncData( msg ){ 
		if(!RoomMgr.getInstance().isGameStarted())
		{
			return
		}
		// body
		this.model.recover();
		this.view.dirChange();
		this.model.state=1; 
		this.view.updateDir() 
	    let player=this.model.mahjongLogic.getInstance().players[RoomMgr.getInstance().getMySeatId()];
		if (player.events.length>0){  
			this.stopTick();
			//重置这些时间
			this.model.curtime=this.model.mahjongLogic.getInstance().maxoptime - this.model.mahjongLogic.getInstance().op_tick;
		}

	}
 
	usersUpdated(  ){
		// body
		this.view.clear();
	} 
	onProcess(msg){
		// body 
		if (msg.process==MahjongDef.process_dingzhuang){
			this.process_dingzhuang(msg); 
		}  
		else if (msg.process==MahjongDef.process_ready){
			this.process_ready(); 
		}
		else if (msg.process==MahjongDef.process_loop){
			this.process_loop(); 
		}
		else if(msg.process==MahjongDef.process_fapai)
		{
			this.view.showDirection();
		}
	}  
	process_loop(){ 
		this.startTick();
	}
	onGameFinished(  ){
		// body
		this.stopTick(); 
	} 
	process_ready(  ){
		// body
		this.model.mySeatId = RoomMgr.getInstance().getMySeatId();
		this.stopTick();
		this.view.clear();

		if(!RoomMgr.getInstance().isFirstRound())
		{
			//如果不是第一局就直接显示庄家
			this.model.updateSeatId();
			this.view.dirChange(); 
		}
	}
	process_buhua(  ){

	} 
	onSeatChange(msg){
		this.startTick();
		this.model.updateSeatId();
		this.view.dirChange(); 
	}
	process_dingzhuang(msg){  
		this.model.updateSeatId();
		this.view.dirChange();  
	} 
}
