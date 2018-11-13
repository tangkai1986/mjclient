/*
author: JACKY
日期:2018-03-05 16:23:02
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UiMgr from "../../GameMgrs/UiMgr";
import RoomMgr from "../../GameMgrs/RoomMgr";
import UserMgr from "../../GameMgrs/UserMgr"
import RoomCostCfg from "../../CfgMgrs/RoomCostCfg";
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_PreventionCheatingCtrl;
//模型，数据处理
class Model extends BaseModel{
	public users = null;
	public userInfo = null;
	public logicseatid = null;
	public viewSeatId = null;
	public uid = null;
	userCheatList = null;
	samedistusers=[];
	sameipusers=[];
	poscfg={
		2:[{x:-340,y:165}, {x:-341,y:-142}],
		3:[{x:-340,y:-139},{x:-494,y:12},{x:-194,y:12}],
		4:[{x:-340,y:-139},{x:-494,y:12},{x:-194,y:12},{x:-340,y:165}],
		5:[{x:-340,y:-139},{x:-494,y:12},{x:-194,y:12},{x:-340,y:165},{x:-446,y:114}],
		6:[{x:-340,y:-139},{x:-494,y:12},{x:-194,y:12},{x:-340,y:165},{x:-446,y:114},{x:-216,y:114}],
		7:[{x:-340,y:-139},{x:-494,y:12},{x:-194,y:12},{x:-340,y:165},{x:-446,y:114},{x:-216,y:114},{x:-448,y:-98}],
		8:[{x:-340,y:-139},{x:-494,y:12},{x:-194,y:12},{x:-340,y:165},{x:-446,y:114},{x:-216,y:114},{x:-448,y:-98},{x:-228,y:-98}],
		9:[{x:-340,y:165},{x:-446,y:114},{x:-223,y:114},{x:-494,y:12},{x:-194,y:12},{x:-461,y:-73},{x:-213,y:-73},{x:-391,y:-145},{x:-275,y:-145}],
		10:[{x:-391,y:155},{x:-275,y:156},{x:-466,y:87},{x:-220,y:85},{x:-494,y:12},{x:-194,y:12},{x:-461,y:-73},{x:-213,y:-73},{x:-391,y:-145},{x:-275,y:-145}]
	}
	constructor() 
	{
		super();
		RoomMgr.getInstance().reqCheating();
		
	}
	updateCheat(msg){
		let result=msg.result;
		for(let key in result)
		{ 
			let uid=parseInt(key);
			let info=result[key]; 
			if(info.ip_res)
			{
				let userinfo=UserMgr.getInstance().getUserById(uid); 
				if(!userinfo) return;
				this.sameipusers.push(userinfo);
			}
			if(info.lal_res)
			{
				let userinfo=UserMgr.getInstance().getUserById(uid); 
				this.samedistusers.push(userinfo);
			} 
		}
		//console.log("消息=",msg)
	}
 
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		label_external:null,
		label_positioning:null,
		label_ip:null,
		img_sao:null,
		externalPlayerNode:null,
		positioningPlayerNode:null,
		IpPlayerNode:null,
		SaoPlayerNode:null,
		img_playerheads:null,
		heads:{},
		lbl_testingwaigua:null,
		lbl_testingdist:null,
		lbl_testingip:null,
		img_distheads:null,
		img_ipheads:null,
		external:null,
		positioning:null,
		ip:null,
		tips:null,
		distheads:[],
		ipheads:[],
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
		this.ui.label_external = ctrl.label_external;
		this.ui.label_positioning = ctrl.label_positioning;
		this.ui.label_ip = ctrl.label_ip;
		this.ui.img_sao = ctrl.img_sao;
		this.ui.externalPlayerNode = ctrl.externalPlayerNode;
		this.ui.positioningPlayerNode = ctrl.positioningPlayerNode;
		this.ui.IpPlayerNode = ctrl.IpPlayerNode;
		this.ui.img_playerheads = ctrl.img_playerheads;
		this.ui.lbl_testingip = ctrl.lbl_testingip;
		this.ui.lbl_testingdist = ctrl.lbl_testingdist;
		this.ui.lbl_testingwaigua = ctrl.lbl_testingwaigua;
		this.ui.img_distheads = ctrl.img_distheads;
		this.ui.img_ipheads = ctrl.img_ipheads;
		this.ui.external = ctrl.external;
		this.ui.positioning = ctrl.positioning;
		this.ui.ip = ctrl.ip;
		this.ui.tips = ctrl.tips;   
		//隐藏三个标题
		this.ui.external.active = false;
		this.ui.positioning.active = false;
		this.ui.ip.active = false;
		this.ui.label_external.node.active = false;
		this.ui.label_positioning.node.active = false;
		this.ui.label_ip.node.active = false;
		this.ui.img_distheads.active = false;
		this.ui.img_ipheads.active = false; 
		let curPlayerCount = RoomMgr.getInstance().getPlayerCount();
	    
		for (let i = 0;i<10;++i) {
			let headnode=this.ui.img_playerheads.getChildByName(`player${i}`);
			this.ui.heads[i]=headnode; 
			headnode.active=false;
		}
		for (let i = 0;i<curPlayerCount;++i) {
			let headnode=this.ui.heads[i]
			if (i < curPlayerCount) {
				
				headnode.setPosition(this.model.poscfg[curPlayerCount][i])
                let uid=RoomMgr.getInstance().getUidBySeatId(i);
                if(uid){
                    let userinfo=UserMgr.getInstance().getUserById(uid);
                    UiMgr.getInstance().setUserHead(headnode,userinfo.headid,userinfo.headurl);
                }
			}
			headnode.active=i<curPlayerCount;
		}

		for(let index = 0;index<this.ui.img_distheads.children.length;++index)
		{
			let headnode=this.ui.img_distheads.children[index];
			headnode.active=false;
			this.ui.distheads.push(headnode);
		}
		for(let index = 0;index<this.ui.img_ipheads.children.length;++index)
		{ 
			let headnode=this.ui.img_ipheads.children[index];
			headnode.active=false;
			this.ui.ipheads.push(headnode);
		}
	}
 
 
	updateCheat(){
		this.ui.lbl_testingdist.node.active=false
		this.ui.lbl_testingwaigua.node.active=false;
		this.ui.lbl_testingip.node.active=false;
		for(let i = 0;i<this.model.sameipusers.length;++i)
		{
			this.ui.ipheads[i].active=true;
			let userinfo=this.model.sameipusers[i]
			UiMgr.getInstance().setUserHead(this.ui.ipheads[i],userinfo.headid,userinfo.headurl); 
		}
		for(let i = 0;i<this.model.samedistusers.length;++i)
		{
			this.ui.distheads[i].active=true;
			let userinfo=this.model.samedistusers[i]
			UiMgr.getInstance().setUserHead(this.ui.distheads[i],userinfo.headid,userinfo.headurl); 
		}
	}
 

	//显示雷达扫描
	runPreventionAction(){
		this.ui.img_sao.runAction(cc.rotateBy(3, 360*3));
	}
}
//c, 控制
@ccclass
export default class Prefab_PreventionCheatingCtrl extends BaseCtrl {
	view:View = null
	model:Model = null
	//这边去声明ui组件
	@property(cc.Label)
	label_external=null; 
	@property(cc.Label)
	label_positioning=null;
	@property(cc.Label)
	label_ip=null;  
	@property(cc.Node)
	img_sao=null;
	@property(cc.Node)
	externalPlayerNode=null;
	@property(cc.Node)
	positioningPlayerNode=null;
	@property(cc.Node)
	IpPlayerNode=null;
	@property(cc.Node)
	img_playerheads=null;

	@property(cc.Label)
	lbl_testingwaigua=null;
	@property(cc.Label)
	lbl_testingdist=null;
	@property(cc.Label)
	lbl_testingip=null;
 
	@property(cc.Node)
	img_distheads=null;
	@property(cc.Node)
	img_ipheads=null;

	@property(cc.Node)
	external = null;
	@property(cc.Node)
	positioning = null;
	@property(cc.Node)
	ip = null;

	@property(cc.Label)
	tips = null;

	timer_delay=null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model,View);
	}

	onDestroy(){
		if(this.timer_delay!=null){
			clearTimeout(this.timer_delay);
			this.timer_delay=null;
		}
		super.onDestroy();
	}
	//定义网络事件
	defineNetEvents()
	{
		this.n_events = {
			'http.reqCheating' : this.http_reqCheating,
		}
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
		//检测开始
        let curDate = new Date();
		//console.log("roompreventing",curDate.getTime());
		
		this.view.runPreventionAction(); 
		// this.timer_delay=setTimeout(this.timeout.bind(this),3000)
		let number = 0
		let next = () => {
			let cb = null;
			if (number > 2)
				cb = this.timeout
			else
				cb = taskArr[number]

			setTimeout(()=>{
				cb.bind(this)()
				number++
				if (number < 4) next()
			}, 450)
		}
		let task1 = function () {
			this.ui.external.active = true;this.ui.label_external.node.active = true;
		}
		let task2 = function () {
			this.ui.positioning.active = true;
			let count=0;
			for(let i=0;i<this.ui.distheads.length;i++){
				let draw = this.ui.distheads[i].active;
				if(draw){
				this.ui.img_distheads.active = true;
				break;
				}
				else
				count++;
			}
			if(count>=this.ui.distheads.length)
			{
			  this.ui.label_positioning.node.active = true;
			}
		}
		let task3 = function () {
			this.ui.ip.active = true;
			let count = 0;
			for(let i=0;i<this.ui.ipheads.length;i++){
				let draw = this.ui.ipheads[i].active;
				if(draw){
				this.ui.img_ipheads.active = true;
				break;
				}
				else
				count++;
			}
			if(count>=this.ui.ipheads.length)
			{
				this.ui.label_ip.node.active = true;
			}
		 }
		let taskArr = [task1, task2, task3]
		next()
	}
	timeout(){
		this.finish();
	}
	
	//网络事件回调begin
	http_reqCheating(msg){  
		this.model.updateCheat(msg);
		this.view.updateCheat();
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
}