import { MahjongGeneral } from "./MahjongGeneral";
import { MahjongDef } from "./MahjongDef";


//后续要用到的填充或替换方式的最多组合
let maxCount=5;//白板最多4个,坎最多5个
let fillGroupTypes={};
for(let i =0;i<maxCount;++i)
{
	let num=i+1;
	let len=Math.pow(2,num);
	let arr=[];
	for(let j=0;j<len;++j)
	{
		//2进制字符串
		let str=j.toString(2);
		//缺失的长度
		let leftLen=num-str.length;
		let bstr="";
		for(let m=0;m<leftLen;++m)
		{
			bstr+="0";
		}
		bstr+=str;
		let subArr=[];
		for(let k = 0;k<bstr.length;++k)
		{
			subArr.push(parseInt(bstr[k]));
		}
		arr.push(subArr);
	}
	fillGroupTypes[num]=arr;
}  
export default class MahjongCards{ 
	cardcount=null;
    jin=null;
    jin2=null;
    bazhanghua=null;
    all_majiang_types=null;
	ting_majiang_types=null; 
	fillGroupTypes=fillGroupTypes;		
	constructor(cardcount){ 
		this.cardcount=cardcount;
		this.bazhanghua=[MahjongGeneral.emMJ.emMJ_Mei,MahjongGeneral.emMJ.emMJ_Lan,MahjongGeneral.emMJ.emMJ_Ju,MahjongGeneral.emMJ.emMJ_Zhu
            ,MahjongGeneral.emMJ.emMJ_Chun,MahjongGeneral.emMJ.emMJ_Xia,MahjongGeneral.emMJ.emMJ_Qiu,MahjongGeneral.emMJ.emMJ_Dong]; 
    	this.all_majiang_types=[ 
			MahjongGeneral.emMJ.emMJ_1Wan, 
			MahjongGeneral.emMJ.emMJ_2Wan, 
			MahjongGeneral.emMJ.emMJ_3Wan, 
			MahjongGeneral.emMJ.emMJ_4Wan,  
			MahjongGeneral.emMJ.emMJ_5Wan,
			MahjongGeneral.emMJ.emMJ_6Wan, 
			MahjongGeneral.emMJ.emMJ_7Wan,
			MahjongGeneral.emMJ.emMJ_8Wan,
			MahjongGeneral.emMJ.emMJ_9Wan,

			MahjongGeneral.emMJ.emMJ_1Tiao,
			MahjongGeneral.emMJ.emMJ_2Tiao, 
			MahjongGeneral.emMJ.emMJ_3Tiao,
			MahjongGeneral.emMJ.emMJ_4Tiao, 
			MahjongGeneral.emMJ.emMJ_5Tiao,
			MahjongGeneral.emMJ.emMJ_6Tiao, 
			MahjongGeneral.emMJ.emMJ_7Tiao, 
			MahjongGeneral.emMJ.emMJ_8Tiao,  
			MahjongGeneral.emMJ.emMJ_9Tiao, 

			MahjongGeneral.emMJ.emMJ_1Tong,
			MahjongGeneral.emMJ.emMJ_2Tong, 
			MahjongGeneral.emMJ.emMJ_3Tong,
			MahjongGeneral.emMJ.emMJ_4Tong,
			MahjongGeneral.emMJ.emMJ_5Tong,
			MahjongGeneral.emMJ.emMJ_6Tong,
			MahjongGeneral.emMJ.emMJ_7Tong,
			MahjongGeneral.emMJ.emMJ_8Tong,
			MahjongGeneral.emMJ.emMJ_9Tong,

			MahjongGeneral.emMJ.emMJ_Mei,
			MahjongGeneral.emMJ.emMJ_Lan,
			MahjongGeneral.emMJ.emMJ_Ju,
			MahjongGeneral.emMJ.emMJ_Zhu,
			MahjongGeneral.emMJ.emMJ_Chun,
			MahjongGeneral.emMJ.emMJ_Xia,
			MahjongGeneral.emMJ.emMJ_Qiu,
			MahjongGeneral.emMJ.emMJ_Dong, 

			MahjongGeneral.emMJ.emMJ_DongFeng,
			MahjongGeneral.emMJ.emMJ_NanFeng,
			MahjongGeneral.emMJ.emMJ_XiFeng,
			MahjongGeneral.emMJ.emMJ_BeiFeng,
			MahjongGeneral.emMJ.emMJ_HongZhong,
			MahjongGeneral.emMJ.emMJ_FaCai,
			MahjongGeneral.emMJ.emMJ_BaiBan,  
		];
		this.ting_majiang_types=[ 
			MahjongGeneral.emMJ.emMJ_1Wan,  
			MahjongGeneral.emMJ.emMJ_2Wan,  
			MahjongGeneral.emMJ.emMJ_3Wan,  
			MahjongGeneral.emMJ.emMJ_4Wan,  
			MahjongGeneral.emMJ.emMJ_5Wan,  
			MahjongGeneral.emMJ.emMJ_6Wan,  
			MahjongGeneral.emMJ.emMJ_7Wan,  
			MahjongGeneral.emMJ.emMJ_8Wan,  
			MahjongGeneral.emMJ.emMJ_9Wan,  
		
		
			MahjongGeneral.emMJ.emMJ_1Tiao,  
			MahjongGeneral.emMJ.emMJ_2Tiao,  
			MahjongGeneral.emMJ.emMJ_3Tiao,  
			MahjongGeneral.emMJ.emMJ_4Tiao,  
			MahjongGeneral.emMJ.emMJ_5Tiao,  
			MahjongGeneral.emMJ.emMJ_6Tiao,  
			MahjongGeneral.emMJ.emMJ_7Tiao,  
			MahjongGeneral.emMJ.emMJ_8Tiao,  
			MahjongGeneral.emMJ.emMJ_9Tiao,  
		
		
			MahjongGeneral.emMJ.emMJ_1Tong,  
			MahjongGeneral.emMJ.emMJ_2Tong,  
			MahjongGeneral.emMJ.emMJ_3Tong,  
			MahjongGeneral.emMJ.emMJ_4Tong,  
			MahjongGeneral.emMJ.emMJ_5Tong,  
			MahjongGeneral.emMJ.emMJ_6Tong,  
			MahjongGeneral.emMJ.emMJ_7Tong,  
			MahjongGeneral.emMJ.emMJ_8Tong,  
			MahjongGeneral.emMJ.emMJ_9Tong,   


			MahjongGeneral.emMJ.emMJ_DongFeng,
			MahjongGeneral.emMJ.emMJ_NanFeng,
			MahjongGeneral.emMJ.emMJ_XiFeng,
			MahjongGeneral.emMJ.emMJ_BeiFeng,
			MahjongGeneral.emMJ.emMJ_HongZhong,
			MahjongGeneral.emMJ.emMJ_FaCai,
			MahjongGeneral.emMJ.emMJ_BaiBan,  
		]
	} 
	//移除掉春夏秋冬梅兰竹菊
	removeHua(){
		while(1)
		{
			let bFind=false;
			for(let index=0;index<this.all_majiang_types.length;++index)
			{
				let cardvalue=this.all_majiang_types[index];
				if(MahjongGeneral.Majiang_Type(cardvalue)==MahjongGeneral.MajiangType.emMJType_Hua)
				{
					this.all_majiang_types.remove(index)
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
	//得到所有听的牌
	getTingAllCard(){
		return this.ting_majiang_types.length;
	}
	//得到卡数量
	getCardCount(){ 
		return this.cardcount;
	}

	equal_range(arr,from,to,value)
	{
		let dat={}
		dat.first=-1;
		dat.second=-1;
		for (let i = from; i < to; i++) { 
			if(arr[i]==value)
			{
				if(dat.first<0)
					dat.first=i; 
			}
			else
			{
				if(dat.first>=0)
				{
					dat.second=i;
					break;
				}
			}
		} 
		if(dat.second<0)
		{
			for (let i = from; i < to; i++) 
			{
				if(value<arr[i])
				{ 
					dat.second=i; 
					break;
				} 
			}
		}
		if(dat.second<0)
			dat.second=to;
		if(dat.first<0)
			dat.first=dat.second;
		return dat
	}
	binary_search(arr,from,to,key)
	{  
		let mid, front=from, back=to-1;
		while (front<=back)
		{
			mid = Math.floor((front+back)/2);
			if (arr[mid]==key)
				return mid;
			if (arr[mid]<key)
				front = mid+1;
			else 
				back = mid-1;
		}
		return -1; 
	}
	find_if(arr,first,last,cb)
	{   
		while(first!=last && !cb(arr[first]))
		   ++first 
	   return first;
	}
	distance(src,dest)
	{ 
		return dest-src;
	}
	   
	Find_In_Sorted(arr, begin, end,   v) {  
		let it = begin;  
		while (it != end)  
		{  
			if (arr[it] == v)  
			{  
				break;  
			}  
			else if (arr[it] > v)  
			{  
				it = end;  
				break;  
			}  
			++it;  
		}  
		return it;  
	}
	setJin(jin,jin2)
	{
		this.jin=jin;
		this.jin2=jin2;
	}
	

	//递归拆分手牌  ,泉州麻将花牌也可以胡，比如双游后摸到花牌
	ResolvePai(  pai,   resolveInfo,hucards,fillOrder)  
	{    
		if (pai.empty() && resolveInfo.joker_count % 3 == 0)  
		{   
			return true;  
		}  
		else if (pai.size() + resolveInfo.joker_count < 3)  
		{    
			return false;  
		}    
		let fillIndex=hucards.length-1;
		let jokerFillKeFirst=fillOrder[fillIndex]==0; 
		if(jokerFillKeFirst){     
			if (pai.size() >= 3 && pai[0] == pai[2])  
			{  
				//找到刻子牌并移除  
				hucards.push({
					type:1, 
					cards:[pai[0]],
				})
				pai.erase(pai.begin(), pai.begin() + 3);  
				if (this.ResolvePai(pai, resolveInfo,hucards,fillOrder)) {  
					return true;  
				}  
			}  
			else if (pai.size() >= 2 && pai[0] == pai[1] && resolveInfo.joker_count >= 1)  
			{  
				--resolveInfo.joker_count;  
				
				hucards.push({
					type:1,
					jincount:1,
					cards:[pai[0],pai[1]],
				})
				//找到刻子牌并移除  
				pai.erase(pai.begin(), pai.begin() + 2);  
				if (this.ResolvePai(pai, resolveInfo,hucards,fillOrder)) {  
					return true;  
				}  
			}  
			else if (pai.size() >= 1 && resolveInfo.joker_count >= 2)  
			{  
				resolveInfo.joker_count -= 2;  
		  
				hucards.push({
					type:1,
					jincount:2,
					cards:[pai[0]],
				})
				//找到刻子牌并移除  
				pai.erase(pai.begin(), pai.begin() + 1);  
				if (this.ResolvePai(pai, resolveInfo,hucards,fillOrder)) {  
					return true;  
				}  
			}   
		}
		else{   
			//填充顺子
			if (MahjongGeneral.Majiang_Type(pai[0]) < MahjongGeneral.MajiangType.emMJType_Zi)  
			{  
				let it1 = this.Find_In_Sorted(pai,pai.begin() + 1, pai.end(), pai[0] + 1);  
				if (it1 != pai.end())  
				{  
					let it2 = this.Find_In_Sorted(pai, it1 + 1, pai.end(), pai[0] + 2);  
					if (it2 != pai.end())  
					{   
						hucards.push({
							type:2, 
							cards:[pai[0]], 
						})
						//找到顺序牌并移除  
						pai.erase(it2);  
						pai.erase(it1);  
						pai.erase(pai.begin());  
		  
						if (this.ResolvePai(pai, resolveInfo,hucards,fillOrder))  
							return true;  
					}  
					else if(resolveInfo.joker_count >= 1)  
					{  
						//找到顺序牌并移除  
						--resolveInfo.joker_count;  
						hucards.push({
							type:2,
							jincount:1,
							cards:[pai[0],pai[it1]], 
						})
						pai.erase(it1);  
						pai.erase(pai.begin());  
		  
						if (this.ResolvePai(pai, resolveInfo,hucards,fillOrder))  
							return true;  
					}  
				}  
				else if(resolveInfo.joker_count >= 1)  
				{  
					let it2 = this.Find_In_Sorted(pai,pai.begin() + 1, pai.end(), pai[0] + 2);  
					if (it2 != pai.end())  
					{  
						//找到顺序牌并移除  
						--resolveInfo.joker_count;  
						hucards.push({
							type:2,
							jincount:1,
							cards:[pai[0],pai[it2]], 
						})
						pai.erase(it2);  
						pai.erase(pai.begin());  
		  
						if (this.ResolvePai(pai, resolveInfo,hucards,fillOrder))  
							return true;  
					}  
					else if (resolveInfo.joker_count >= 2)  
					{  
						resolveInfo.joker_count -= 2;  
						hucards.push({
							type:2,
							jincount:2,
							cards:[pai[0]], 
						})
						pai.erase(pai.begin());  
		  
						if (this.ResolvePai(pai, resolveInfo,hucards,fillOrder))  
							return true;  
					}  
				}  
			}  
		   
		}   
		return false;  
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
		for(let i = 0;i<len;++i)
		{
			let jinjiangtype=jiangtypelist[i]
			let hucards=this.getHuCards(original_pai,jinjiangtype)
			if(hucards)
			{
				return hucards;
			}
		}
		return null;
	}  
	  
	// 
	getHuCards( original_pai,jinjiangtype)  
	{  
		if(original_pai.length%3!=2)
		{
			//表示相公牌
			return null;
		}
		//前提：牌已经排好序，不含已碰牌和已杠牌，所以牌数应该是3n+2  
		//过程：先找出一对将牌，然后再寻找刻子牌和顺子牌，直到剩余牌为0才表示可和牌，否则不能和牌  
		
		//记录将牌位置  
		//计算墩数
		let dunCount=(original_pai.length-2)/3;
		let jiang_location = 0;  
		let pai=null;  
		let hucards=null;
		while (true)  
		{  
			hucards=[];
			let i = jiang_location + 1;  
			if (i >= original_pai.size())  
			{  
				return null;  
			}  
	  
			pai = original_pai.concat();  
			let lastjiangpos=i;
			if (jiang_location != 0)  
			{  
				if (pai[lastjiangpos] == pai[jiang_location])  
				{   
					i=lastjiangpos;
					lastjiangpos++; 
				}  
			}  
			//寻找将牌位置，记录将牌第二个，并擦除该两牌  
			jiang_location = 0;  
			//这个地方要考虑金做将个数的问题
			switch(jinjiangtype)//两个金做将
			{
				case 2://金将
				{
					for (; i < pai.size(); ++ i)  
					{  
						if(!MahjongGeneral.isJoker(pai[i]))
							continue;
						if (MahjongGeneral.isJoker(pai[i]) && MahjongGeneral.isJoker(pai[i - 1]))  
						{  
							 
							hucards.push({
								type:0,
								jincount:2, 
							}) 
							jiang_location = i; 
							pai.erase(pai.begin() + i - 1, pai.begin() + i + 1);  
							break;  
						}   
					} 
				}
				break;
				case 1://闲金
				{
					for (; i < pai.size(); ++ i)  
					{  
						if (!MahjongGeneral.isJoker(pai[i]) && MahjongGeneral.isJoker(pai[0]))  
						{  
							hucards.push({
								type:0,
								jincount:1,
								cards:[pai[i]],
							})
							jiang_location = i;  
							pai.erase(pai.begin() + i, pai.begin() + i + 1);  
							pai.erase(pai.begin());  
							break;  
						}  
					} 
				}
				break;
				case 0://金不参与将
				{
					for (; i < pai.size(); ++ i)  
					{  
						if(MahjongGeneral.isJoker(pai[i]))
							continue;
						if (pai[i] == pai[i - 1])  
						{    
							hucards.push({
								type:0, 
								cards:[pai[i]],
							}) 
							jiang_location = i; 
							pai.erase(pai.begin() + i - 1, pai.begin() + i + 1);  
							break;  
						}   
					}  
				}
				break;
			} 
			if (jiang_location == 0)  
			{  
				//没有将牌，不能和牌
				pai=null;
				return null;  
			}   
			//无赖子时可直接循环拆分，有赖子时较复杂一些，需要递归拆分  
			let joker_end = pai.begin();  
			while (joker_end != pai.end() && MahjongGeneral.isJoker(pai[joker_end]))  
			{  
				++joker_end;  
			}  
			let joker_count = joker_end - pai.begin();  
			if (joker_count > 0)  
			{   
				//移除金给后面用
				pai.erase(pai.begin(), joker_end);  
				let fillGroup=this.fillGroupTypes[dunCount];
				if(!fillGroup)
				{
					//表示只有将牌
					break;
				}
				//填充策略
				let bResolved=false;
				//上次牌型拆解的深度
				let lastDepth=0;
				for(let fIndex =0 ;fIndex<fillGroup.length;fIndex++)
				{
					let fillOrder=fillGroup[fIndex];
					if(fIndex>0)
					{
						//用上一次牌型判定的深度,去计算
						let lastFillOrder=fillGroup[fIndex-1];
						//判断当前组合和上一次牌型深度的值是否一致,一致说明不成
						//举个例子如果[0,0,a,b]就是败了,如果判定到a就失败了，并且a和c相同那就不用判定[0,0,c,d]了
						let bAllSame=true;
						for(let d=0;d<lastDepth;++d)
						{
							let result=(lastFillOrder[d]==fillOrder[d])
							bAllSame=bAllSame&&result; 
						}
						if(bAllSame)
						{
							continue;
						}
					}
					let resolveInfo={joker_count:joker_count}
					let tmpHuCards=hucards.concat();//拷贝一份胡牌结果信息
					let tmpPai=pai.concat();//拷贝一份当前的牌
					if (this.ResolvePai(tmpPai, resolveInfo,tmpHuCards,fillOrder))  
					{   
						bResolved=true; 
						pai=tmpPai.concat();
						hucards=tmpHuCards.concat();
						break;  
					}  
					lastDepth=tmpHuCards.length;
				}

				if(bResolved)
				{ 
					break;
				}
			}  
			else  
			{  
				//还原成经典算法
				//剩下的牌数是3的倍数  
				//从左起第1张牌开始，它必须能组成刻子牌或者顺子牌才能和，否则不能和  
				while (pai.size() >= 3)  
				{  
					if (pai[0] == pai[2])  
					{  
						//找到刻子牌并移除  
						hucards.push({
							type:1, 
							cards:[pai[0]],
						}) 
						pai.erase(pai.begin(), pai.begin() + 3);  
					}  
					else if (MahjongGeneral.Majiang_Type(pai[0]) < MahjongGeneral.MajiangType.emMJType_Zi)  
					{   
						let it1 = this.Find_In_Sorted(pai,pai.begin() + 1, pai.end(), pai[0] + 1);  
						//let it1 = std::lower_bound(pai.begin() + 1, pai.end(), pai[0] + 1);  
						if (it1 != pai.end())  
						{  
							let it2 = this.Find_In_Sorted(pai,it1 + 1, pai.end(), pai[0] + 2);  
							//let it2 = std::lower_bound(it1 + 1, pai.end(), pai[0] + 2);  
							if (it2 != pai.end())  
							{   
								//找到顺序牌并移除
								hucards.push({
									type:2, 
									cards:[pai[0]],
								})   
								pai.erase(it2);  
								pai.erase(it1);  
								pai.erase(pai.begin());  
							}  
							else  
							{  
								break;  
							}  
						}  
						else  
						{  
							break;  
						}  
					}  
					else  
					{  
						break;  
					}  
				}   
				if (pai.empty())  
				{  
					break;  
				}  
			}  
		}  
		pai=null;
	  
		return hucards;  
	}
	randomArray(length) { 
		let i,
			index,
			temp,
			arr = [length];
		length = typeof(length) === 'undefined' ? 9 : length;
		for (i = 0; i < length; i++) {
			arr[i] = i;
		}
		// 打乱数组
		for (i = 0; i < length; i++) {
			// 产生从 i 到 length 之间的随机数
			index = Math.floor(Math.random() * (length - i)) + i;
			if (index != i) {
				temp = arr[i];
				arr[i] = arr[index];
				arr[index] = temp;
			}
		}
		return arr;
	}
	isHua(cardvalue)
	{
		let cate=MahjongGeneral.Majiang_Type(cardvalue)
		return cate==MahjongGeneral.MajiangType.emMJType_Hua;
	}
	isZi(cardvalue)
	{
		let cate=MahjongGeneral.Majiang_Type(cardvalue)
		return cate==MahjongGeneral.MajiangType.emMJType_Zi;
	}
	//洗牌
	xiPai()
	{
		//每张各四个
		let totalcards=[];
		for (let i = 0; i < this.all_majiang_types.length; i++) {
			let card=this.all_majiang_types[i];
			if(MahjongGeneral.Majiang_Type(card) == MahjongGeneral.MajiangType.emMJType_Hua){
				totalcards.push(card);
			}
			else{ 
				for (let j = 0; j < 4; j++) {
					totalcards.push(card);
				}
			} 
		}
		//计算得出乱序数组
		let randomarr=this.randomArray(totalcards.length);
		let xipaiarr=[];
		//按乱序数组放牌
		for (let i = 0; i < randomarr.length; i++) {
			let cardindex=randomarr[i]
			//暂时先按顺序放牌
			xipaiarr.push(totalcards[cardindex]);
			//xipaiarr.push(totalcards[i]);
		}
		return xipaiarr
	} 
	getTingArr(pai)  
	{  
		// //console.log("服务器开始检查听牌长度=",pai.length,pai)
		let ting_pai={};   
	  
		//赖子个数:赖子牌编码最小，在排好序的队列前面   
		let joker_end = pai.cbegin();  
		while (joker_end != pai.cend() && MahjongGeneral.isJoker(pai[joker_end]))  
		{   
			++joker_end;  
		}   
		let jocker_count = joker_end - pai.cbegin();  
		 
		for (let k=0;k<this.ting_majiang_types.length;++k)  
		{   
			let i=this.ting_majiang_types[k]
			if(i==this.jin)//跳过金用0替换金，并且把金数量上加
			{
				i=0;
				jocker_count++;
			}
			else if(i==this.jin2){
				i=1;
				jocker_count++;
			}
			//没有赖子时才过滤，有赖子的时候不能过滤，因为赖子单调的时候是和所有牌  
			if(jocker_count  == 0)  
			{  
				if (pai.front() - i > 1 || i - pai.back() > 1)  
				{   
					continue;  
				}  
				if (MahjongGeneral.Majiang_Type(i) >= MahjongGeneral.MajiangType.emMJType_Zi)  
				{  
					//字牌必须有相同的才可能和  
					if ( this.binary_search(pai,pai.cbegin(), pai.cend(), i)<0) {  
						continue;  
					}  
				}  
				else  
				{  
					let it = this.find_if(pai,pai.cbegin(), pai.cend(),function(c) {  
						//万筒条必须满足牌的数字相邻才有可能和   
					 
						return Math.abs(c - i) <= 1;  
					});  
					if (it == pai.cend()) {  
						continue;  
					}  
				}
			}  
			   
			let temp =pai.concat();  
			let range = this.equal_range(temp,temp.begin(), temp.end(), i);  
			
			if ( this.distance(range.first, range.second) == 4) {  
				
				//如果已经有四张牌了，不能算听牌   
				continue;  
			}         
			temp.insert(range.second, i);  
			let huinfo=this.IsHu(temp);
			temp=[];
			if (huinfo)  
			{   
				huinfo.jocker_count = jocker_count;
				ting_pai[i]=huinfo;  
			}   
		}  
	 
		return ting_pai;  
	}   

	//检测是否闲金
	checkXianJin(handcard)
	{
		if(handcard.length==1)
		{
			if(MahjongGeneral.isJoker(handcard[0]))
			{
				return true;
			}
		}
		let tmpCards=handcard.concat();
		tmpCards.push(MahjongGeneral.emMJ.emMJ_TEST);//金肯定不在任何手牌里，因为手牌里的金都变成了0
		tmpCards.sort(function(a,b)
		{
			return a-b;
		}); 
		let huinfo= this.IsHu(tmpCards);  
		tmpCards=[];
		if(!huinfo)//如果不能胡牌就无所谓闲金判断了
		{
			////console.log("checkXianJin不能胡")
			return false;
		}
		let tmpHuCards=huinfo.hucards;
		for (let i = 0; i < tmpHuCards.length; i++) 
		{
			let item=tmpHuCards[i];
			if(item.type==0)
			{
				////console.log("checkXianJin item",item,tmpHuCards)
				if(item.jincount==1 && item.cards[0]==MahjongGeneral.emMJ.emMJ_TEST)
				{  
					return true;  
				} 
			}
		}  
		return false; 

	}
	  

	getDanPaiFromJiang(huinfo)
	{
		let hucards=huinfo.hucards;
		for (let i = 0; i < hucards.length; i++) 
		{
			let item=hucards[i];
			if(item.type==0)
			{
				//起手牌可以胡牌并且将中金个数大于1
				if(item.jincount!=null && item.jincount>=1)
				{ 
					if(item.cards)
					{
						return item.cards[0]; 
					} 
					else
					{
						return 0;
					} 
				}   
			}
		}
		return null;
	}
	//判断是否是金将
	getJinJiang(handcard)
	{ 
		let huinfo= this.IsHu(handcard);  
		if(!huinfo)//如果不能胡牌就无所谓闲金判断了
		{ 
			return null;
		}
		let tmpHuCards=huinfo.hucards; 
		for (let i = 0; i < tmpHuCards.length; i++) 
		{
			let item=tmpHuCards[i];
			if(item.type==0)
			{ 
				//判断是不是金将
				//七对需要用到
				if(item.jincount==2)
				{  
					return huinfo;  
				} 
			}
		}  
		return null; 
	}
	//判断是否是闲金,闲金金至少大于一个
	getXianJin(handcard)
	{ 

		let huinfo= this.IsHu(handcard);  
		if(!huinfo)//如果不能胡牌就无所谓闲金判断了
		{ 
			return null;
		}
		let tmpHuCards=huinfo.hucards;
		////console.log("判断是否是闲金",tmpHuCards)
		for (let i = 0; i < tmpHuCards.length; i++) 
		{
			let item=tmpHuCards[i];
			if(item.type==0)
			{ 
				//判断是不是金将
				//7对需要用到
				if(item.jincount>=1)
				{  
					return huinfo;  
				} 
			}
		}  
		return null; 
	}
	getOptionCardsFromJiang(handcard)
	{  
		let optionCards=[];
		let key={};
		for (let i = 0; i < handcard.length; i++) {
			let card=handcard[i];
			if(MahjongGeneral.isJoker(card))
			{
				continue;
			}
			if(key[card]!=null)
				continue;
			let tmpCards = handcard.concat();
			tmpCards.remove(i);  
			key[card]=true;
			if(this.checkXianJin(tmpCards))
			{
				optionCards.push(card);
			}
			tmpCards=[];
		} 
		return optionCards;
	}
 
 
    IsHu(cards,yise=null){
        let hucards=this.IsCommonHu(cards);
        if(hucards)
        { 
            return {hutype:MahjongDef.hutype_normal,hucards:hucards};
        } 
        return null; 
	}
}
 