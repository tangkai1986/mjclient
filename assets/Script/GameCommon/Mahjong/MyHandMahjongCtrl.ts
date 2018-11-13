/*
author: JACKY
日期:2018-01-12 14:10:41
*/



import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import BaseView from "../../Plat/Libs/BaseView";
import BaseModel from "../../Plat/Libs/BaseModel"; 
 
import FrameMgr from "../../Plat/GameMgrs/FrameMgr";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";
import GEventDef from "../../Plat/GameMgrs/GEventDef"; 
import SettingMgr from "../../Plat/GameMgrs/SettingMgr"; 
import { MahjongGeneral } from "./MahjongGeneral";
import { MahjongDef } from "./MahjongDef";
import BetMgr from "../../Plat/GameMgrs/BetMgr";

//MVC模块,
let Green = new cc.Color(24,221,40),Red = new cc.Color(255,78,0), Yellow = new cc.Color(255,222,0),White = new cc.Color(255,255,255),
 LightGreen = new cc.Color(156,233,163);
const {ccclass, property} = cc._decorator;
let ctrl : MyHandMahjongCtrl;
//模型，数据处理
class Model extends BaseModel{
	mySeatId=null; 
	myself=null; 
	enable_op=null;
	cursel=null;
	jin=null; 
	jin2=null;
	offset=0;//麻将起始位置偏移
	tingtypedic={};
	maskcards=[];
	blankWidth=0;
	paiSpace=0;
	oneCardTotalNum=4;
	curtingtype=null;
	maskCardList={};
	otherPlayerGaiPaitype=null;
	catchCard =null;
	outCardIdx =null;
	handcardSpace=null;
	cardTouchMoveFlag=false; 
	willMoveCardFlag=false;
	opcardsindexes=[];//吃碰杠高亮显示的牌的下标
	jinRed = 255;
	jinGreen = 255;
	jinBlue = 255;
	jinColor = White;
	playTimer = null;
	playCardTimer = null;

	mahjongResMgr=RoomMgr.getInstance().getResMgr();
	mahjongLogic=RoomMgr.getInstance().getLogic();
	mahjongDef=RoomMgr.getInstance().getDef();
	mahjongAudio=RoomMgr.getInstance().getAudio();	
	mahjongCards=this.mahjongLogic.getInstance().getMahjongCards();	


	constructor()
	{
		super();
		this.clear();
		this.blankWidth = ctrl.Int_blankWidth;
		this.paiSpace = ctrl.Int_paiSpace;
		this.handcardSpace = ctrl.Int_handcardSpace;
	}   
 
	updateOpCardsFlag(){
		//吃碰杠牌的标记更新
		let events=this.myself.events;
		this.opcardsindexes=[]; 
		let carddic={};
		let opcards=[];
		for(let i=0;i<events.length;++i){
			let event=events[i];
			switch(event)
			{
				//找出可以吃的
				case this.mahjongDef.event_chi:
				{
					let chiarr=this.myself.getCardsCandChi();
					for(let j = 0;j<chiarr.length;++j)
					{
						let cards=chiarr[j].cards;
						let index=chiarr[j].index;
						for(let k=0;k<cards.length;++k)
						{
							if(k!=index){
								opcards.push(cards[k]);
							}
						}
					}
				} 
				break;
				//碰和杠比较简单直接加入到数组中
				case this.mahjongDef.event_peng: 
				case this.mahjongDef.event_gang:
					opcards.push(this.mahjongLogic.getInstance().curcard); 
				break;
				//获得可以暗杠的牌
				case this.mahjongDef.event_angang:
				{
					let cards=this.myself.getCardsCanAnGang();
					for(let j = 0;j<cards.length;++j)
					{ 
						opcards.push(cards[j]);	
					}
				} 
				break;
				//获得可以补杠的牌
				case this.mahjongDef.event_bugang: 
				{
					let cards=this.myself.getCardsCanBuGang();
					for(let j = 0;j<cards.length;++j)
					{ 
						opcards.push(cards[j]);	
					}
				} 
				break;
			}
		} 
		//去除重复的，组成字典
		for(let i =0;i<opcards.length;++i)
		{
			let card=opcards[i];
			carddic[card]=true;
		}
		for(let src in carddic)
		{
			//找到手牌下标
			for(let index=0;index<this.myself.handcard.length;++index)
			{
				if(this.myself.handcard[index]==src)
				{ 
					this.opcardsindexes.push(index);
				}
			}
		}
	}
	clearPlayTimer(){
		if (this.playTimer!=null) {
			clearTimeout(this.playTimer);
			this.playTimer = null;
		}
	}
	setcurtingtype(data)
	{
		this.curtingtype = data;
	}
	setotherPlayerGaiPaitype(type)
	{
		this.otherPlayerGaiPaitype = type;
	}
	updateGaiPaiFlag(){
		this.maskcards=this.mahjongCards.getOptionCardsFromJiang(this.myself.handcard);
	}
	setoutCardIdx(idx)
	{
		this.outCardIdx = idx;
	}
	updateCatchCard()
	{
		this.catchCard=this.mahjongLogic.getInstance().curcard;
		//console.log("catchCard",this.catchCard);
	}
	isInGaiPai(value)
	{
		let jinflag = false;
		for(let i = 0;i<this.maskcards.length;++i)
		{
			if (MahjongGeneral.isJoker(this.maskcards[i])) {
				jinflag=true;
				break;
			}
		}
		for(let i = 0;i<this.maskcards.length;++i)
		{
			//如果金也是盖牌的选项只能打金，升级为双游
			if (jinflag) {
				if (MahjongGeneral.isJoker(this.maskcards[i])) {
					return true;
				}
			}
			else if(this.maskcards[i]==value)
				return true;
		}
		return false;
	}
	updateOffset(){
		//console.log("updateOffset",this.myself.opcards)
		this.offset=this.myself.opcards.length*3;
	}
	updateMyInfo(  ){
		// body 
		this.mySeatId=RoomMgr.getInstance().getMySeatId(); 
		this.myself=this.mahjongLogic.getInstance().players[this.mySeatId] 
		//console.log("更新我的信息=",this.mySeatId,this.myself)
	}
	clear(  ){
		// body 
		this.cursel=null; 
		this.enable_op=false;  
		this.offset=0;
		this.maskCardList={};
		this.opcardsindexes=[];//吃碰杠高亮显示的牌的下标
		this.maskcards=[];
		this.tingtypedic={};
		this.otherPlayerGaiPaitype=null;
		this.curtingtype=null;
		this.catchCard =null;
		this.outCardIdx =null;
		this.cardTouchMoveFlag=false;
		this.willMoveCardFlag=false;
	}  
	recover(  ){
		this.clear();
		this.updateMyInfo();
		this.jin=this.mahjongLogic.getInstance().jin;
		this.jin2=this.mahjongLogic.getInstance().jin2;
	}
	disabledOp(){
		this.enable_op=false;
		this.cursel=null; 
	}
    enabledOp(){
		this.enable_op=true;
	} 
	updateTingDic(){
		// 判断是否听牌进行听牌提示
		this.tingtypedic={}; 
		this.tingtypedic=this.myself.getTingDic(this.myself.handcard,this.mahjongLogic.getInstance().players,this.mySeatId);	
	}
	getBezierEndPointCardIdx(cardValue)
	{
		for (let cardIdx = 0; cardIdx < this.myself.handcard.length; ++cardIdx) {
			if (this.myself.handcard[cardIdx] == cardValue) {
				return cardIdx;
			}
		}
		return -1;
	}
	touchLimit(index)
	{
		if (this.maskCardList[index-this.offset]!=null || this.maskCardList[index-this.offset]!=undefined) {
			return true;
		}
		if(!this.enable_op){
			return true;
        }
        return false;
	}
	setJinColor(colorR,colorG,colorB)
	{
		this.jinRed = colorR;
		this.jinGreen = colorG;
		this.jinBlue = colorB;
		this.jinColor = new cc.Color(this.jinRed,this.jinGreen,this.jinBlue)
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		cards_laydown:null,
		cards_stand:null,
		standcards:null,
		hintcard_forClone:null,
		hintcardsTitles:{},
		node_wantonlyhu:null,
		node_huzimo:null,
		node_zimo:null,
		hintCardBg:null,
		hintflags:[],
		hintflagEffectSprites:[],
		hintflagNums:[],
		btn_hintCardsShow:null,
		node_outcardPos:null,
		fapaigroup:[],
		laydowncards:[],
	}; 
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.ui.btn_hintCardsShow = ctrl.btn_hintCardsShow;  
		this.initUi();
	}
	//初始化ui 
	initUi()
	{ 
		this.ui.cards_laydown=this.node.getChildByName('cards_laydown')
		this.ui.cards_stand=this.node.getChildByName('cards_stand')
		this.ui.standcards=[];
		for(let i = 0;i<this.model.mahjongCards.getCardCount()+1;++i)
		{ 
			let card=this.ui.cards_stand.getChildByName(`card_${i}`); 
			this.ui.standcards.push(card);
			let flag=card.getChildByName("flag");
			this.ui.hintflags.push(flag);
			let hintflagEffectSprite = flag.getChildByName("effect");
			this.ui.hintflagEffectSprites.push(hintflagEffectSprite);
			let number=flag.getChildByName("number").getComponent(cc.Label);
			this.ui.hintflagNums.push(number);
			let laydowncard=this.ui.cards_laydown.getChildByName(`card_${i}`)
			this.ui.laydowncards.push(laydowncard);
		}
		this.ui.hintcard_forClone = this.node.getChildByName("hintcards").getChildByName("card");
		this.ui.hintCardBg = this.node.getChildByName("hintcards").getChildByName("bg");
		this.ui.node_wantonlyhu = this.ui.hintCardBg.parent.getChildByName("title").getChildByName("tips_wantonlyhu");
		this.ui.node_wantonlyhu.active = false;
		this.ui.hintcardsTitles[MahjongDef.event_danyou] = this.ui.hintCardBg.parent.getChildByName("title").getChildByName("tips_youjin");
		this.ui.hintcardsTitles[MahjongDef.event_zimo] = this.ui.hintCardBg.parent.getChildByName("title").getChildByName("tips_huZimo");
		this.ui.node_huzimo = this.ui.hintcardsTitles[MahjongDef.event_zimo].getChildByName("huzimo");
		this.ui.node_huzimo.active=false;
		this.ui.node_zimo = this.ui.hintcardsTitles[MahjongDef.event_zimo].getChildByName("zimo");
		this.ui.node_zimo.active=false;
		this.ui.hintcardsTitles[MahjongDef.event_shuangyou] = this.ui.hintCardBg.parent.getChildByName("title").getChildByName("tips_shuangyou");
		this.ui.hintcardsTitles[MahjongDef.event_sanyou] = this.ui.hintCardBg.parent.getChildByName("title").getChildByName("tips_sanyou");
		this.ui.node_outcardPos = ctrl.node_outcardPos;
		this.clear(); 
	}
	hideHintCardsTitles()
	{
		this.ui.hintcardsTitles[MahjongDef.event_danyou].active = false;
		this.ui.hintcardsTitles[MahjongDef.event_zimo].active = false;
		this.ui.hintcardsTitles[MahjongDef.event_shuangyou].active = false;
		this.ui.hintcardsTitles[MahjongDef.event_sanyou].active = false;
		this.ui.node_huzimo.active=false;
		this.ui.node_zimo.active=false;
		this.ui.node_wantonlyhu.active=false;
	}
	//初始化发牌
	initFaPai(){
		for (let i=0;i<this.ui.standcards.length;++i){
			let card=this.ui.standcards[i]; 
			card.active= false;
		}  	 
		for(let i = 0;i<5;++i)
		{
			let count=4;
			let group=[];
			for(let j = 0;j<count;++j)
			{
				let index=i*count+j;
				let card=this.ui.standcards[index];  
				if(index<this.model.myself.handcard.length)
				{
					this.ui.laydowncards[index].active=true;
					group.push(card); 
				}
			}
			this.ui.fapaigroup.push(group);
		} 
        //重置金的显示
		for (let i = 0;i<this.ui.standcards.length;++i){
			let card = this.ui.standcards[i];   
			card.getChildByName('jin').active = false; 
			card.getChildByName('majingBg').color=White; 
		}			
		for (let i = 0;i<this.ui.standcards.length;++i){
			let card = this.ui.standcards[i];
			let pos=card.position; 
			card.position=cc.p(pos.x,0);  
			let value=this.model.myself.handcard[i]; 
			if (value !=null && value !=undefined){
                let sign=card.getChildByName('sign');
				sign.active = true; 
				let frame = this.model.mahjongResMgr.getInstance().getCardSpriteFrame(value);
				sign.getComponent(cc.Sprite).spriteFrame = frame;
				//console.log("plistKey",this.model.mahjongResMgr.getInstance().getCardSpriteFrame(value));
			} 
		}			 
	}	
	stepFaPai(step){
		let group=this.ui.fapaigroup[step];
		if(group) {
			for(let i = 0;i<group.length;++i)
			{
				let card=group[i]; 
				card.active=true; 
			} 
		}
	}	
 
	clearMyCard(){
		for (let i=0;i<this.ui.standcards.length;++i){ 
			this.ui.standcards[i].active=false;
		}
	}
    showTip (content) {
        FrameMgr.getInstance().showTips(content, null, 35, Red, cc.p(0,0), "Arial", 1000);
    }
	recover(  ){
		// body
		this.clear(); 
	}
	//清除
	clear(){ 
		this.ui.cards_laydown.active=false;
		this.ui.fapaigroup=[];
		// body   
		for (var i=0;i<this.model.mahjongCards.getCardCount()+1;++i){
			this.ui.standcards[i].active=false
			this.ui.hintflags[i].active=false;
			this.ui.laydowncards[i].active=false;
		}
		this.ui.hintcard_forClone.active = false;
	}
	updateHandCards(){ 
		for (let i = 0;i<this.model.offset;++i){  
			var card = this.ui.standcards[i];
			card.active=false;
		}
		for (let i = this.model.offset;i<this.ui.standcards.length;++i){
			let card = this.ui.standcards[i];
			card.setPosition(cc.p(0,0));
			let cardIndex=i-this.model.offset
			let value=this.model.myself.handcard[i-this.model.offset]; 
			if (value !=null && value !=undefined){
                var sign=card.getChildByName('sign');
				sign.active = true;
				let frame = this.model.mahjongResMgr.getInstance().getCardSpriteFrame(value)
				sign.getComponent(cc.Sprite).spriteFrame = frame;  
				card.active=true;
			}
			else
			{
				card.active=false;
			}
			let isJoker=MahjongGeneral.isJoker(value);
			card.getChildByName('jin').active = isJoker;
			if(isJoker) {
				card.getChildByName('majingBg').color=this.model.jinColor;
			}
			else
			{
				card.getChildByName('majingBg').color=White;
			}
		}	
	}
	updateCards(){ 
		this.updateHandCards(); 
		this.updateSel();
	}
 
    playBuhuaEffect(buhuaData, cb) {
        let huaArr = buhuaData.hua
		let paiArr = buhuaData.pai
		let poses=buhuaData.poses;
        let loopCount = huaArr.length
        let curLoopCount = 0
        let self = this;
        let playEffect = function (card, pai) {
            this.playCardBuhuaEffect(card, pai,  ()=> {
                if (curLoopCount == loopCount) {
                	self.model.clearPlayTimer();
                	self.model.playTimer = setTimeout(cb, 500)
                }
            })
            curLoopCount++
		}.bind(this)
		for(let i = 0;i<poses.length;++i)
		{
			let cardModelIndex=poses[i];//数据索引
			let cardUiIndex=cardModelIndex+this.model.offset//ui索引
			let pai=paiArr[i]
			let cardNode=this.ui.standcards[cardUiIndex]
			this.model.myself.handcard[cardModelIndex]=pai; 
			playEffect(cardNode, pai);
		} 
    }
    playCardBuhuaEffect (card, pai, cb) {
		card.getChildByName('jin').active = false;
		card.getComponent(cc.Animation).play();
		let self=this;
		//这边写的有问题 环峰，this指针识别问题
        let onFinished =  ()=> {
            card.active = false;
            let sign=card.getChildByName('sign'); 
            let frame = self.model.mahjongResMgr.getInstance().getCardSpriteFrame(pai);
		    sign.getComponent(cc.Sprite).spriteFrame = frame;  
            card.getChildByName('majingBg').active = true;
            card.getChildByName('majingBg').color = White;
            sign.active = true;
		    card.active=true;
			//cb();
			if(this.model.playCardTimer)
			{
				clearTimeout(this.model.playCardTimer)
				this.model.playCardTimer=null
			}
            this.model.playCardTimer = setTimeout(cb, 100);
            card.getComponent(cc.Animation).off('finished', onFinished, self);
		}
        card.getComponent(cc.Animation).on('finished', onFinished, self);
    }
    playyoujinshuangyouflagEffect (index) {
		this.ui.hintflagEffectSprites[index].active=true;
		this.ui.hintflagEffectSprites[index].getComponent(cc.Animation).play();
    }
    stopyoujinshuangyouflagEffect () {
    	for (let i = 0; i < this.ui.hintflagEffectSprites.length; ++i) {
    		this.ui.hintflagEffectSprites[i].active=false;
			this.ui.hintflagEffectSprites[i].getComponent(cc.Animation).stop();
    	}
    }
	updateSel(){ 
		for (let i = this.model.offset;i<this.ui.standcards.length;++i){ 
			var card = this.ui.standcards[i];
			var pos=card.position; 
			if (i == this.model.cursel){
				card.position=cc.p(pos.x,20);
			}
			else{
				card.position=cc.p(pos.x,0);
				// this.removeHintCard(i);
				// this.showHintcards(false);
			}
		}
	}
	updateTingFlag(){
		for (let i = 0; i < this.model.myself.handcard.length; ++i) {
			let card=this.model.myself.handcard[i];
			let tingtype=this.model.tingtypedic[card];
			let cardnode=this.ui.standcards[i+this.model.offset];
			//console.log("i=",i+this.model.offset,"offset=",this.model.offset)
			let flagnode=this.ui.hintflags[i+this.model.offset];
			//这边要做容错,因为测试到有错误,需要检查下为啥出现
			if(flagnode==null)
				continue;
			if(tingtype==null)
				continue;
			if (tingtype.type>=0) {
				flagnode.active=true;
				if(tingtype.type>=1) {
					this.playyoujinshuangyouflagEffect(i+this.model.offset);
				}
				this.updateTingFlagNum(i+this.model.offset,tingtype.tingNums);
			}
			else
			{
				flagnode.active=false;
			}
			if(this.model.maskcards.length!=0 && !this.model.isInGaiPai(card))
			{
				this.hideTingFlag(i+this.model.offset);
			}
			if (tingtype.type < 2 && card == 0) {
				flagnode.active=false;
			}
			//console.log("flagnode.active",flagnode.active)
			//console.log("tingtype",tingtype)
			let name =null;
            switch (tingtype.type) {
                case 1:
					name = 'img_youjinzhang';				
                break;
                case 2:
					name = 'img_shuangyouzhang';
                    
                    if(this.model.mahjongLogic.getInstance().isShuangYou()&&this.model.mahjongCards.getCardCount()==13) {
						name = 'img_tishi_sanyou';
						this.updateTingFlagNum(i+this.model.offset,"");
                    }
                break;
                default:
					name = 'img_tingzhang';
                break;
            }
            if(name)
            {
				let spriteFrame = this.model.mahjongResMgr.getInstance().getSpriteFrame(name);
				flagnode.getComponent(cc.Sprite).spriteFrame=spriteFrame;
				//console.log("spriteFramename",name,spriteFrame);
            }
		}
	}
	updateTingSpriteFrame(){
		for (let i = 0; i < this.model.myself.handcard.length; ++i) {
			let card=this.model.myself.handcard[i];
			let tingtype=this.model.tingtypedic[card];
			let flagnode=this.ui.hintflags[i+this.model.offset];
            switch (tingtype.type) {
                case 2:
					let name = 'img_shuangyouzhang';
					let spriteFrame = this.model.mahjongResMgr.getInstance().getSpriteFrame(name);
					flagnode.getComponent(cc.Sprite).spriteFrame=spriteFrame;
					//console.log("spriteFramename",name,spriteFrame);
                break;
            }
		}
	}
	updateTingFlagNum(idx,tingNum)
	{
		this.ui.hintflagNums[idx].string = tingNum;
		if(tingNum==0) {
			this.ui.hintflagNums[idx].node.color = Red;
		}
		else
		{
			this.ui.hintflagNums[idx].node.color = White;
		}

	}
	showHintcards(flag){
		this.ui.hintCardBg.parent.active = flag;
	}
	adjustHintCardsBg(cardNum,huType){
		if(cardNum >= this.model.mahjongCards.getTingAllCard() || cardNum == 0){
			this.ui.hintCardBg.setContentSize(400,this.ui.hintCardBg.getContentSize().height);
			this.ui.hintcard_forClone.parent.setPositionX(200);
		}else{
			this.ui.hintCardBg.setContentSize(cardNum*this.model.paiSpace+this.model.blankWidth,this.ui.hintCardBg.getContentSize().height);
			let hintcardPos = this.ui.hintCardBg.parent.getPosition();
			let hintcardsTitlePos = this.ui.hintcardsTitles[huType].getPosition();
			this.ui.hintcard_forClone.parent.setPosition(cc.v2((cardNum*this.model.paiSpace+this.model.blankWidth)/2,hintcardPos.y));
			this.ui.hintcardsTitles[huType].setPosition(cc.v2(-(cardNum*this.model.paiSpace+this.model.blankWidth)/2,hintcardsTitlePos.y));
			//保证hinttip能够放下
			if (cardNum*this.model.paiSpace+this.model.blankWidth <220) {
				this.ui.hintCardBg.setContentSize(220,this.ui.hintCardBg.getContentSize().height);
				this.ui.hintcard_forClone.parent.setPosition(cc.v2((220/2),hintcardPos.y));
				this.ui.hintcardsTitles[huType].setPosition(cc.v2(-(220/2),hintcardsTitlePos.y));
				if(cardNum==1) {
					let childList = this.ui.hintCardBg.parent.children;
					for (var i = 0; i < childList.length; i++) {
						let node = childList[i];
						if(node.active && node.name == "card") {
							node.setPosition(cc.v2(-55,node.getPosition().y));
						}
					}
				}
				if(cardNum==2) {
					let childList = this.ui.hintCardBg.parent.children;
					for (var i = 0; i < childList.length; i++) {
						let node = childList[i];
						if(node.active && node.name == "card") {
							node.setPosition(cc.v2(node.getPosition().x-15,node.getPosition().y));
						}
					}
				}
			}
		}		
	}
	addHintCard(idx,spriteFrame,cardLefNum,jinFlag){
		//克隆节点
		this.ui.hintcard_forClone.active = false;
		let node = cc.instantiate(this.ui.hintcard_forClone);
		node.active = true;
		this.ui.hintcard_forClone.parent.addChild(node);
		let childcount = this.ui.hintcard_forClone.parent.childrenCount;
		node.setPosition(cc.v2(-(childcount-4)*this.model.paiSpace,0));
		node.getChildByName("sign").getComponent(cc.Sprite).spriteFrame = spriteFrame;
		node.getChildByName("number").getComponent(cc.Label).string = cardLefNum;
		node.getChildByName("number").color = White;
		node.getChildByName('jin').active = jinFlag;
		if(jinFlag) {
			node.getChildByName('majingBg').color=this.model.jinColor;
		}
		else
		{
			node.getChildByName('majingBg').color=White;
		}
		if(cardLefNum==0) {
			node.getChildByName("number").color = Red;
		}
	}
	removeHintCards(){
		this.showHintcards(false);
		let childcount = this.ui.hintCardBg.parent.childrenCount;
		for (var i = 0; i < childcount-3; i++) {
			this.ui.hintCardBg.parent.getChildByName("card").removeFromParent();
		}
		this.ui.hintcard_forClone = this.ui.hintCardBg.parent.getChildByName("card");
		this.ui.hintcard_forClone.setPosition(cc.v2(0,0));
		this.ui.hintcard_forClone.active = false;
	}
	getTingCards(index){
		this.removeHintCards();
		let cardnode=this.ui.standcards[index+this.model.offset];
		// 判断是否听牌进行听牌提示
		let card=this.model.myself.handcard[index];
		let tingdata=this.model.tingtypedic[card];
		if(tingdata==null||Object.keys(tingdata).length==0)
		{
			this.model.setcurtingtype(null);
			return ;
		}
		let tingtype = tingdata.type;
		if (tingtype == -1) {
			this.model.setcurtingtype(null);
			return;
		}
		//console.log("hidezimo2",tingtype==0,this.model.mahjongCards.getCardCount()==13,this.model.myself.checkJinXianZhi(MahjongDef.event_zimo),this.model.myself.getJinCount()<1);
		if(tingtype==0&&this.model.mahjongCards.getCardCount()==13&&(this.model.myself.checkJinXianZhi(MahjongDef.event_zimo)))
		{
			return;
		}
		this.model.setcurtingtype(tingdata);
		this.showTingCards(tingdata);
	}
	showTingCards(data){
		if (data ==null || data ==undefined) {
			return;
		}
		let huCards = data.cards;
		switch (data.type) {
			case 0:
				this.hideHintCardsTitles();				
			    this.ui.hintcardsTitles[MahjongDef.event_zimo].active = true;
			    //console.log("hidezimo1",this.model.myself.checkJinXianZhi(MahjongDef.event_zimo),this.model.myself.getJinCount());
				this.ui.node_zimo.active=false;
				this.ui.node_huzimo.active=true;
				this.ui.node_wantonlyhu.active=false;
			    if((!this.model.myself.checkJinXianZhi(MahjongDef.event_zimo)&&this.model.myself.getJinCount()>=1)||(this.model.mahjongCards.getCardCount()==13&&(!this.model.myself.checkJinXianZhi(MahjongDef.event_zimo)&&this.model.myself.getJinCount()>=1))) {
					this.ui.node_zimo.active=true;
					this.ui.node_huzimo.active=false;
            		let gameId = BetMgr.getInstance().getGameId()
					if(!this.model.myself.checkJinXianZhi(MahjongDef.event_hu)&&gameId==1) {
						this.ui.node_zimo.active=false;
						this.ui.node_huzimo.active=true;
					}
				}
				if(huCards.length >= this.model.mahjongCards.getTingAllCard() || huCards.length == 0){
					this.ui.hintcardsTitles[MahjongDef.event_zimo].active = false; 
					this.ui.node_wantonlyhu.active = true;
					this.ui.node_wantonlyhu.setPositionX(-200);
					huCards.length = 0;
					//console.log("huCards",data.cards,huCards.length);
					//console.log("mahjongCards",this.model.mahjongCards.getTingAllCard());
				}	
				this.showHintcards(true);
				for (let n= 0; n< huCards.length; n++) {
					let key = huCards[n]; 
					let spriteFrame = this.model.mahjongResMgr.getInstance().getCardSpriteFrame(key);
					let cardTotalNum = MahjongGeneral.isJoker(parseInt(key))?3:4;
					// 获取牌面剩余牌数
					let leftCardNum = cardTotalNum- this.model.myself.getLeftHandCountByValue(parseInt(key))- this.model.myself.getLeftOpCardsCountByValue(parseInt(key))- this.model.myself.getLeftcardpoolCountByValue(parseInt(key));
					for(let n=0;n< this.model.mahjongLogic.getInstance().seatcount;n++)
					{
						let player = this.model.mahjongLogic.getInstance().players[n];
						if (n!= this.model.mySeatId) {
							leftCardNum = leftCardNum - player.getLeftOpCardsCountByValue(parseInt(key)) - player.getLeftcardpoolCountByValue(parseInt(key));
						}
					}
					this.addHintCard(n,spriteFrame,leftCardNum,MahjongGeneral.isJoker(parseInt(key)));
				}
				this.adjustHintCardsBg(huCards.length,MahjongDef.event_zimo);
				break;
			case 1:
				this.hideHintCardsTitles();
			    this.ui.hintcardsTitles[MahjongDef.event_shuangyou].active = true;
				this.showHintcards(true);
				for (let n= 0; n< huCards.length; n++) {
					let key = huCards[n]; 
					let spriteFrame = this.model.mahjongResMgr.getInstance().getCardSpriteFrame(key);
					let cardTotalNum = MahjongGeneral.isJoker(parseInt(key))?3:4;
					// 获取牌面剩余牌数
					let leftCardNum = cardTotalNum- this.model.myself.getLeftHandCountByValue(parseInt(key))- this.model.myself.getLeftOpCardsCountByValue(parseInt(key))- this.model.myself.getLeftcardpoolCountByValue(parseInt(key));
					for(let n=0;n< this.model.mahjongLogic.getInstance().seatcount;n++)
					{
						let player = this.model.mahjongLogic.getInstance().players[n];
						if (n!= this.model.mySeatId) {
							leftCardNum = leftCardNum - player.getLeftOpCardsCountByValue(parseInt(key)) - player.getLeftcardpoolCountByValue(parseInt(key));
						}
					}
					this.addHintCard(n,spriteFrame,leftCardNum,MahjongGeneral.isJoker(parseInt(key)));
				}
				this.adjustHintCardsBg(huCards.length,MahjongDef.event_shuangyou);
				break;
			case 2:
				this.hideHintCardsTitles();
			    this.ui.hintcardsTitles[MahjongDef.event_sanyou].active = true;
				this.showHintcards(true);
				for (let n= 0; n< huCards.length; n++) {
					let key = huCards[n];
					let spriteFrame = this.model.mahjongResMgr.getInstance().getCardSpriteFrame(key);
					let cardTotalNum = MahjongGeneral.isJoker(parseInt(key))?3:4;
					// 获取牌面剩余牌数
					let leftCardNum = cardTotalNum- this.model.myself.getLeftHandCountByValue(parseInt(key))- this.model.myself.getLeftOpCardsCountByValue(parseInt(key))- this.model.myself.getLeftcardpoolCountByValue(parseInt(key));
					for(let n=0;n< this.model.mahjongLogic.getInstance().seatcount;n++)
					{
						let player = this.model.mahjongLogic.getInstance().players[n];
						if (n!= this.model.mySeatId) {
							leftCardNum = leftCardNum - player.getLeftOpCardsCountByValue(parseInt(key)) - player.getLeftcardpoolCountByValue(parseInt(key));
						}
					}
					this.addHintCard(n,spriteFrame,leftCardNum,MahjongGeneral.isJoker(parseInt(key)));
				}
				this.adjustHintCardsBg(huCards.length,MahjongDef.event_sanyou);
				break;
		}
	}
	hideTingFlag(idx)
	{
		for (let i = 0; i < this.ui.standcards.length; ++i) {
			if (idx == -1) {
				this.ui.hintflags[i].active = false;
			}
			else if (idx == i) {
				this.ui.hintflags[i].active = false;
			}
		}
	}
	showGaiPaiSels()
	{  
		//console.log("显示盖牌效果=",this.model.maskcards);
		for(let index=0;index<this.model.myself.handcard.length;++index)
		{
			let value=this.model.myself.handcard[index];
			if(!this.model.isInGaiPai(value))
			{
				this.model.maskCardList[index] = value;
				let cardnode=this.ui.standcards[index+this.model.offset];
				//console.log("加上了盖牌")
				cardnode.getChildByName("majingBg").color=new cc.Color(156,156,151);
			}
		}	
	}
	bezierTo(pointMoveTo,callback,BezierEndPointCardIdx)
	{
		let catchCard = this.ui.standcards[this.ui.standcards.length-1];
		let catchCardPos = catchCard.getChildByName("majingBg").getPosition();
		let contentSize =cc.director.getWinSize();
		let bezier = [cc.p(0,0), cc.p((-catchCardPos.x+pointMoveTo.x)/2, contentSize.height/2), cc.p(-catchCardPos.x+pointMoveTo.x, 0)];
		let bezierTo = cc.bezierTo(0.1*((this.ui.standcards.length-BezierEndPointCardIdx)/this.ui.standcards.length), bezier);
		catchCard.runAction(cc.sequence(bezierTo,cc.callFunc(function(){catchCard.setPosition(cc.p(0,0));catchCard.active=false;}),cc.callFunc(function(){callback();})));
	}
	cardsMoveRight(beginIdx,endIdx,mahjongWidth)
	{
		for (let cardIdx = beginIdx; cardIdx <= endIdx; ++cardIdx) {
			let standcards = this.ui.standcards[cardIdx];
			let moveBy = cc.moveBy(0.1*((this.ui.standcards.length-beginIdx)/this.ui.standcards.length),cc.p(mahjongWidth,0));
			standcards.runAction(cc.sequence(moveBy,cc.callFunc(function(){standcards.setPosition(cc.p(0,0));})));
		}
	}
	cardsMoveLeft(beginIdx,endIdx,mahjongWidth)
	{
		for (let cardIdx = beginIdx; cardIdx <= endIdx; ++cardIdx) {
			let standcards = this.ui.standcards[cardIdx];
			let moveBy = cc.moveBy(0.1*((this.ui.standcards.length-endIdx)/this.ui.standcards.length),cc.p(-mahjongWidth,0));
			standcards.runAction(cc.sequence(moveBy,cc.callFunc(function(){standcards.setPosition(cc.p(0,0));})));
		}
	}
	playcatchCardMoveEffect(callback)
	{
		let self = this;
		let BezierEndPointCardIdx = this.model.getBezierEndPointCardIdx(this.model.catchCard);
		if (typeof(callback)!="function") {
			return;
		}
		if (BezierEndPointCardIdx==-1 || (self.model.outCardIdx+this.model.offset+1)==this.ui.standcards.length) {
			callback();
			return;
		}
		let BezierEndPointCardPos = this.ui.standcards[BezierEndPointCardIdx+this.model.offset].getChildByName("majingBg").getPosition();
		self.bezierTo(BezierEndPointCardPos,callback,BezierEndPointCardIdx+self.model.offset);
		if (this.model.outCardIdx>BezierEndPointCardIdx) {
			self.cardsMoveRight(BezierEndPointCardIdx+self.model.offset,self.model.outCardIdx+self.model.offset,this.model.handcardSpace);
		}
		else if (this.model.outCardIdx<BezierEndPointCardIdx) {
			self.cardsMoveLeft(self.model.outCardIdx+self.model.offset,BezierEndPointCardIdx+self.model.offset,this.model.handcardSpace);
		}
	}
	showcatchCard()
	{
		this.ui.standcards[this.ui.standcards.length-1].active=true;
		if(MahjongGeneral.isJoker(this.model.catchCard)) {
			this.ui.standcards[this.ui.standcards.length-1].getChildByName('majingBg').color=this.model.jinColor;
		}
		else
			this.ui.standcards[this.ui.standcards.length-1].getChildByName('majingBg').color=White;
	}
	updateHintcardsShow(flag)
	{
		if(this.model.curtingtype!=null) {
			this.ui.btn_hintCardsShow.node.active = flag;
		}
		else
		{
			this.ui.btn_hintCardsShow.node.active = false;
		}
	}
	playOutcardEffect(index,event,callback)
	{
		if (typeof(callback)!="function") {
			return;
		}
		// let outcard = this.ui.standcards[index];
		// outcard.setPosition(cc.p(0,0));
		callback(index)

		// if(event.getLocation().y-event.getStartLocation().y<=20)
		// {
		// 	outcard.setPosition(cc.p(0,0));
		// 	return;
		// }
		// let outcardPos = this.ui.node_outcardPos.getPosition();
		// let winSize = cc.director.getWinSize();
		// let outcardWorldPos = cc.p(outcardPos.x+winSize.width/2,outcardPos.y+winSize.height/2);
		// let moveBy = cc.moveBy(0.1,cc.p(outcardWorldPos.x-event.getLocation().x,outcardWorldPos.y-event.getLocation().y));
		// let self = this;
		// outcard.runAction(cc.sequence(moveBy,cc.callFunc(function(){outcard.setPosition(cc.p(0,0));}),cc.callFunc(function(){callback(index)})));
	}
	//趴下
	layDown(){
		this.ui.cards_stand.active=false;
		this.ui.cards_laydown.active=true;
	} 
	//挺起
	showStand(){
		this.ui.cards_stand.active=true;
		this.ui.cards_laydown.active=false;
	}	
	//重置操作牌的标记
	resetOpCardsFlag(){
		for (let i = this.model.offset;i<this.ui.standcards.length;++i){
			let card = this.ui.standcards[i];
			let cardIndex=i-this.model.offset
			let value=this.model.myself.handcard[i-this.model.offset];  
			if(!MahjongGeneral.isJoker(value)) { 
				card.getChildByName('majingBg').color=White;
			}
		}		
	}
	//更新操作牌的标记
	updateOpCardsFlag(){
		for(let i=0;i<this.model.opcardsindexes.length;++i)
		{
			let index=this.model.opcardsindexes[i];
			//console.log("index=",this.model.offset+index,this.model.offset)
			let card = this.ui.standcards[this.model.offset+index];
			if(!card)
			{
				//有可能换牌的情况下录像回放出问题,这边要做个容错
				continue;
			} 
			card.getChildByName('majingBg').color=LightGreen; 
		}
	}
}
//c, 控制
@ccclass
export default class MyHandMahjongCtrl extends BaseCtrl {
	//这边去声明ui组件  
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离 

	@property({
		tooltip : "麻将牌型提示框空白区",
		type : cc.Integer
	})
	Int_blankWidth : cc.Integer = 0;

	@property({
		tooltip : "麻将听牌牌型间隔",
		type : cc.Integer
	})
	Int_paiSpace : cc.Integer = 0;

	@property({
		tooltip : "麻将提示按钮",
		type : cc.Button
	})
	btn_hintCardsShow : cc.Button = null;
  
	@property({
		tooltip : "麻将手牌牌型间隔",
		type : cc.Integer
	})
	Int_handcardSpace : cc.Integer = 0;
	@property({
		tooltip : "麻将出牌提示位置",
		type : cc.Node
	})
	node_outcardPos : cc.Node = null;
 

    fapaitimer=null;//发牌动画定时器
	fapaiStep=0;//发牌动画帧
	
	tidytimer=null;//整理手牌定时器
	tidystep=0;//整理手牌动画帧
	@property
	jinRed: Number = 0;
	@property
	jinGreen: Number = 0;
	@property
	jinBlue: Number = 0;
	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model,View);
		this.model.setJinColor(this.jinRed,this.jinGreen,this.jinBlue) 
	}
	onDestroy(){
		this.clerPlayTimer();
		this.clerPlayCardTimer();
		this.clearFaPaiTimer();
		this.clearTidyTimer();
		super.onDestroy();
	}
	clerPlayTimer(){
		if (this.model.playTimer!=null) {
			clearTimeout(this.model.playTimer);
			this.model.playTimer = null;
		}
	}
	clerPlayCardTimer(){
		if (this.model.playCardTimer!=null) {
			clearTimeout(this.model.playCardTimer);
			this.model.playCardTimer = null;
		}
	}
	clearFaPaiTimer(){
		if(this.fapaitimer!=null)
		{
			clearInterval(this.fapaitimer);
			this.fapaitimer=null;
		}
	}
	clearTidyTimer(){
		if(this.tidytimer!=null)
		{
			clearInterval(this.tidytimer);
			this.tidytimer=null;
		}
	}
	//定义网络事件
	defineNetEvents()
	{
		this.n_events={ 
			//网络消息监听列表      
			'onEvent':this.onEvent,  
			onSeatChange:this.onSeatChange,  
			onSyncData:this.onSyncData,
			onProcess:this.onProcess,
			onOp:this.onOp,        
            onGmOp:this.onGmOp,
			'http.reqSettle':this.http_reqSettle,
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
		this.bindCardTouch();
		this.connect(G_UiType.button, this.btn_hintCardsShow.node, {"startCallBack":this.btn_hintCardsShowStartcb, "moveCallBack":null, "endCallBack":this.btn_hintCardsShowEndcb,"cancelCallBack":this.btn_hintCardsShowEndcb}, '点击显示提示框');
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end 
    process_fapai(){
		this.fapaiStep=0; 
		this.view.initFaPai();
		this.startFaPaiTimer();
	}	
	usersUpdated()
	{
		//console.log("我更新啦啦啦")
		//清空数据和牌
		this.model.clear();
		this.view.clear();
		this.model.updateMyInfo();//更新我的信息
	}
	onEvent(msg)
	{
		// body   
		this.view.resetOpCardsFlag();
		let eventLength=this.model.myself.events.length;
		let event=this.model.myself.events[eventLength-1]; 
		this.model.updateOpCardsFlag()//更新吃碰杠等标记
		this.view.updateOpCardsFlag();
		if(event>=MahjongDef.event_shuangyou&&this.model.mahjongCards.getCardCount()!=13)
		{
			this.view.hideTingFlag(-1);
		} 
        //console.log("event",event,this.model.mahjongDef.event_danyou)
        for (let i = 0; i < eventLength; i++) {
        	let checkEvent = this.model.myself.events[i];
	        if(this.model.mahjongLogic.getInstance().isShuangYou()&&this.model.mahjongCards.getCardCount()==13&&checkEvent==this.model.mahjongDef.event_danyou) {
				this.view.updateTingSpriteFrame();
	        }
        }
		switch(this.model.myself.state)
		{
			case MahjongDef.state_chupai:
				this.view.updateHintcardsShow(false);
			break;
			case MahjongDef.state_gaipai:
				this.model.updateGaiPaiFlag();
				this.view.showGaiPaiSels();
			break;
			default:
			return;
		}
		// 更新抓牌并显示抓牌
		this.model.updateCatchCard();
		this.view.showcatchCard();
		this.model.enabledOp(); 
	} 
	//广播gm操作
	onGmOp(msg)
	{ 
		switch(msg.optype)
		{
			case MahjongDef.gmop_changecard:{
				if(msg.opseatid==RoomMgr.getInstance().getMySeatId())
				{
					//console.log("updatecards1")
					//自己换牌
					this.view.updateHandCards();
				}
				if(msg.data.target==RoomMgr.getInstance().getMySeatId())
				{
					//console.log("updatecards2")
					//我的牌被别人换了
					this.view.updateHandCards();
				}
			}
			break;
		}
	}
	onSyncData(  )
	{ 
		//console.log("同步数据")
		this.model.recover();
		//断线重连后听牌提示恢复
		this.model.updateOffset(); 
		this.view.recover(); 
		//如果当前用户和自己位置不同则不计算听牌提示 
		if (RoomMgr.getInstance().getMySeatId() == this.model.mahjongLogic.getInstance().curseat){
			this.showtingtip();
		}
		var cur_eventtype=this.model.mahjongLogic.getInstance().cur_eventtype;
		if (cur_eventtype){
			if (cur_eventtype==MahjongDef.event_chupai){  
				this.model.enabledOp(); 
			}
		}
		this.view.updateCards() 
		this.onEvent(null)

	}
	onSeatChange(msg){
		// body  
		//隐藏听牌提示
		this.view.removeHintCards();
		this.view.resetOpCardsFlag();
		if (this.model.mySeatId != this.model.mahjongLogic.getInstance().curseat)
			return; 
		let self=this;
		let updateHandCard = function () {
			self.view.updateCards();
			self.showtingtip();
		}  
		if (msg.needbupai&&msg.huaarr.length>0) 
		{
			updateHandCard();
			let aniHuaArr=msg.huaarr.concat(); 
			let loopCount = aniHuaArr.length;
			let curLoopCount =1;
			let buhua = function (card, pai) {				
				this.view.playCardBuhuaEffect (card, pai, function () {													
					if (loopCount <= curLoopCount) {
						//console.log("curLoopCount1",curLoopCount);
						return updateHandCard();
					}else{
						curLoopCount++;	
						//console.log("curLoopCount2",curLoopCount);					
						let value = aniHuaArr[curLoopCount];
						buhua(card, value);
					}					
				}.bind(this))
			}.bind(this);
			buhua(self.ui.standcards[self.ui.standcards.length-1], aniHuaArr[curLoopCount])
		}
		else{
			updateHandCard();
		}
	} 
 
	showtingtip(){
		//回放模式不显示听牌信息
		if(RoomMgr.getInstance().getVideoMode())
		{
			return;
		}
		this.model.updateTingDic();
		this.view.updateTingFlag();
	}
	onOp(msg){
		if (msg.opseatid!=this.model.mySeatId)
		{
			this.view.updateCards();
			return;
		} 
		this.model.updateOffset();
		this.view.resetOpCardsFlag();
		// body  
		//console.log("onOp");
		this.view.updateHintcardsShow(true);
		this.view.hideTingFlag(-1);
		var op=MahjongDef.op_cfg[msg.event];
		switch(op)
		{
			case MahjongDef.op_chupai:
				let self = this;
				this.model.disabledOp();
					// self.op_chupai(msg);
				//出牌特效
				//self.view.playcatchCardMoveEffect(function(){
					self.op_chupai(msg);
				//});
			break;
			case MahjongDef.op_bugang:
				this.op_bugang(msg);
			break;
			case MahjongDef.op_gaipai:
				this.op_gaipai(msg);
			break;
			case MahjongDef.op_angang:
				this.op_angang(msg);
			break; 
			case MahjongDef.op_chi:
				this.op_chi(msg)
			break;
			case MahjongDef.op_peng:
				this.op_peng(msg);
			break;
			case MahjongDef.op_gang:
				this.op_gang(msg);
			break;
			case MahjongDef.op_hu:
				this.op_hu(msg);
			break;
			case MahjongDef.op_qianggang_hu:
				this.op_qianggang_hu(msg);
			break;
			case MahjongDef.op_qiangjinhu:
				this.op_qiangjinhu(msg);
			break;
			default:
				this.model.updateCatchCard();
				this.view.showcatchCard();
			break;
		} 
	}  
	op_hu(msg){
		this.view.updateCards(); 
	}
	op_qiangjinhu(msg)
	{
		this.view.updateCards();
	}
	op_qianggang_hu(msg){
		this.view.updateCards(); 
	}
	op_chi(msg)
	{
		this.view.updateCards(); 
	}
	op_peng(msg)
	{
		this.view.updateCards(); 
	}
	op_gang(msg)
	{
		this.view.updateCards(); 
	}
	op_bugang(msg)
	{
		this.view.updateCards(); 
	}
	op_angang(msg)
	{ 
		this.view.updateCards(); 
	}
	op_gaipai(msg)
	{
		//盖牌
		// 其他人盖牌显示
		this.model.setotherPlayerGaiPaitype(msg.card);
		this.view.updateCards();
	}
	onProcess(msg){ 
		if (msg.process==MahjongDef.process_kaijin){
			this.process_kaijin();
		}
		else if (msg.process==MahjongDef.process_fapai){ 
			this.process_fapai();
		}
		else if (msg.process==MahjongDef.process_ready){ 
			this.process_ready(); 
		} 
		else if (msg.process==MahjongDef.process_buhua){ 
			this.process_buhua(msg);
		}
		else if (msg.process==MahjongDef.process_loop){ 
			this.process_loop(msg);
		}
	}
	process_kaijin()
	{
		this.tidystep=0;
		this.startTidyTimer();
	}
	stepFaPai(){
		if(this.view) {
			switch(this.fapaiStep)
			{
				case 0:
					this.view.stepFaPai(0);
				break;
				case 1:
					this.view.stepFaPai(1);
				break;
				case 2:
					this.view.stepFaPai(2);
				break;
				case 3:
					this.view.stepFaPai(3);
				break;
				case 4:
					this.view.stepFaPai(4);
				break;
				case 5:
					this.fapaiStep=0;
					this.clearFaPaiTimer(); 
				break;
				default:
					this.fapaiStep=0;
					this.clearFaPaiTimer();  
				break;
			}
			this.fapaiStep++;
		}
	}
	stepTidy(){
		switch(this.tidystep)
		{ 
			case 2:
				this.view.layDown();
			break;
			case 3: 
				this.view.updateHandCards();
				this.view.showStand();
			break;
			case 4:
				this.clearTidyTimer();
			break;
		}
		this.tidystep++;
	}
	//发牌动画定时器
	startFaPaiTimer(){
		this.fapaitimer=setInterval(this.stepFaPai.bind(this),150)
	}
	//整理手牌定时器
	startTidyTimer(){
		this.tidytimer=setInterval(this.stepTidy.bind(this),500)
	}
	process_loop(msg)
	{
		//console.log("process_loop");
		if (this.model.mySeatId == this.model.mahjongLogic.getInstance().curseat){
			this.showtingtip();
		}
	}
    process_buhua(msg){
		let huaposes=[]
		if(msg.buhuaposes)
		{
			huaposes=msg.buhuaposes[this.model.mySeatId]
		} 
        let myBuhuaData = {
            hua: msg.huapaiarr[this.model.mySeatId],
			pai: msg.bupaiarr[this.model.mySeatId],
			poses:huaposes
		}
		let self = this; 
        if (myBuhuaData.hua.length) {
            // 先播放补花特效
            this.view.playBuhuaEffect(myBuhuaData, function() {
                // setTimeout(self.view.updateCards(),1000);
            });
		}
	}
    process_ready(){
		// body
		this.model.clear();
		this.view.clear();
	}
  
	touchStart(index,event){
		//console.log("touchStart event=",event)
	}
	touchCard(index,event){
		//播放选牌音效
		this.model.mahjongAudio.getInstance().playCardHover();
		let outcardPos = this.ui.node_outcardPos.getPosition();
		let winSize = cc.director.getWinSize();
		let outcardPos1 = cc.p(outcardPos.x+winSize.width/2,outcardPos.y+winSize.height/2);
		//console.log("touch  Card end",event.getLocation(),outcardPos1,outcardPos,this.model.cardTouchMoveFlag,SettingMgr.getInstance().getControlInfo().bMjClick);
		// 逻辑挪到mycardLogic
		
		let cardvalue=this.model.myself.handcard[index-this.model.offset];
		this.gemit(GEventDef.mj_chosecard,cardvalue);//广播选中某张牌的消息
		if (this.model.cardTouchMoveFlag) {
			let self = this;
			this.model.cardTouchMoveFlag=false;
			this.model.willMoveCardFlag=false;
	        // 听牌牌型显示
	        this.view.getTingCards(index-this.model.offset);
	        this.outcard(index);
			// this.view.playOutcardEffect(index,event,self.outcard.bind(self));
		}
		else
		{
			if(this.model.willMoveCardFlag)
			{
				this.model.willMoveCardFlag=false;
				this.model.cursel=null;
				this.view.updateSel();
				return
			}
			if (this.model.touchLimit(index) || !SettingMgr.getInstance().getControlInfo().bMjClick) {
				return;
			}
			if(this.model.cursel==index){
				this.outcard(index);
				return;
			}
			// 听牌提示隐藏
			this.view.updateTingFlag();
			this.view.hideTingFlag(index);
	        // 听牌牌型显示
	        this.view.getTingCards(index-this.model.offset);

			this.model.cursel=index;
			this.view.updateSel();
		}
	}
	touchCardMove(index,event){ 
		//console.log("touch card move",index,event,event.getDelta(),event.getLocation(),event.getStartLocation());
		// return;
		if (this.model.touchLimit(index) || !SettingMgr.getInstance().getControlInfo().bMjDrag) {
			return;
		}
		if (Math.abs(event.getLocation().x-event.getStartLocation().x)<=60 && Math.abs(event.getLocation().y-event.getStartLocation().y)<=60) {
			this.model.cardTouchMoveFlag=false;
			this.gemit(GEventDef.mj_chosecard,-1);//广播选中某张牌的消息
			let outcard = this.ui.standcards[index];
			outcard.setPosition(cc.p(0,0));
			return;
		} 
		this.model.willMoveCardFlag=true;
		let cardvalue=this.model.myself.handcard[index-this.model.offset];
		this.gemit(GEventDef.mj_chosecard,cardvalue);//广播选中某张牌的消息
		this.model.cardTouchMoveFlag=true;
		let endPos = cc.v2(event.getLocation().x-event.getStartLocation().x,event.getLocation().y-event.getStartLocation().y);
		this.ui.standcards[index].setPosition(endPos);
	}
	touchCardCancel(index,event){
		this.model.willMoveCardFlag=false;
		this.gemit(GEventDef.mj_chosecard,-1);//广播选中某张牌的消息
		let outcard = this.ui.standcards[index];
		outcard.setPosition(cc.p(0,0));
	}
	// 打牌
	outcard(index)
	{
		//要去除偏移部分 出牌
        //非双游 三游金不能打
		this.view.removeHintCards();
		let tingtype = -1;
        let standcards= this.model.myself.handcard[index-this.model.offset];
		let outcardlimitedFlag = this.model.myself.outcardLimited(standcards);
		//console.log("outcardlimitedFlag",outcardlimitedFlag);
		
        if(outcardlimitedFlag) {
        	let outcard = this.ui.standcards[index];
			outcard.setPosition(cc.p(0,0));
        	return;
        }
		this.ui.standcards[index].active=false;
		this.view.stopyoujinshuangyouflagEffect();
        //console.log("tingtype",tingtype);
        //console.log("cardvalue",this.model.myself.handcard[index-this.model.offset]); 
        this.model.setoutCardIdx(index-this.model.offset);
		switch(this.model.myself.state)
		{
			case MahjongDef.state_chupai:
				this.model.mahjongLogic.getInstance().playerOp(MahjongDef.event_chupai,index-this.model.offset);
			break;
			case MahjongDef.state_gaipai:
				this.model.mahjongLogic.getInstance().playerOp(MahjongDef.event_gaipai,index-this.model.offset);
			break;
			default:
			return;
		}
		this.model.disabledOp();
	}
	bindCardTouch(){  
		for(let i=0;i<this.ui.standcards.length;++i){  
			let node=this.ui.standcards[i];  
			let majingBg=node.getChildByName('majingBg')   
			let self = this;
			majingBg.on(cc.Node.EventType.TOUCH_START, function (event) { 
				//console.log("TOUCH_START");
				this.touchStart.bind(this)(i,event);
			},this);
			majingBg.on(cc.Node.EventType.TOUCH_END, function (event) { 
				//console.log("TOUCH_END");
				this.touchCard.bind(this)(i,event);
			},this);
			majingBg.on(cc.Node.EventType.TOUCH_MOVE, function (event) { 
				this.touchCardMove.bind(this)(i,event,self.outcard);
			},this);
			majingBg.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
				this.touchCardCancel.bind(this)(i,event);
			},this);
		}
	}
	op_chupai(msg){
		//收到出牌的指令了 
		this.model.cursel=null; 
		this.view.updateCards();
	}
	btn_hintCardsShowStartcb(event)
	{
		//console.log(event);
		this.view.removeHintCards();
		this.view.showTingCards(this.model.curtingtype);
	}
	btn_hintCardsShowEndcb(event)
	{
		//console.log("btn_hintCardsShowEndcb");
		
		this.view.removeHintCards();
	}
	http_reqSettle(  ){
		this.view.updateCards();
		this.model.setcurtingtype(null);
		this.view.removeHintCards();
		this.view.updateHintcardsShow(false);
	}
}
