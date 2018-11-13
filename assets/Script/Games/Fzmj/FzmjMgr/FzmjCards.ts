import { MahjongGeneral } from "../../../GameCommon/Mahjong/MahjongGeneral";
import MahjongCards from "../../../GameCommon/Mahjong/MahjongCards";
import { MahjongDef } from "../../../GameCommon/Mahjong/MahjongDef"; 
export default class FzmjCards extends MahjongCards{
    constructor(cardcount){ 
		super(cardcount);
        //福州麻将没有字
		while(1)
		{
			let bFind=false;
			for(let index=0;index<this.ting_majiang_types.length;++index)
			{
				let cardvalue=this.ting_majiang_types[index];
				if(MahjongGeneral.Majiang_Type(cardvalue)==MahjongGeneral.MajiangType.emMJType_Zi)
				{
					this.ting_majiang_types.remove(index)
					bFind=true;
					break;
				}
			} 
			if(!bFind)
			{
				break;
			}
		}		
    } 
  
	isHua(cardvalue)
	{
		let cate=MahjongGeneral.Majiang_Type(cardvalue)
		return cate==MahjongGeneral.MajiangType.emMJType_Hua||cate==MahjongGeneral.MajiangType.emMJType_Zi;
	}    
    //是否是清一色
	IsQingYise(original_pai,yise)  
	{   
		if(original_pai.length%3!=2)
		{
			//表示相公牌
			return null;
		}
		if(yise!=null)//门前清
		{
			if(yise==-1)//吃碰杠不是一色
			{
				return null;
			}
		}
		let tmpcards=original_pai.concat();
		for(let i = 0;i<tmpcards.length;++i)
		{
			let card=tmpcards[i];
			if(MahjongGeneral.isJoker(card))
			{
				tmpcards[i]=this.jin;//将金替换成原始的牌
			}
		}
		//如果原来没有一色的值就用第一个牌的花色
		if(yise==null)
		{
			yise=MahjongGeneral.Majiang_Type(tmpcards[0]);
		}
		for(let i=0;i<tmpcards.length;++i)
		{
			let card=tmpcards[i];
			if(MahjongGeneral.Majiang_Type(card)!=yise)
			{
				return null;
			}
		} 
		tmpcards.sort();
		return this.IsCommonHu(tmpcards);
	}  
    //是否是对对胡
	IsHunYise(original_pai,yise) 
	{   
		if(original_pai.length%3!=2)
		{
			//表示相公牌
			return null;
		}   
		if(yise!=null)//不是门前清
		{
			if(yise==-1)//吃碰杠不是一色
			{
				return null;
			}
		}
		let tmpcards=original_pai.concat();
		let offset=0;
		for(let i = 0;i<tmpcards.length;++i)
		{
			let card=tmpcards[i];
			if(MahjongGeneral.isJoker(card))
			{
				offset++;
			}
		}
		//如果原来没有一色的值就用第一个牌的花色
		if(yise==null)
		{
			yise=MahjongGeneral.Majiang_Type(tmpcards[offset]);
		}
		for(let i=offset;i<tmpcards.length;++i)
		{
			let card=tmpcards[i];
			if(MahjongGeneral.Majiang_Type(card)!=yise)
			{
				return null;
			}
		} 
		return this.IsCommonHu(tmpcards);;
	}
	//判断胡牌,参数2表示一色
	IsHu(cards,yise,b_jinlong=false)
	{
		//客户端不检测听清一色 
		//yise=-1;
        let hucards = this.IsQingYise(cards,yise)//判断是否是清一色
        if(hucards)
        {
            return {hutype:MahjongDef.hutype_qingyise,hucards:hucards};
        } 
        hucards = this.IsHunYise(cards,yise)//判断是否是混一色
        if(hucards)
        {
            return {hutype:MahjongDef.hutype_hunyise,hucards:hucards};
        }   
        //判断金个数
        let nonJokerCards=[];
        let jokerCount=0;
        for(let index=0;index<cards.length;++index)
        {
        	if(MahjongGeneral.isJoker(cards[index]))
        	{
        		jokerCount++;
        	}
        	else
        	{
        		nonJokerCards.push(cards[index]);
        	}
        }
        if(jokerCount>=3&&b_jinlong)
        { 
			//如果能胡牌就是金龙
	        hucards=this.IsCommonHu(nonJokerCards); 
	        if(hucards)
	        { 
	            return {hutype:MahjongDef.hutype_jinlong,hucards:hucards};
	        }     
		}
		if(jokerCount>=2)
		{
	        hucards=this.IsCommonHu(cards); 
	        if(hucards) {
				for(let index=0;index<hucards.length;++index)
				{
					let item=hucards[index];
					if(item.type==0&&item.jincount==2)
					{
						return {hutype:MahjongDef.hutype_jinque,hucards:hucards};
					} 
				}
	        }
		}
        hucards=this.IsCommonHu(cards);
        if(hucards)
        {
            return {hutype:MahjongDef.hutype_normal,hucards:hucards};
        }         
        return null;
    }     
}