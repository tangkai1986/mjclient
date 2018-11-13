/*
author: YOYO
日期:2018-05-04 09:34:32
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import CreateRoomMgr from'../../GameMgrs/CreateRoomMgr';
import BetMgr from "../../GameMgrs/BetMgr";
import RoomCostCfg from "../../CfgMgrs/RoomCostCfg";
import RoomPanel from"../../Modules/CreateRoom/Prefab_CreateRoomPanelCtrl";
import GameFreeMgr from "../../GameMgrs/GameFreeMgr";
import RoomMgr from "../../GameMgrs/RoomMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
const Configs = {
	0:'v_roundcount',
	1:'v_seatcount',
	2:'v_paytype',
	3:'b_quanzimo',
	4:'t_youjin',
	5:'t_zhuangfanbei'
}
let ctrl : Prefab_LymjCreateCtrl;
//模型，数据处理
class Model extends BaseModel{
	roomRuleInfo = null;			//房间配置信息
	gameid   = null;
	roomCost = null;
	roomcfg = null;
	isFree = null;//是否限时免费
	constructor()
	{
		super();
		this.isFree = GameFreeMgr.getInstance().isFree(6);
		BetMgr.getInstance().setGameId(6);
		this.gameid = BetMgr.getInstance().getGameId();
		this.roomRuleInfo = CreateRoomMgr.getInstance().getRoomRuleInfo(this.gameid);	//6 龙岩麻将配置
		cc.log("LymjRoomRuleInfo1",this.roomRuleInfo);
		this.roomCost = RoomCostCfg.getInstance().getRoomCost('lymj', 0, this.roomRuleInfo.v_roundcount, this.roomRuleInfo.v_seatcount, this.roomRuleInfo.v_paytype);
		this.roomcfg={
        	v_roundcount:[8,16],
        	v_seatcount:[2,3,4],
        	v_paytype:[0,1],
			b_quanzimo:[0,1],
			t_youjin:[4,5],
			t_zhuangfanbei:[2,1],
			b_jinxianzhi:[0,1,2]			
		}
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		ToggleContainer:null,
		Toggle:null,
		RoomCost:null,
		CostTitle:null,
		youjinList:[]
	};
	node:cc.Node
	model:Model
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
		this.initToggleContainer(this.model.roomRuleInfo);
		this.initToggle();
	}
	//初始化ui
	initUi()
	{
		this.ui.ToggleContainer = ctrl.ToggleContainer;
		this.ui.Toggle = ctrl.Toggle;
		this.ui.CostTitle = ctrl.CostTitle;
		this.ui.RoomCost = ctrl.RoomCost;
		this.ui.RoomCost.parent.active = !this.model.isFree;
	}
	//刷新房费
	refreshFangfei(roomCost) {
		if(this.model.isFree) roomCost = 0;
		CreateRoomMgr.getInstance().setProperty(roomCost, 'roomRuleInfo', this.model.gameid, 'v_fangfei');
		this.ui.RoomCost.getComponent(cc.Label).string = roomCost;		
		this.updatePayLabel(this.model.roomRuleInfo.v_paytype);
	}
	//改变支付Label
	updatePayLabel(value) {
		switch (value) {
			case 0: 
				this.ui.CostTitle.getComponent(cc.Label).string = '首局结算时房主支付'; 
				if(RoomMgr.getInstance().isInClub()){
					this.ui.CostTitle.getComponent(cc.Label).string = '首局结算时茶馆支付'; 
				}
				break;
			case 1: this.ui.CostTitle.getComponent(cc.Label).string = '首局结算时所有玩家各支付'; break;
		}
	}
	//初始化单选按钮
	initToggleContainer(roomRuleInfo){
		//没搞懂为什么以前为什么要写下面这个FOR（保留）
		for(let key in roomRuleInfo){
			this.model.roomRuleInfo[key] = roomRuleInfo[key];
		}
		for(let i=0; i<this.ui.ToggleContainer.childrenCount; i++){
			let toggleName=Configs[i];
			let groupChildren=this.ui.ToggleContainer.children[i].children;
			let data = this.model.roomcfg[Configs[i]];
			let value = this.model.roomRuleInfo[Configs[i]];
			for(let j=0; j<data.length; j++){
				if(RoomMgr.getInstance().isInClub()&&toggleName=='v_paytype')
				{
					//强制被客户改成茶馆支付了
					this.model.roomcfg[toggleName][j]=0;//强制设置为一种支付方式					
					groupChildren[1].active=false;
					groupChildren[0].getComponent(cc.Toggle).check();
					this.model.roomRuleInfo.v_paytype = 0;
					groupChildren[0].getChildByName('checkmark').getChildByName('lab').getComponent(cc.Label).string='茶馆支付'
					groupChildren[0].getChildByName('Background').getChildByName('lab').getComponent(cc.Label).string='茶馆支付'				
					continue;
				} 
				if(data[j] == value){
					this.ui.ToggleContainer.children[i].children[j].getComponent(cc.Toggle).check();
				}
			}
		}
		if(this.ui.ToggleContainer.children[3].children[1].getComponent(cc.Toggle).isChecked){
			this.ui.ToggleContainer.children[4].children[1].active =false;
			this.ui.ToggleContainer.children[4].children[0].getComponent(cc.Toggle).check();
			this.model.roomRuleInfo.t_youjin = 4;
		}
	}
	//初始化复选按钮
	initToggle(){
		this.ui.youjinList = this.ui.Toggle.getChildByName('youjintype').children;
        for(let i = 0; i < this.ui.youjinList.length; ++i){
			let value = this.model.roomRuleInfo[this.ui.youjinList[i].name];
			if(value){
				this.ui.youjinList[i].getComponent(cc.Toggle).check();
			}
			if(this.model.roomRuleInfo.b_jinxianzhi == 0){
				this.ui.youjinList[i].getComponent(cc.Toggle).isChecked = false;
			}else if(this.model.roomRuleInfo.b_jinxianzhi == 1){
				this.ui.youjinList[0].getComponent(cc.Toggle).isChecked = false;
			}
		}		
	}
}
//c, 控制
@ccclass
export default class Prefab_LymjCreateCtrl extends BaseCtrl {
	view:View
	model:Model
	//这边去声明ui组件
	@property({
		tooltip: "单选按钮",
		type: cc.Node
	})
	ToggleContainer: cc.Node = null;

	@property({
		tooltip: "多选按钮",
		type: cc.Node
	})
	Toggle: cc.Node = null;

	@property({
        tooltip : '房费',
        type : cc.Node
    })
	RoomCost: cc.Node = null;
	@property({
        tooltip : '房费标题',
        type : cc.Node
    })
	CostTitle: cc.Node = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离
	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model,View);
		this.refFangfei();
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
		//单选按钮绑定
		for(let i=0; i<this.ToggleContainer.childrenCount; i++){
			let temp = this.ToggleContainer.children[i];
			for(let j=0; j<temp.childrenCount; j++){
				let child = temp.children[j];
				let cb =()=>{
					this.Toggle_cb(i,j);
				}
				this.connect(G_UiType.text, child, cb, "单选按钮");
			}
		}
		//复选按钮绑定
		for(let i =0; i < this.ui.youjinList.length; ++i){
			this.connect(G_UiType.toggle, this.ui.youjinList[i], () => {this.checkToggleCB(i);}, "切换游金限制")
		}
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//刷新房费
	refFangfei(){
        let roomInfo = this.model.roomRuleInfo;
        let roomCost = RoomCostCfg.getInstance().getRoomCost('lymj', 0, roomInfo.v_roundcount, roomInfo.v_seatcount, roomInfo.v_paytype);
		this.model.roomRuleInfo.v_fangfei= roomCost;
        this.view.refreshFangfei(roomCost);
	}
	//单选按钮绑定 groupIndex :第几组，childIndex，哪个选中
	private Toggle_cb(groupIndex,childIndex){
		//如果是玩法选项，半自摸（childIndex == 0）五倍显示，全自摸（childIndex == 1）五倍消失
		if(groupIndex == 3 ){
			if(childIndex == 0){
				if(!this.ToggleContainer.children[4].children[1].active){
					this.ToggleContainer.children[4].children[1].active = true;
				}
			}else if(childIndex == 1){
				if(this.ToggleContainer.children[4].children[1].active){
				   this.ToggleContainer.children[4].children[1].active = false;
				}
				this.ToggleContainer.children[4].children[0].getComponent(cc.Toggle).isChecked;
				this.model.roomRuleInfo.t_youjin = 4;
			}
		}
		let name = Configs[groupIndex];
        let value = this.model.roomcfg[name][childIndex];
		CreateRoomMgr.getInstance().setProperty(value, 'roomRuleInfo', this.model.gameid, name);
		this.refFangfei();
		//console.log("LymjRoomRuleInfo2",this.model.roomRuleInfo);		
	}

	checkToggleCB (index) {
		let toggleName;
		switch(index){
			case 0: toggleName = 'b_jinxianzhi'; break;
			case 1: toggleName = 'b_jinxianzhi'; break;
		}
		if(this.ui.youjinList[1].getComponent(cc.Toggle).isChecked){
			CreateRoomMgr.getInstance().setProperty(1, "roomRuleInfo", this.model.gameid, toggleName);
			if(this.ui.youjinList[0].getComponent(cc.Toggle).isChecked){
				CreateRoomMgr.getInstance().setProperty(2, "roomRuleInfo", this.model.gameid, toggleName);
			}
		}else if(this.ui.youjinList[0].getComponent(cc.Toggle).isChecked){
			this.ui.youjinList[1].getComponent(cc.Toggle).isChecked = true;
			CreateRoomMgr.getInstance().setProperty(2, "roomRuleInfo", this.model.gameid, toggleName);
		}else{
			CreateRoomMgr.getInstance().setProperty(0, "roomRuleInfo", this.model.gameid, toggleName);
		}
		//console.log("LymjRoomRuleInfo3",this.model.roomRuleInfo);
	}
	//end
}