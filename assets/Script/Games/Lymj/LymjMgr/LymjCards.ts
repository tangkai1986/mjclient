import { MahjongGeneral } from "../../../GameCommon/Mahjong/MahjongGeneral";
import MahjongCards from "../../../GameCommon/Mahjong/MahjongCards";
import { MahjongDef } from "../../../GameCommon/Mahjong/MahjongDef";
 
export default class LymjCards extends MahjongCards{
    private pattern131=null; 
    constructor(cardcount){
        super(cardcount); 
		//十三幺牌型：13张再加其中任意一张  
		this.pattern131 = [ MahjongGeneral.emMJ.emMJ_1Wan,MahjongGeneral.emMJ.emMJ_9Wan,MahjongGeneral.emMJ.emMJ_1Tiao,
		MahjongGeneral.emMJ.emMJ_9Tiao,MahjongGeneral.emMJ.emMJ_1Tong,MahjongGeneral.emMJ.emMJ_9Tong,  
		MahjongGeneral.emMJ.emMJ_DongFeng,MahjongGeneral.emMJ.emMJ_NanFeng,MahjongGeneral.emMJ.emMJ_XiFeng,MahjongGeneral.emMJ.emMJ_BeiFeng,
		MahjongGeneral.emMJ.emMJ_HongZhong,MahjongGeneral.emMJ.emMJ_FaCai,MahjongGeneral.emMJ.emMJ_BaiBan ]; 
		
	 
    }
	//白板能否替换一个子或自己
	isBaiBanReplace(cardvalue){ 
		return this.jin==cardvalue || this.jin2==cardvalue || MahjongGeneral.emMJ.emMJ_BaiBan==cardvalue;
	}  
  
 
    //普通胡牌
	IsCommonHu( original_pai) 
	{
		//判断金的个数
		let joker_end = original_pai.begin();  
		while (joker_end != original_pai.end() && MahjongGeneral.isJoker(original_pai[joker_end]))  
		{  
			++joker_end;  
		}  
		let joker_count = joker_end - original_pai.begin();  
		let jiangtypelist=null;
		//遍历顺序1.双金做将2单金做将3.0金做将 
		if(joker_count>=2)
		{
			jiangtypelist=[2,1,0];
		}  
		else if(joker_count==1)
		{
			jiangtypelist=[1,0];
		}
		else 
		{
			jiangtypelist=[0];
		}
		let len=jiangtypelist.length  
		//白板个数
		let baiban_start=-1;
		let baiban_end=-1;
		let tmpbaiban_start=-1; 
		for(let bindex=0;bindex<original_pai.length;++bindex)
		{
			if(MahjongGeneral.isBaiBan(original_pai[bindex])){
				if(baiban_start<0)
				{
					baiban_start=bindex;
					tmpbaiban_start=baiban_start;
				}
				baiban_end=++tmpbaiban_start;
			}
		}
		let baiban_count=baiban_end-baiban_start;
		let finalHuCards=null;
		if(baiban_count>0)
		{
			//移除白板后的牌
			//将白板全部移除
			//恶心的白板替金,性能会有损耗
			if(this.jin2!=null)//双金模式,白板最多可替2的n次方
			{
				let replaceArr=this.fillGroupTypes[baiban_count];
				//遍历替金方案
				for(let r=0;r<replaceArr.length;++r)
				{
					let arr=replaceArr[r]; 
					let noBaiBanCards=original_pai.concat();
					noBaiBanCards.erase(baiban_start,baiban_end);
					for(let f=0;f<arr.length;++f)
					{
						let value=arr[f]; 
						noBaiBanCards.push((value==1)?this.jin2:this.jin) 
					} 
					//在这里判断白板数量 
					noBaiBanCards.sort(function(a,b){
						return a-b;
					})
					for(let i = 0;i<len;++i)
					{
						let jinjiangtype=jiangtypelist[i]
						let hucards=this.getHuCards(noBaiBanCards,jinjiangtype)
						if(hucards)
						{
							finalHuCards = hucards;//有胡牌就跳出
							break;
						}
					}
					if(finalHuCards)//有胡牌就跳出
					{
						break;
					}
				}
			}
			else//单金模式,白板全替即可
			{
				let noBaiBanCards=original_pai.concat();
				noBaiBanCards.erase(baiban_start,baiban_end);
				for(let i=0;i<baiban_count;++i)
				{
					noBaiBanCards.push(this.jin);
				}
				//在这里判断白板数量 
				noBaiBanCards.sort(function(a,b){
					return a-b;
				})
				for(let i = 0;i<len;++i)
				{
					let jinjiangtype=jiangtypelist[i]
					let hucards=this.getHuCards(noBaiBanCards,jinjiangtype)
					if(hucards)
					{
						finalHuCards = hucards;//有胡牌就跳出
						break;
					}
				}
			}
		}
		else
		{
			for(let i = 0;i<len;++i)
			{
				let jinjiangtype=jiangtypelist[i]
				//在这里判断白板数量
				let hucards=this.getHuCards(original_pai,jinjiangtype)
				if(hucards)
				{
					finalHuCards = hucards;//有胡牌就跳出
					break;
				}
			}
		}
		//这边后面考虑要不要把白板填回去
		return finalHuCards;
	}  
  
 
    //是否是131
	Is131(original_pai)  
	{  
		if(original_pai.length%3!=2)
		{
			//表示相公牌
			return null;
		}
		if(original_pai.size()!=this.pattern131.size()+1)
		{
			return null;
		}
		let pai=original_pai.concat();//拷贝一份出来
    	let joker_end = pai.begin();  
		while (joker_end != pai.end() && MahjongGeneral.isJoker(pai[joker_end]))  
		{  
			++joker_end;  
		}  
		let joker_count = joker_end - pai.begin();   
		//白板个数
		let baiban_start=-1;
		let baiban_end=-1;
		let tmpbaiban_start=-1; 
		for(let bindex=0;bindex<pai.length;++bindex)
		{
			if(MahjongGeneral.isBaiBan(pai[bindex])){
				if(baiban_start<0)
				{
					baiban_start=bindex;
					tmpbaiban_start=baiban_start;
				}
				baiban_end=++tmpbaiban_start;
			}
		}
		let baiban_count=baiban_end-baiban_start;
		//去掉金 
    	if (joker_count > 0)  
		{   
			//移除金给后面用
			pai.erase(pai.begin(), joker_end); 
		} 
		//去掉白板
		if(baiban_count>0)
		{
			pai.erase(baiban_start-joker_count, baiban_end-joker_count); 
		}
		//再提出不属于十三幺的牌型或重复部分 
        let specialcardarr=[];
        for(let i=1;i<pai.length;++i)//最简单粗暴的
        {
        	//重复的牌型
        	if(pai[i-1]==pai[i])
        	{
        		specialcardarr.push(i);
        	}
        	else
        	{ 
        		//不在十三幺牌型里并且不在之前的队列里
        		if(!specialcardarr.contain(i-1)&&!this.pattern131.contain(pai[i-1]))
        		{
        			specialcardarr.push(i-1);
        		}
        		if(!specialcardarr.contain(i)&&!this.pattern131.contain(pai[i]))
        		{
        			specialcardarr.push(i);
        		}
        	}
        }
        //多于一个则说明不可能组成131
        let specialcardvalue=null;
        if(specialcardarr.length>1)
        {
			pai=null;
        	return null;
        }
        else if(specialcardarr.length>0)
        {
        	let index=specialcardarr[0];
        	specialcardvalue=pai[index];
			pai.erase(index); 
        }
		let cards131=[];
		let paiindex=0;
		let patternindex=0;
		//开始逐个遍历

		while(patternindex<this.pattern131.size())
		{
			let paivalue=null;
			let patternvalue=this.pattern131[patternindex]
			if(paiindex>=pai.size()){
				//如果牌的索引超出了牌的大小,则表示剩下的全部要用金或白板来填
				if(baiban_count>=1&&this.isBaiBanReplace(patternvalue))
				{
					//两个白板来凑
					--baiban_count;
					++patternindex;
					cards131.push({type:0,baibancount:1,cards:[patternvalue]}); 
					continue;
				}
				else if(joker_count>=1)
				{
					//一个金来凑
					--joker_count;
					++patternindex;
					cards131.push({type:0,jincount:1,cards:[patternvalue]});
					continue;
				}
				pai=null;
				return null;
			}
			else 
			{
				paivalue=pai[paiindex]
				//如果牌的值和131数组的牌相同则继续
				if(paivalue==patternvalue)
				{
					++paiindex;
					++patternindex;
					cards131.push({type:0,cards:[patternvalue]});
					continue;//继续
				}
				//如果不等就先拿白板来凑
				if(baiban_count>0&&this.isBaiBanReplace(patternvalue))
				{ 
					--baiban_count;
					++patternindex;
					cards131.push({type:0,baibancount:1,cards:[patternvalue]});
					continue; 
				}
				else if(joker_count>0)
				{
					--joker_count;
					++patternindex;
					cards131.push({type:0,jincount:1,cards:[patternvalue]});
					continue;
				} 
				pai=null;
				return null;
			}
		}	 
		if(specialcardvalue!=null)
		{
			//如果多出来的牌是序数牌
			let precards=[];//前面的几张牌
			for(let i =0;i<cards131.length;++i)
			{
				let item=cards131[i];
				if(item.cards)
				{
					precards.push(item.cards[0]);
				}
			}
			//如果这多出的一张牌是前面的任何一张,都行
			if(precards.contain(specialcardvalue))
			{
				cards131.push({type:1,cards:[specialcardvalue]});
				pai=null;
				return cards131;
			}
		}
		else
		{
			if(baiban_count>=1)
			{
				cards131.push({type:1,baibancount:1});
				pai=null;
				return cards131;
			}
			if(joker_count>=1)
			{
				cards131.push({type:1,jincount:1});
				pai=null;
				return cards131;
			}
		} 
		pai=null;
		return null;
	}  
    //是否是对对胡
	Is7pairs(original_pai)  
	{
	
		if(original_pai.length%3!=2)
		{
			//表示相公牌
			return null;
		}     
		if(original_pai.size()!=14)
		{
			return null;
		}
		let pai=original_pai.concat();//拷贝一份出来
    	let joker_end = pai.begin();  
		while (joker_end != pai.end() && MahjongGeneral.isJoker(pai[joker_end]))  
		{  
			++joker_end;  
		}  
		//金个数
		let joker_count = joker_end - pai.begin();    
		 
		//去掉金 
    	if (joker_count > 0)  
		{   
			//移除金给后面用
			pai.erase(pai.begin(), joker_end); 
		} 
	    //对对胡白板不用提出来
	    let cards7pairs=[];
	    let paiindex=0;
		let singlelist=[]; 
	    while(pai.size()>0)
	    { 
			if(pai.size()<=1)
			{ 
				singlelist.push(pai[0])
				pai.remove(0); 
			}
			for(let i = 1;i<pai.size();i++)
			{
				if(pai[0]==pai[i]){ 
					cards7pairs.push({type:0,cards:[pai[0]]})
					pai.remove(0);
					pai.remove(0); 
					break;
				}
				else
				{
					singlelist.push(pai[0])
					pai.remove(0); 
					break;
				}
			} 
	    }
		if(singlelist.length>joker_count){
			pai=null;
			return null;
		} 
		for(let i = 0;i<singlelist.length;++i)
		{
			let card=singlelist[i];
			joker_count--;
			cards7pairs.push({type:0,jincount:1,cards:[card]})
		} 
	    while(joker_count>=2)
	    {
	    	cards7pairs.push({type:0,jincount:2})
	    	joker_count-=2;
	    }
		pai=null;
	    return cards7pairs;
	}
    IsHu(cards){ 
        let hucards = this.Is131(cards)//判断是否是十三幺 
        if(hucards)
        {
            return {hutype:MahjongDef.hutype_131,hucards:hucards};
        } 
        hucards = this.Is7pairs(cards)//判断是否是十三幺 
        if(hucards)
        {
            return {hutype:MahjongDef.hutype_7pairs,hucards:hucards};
        }   
        hucards=this.IsCommonHu(cards);
        if(hucards)
        {
            return {hutype:MahjongDef.hutype_normal,hucards:hucards};
        }         
        return null;
    }      
      
      
}