import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

import CreateRoomMgr from "../../GameMgrs/CreateRoomMgr";
import BetMgr from "../../GameMgrs/BetMgr";
import RoomCostCfg from "../../CfgMgrs/RoomCostCfg";
import GameFreeMgr from "../../GameMgrs/GameFreeMgr";
import RoomMgr from "../../GameMgrs/RoomMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_SSSCreateCtrl;
//模型，数据处理
class Model extends BaseModel{
	roomRuleInfo: any = {};
	gameid: any = null;
	roomcfg: any = {};
	poker: any = [];
	pokerNumber: any = 1;
	pokerColor: any = 0;
	flowerCount: any = 4;
	payTypeInfo = []
	extendRule = []
	startModel = []
	enterLimit = []
	isFree = null;//是否限时免费
	constructor()
	{
		super();
		this.isFree = GameFreeMgr.getInstance().isFree(13)
		BetMgr.getInstance().setGameId(13);
		this.gameid = BetMgr.getInstance().getGameId();
		//console.log('gameId', this.gameid);
		this.roomRuleInfo = CreateRoomMgr.getInstance().getRoomRuleInfo(this.gameid);
		this.roomcfg = {
			v_roundcount:[10,20,30],
			v_seatcount:[2,3,4,5,6,7,8,9,10],
			v_paytype:[0,1],
			v_extendRule:[0,1,2,3,4],
			v_startModel:[0,1,1,1],
			v_fullstart:[],
			v_midEnterLimit:[0,1]
		};
		this.poker = [
			0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0A,0x0B,0x0C,0x0D,	//方块 A - K
			0x11,0x12,0x13,0x14,0x15,0x16,0x17,0x18,0x19,0x1A,0x1B,0x1C,0x1D,	//梅花 A - K
			0x21,0x22,0x23,0x24,0x25,0x26,0x27,0x28,0x29,0x2A,0x2B,0x2C,0x2D,	//红桃 A - K
			0x31,0x32,0x33,0x34,0x35,0x36,0x37,0x38,0x39,0x3A,0x3B,0x3C,0x3D,	//黑桃 A - K
		]; 
		this.reSetFlowerCount();
		this.payTypeInfo = ['房主支付房费','AA支付房费']
		this.extendRule = ['常规','比花色','多三张','配花','加一色']
		this.startModel = ['手动开桌','人满开桌']
		this.enterLimit = ['中途可入','中途禁入',]
        if(this.roomRuleInfo.v_startModel){
            CreateRoomMgr.getInstance().setProperty(this.roomRuleInfo.v_seatcount, 'roomRuleInfo', this.gameid, 'v_fullstart');
        }else{
            CreateRoomMgr.getInstance().setProperty(2, 'roomRuleInfo', this.gameid, 'v_fullstart');
        }
	}
	reSetBuyHorseData (index) {
		CreateRoomMgr.getInstance().setProperty(this.poker[index - 1], 'roomRuleInfo', this.gameid, 'v_buyHorseData');
	}

	reSetFlowerCount () {
		this.flowerCount = this.roomRuleInfo.v_seatcount > 4 ? this.roomRuleInfo.v_seatcount : 4;
	}

	getNowFlowerCount () {
		let sum = 0;
		for(let i = 0; i < 4; ++i){
			sum += this.roomRuleInfo.v_allotFlowerData[i];
		}
		return sum;
	}

	setAllotFlowerData (index, value) {
		this.roomRuleInfo.v_allotFlowerData[index] += parseInt(value);
	}
	initAllotFlower(bool){
		//if(bool){
		// 	this.roomRuleInfo.v_allotFlowerData = [0,0,0,0]
		// }else{
		// 	this.roomRuleInfo.v_allotFlowerData = [1,1,1,1]
		// }
	}
	refreshFangfei () {
		let roomInfo = this.roomRuleInfo;
		let roomCost = RoomCostCfg.getInstance().getRoomCost('sss', 0, roomInfo.v_roundcount, roomInfo.v_seatcount, roomInfo.v_paytype);
		if(this.isFree) roomCost = 0;
		CreateRoomMgr.getInstance().setProperty(roomCost, 'roomRuleInfo', this.gameid, 'v_fangfei');
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		playTypePanel: ctrl.playTypePanel,
		ruleBtnList:[],
		//exGamePanel: ctrl.exGamePanel,
		exGameBtnList: [],
		subBtnList:[],  //配花减按钮
		addBtnList:[],  //配花加按钮
		pokerResList: ctrl.pokerRes,
		roundSet:ctrl.roundSet,
        peopleSet:ctrl.peopleSet,
		payTypeSet:ctrl.payTypeSet,
		extendSet:ctrl.extendSet,
		startModelSet:ctrl.startModelSet,
		EnterLimitSet:ctrl.EnterLimitSet,
		roundSetMenu:ctrl.roundSetMenu,
        peopleSetMenu:ctrl.peopleSetMenu,
		payTypeSetMenu:ctrl.payTypeSetMenu,
		extendSetMenu:ctrl.extendSetMenu,
		startModelSetMenu:ctrl.startModelSetMenu,
		EnterLimitSetMenu:ctrl.EnterLimitSetMenu,
		payTypeLabel:ctrl.payTypeLabel,
		payCount:ctrl.payCount,
		selectCard :ctrl.selectCard,
		allotFlower:ctrl.allotFlower,
	};
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
		//this.ui.exGameBtnList = this.ui.exGamePanel.getChildByName('ToggleGroup').children;
		this.ui.ruleBtnList = this.ui.playTypePanel.getChildByName('ToggleGroup').children;
		this.ui.roundSet.getComponentInChildren(cc.Label).string =  '局数:' + this.model.roomRuleInfo.v_roundcount + '局' ;
        this.ui.peopleSet.getComponentInChildren(cc.Label).string = this.model.roomRuleInfo.v_seatcount;
		this.ui.payTypeSet.getComponentInChildren(cc.Label).string = this.model.payTypeInfo[this.model.roomRuleInfo.v_paytype];
		if(RoomMgr.getInstance().isInClub()){
			this.ui.payTypeSet.getComponentInChildren(cc.Label).string = "茶馆支付房费";
			this.model.roomRuleInfo.v_paytype = 0;
		}
		this.ui.extendSet.getComponentInChildren(cc.Label).string = this.model.extendRule[this.model.roomRuleInfo.v_extendRule];
		this.ui.startModelSet.getComponentInChildren(cc.Label).string = this.model.startModel[this.model.roomRuleInfo.v_startModel];
		this.ui.EnterLimitSet.getComponentInChildren(cc.Label).string = this.model.enterLimit[this.model.roomRuleInfo.v_midEnterLimit];
		for(let i = 0; i < 4; ++i){
			this.ui.subBtnList.push(this.ui.allotFlower.children[i].getChildByName('lessBtn'));
			this.ui.addBtnList.push(this.ui.allotFlower.children[i].getChildByName('plusBtn'));
		}
		this.changeActive(this.model.roomRuleInfo.v_extendRule)
		this.changeColor();
		this.refreshSelectCard(1);
		this.initPage();
		this.model.refreshFangfei();
		this.updatePayLabel(this.model.roomRuleInfo.v_paytype);
		this.refreshCostLbl();
		this.ui.payTypeLabel.node.parent.active = !this.model.isFree;
	}
	//设置配花
	changeActive (index) {
		let bool = index == 3?true:false;
		this.model.initAllotFlower(bool);
		for (let i = 0; i < 4; i++) {
			this.refreshFlowerLbl(i);
		}
		this.ui.allotFlower.active = bool
	}
	//买码节点变灰
	changeColor(){
		let items = this.ui.selectCard.children;
		let bool = this.model.roomRuleInfo.v_buyHorse == 1;
		for (let i = 0; i < items.length; i++) {
			items[i].getComponent(cc.Button).interactable = bool
		}
	
	}

	updatePayLabel(value){
        switch(value){
			case 0:
				this.ui.payTypeLabel.string = '首局结算时房主支付:';
				if(RoomMgr.getInstance().isInClub()){
					this.ui.payTypeLabel.string = '首局结算时茶馆支付:';
				}
				break;
			case 1:this.ui.payTypeLabel.string = '首局结算时所有玩家各支付:';break;
		}		
    }
	arrIndex(value,arr){
			for(let i = 0 ;i<arr.length;i++){
				if(arr[i] == value){
					return i.toString();
				}
			}
		}
	toggleCheck(){
        let roundIndex = this.model.roomRuleInfo.v_roundcount.toString();
        let playerIndex = this.model.roomRuleInfo.v_seatcount.toString();
        let round = this.arrIndex(roundIndex,this.model.roomcfg.v_roundcount)
        let player = this.arrIndex(playerIndex,this.model.roomcfg.v_seatcount)
		let pay = this.model.roomRuleInfo.v_paytype.toString();
		if(RoomMgr.getInstance().isInClub()){
			pay = '0';
		}
		let model = this.model.roomRuleInfo.v_startModel.toString();
		let enter = this.model.roomRuleInfo.v_midEnterLimit.toString();
		let extend = this.model.roomRuleInfo.v_extendRule.toString();
        this.ui.peopleSet.getChildByName('menu').getChildByName('dropMenu').getChildByName(player).getComponent(cc.Toggle).check();
        this.ui.roundSet.getChildByName('menu').getChildByName('dropMenu').getChildByName(round).getComponent(cc.Toggle).check();
		this.ui.payTypeSet.getChildByName('menu').getChildByName('dropMenu').getChildByName(pay).getComponent(cc.Toggle).check();
		this.ui.startModelSetMenu.getChildByName('dropMenu').getChildByName(model).getComponent(cc.Toggle).check();
		this.ui.EnterLimitSetMenu.getChildByName('dropMenu').getChildByName(enter).getComponent(cc.Toggle).check();
		this.ui.extendSetMenu.getChildByName('dropMenu').getChildByName(extend).getComponent(cc.Toggle).check();
    }

	initPage(){
		this.toggleCheck()
			for(let i = 0; i < this.ui.ruleBtnList.length; ++i){
			let value = this.model.roomRuleInfo[this.ui.ruleBtnList[i].name];
			if(value){
				this.ui.ruleBtnList[i].getComponent(cc.Toggle).check();
			}
		}
	}

	refreshSelectCard (index) {
		let key = index + 3;
		this.ui.selectCard.getChildByName('card').getComponent(cc.Sprite).spriteFrame = this.ui.pokerResList.getSpriteFrames()[key];
		this.setCardSize();
	}

	setCardSize(){
		this.ui.selectCard.getChildByName('card').width = 50;
		this.ui.selectCard.getChildByName('card').height = 70;
	}

	refreshFlowerLbl (index) {
		this.ui.allotFlower.children[index].getChildByName('count').getComponent(cc.Label).string = this.model.roomRuleInfo.v_allotFlowerData[index];
	}

	refreshCostLbl () {
		this.ui.payCount.string = this.model.roomRuleInfo.v_fangfei;
	}
}
//c, 控制
@ccclass
export default class Prefab_SSSCreateCtrl extends BaseCtrl {
	@property({
    	tooltip : '局数设置下拉按钮',
    	type : cc.Node
    })
    roundSet: cc.Node = null;

    @property({
        tooltip : '人数设置下拉按钮',
        type : cc.Node
    })
    peopleSet: cc.Node = null;

    @property({
    	tooltip : '支付设置下拉按钮',
    	type : cc.Node
    })
	payTypeSet: cc.Node = null;

	@property({
    	tooltip : '拓展选项下拉按钮',
    	type : cc.Node
    })
	extendSet: cc.Node = null;

	@property({
    	tooltip : '人满开桌下拉按钮',
    	type : cc.Node
    })
	startModelSet: cc.Node = null;

	@property({
    	tooltip : '中途禁入下拉按钮',
    	type : cc.Node
    })
	EnterLimitSet: cc.Node = null;
	
	@property({
    	tooltip : '局数设置下拉菜单',
    	type : cc.Node
    })
    roundSetMenu: cc.Node = null;

    @property({
        tooltip : '人数设置下拉菜单',
        type : cc.Node
    })
    peopleSetMenu: cc.Node = null;

    @property({
    	tooltip : '支付设置下拉菜单',
    	type : cc.Node
	})
	payTypeSetMenu: cc.Node = null;

	@property({
    	tooltip : '拓展选项下拉菜单',
    	type : cc.Node
    })
	extendSetMenu: cc.Node = null;

	@property({
    	tooltip : '人满开桌下拉菜单',
    	type : cc.Node
    })
	startModelSetMenu: cc.Node = null;

	@property({
    	tooltip : '中途禁入下拉菜单',
    	type : cc.Node
    })
	EnterLimitSetMenu: cc.Node = null;

	@property({
    	tooltip : '玩法容器',
    	type : cc.Node
    })
	playTypePanel: cc.Node = null;
	
	// @property({
    // 	tooltip : '拓展容器',
    // 	type : cc.Node
    // })
	// exGamePanel: cc.Node = null;
	
	@property({
    	tooltip : '更换花色',
    	type : cc.Node
    })
	selectCard: cc.Node = null;
	
	@property({
    	tooltip : '配花节点',
    	type : cc.Node
    })
	allotFlower: cc.Node = null;
	
	@property({
        tooltip : '支付方式显示',
        type : cc.Label
    })
    payTypeLabel: cc.Label = null;

    @property({
        tooltip : '支付金额',
        type : cc.Label
    })
    payCount: cc.Label = null;

	@property({
		tooltip: '扑克牌图片资源',
		type: cc.SpriteAtlas
	})
	pokerRes: cc.SpriteAtlas = null;
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

	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{	
		let Btn = [this.view.ui.roundSet, this.view.ui.peopleSet, this.view.ui.payTypeSet,this.view.ui.extendSet,this.view.ui.startModelSet,this.view.ui.EnterLimitSet]
        for(let i = 0;i<Btn.length;i++){
            this.connect(G_UiType.text, Btn[i], this.buttonCB, '下拉菜单按钮');
		}
		let roundItems = this.roundSetMenu.getChildByName('dropMenu').children;
		for(let i = 0; i < roundItems.length; i++){
            this.connect(G_UiType.button, roundItems[i], this.roundMenuCB, '切换局数选择选项');
		}
		let peopleItems = this.peopleSetMenu.getChildByName('dropMenu').children;
		for(let i = 0; i < peopleItems.length; i++){
            this.connect(G_UiType.button, peopleItems[i], this.dropMenuCB, '切换人数选择选项');
		}
		let payItems = this.payTypeSetMenu.getChildByName('dropMenu').children;
        for(let i = 0; i < payItems.length; i++){
            this.connect(G_UiType.button, payItems[i], this.dropMenuCB, '切换支付选择选项');
		}
		let extendItems = this.extendSetMenu.getChildByName('dropMenu').children;
		for(let i = 0; i < extendItems.length; i++){
            this.connect(G_UiType.button, extendItems[i], this.dropMenuCB, '切换拓展规则选项');
		}
		let startItems = this.startModelSetMenu.getChildByName('dropMenu').children;
		for(let i = 0; i < startItems.length; i++){
            this.connect(G_UiType.button, startItems[i], this.dropMenuCB, '切换开局模式选项');
		}
		let enterItems = this.EnterLimitSetMenu.getChildByName('dropMenu').children;
		for(let i = 0; i < enterItems.length; i++){
            this.connect(G_UiType.button, enterItems[i], this.dropMenuCB, '切换中途加入选项');
		}
		// for(let i = 0; i < this.ui.exGameBtnList.length; ++i){
		// 	this.connect(G_UiType.toggle, this.ui.exGameBtnList[i],() => {this.radioToggleCB(i, this.ui.exGamePanel.name);}, '选择扩展玩法')
		// }
		for(let i =0; i < this.ui.ruleBtnList.length; ++i){
			this.connect(G_UiType.toggle, this.ui.ruleBtnList[i], () => {this.checkToggleCB(i);}, "切换选择玩法")
		}
		this.connect(G_UiType.button, this.ui.selectCard.getChildByName('leftBtn'), ()=>{this.changePokerNumber('sub');}, '切换减小点数');
		this.connect(G_UiType.button, this.ui.selectCard.getChildByName('rightBtn'), ()=>{this.changePokerNumber('add');}, '切换增加点数');
		this.connect(G_UiType.button, this.ui.selectCard.getChildByName('changeColor'), this.changePokerColor, '切换换色');

		for(let i = 0; i < 4; ++i){
			this.connect(G_UiType.button, this.ui.subBtnList[i], ()=>{this.allotFlowerBtnCB(i, 'sub');}, '切换减少配花数量');
			this.connect(G_UiType.button, this.ui.addBtnList[i], ()=>{this.allotFlowerBtnCB(i, 'add');}, '切换增加配花数量');
		}
		this.node.on(cc.Node.EventType.TOUCH_START, this.closeDropMenu, this);
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin

	closeDropMenu(){
        this.view.ui.roundSetMenu.active = false;
        this.view.ui.peopleSetMenu.active = false;
		this.view.ui.payTypeSetMenu.active = false;
		this.view.ui.extendSetMenu.active = false;
		this.view.ui.startModelSetMenu.active = false;
		this.view.ui.EnterLimitSetMenu.active = false;
    }

    buttonCB(event){
        switch(event.name){
            case "v_roundcount": this.closeMenu(this.view.ui.roundSetMenu); break;
            case "v_seatcount": this.closeMenu(this.view.ui.peopleSetMenu); break;
			case "v_paytype": this.closeMenu(this.view.ui.payTypeSetMenu); break;
			case "v_extendRule":this.closeMenu(this.view.ui.extendSetMenu);break;
			case "v_startModel":this.closeMenu(this.view.ui.startModelSetMenu);break;
			case "v_midEnterLimit":this.closeMenu(this.view.ui.EnterLimitSetMenu);break;
        }
        this.view.toggleCheck()
	}
	
	closeMenu(node){
        if(node.active){
            this.closeDropMenu();
        }else{
            this.closeDropMenu();
			node.active = true;
			if(RoomMgr.getInstance().isInClub()){
				this.view.ui.payTypeSetMenu.active = false;
			}
        }
    }

	roundMenuCB(event){
        let value = event.currentTarget.parent.parent.parent.name;
        let index = Number(event.currentTarget.name);
        this.view.ui.roundSet.getComponentInChildren(cc.Label).string =  '局数:' + this.model.roomcfg.v_roundcount[index] + '局';
        CreateRoomMgr.getInstance().setProperty(this.model.roomcfg.v_roundcount[index], 'roomRuleInfo', this.model.gameid, 'v_roundcount');
        //console.log(this.model.roomRuleInfo.v_roundcount);
        //console.log('开房数据',this.model.roomRuleInfo);
		this.model.refreshFangfei();
		this.view.refreshCostLbl();
        this.closeDropMenu();
    }

	dropMenuCB(event){
		let value = event.currentTarget.parent.parent.parent.name;
        let index = Number(event.currentTarget.name);
        let info, lab;
        switch (value) {
            case "v_seatcount": info = this.model.roomcfg.v_seatcount; lab = this.view.ui.peopleSet.getComponentInChildren(cc.Label);break;
			case "v_paytype": info = this.model.payTypeInfo; lab = this.view.ui.payTypeSet.getComponentInChildren(cc.Label);this.view.updatePayLabel(index);break;
			case "v_extendRule": info = this.model.extendRule;lab = this.view.ui.extendSet.getComponentInChildren(cc.Label);this.view.changeActive(index) ;break;
			case "v_startModel":  info = this.model.startModel; lab = this.view.ui.startModelSet.getComponentInChildren(cc.Label);break;
			case "v_midEnterLimit":  info = this.model.enterLimit;lab = this.view.ui.EnterLimitSet.getComponentInChildren(cc.Label);break;
		}
		this.model.roomRuleInfo[value] = this.model.roomcfg[value][index];
		this.model.reSetFlowerCount();
		CreateRoomMgr.getInstance().setProperty(this.model.roomRuleInfo[value], 'roomRuleInfo', this.model.gameid, value);
		if(RoomMgr.getInstance().isInClub()){
			CreateRoomMgr.getInstance().setProperty(0, 'roomRuleInfo', this.model.gameid, 'v_paytype');
		}
		if(this.model.roomRuleInfo.v_startModel){
			CreateRoomMgr.getInstance().setProperty(this.model.roomRuleInfo.v_seatcount, 'roomRuleInfo', this.model.gameid, 'v_fullstart');
		}else{
			CreateRoomMgr.getInstance().setProperty(0, 'roomRuleInfo', this.model.gameid, 'v_fullstart');
		}
		lab.string =info[index];
		//console.log('开房数据',this.model.roomRuleInfo);
		this.model.refreshFangfei();
		this.view.refreshCostLbl();
		this.closeDropMenu();
	}

	radioToggleCB (index, toggleName) {
		this.closeDropMenu();
		let value = this.model.roomcfg[toggleName][index];
		CreateRoomMgr.getInstance().setProperty(value, "roomRuleInfo", this.model.gameid, toggleName);
		this.view.changeActive('allotFlower', value == 3);
		//console.log(toggleName,value);
	}

	checkToggleCB (index) {
		let toggleName;
		this.closeDropMenu();
		switch(index){
			case 0: toggleName = 'v_crazyField'; break;
			case 1: toggleName = 'v_jokerCard'; break;
			case 2: toggleName = 'v_buyHorse'; break;
		}
		if(this.ui.ruleBtnList[index].getComponent(cc.Toggle).isChecked){
			CreateRoomMgr.getInstance().setProperty(1, "roomRuleInfo", this.model.gameid, toggleName);
		}else{
			CreateRoomMgr.getInstance().setProperty(0, "roomRuleInfo", this.model.gameid, toggleName);
		}
		if(toggleName == 'v_buyHorse'){
			this.view.changeColor()
		}
		//console.log(this.model.roomRuleInfo);
	}

	changePokerNumber (type) {
		this.closeDropMenu();
		if(type == 'sub'){
			this.model.pokerNumber--;
			this.model.pokerNumber = this.model.pokerNumber < 1 ? 13 : this.model.pokerNumber;
		}else if(type == 'add'){
			this.model.pokerNumber++;
			this.model.pokerNumber = this.model.pokerNumber > 13 ? 1 : this.model.pokerNumber;
		}
		this.model.reSetBuyHorseData(this.model.pokerNumber + 13 * this.model.pokerColor);
		this.view.refreshSelectCard(this.model.pokerNumber + 13 * this.model.pokerColor);
		//console.log(this.model.roomRuleInfo.v_buyHorseData)
	}

	changePokerColor () {
		this.model.pokerColor++;
		this.model.pokerColor = this.model.pokerColor > 3 ? 0 : this.model.pokerColor;
		this.haveAllotPokerColor();
	}

	haveAllotPokerColor(){
		let count = 0;
		for (let i = 0; i < this.model.roomRuleInfo.v_allotFlowerData.length; i++) {
			if (this.model.roomRuleInfo.v_allotFlowerData[i] == 0) {
				count++;
			}
		}
		if (count < 4 && this.model.roomRuleInfo.v_allotFlowerData[this.model.pokerColor] == 0) {
			this.changePokerColor();
			return
		}
		this.model.reSetBuyHorseData(this.model.pokerNumber + 13 * this.model.pokerColor);
		this.view.refreshSelectCard(this.model.pokerNumber + 13 * this.model.pokerColor);
		//console.log(this.model.roomRuleInfo.v_buyHorseData)
	}

	allotFlowerBtnCB (index, type) {
		this.closeDropMenu();
		if(type == 'sub'){
			if(this.model.roomRuleInfo.v_allotFlowerData[index] > 0){
				this.model.setAllotFlowerData(index, -1);
			}
		}else if(type == 'add'){
			if(this.model.getNowFlowerCount() < this.model.flowerCount){
				this.model.setAllotFlowerData(index, 1);
			}
		}
		let count = 0;
		for (let i = 0; i < this.model.roomRuleInfo.v_allotFlowerData.length; i++) {
			if (this.model.roomRuleInfo.v_allotFlowerData[i] == 0) {
				count++;
			}
		}
		if (count<4) {
			this.haveAllotPokerColor()
			//console.log(this.model.roomRuleInfo.v_allotFlowerData)
		}
		this.view.refreshFlowerLbl(index);
	}
	//end
}