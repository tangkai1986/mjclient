/*
author: YOYO
日期:2018-01-16 16:24:48
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import GEventDef from "../../GameMgrs/GEventDef";
import NetMgr from "../../NetCenter/NetMgr";
import FrameMgr from "../../GameMgrs/FrameMgr";
import LoginMgr from "../../GameMgrs/LoginMgr";
import VerifyMgr from "../../GameMgrs/VerifyMgr";
import PlatMgr from "../../GameMgrs/PlatMgr";
import RoomMgr from "../../GameMgrs/RoomMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : MsgBoxLoadingAni;
//模型，数据处理
class Model extends BaseModel{
	routemap={}; 
	constructor()
	{
		super(); 
	}
	clear(){ 
	} 

}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        img_juhua:null,
        mask:null
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.node.zIndex=2212332;
        this.initUi(); 
        this.hideAll(); 
	}
	//初始化ui
	initUi()
	{
        this.ui.img_juhua = ctrl.img_juhua;
		this.ui.mask = ctrl.mask;
    }
     
    hideAll(){
        this.node.active=false;
        this.ui.img_juhua.active=false;
        this.ui.mask.active=false;
    }
    showMask()
    { 
      	this.node.active=true; 
	} 
	showJuHua(){
		this.node.zIndex++;
        this.ui.img_juhua.active=true;
        this.ui.mask.active=true;
	}
}
//c, 控制
@ccclass
export default class MsgBoxLoadingAni extends BaseCtrl {
	//这边去声明ui组件
    @property(cc.Node)
    img_juhua:cc.Node = null
    
    @property(cc.Node)
    mask:cc.Node = null
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离
	private timer_delay=null;
	private timer_checkjuhuatime=null;//检测菊花事件
	private juhuaIsShowIn=false;
	private bMsgBoxIsShowIn=false;
    private starttime=0;
	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model,View);
        let winSize = cc.director.getVisibleSize();
        this.node.position=cc.p(winSize.width/2,winSize.height/2);
		this.node.tag=NetMgr.getInstance().getJuHuaTag();//记录tag为网络菊花

		this.timer_checkjuhuatime=setInterval(this.checkJuHuaTimer.bind(this),10);
        G_FRAME.globalEmitter.on("EnterBackground", this.EnterBackground.bind(this), this)
        G_FRAME.globalEmitter.on("EnterForeground", this.EnterForeground.bind(this), this)
	}
	//前后台切换
	EnterBackground(){
		//切换前台时时间也要重置
		if(this.starttime==0)
		{
			return;
		}
		this.starttime=Date.now();
	}
	EnterForeground(){ 
		if(this.starttime==0)
		{
			return;
		}
		this.starttime=Date.now();
	}
	//检查菊花时间
	checkJuHuaTimer(){ 
		if(this.starttime==0)
		{
			return;
		}
		let time=Date.now();
		if(time-this.starttime>20000)//20s
		{
			this.bMsgBoxIsShowIn=true;
			this.starttime=0;
			NetMgr.getInstance().destroy();  
			this.enableOpration();//允许操作
			this.reportNetDelay();
			FrameMgr.getInstance().showHintBox(`网络状况不佳,请检查你的网络`,()=>{
				LoginMgr.getInstance().restartGame();
			}); 
		}
	}
	reportNetDelay(){
		if (cc.sys.isNative) {
			//上报给服务器 
			let xhr = cc.loader.getXMLHttpRequest();   
			xhr.onreadystatechange = function () {  
			};    
			//报告地址
			var url=window['__errorReportUrl'] || "http://120.78.95.186:10001"
			//url="http://192.168.30.28:10001"
			xhr.open("POST",url,true); 
			xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
			var ops=window['__errorOp'];
			var opstr="";
			for(var i = 0;i<ops.length;++i)
			{
				opstr+=ops[i]
				if(i<ops.length-1)
				{
					opstr+='>>'
				}
			}  
			var data={
				ops:opstr,
				userinfo:window['__errorUserInfo'],
				msgque:NetMgr.getInstance().getMsgRecords(),
			}
			xhr.send(JSON.stringify(data));
		}
	}
	onDestroy(){
		if(this.timer_delay!=null){
			clearTimeout(this.timer_delay);
			this.timer_delay=null;
		}
		if(this.timer_checkjuhuatime!=null){
			clearTimeout(this.timer_checkjuhuatime);
			this.timer_checkjuhuatime=null;
		}
		super.onDestroy();		
	}
	updateJuHua(needshowjuhua)
	{
		if(this.bMsgBoxIsShowIn)
		{
			return;
		}
		//这个有问题每次请求都应该重置starttime
		if(this.juhuaIsShowIn==needshowjuhua){
			return;
		}
		this.juhuaIsShowIn=needshowjuhua;
		if(needshowjuhua)
		{
			//console.log("禁止菊花操作")
			this.disableOpration();
		}
		else
		{
			//console.log("允许菊花")
			this.enableOpration();
		} 
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
	}
	start () {
        this.node.on(cc.Node.EventType.TOUCH_START, ()=>{
            //console.log('这是网络菊花')
        }, this);
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end 
	//禁止操作
	disableOpration(){
		this.starttime=Date.now();
		if(this.timer_delay==null){
			this.view.showMask();
			//console.log("启动定时器")
			//菊花时间变长
			this.timer_delay=setTimeout(this.timeout.bind(this),2000)
		}
	}
	forceStop(){
		this.enableOpration();
		if(this.timer_checkjuhuatime)
		{
			clearInterval(this.timer_checkjuhuatime)
			this.timer_checkjuhuatime=null;
		}
		this.timer_checkjuhuatime=setInterval(this.checkJuHuaTimer.bind(this),10);
	}
	clearDelayTimer(){ 
		if(this.timer_delay!=null)
		{
			//console.log("清空定时器")
			clearTimeout(this.timer_delay);
			this.timer_delay=null;
		}
	}
	//允许操作
	enableOpration(){ 
		this.starttime=0;
		this.view.hideAll();
		this.clearDelayTimer();
	}
 
	//超时
	timeout(){
		this.view.showJuHua();
	} 
 
 
}