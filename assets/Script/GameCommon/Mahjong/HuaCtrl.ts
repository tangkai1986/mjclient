
/*
author: JACKY
日期:2018-01-11 18:49:15
*/ 



import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import BaseView from "../../Plat/Libs/BaseView";
import BaseModel from "../../Plat/Libs/BaseModel";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";  
import { MahjongDef } from "./MahjongDef";


 
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : QzmjHuaCtrl;
//模型，数据处理
class Model extends BaseModel{
	seatid=null;//视图座位 
	logicseatid=null;//逻辑座位，服务器那边的座位
	 
	hucount=0;
	player=null;


	mahjongResMgr=RoomMgr.getInstance().getResMgr();
	mahjongLogic=RoomMgr.getInstance().getLogic();
	mahjongDef=RoomMgr.getInstance().getDef();
	mahjongAudio=RoomMgr.getInstance().getAudio();		

	constructor()
	{
		super();

	}
  
	initSeat(id)
	{
		this.seatid=id;  
	}
    //找到屏幕拥有者的逻辑坐标  
	clear(  )
	{
		// body 
	}  

	updateLogicId(  )
	{
		// body
		this.logicseatid=RoomMgr.getInstance().getLogicSeatId(this.seatid); 
		if(this.logicseatid==null)
			return
		this.player=this.mahjongLogic.getInstance().players[this.logicseatid];  
	}  
 
	recover()
	{ 
		this.updateLogicId();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		huaarr:[],
		huaCount:[]
		
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
		////console.log("初始化ui")
		for(let i = 0;i<this.node.children.length;++i)
		{   
			let huanode=this.node.getChildByName(`hua_${i}`);
			let huaCount = huanode.getChildByName("huaCount");
			if(huaCount) {
				this.ui.huaCount.push(huaCount);
			}
			this.ui.huaarr.push(huanode); 
		}   
		this.clear();
	} 
	//清除
	clear( )
	{ 
		for(let i = 0;i<this.ui.huaarr.length;++i)
		{  
			this.ui.huaarr[i].active=false;  
			if(this.ui.huaCount[i]) {
				this.ui.huaCount[i].active =false;
			}
		}  
	}  
 
	updateHua()
	{
		// body 
		this.clear();

		// body 
		let index=0;
		////console.log("显示花牌=",this.model.player.huapais)
		for(let hua in this.model.player.huapais)
		{ 
			var huanode=this.ui.huaarr[index]
			let frame = this.model.mahjongResMgr.getInstance().getHuaIconTexture(hua); 
			huanode.getComponent(cc.Sprite).spriteFrame = frame;  
			huanode.active=true; 
			let huacount = this.model.player.huapais[hua];
			if(huacount>1) {
				this.ui.huaCount[index].active = true;
				let sprite = this.model.mahjongResMgr.getInstance().getSpriteFrame('BuhuaStatus_count_'+huacount);
				this.ui.huaCount[index].getComponent(cc.Sprite).spriteFrame = sprite;
				//赋值
			}
			// //console.log("texture",huanode,frame);
			index++;
		}
		// let index=0;
		// let self = this;
		// self.model.hucount=0;
		// //console.log("显示花牌=",this.model.player.huapais,this.model.player)
		// for(let hua in this.model.player.huapais)
		// { 
		// 	let huanode=self.ui.huaarr[self.model.hucount];
		// 	//console.log("texture",huanode)
	 //        let value = self.model.mahjongResMgr.huaIcons[hua];
	 //        cc.loader.loadRes(`Mahjong/Textures/BuhuaStatus_${value}`, cc.SpriteFrame, (err, sprite)=>{
		// 		//console.log("texture1",`GameCommon/Mahjong/Textures/BuhuaStatus_${value}`,sprite,huanode,self.ui.huaarr,self.model.hucount,value)
	 //            if (err) return cc.error(`no find GameCommon/Mahjong/Textures/BuhuaStatus_${value}`);
		// 		self.ui.huaarr[self.model.hucount].getComponent(cc.Sprite).spriteFrame = sprite;  
		// 		self.ui.huaarr[self.model.hucount].active=true; 
		// 		self.model.hucount++;
	 //        });
		// }
 
	} 
}
//c, 控制
@ccclass
export default class QzmjHuaCtrl extends BaseCtrl {
	//这边去声明ui组件
    @property
    seatId:Number = 0;
     
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		this.initMvc(Model,View); 
		this.model.initSeat(this.seatId);
		this.usersUpdated();
		this.onSyncData();
	}

	//定义网络事件
	defineNetEvents()
	{
		////console.log("huactrl注册了网络监听=",this.seatId)
        this.n_events={
			//网络消息监听列表 
			'onLeaveRoom':this.onLeaveRoom,
			onSyncData:this.onSyncData,
			onSeatChange:this.onSeatChange, 
			onProcess:this.onProcess,
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
	//绑定操作的回调
	connectUi()
	{
		 
     
	}
	start () {
	}
	//网络事件回调begin
 
	onSyncData()
	{
		this.model.initSeat(this.seatId);
	   	this.model.updateLogicId();
		// body 
		if(this.model.logicseatid==null)
			return;
		this.model.recover();  
		this.view.updateHua() 
	} 
	onProcess(msg)
	{ 
		if(this.model.logicseatid==null)
			return;
        if(msg.process==MahjongDef.process_buhua){
			this.process_buhua(); 
		}
	} 
	onSeatChange(msg)
	{    
		if(this.model.logicseatid==null){ 
			return;
		}
		// body 
		if (this.model.logicseatid != msg.curseat){  
			return;
		}  
		if (msg.needbupai&&msg.huaarr.length>0) 
		{ 
			this.view.updateHua()
		}
	} 
	process_buhua(  )
	{ 
		this.view.updateHua();
	}
	usersUpdated()
	{
		// body 
	   this.model.updateLogicId();
	   this.view.clear(); 
	} 
 
 
	onLeaveRoom(msg){ 
		if (this.model.logicseatid==msg.seatid){
			this.model.clear(); 
			this.view.clear();
		}
	}
  

	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
 
}