
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseModel from "../../../Plat/Libs/BaseModel";
import UiMgr from "../../../Plat/GameMgrs/UiMgr";
import AudioMgr from "../../../Plat/GameMgrs/AudioMgr";
import ModuleMgr from "../../../Plat/GameMgrs/ModuleMgr";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import SssLogic from "../SssMgr/SssLogic";
import UserMgr from "../../../Plat/GameMgrs/UserMgr";
import { SssDef } from "../SssMgr/SssDef";
import SssAudio from "../SssMgr/SssAudio";
import SssCards from "../SssMgr/SssCards";
import { SssLib } from "../SssMgr/SssLib";
import LocalStorage from "../../../Plat/Libs/LocalStorage";
 
//MVC模块,
const {ccclass, property} = cc._decorator;
const choosePos = 90
const startPos = 76
const AUTO_CUSTOM = 1
const MANUL_CUSTOM = 2
const cardTypeResString = {
	bFiveSame: 'wutong',
	bStraightFlush:'tonghuashun',
	bFourSame:'tiezi',
	bGourd:'hulu',
	bFlush:'tonghua',
	bStraight:'shunzi',
	bThreeSame:'santiao',
	bTwoPare:'liangdui',
	bOnePare:'duizi'
}
const cardTypeString = {
	wulong: '乌龙',
	wutong: '五同',
	tonghuashun:'同花顺',
	tiezi:'铁支',
	hulu:'葫芦',
	tonghua:'同花',
	shunzi:'顺子',
	santiao:'三条',
	liangdui:'两对',
	duizi:'对子'
}
const dunType = {
	upPier : 0,
	midPier : 1,
	downPier : 2,
}
let ctrl : SssSeatCtrl;
//模型，数据处理
class Model extends BaseModel{
	sssCard:SssCards = null;
	topTenCardGroup=null;
	seatid=null;//视图座位
	uid=null; 
	logicseatid=null;//逻辑座位，服务器那边的座位
	userinfo=null;
	hucount=0;
	player=null;
	isZhuangJia=false;//庄家标记
	isMaster=false;//房主标记
	arrChooseCard = [];//选中牌的组
	handCards = [];
	upPier = [];//以下为牌墩中的牌的数据
	midPier = [];
	downPier = [];
	selArr = [[],[],[]];
	count = 0;//交换的数据计数
	bMoveChooseHand = false;
	bMoveSel = [false, false, false];
	noMoveEnd = [false, false, false];
	moveTempArr = [[],[],[]];
	pierTypeArr = [{key:'bFiveSame', value:0},{key:'bStraightFlush',value:0},{key:'bFourSame',value:0},{key:'bGourd',value:0},{key:'bFlush',value:0},{key:'bStraight',value:0},{key:'bThreeSame',value:0},{key:'bTwoPare',value:0},{key:'bOnePare',value:0}];
	typeInfo = null;
	onePareCC = 0;
	twoPareCC = 0;
	threeSameCC = 0;
	straightCC = 0;
	flushCC = 0;
	groupCC = 0;
	fourSameCC = 0;
	straightFlushCC = 0;
	fiveSameCC = 0;
	bChangePierData = false;
	timesLab = 0;
	sssAudio=RoomMgr.getInstance().getAudio();
	maCard = -1;
	chooseTempArr = [];
	controlCustom = null;
	constructor()
	{
		super();
		this.sssCard = new SssCards;
		this.topTenCardGroup = [];
		this.timesLab = 80;
		this.handCards = SssLogic.getInstance().getMyHandCard();
		this.controlCustom = LocalStorage.getInstance().getSssControlCustom()
		this.controlCustom = this.controlCustom ? this.controlCustom : AUTO_CUSTOM
		//console.log('转换前的数据', this.handCards)
		// 当前牌型是否是特殊牌类型
        this.curSpecialType = SssLogic.getInstance().getCurSpecialType();
        this.specialCard = SssLogic.getInstance().getCurSpecialCard();
		//判断是否有开启买马功能
		let roomValue = SssLogic.getInstance().getRoomValue()
		if(roomValue.v_buyHorse==1){
			this.maCard = SssLogic.getInstance().getMaCard();
			this.maCard = this.maCard < 16 ? '0x0'+this.maCard.toString(16) : '0x'+this.maCard.toString(16)
		}
		//console.log('this.maCard', this.maCard)
		this.sssCard.SortCardList(this.handCards, 13, 0);
		this.changeHandCards()
		//console.log('转换后的数据', this.handCards)
        // this.handCards = ['0x11', '0x21', '0x2d', '0x0a', '0x2a', '0x17', '0x26', '0x16', '0x26', '0x36', '0x25', '0x34','0x03']
        // this.handCards = ['0x4f', '0x4e', '0x2d', '0x2d', '0x3b', '0x2a', '0x29', '0x28', '0x07', '0x24', '0x24', '0x24','0x12']
        // this.curSpecialType = 18
        this.sssCard.SortCardList(this.handCards, 13, 0);
		this.typeInfo = this.sssCard.GetType(this.handCards, this.handCards.length)
	}
	allClickCountZero(){
		this.onePareCC = 0;
		this.twoPareCC = 0;
		this.threeSameCC = 0;
		this.straightCC = 0;
		this.flushCC = 0;
		this.groupCC = 0;
		this.fourSameCC = 0;
		this.straightFlushCC = 0;
		this.fiveSameCC = 0;
	}
	getHandCards(){
		return this.handCards
	}
	changeHandCards(){
		for (let i = 0; i < this.handCards.length; i++) {
			if(typeof(this.handCards[i]) == 'string') continue
			this.handCards[i] = this.handCards[i] < 16 ? '0x0'+this.handCards[i].toString(16) : '0x'+this.handCards[i].toString(16);
		}
	}
	clearHandCards(){
		this.handCards = [];
	}
	removeHandCards(cardDatas){
		for(let i = 0; i<this.handCards.length;i++){
			if(this.handCards[i] == cardDatas){
				this.handCards.remove(i);
				break;
			}
		}
	}
	getChooseCards(){
		return this.arrChooseCard;
	}
	addToPier(arrCardData, count, dataName, index){
		let pierCount = this[dataName].length;
		let startIndex = 0;
		if(pierCount<index){
			startIndex = pierCount;
		}else{
			startIndex = index;
		}
		let addCount = startIndex + arrCardData.length
		if(addCount > count){
			for(let i = count; i<addCount; i++){
				this.handCards.push(arrCardData[i-startIndex])
			}
			addCount = count
		}
		for (let i = startIndex; i < addCount; i++) {
			if(this[dataName][i]){
				this.handCards.push(this[dataName][i])
				this[dataName][i] = arrCardData[i-startIndex]
			}else{
				if(arrCardData[i-startIndex]){
					this[dataName].push(arrCardData[i-startIndex])
				}
			}
		}
	}
	addChangeDT(type,value){
		//console.log('addChangeDT')
		this.selArr[type].push(value);
		let count = 0;
		for (let i = 0; i < this.selArr.length; i++){
			if (this.selArr[i].length>0) count++
		}
		if (count > 2) {
			//console.log('清理了selArr')
			this.selArr = [[],[],[]]
			this.moveTempArr = [[],[],[]]
			return
		}
		//console.log('selArr'+type, this.selArr[type])
		for (let i = 0; i < this.selArr.length; i++) {
			if (type == i) continue
			if (this.selArr[i].length == this.selArr[type].length) {
				this.bChangePierData = true;
				this.changeDt(type, i)
			}
		}
	}
	changeDt(changeToType,changeType){
		//console.log('changeDt')
		let typeName = ['upPier','midPier','downPier']
		//执行交换
		let changeData = []
		for(let j = 0; j < this.selArr[changeType].length; j++){
			for (let i = 0; i < this[typeName[changeType]].length; i++) {
				changeData.push(this[typeName[changeType]][i])
				if(this.selArr[changeType][j] == i){
					this[typeName[changeType]][i] = this[typeName[changeToType]][this.selArr[changeToType][j]]
				}
			}
		}
		//console.log(`${typeName[changeType]}`,this[typeName[changeType]])
		for(let j = 0; j < this.selArr[changeToType].length; j++){
			for (let i = 0; i < this[typeName[changeToType]].length; i++) {
				if(this.selArr[changeToType][j] == i){
					this[typeName[changeToType]][i] = changeData[this.selArr[changeType][j]]
				}
			}
		}
		//console.log(`${typeName[changeToType]}`,this[typeName[changeToType]])
		this.selArr = [[],[],[]]
		this.moveTempArr = [[],[],[]]
		this.clearTempData()
	}
	getPierData(type){
		switch (type) {
			case dunType.upPier:
				return this.upPier
				break;
			case dunType.midPier:
				return this.midPier
				break;
			case dunType.downPier:
				return this.downPier
				break;
		}
	}
	//清空数据
	clearPierData(type){
		switch (type) {
			case dunType.upPier:
				this.clearPierToHand(this.upPier)
				this.upPier = []
				break;
			case dunType.midPier:
				this.clearPierToHand(this.midPier)
				this.midPier = []
				break;
			case dunType.downPier:
				this.clearPierToHand(this.downPier)
				this.downPier = []
				break;
		}
	}
	clearTempData(){
		this.moveTempArr = [[],[],[]]
	}
	clearPierToHand(pierData){
		for(let i = 0; i<pierData.length; i++){
			this.handCards.push(pierData[i])
		}
	}
	addChooseCard(cardValue){
		this.arrChooseCard.push(cardValue)
	}
	removeChooseCard(value){
		for(let i = 0; i<this.arrChooseCard.length; i++){
			if(this.arrChooseCard[i] == value){
				this.arrChooseCard.remove(i)
			}
		}
	}
	clearChooseCard(){
		this.arrChooseCard = []
	}
	getTypeByPierValue(data){
		switch (data) {
			case SssDef.CT_SINGLE: return 'wulong';
			case SssDef.CT_ONE_DOUBLE: return 'duizi';
			case SssDef.CT_FIVE_TWO_DOUBLE: return 'liangdui';
			case SssDef.CT_THREE: return 'santiao';
			case SssDef.CT_FIVE_MIXED_FLUSH_NO_A: return 'shunzi';
			case SssDef.CT_FIVE_MIXED_FLUSH_FIRST_A: return 'shunzi';
			case SssDef.CT_FIVE_MIXED_FLUSH_BACK_A: return 'shunzi';
			case SssDef.CT_FIVE_FLUSH: return 'tonghua';
			case SssDef.CT_FIVE_THREE_DEOUBLE: return 'hulu';
			case SssDef.CT_FIVE_FOUR_ONE: return 'tiezi';
			case SssDef.CT_FIVE_STRAIGHT_FLUSH_NO_A: return 'tonghuashun';
			case SssDef.CT_FIVE_STRAIGHT_FLUSH_FIRST_A: return 'tonghuashun';
			case SssDef.CT_FIVE_STRAIGHT_FLUSH_BACK_A: return 'tonghuashun';
			case SssDef.CT_FIVE_BOMB: return 'wutong';
		}
	}
	getTypeFromPierTypeArr(data){
		for (var i = 0; i < this.pierTypeArr.length; i++) {
			this.pierTypeArr[i].value = data[this.pierTypeArr[i].key]
			// //console.log(this.pierTypeArr[i].key, this.pierTypeArr[i].value)
		}
		for (var i = 0; i < this.pierTypeArr.length; i++) {
			if(this.pierTypeArr[i].value == 1){
				return this.pierTypeArr[i].key
			}
		}
	}
	clearPierTypeArr(){
		for (var i = 0; i < this.pierTypeArr.length; i++) {
			this.pierTypeArr[i].value = 0
		}
	}
	//判断是否相公
	isAscending(){
		//console.log('first compare', this.sssCard.CompareCard(this.upPier, this.midPier, 3, 5, false))
		//console.log('second compare', this.sssCard.CompareCard(this.midPier, this.downPier, 5, 5, false))	
		if (this.sssCard.CompareCard(this.upPier, this.midPier, 3, 5, false)
		&& this.sssCard.CompareCard(this.midPier, this.downPier, 5, 5, false)){
			return false
		}
		for (let i = 0; i < 5; ++i) {
			if(this.sssCard.GetCardLogicValue(this.midPier[i]) != this.sssCard.GetCardLogicValue(this.downPier[i])
				&& this.sssCard.GetCardColor(this.midPier[i]) != this.sssCard.GetCardColor(this.downPier[i])){
				return true
			}
		}
		return false
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		node_panel:null,//
		node_remomentSet:null,//
		node_myCards:null,
		node_cardRemind:null,
		node_replace:null,
		node_upPier:null,
		node_midPier:null,
		node_downPier:null,
		pokerAtlas:null,
		autoBtn:null,
		ManualBtn:null,
		autoBtnPanel:null,
		ManualBtnPanel:null,
		confirmBtn:null,
		pierCardType:null,
		btnDuizi:null,
		btnLiangDui:null,
		btnSanTiao:null,
		btnShunZi:null,
		btnTonghua:null,
		btnHulu:null,
		btnTiezhi:null,
		btnTonghuashun:null,
		btnWutong:null,
		labIsAscending:null,
		specialRemindPanel:null,
		btnUseSpecial:null,
		btnCancelSpecial:null,
		btnSpecial:null,
		revokeBtn:null,
		labClockTime:null
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
		this.ui.node_panel = ctrl.node_panel;
		this.ui.node_remomentSet = ctrl.node_remomentSet;
		this.ui.node_myCards = ctrl.node_myCards;
		this.ui.node_cardRemind = ctrl.node_cardRemind;
		this.ui.node_replace = ctrl.node_replace;
		this.ui.node_upPier = ctrl.node_upPier;
		this.ui.node_midPier = ctrl.node_midPier;
		this.ui.node_downPier = ctrl.node_downPier;
		this.ui.pokerAtlas = ctrl.pokerAtlas;
		this.ui.autoBtn = ctrl.autoBtn;
		this.ui.manualBtn = ctrl.manualBtn;
		this.ui.autoBtnPanel = ctrl.autoBtnPanel;
		this.ui.manualBtnPanel = ctrl.manualBtnPanel;
		this.ui.confirmBtn = ctrl.confirmBtn;
		this.ui.pierCardType = ctrl.pierCardType;
		this.ui.btnDuizi=ctrl.btnDuizi;
		this.ui.btnLiangDui=ctrl.btnLiangDui;
		this.ui.btnSanTiao=ctrl.btnSanTiao;
		this.ui.btnShunZi=ctrl.btnShunZi;
		this.ui.btnTonghua=ctrl.btnTonghua;
		this.ui.btnHulu=ctrl.btnHulu;
		this.ui.btnTiezhi=ctrl.btnTiezhi;
		this.ui.btnTonghuashun=ctrl.btnTonghuashun;
		this.ui.btnWutong=ctrl.btnWutong;
		this.ui.labIsAscending=ctrl.labIsAscending;
		this.ui.specialRemindPanel=ctrl.specialRemindPanel;
		this.ui.btnUseSpecial=ctrl.btnUseSpecial;
		this.ui.btnCancelSpecial=ctrl.btnCancelSpecial;
		this.ui.btnSpecial=ctrl.btnSpecial;
		this.ui.revokeBtn=ctrl.revokeBtn;
		this.ui.labClockTime = ctrl.labClockTime;
		this.ui.autoBtn.active = false
		this.ui.manualBtn.active = false
		this.ui.node_remomentSet.active = false
		this.initHandCard()
	}
	//
	isSpecialType(){
		this.ui.specialRemindPanel.active = this.model.curSpecialType>0;
		this.ui.btnSpecial.active = this.model.curSpecialType>0;
		let labNode = this.ui.btnSpecial.getChildByName('labBtnType')
		let imgType = this.ui.specialRemindPanel.getChildByName('imgType').getComponent(cc.Sprite)
		let imagePath = ''
		switch (this.model.curSpecialType) {
			case SssDef.CT_THREE_STRAIGHT:
				labNode.getComponent(cc.Label).string = '三顺子';
				imagePath = 'Games/Sss/'+'img_sanshunzi';
				break;
			case SssDef.CT_THREE_FLUSH:
				labNode.getComponent(cc.Label).string = '三同花';
				imagePath = 'Games/Sss/'+'img_santonghua';
				break;
			case SssDef.CT_SIXPAIR:
				labNode.getComponent(cc.Label).string = '六对半';
				imagePath = 'Games/Sss/'+'img_liudui';
				break;
			case SssDef.CT_FIVEPAIR_THREE:
				labNode.getComponent(cc.Label).string = '五对三条';
				imagePath = 'Games/Sss/'+'img_wuduisantiao';
				break;
			case SssDef.CT_SAME_COLOR:
				labNode.getComponent(cc.Label).string = '凑一色';
				imagePath = 'Games/Sss/'+'img_yise';
				break;
			case SssDef.CT_ALL_SMALL:
				labNode.getComponent(cc.Label).string = '全小';
				imagePath = 'Games/Sss/'+'img_quanxiao';
				break;
			case SssDef.CT_ALL_BIG:
				labNode.getComponent(cc.Label).string = '全大';
				imagePath = 'Games/Sss/'+'img_quanda';
				break;
			case SssDef.CT_THREE_STRAIGHTFLUSH:
				labNode.getComponent(cc.Label).string = '三同花顺';
				imagePath = 'Games/Sss/'+'img_santonghuashun';
				break;
			case SssDef.CT_TWELVE_KING:
				labNode.getComponent(cc.Label).string = '十二皇族';
				imagePath = 'Games/Sss/'+'img_shierking';
				break;
			case SssDef.CT_THREE_BOMB:
				labNode.getComponent(cc.Label).string = '三分天下';
				imagePath = 'Games/Sss/'+'img_sanfen';
				break;
			case SssDef.CT_FOUR_THREESAME:
				labNode.getComponent(cc.Label).string = '四套三条';
				imagePath = 'Games/Sss/'+'img_sitaosantiao';
				break;
			case SssDef.CT_THIRTEEN:
				labNode.getComponent(cc.Label).string = '一条龙';
				imagePath = 'Games/Sss/'+'img_yitiaolong';
				break;
			case SssDef.CT_THIRTEEN_FLUSH:
				labNode.getComponent(cc.Label).string = '清龙';
				imagePath = 'Games/Sss/'+'img_qinglong';
				break;
		}
		cc.log('有没有加载到图片', imagePath)
		if(imagePath)
		{
			cc.loader.loadRes(imagePath, cc.SpriteFrame, function (err, spriteFrame) {
				if (err) return cc.error("no find image path: %s", imagePath)
				imgType.spriteFrame = spriteFrame
			});
		}
	}
	//初始化自动摆牌按钮
	initAutoBtn(){
		// this.model.sssCard.ShowCard(this.model.handCards, this.model.arrAutoGroup, this.model.topTenCardGroup, this.model.handCards.length)
		this.model.topTenCardGroup = this.model.sssCard.ShowCard(this.model.handCards, this.model.handCards.length, 100)
		//console.log('topTenCardGroup', this.model.topTenCardGroup)
		if (this.model.topTenCardGroup.length > 5) {
			this.model.topTenCardGroup.splice(5, this.model.topTenCardGroup.length-5)
		}
		let autoBtns = this.ui.node_remomentSet.getChildByName('content').children
		for (var i = 1; i < 11; i++) {
			let arrType = []
			let cardTypeName = []
			let typeNameString = []
			if(i-1>=this.model.topTenCardGroup.length){
				autoBtns[i].active = false
			}
			else{
				for (let j = 0; j < 3; j++) {
					let count = j==0?3:this.model.topTenCardGroup[i-1][j].length
					arrType[j] = this.model.sssCard.GetCardType(this.model.topTenCardGroup[i-1][j], count)
					cardTypeName[j] = this.model.getTypeByPierValue(arrType[j])
					typeNameString[j] = cardTypeString[cardTypeName[j]]
					if(typeNameString[j] == '葫芦' && j == dunType.midPier){
						typeNameString[j] = '中墩葫芦'
					}
					else if(typeNameString[j] == '三条'&& j == dunType.upPier){
						typeNameString[j] = '冲三'
					}
					else if(!typeNameString[j]){
						typeNameString[j] = '乌龙'
					}
				}
				autoBtns[i].getChildByName('left').getComponent(cc.Label).string = typeNameString[dunType.upPier]
				autoBtns[i].getChildByName('mid').getComponent(cc.Label).string = typeNameString[dunType.midPier]
				autoBtns[i].getChildByName('right').getComponent(cc.Label).string = typeNameString[dunType.downPier]
				this.model.clearPierTypeArr()
			}
		} 
	}
	//渲染手动摆牌提示按钮
	initManulBtn(){
		let btnReminds = this.ui.node_cardRemind.children
		let count = btnReminds.length
		for (var i = 0; i < count; i++) {
			btnReminds[i].getComponent(cc.Button).enableAutoGrayEffect = true;
			btnReminds[i].getComponent(cc.Button).interactable = false;
		}
		let typeInfo = this.model.sssCard.GetType(this.model.handCards, this.model.handCards.length)
		//console.log('提示按钮亮起', typeInfo)
		this.ui.btnWutong.getComponent(cc.Button).interactable = typeInfo.bFiveSame == 1;
		this.ui.btnTonghuashun.getComponent(cc.Button).interactable = typeInfo.bStraightFlush == 1;
		this.ui.btnTiezhi.getComponent(cc.Button).interactable = typeInfo.bFourSame == 1;
		this.ui.btnHulu.getComponent(cc.Button).interactable = typeInfo.bGourd == 1;
		this.ui.btnTonghua.getComponent(cc.Button).interactable = typeInfo.bFlush == 1;
		this.ui.btnShunZi.getComponent(cc.Button).interactable = typeInfo.bStraight == 1;
		this.ui.btnSanTiao.getComponent(cc.Button).interactable = typeInfo.bThreeSame == 1;
		this.ui.btnLiangDui.getComponent(cc.Button).interactable = typeInfo.bTwoPare == 1;
		this.ui.btnDuizi.getComponent(cc.Button).interactable = typeInfo.bOnePare == 1;
	}
	// //渲染手牌
	initHandCard(){
		let myCards = this.ui.node_myCards.children;
		let handCards = this.model.getHandCards();
		for(let i = 0; i<myCards.length; i++){
			let spriteName = 'bull1_'+handCards[i];
			let newFrame = this.ui.pokerAtlas.getSpriteFrame(spriteName)
			myCards[i].getComponent(cc.Sprite).spriteFrame = newFrame
			myCards[i].getChildByName('mark').active = handCards[i] == this.model.maCard
			if(handCards[i] == this.model.maCard){
				let newColor = new cc.Color(240, 241, 162)
				myCards[i].color = newColor
			}else{
				myCards[i].color = cc.Color.WHITE
			}
		}
		let card_pic_count = this.ui.node_myCards.childrenCount;
		if (card_pic_count === 0)return;
		let delTime = 0.05
		let action_list = [];
		for (let index = 0; index<card_pic_count; index++){
			let myCards = this.ui.node_myCards.children[index];
			if (!myCards)continue;
			action_list.push(cc.delayTime(delTime));
			action_list.push(cc.callFunc(()=>{
				SssAudio.getInstance().playGameFaPai();
				myCards.active = true;
			}));
		}
		action_list.push(cc.callFunc(()=>{
			this.initManulBtn();
			this.initAutoBtn();
			this.isSpecialType();
			this.ui.node_remomentSet.active = this.model.controlCustom == AUTO_CUSTOM;
			this.ui.manualBtnPanel.active = this.model.controlCustom == MANUL_CUSTOM;
			this.ui.autoBtn.active = this.model.controlCustom == MANUL_CUSTOM;
			this.ui.manualBtn.active = this.model.controlCustom == AUTO_CUSTOM;
		}));

		this.ui.node_myCards.runAction(cc.sequence(action_list));
	}

	//从牌墩中移除所有牌
	removeAllCardsFromPanel(type){
		switch (type) {
			case dunType.upPier:
				let upPierBgs = this.ui.node_upPier.children;
				this.model.clearPierData(dunType.upPier)
				this.removePierCards(upPierBgs, dunType.upPier);
			break;
			case dunType.midPier:
				let midPierBgs = this.ui.node_midPier.children;
				this.model.clearPierData(dunType.midPier)
				this.removePierCards(midPierBgs, dunType.midPier);
			break;
			case dunType.downPier:
				let downPierBgs = this.ui.node_downPier.children;
				this.model.clearPierData(dunType.downPier)
				this.removePierCards(downPierBgs, dunType.downPier);
			break;
		}
	}
	removePierCards(arrPierCards, type){
		for(let i = 0; i<arrPierCards.length; i++){
			arrPierCards[i].getChildByName('card').active = false;
		}
		//移除牌墩的牌后显示对应的手牌
		this.refHandCard()
		//刷新类型图片，并且传空
		this.refPierType([], type)
		let noClick = -1
		this.refAutoBtnShow(noClick)
	}
	//
	allCardHoming(cardType){
		if(cardType == 'hand'){
			let myCards = this.ui.node_myCards.children
			for(let i = 0; i<myCards.length; i++){
				myCards[i].setPositionY(startPos)
			}
		}
		if(cardType == 'pier'){
			let typeName = ['upPier','midPier','downPier']
			for (let i = 0; i <= dunType.downPier; i++) {
				let cards = this.ui['node_'+typeName[i]].children
				let count = this.model[typeName[i]].length
				for(let j = 0; j<cards.length; j++){
					if(this.model[typeName[i]][j] == this.model.maCard){
						let newColor = new cc.Color(240, 241, 162)
						cards[j].getChildByName('card').color = newColor
					}else{
						cards[j].getChildByName('card').color = cc.Color.WHITE
					}
				}
			}
		}	
	}
	cardHoming(cards){
		for(let i = 0; i < cards.length; i++){
			let newColor = new cc.Color(240, 241, 162)
			if(cards[i].getChildByName('card').getChildByName('mark').active == true){
				cards[i].getChildByName('card').color = newColor
			}
			else{
				cards[i].getChildByName('card').color = cc.Color.WHITE
			}
		}
	}
	//刷新、渲染手牌
	refHandCard () {
		let cardData = this.model.getHandCards()
		this.model.sssCard.SortCardList(cardData, cardData.length, 0);
		//console.log('手牌数据',cardData)
		let childrens = this.ui.node_myCards.children;
		for (let i=0; i<childrens.length; i++) {
			childrens[i].active = false;
		}
		for (let i=0; i<cardData.length; i++) {
			childrens[i].active = true
			childrens[i].getChildByName('mark').active = cardData[i] == this.model.maCard
			if(cardData[i] == this.model.maCard){
				let newColor = new cc.Color(240, 241, 162)
				childrens[i].color = newColor
			}else{
				childrens[i].color = cc.Color.WHITE
			}
			let spriteFrameName = 'bull1_'+cardData[i];
			childrens[i].getComponent(cc.Sprite).spriteFrame = this.ui.pokerAtlas.getSpriteFrame(spriteFrameName)
		}
	}
	refUpPierCard(){
		let cardData = this.model.getPierData(dunType.upPier)
		//排序
		this.model.sssCard.SortCardList(cardData, 3, 0);
		//console.log('上墩数据', cardData)
		let childrens = this.ui.node_upPier.children;
		let typeInfo = this.model.sssCard.GetType(cardData, cardData.length)
		if(cardData.length >= 2){
			if(typeInfo.bOnePare == 1){
				for (let i = 0; i < 2; i++) {
					let tempData = cardData[i]
					cardData[i] = cardData[typeInfo.cbOnePare[i]]
					cardData[typeInfo.cbOnePare[i]] = tempData
				}
			}
		}
		this.model.upPier = cardData
		//渲染
		for (let i=0; i<childrens.length; i++) {
			childrens[i].getChildByName('card').active = false;
		}
		for (let i=0; i<cardData.length; i++) {
			childrens[i].getChildByName('card').active = true
			childrens[i].getChildByName('card').getChildByName('mark').active = cardData[i] == this.model.maCard
			if(cardData[i] == this.model.maCard){
				let newColor = new cc.Color(240, 241, 162)
				let onSelArrCount = this.model.selArr[dunType.upPier].length
				let bInselArr = false
				for (let j = 0; j < onSelArrCount; j++) {
					if(i == this.model.selArr[dunType.upPier][j]){
						bInselArr = true
					}
				}
				childrens[i].getChildByName('card').color = bInselArr?cc.Color.GRAY:newColor
			}
			else{
				let onSelArrCount = this.model.selArr[dunType.upPier].length
				let bInselArr = false
				for (let j = 0; j < onSelArrCount; j++) {
					if(i == this.model.selArr[dunType.upPier][j]){
						bInselArr = true
					}
				}
				childrens[i].getChildByName('card').color = bInselArr?cc.Color.GRAY:cc.Color.WHITE
			}
			let spriteFrameName = 'bull1_'+cardData[i];
			let pokerNode = childrens[i].getChildByName('card')
			pokerNode.getComponent(cc.Sprite).spriteFrame = this.ui.pokerAtlas.getSpriteFrame(spriteFrameName)
		}
		let tempCard = [];
		for (let i=0; i<cardData.length; i++) tempCard.push(cardData[i])
		if(cardData.length == 3){
			this.refPierType(tempCard, dunType.upPier)
		}
	}
	refMidPierCard(){
		let cardData = this.model.getPierData(dunType.midPier)
		this.model.sssCard.SortCardList(cardData, 5, 0);
		//console.log('中墩数据', cardData)
		let childrens = this.ui.node_midPier.children;
		this.sortCardByType(this.model.midPier)
		for (let i=0; i<childrens.length; i++) {
			childrens[i].getChildByName('card').active = false;
		}
		for (let i=0; i<cardData.length; i++) {
			childrens[i].getChildByName('card').active = true
			childrens[i].getChildByName('card').getChildByName('mark').active = cardData[i] == this.model.maCard
			if(cardData[i] == this.model.maCard){
				let newColor = new cc.Color(240, 241, 162)
				let onSelArrCount = this.model.selArr[dunType.midPier].length
				let bInselArr = false
				for (let j = 0; j < onSelArrCount; j++) {
					if(i == this.model.selArr[dunType.midPier][j]){
						bInselArr = true
					}
				}
				childrens[i].getChildByName('card').color = bInselArr?cc.Color.GRAY:newColor
			}
			else{
				let onSelArrCount = this.model.selArr[dunType.midPier].length
				let bInselArr = false
				for (let j = 0; j < onSelArrCount; j++) {
					if(i == this.model.selArr[dunType.midPier][j]){
						bInselArr = true
					}
				}
				childrens[i].getChildByName('card').color = bInselArr?cc.Color.GRAY:cc.Color.WHITE
			}
			let spriteFrameName = 'bull1_'+cardData[i];
			let pokerNode = childrens[i].getChildByName('card')
			pokerNode.getComponent(cc.Sprite).spriteFrame = this.ui.pokerAtlas.getSpriteFrame(spriteFrameName)
		}
		let tempCard = [];
		for (let i=0; i<cardData.length; i++) tempCard.push(cardData[i])
		if(cardData.length == 5){
			this.refPierType(tempCard, dunType.midPier)
		}

		//console.log('中墩数据2', cardData)
	}
	refDownPierCard(){
		let cardData = this.model.downPier//getPierData(dunType.downPier)
		this.model.sssCard.SortCardList(cardData, 5, 0);
		//console.log('尾墩数据', cardData)
		let childrens = this.ui.node_downPier.children;
		this.sortCardByType(cardData)
		//console.log('尾墩数据2', this.model.downPier)
		for (let i=0; i<childrens.length; i++) {
			childrens[i].getChildByName('card').active = false;
		}
		for (let i=0; i<cardData.length; i++) {
			childrens[i].getChildByName('card').active = true
			childrens[i].getChildByName('card').getChildByName('mark').active = cardData[i] == this.model.maCard
			if(cardData[i] == this.model.maCard){
				let newColor = new cc.Color(240, 241, 162)
				let onSelArrCount = this.model.selArr[dunType.downPier].length
				let bInselArr = false
				for (let j = 0; j < onSelArrCount; j++) {
					if(i == this.model.selArr[dunType.downPier][j]){
						bInselArr = true
					}
				}
				childrens[i].getChildByName('card').color = bInselArr?cc.Color.GRAY:newColor
			}
			else{
				let onSelArrCount = this.model.selArr[dunType.downPier].length
				let bInselArr = false
				for (let j = 0; j < onSelArrCount; j++) {
					if(i == this.model.selArr[dunType.downPier][j]){
						bInselArr = true
					}
				}
				childrens[i].getChildByName('card').color = bInselArr?cc.Color.GRAY:cc.Color.WHITE
			}
			let spriteFrameName = 'bull1_'+cardData[i];
			let pokerNode = childrens[i].getChildByName('card')
			pokerNode.getComponent(cc.Sprite).spriteFrame = this.ui.pokerAtlas.getSpriteFrame(spriteFrameName)
		}
		let tempCard = [];
		for (let i=0; i<cardData.length; i++) tempCard.push(cardData[i])
		if(cardData.length == 5){
			this.refPierType(tempCard, dunType.downPier)
		}
	}
	//牌墩内的牌重新排序
	sortCardByType(cardData){
		//排序
		let type = this.model.sssCard.GetCardType(cardData, cardData.length)
		//console.log('牌墩内的扑克牌牌型', type)
		if(type == SssDef.CT_FIVE_MIXED_FLUSH_NO_A
			||type == SssDef.CT_FIVE_MIXED_FLUSH_FIRST_A
			||type == SssDef.CT_FIVE_MIXED_FLUSH_BACK_A
			||type == SssDef.CT_FIVE_STRAIGHT_FLUSH_NO_A
			||type == SssDef.CT_FIVE_STRAIGHT_FLUSH_FIRST_A
			||type == SssDef.CT_FIVE_STRAIGHT_FLUSH_BACK_A
			||type == SssDef.CT_FIVE_BOMB){
			return
		}
		if (type == SssDef.CT_FIVE_THREE_DEOUBLE && this.model.sssCard.GetCardLogicValue(cardData[0])>=SssDef.CARD_XW){
			//console.log('进行带鬼葫芦的排序')
			this.sortGourdWithJorke(cardData)
		}
		else if(type == SssDef.CT_FIVE_FLUSH && this.model.sssCard.GetCardLogicValue(cardData[0])>=SssDef.CARD_XW){
			let typeInfo = this.model.sssCard.GetType(cardData, cardData.length) 
			if(typeInfo.bOnePare == 1 && this.model.sssCard.GetCardLogicValue(cardData[1])<SssDef.CARD_XW){
				this.sortOnePareWithJorke(cardData)
			}
		}
		else if(type == SssDef.CT_FIVE_FOUR_ONE &&this.model.sssCard.GetCardLogicValue(cardData[0])>=SssDef.CARD_XW){
			//console.log('进行带鬼铁支的排序')
			this.sortFourWithJorke(cardData)
		}
		else if(type == SssDef.CT_THREE && this.model.sssCard.GetCardLogicValue(cardData[0])>=SssDef.CARD_XW){
			//console.log('进行带鬼三条的排序')
			this.sortThreeWithJorke(cardData)
		}
		else if(type == SssDef.CT_ONE_DOUBLE && this.model.sssCard.GetCardLogicValue(cardData[0])>=SssDef.CARD_XW){
			//console.log('进行带鬼单对的排序')
			this.sortOnePareWithJorke(cardData)
		}
		else if(type == SssDef.CT_FIVE_FLUSH){
			let typeInfo = this.model.sssCard.GetType(cardData, cardData.length)
			if(typeInfo.bThreeSame == 1){
				this.sortThreeSame (cardData)
			}
			else if(typeInfo.bTwoPare == 1){
				this.sortTwoPare(cardData)
			}
			else if(typeInfo.bOnePare == 1){
				this.sortOnePare (cardData)
			}
		}
		else if(type == SssDef.CT_FIVE_THREE_DEOUBLE){
			//console.log('进行葫芦的排序')
			this.sortGourd(cardData)
		}
		else if(type == SssDef.CT_FIVE_FOUR_ONE){
			//console.log('进行铁支的排序')
			this.sortFourSame(cardData)
		}
		else if(type == SssDef.CT_FIVE_TWO_DOUBLE){
			//console.log('进行两对的排序')
			this.sortTwoPare(cardData)
		}
		else if(type == SssDef.CT_THREE){
			//console.log('进行三条的排序')
			this.sortThreeSame (cardData)
		}
		else if(type == SssDef.CT_ONE_DOUBLE){
			//console.log('进行一对的排序')
			this.sortOnePare (cardData)
		}
	}
	sortOnePareWithJorke (cardData) {
		let cardDict = {}
		for (let i=0; i<cardData.length; i++) {
			let count = cardDict[cardData[i]];
			let v = parseInt(cardData[i])%16;
			if (!cardDict[v]) cardDict[v] = []
			cardDict[v].push(cardData[i])
		}
		let wangCard = 0;
		let singleCard = [];
		for (let key in cardDict) {
			if (key == 14 || key == 15){
				wangCard=cardDict[key][0]
			}
			else{
				for(let i=0; i<cardDict[key].length; i++){
					singleCard.push(cardDict[key][i])
				}
			}
		}
		singleCard.sort(function (a, b) {
			let valueA = parseInt(a)%16;
			let valueB = parseInt(b)%16;
			valueA = valueA==14||valueA==15?valueA+1:valueA;
			valueB = valueB==14||valueB==15?valueB+1:valueB;
			let tempA = valueA==1 ? valueA+13 : valueA;
			let tempB = valueB==1 ? valueB+13 : valueB;
			return tempA<tempB;
		})
		let tempArr = []
		tempArr[0] = wangCard;
		tempArr[1] = singleCard[0]
		tempArr[2] = singleCard[1]
		tempArr[3] = singleCard[2]
		tempArr[4] = singleCard[3]
		for(let i = 0; i<cardData.length; i++){
			cardData[i] = tempArr[i]
		}
	}
	sortFourWithJorke (cardData) {
		let cardDict = {}
		for (let i=0; i<cardData.length; i++) {
			let count = cardDict[cardData[i]];
			let v = parseInt(cardData[i])%16;
			if (!cardDict[v]) cardDict[v] = []
			cardDict[v].push(cardData[i])
		}
		let singleArr = [];
		let sameCard = [];
		for (let key in cardDict) {
			if (cardDict[key].length >= 2) sameCard = cardDict[key]
			else singleArr.push(cardDict[key][0])
		}
		singleArr.sort(function (a, b) {
			let valueA = parseInt(a)%16;
			let valueB = parseInt(b)%16;
			valueA = valueA==14||valueA==15?valueA+1:valueA;
			valueB = valueB==14||valueB==15?valueB+1:valueB;
			let tempA = valueA==1 ? valueA+13 : valueA;
			let tempB = valueB==1 ? valueB+13 : valueB;
			return tempA<tempB;
		})
		let sameCardCount = sameCard.length
		for (let i = 0; i < cardData.length; i++) {
			if(i>sameCardCount-1) cardData[i] = singleArr[i-sameCardCount]
			else cardData[i] = sameCard[i]
		}
	}
	sortGourdWithJorke (cardData) {
		let cardDict = {}
		for (let i=0; i<cardData.length; i++) {
			let count = cardDict[cardData[i]];
			let v = parseInt(cardData[i])%16;
			if (!cardDict[v]) cardDict[v] = []
			cardDict[v].push(cardData[i])
		}
		let keyArr = [];
		let wangCard = 0;
		for (let key in cardDict) {
			if (cardDict[key].length < 2) wangCard = cardDict[key][0]
			else keyArr.push(cardDict[key])
		}
		keyArr.sort(function (a, b) {
			let valueA = parseInt(a[0])%16;
			let valueB = parseInt(b[0])%16;
			valueA = valueA==14||valueA==15?valueA+1:valueA;
			valueB = valueB==14||valueB==15?valueB+1:valueB;
			let tempA = valueA==1 ? valueA+13 : valueA;
			let tempB = valueB==1 ? valueB+13 : valueB;
			return tempA<tempB;
		})
		cardData[0] = wangCard;
		cardData[1] = keyArr[0][0];
		cardData[2] = keyArr[0][1];
		cardData[3] = keyArr[1][0];
		cardData[4] = keyArr[1][1];
	}
	sortThreeWithJorke (cardData) {
		//console.log('带鬼三条排序前', cardData)
		let cardDict = {}
		for (let i=0; i<cardData.length; i++) {
			let count = cardDict[cardData[i]];
			let v = parseInt(cardData[i])%16;
			//console.log('vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv', v)
			if (!cardDict[v]) cardDict[v] = []
			cardDict[v].push(cardData[i])
		}
		//console.log(cardDict)
		let keyArr = [];
		if(this.model.sssCard.GetCardLogicValue(cardData[1])<SssDef.CARD_XW){
			let twoCard = [];
			let singleCard = [];
			let wangCard = 0;
			for (let key in cardDict) {
				if (cardDict[key].length === 2) twoCard = cardDict[key]
				else if (key == 14 || key == 15) wangCard = cardDict[key][0]
				else singleCard.push(cardDict[key][0])
			}
			singleCard.sort(function (a, b) {
				let valueA = parseInt(a)%16;
				let valueB = parseInt(b)%16;
				valueA = valueA==14||valueA==15?valueA+1:valueA;
				valueB = valueB==14||valueB==15?valueB+1:valueB;
				let tempA = valueA==1 ? valueA+13 : valueA;
				let tempB = valueB==1 ? valueB+13 : valueB;
				return tempA<tempB;
			})
			let tempArr = [];
			tempArr[0] = wangCard
			tempArr[1] = twoCard[0]
			tempArr[2] = twoCard[1]
			tempArr[3] = singleCard[0]
			tempArr[4] = singleCard[1]
			for (let i=0; i<cardData.length; i++) {
				cardData[i] = tempArr[i]
			}
		}
		else if (this.model.sssCard.GetCardLogicValue(cardData[1]) == SssDef.CARD_XW){
			let singleCard = [];
			let wangCard = [];
			for (let key in cardDict) {
				if (key == 14 || key == 15) wangCard.push(cardDict[key][0])
				else singleCard.push(cardDict[key][0])
			}
			singleCard.sort(function (a, b) {
				let valueA = parseInt(a)%16;
				let valueB = parseInt(b)%16;
				valueA = valueA==14||valueA==15?valueA+1:valueA;
				valueB = valueB==14||valueB==15?valueB+1:valueB;
				let tempA = valueA==1 ? valueA+13 : valueA;
				let tempB = valueB==1 ? valueB+13 : valueB;
				return tempA<tempB;
			})
			let tempArr = [];
			tempArr[0] = wangCard[0]
			tempArr[1] = wangCard[1]
			tempArr[2] = singleCard[0]
			tempArr[3] = singleCard[1]
			tempArr[4] = singleCard[2]
			for (let i=0; i<cardData.length; i++) {
				cardData[i] = tempArr[i]
			}
		}
		//console.log('带鬼三条排序后', cardData)
	}
	sortTwoPare (cardData) {
		let cardDict = {}
		for (let i=0; i<cardData.length; i++) {
			let count = cardDict[cardData[i]];
			let v = parseInt(cardData[i])%16;
			if (!cardDict[v]) cardDict[v] = []
			cardDict[v].push(cardData[i])
		}
		//console.log(cardDict)
		let keyArr = [];
		let singleCard = 0;
		for (let key in cardDict) {
			if (cardDict[key].length < 2) singleCard = cardDict[key][0]
			else keyArr.push(cardDict[key])
		}
		keyArr.sort(function (a, b) {
			let valueA = parseInt(a[0])%16;
			let valueB = parseInt(b[0])%16;
			valueA = valueA==14||valueA==15?valueA+1:valueA;
			valueB = valueB==14||valueB==15?valueB+1:valueB;
			let tempA = valueA==1 ? valueA+13 : valueA;
			let tempB = valueB==1 ? valueB+13 : valueB;
			return tempA<tempB;
		})
		let tempArr = [];
		tempArr [0] = keyArr[0][0]
		tempArr [1] = keyArr[0][1]
		tempArr [2] = keyArr[1][0]
		tempArr [3] = keyArr[1][1]
		tempArr [4] = singleCard
		for (let i=0; i<cardData.length; i++) {
			cardData[i] = tempArr[i]
		}
	}
	sortGourd (cardData) {
		let cardDict = {}
		for (let i=0; i<cardData.length; i++) {
			let count = cardDict[cardData[i]];
			let v = parseInt(cardData[i])%16;
			if (!cardDict[v]) cardDict[v] = []
			cardDict[v].push(cardData[i])
		}
		//console.log(cardDict)
		let threeCard = [];
		let twoCard = [];
		for (let key in cardDict) {
			if (cardDict[key].length === 3) 
				threeCard = cardDict[key];
			else
				twoCard = cardDict[key];
		}
		let tempArr = [];
		tempArr[0] = threeCard[0]
		tempArr[1] = threeCard[1]
		tempArr[2] = threeCard[2]
		tempArr[3] = twoCard[0]
		tempArr[4] = twoCard[1]
		for (let i=0; i<cardData.length; i++) {
			cardData[i] = tempArr[i]
		}
	}
	sortFourSame (cardData) {
		let cardDict = {}
		for (let i=0; i<cardData.length; i++) {
			let count = cardDict[cardData[i]];
			let v = parseInt(cardData[i])%16;
			if (!cardDict[v]) cardDict[v] = []
			cardDict[v].push(cardData[i])
		}
		let keyArr = [];
		let singleCard = 0;
		for (let key in cardDict) {
			if (cardDict[key].length < 2) singleCard = cardDict[key][0]
			else keyArr.push(cardDict[key])
		}
		keyArr.sort(function (a, b) {
			let valueA = parseInt(a[0])%16;
			let valueB = parseInt(b[0])%16;
			valueA = valueA==14||valueA==15?valueA+1:valueA;
			valueB = valueB==14||valueB==15?valueB+1:valueB;
			let tempA = valueA==1 ? valueA+13 : valueA;
			let tempB = valueB==1 ? valueB+13 : valueB;
			return tempA<tempB;
		})
		let tempArr = [];
		tempArr [0] = keyArr[0][0]
		tempArr [1] = keyArr[0][1]
		tempArr [2] = keyArr[0][2]
		tempArr [3] = keyArr[0][3]
		tempArr [4] = singleCard
		for (let i=0; i<cardData.length; i++) {
			cardData[i] = tempArr[i]
		}
	}
	sortThreeSame (cardData) {
		//console.log("三条排序前", cardData)
		let cardDict = {}
		for (let i=0; i<cardData.length; i++) {
			let count = cardDict[cardData[i]];
			let v = parseInt(cardData[i])%16;
			if (!cardDict[v]) cardDict[v] = []
			cardDict[v].push(cardData[i])
		}
		//console.log(cardDict)
		let threeCard = [];
		let singleArr = [];
		for (let key in cardDict) {
			if (cardDict[key].length === 3) 
				threeCard = cardDict[key];
			else
				singleArr.push(cardDict[key][0]);
		}
		singleArr.sort(function (a, b) {
			let valueA = parseInt(a)%16;
			let valueB = parseInt(b)%16;
			valueA = valueA==14||valueA==15?valueA+1:valueA;
			valueB = valueB==14||valueB==15?valueB+1:valueB;
			let tempA = valueA==1 ? valueA+13 : valueA;
			let tempB = valueB==1 ? valueB+13 : valueB;
			return tempA<tempB;
		})
		let tempArr = [];
		tempArr[0] = threeCard[0]
		tempArr[1] = threeCard[1]
		tempArr[2] = threeCard[2]
		tempArr[3] = singleArr[0]
		tempArr[4] = singleArr[1]
		for (let i=0; i<cardData.length; i++) {
			cardData[i] = tempArr[i]
		}
		//console.log("三条排序后", cardData)
	}
	sortOnePare (cardData) {
		//console.log("一对排序前", cardData);
		let cardDict = {}
		for (let i=0; i<cardData.length; i++) {
			let count = cardDict[cardData[i]];
			let v = parseInt(cardData[i])%16;
			if (!cardDict[v]) cardDict[v] = []
			cardDict[v].push(cardData[i])
		}
		//console.log(cardDict)
		let singlePair = [];
		let singleArr = [];
		for (let key in cardDict) {
			if (cardDict[key].length < 2) singleArr.push(cardDict[key][0])
			else singlePair = cardDict[key]
		}
		singleArr.sort(function (a, b) {
			let valueA = parseInt(a)%16;
			let valueB = parseInt(b)%16;
			valueA = valueA==14||valueA==15?valueA+1:valueA;
			valueB = valueB==14||valueB==15?valueB+1:valueB;
			let tempA = valueA==1 ? valueA+13 : valueA;
			let tempB = valueB==1 ? valueB+13 : valueB;
			return tempA<tempB;
		})
		let tempArr = [];
		tempArr[0] = singlePair[0];
		tempArr[1] = singlePair[1];
		tempArr[2] = singleArr[0];
		tempArr[3] = singleArr[1];
		tempArr[4] = singleArr[2];
		for (let i=0; i<cardData.length; i++) {
			cardData[i] = tempArr[i]
		}
		//console.log("一对排序后", cardData);
	}
	configComplete(){
		if(this.model.getHandCards().length == 0){
			this.ui.confirmBtn.active = true
			this.ui.revokeBtn.active = true
			let bAscending = this.model.isAscending()
			//console.log('是否相公牌型',bAscending)
			this.ui.labIsAscending.node.active = bAscending;
			this.ui.confirmBtn.getComponent(cc.Button).interactable = !bAscending;
		}else{
			this.ui.confirmBtn.getComponent(cc.Button).interactable = true;
			this.ui.confirmBtn.active = false
			this.ui.revokeBtn.active = false
			this.ui.labIsAscending.node.active = false
		}
	}
	refPierType(cardData, pierType){
		let nodeName = ['up','mid','down']
		let type = this.model.sssCard.GetCardType(cardData, cardData.length)
		let cardTypeName = this.model.getTypeByPierValue(type)
		let spriteName = cardTypeName
		//console.log('如果传空会怎么样', spriteName)
		if(spriteName == 'hulu' && pierType == dunType.midPier){
			spriteName = 'zhongdunhulu'
		}
		else if(spriteName == 'santiao'&& pierType == dunType.upPier){
			spriteName = 'chongsan'
		}
		else if(!spriteName){
			//console.log('如果传空会怎么样2',)
			spriteName = 'wulong'
		}
		//console.log('类型名称', cardTypeName)
		//console.log('牌型图片名称', spriteName)
		let typeNode = this.ui.pierCardType.getChildByName(nodeName[pierType])
		if(!cardData.length){
			typeNode.active = false
		}else{
			typeNode.active = true;
		}
		let imagePath = 'Games/Sss/'+ spriteName;
		//console.log('图片路径', imagePath)
		cc.loader.loadRes(imagePath, cc.SpriteFrame, function (err, spriteFrame) {
			if (err) return cc.error("no find image path: %s", imagePath);
			//console.log('图片取到了吗？', spriteFrame)
			typeNode.getComponent(cc.Sprite).spriteFrame = spriteFrame
		});
		this.model.clearPierTypeArr()
	}
	refManulBtnShow(){
		let handCards = this.model.getHandCards()
		let typeInfo = this.model.sssCard.GetType(handCards, handCards.length)
		//console.log('ManulBtn', typeInfo)
		this.ui.btnWutong.getComponent(cc.Button).interactable = typeInfo.bFiveSame == 1;
		this.ui.btnTonghuashun.getComponent(cc.Button).interactable = typeInfo.bStraightFlush == 1;
		this.ui.btnTiezhi.getComponent(cc.Button).interactable = typeInfo.bFourSame == 1;
		this.ui.btnHulu.getComponent(cc.Button).interactable = typeInfo.bGourd == 1;
		this.ui.btnTonghua.getComponent(cc.Button).interactable = typeInfo.bFlush == 1;
		this.ui.btnShunZi.getComponent(cc.Button).interactable = typeInfo.bStraight == 1;
		this.ui.btnSanTiao.getComponent(cc.Button).interactable = typeInfo.bThreeSame == 1;
		this.ui.btnLiangDui.getComponent(cc.Button).interactable = typeInfo.bTwoPare == 1;
		this.ui.btnDuizi.getComponent(cc.Button).interactable = typeInfo.bOnePare == 1;
	}
	refAutoBtnShow(index){
		let handCards = this.model.getHandCards()
		if(!this.model.getHandCards().length){
			let autoBtns = this.ui.node_remomentSet.getChildByName('content').children
			for (let i = 0; i < autoBtns.length; i++) {
				if(i == index){
					autoBtns[i].getComponent(cc.Button).interactable = false;
				}else{
					autoBtns[i].getComponent(cc.Button).interactable = true;
				}
			}
		}
		if(this.model.getHandCards().length == 13 ){
			let autoBtns = this.ui.node_remomentSet.getChildByName('content').children
			for (let i = 0; i < autoBtns.length; i++) {
				autoBtns[i].getComponent(cc.Button).interactable = true;
			}
		}
	}
	allAutoBtnShow(){
		let autoBtns = this.ui.node_remomentSet.getChildByName('content').children
		for (let i = 0; i < autoBtns.length; i++) {
			autoBtns[i].getComponent(cc.Button).interactable = true;
		}
	}
}

//c, 控制
@ccclass
export default class SssSeatCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property(cc.Node)
	node_panel = null;
	@property(cc.Node)
	node_remomentSet = null;
	@property(cc.Node)
	node_myCards = null;

	@property(cc.Node)
	node_cardRemind = null;

	@property(cc.Node)
	node_upPier = null;

	@property(cc.Node)
	node_midPier = null;

	@property(cc.Node)
	node_downPier = null;

	@property(cc.Node)
	node_replace = null;

	@property(cc.SpriteAtlas)
	pokerAtlas = null;

	@property(cc.Node)
	autoBtn = null;

	@property(cc.Node)
	manualBtn = null;

	@property(cc.Node)
	autoBtnPanel = null;

	@property(cc.Node)
	manualBtnPanel = null;

	@property(cc.Node)
	confirmBtn = null;

	@property(cc.Node)
	revokeBtn = null;

	@property(cc.Node)
	pierCardType = null;

	@property(cc.Node)
	btnDuizi = null;

	@property(cc.Node)
	btnLiangDui = null;

	@property(cc.Node)
	btnSanTiao = null;

	@property(cc.Node)
	btnShunZi = null;

	@property(cc.Node)
	btnTonghua = null;

	@property(cc.Node)
	btnHulu = null;

	@property(cc.Node)
	btnTiezhi = null;

	@property(cc.Node)
	btnTonghuashun = null;

	@property(cc.Node)
	btnWutong = null;

	@property(cc.Label)
	labIsAscending = null;

	@property(cc.Node)
	specialRemindPanel = null;

	@property(cc.Node)
	btnUseSpecial = null;

	@property(cc.Node)
	btnCancelSpecial = null;

	@property(cc.Node)
	btnSpecial = null;

	@property(cc.Label)
	labClockTime = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		ctrl.initMvc(Model,View);
		this.scheduleCallback = function(){
			this.updateTime()
		}
		// cc.director.getScheduler().schedule(this.updateTime, this, 1);
		this.schedule(this.scheduleCallback, 1)
		// this.model.initSeat(this.seatId);
	}
	updateTime(){
		this.model.timesLab--;
		this.ui.labClockTime.string = this.model.timesLab;
		//console.log('aaaaa')
		if(this.model.timesLab<1){
			// if(this.model.curSpecialType>0){
			// 	this.specialConfirmCB()
			// }
			// else{
			// 	this.autoBtnCB(0)
			// 	this.confirmCB()
			// }
			// cc.director.getScheduler().unschedule(this.updateTime, this)
			this.unschedule(this.scheduleCallback)
		}
	}
	//定义网络事件
	defineNetEvents()
	{
		this.n_events={
		// 	//网络消息监听列表
		// 	'onEnterRoom':this.onEnterRoom,
		// 	'onLeaveRoom':this.onLeaveRoom,
		// 	onSyncData:this.onSyncData, 
		// 	onProcess:this.onProcess,
		// 	'http.reqUsers':this.http_reqUsers,
			"onDissolutionRoom": this.onDissolutionRoom,
			"connector.entryHandler.enterRoom": this.connector_entryHandler_enterRoom,
		} 

	}
	//定义全局事件
	defineGlobalEvents()
	{
		//全局消息	  
	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image, this.ui.autoBtn, this.changeAutoOrManual, '切换成自动摆牌')
		this.connect(G_UiType.image, this.ui.manualBtn, this.changeAutoOrManual, '切换成手动摆牌')
		this.connect(G_UiType.button, this.ui.btnUseSpecial, this.specialConfirmCB, '确认使用特殊牌型')
		this.connect(G_UiType.button, this.ui.btnCancelSpecial, this.specialCancelCB, '取消使用特殊牌型')
		this.connect(G_UiType.button, this.ui.btnSpecial, this.specialConfirmCB, '配牌界面确认使用特殊牌型')
		this.connect(G_UiType.button, this.ui.revokeBtn, this.revokeCB, '取消、撤回牌墩所有牌')
		//绑定手动摆牌提示按钮
		this.bindClick(this.ui.btnDuizi, 
			{
				touchmove: ()=>{},
				touchend: ()=>{},
				touchcancel: ()=>{},
				click: this.onePareCB.bind(this),
			}, '确认点击了对子按钮')
		this.bindClick(this.ui.btnLiangDui, 
			{
				touchmove: ()=>{},
				touchend: ()=>{},
				touchcancel: ()=>{},
				click: this.twoPareCB.bind(this),
			}, '确认点击了两对按钮')
		this.bindClick(this.ui.btnSanTiao, 
			{
				touchmove: ()=>{},
				touchend: ()=>{},
				touchcancel: ()=>{},
				click: this.threeSameCB.bind(this),
			}, '确认点击了三条按钮')
		this.bindClick(this.ui.btnShunZi, 
			{
				touchmove: ()=>{},
				touchend: ()=>{},
				touchcancel: ()=>{},
				click: this.straightCB.bind(this),
			}, '确认点击了顺子按钮')
		this.bindClick(this.ui.btnTonghua, 
			{
				touchmove: ()=>{},
				touchend: ()=>{},
				touchcancel: ()=>{},
				click: this.flushCB.bind(this),
			}, '确认点击了顺子按钮')
		this.bindClick(this.ui.btnHulu, 
			{
				touchmove: ()=>{},
				touchend: ()=>{},
				touchcancel: ()=>{},
				click: this.groupCB.bind(this),
			}, '确认点击了葫芦按钮')
		this.bindClick(this.ui.btnTiezhi, 
			{
				touchmove: ()=>{},
				touchend: ()=>{},
				touchcancel: ()=>{},
				click: this.fourSameCB.bind(this),
			}, '确认点击了铁支按钮')
		this.bindClick(this.ui.btnTonghuashun, 
			{
				touchmove: ()=>{},
				touchend: ()=>{},
				touchcancel: ()=>{},
				click: this.straightFlushCB.bind(this),
			}, '确认点击了同花顺按钮')
		this.bindClick(this.ui.btnWutong, 
			{
				touchmove: ()=>{},
				touchend: ()=>{},
				touchcancel: ()=>{},
				click: this.fiveSameCB.bind(this),
			}, '确认点击了五同按钮')
		this.bindClick(this.ui.confirmBtn, {
			touchmove: ()=>{},
			touchend: ()=>{},
			touchcancel: ()=>{},
			click: this.confirmCB.bind(this),
		}, '点击了确认')
		//绑定自动摆牌的按钮
		let autoBtns = this.ui.node_remomentSet.getChildByName('content').children
		for (let i = 1; i < autoBtns.length; i++) {
			let cb = ()=>{
				this.autoBtnCB(i-1)
			}
			this.bindClick(autoBtns[i], {
				touchmove: ()=>{},
				touchend: ()=>{},
				touchcancel: ()=>{},
				click: cb,
			}, `点击自动摆牌&确认使用${i}该方案`)
		}
		//绑定所有的重置按钮
		let replaceBtns = this.ui.node_replace.children;
		for(let i = 0; i<replaceBtns.length; i++){
			let cb =function(){
				this.clickReplace(i)
			}
			this.connect(G_UiType.image, replaceBtns[i], cb, `点击摆牌重置按钮&取消当前${i}墩的摆牌`)
		}


		//绑定所有的手牌
		let cardcount = SssDef.cardcount;
		let myCards = this.ui.node_myCards.children;
		for(let i = 0; i<cardcount; i++){
			let cb = () => {
				//随便构造下每张牌的值
				let value = this.model.getHandCards()[i]
				//console.log('选中牌的value', value)
				this.clickMyCard(i, value)
			}
			this.bindHandCardClick(myCards[i], {
				touchmove: this.moveChooseCB.bind(this),
				touchend: this.clickEnd.bind(this),
				touchcancel: this.chooseMyCardEnd.bind(this),
				click: cb,
			})
		}
		//绑定牌墩的背景
		this.connectCardBg(this.ui.node_upPier, dunType.upPier)
		this.connectCardBg(this.ui.node_midPier, dunType.midPier)
		this.connectCardBg(this.ui.node_downPier, dunType.downPier)
	}

	connectCardBg(nodePier, type){
		let cardBgs = nodePier.children;
		for (let i = 0; i < cardBgs.length; i++) {
			let cb = ()=>{
				let value = this.model.getPierData(type)[i]
				this.clickCardBgs(type, i, value)
			}
			this.bindClick(cardBgs[i], {
				touchmove: this.pierMoveChooseCB.bind(this),
				touchend: ()=>{},
				touchcancel: this.addDataEnd.bind(this),
				click: cb,
			}, '')
		}
	}
	bindClick (node, obj, opname) {
		node.on('touchstart', function (event) { 
			//console.log('执行了touchstart')
		},this);
		node.on('touchmove', function (event) {
			obj.touchmove(node, event);
		},this);
		node.on('touchend', function (event) { 
			//console.log('执行了end')
			obj.touchend(node, event);
		},this);
		node.on('touchcancel', function (event) { 
			//console.log('执行了cancel')
			obj.touchcancel(node, event);
		},this);
		node.on('click', function (event) {
			AudioMgr.getInstance().play(opname)
			//console.log('执行click')
			obj.click()
		},this)
	}
	bindHandCardClick (node, obj) {
		node.isClick = true;
		node.on('touchstart', function (event) {
			obj.click()
		},this);
		node.on('touchmove', function (event) {
			let curPosX = node.parent.convertToNodeSpace(event.getLocation()).x
			let handCardCount = this.model.handCards.length;
			let lastCardX = handCardCount == node.name ? node.x+node.width/2 : node.x+38
			node.isClick = node.x-node.width/2 < curPosX && curPosX < lastCardX;
			if (node.isClick) return
			//console.log("执行move", 'node.isClick', node.isClick)
			obj.touchmove(node, event);
		},this);
		node.on('touchend', function (event) { 
			let curPosX = node.parent.convertToNodeSpace(event.getLocation()).x
			let handCardCount = this.model.handCards.length;
			let lastCardX = handCardCount == node.name ? node.x+node.width/2 : node.x+38
			if (lastCardX < curPosX || curPosX < node.x-node.width/2) {
				obj.touchcancel(node, event);
				node.isClick = true;
			}
			else
				obj.touchend(node, event);
		},this);
		node.on('touchcancel', function (event) { 
			//console.log('touchcancel')
			obj.touchcancel(node, event);
			node.isClick = true;
		},this);
		node.on('click', function (event) {
		},this)
	}

	start () {
	}
	changeAutoOrManual(node, event){
		//console.log(node, event)
		this.ui.manualBtn.active = node.name != 'hand';
		this.ui.manualBtnPanel.active = node.name == 'hand';
		this.ui.autoBtn.active = node.name == 'hand';
		this.ui.autoBtnPanel.active = node.name != 'hand';
	}

	confirmCB() {
		let typeName = ['upPier','midPier','downPier'];
		let cardList = [[],[],[]];
		for(let i = 0; i < typeName.length; ++i){
			for(let j = 0; j < this.model[typeName[i]].length; ++j){
				cardList[i].push(parseInt(this.model[typeName[i]][j]));
			}
		}
		this.model.controlCustom = this.ui.autoBtnPanel.active ? AUTO_CUSTOM : MANUL_CUSTOM;
		LocalStorage.getInstance().setSssControlCustom(this.model.controlCustom)
        SssLogic.getInstance().send_peipai(cardList, 0);
		this.finish();
	}
	//全部撤回
	revokeCB() {
		let typeName = ['upPier', 'midPier', 'downPier']
		for (let i = 0; i < 3; i++) {
			this.view.removeAllCardsFromPanel(i)
		}
		this.model.clearChooseCard()
		this.model.chooseTempArr = []
		this.model.selArr = [[],[],[]]
		this.model.moveTempArr = [[],[],[]]
		this.view.allCardHoming('hand')
		this.view.configComplete()
		this.view.refManulBtnShow()
		this.view.allAutoBtnShow()
	}
	//重置某一牌墩
	clickReplace(index){
		this.view.removeAllCardsFromPanel(index)
		this.model.clearChooseCard()
		this.model.chooseTempArr = []
		this.model.selArr = [[],[],[]]
		this.model.moveTempArr = [[],[],[]]
		this.view.allCardHoming('hand')
		this.view.configComplete()
		this.view.refManulBtnShow()
		this.view.allAutoBtnShow()
	}
	//滑动选择 牌墩卡牌
	pierMoveChooseCB(node, event){
		let type = dunType[node.parent.name]
		//console.log('bMoveSel'+type, this.model.bMoveSel[type])
		let value = this.model.getPierData(type)
		if(!value.length){
			return
		}
		if(this.model.getChooseCards().length!=0){
			return
		}
		let startPos = this.ui['node_'+node.parent.name].convertToNodeSpace(event.getStartLocation())
		//console.log("startPos", startPos)
		let clickPos = this.ui['node_'+node.parent.name].convertToNodeSpace(event.getLocation())
		//console.log('clickPos', clickPos)
		//this.ui['node_'+node.name].convertToNodeSpace(event.getLocation())
		let cards = this.ui['node_'+node.parent.name].children
		let count = value.length
		for (let i = 0; i < count; i++) {
			let nodePos = cards[i].getPosition()
			//console.log('nodePos', nodePos)
			if (nodePos.x-cards[i].width/2 < clickPos.x && clickPos.x < nodePos.x+cards[i].width/2){
				let pierSelArr = this.model.selArr[type]
				for(let j = 0; j<pierSelArr.length; j++){
					if(i == pierSelArr[j]){
						cards[i].getChildByName('card').color = cc.Color.WHITE
						return
					}
				}
				for (var j = 0; j < this.model.moveTempArr[type].length; j++) {
					if(i == this.model.moveTempArr[type][j]){
						return
					}
				}
				cards[i].getChildByName('card').color = cc.Color.GRAY
				this.model.moveTempArr[type].push(i)
				//console.log('中间存储变量', this.model.moveTempArr[type])
			}
		}
	}
	addDataEnd(node, event){
		let typeName = ['upPier','midPier','downPier']
		let type = dunType[node.parent.name]
		let count = this.model.selArr[type].length;
		let pierData = this.model.getPierData(type);
		let cards = this.ui['node_'+node.parent.name].children
		cc.log('tempArr',this.model.moveTempArr[type])
		cc.log('selArr',this.model.selArr[type])
		for (let i=0; i<count; i++) {
			for (let k=0; k<this.model.moveTempArr[type].length; k++) {
				let index = this.model.moveTempArr[type][k]
				if (this.model.selArr[type][i]==index && cards[index].getChildByName('card').color._val == cc.Color.WHITE._val) {
					delete this.model.selArr[type][i];
					this.model.moveTempArr[type].splice(k, 1);
					break;
				}
			}
		}
		cc.log('tempArr2',this.model.moveTempArr[type])
		cc.log('selArr2',this.model.selArr[type])
		for (let i=0; i<5; i++) {
			//console.log('是不是这里移除了', this.model.selArr[type])
			for(let j = 0; j<this.model.selArr[type].length; j++){
				if (!this.model.selArr[type][j] && this.model.selArr[type][j]!=0){
					this.model.selArr[type].remove(j)
					break
				}
			}
		}
		cc.log(this.model.moveTempArr[type])
		cc.log(this.model.selArr[type])
		for (let i = 0; i < this.model.moveTempArr[type].length; i++) {
			if(this.model.selArr[type][i] || this.model.selArr[type][i] == 0){
				continue
			}
			this.model.addChangeDT(type, this.model.moveTempArr[type][i])	
		}
		if(this.model.bChangePierData){
			this.view.allAutoBtnShow()
			this.model.bChangePierData = false
		}
		// this.model.moveTempArr[type] = []
		//console.log('this.model.selArr-0', this.model.selArr[0])
		//console.log('this.model.selArr-1', this.model.selArr[1])
		//console.log('this.model.selArr-2', this.model.selArr[2])
		this.view.configComplete()
		this.view.refUpPierCard()
		this.view.refMidPierCard()
		this.view.refDownPierCard()
		//归位的操作
		if(this.model.selArr[dunType.upPier].length == 0 
			&&this.model.selArr[dunType.midPier].length == 0 
			&&this.model.selArr[dunType.downPier].length == 0){
			this.view.allCardHoming('pier')
		}
		//console.log(`${type}-SelArr`, this.model.selArr[type])
	}

	//选择手牌
	//滑动
	moveChooseCB(node, event){
		// this.model.bMoveChooseHand = true
		//console.log(this.ui.node_myCards.convertToNodeSpace(event.getLocation()))
		let clickPos = this.ui.node_myCards.convertToNodeSpace(event.getLocation())
		let myCards = this.ui.node_myCards.children
		for (let i=0; i<myCards.length; i++) {
			let nodePos = myCards[i].getPosition()
			let handCardCount = this.model.handCards.length;
			let lastCardX = handCardCount == myCards[i].name ? nodePos.x+myCards[i].width/2 : nodePos.x+38
			if (nodePos.x-myCards[i].width/2 < clickPos.x && clickPos.x < lastCardX) {
				if (!myCards[i].active) continue
				let chooseArr = this.model.getChooseCards()
				for(let j = 0; j<chooseArr.length; j++){
					if(i == chooseArr[j]){
						myCards[i].setPositionY(startPos)
						return
					}
				}
				for (let j = 0; j < this.model.chooseTempArr.length; j++) {
					if(i == this.model.chooseTempArr[j]){
						return
					}
				}
				myCards[i].setPositionY(choosePos)
				this.model.chooseTempArr.push(i)
				//console.log('中间存储变量', this.model.chooseTempArr)
			}
		}
	}
	clickEnd(){
		let myCards = this.ui.node_myCards.children
		cc.log('chooseTempArr',this.model.chooseTempArr)
		cc.log('arrChooseCard',this.model.arrChooseCard)
		if (this.model.arrChooseCard.length != this.model.chooseTempArr.length) {
			this.model.chooseTempArr = []
			this.view.allCardHoming('hand')
			for (let i = 0; i < this.model.arrChooseCard.length; ++i) {
				this.model.chooseTempArr.push(this.model.arrChooseCard[i])
				myCards[this.model.arrChooseCard[i]].setPositionY(choosePos)
			}
		}
		cc.log('chooseTempArr', this.model.chooseTempArr)
		cc.log('arrChooseCard', this.model.arrChooseCard)
	}
	chooseMyCardEnd(){
		let count = this.model.arrChooseCard.length;
		let cards = this.ui.node_myCards.children
		cc.log('tempArr',this.model.chooseTempArr)
		cc.log('selArr',this.model.arrChooseCard)
		for (let i=0; i<count; i++) {
			for (let k=0; k<this.model.chooseTempArr.length; k++) {
				let index = this.model.chooseTempArr[k]
				if (this.model.arrChooseCard[i]==index && cards[index].getPositionY() == startPos) {
					//console.log('从arrChooseCard中删除选中的卡牌')
					delete this.model.arrChooseCard[i];
					this.model.chooseTempArr.splice(k, 1);
					break;
				}
			}
		}
		cc.log('tempArr2',this.model.chooseTempArr)
		cc.log('selArr2',this.model.arrChooseCard)
		for (let i=0; i<13; i++) {
			//console.log('是不是这里移除了', this.model.arrChooseCard)
			for(let j = 0; j<this.model.arrChooseCard.length; j++){
				if (!this.model.arrChooseCard[j] && this.model.arrChooseCard[j]!=0){
					this.model.arrChooseCard.remove(j)
					break
				}
			}
		}
		cc.log(this.model.chooseTempArr)
		cc.log(this.model.arrChooseCard)
		for (let i = 0; i < this.model.chooseTempArr.length; i++) {
			if(this.model.arrChooseCard[i] || this.model.arrChooseCard[i] == 0){
				continue
			}
			this.model.addChooseCard(this.model.chooseTempArr[i])	
		}
		//归位的操作
		if(this.model.arrChooseCard.length == 0){
			this.view.allCardHoming('hand')
		}
		//console.log(`this.model.arrChooseCard`, this.model.arrChooseCard)
	}
	//点击
	clickMyCard(index, value){
		let typeName = ['upPier','midPier','downPier']
		//如果选择交换又点击手牌，就清空掉选择交换的数据
		for(let i = 0; i<this.model.selArr.length; i++){
			if(this.model.selArr[i].length != 0){
				this.model.selArr[i] = []
				this.model.moveTempArr[i] = []
				//console.log('clear selArr', this.model.selArr[i])
				//console.log('clear moveTempArr', this.model.moveTempArr[i])
				let cards =this.ui['node_'+ typeName[i]].children
				this.view.cardHoming(cards)
			}
		}
		let myCards = this.ui.node_myCards.children;
		let chooseCards = this.model.getChooseCards()
		myCards[index].setPositionY(choosePos)
		for(let i = 0; i<chooseCards.length; i++){
			if(chooseCards[i] == index){
				myCards[index].setPositionY(startPos)
				this.model.chooseTempArr.remove(i);
				this.model.removeChooseCard(chooseCards[i])
				//console.log('点击选中的牌移除chooseCards', this.model.getChooseCards())
				//console.log('处理对应的tempArr的数据', this.model.chooseTempArr)
				return
			}
		}
		this.model.addChooseCard(index)
		this.model.chooseTempArr.push(index)
		//console.log('chooseTempArr数据', this.model.chooseTempArr)
		//console.log('点击选中的牌加入chooseCards', this.model.getChooseCards())
	}
	

	//点击牌墩单张牌
	clickCardBgs(type, index, value){
		//初始化需要的数据
		let typeName = ['upPier','midPier','downPier']
		let chooseCards = this.model.getChooseCards()
		let cardBgs = this.ui['node_'+ typeName[type]].children
		//console.log('value', value)
		//牌墩中没有值，也没有选中手牌，整个回调不执行
		if(!value && !chooseCards.length){
			return
		}
		//如果牌墩中没有牌，就不存在交换，不进行需要交换的牌值存储
		if(value && !chooseCards.length){
			for(let i = 0; i<this.model.selArr[type].length; i++){
				if(this.model.selArr[type][i] == index) {
					let newColor = new cc.Color(240, 241, 162)
					cardBgs[index].getChildByName('card').color = this.model[typeName[type]][index]==this.model.maCard?newColor:cc.Color.WHITE
					this.model.selArr[type].remove(i)
					this.model.moveTempArr[type].remove(i)
					return
				}
			}
			let pokerNode = cardBgs[index].getChildByName('card')
			pokerNode.color = cc.Color.GRAY
			this.model.moveTempArr[type].push(index)
			this.model.addChangeDT(type, index);
			if(this.model.bChangePierData){
				this.view.allAutoBtnShow()
				this.model.bChangePierData = false
			}
			this.view.configComplete()
			this.view.refUpPierCard()
			this.view.refMidPierCard()
			this.view.refDownPierCard()
			//牌墩归位
			let selArr = this.model.selArr
			let homingCards = [];
			for (let i = 0; i < selArr.length; i++) {
				if(!selArr[i].length && this.model[typeName[i]].length != 0){
					homingCards = this.ui['node_'+ typeName[i]].children
					this.view.cardHoming(homingCards)
				}
			}
			//归位的操作
			if(this.model.selArr[dunType.upPier].length == 0 
				&&this.model.selArr[dunType.midPier].length == 0 
				&&this.model.selArr[dunType.downPier].length == 0){
				this.view.allCardHoming('pier')
			}
		//console.log('click selArr-0', this.model.selArr[0])
		//console.log('click selArr-1', this.model.selArr[1])
		//console.log('click selArr-2', this.model.selArr[2])
		}

		//如果没有选中手牌，没有可添加对象，以下流程不执行
		if(!chooseCards.length){
			return
		}
		//将选中的手牌放入牌墩
		let chooseCardsData = []
		for (let i = 0; i < chooseCards.length; i++) {
			chooseCardsData.push(this.model.handCards[chooseCards[i]])
		}
		SssAudio.getInstance().playGameAddToPier()
		this.model.addToPier(chooseCardsData, cardBgs.length, typeName[type], index)
		for(let i = 0; i<chooseCardsData.length; i++){
			//console.log(chooseCardsData[i])
			this.model.removeHandCards(chooseCardsData[i])
		}
		this.addToCardBgs(dunType[typeName[type]], cardBgs)
		let completeCount = 0
		let isComplete = [0, 0, 0]
		for (let i = 0; i < 3; ++i) {
			if (i == 0 && this.model[typeName[i]].length == 3) {
				isComplete[i] = 1;
				completeCount++;
			}
			else if (this.model[typeName[i]].length == 5) {
				isComplete[i] = 1;
				completeCount++;
			}
		}
		if (completeCount == 2) {
			for (let i = 0; i < isComplete.length; i++) {
				if (isComplete[i] == 0) {
					let cardBgs = this.ui['node_'+ typeName[i]].children
					let count = this.model[typeName[i]].length
					this.model.addToPier(this.model.handCards, cardBgs.length, typeName[i], count)
				}
			}
			this.model.clearHandCards()
			this.view.refHandCard()
			this.view.refManulBtnShow()
			this.view.configComplete()
			this.view.refUpPierCard()
			this.view.refMidPierCard()
			this.view.refDownPierCard()
			this.view.allCardHoming('hand')	
		}
	}
	//将选中的牌放入到牌墩中
	addToCardBgs(type,cardBgs){
		let pierData = this.model.getPierData(type)
		//console.log('aaaaaaaaaaaaaaaaa', pierData)
		//console.log('addToCardBgs',  pierData)
		for(let i = 0; i<pierData.length; i++){
			cardBgs[i].getChildByName('card').active = true;
			//渲染牌墩牌的显示
			let spriteName = "bull1_"+pierData[i]
			let newFrame = this.ui.pokerAtlas.getSpriteFrame(spriteName)
			cardBgs[i].getChildByName('card').getComponent(cc.Sprite).spriteFrame=newFrame
		}
		//手牌的渲染
		this.view.refHandCard()
		this.view.refManulBtnShow()
		this.view.configComplete()
		this.view.refUpPierCard()
		this.view.refMidPierCard()
		this.view.refDownPierCard()
		this.view.allCardHoming('hand')
		this.model.clearChooseCard()
		this.model.chooseTempArr = []
		this.model.allClickCountZero()
	}
	//自动配牌
	autoBtnCB(index){
		let tempArr = ['upPier','midPier','downPier']
		for (let i = 0; i < 3; i++) {
			if(i == 0 && this.model.topTenCardGroup[index][i].length == 5){
				this.model.topTenCardGroup[index][i].pop()
				this.model.topTenCardGroup[index][i].pop()
			}
			SssLib.memcpy( this.model[tempArr[i]], this.model.topTenCardGroup[index][i], this.model.topTenCardGroup[index][i].length)
			//console.log('this.model.topTenCardGroup',i ,this.model.topTenCardGroup[index][i])
		}
		//console.log('this.model.upPier', this.model.upPier)
		//console.log('this.model.midPier', this.model.midPier)
		//console.log('this.model.downPier', this.model.downPier)
		this.model.clearHandCards()
		this.model.clearChooseCard()
		this.model.chooseTempArr = []
		this.model.moveTempArr = [[],[],[]]
		this.view.configComplete()
		this.view.allCardHoming('hand')
		this.view.refManulBtnShow()
		this.view.refHandCard()
		this.view.refUpPierCard()
		this.view.refMidPierCard()
		this.view.refDownPierCard()
		this.view.refAutoBtnShow(index + 1)
	}

	//手动配牌提示回调
	onePareCB(event){
		let myCards = this.ui.node_myCards.children
		let countNum = 2; //一组提示的长度
		let startIndex = 0;
		if(this.model.onePareCC==0){
			this.model.allClickCountZero()
		}
		startIndex = startIndex + countNum*this.model.onePareCC;
		let typeInfo = this.model.sssCard.GetType(this.model.handCards, this.model.handCards.length)
		let onePare = typeInfo.cbOnePare
		for (let i = 0; i < myCards.length; i++) {
			myCards[i].setPositionY(startPos)
		}
		this.model.arrChooseCard = []
		this.model.chooseTempArr = []
		if(onePare[startIndex] == 0 && onePare[startIndex+1] == 0){
			this.model.onePareCC = 0
			return
		}
		//console.log('本次索引起始位置', startIndex)
		for (let i = startIndex; i < startIndex + countNum; i++) {
			let index = onePare[i]
			myCards[index].setPositionY(choosePos)
			this.model.addChooseCard(index)
			this.model.chooseTempArr.push(index)
		}
		//console.log('select card by tips', this.model.arrChooseCard)
		this.model.onePareCC++
	}
	twoPareCB(event){
		let myCards = this.ui.node_myCards.children
		let countNum = 4; //一组提示的长度
		let startIndex = 0;
		if(this.model.twoPareCC==0){
			this.model.allClickCountZero()
		}
		startIndex = startIndex + countNum*this.model.twoPareCC;
		let typeInfo = this.model.sssCard.GetType(this.model.handCards, this.model.handCards.length)
		let twoPare = typeInfo.cbTwoPare 
		for (let i = 0; i < myCards.length; i++) {
			myCards[i].setPositionY(startPos)
		}
		this.model.arrChooseCard = []
		this.model.chooseTempArr = []
		if(twoPare[startIndex] == 0 && twoPare[startIndex+1] == 0){
			this.model.twoPareCC = 0
			return
		}
		//console.log('本次索引起始位置', startIndex)
		for (let i = startIndex; i < startIndex + countNum; i++) {
			let index = twoPare[i]
			myCards[index].setPositionY(choosePos)
			this.model.addChooseCard(index)
			this.model.chooseTempArr.push(index)
		}
		//console.log('select card by tips', this.model.arrChooseCard)
		this.model.twoPareCC++
	}
	threeSameCB(event){
		let myCards = this.ui.node_myCards.children
		let countNum = 3; //一组提示的长度
		let startIndex = 0;
		if(this.model.threeSameCC==0){
			this.model.allClickCountZero()
		}
		startIndex = startIndex + countNum*this.model.threeSameCC;
		let typeInfo = this.model.sssCard.GetType(this.model.handCards, this.model.handCards.length)
		let threeSame = typeInfo.cbThreeSame
		for (let i = 0; i < myCards.length; i++) {
			myCards[i].setPositionY(startPos)
		}
		this.model.arrChooseCard = []
		this.model.chooseTempArr = []
		if(threeSame[startIndex] == 0 && threeSame[startIndex+1] == 0){
			this.model.threeSameCC = 0
			return
		}
		//console.log('本次索引起始位置', startIndex)
		for (let i = startIndex; i < startIndex + countNum; i++) {
			let index = threeSame[i]
			myCards[index].setPositionY(choosePos)
			this.model.addChooseCard(index)
			this.model.chooseTempArr.push(index)
		}
		//console.log('select card by tips', this.model.arrChooseCard)
		this.model.threeSameCC++
	}
	straightCB(event){
		let myCards = this.ui.node_myCards.children
		let countNum = 5; //一组提示的长度
		let startIndex = 0;
		if(this.model.straightCC==0){
			this.model.allClickCountZero()
		}
		startIndex = startIndex + countNum*this.model.straightCC;
		let typeInfo = this.model.sssCard.GetType(this.model.handCards, this.model.handCards.length)
		let straight = typeInfo.cbStraight
		for (let i = 0; i < myCards.length; i++) {
			myCards[i].setPositionY(startPos)
		}
		this.model.arrChooseCard = []
		this.model.chooseTempArr = []
		if(straight[startIndex] == 0&&straight[startIndex+1] == 0){
			this.model.straightCC = 0
			return
		}
		//console.log('本次索引起始位置', startIndex)
		for (let i = startIndex; i < startIndex + countNum; i++) {
			let index = straight[i]
			myCards[index].setPositionY(choosePos)
			this.model.addChooseCard(index)
			this.model.chooseTempArr.push(index)
		}
		//console.log('select card by tips', this.model.arrChooseCard)
		this.model.straightCC++
	}
	flushCB(event){
		let myCards = this.ui.node_myCards.children
		let countNum = 5; //一组提示的长度
		let startIndex = 0;
		if(this.model.flushCC==0){
			this.model.allClickCountZero()
		}
		startIndex = startIndex + countNum*this.model.flushCC;
		let typeInfo = this.model.sssCard.GetType(this.model.handCards, this.model.handCards.length)
		let flush = typeInfo.cbFlush
		for (let i = 0; i < myCards.length; i++) {
			myCards[i].setPositionY(startPos)
		}
		this.model.arrChooseCard = []
		this.model.chooseTempArr = []
		if(flush[startIndex] == 0&&flush[startIndex+1] == 0){
			this.model.flushCC = 0
			return
		}
		//console.log('本次索引起始位置', startIndex)
		for (let i = startIndex; i < startIndex + countNum; i++) {
			let index = flush[i]
			// if(index == flush[i-1]){
			// 	index++;
			// }
			myCards[index].setPositionY(choosePos)
			this.model.addChooseCard(index)
			this.model.chooseTempArr.push(index)
		}
		//console.log('select card by tips', this.model.arrChooseCard)
		this.model.flushCC++
	}
	groupCB(event){
		let myCards = this.ui.node_myCards.children
		let countNum = 5; //一组提示的长度
		let startIndex = 0;
		if(this.model.groupCC==0){
			this.model.allClickCountZero()
		}
		startIndex = startIndex + countNum*this.model.groupCC;
		let typeInfo = this.model.sssCard.GetType(this.model.handCards, this.model.handCards.length)
		let gourd = typeInfo.cbGourd
		for (let i = 0; i < myCards.length; i++) {
			myCards[i].setPositionY(startPos)
		}
		this.model.arrChooseCard = []
		this.model.chooseTempArr = []
		if(gourd[startIndex] == 0&&gourd[startIndex+1] == 0){
			this.model.groupCC = 0
			return
		}
		//console.log('本次索引起始位置', startIndex)
		for (let i = startIndex; i < startIndex + countNum; i++) {
			let index = gourd[i]
			myCards[index].setPositionY(choosePos)
			this.model.addChooseCard(index)
			this.model.chooseTempArr.push(index)
		}
		//console.log('select card by tips', this.model.arrChooseCard)
		this.model.groupCC++
	}
	fourSameCB(event){
		let myCards = this.ui.node_myCards.children
		let countNum = 4; //一组提示的长度
		let startIndex = 0;
		if(this.model.fourSameCC==0){
			this.model.allClickCountZero()
		}
		startIndex = startIndex + countNum*this.model.fourSameCC;
		let typeInfo = this.model.sssCard.GetType(this.model.handCards, this.model.handCards.length)
		let fourSame = typeInfo.cbFourSame
		for (let i = 0; i < myCards.length; i++) {
			myCards[i].setPositionY(startPos)
		}
		this.model.arrChooseCard = []
		this.model.chooseTempArr = []
		if(fourSame[startIndex] == 0&&fourSame[startIndex+1] == 0){
			this.model.fourSameCC = 0
			return
		}
		//console.log('本次索引起始位置', startIndex)
		for (let i = startIndex; i < startIndex + countNum; i++) {
			let index = fourSame[i]
			myCards[index].setPositionY(choosePos)
			this.model.addChooseCard(index)
			this.model.chooseTempArr.push(index)
		}
		//console.log('select card by tips', this.model.arrChooseCard)
		//console.log('chooseTempArr', this.model.chooseTempArr)
		this.model.fourSameCC++
	}
	straightFlushCB(event){
		let myCards = this.ui.node_myCards.children
		let countNum = 5; //一组提示的长度
		let startIndex = 0;
		if(this.model.straightFlushCC==0){
			this.model.allClickCountZero()
		}
		startIndex = startIndex + countNum*this.model.straightFlushCC;
		let typeInfo = this.model.sssCard.GetType(this.model.handCards, this.model.handCards.length)
		let straightFlush = typeInfo.cbStraightFlush
		for (let i = 0; i < myCards.length; i++) {
			myCards[i].setPositionY(startPos)
		}
		this.model.arrChooseCard = []
		this.model.chooseTempArr = []
		if(straightFlush[startIndex] == 0&&straightFlush[startIndex+1] == 0){
			this.model.straightFlushCC = 0
			return
		}
		//console.log('本次索引起始位置', startIndex)
		for (let i = startIndex; i < startIndex + countNum; i++) {
			let index = straightFlush[i]
			myCards[index].setPositionY(choosePos)
			this.model.addChooseCard(index)
			this.model.chooseTempArr.push(index)
		}
		//console.log('select card by tips', this.model.arrChooseCard)
		this.model.straightFlushCC++
	}
	fiveSameCB(event){
		let myCards = this.ui.node_myCards.children
		let countNum = 5; //一组提示的长度
		let startIndex = 0;
		if(this.model.fiveSameCC==0){
			this.model.allClickCountZero()
		}
		startIndex = startIndex + countNum*this.model.fiveSameCC;
		let typeInfo = this.model.sssCard.GetType(this.model.handCards, this.model.handCards.length)
		let fiveSame = typeInfo.cbFiveSame
		for (let i = 0; i < myCards.length; i++) {
			myCards[i].setPositionY(startPos)
		}
		this.model.arrChooseCard = []
		this.model.chooseTempArr = []
		if(fiveSame[startIndex] == 0&&fiveSame[startIndex+1] == 0){
			this.model.fiveSameCC = 0
			return
		}
		//console.log('本次索引起始位置', startIndex)
		for (let i = startIndex; i < startIndex + countNum; i++) {
			let index = fiveSame[i]
			myCards[index].setPositionY(choosePos)
			this.model.addChooseCard(index)
			this.model.chooseTempArr.push(index)
		}
		//console.log('select card by tips', this.model.arrChooseCard)
		this.model.fiveSameCC++
	}

	specialConfirmCB(){
		//console.log('specialConfirmCB', this.model.specialCard)
		let typeName = ['upPier', 'midPier', 'downPier']
		let cardList = [[],[],[]];
		for (let i = 0; i < this.model.specialCard.length; i++) {
			for(let j = 0; j<this.model.specialCard[i].length; j++){
				cardList[i].push(this.model.specialCard[i][j])
			}
		}
		//console.log('发送给服务端的特殊牌型数据',cardList)
		SssLogic.getInstance().send_peipai(cardList, this.model.curSpecialType);
		this.finish()
	}
	specialCancelCB(event){
		this.ui.specialRemindPanel.active = false;
	}

	//网络事件回调begin
	onDissolutionRoom(msg) {
		if(msg.result) {
			this.finish();
		}
	}
	connector_entryHandler_enterRoom() {
		// this.finish()
	}
	//end
}
