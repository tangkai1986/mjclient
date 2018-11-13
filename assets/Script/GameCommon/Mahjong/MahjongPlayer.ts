 
  
import { MahjongDef } from "./MahjongDef";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";
import { MahjongGeneral } from "./MahjongGeneral";

 
 
export default class MahjongPlayer
{
	deposit=false;//是否托管  
	tingarr=[]; 
	handcard=[]; 
	cardpool=[];
	huapais={};
	opcards=[];//操作的牌，如杠碰吃
	uid=null;
	seatid=null;
	logic=null;
	mahjongcards=null;
	events=[];//事件列表
	state=MahjongDef.state_idle;//玩家初始状态
	youjinstate=null;
	enableYouJin=null;
	b_finishYouJin=null;
	tingtypedic=null; 
	constructor()  
	{ 
		this.uid=null;//uid  
		this.seatid=null;  
	} 
	clearEvent()
	{
		this.events=[];
		this.state=MahjongDef.state_idle;//玩家初始状态
	}
 
	pushEvent(event)
	{
		//推入事件
		this.events.push(event);
		this.state=MahjongDef.state_idle;
		switch(event)
		{
			//如果是出牌事件，则将状态切至出牌
			case MahjongDef.event_chupai:
				this.state=MahjongDef.state_chupai;
			break;
			case MahjongDef.event_gaipai://盖牌状态
				this.state=MahjongDef.state_gaipai;
			break;
			//如果是其他事件则将状态切入事件
			default:
				this.state=MahjongDef.state_event;
			break;
		} 
	}
	//判断是否能双游
	readyForShuangYou(){
		let optioncars=this.mahjongcards.getOptionCardsFromJiang(this.handcard);
		for(let i = 0;i<optioncars.length;++i)
		{
			//有金就返回true
			if(optioncars[i]==0)
			{
				return true;
			}
		}
		return false;
	}
	//判断是否能单游
	readyForDanYou(){
		let optioncars=this.mahjongcards.getOptionCardsFromJiang(this.handcard);
		return optioncars.length>0;
	}
	setEvents(events)
	{
		this.events=[];
		for(var i = 0;i<events.length;++i)
		{
			this.pushEvent(events[i]);
		}
	}
	getHuaCount()
	{
		let huacount=0;
		for(let cardvalue in this.huapais){
			let count=this.huapais[cardvalue];
			huacount=huacount+count;
		} 
		return huacount;
	} 
	getJinCount()
	{ 
		let jincount=0;
		for (let i = 0;i<this.handcard.length;++i)
		{
			if (MahjongGeneral.isJoker(this.handcard[i]))
			{
				jincount=jincount+1;
			} 
		} 
		return jincount;
	} 
	getLeftHandCountByValue(value)
	{ 
		let count=0;
		for (let i = 0;i<this.handcard.length;++i)
		{
			if (this.handcard[i]==value)
			{
				count=count+1;
			}  
		} 
		return count;
	}
    getLeftOpCardsCountByValue(value)
	{ 
		let count=0;
		for (let i = 0; i < this.opcards.length; i++) {
			let opinfo=this.opcards[i]
			if(opinfo.op == MahjongDef.op_chi) {
				for (let j = 0; j < opinfo.value.length; ++j) {
					if(opinfo.value[j]==value)
					{
						count++;
					}
				}
			}
			else if(opinfo.op == MahjongDef.op_peng) {
				if(opinfo.value==value) {
					count+=3;
				}
			}
			else if(opinfo.op == MahjongDef.op_gang) {
				if(opinfo.value==value) {
					count+=4;
				}
			}
			else if(opinfo.op == MahjongDef.op_angang) {
				if(opinfo.value==value) {
					count+=4;
				}
			}
		}
		return count;
	}
    getLeftcardpoolCountByValue(value)
	{ 
		let count=0;
		for (let i = 0; i < this.cardpool.length; i++) {
			if(this.cardpool[i]==value)
			{
				count++;
			}
		}
		return count;
	}
	//检测金的限制
	checkJinXianZhi(event){
		let jincount=this.getJinCount();
		if(jincount<=0)
		{
			return false;
		}

        let jinxianzhi=this.logic.prop.get_b_jinxianzhi();
        switch(event)
        {
            case MahjongDef.event_hu:
                switch(jinxianzhi)
                { 
                    case 0://单金不平胡，双金不平胡
                    break;
                    case 1://双金不平胡
                        if(jincount<2){
                            return false;
                        } 
                    break; 
                }
            break; 
            default:
            return false;
        }
        return true; 
	}
	resetData()
	{ 
		// body 
		this.deposit=false;//是否托管  
		this.tingarr=[]; 
		this.handcard=[]; 
		this.cardpool=[];
		this.huapais={};
		this.opcards=[];//操作的牌，如杠碰吃
		this.events=[];//事件列表
		this.state=MahjongDef.state_idle;//玩家初始状态
		this.youjinstate=MahjongDef.youjinstate_null;
	} 
	replaceJin(needSort=true)
	{
		let hasReplacedJin=false;
		for (var i = 0;i<this.handcard.length;++i)
		{
			if(this.handcard[i]==this.logic.jin)
			{
				hasReplacedJin=true
				this.handcard[i]=MahjongGeneral.emMJ.emMJ_Joker;
			}
			else if(this.handcard[i]==this.logic.jin2)
			{
				hasReplacedJin=true
				this.handcard[i]=MahjongGeneral.emMJ.emMJ_Joker2;
			}
		} 
		if(needSort||hasReplacedJin)//只要有换金,这说明恢复节点在开金的时刻,需要重新排序
		{
			this.sortCard()
		}
	} 
	updateHandCard(handcard)
	{
 		this.handcard=handcard;
	} 
	getCard(index)
	{ 
		return this.handcard[index];
	} 
	pushCard(card)
	{
		// body
		if(!card){
			this.handcard.push(0)
		} 
		else{
			this.handcard.push(card)
		}  
	}  
	putInPool(card)
	{
		this.cardpool.push(card)
	} 
	removeCardFromPool()
	{
		this.cardpool.remove(this.cardpool.length-1);
	} 

	getChiCards(index)
	{ 
		// body  
		let curcard=this.logic.curcard; 
		let arr = MahjongDef.chiarr[index];
		let card1=curcard+arr[0];
		let card2=curcard+arr[1]; 
		let cards=[card1,card2] 
		return cards;
	} 
	removeCardByCount(card,count)
	{
		// body 
		for (let i = 0;i<count;++i)
		{ 
			this.removeCard(card);
		} 
	} 
	pushChi(index,cards) 
	{
		let chicards=cards;
	    chicards.insert(index,this.logic.curcard);
		let opinfo={
			'index':index,//表示吃的是哪个洞
			'op':MahjongDef.op_chi,
			'value':chicards,
		}
		this.opcards.push(opinfo); 
	} 
    //获得吃碰杠的第一张牌
    getOpCardByIndex(index)
    {
        let opinfo=this.opcards[index];
        let op=opinfo.op;
        let value=null;
        switch(op)
        {
            case MahjongDef.op_chi:
                value=opinfo.value[0];
            break;
            default:
                value=opinfo.value;
            break;
        }
        return value;
    }	
	//插入碰
	pushPeng(card)
	{
		// body
		let opinfo={
			'op':MahjongDef.op_peng,
			'value':card,
		}
		this.opcards.push(opinfo); 
	}  
    //恢复补杠为碰
    recoverPeng(card)
	{ 
		for (let i = 0; i < this.opcards.length; i++) {
			let opinfo=this.opcards[i]
			if(opinfo.op==MahjongDef.op_bugang&&opinfo.value==card)
			{
				opinfo.op=MahjongDef.op_peng;
			}
		}
	} 

	//插入补杠 
	pushBuGang(card)
	{ 
		for (let i = 0; i < this.opcards.length; i++) {
			let opinfo=this.opcards[i]
			if(opinfo.op==MahjongDef.op_peng&&opinfo.value==card)
			{
				opinfo.op=MahjongDef.op_bugang;
			}
		}
	} 
	//加入杠
	pushGang(card)
	{
		// body 
		var opinfo={
			'op':MahjongDef.op_gang,
			'value':card,
		}
		this.opcards.push(opinfo);
	}  
	//加入暗杠
	pushAnGang(card)
	{
		// body 
		var opinfo={
			'op':MahjongDef.op_angang,
			'value':card,
		}
		this.opcards.push(opinfo); 
	} 
	removeCards(cards)
	{
		// body
		for(var i =0;i<cards.length;++i){ 
			this.removeCard(cards[i]);
		}
	} 
	removeCard(card)
	{ 
		// 移除手上的牌
		if(this.logic.bViewMode||this.seatid==RoomMgr.getInstance().getMySeatId())
		{
			for (var i =0;i<this.handcard.length;++i)
			{
				var value=this.handcard[i];
				if (value==card)
				{ 
					////console.log("移除了牌")
					this.handcard.remove(i);
					break;
				}  
			} 
		}
		else
		{ 
			this.handcard.remove(0);
		} 
	} 
	hasEvent=function(target)
	{
		for (var i = 0; i < this.events.length; i++) {
			var event=this.events[i];
			//如果事件相等，就判断座位距离
			if(event==target)
			{
			   return true
			} 
		}
		return false;
	} 
	init(seatid,logic)
	{ 
		this.seatid=seatid
		this.logic=logic; 
		this.mahjongcards=logic.mahjongcards;
	} 
	initHandCard(handcard)
	{
		this.handcard=handcard 
	}
	fillOthersCard(len)
	{
		this.handcard=[];
		for(var i = 0;i<len;++i)
		{
			this.handcard.push(0)
		}  
	} 

	buHua(huapaiarr,paiarr)  
	{
        // copy 一份补花前的手牌 
		for (var i=0;i<huapaiarr.length;++i)
		{ 
			this.putInHua(huapaiarr[i]);
		}
		if(!RoomMgr.getInstance().getVideoMode())
		{
			//非录像回放模式下需要确保是自己的位置才实际补花
			if (this.seatid !=RoomMgr.getInstance().myseatid){ 
				return;
			}
		} 
		let huaindex=0;
		for(let i=0;i<this.handcard.length;++i)
		{
			let huaPai=huapaiarr[huaindex]
			let cardValue=this.handcard[i]
			if(cardValue==huaPai)
			{
				this.handcard[i]=paiarr[huaindex];
				huaindex++;
			}
		} 
	}
	//整理白板
	tidyBaiBan(cards)
	{
		//龙岩麻将有白板,所以要特殊整理
	}
	sortCard()
	{
		this.handcard.sort(function(a,b){
			return a-b;
		})
	}
	putInHua(hua)
	{ 
		// body 
		if(!this.huapais[hua])
		{
			this.huapais[hua]=1;
		} 
		else
		{ 
			this.huapais[hua]=this.huapais[hua]+1;
		} 
	}
	findCard(value)
	{
		for (var i = 0;i<this.handcard.length;++i)
		{
			if(value==this.handcard[i])
			{
				return true;
			} 
		}  
		return false; 
	} 
	getCardsCandChi()
	{
		// body
		var cardsCanChi=[];
		var curcard=this.logic.curcard;
		for(let index=0;index <MahjongDef.chiarr.length;++index)
		{
			var arr=MahjongDef.chiarr[index];
			var card1=curcard+arr[0];
			var card2=curcard+arr[1]; 
			if	(this.findCard(card1) && this.findCard(card2))
			{ 
				var cards=[card1,card2]
				cards.insert(index,curcard);
				var chiinfo={
					'index':index,
					'cards':cards,
				}
				cardsCanChi.push(chiinfo); 
			}
		}
		return cardsCanChi;
	} 
    //判断是否是双游
    isShuangYou(){
        return this.youjinstate==MahjongDef.youjinstate_shuangyou;
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

		let onlyMoPaiAnGang=false;//如果是摸到牌的暗杠
		if(this.logic.isMingYou)
		{
			if(this.logic.isDanYou()||this.logic.isShuangYou())
			{
				onlyMoPaiAnGang=true;
			}
		}
		else{
			if(this.logic.isShuangYou())
			{
				onlyMoPaiAnGang=true;
			}
		}

		for (var cardvalue in cardcountmap){
			var count=cardcountmap[cardvalue];
			if(onlyMoPaiAnGang)
			{
				if(cardvalue!=curcard)
					continue;
			} 
			if (count==4)
			{
				////console.log("QzmjPlayer:getCardsCanAnGang",cardvalue)
				cardsCanAnGang.push(cardvalue)
			} 
		}  
		return cardsCanAnGang;
	}
	getCardsCanBuGang(){
		// body
		let onlyMoPaiBuGang=false;//如果是摸到牌的暗杠
		var curcard=this.logic.curcard;
		if(this.logic.isMingYou)
		{
			if(this.logic.isDanYou()||this.logic.isShuangYou())
			{
				onlyMoPaiBuGang=true;
			}
		}
		else{
			if(this.logic.isShuangYou())
			{
				onlyMoPaiBuGang=true;
			}
		}
		

		var cardsCanBuGang=[];
        for (let index = 0; index < this.handcard.length; index++) {
			let cardValue=this.handcard[index]; 
			if(onlyMoPaiBuGang)
			{
				if(cardValue!=curcard)
					continue;
			} 
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
	getHandcardsGangCount()
	{
		// body
		let gangCount = 0;
		let curcard=this.logic.curcard;
		let cardcountmap={};
		for (let i=0;i<this.handcard.length;++i)
		{
			let card=this.handcard[i];
			if(!cardcountmap[card]){
				cardcountmap[card]=1;
			}
			else 
			{
				cardcountmap[card]=cardcountmap[card]+1;
			} 
		}  
		for (let cardvalue in cardcountmap){
			let count=cardcountmap[cardvalue]; 
			if (count==4)
			{
				gangCount++;
			} 
		}  
		return gangCount;
	}
	switchCard(src,dest)
	{
		////console.log("换牌前=",this.handcard)
		for (var i = 0; i < this.handcard.length; i++) {
			let cardValue=this.handcard[i];
			if(cardValue==src)
			{
				this.handcard[i]=dest;
				////console.log("换牌后=",this.handcard)
				this.sortCard();
				return;
			}
		}
	}
	checkXianJin(handcard)
	{
		return this.mahjongcards.checkXianJin(handcard);
	}
	getTingArr(tmpPai)
	{
		return this.mahjongcards.getTingArr(tmpPai);
	}
	//检查金限制
    checkTmpJinXianZhi(cards,event){
        let jincount=0;
        for (let i = 0;i<cards.length;++i)
        {
            if (MahjongGeneral.isJoker(cards[i]))
            {
                jincount=jincount+1;
            } 
        }
        if(jincount<=0)
        {
            return false;
        }
        switch(event)
        {
            case MahjongDef.event_zimo:
            case MahjongDef.event_hu:
            case MahjongDef.event_qianggang_hu:
                let huinfo = this.mahjongcards.IsHu(cards)   
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
                    case 1://单金可平胡，双金至少自摸
                        if(jincount<2){
                            return false;
                        } 
                    break;
                    case 2://单金至少自摸,双金至少游金  
						if(jincount<1)
						{
							return false;
						} 
                    break;
                    case 3://单金至少游金 
                    break;
                    case 4://双金至少游金  
                        if(jincount<2)
                        {
                            return false;
                        } 
                    break;
                    case 5://金牌不限制自摸  
                        return false;
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
                    case 1://单金可平胡，双金至少自摸
                        return false;
                    break;
                    case 2://单金至少自摸,双金至少游金
                        if(jincount<2)
                        {
                            return false;
                        } 
                    break;
                    case 3://单金至少游金  
                    break;
                    case 4://双金至少游金  
                        if(jincount<2)
                        {
                            return false;
                        } 
                    break;
                    case 5://金牌不限制自摸  
                        return false;
                    break;
                }
            break;
            default:
            return false;
        }
        return true;
	} 
	//检查金限制的native版本,等于已经算好牌型
    checkTmpJinXianZhiNaTive(jincount,hutype,event){
        
        if(jincount<=0)
        {
            return false;
        }
        switch(event)
        {
            case MahjongDef.event_zimo:
            case MahjongDef.event_hu:
            case MahjongDef.event_qianggang_hu: 
                if(hutype==MahjongDef.hutype_131)
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
                    case 1://单金可平胡，双金至少自摸
                        if(jincount<2){
                            return false;
                        } 
                    break;
                    case 2://单金至少自摸,双金至少游金  
						if(jincount<1)
						{
							return false;
						} 
                    break;
                    case 3://单金至少游金 
                    break;
                    case 4://双金至少游金  
                        if(jincount<2)
                        {
                            return false;
                        } 
                    break;
                    case 5://金牌不限制自摸  
                        return false;
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
                    case 1://单金可平胡，双金至少自摸
                        return false;
                    break;
                    case 2://单金至少自摸,双金至少游金
                        if(jincount<2)
                        {
                            return false;
                        } 
                    break;
                    case 3://单金至少游金  
                    break;
                    case 4://双金至少游金  
                        if(jincount<2)
                        {
                            return false;
                        } 
                    break;
                    case 5://金牌不限制自摸  
                        return false;
                    break;
                }
            break;
            default:
            return false;
        }
        return true;
	}     
	jsbGetTingDic(handcard)
	{
		let cards=handcard.concat();
		cards.sort((a,b)=>{
			return a-b;
		})
		console.log("进入启动界面，去掉用C++");
		//游戏类型，手牌， 
		let yise=this.getyise()||0;
		let bJinLong=false;
		if(this.logic.prop.get_b_jinlong)
		{
			bJinLong=this.logic.prop.get_b_jinlong();
		} 
        let result=jsbMahjong.getTingDic(this.logic.gameid ,cards,this.logic.jin||0,this.logic.jin2||0,yise,bJinLong);
		let tingDic={};
		let index=0;
		//解析这个听tingDic;
		while(index<result.length){
			let cardValue=result[index++]; 
			let bXianJin=result[index++]; 
			let cardsCount=result[index++]; 
			let info=[];
			for(let i = 0;i<cardsCount;++i){ 
				let v=result[index++];
				let huType=v&0xFF;
				let jinCount=(v>>8)&0xFF;
				let cardValue=(v>>16)&0xFF;
				info.push({jinCount:jinCount,huType:huType,cardValue:cardValue});
			}
			tingDic[cardValue]={bXianJin:bXianJin,info:info};
		}
		console.log("getTingDicNative=",JSON.stringify(tingDic) ); 
		return tingDic;
	}
	//底层听牌计算
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
		}
		return this.tingtypedic;
	}
	getTingDic(handcard,players,mySeatId)
	{
		// if(cc.sys.isNative)
		// {
		// 	//因为oc那边js调用C++有问题.所以先只考虑android和pc
		// 	if (cc.sys.os != cc.sys.OS_IOS) {
		// 		//调用底层计算
		// 		return this.getTingDicNative(handcard,players,mySeatId);
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
		}
		return this.tingtypedic;
	}
	outcardLimited(standcard)
	{
		let tingdata=this.tingtypedic[standcard]
		if(tingdata){
			let tingtype = tingdata.type;
			if ((tingtype<2||tingtype==undefined) && standcard == 0) {
				return true;
			}
		}
		return false;
	}
	setYouJinState(youjinstate)
	{
		this.youjinstate=youjinstate;
	}

	getyise()
	{
		return -1;
	}
	getHuType()
	{
		let hutype=null;
		let pai=this.handcard.concat();
		pai.sort();
		let huinfo=this.mahjongcards.IsHu(pai)
		if(!huinfo)
		{
			return null;
		}
		return huinfo.hutype;
	}
	//取消游金状态
	cancelYouJinState(){ 
		this.youjinstate=MahjongDef.youjinstate_null;
	}
} 
