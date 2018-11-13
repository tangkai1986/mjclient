import MahjongPlayer from "../../../GameCommon/Mahjong/MahjongPlayer";
import { MahjongGeneral } from "../../../GameCommon/Mahjong/MahjongGeneral";
import { MahjongDef } from "../../../GameCommon/Mahjong/MahjongDef";
import MahjongAudio from "../../../GameCommon/Mahjong/MahjongAudio";
  
export default class FzmjPlayer extends MahjongPlayer
{  
	constructor(){
		super();
	}
    //检查金限制
    checkJinXianZhi(event){
		return false;
	}	
	outcardLimited(standcard)
	{  
    	return MahjongGeneral.isJoker(standcard);
	}	
   
	getTingDicNative(handcard,players,mySeatId)
	{
		let tingDic=this.jsbGetTingDic(handcard);
		// 判断是否听牌进行听牌提示
		this.tingtypedic={}; 
		let myself = players[mySeatId];
		let maxTingType=-1;
		for(let key in tingDic)
		{
			let card=parseInt(key);
			let item=tingDic[key];
			let isXianJin=item.bXianJin;
			let tingcards=[];
			let huTypes=[];
			let jinCounts=[];
			let info=item.info;
			for(let i = 0;i<info.length;++i)
			{
				let tmpItem=info[i];
				tingcards.push(tmpItem.cardValue);
				huTypes.push(tmpItem.huType);
				jinCounts.push(tmpItem.jinCount);
			}   
			let tingtype=-1;
			let tingTotalNums=0;
			if(tingcards.length>0)
			{
				tingtype=0;
				if(tingtype>maxTingType) {
					maxTingType=tingtype;
				}
			}

			let keys = [];
			for (let n= 0; n< tingcards.length;) {
				let key = tingcards[n];
				// 获取牌面剩余牌数
				let cardTotalNum = MahjongGeneral.isJoker(parseInt(key))?3:4;
	 
				n++;
				let leftCardNum = cardTotalNum- myself.getLeftHandCountByValue(parseInt(key))- myself.getLeftOpCardsCountByValue(parseInt(key))- myself.getLeftcardpoolCountByValue(parseInt(key));
				for(let m in players)
				{
					let player = players[m];
					if (parseInt(m)!= mySeatId) {
						leftCardNum = leftCardNum - player.getLeftOpCardsCountByValue(parseInt(key)) - player.getLeftcardpoolCountByValue(parseInt(key));
					}
				}
				tingTotalNums += leftCardNum;
			} 
			this.tingtypedic[card]={
				type:tingtype,
				cards:keys.length==0?tingcards:keys,
				tingNums:tingTotalNums
			}
		}
		for (let i = 0; i < handcard.length; i++) {
			let card=handcard[i];
			if(!this.tingtypedic[card])
			{
				continue;
			}
			if(this.tingtypedic[card].type < maxTingType) {
				this.tingtypedic[card]={};
			}
			let keys=[]//这边要确认
			//这写的有问题
			if(keys.length!=0) {
				let tingTotalNums=0;
				for (let j = 0; j < keys.length; j++) {
					let key = keys[j];
					// 获取牌面剩余牌数
					let cardTotalNum = MahjongGeneral.isJoker(parseInt(key))?3:4;
					let leftCardNum = cardTotalNum- myself.getLeftHandCountByValue(parseInt(key))- myself.getLeftOpCardsCountByValue(parseInt(key))- myself.getLeftcardpoolCountByValue(parseInt(key));
					for(let m=0;m< players.length;m++)
					{
						let player = players[m];
						if (m!= mySeatId) {
							leftCardNum = leftCardNum - player.getLeftOpCardsCountByValue(parseInt(key)) - player.getLeftcardpoolCountByValue(parseInt(key));
						}
					}
					tingTotalNums += leftCardNum;
				}
				this.tingtypedic[card].cards=keys;
				this.tingtypedic[card].tingNums=tingTotalNums;
			}
		}
		return this.tingtypedic;
	} 
	getTingDic(handcard,players,mySeatId)
	{
		 
		// if(cc.sys.isNative)
		// { 
		// 	//调用底层计算
		// 	//因为oc那边js调用C++有问题.所以先只考虑android和pc
		// 	if (cc.sys.os != cc.sys.OS_IOS) {
		// 		//调用底层计算
		// 		return this.getTingDicNative(handcard,players,mySeatId)
		// 	}
		// }
		// 判断是否听牌进行听牌提示
		this.tingtypedic={}; 
		let myself = players[mySeatId];
		let maxTingType=-1;
		let tingDic={};
		//算胡牌
		for (let i = 0; i < handcard.length; i++) {
			let tmpCards = handcard.concat();
			tmpCards.remove(i); 
			let isXianJin=this.checkXianJin(tmpCards);
			let card=handcard[i];
			tmpCards.sort();
			let tingarr=this.getTingArr(tmpCards); 
			let tingcards=Object.keys(tingarr);
			let tingtype=-1;
			if(tingcards.length>0)
			{
				tingtype=0;
				if(tingtype>maxTingType) {
					maxTingType=tingtype;
				}
			}
			let info = {};
			info.bXianJin = isXianJin;
			info.tingarr =tingarr;
			info.tingtype = tingtype;
			tingDic[card] = info;
		}
		//算听牌数量
		for(let card in tingDic)
		{
			let huinfo = tingDic[card];
			let tingarr = huinfo.tingarr;
			let tingcards=Object.keys(huinfo.tingarr);
			let tingtype=huinfo.tingtype;
			//小于最大的听牌则不进行计算听牌数量
			if(tingtype<maxTingType) {
				continue;
			}
			let tingTotalNums=0;
			for (let n= 0; n< tingcards.length;) {
				let key = tingcards[n];
				let cardhuinfo = tingarr[key];
				// 获取牌面剩余牌数
				let cardTotalNum = MahjongGeneral.isJoker(parseInt(key))?3:4;
				n++;
				let leftCardNum = cardTotalNum- myself.getLeftHandCountByValue(parseInt(key))- myself.getLeftOpCardsCountByValue(parseInt(key))- myself.getLeftcardpoolCountByValue(parseInt(key));
				for(let m in players)
				{
					let player = players[m];
					if (parseInt(m)!= mySeatId) {
						leftCardNum = leftCardNum - player.getLeftOpCardsCountByValue(parseInt(key)) - player.getLeftcardpoolCountByValue(parseInt(key));
					}
				}
				tingTotalNums += leftCardNum;
			}
			tmpCards=[];
			this.tingtypedic[card]={
				type:tingtype,
				cards:tingcards,
				tingNums:tingTotalNums
			}
		}
		//过滤小于maxTIngType类型的胡牌
		for (let i = 0; i < handcard.length; i++) {
			let card=handcard[i];
			if(!this.tingtypedic[card] || this.tingtypedic[card].type < maxTingType) {
				this.tingtypedic[card]={};
				continue;
			}
		}
		return this.tingtypedic;
	}	
	getyise(){
		//计算一色
		let yise=null;
		//请混一色受到开关控制
		if(this.logic.prop.get_b_qinghunyise())
		{
			if(this.opcards.length>0)
			{
				let value=this.getOpCardByIndex(0);
				yise=MahjongGeneral.Majiang_Type(value); 
			}
			for (let index = 1; index < this.opcards.length; index++) {
				let value=this.getOpCardByIndex(index);
				let se=MahjongGeneral.Majiang_Type(value)
				//判断吃碰杠是否为一色
				if(se!=yise)
				{ 
					yise=-1;
					break;
				}
			}
		}
		else
		{
			yise=-1;
		} 
		return yise;
	}
	getHuType()
	{
		let hutype=null;
		let pai=this.handcard.concat();
		if(this.events.contains(MahjongDef.event_hu))
		{
			pai.push(this.logic.curcard);
		} 
		pai.sort();
        let yise = this.getyise();	
		let huinfo=this.mahjongcards.IsHu(pai,yise,this.logic.prop.get_b_jinlong())
		if(!huinfo)
		{
			return null;
		}
		return huinfo.hutype;
	}
} 
