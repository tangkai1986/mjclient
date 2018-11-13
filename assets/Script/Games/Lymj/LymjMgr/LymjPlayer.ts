import MahjongPlayer from "../../../GameCommon/Mahjong/MahjongPlayer";
import { MahjongGeneral } from "../../../GameCommon/Mahjong/MahjongGeneral";
import { MahjongDef } from "../../../GameCommon/Mahjong/MahjongDef";

  
export default class LymjPlayer extends MahjongPlayer
{  
	constructor(){
		super();
	}
	//整理白板
	tidyBaiBan(tmpHandCard)
	{//先提取出白板
		let baibanCount=0;
		let firstBaiBanPos=-1;
		let lastBaiBanReplacePos=0;//半自动模式最后一次白板替换的位置
		let jokercount=0;
		for(let i=0;i<tmpHandCard.length;++i)
		{
			let cardvalue=tmpHandCard[i];
			//判断是白板,就抽离出来
			if(MahjongGeneral.isBaiBan(cardvalue)){
				baibanCount++;
				if(firstBaiBanPos<0)
				{
					firstBaiBanPos=i;
				}
			}
			else if(MahjongGeneral.isJoker(cardvalue))
			{
				jokercount++;
			}
			if(!this.logic.isQuanZiDong){
				if(cardvalue<this.logic.jin)
				{ 
					lastBaiBanReplacePos=i+1;
				}
			}
		}
		//移除白板
		for(let i = 0;i<baibanCount;++i)
		{
			tmpHandCard.remove(firstBaiBanPos);
		}

		//如果是全自动模式,则添加白板到金后面
		if(this.logic.isQuanZiDong){
			for(let i = 0;i<baibanCount;++i)
			{
				tmpHandCard.insert(jokercount,MahjongGeneral.emMJ.emMJ_BaiBan);
			}
		}
		else{
			//半自动模式添加到替换牌的后面
			for(let i = 0;i<baibanCount;++i)
			{
				tmpHandCard.insert(lastBaiBanReplacePos,MahjongGeneral.emMJ.emMJ_BaiBan);
			} 
		}
	}
	//龙岩麻将白板位置比较特殊
	sortCard()
	{
		let tmpHandCard=this.handcard.concat();
		tmpHandCard.sort();
		//整理白板
		this.tidyBaiBan(tmpHandCard) 
		this.handcard=tmpHandCard.concat();
        tmpHandCard=null;
    }
    
	outcardLimited(standcard)
	{
        if(this.isShuangYou())
        {
            if(!MahjongGeneral.isJoker(standcard))
            {
                return true;
            }
        }
		return false;
	}
    //检查金限制
    checkJinXianZhi(event){
        let jincount=this.getJinCount();
        if(jincount<=0)
        {
            return false;
        }
        switch(event)
        {
            case MahjongDef.event_zimo:
                let huinfo = this.mahjongcards.IsHu(this.handcard)   
                if(huinfo&&huinfo.hutype==MahjongDef.hutype_131)
                {
                    return false;//131没限制
                }
            break;
		}
		
        let jinxianzhi=this.logic.prop.get_b_jinxianzhi();
        switch(event)
        {
            case MahjongDef.event_hu:
                switch(jinxianzhi)
                {
                    case 0://单金可平胡,双金可平胡
                        return false;
                    break;
                    case 1://单金可平胡，双金必须游金
                        if(jincount<2){
                            return false;
                        } 
                    break;
                    case 2://单金必须游金双金必须游金
                    break; 
                }
            break;
            case MahjongDef.event_zimo:
            case MahjongDef.event_qianggang_hu:
                switch(jinxianzhi)
                {
                    case 0://单金可平胡,双金可平胡
                        return false;
                    break;
                    case 1://单金可平胡，双金必须游金
                        if(jincount<2){
                            return false;
                        }  
                    break;
                    // case 2://单金至少自摸,双金至少游金
                    //     if(jincount<2)
                    //     {
                    //         return false;
                    //     } 
                    // break;
                    case 2://单金必须游金双金必须游金
                    break; 
                }
            break;
            default:
            return false;
        }
        return true;
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
			if(isXianJin)
			{
				if(MahjongGeneral.isJoker(card))
				{
					tingtype=2;
					if(tingtype>maxTingType) {
						maxTingType=tingtype;
					}
				}
				else
				{
					tingtype=1;
					if(tingtype>maxTingType) {
						maxTingType=tingtype;
					}
				}
			}
			else if(tingcards.length>0)
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
				if(MahjongGeneral.isJoker(parseInt(key))&&(myself.checkTmpJinXianZhiNaTive(cardhuinfo.jocker_count,cardhuinfo.hutype,MahjongDef.event_zimo)&&myself.checkTmpJinXianZhiNaTive(cardhuinfo.jocker_count,cardhuinfo.hutype,MahjongDef.event_hu)))
				{
					tingcards.removeByValue(parseInt(key));
					continue;
				}
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
		// 三游双游提示
		for (let i = 0; i < handcard.length; i++) {
			let card=handcard[i];
			if(!this.tingtypedic[card] || this.tingtypedic[card].type < maxTingType) {
				this.tingtypedic[card]={};
				continue;
			}
			// 三游双游提示
			let keys=[];
			if(this.tingtypedic[card].type==1||this.tingtypedic[card].type==2) {					
				let tmphandcards=this.handcard.concat();
				tmphandcards.removeByValue(card)
				for(let cardidx = 0;cardidx<this.mahjongcards.all_majiang_types.length;++cardidx)
				{
					let cardvalue=this.mahjongcards.all_majiang_types[cardidx];
					let tmphandcardsCopy = tmphandcards.concat();
					if(parseInt(cardvalue)==this.logic.jin||parseInt(cardvalue)==this.logic.jin2) {
						cardvalue = 0;
					}
					tmphandcardsCopy.push(cardvalue);
					tmphandcardsCopy.sort();
					let huinfo=this.mahjongcards.IsHu(tmphandcardsCopy);
					tmphandcardsCopy=[];
					if(!huinfo)
					{
						continue;
					}
					if(!keys.contain(0)) {
						keys.push(0);
					}
					if(this.logic.isQuanZiDong) {
						if(!keys.contain(1)) {
							keys.push(1);
						}
					}
					// if(huinfo.hutype==MahjongDef.hutype_7pairs)
					// {
					// 	continue;
					// }
					// let hucards=huinfo.hucards;
					for(let index=0;index<huinfo.hucards.length;++index)
					{
						if(huinfo.hucards[index].type==0&&(huinfo.hucards[index].jincount==2))
						{
							if(!keys.contain(cardvalue)) {
								keys.push(cardvalue);
							}
						}
					}
				}
				tmphandcards=[];
			}
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
			//并且如果有金的限制情况下也是有问题
			if(myself.checkJinXianZhi(MahjongDef.event_zimo)&&myself.checkJinXianZhi(MahjongDef.event_hu))
			{
				if(this.tingtypedic[card].type==0)
				{ 
					let hucard131 = null;
					let temphandcard = handcard.concat();
					temphandcard.removeByValue(card);
					temphandcard.push(this.tingtypedic[card].cards[0]);
					temphandcard.sort();
					hucard131 = this.mahjongcards.Is131(temphandcard); 
					temphandcard = [];
					if(hucard131)
					{
						continue;//131没限制
					}
					this.tingtypedic[card]={};//受到金限制不能听牌
				}
			}
		}
		return this.tingtypedic;
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
			if(isXianJin)
			{
				if(MahjongGeneral.isJoker(card))
				{
					tingtype=2;
					if(tingtype>maxTingType) {
						maxTingType=tingtype;
					}
				}
				else
				{
					tingtype=1;
					if(tingtype>maxTingType) {
						maxTingType=tingtype;
					}
				}
			}
			else if(tingcards.length>0)
			{
				tingtype=0;
				if(tingtype>maxTingType) {
					maxTingType=tingtype;
				} 
			}
			let keys = [];
			for (let n= 0; n< tingcards.length;) {
				let key = tingcards[n];
				let jinCount=jinCounts[n];
				let huType=huTypes[n];
				// 获取牌面剩余牌数
				let cardTotalNum = MahjongGeneral.isJoker(parseInt(key))?3:4;
				 
				if(MahjongGeneral.isJoker(parseInt(key))&&(myself.checkTmpJinXianZhiNaTive(jinCount,huType,MahjongDef.event_zimo)&&myself.checkTmpJinXianZhiNaTive(jinCount,huType,MahjongDef.event_hu)))
				{
					tingcards.removeByValue(parseInt(key));
					continue;
				} 
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
			// 三游双游提示
			let keys=[];
			if(this.tingtypedic[card].type==1||this.tingtypedic[card].type==2) {					
				let tmphandcards=this.handcard.concat();
				tmphandcards.removeByValue(card)
				for(let cardidx = 0;cardidx<this.mahjongcards.all_majiang_types.length;++cardidx)
				{
					let cardvalue=this.mahjongcards.all_majiang_types[cardidx];
					let tmphandcardsCopy = tmphandcards.concat();
					if(parseInt(cardvalue)==this.logic.jin||parseInt(cardvalue)==this.logic.jin2) {
						cardvalue = 0;
					}
					tmphandcardsCopy.push(cardvalue);
					tmphandcardsCopy.sort();
					let huinfo=this.mahjongcards.IsHu(tmphandcardsCopy);
					tmphandcardsCopy=[];
					if(!huinfo)
					{
						continue;
					}
					if(!keys.contain(0)) {
						keys.push(0);
					}
					if(this.logic.isQuanZiDong) {
						if(!keys.contain(1)) {
							keys.push(1);
						}
					}
					// if(huinfo.hutype==MahjongDef.hutype_7pairs)
					// {
					// 	continue;
					// }
					// let hucards=huinfo.hucards;
					for(let index=0;index<huinfo.hucards.length;++index)
					{
						if(huinfo.hucards[index].type==0&&(huinfo.hucards[index].jincount==2))
						{
							if(!keys.contain(cardvalue)) {
								keys.push(cardvalue);
							}
						}
					}
				}
				tmphandcards=[];
			}
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
			//并且如果有金的限制情况下也是有问题
			if(myself.checkJinXianZhi(MahjongDef.event_zimo)&&myself.checkJinXianZhi(MahjongDef.event_hu))
			{
				if(this.tingtypedic[card].type==0)
				{ 
					let hucard131 = null;
					let temphandcard = handcard.concat();
					temphandcard.removeByValue(card);
					temphandcard.push(this.tingtypedic[card].cards[0]);
					temphandcard.sort();
					hucard131 = this.mahjongcards.Is131(temphandcard); 
					temphandcard = [];
					if(hucard131)
					{
						continue;//131没限制
					}
					this.tingtypedic[card]={};//受到金限制不能听牌
				}
			}
		}
		return this.tingtypedic;
	}
	getCardsCanBuGang(){
		// body 
		var cardsCanBuGang=[];
        for (let index = 0; index < this.handcard.length; index++) {
			let cardValue=this.handcard[index];  
            for (let i = 0; i < this.opcards.length; i++) {
                let opinfo=this.opcards[i] 
                if(opinfo.op==MahjongDef.op_peng&&opinfo.value==cardValue)
                {
					cardsCanBuGang.push(cardValue)
                }
            }
        } 
		return cardsCanBuGang;
	}
	getCardsCanAnGang()
	{	
		// body
		var cardsCanAnGang=[];
		var curcard=this.logic.curcard;
		var cardcountmap={};
		for (var i=0;i<this.handcard.length;++i)
		{
			var card=this.handcard[i];
			if(!cardcountmap[card]){
				cardcountmap[card]=1;
			}
			else 
			{
				cardcountmap[card]=cardcountmap[card]+1;
			} 
		}  
 
		for (var cardvalue in cardcountmap){
			var count=cardcountmap[cardvalue]; 
			if (count==4)
			{
				//console.log("LymjPlayer:getCardsCanAnGang",cardvalue)
				cardsCanAnGang.push(cardvalue)
			} 
		}  
		return cardsCanAnGang;
	}	
} 
