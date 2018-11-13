import { SssDef } from "./SssDef";
import { SssLib } from "./SssLib";

//扑克数目 						//扑克数目
//分析结构
let sizeof_BYTE=1;
let HAND_CARD_COUNT = 13 
class tagAnalyseData
{
    bOneCount:number;
    bTwoCount:number;
    bThreeCount:number;
    bFourCount:number;
    bFiveCount:number;
    bOneFirst:number[];
    bTwoFirst:number[];
    bThreeFirst:number[];
    bFourFirst:number[];
    bFiveFirst:number[];
    bStraight:number;
    constructor(){
        this.bOneCount=0;                               //单张数目
        this.bTwoCount =0;                              //两张数目
        this.bThreeCount =0;                            //三张数目
        this.bFourCount =0;                         //四张数目
        this.bFiveCount =0;                         //五张数目
        this.bOneFirst=SssLib.oneDArr(13);                          //单牌位置
        this.bTwoFirst=SssLib.oneDArr(13);                          //对牌位置
        this.bThreeFirst=SssLib.oneDArr(13);                        //三条位置
        this.bFourFirst=SssLib.oneDArr(13);                         //四张位置
        this.bFiveFirst=SssLib.oneDArr(13);                         //五张位置
        this.bStraight=0;                               //是否顺子 
    }
};

//分析结构
class tagAnalyseResult
{
    cbFourCount:number;                        //四张数目
    cbThreeCount:number;                        //三张数目
    cbDoubleCount:number;                       //两张数目
    cbSignedCount:number;                       //单张数目
    cbFourCardData:number[];                 //四张扑克
    cbThreeCardData:number[];                //三张扑克
    cbDoubleCardData:number[];               //两张扑克
    cbSignedCardData:number[];               //单张扑克
    constructor(){
        this.cbFourCount=0;						//四张数目
        this.cbThreeCount=0;						//三张数目
        this.cbDoubleCount=0;						//两张数目
        this.cbSignedCount=0;						//单张数目
        this.cbFourCardData=SssLib.oneDArr(13);					//四张扑克
        this.cbThreeCardData=SssLib.oneDArr(13);				//三张扑克
        this.cbDoubleCardData=SssLib.oneDArr(13);				//两张扑克
        this.cbSignedCardData=SssLib.oneDArr(13);				//单张扑克
    }
};
//分析结构
class tagAnalyseType
{
    bOnePare:number;                           //有一对
    bTwoPare:number;                           //有两对
    bThreeSame:number;                         //有三条
    bStraight:number;                          //有顺子
    bFlush:number;                             //有同花
    bGourd:number;                             //有葫芦
    bFourSame:number;                          //有铁支
    bStraightFlush:number;                     //有同花顺
    bFiveSame:number;                          //有五相

    cbOnePare:number[];                     //一对的序号
    cbTwoPare:number[];                     //两对的序号
    cbThreeSame:number[];                   //三条的序号
    cbStraight:number[];                    //顺子的序号
    cbFlush:number[];                       //同花的序号
    cbGourd:number[];                       //葫芦的序号
    cbFourSame:number[];                    //铁支的序号
    cbStraightFlush:number[];               //同花顺的序号
    cbFiveSame:number[];                    //五相的序号

    bbOnePare:number[];                      //所有一对标志弹起
    bbTwoPare:number[];                      //所有二对标志弹起
    bbThreeSame:number[];                    //所有三条标志弹起
    bbStraight:number[];                     //所有顺子标志弹起
    bbFlush:number[];                        //所有同花标志弹起
    bbGourd:number[];                        //所有葫芦标志弹起
    bbFourSame:number[];                     //所有铁支标志弹起
    bbStraightFlush:number[];                //所有同花顺标志弹起
    bbFiveSame:number[];                     //所有五相标志弹起

    btOnePare:number;                          //一对的数量 单独
    btThreeSame:number;                        //三条数量   单独
    btTwoPare:number;                          //两对的数量
    btStraight:number;                         //顺子的数量
    btFlush:number;                            //同花的数量
    btGourd:number;                            //葫芦的数量
    btFourSame:number;                         //铁支的数量
    btStraightFlush:number;                    //同花顺的数量
    btFiveSame:number;                         //五相的数量


    constructor(){
        this.bOnePare=0;                           //有一对
        this.bTwoPare=0;                           //有两对
        this.bThreeSame=0;                         //有三条
        this.bStraight=0;                          //有顺子
        this.bFlush=0;                             //有同花
        this.bGourd=0;                             //有葫芦
        this.bFourSame=0;                          //有铁支
        this.bStraightFlush=0;                     //有同花顺
        this.bFiveSame=0;                          //有五相

        this.cbOnePare=SssLib.oneDArr(100);                     //一对的序号
        this.cbTwoPare=SssLib.oneDArr(100);                     //两对的序号
        this.cbThreeSame=SssLib.oneDArr(100);                   //三条的序号
        this.cbStraight=SssLib.oneDArr(100);                    //顺子的序号
        this.cbFlush=SssLib.oneDArr(100);                       //同花的序号
        this.cbGourd=SssLib.oneDArr(100);                       //葫芦的序号
        this.cbFourSame=SssLib.oneDArr(100);                    //铁支的序号
        this.cbStraightFlush=SssLib.oneDArr(100);               //同花顺的序号
        this.cbFiveSame=SssLib.oneDArr(100);                    //五相的序号

        this.bbOnePare=SssLib.oneDArr(20);                      //所有一对标志弹起
        this.bbTwoPare=SssLib.oneDArr(20);                      //所有二对标志弹起
        this.bbThreeSame=SssLib.oneDArr(20);                    //所有三条标志弹起
        this.bbStraight=SssLib.oneDArr(20);                     //所有顺子标志弹起
        this.bbFlush=SssLib.oneDArr(20);                        //所有同花标志弹起
        this.bbGourd=SssLib.oneDArr(20);                        //所有葫芦标志弹起
        this.bbFourSame=SssLib.oneDArr(20);                     //所有铁支标志弹起
        this.bbStraightFlush=SssLib.oneDArr(20);                //所有同花顺标志弹起
        this.bbFiveSame=SssLib.oneDArr(20);                     //所有五相标志弹起

        this.btOnePare=0;                          //一对的数量 单独
        this.btThreeSame=0;                        //三条数量   单独
        this.btTwoPare=0;                          //两对的数量
        this.btStraight=0;                         //顺子的数量
        this.btFlush=0;                            //同花的数量
        this.btGourd=0;                            //葫芦的数量
        this.btFourSame=0;                         //铁支的数量
        this.btStraightFlush=0;                    //同花顺的数量
        this.btFiveSame=0;                         //五相的数量
    }
};
//////////////////////////////////////////////////////////////////////////
let NULL=null



//////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////



//构造函数
export default class SssCards{
    btCardSpecialData:number[];
    btrue:number;                                                       //true
    bfalse:number;                                                      //false
    enDescend:number;															//降序类型
    enAscend:number;																//升序类型
    enColor:number;		
    m_bCardListData=null;															//花色类型
    constructor(bCardListData){
        this.btrue=1;
        this.bfalse=0;
        this.enDescend=0;															//降序类型
        this.enAscend=1;																//升序类型
        this.enColor=2;																	//花色类型
        this.m_bCardListData=bCardListData;                                 //一副牌
        this.btCardSpecialData=SssLib.oneDArr(13);
        SssLib.ZeroMemory(this.btCardSpecialData,SssLib.sizeof(this.btCardSpecialData));
    }


    GetCardValue( bCardData) { return bCardData&SssDef.CARD_MASK_VALUE; } //十六进制前面四位表示牌的数值
    //获取花色
    GetCardColor( bCardData) { return (bCardData&SssDef.CARD_MASK_COLOR)>>4; } //十六进制后面四位表示牌的花色

    //获取类型
    GetCardType(  bCardData ,   bCardCount,  btSpecialCard )
    {
        //数据校验
        SssLib.ASSERT(bCardCount==3 || bCardCount==5||13==bCardCount) ;
        if(bCardCount!=3 && bCardCount!=5&&bCardCount!=13) return SssDef.CT_INVALID ;

        let AnalyseData=new tagAnalyseData() ;
        SssLib.memset(AnalyseData , 0 , SssLib.sizeof(tagAnalyseData)) ;

        //SssLib.ASSERT(3==bCardCount || 5==bCardCount) ;
        this.SortCardList(bCardData,bCardCount,this.enDescend);
        this.AnalyseCard(bCardData , bCardCount , AnalyseData) ;

        //开始分析
        switch (bCardCount)
        {
            case 3:	//三条类型
            {
                //单牌类型
                if(3==AnalyseData.bOneCount) return SssDef.CT_SINGLE;

                //对带一张
                if(1==AnalyseData.bTwoCount && 1==AnalyseData.bOneCount) return SssDef.CT_ONE_DOUBLE ;

                //三张牌型
                if(1==AnalyseData.bThreeCount) return SssDef.CT_THREE ;

                //错误类型
                return SssDef.CT_INVALID ;
            }
            case 5:	//五张牌型
            {
                let bFlushNoA	    = this.bfalse , 	bFlushFirstA	= this.bfalse ,		bFlushBackA	= this.bfalse ;

                if (this.GetCardLogicValue(bCardData[0])>= SssDef.CARD_XW && this.GetCardLogicValue(bCardData[1])<SssDef.CARD_XW)
                {

                    //A连在后
                    if ((this.GetCardLogicValue(bCardData[4])==10 || this.GetCardLogicValue(bCardData[4])==11) && this.GetCardLogicValue(bCardData[1])==14)
                    {
                        bFlushBackA = this.btrue;
                        for(let i =1; i<4; ++i)
                        {
                            let nValue=this.GetCardLogicValue(bCardData[i])-this.GetCardLogicValue(bCardData[i+1]);
                            if (1 != nValue && nValue != 2)
                            {
                                bFlushBackA = this.bfalse;
                                break;
                            }
                        }
                    }
                    else if (14==this.GetCardLogicValue(bCardData[1]) && 5>=this.GetCardLogicValue(bCardData[2]))//A连在前
                    {
                        bFlushFirstA = this.btrue;
                        for(let i =2; i<4; ++i)
                        {
                            let nValue=this.GetCardLogicValue(bCardData[i])-this.GetCardLogicValue(bCardData[i+1]);
                            if (1 != nValue && nValue != 2)
                            {
                                bFlushFirstA = this.bfalse;
                                break;
                            }
                        }
                    }
                    else
                    {
                        bFlushNoA = this.btrue;
                        let bRes=this.bfalse;
                        let count=0;
                        for(let i =1; i<4; ++i)
                        {
                            let A=this.GetCardLogicValue(bCardData[i]);
                            let B=this.GetCardLogicValue(bCardData[i+1]);
                            let nValue=A-B;
                            if (nValue == 1){
                                count++;
                            }
                            if (nValue==2)
                            {
                                if (!bRes)	//第一次进入
                                {
                                    bRes=this.btrue;
                                    continue;
                                }
                                //第二次进入
                                bFlushNoA = this.bfalse;
                                break;
                            }

                            if (1 != nValue)
                            {
                                bFlushNoA = this.bfalse;
                                break;
                            }
                        }
                        if (count == 3 && (this.GetCardLogicValue(bCardData[1]) == 5 && this.GetCardLogicValue(bCardData[4]) == 2)){
                            bFlushNoA = false;
                            bFlushFirstA = true;
                        }
                        else if (count == 3 && (this.GetCardLogicValue(bCardData[2]) <= 13 && this.GetCardLogicValue(bCardData[4] >= 10))){
                            bFlushNoA = false;
                            bFlushBackA = true;
                        }
                    }
                }
                else if (this.GetCardLogicValue(bCardData[0])== SssDef.CARD_DW && this.GetCardLogicValue(bCardData[1])==SssDef.CARD_XW)
                {


                    if ((this.GetCardLogicValue(bCardData[4])==10 || this.GetCardLogicValue(bCardData[4])==11 || this.GetCardLogicValue(bCardData[4])==12) && this.GetCardLogicValue(bCardData[2]==14))
                    {
                        bFlushBackA = this.btrue;
                        for(let i=2 ; i<4 ; ++i)
                        {
                            let nValue=this.GetCardLogicValue(bCardData[i])-this.GetCardLogicValue(bCardData[i+1]);
                            if (1 != nValue && nValue != 2 && nValue !=3)
                            {
                                bFlushBackA = this.bfalse;
                                break;
                            }
                        }

                    }
                    else if ( 14==this.GetCardLogicValue(bCardData[2]) && 5>=this.GetCardLogicValue(bCardData[3]))
                    {
                        bFlushFirstA = this.btrue;
                        for(let i =3; i<4; ++i)
                        {
                            let nValue=this.GetCardLogicValue(bCardData[i])-this.GetCardLogicValue(bCardData[i+1]);
                            if (1 != nValue && nValue != 2 && nValue !=3)
                            {
                                bFlushFirstA = this.bfalse;
                                break;
                            }
                        }
                    }
                    else
                    {

                        bFlushNoA = this.btrue;
                        let bRes1=this.bfalse;
                        let bRes2=this.bfalse;
                        let count=0;
                        for(let i =2; i<4; ++i)
                        {
                            let A=this.GetCardLogicValue(bCardData[i]);
                            let B=this.GetCardLogicValue(bCardData[i+1]);
                            let nValue=A-B;
                            if(nValue==1){
                                count++;
                            }
                            if (nValue==3)
                            {
                                if (!bRes1 && !bRes2)
                                {
                                    bRes1 = this.btrue;
                                    bRes2 = this.btrue;
                                    continue;
                                }
                                bFlushNoA = this.bfalse;
                                break;
                            }

                            if (nValue == 2)
                            {
                                if (!bRes1)
                                {
                                    bRes1 = this.btrue;
                                    count++;
                                    continue;
                                }
                                else if (!bRes2)
                                {
                                    bRes2 = this.btrue;
                                    count++;
                                    continue;
                                }

                                bFlushNoA = this.bfalse;
                                break;
                            }

                            if (1 != nValue && nValue != 2 && nValue !=3)
                            {
                                bFlushNoA = this.bfalse;
                                break;
                            }

                        }
                        if(count==2&&this.GetCardLogicValue(bCardData[2])<=5&&this.GetCardLogicValue(bCardData[4]>=2)){
                            bFlushNoA =false;
                            bFlushFirstA = true;
                        }
                        else if (count == 2 && (this.GetCardLogicValue(bCardData[2]) <= 13 && this.GetCardLogicValue(bCardData[4] >= 10))){
                            bFlushNoA = false;
                            bFlushBackA = true;
                        }
                    }

                }
                else
                {
                    //A连在后
                    if(14==this.GetCardLogicValue(bCardData[0])&& 10==this.GetCardLogicValue(bCardData[4]))	bFlushBackA = this.btrue ;
                    else	bFlushNoA = this.btrue ;
                    for(let i=0 ; i<4 ; ++i)
                    {
                        let nValue=this.GetCardLogicValue(bCardData[i])-this.GetCardLogicValue(bCardData[i+1]);
                        if(1!=nValue)
                        {
                            bFlushBackA = this.bfalse ;
                            bFlushNoA   = this.bfalse ;
                            break;
                        }
                    }
                    //A连在前
                    if(this.bfalse==bFlushBackA && this.bfalse==bFlushNoA && 14==this.GetCardLogicValue(bCardData[0]))
                    {
                        bFlushFirstA = this.btrue ;
                        for(let i=1 ; i<4 ; ++i) if(1!=this.GetCardLogicValue(bCardData[i])-this.GetCardLogicValue(bCardData[i+1])) bFlushFirstA = this.bfalse ;
                        if(2!=this.GetCardLogicValue(bCardData[4])) bFlushFirstA = this.bfalse ;
                    }


                }
                //五带0张
                if (1==AnalyseData.bFiveCount) return SssDef.CT_FIVE_BOMB;
                

                //同花五牌
                if(this.bfalse==bFlushBackA && this.bfalse==bFlushNoA && this.bfalse==bFlushFirstA)
                {
                    //四带单张
                    if(1==AnalyseData.bFourCount && 1==AnalyseData.bOneCount) return     SssDef.CT_FIVE_FOUR_ONE ;
                    //三条一对
                    if(1==AnalyseData.bThreeCount && 1==AnalyseData.bTwoCount) return     SssDef.CT_FIVE_THREE_DEOUBLE ;
                    if(this.btrue==AnalyseData.bStraight) return SssDef.CT_FIVE_FLUSH ;
                }
                else if(this.btrue==bFlushNoA)
                {
                    //杂顺类型
                    if(this.bfalse==AnalyseData.bStraight) return SssDef.CT_FIVE_MIXED_FLUSH_NO_A;
                    //同花顺牌
                    else							 return SssDef.CT_FIVE_STRAIGHT_FLUSH_NO_A ;
                }
                else if(this.btrue==bFlushFirstA)
                {
                    //杂顺类型
                    if(this.bfalse==AnalyseData.bStraight) return SssDef.CT_FIVE_MIXED_FLUSH_FIRST_A;
                    //同花顺牌
                    else							 return SssDef.CT_FIVE_STRAIGHT_FLUSH_FIRST_A ;
                }
                else if(this.btrue==bFlushBackA)
                {
                    //杂顺类型
                    if(this.bfalse==AnalyseData.bStraight) return SssDef.CT_FIVE_MIXED_FLUSH_BACK_A;
                    //同花顺牌
                    else							 return SssDef.CT_FIVE_STRAIGHT_FLUSH_BACK_A ;
                }


               
                
                //三条带单
                if(1==AnalyseData.bThreeCount && 2==AnalyseData.bOneCount) return	 SssDef.CT_THREE ;
                //两对牌型
                if(2==AnalyseData.bTwoCount && 1==AnalyseData.bOneCount) return		 SssDef.CT_FIVE_TWO_DOUBLE ;
                //只有一对
                if(1==AnalyseData.bTwoCount && 3==AnalyseData.bOneCount) return		 SssDef.CT_ONE_DOUBLE ;
                //单牌类型
                if(5==AnalyseData.bOneCount && this.bfalse==AnalyseData.bStraight) return  SssDef.CT_SINGLE ;
                //错误类型
                return SssDef.CT_INVALID;
            }
            case 13://13张特殊牌型
            {
                let TwelveKing=this.bfalse;
                //同花大菠萝
                if(13==AnalyseData.bOneCount&&this.btrue==AnalyseData.bStraight)
                    return SssDef.CT_THIRTEEN_FLUSH;
                //大菠萝
                if(13==AnalyseData.bOneCount)
                    return SssDef.CT_THIRTEEN;
                //十二皇族
                TwelveKing=this.btrue;
                for(let i=0;i<13;i++)
                {
                    if(this.GetCardLogicValue(bCardData[i])<11)
                    {
                        TwelveKing=this.bfalse;
                        break;
                    }
                }
                if(TwelveKing)
                {
                    return SssDef.CT_TWELVE_KING;
                }

                //三同花顺子
                {
                    let bCardList=SssLib.oneDArr(13)
                    SssLib.memcpy(bCardList,bCardData,sizeof_BYTE*13);
                    this.SortCardList(bCardList,13,this.enDescend);
                    let bLeftCount = 13;
                    let cbStraightFlush=SssLib.oneDArr(5)
                    let bTempCount = 5;
                    let tagCardType = this.GetType(bCardList,bLeftCount);
                    if (tagCardType.bStraightFlush)
                    {
                        for(let i = 0;i<tagCardType.btStraightFlush;++i)
                        {
                            SssLib.CopyMemory(bCardList,bCardData,SssLib.sizeof(bCardList));
                            bLeftCount = 13;
                            this.SortCardList(bCardList,13,this.enDescend);
                            SssLib.ZeroMemory(cbStraightFlush,SssLib.sizeof(cbStraightFlush));
                            cbStraightFlush[0]=bCardList[tagCardType.cbStraightFlush[i*5]];
                            cbStraightFlush[1]=bCardList[tagCardType.cbStraightFlush[i*5+1]];
                            cbStraightFlush[2]=bCardList[tagCardType.cbStraightFlush[i*5+2]];
                            cbStraightFlush[3]=bCardList[tagCardType.cbStraightFlush[i*5+3]];
                            cbStraightFlush[4]=bCardList[tagCardType.cbStraightFlush[i*5+4]];

                            //移除第一个同花顺
                            this.RemoveCard(cbStraightFlush, bTempCount, bCardList, bLeftCount);
                            bLeftCount -= bTempCount;

                            //备份剩余牌
                            let bLeftCardList=SssLib.oneDArr(13)
                            SssLib.CopyMemory(bLeftCardList,bCardList,bLeftCount);
                            let bLeftCount1 =bLeftCount;

                            let tagCardType1 = this.GetType(bCardList,bLeftCount);
                            if (tagCardType1.bStraightFlush)
                            {
                                for (let j = 0;j<tagCardType1.btStraightFlush;++j)
                                {
                                    //重新赋值
                                    SssLib.CopyMemory(bCardList,bLeftCardList,bLeftCount1);
                                    SssLib.ZeroMemory(cbStraightFlush,SssLib.sizeof(cbStraightFlush));
                                    bLeftCount =bLeftCount1;
                                    cbStraightFlush[0]=bCardList[tagCardType1.cbStraightFlush[j*5]];
                                    cbStraightFlush[1]=bCardList[tagCardType1.cbStraightFlush[j*5+1]];
                                    cbStraightFlush[2]=bCardList[tagCardType1.cbStraightFlush[j*5+2]];
                                    cbStraightFlush[3]=bCardList[tagCardType1.cbStraightFlush[j*5+3]];
                                    cbStraightFlush[4]=bCardList[tagCardType1.cbStraightFlush[j*5+4]];
                                    //移除第二个同花顺
                                    this.RemoveCard(cbStraightFlush, bTempCount, bCardList, bLeftCount);
                                    bLeftCount -= bTempCount;


                                    //判断剩余3张是否也符合同花顺
                                    let bThreeStraightFlush = this.bfalse;
                                    this.SortCardList(bCardList , bLeftCount, this.enDescend) ;

                                    if (this.GetCardLogicValue(bCardList[0]) >=SssDef.CARD_XW && this.GetCardLogicValue(bCardList[1]) <SssDef.CARD_XW)
                                    {
                                        if((this.GetCardColor(bCardList[1]) == this.GetCardColor(bCardList[2]))&&
                                            (this.GetCardLogicValue(bCardList[1])-this.GetCardLogicValue(bCardList[2])==1
                                                || this.GetCardLogicValue(bCardList[1])-this.GetCardLogicValue(bCardList[2])==2
                                                || (this.GetCardLogicValue(bCardList[1]) == 14 &&this.GetCardLogicValue(bCardList[2])<=3))
                                        )
                                        {
                                            bThreeStraightFlush = this.btrue;
                                        }
                                    }
                                    else if (this.GetCardLogicValue(bCardList[0]) ==SssDef.CARD_DW && this.GetCardLogicValue(bCardList[1]) ==SssDef.CARD_XW)
                                    {
                                        bThreeStraightFlush = this.btrue;
                                    }
                                    else
                                    {
                                        if((this.GetCardColor(bCardList[0]) == this.GetCardColor(bCardList[1]) && this.GetCardColor(bCardList[0]) == this.GetCardColor(bCardList[2]))&&
                                            ((this.GetCardLogicValue(bCardList[0])==this.GetCardLogicValue(bCardList[1])+1 && this.GetCardLogicValue(bCardList[1])==this.GetCardLogicValue(bCardList[2])+1)
                                                || (this.GetCardLogicValue(bCardList[0]) == 14 &&this.GetCardLogicValue(bCardList[1])==3 &&this.GetCardLogicValue(bCardList[2])==2)))
                                        {
                                            bThreeStraightFlush = this.btrue;
                                        }
                                    }
                                    if (bThreeStraightFlush)
                                    {
                                        return SssDef.CT_THREE_STRAIGHTFLUSH;
                                    }
                                }

                            }
                        }
                    }
                }

                //三炸弹
                if(3==AnalyseData.bFourCount)
                {
                    return SssDef.CT_THREE_BOMB;
                }
                //全大
                let AllBig=this.btrue;
                for(let i=0;i<13;i++)
                {
                    if(this.GetCardLogicValue(bCardData[i])<8)
                    {
                        AllBig=this.bfalse;
                        break;
                    }
                }
                if(AllBig)
                {
                    return SssDef.CT_ALL_BIG;
                }
                //全小
                let AllSmall=this.btrue;
                for(let i=0;i<13;i++)
                {
                    if(this.GetCardLogicValue(bCardData[i])>8)
                    {
                        AllSmall=this.bfalse;
                        break;
                    }
                }
                if(AllSmall)
                {
                    return SssDef.CT_ALL_SMALL;
                }
                //凑一色
                {
                    let Flush=1;
                    let bStartIndex = 0;
                    let SColor=0;
                    let bSameColorList=SssLib.oneDArr(13);
                    SssLib.memcpy(bSameColorList, bCardData, sizeof_BYTE*13);
                    this.SortCardList(bSameColorList,13,this.enDescend);
                    if (this.GetCardLogicValue(bSameColorList[0])>= SssDef.CARD_XW && this.GetCardLogicValue(bSameColorList[1])<SssDef.CARD_XW)
                    {
                        bStartIndex=1;
                    }else if (this.GetCardLogicValue(bSameColorList[0])>= SssDef.CARD_XW && this.GetCardLogicValue(bSameColorList[1])>=SssDef.CARD_XW)
                    {
                        bStartIndex=2;
                    }

                    {
                        SColor=this.GetCardColor(bSameColorList[bStartIndex]);
                        for(let i=bStartIndex+1;i<13;i++)
                        {
                            if(SColor==(this.GetCardColor(bSameColorList[i])) || SColor==((this.GetCardColor(bSameColorList[i])+2)%4))
                            {
                                Flush++;
                            }
                            else
                            {
                                break;
                            }
                        }
                    }

                    if(13-bStartIndex==Flush)
                    {
                        //if(ssslogic.peihua==this.btrue){
                            return SssDef.CT_SAME_COLOR;
                        //}
                    }
                }


                //四套冲三
                if(4==AnalyseData.bThreeCount||(3==AnalyseData.bThreeCount&&1==AnalyseData.bFourCount))
                {
                    return SssDef.CT_FOUR_THREESAME;
                }
                //五对冲三
                if((5==AnalyseData.bTwoCount&&1==AnalyseData.bThreeCount)||(3==AnalyseData.bTwoCount&&1==AnalyseData.bFourCount&&1==AnalyseData.bThreeCount)
                    ||(1==AnalyseData.bTwoCount&&2==AnalyseData.bFourCount&&1==AnalyseData.bThreeCount))
                {
                    return SssDef.CT_FIVEPAIR_THREE;
                }
                //六对半
                if(6==AnalyseData.bTwoCount||(4==AnalyseData.bTwoCount&&1==AnalyseData.bFourCount)||(2==AnalyseData.bTwoCount&&2==AnalyseData.bFourCount)
                    ||(3==AnalyseData.bFourCount))
                {
                    return SssDef.CT_SIXPAIR;
                }
                //三同花
                {
                    //定义变量
                    let bCardList=SssLib.oneDArr(13);
                    SssLib.memcpy(bCardList, bCardData, sizeof_BYTE*13);
                    let bLeftCCount = 13;
                    let bTempCard=SssLib.twoDArr(3,5);
                    let bTempCCount=SssLib.oneDArr(3)
                    let Flush = this.btrue;
                    //摆牌开始
                    for (let i = 0; i < 3; i++)
                    {
                        if (!this.IsFlush(bCardList, bLeftCCount, bTempCard[i], bTempCCount[i], (i==2?3:5)))
                        {
                            Flush = this.bfalse;
                            break;
                        }

                        this.RemoveCard(bTempCard[i], bTempCCount[i], bCardList, bLeftCCount);
                        bLeftCCount -= bTempCCount[i];

                        if (i<2) SssLib.CopyMemory1(btSpecialCard,bTempCard[i], bTempCCount[i],i*5);
                        else SssLib.CopyMemory1(btSpecialCard,bTempCard[i], bTempCCount[i],10);
                    }

                    if (Flush)
                    {
                        //if(ssslogic.peihua==this.btrue){
                        return SssDef.CT_THREE_FLUSH;
                        //}
                    }

                }

                //三顺子
                {
                    let bCardList=SssLib.oneDArr(13);
                    SssLib.memcpy(bCardList,bCardData,sizeof_BYTE*13);
                    this.SortCardList(bCardList,13,this.enDescend);
                    let bLeftCount = 13;
                    let cbStraight=SssLib.oneDArr(5)
                    let bTempCount = 5;
                    let Straight = this.btrue;
                    let tagCardType = this.GetType(bCardList,bLeftCount);
                    if (tagCardType.bStraight)
                    {
                        SssLib.ZeroMemory(btSpecialCard,sizeof_BYTE*13);

                        for(let i = 0;i<tagCardType.btStraight;++i)
                        {
                            SssLib.CopyMemory(bCardList,bCardData,SssLib.sizeof(bCardList));
                            bLeftCount = 13;
                            this.SortCardList(bCardList,13,this.enDescend);
                            SssLib.ZeroMemory(cbStraight,SssLib.sizeof(cbStraight));
                            cbStraight[0]=bCardList[tagCardType.cbStraight[i*5]];
                            cbStraight[1]=bCardList[tagCardType.cbStraight[i*5+1]];
                            cbStraight[2]=bCardList[tagCardType.cbStraight[i*5+2]];
                            cbStraight[3]=bCardList[tagCardType.cbStraight[i*5+3]];
                            cbStraight[4]=bCardList[tagCardType.cbStraight[i*5+4]];

                            //移除第一个顺子
                            this.RemoveCard(cbStraight, bTempCount, bCardList, bLeftCount);
                            bLeftCount -= bTempCount;
                            SssLib.CopyMemory(btSpecialCard,cbStraight, bTempCount);
                            //备份剩余牌
                            let bLeftCardList=SssLib.oneDArr(13)
                            SssLib.CopyMemory(bLeftCardList,bCardList,bLeftCount);
                            let bLeftCount1 =bLeftCount;

                            let tagCardType1 = this.GetType(bCardList,bLeftCount);
                            if (tagCardType1.bStraight)
                            {
                                for (let j = 0;j<tagCardType1.btStraight;++j)
                                {
                                    //重新赋值
                                    SssLib.CopyMemory(bCardList,bLeftCardList,bLeftCount1);
                                    SssLib.ZeroMemory(cbStraight,SssLib.sizeof(cbStraight));
                                    bLeftCount =bLeftCount1;
                                    cbStraight[0]=bCardList[tagCardType1.cbStraight[j*5]];
                                    cbStraight[1]=bCardList[tagCardType1.cbStraight[j*5+1]];
                                    cbStraight[2]=bCardList[tagCardType1.cbStraight[j*5+2]];
                                    cbStraight[3]=bCardList[tagCardType1.cbStraight[j*5+3]];
                                    cbStraight[4]=bCardList[tagCardType1.cbStraight[j*5+4]];
                                    //移除第二个顺子
                                    this.RemoveCard(cbStraight, bTempCount, bCardList, bLeftCount);
                                    bLeftCount -= bTempCount;
                                    SssLib.CopyMemory(btSpecialCard+5,cbStraight, bTempCount);

                                    //判断剩余3张是否也符合顺子
                                    let bThreeStraight = this.bfalse;
                                    this.SortCardList(bCardList , bLeftCount, this.enDescend) ;
                                    if (this.GetCardLogicValue(bCardList[0]) >=SssDef.CARD_XW && this.GetCardLogicValue(bCardList[1]) <SssDef.CARD_XW)
                                    {
                                        if(this.GetCardLogicValue(bCardList[1])-this.GetCardLogicValue(bCardList[2])==1
                                            || this.GetCardLogicValue(bCardList[1])-this.GetCardLogicValue(bCardList[2])==2
                                            || (this.GetCardLogicValue(bCardList[1]) == 14 &&this.GetCardLogicValue(bCardList[2])<=3)
                                        )
                                        {
                                            bThreeStraight = this.btrue;
                                        }
                                    }
                                    else if (this.GetCardLogicValue(bCardList[0]) ==SssDef.CARD_DW && this.GetCardLogicValue(bCardList[1]) ==SssDef.CARD_XW)
                                    {
                                        bThreeStraight = this.btrue;
                                    }
                                    else
                                    {
                                        if((this.GetCardLogicValue(bCardList[0])==this.GetCardLogicValue(bCardList[1])+1 && this.GetCardLogicValue(bCardList[1])==this.GetCardLogicValue(bCardList[2])+1)
                                            || (this.GetCardLogicValue(bCardList[0]) == 14 &&this.GetCardLogicValue(bCardList[1])==3 &&this.GetCardLogicValue(bCardList[2])==2))
                                        {
                                            bThreeStraight = this.btrue;
                                        }
                                    }
                                    if (bThreeStraight)
                                    {
                                        SssLib.CopyMemory(btSpecialCard+10,bCardList , bLeftCount);
                                        return SssDef.CT_THREE_STRAIGHT;
                                    }
                                }

                            }
                        }
                    }
                }
            }
        }
        return SssDef.CT_INVALID;
    }

    //排列扑克
    SortCardList(  bCardData ,   bCardCount,  SortCardType)
    {
        SssLib.ASSERT(bCardCount>=1 && bCardCount<=13) ;
        if(bCardCount<1 || bCardCount>13) return ;

        //转换数值
        let bLogicVolue=SssLib.oneDArr(13);
        for(let i =0;i<bCardCount;i++)	bLogicVolue[i]=this.GetCardLogicValue(bCardData[i]);

        if(this.enDescend==SortCardType)
        {
            //排序操作
            let bSorted=this.btrue;
            let bTempData,bLast=bCardCount-1;
            let m_bCardCount=1;
            do
            {
                bSorted=this.btrue;
                for(let i =0;i<bLast;i++)
                {
                    if ((bLogicVolue[i]<bLogicVolue[i+1])||
                        ((bLogicVolue[i]==bLogicVolue[i+1])&&(bCardData[i]<bCardData[i+1])))
                    {
                        //交换位置
                        bTempData=bCardData[i];
                        bCardData[i]=bCardData[i+1];
                        bCardData[i+1]=bTempData;
                        bTempData=bLogicVolue[i];
                        bLogicVolue[i]=bLogicVolue[i+1];
                        bLogicVolue[i+1]=bTempData;
                        bSorted=this.bfalse;
                    }
                }
                bLast--;
            } while(bSorted==this.bfalse);
        }
        else if(this.enAscend==SortCardType)
        {
            //排序操作
            let bSorted=this.btrue;
            let bTempData,bLast=bCardCount-1;
            let m_bCardCount=1;
            do
            {
                bSorted=this.btrue;
                for(let i =0;i<bLast;i++)
                {
                    if ((bLogicVolue[i]>bLogicVolue[i+1])||
                        ((bLogicVolue[i]==bLogicVolue[i+1])&&(bCardData[i]>bCardData[i+1])))
                    {
                        //交换位置
                        bTempData=bCardData[i];
                        bCardData[i]=bCardData[i+1];
                        bCardData[i+1]=bTempData;
                        bTempData=bLogicVolue[i];
                        bLogicVolue[i]=bLogicVolue[i+1];
                        bLogicVolue[i+1]=bTempData;
                        bSorted=this.bfalse;
                    }
                }
                bLast--;
            } while(bSorted==this.bfalse);
        }
        else if(this.enColor==SortCardType)
        {
            //排序操作
            let bSorted=this.btrue;
            let bTempData,bLast=bCardCount-1;
            let m_bCardCount=1;
            let bColor=SssLib.oneDArr(13);
            for(let i =0;i<bCardCount;i++)	bColor[i]=this.GetCardColor(bCardData[i]);
            do
            {
                bSorted=this.btrue;
                for(let i =0;i<bLast;i++)
                {
                    if ((bColor[i]<bColor[i+1])||
                        ((bColor[i]==bColor[i+1])&&(this.GetCardLogicValue(bCardData[i])<this.GetCardLogicValue(bCardData[i+1]))))
                    {
                        //交换位置
                        bTempData=bCardData[i];
                        bCardData[i]=bCardData[i+1];
                        bCardData[i+1]=bTempData;
                        bTempData=bColor[i];
                        bColor[i]=bColor[i+1];
                        bColor[i+1]=bTempData;
                        bSorted=this.bfalse;
                    }
                }
                bLast--;
            } while(bSorted==this.bfalse);
        }
        return;
    }

    //混乱扑克
    RandCardList(  bCardBuffer ,   bBufferCount)
    {
        //混乱准备
        let bCardData=SssLib.oneDArr(SssLib.sizeof(this.m_bCardListData));
        SssLib.CopyMemory(bCardData,this.m_bCardListData,SssLib.sizeof(this.m_bCardListData));
        //SssLib.CopyMemory(bCardBuffer,m_bCardListData,SssLib.sizeof(m_bCardListData));

        //混乱扑克
        let bRandCount=0,bPosition=0;
        do
        {
            bPosition=SssLib.rand()%(bBufferCount-bRandCount);
            bCardBuffer[bRandCount++]=bCardData[bPosition];
            bCardData[bPosition]=bCardData[bBufferCount-bRandCount];
        } while (bRandCount<bBufferCount);
        return;
    }

    //删除扑克
    RemoveCard( bRemoveCard ,   bRemoveCount,   bCardData ,   bCardCount)
    {
        //检验数据
        SssLib.ASSERT(bRemoveCount<=bCardCount);

        //定义变量
        let bDeleteCount=0,bTempCardData=SssLib.oneDArr(13);
        if (bCardCount>SssLib.CountArray(bTempCardData)) return this.bfalse;
        SssLib.CopyMemory(bTempCardData,bCardData,bCardCount*1);

        //置零扑克
        for(let i =0;i<bRemoveCount;i++)
        {
            for (let j=0;j<bCardCount;j++)
            {
                if (bRemoveCard[i]==bTempCardData[j])
                {
                    bDeleteCount++;
                    bTempCardData[j]=0;
                    break;
                }
            }
        }
        if (bDeleteCount!=bRemoveCount) return this.bfalse;

        //清理扑克
        let bCardPos=0;
        for(let i =0;i<bCardCount;i++)
        {
            if (bTempCardData[i]!=0) bCardData[bCardPos++]=bTempCardData[i];
        }

        return this.btrue;
    }

    //逻辑数值
    GetCardLogicValue(  bCardData)
    {
        //扑克属性
        let bCardValue=this.GetCardValue(bCardData);
        let bCardColor=this.GetCardColor(bCardData);
        if(bCardColor==0x04)
        {
            return bCardValue + 1;
        }
        //转换数值
        return (bCardValue==1)?(bCardValue+13):bCardValue;
    }

    /*
	返回值:
	*	bNextList>bFirstList:this.btrue
	bNextList<bFirstList:this.bfalse
	*/
    //对比扑克
    CompareCard(  bInFirstList ,   bInNextList ,   bFirstCount,   bNextCount ,   bComperWithOther)
    {
        let FirstAnalyseData=new tagAnalyseData() , NextAnalyseData=new tagAnalyseData();

        SssLib.memset(FirstAnalyseData , 0 , SssLib.sizeof(tagAnalyseData)) ;
        SssLib.memset(NextAnalyseData , 0 , SssLib.sizeof(tagAnalyseData)) ;

        //排列扑克
        let bFirstList=SssLib.oneDArr(13), bNextList=SssLib.oneDArr(13) ;
        SssLib.CopyMemory(bFirstList , bInFirstList , bFirstCount) ;
        SssLib.CopyMemory(bNextList , bInNextList , bNextCount) ;
        this.SortCardList(bFirstList , bFirstCount , this.enDescend) ;
        this.SortCardList(bNextList , bNextCount , this.enDescend) ;

        SssLib.ASSERT(3==bFirstCount || 5==bFirstCount || 3==bNextCount || 5==bNextCount||13==bFirstCount||13==bNextCount) ;

        this.AnalyseCard(bFirstList , bFirstCount , FirstAnalyseData) ;

        this.AnalyseCard(bNextList  , bNextCount  , NextAnalyseData) ;

        SssLib.ASSERT(bFirstCount==(FirstAnalyseData.bOneCount+FirstAnalyseData.bTwoCount*2+FirstAnalyseData.bThreeCount*3+FirstAnalyseData.bFourCount*4+FirstAnalyseData.bFiveCount*5)) ;
        SssLib.ASSERT(bNextCount=(NextAnalyseData.bOneCount+NextAnalyseData.bTwoCount*2+NextAnalyseData.bThreeCount*3+NextAnalyseData.bFourCount*4+NextAnalyseData.bFiveCount*5)) ;
        if(bFirstCount!=(FirstAnalyseData.bOneCount+FirstAnalyseData.bTwoCount*2+FirstAnalyseData.bThreeCount*3+FirstAnalyseData.bFourCount*4+FirstAnalyseData.bFiveCount*5))
        {
            //	AfxMessageBox("error") ;
            return this.bfalse ;
        }
        if(bNextCount != (NextAnalyseData.bOneCount + NextAnalyseData.bTwoCount*2 + NextAnalyseData.bThreeCount*3+NextAnalyseData.bFourCount*4+NextAnalyseData.bFiveCount*5))
        {
            //	AfxMessageBox("error") ;
            return this.bfalse ;
        }
        //数据验证
        SssLib.ASSERT((bFirstCount==bNextCount) || (bFirstCount!=bNextCount && (3==bFirstCount && 5==bNextCount || 5==bFirstCount && 3==bNextCount))) ;
        if(!((bFirstCount==bNextCount) || (bFirstCount!=bNextCount && (3==bFirstCount && 5==bNextCount || 5==bFirstCount && 3==bNextCount)))) return this.bfalse ;

        //获取类型
        //SssLib.ASSERT(3==bNextCount || 5==bNextCount) ;
        //SssLib.ASSERT(3==bFirstCount || 5==bFirstCount) ;

        let bNextType=this.GetCardType(bNextList,bNextCount,this.btCardSpecialData);
        let bFirstType=this.GetCardType(bFirstList,bFirstCount,this.btCardSpecialData);

        SssLib.ASSERT(SssDef.CT_INVALID!=bNextType && SssDef.CT_INVALID!=bFirstType) ;
        if(SssDef.CT_INVALID==bFirstType || SssDef.CT_INVALID==bNextType) return this.bfalse ;

        //头段比较
        if(this.btrue==bComperWithOther)
        {
            if(3==bFirstCount)
            {
                //开始对比
                if(bNextType==bFirstType)
                {
                    switch(bFirstType)
                    {
                        case SssDef.CT_SINGLE:				//单牌类型
                        {
                            //数据验证
                            //数据验证
                            SssLib.ASSERT(bNextList[0]!=bFirstList[0]) ;
                            // if(bNextList[0]==bFirstList[0]) return this.bfalse ;

                            let bAllSame=this.btrue ;

                            for(let i=0 ; i<3 ; ++i)
                                if(this.GetCardLogicValue(bNextList[i]) != this.GetCardLogicValue(bFirstList[i]))
                                {
                                    bAllSame = this.bfalse ;
                                    break;
                                }

                            if(this.btrue==bAllSame)
                                return this.GetCardColor(bNextList[0]) > this.GetCardColor(bFirstList[0]) ;			//比较花色
                            else
                            {
                                for(let i=0 ; i<3 ; ++i)
                                    if(this.GetCardLogicValue(bNextList[i]) != this.GetCardLogicValue(bFirstList[i]))
                                        return this.GetCardLogicValue(bNextList[i]) > this.GetCardLogicValue(bFirstList[i]) ;
                                return this.bfalse ;
                            }

                            return this.bfalse ;

                        }
                        case SssDef.CT_ONE_DOUBLE:			//对带一张
                        {
                            //数据验证
                            SssLib.ASSERT(bNextList[NextAnalyseData.bTwoFirst[0]]!=bFirstList[FirstAnalyseData.bTwoFirst[0]]) ;
                            // if(bNextList[NextAnalyseData.bTwoFirst[0]]==bFirstList[FirstAnalyseData.bTwoFirst[0]]) return this.bfalse ;

                            if(this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[0]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[0]]))
                            {
                                if(this.GetCardLogicValue(bNextList[NextAnalyseData.bOneFirst[0]]) != this.GetCardLogicValue(bFirstList[FirstAnalyseData.bOneFirst[0]]))
                                    return this.GetCardLogicValue(bNextList[NextAnalyseData.bOneFirst[0]]) > this.GetCardLogicValue(bFirstList[FirstAnalyseData.bOneFirst[0]]) ;
                                else
                                    return this.GetCardColor(bNextList[NextAnalyseData.bTwoFirst[0]]) > this.GetCardColor(bFirstList[FirstAnalyseData.bTwoFirst[0]]) ;
                            }
                            else
                                return this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[0]]) > this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[0]]) ;
                        }

                        case SssDef.CT_THREE:				//三张牌型
                        {
                            //数据验证
                            if(bNextList[NextAnalyseData.bThreeFirst[0]]==bFirstList[FirstAnalyseData.bThreeFirst[0]])
                            {
                                // #ifdef _DEBUG
                                //
                                // 							AfxMessageBox("bNextList[NextAnalyseData.bThreeFirst[0]]!=bFirstList[FirstAnalyseData.bThreeFirst[0]]") ;
                                // #endif
                            }
                            SssLib.ASSERT(bNextList[NextAnalyseData.bThreeFirst[0]]!=bFirstList[FirstAnalyseData.bThreeFirst[0]]) ;
                            // if(bNextList[NextAnalyseData.bThreeFirst[0]]==bFirstList[FirstAnalyseData.bThreeFirst[0]]) return this.bfalse ;

                            if(this.GetCardLogicValue(bNextList[NextAnalyseData.bThreeFirst[0]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bThreeFirst[0]]))
                                return this.GetCardColor(bNextList[NextAnalyseData.bThreeFirst[0]]) > this.GetCardColor(bFirstList[FirstAnalyseData.bThreeFirst[0]]) ;			//比较花色
                            else
                                return this.GetCardLogicValue(bNextList[NextAnalyseData.bThreeFirst[0]]) > this.GetCardLogicValue(bFirstList[FirstAnalyseData.bThreeFirst[0]]); 	//比较数值
                        }

                    }

                }
                else
                    return bNextType>bFirstType ;
            }
            else if(5==bFirstCount)
            {
                //开始对比
                if(bNextType==bFirstType)
                {

                    switch(bFirstType)
                    {
                        case SssDef.CT_SINGLE:				//单牌类型
                        {
                            //数据验证
                            SssLib.ASSERT(bNextList[0]!=bFirstList[0]) ;
                            // if(bNextList[0]==bFirstList[0]) return this.bfalse ;

                            let bAllSame=this.btrue ;

                            for(let i=0 ; i<5 ; ++i)
                                if(this.GetCardLogicValue(bNextList[i]) != this.GetCardLogicValue(bFirstList[i]))
                                {
                                    bAllSame = this.bfalse ;
                                    break;
                                }

                            if(this.btrue==bAllSame)
                                return this.GetCardColor(bNextList[0]) > this.GetCardColor(bFirstList[0]) ;			//比较花色
                            else
                            {
                                for(let i=0 ; i<5 ; ++i)
                                    if(this.GetCardLogicValue(bNextList[i]) != this.GetCardLogicValue(bFirstList[i]))
                                        return this.GetCardLogicValue(bNextList[i]) > this.GetCardLogicValue(bFirstList[i]) ;
                                return this.bfalse ;
                            }

                            return this.bfalse ;

                        }
                        case SssDef.CT_ONE_DOUBLE:			//对带一张
                        {
                            //数据验证
                            SssLib.ASSERT(bNextList[NextAnalyseData.bTwoFirst[0]]!=bFirstList[FirstAnalyseData.bTwoFirst[0]]) ;
                            // if(bNextList[NextAnalyseData.bTwoFirst[0]]==bFirstList[FirstAnalyseData.bTwoFirst[0]]) return this.bfalse ;

                            if(this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[0]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[0]]))
                            {
                                //对比单张
                                for(let i=0; i<3; ++i)
                                {
                                    if(this.GetCardLogicValue(bNextList[NextAnalyseData.bOneFirst[i]])!=this.GetCardLogicValue(bFirstList[FirstAnalyseData.bOneFirst[i]]))
                                        return this.GetCardLogicValue(bNextList[NextAnalyseData.bOneFirst[i]]) > this.GetCardLogicValue(bFirstList[FirstAnalyseData.bOneFirst[i]]) ;
                                }
                                return this.GetCardColor(bNextList[NextAnalyseData.bTwoFirst[0]]) > this.GetCardColor(bFirstList[FirstAnalyseData.bTwoFirst[0]]) ;			//比较花色
                            }
                            else
                                return this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[0]]) > this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[0]]); 	//比较数值
                        }
                        case SssDef.CT_FIVE_TWO_DOUBLE:	//两对牌型
                        {
                            //数据验证
                            SssLib.ASSERT(bNextList[NextAnalyseData.bTwoFirst[0]]!=bFirstList[FirstAnalyseData.bTwoFirst[0]]) ;
                            // if(bNextList[NextAnalyseData.bTwoFirst[0]]==bFirstList[FirstAnalyseData.bTwoFirst[0]]) return this.bfalse ;

                            if(this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[0]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[0]]))
                            {
                                if(this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[1]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[1]]))
                                {
                                    if(this.GetCardLogicValue(bNextList[NextAnalyseData.bOneFirst[0]])!=this.GetCardLogicValue(bFirstList[FirstAnalyseData.bOneFirst[0]]))
                                        return this.GetCardLogicValue(bNextList[NextAnalyseData.bOneFirst[0]]) > this.GetCardLogicValue(bFirstList[FirstAnalyseData.bOneFirst[0]]) ;

                                    return this.GetCardColor(bNextList[NextAnalyseData.bTwoFirst[0]]) > this.GetCardColor(bFirstList[FirstAnalyseData.bTwoFirst[0]]) ;			//比较花色
                                }
                                else
                                    return this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[1]]) > this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[1]]); 	//比较数值
                            }
                            else
                                return this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[0]]) > this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[0]]); 	//比较数值
                        }

                        case SssDef.CT_THREE:				//三张牌型
                        {
                            //数据验证
                            if(bNextList[NextAnalyseData.bThreeFirst[0]]==bFirstList[FirstAnalyseData.bThreeFirst[0]])
                            {
                                // #ifdef _DEBUG
                                //
                                // 							AfxMessageBox("bNextList[NextAnalyseData.bThreeFirst[0]]!=bFirstList[FirstAnalyseData.bThreeFirst[0]]") ;
                                // #endif
                            }
                            SssLib.ASSERT(bNextList[NextAnalyseData.bThreeFirst[0]]!=bFirstList[FirstAnalyseData.bThreeFirst[0]]) ;
                            // if(bNextList[NextAnalyseData.bThreeFirst[0]]==bFirstList[FirstAnalyseData.bThreeFirst[0]]) return this.bfalse ;

                            if(this.GetCardLogicValue(bNextList[NextAnalyseData.bThreeFirst[0]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bThreeFirst[0]]))
                                return this.GetCardColor(bNextList[NextAnalyseData.bThreeFirst[0]]) > this.GetCardColor(bFirstList[FirstAnalyseData.bThreeFirst[0]]) ;			//比较花色
                            else
                                return this.GetCardLogicValue(bNextList[NextAnalyseData.bThreeFirst[0]]) > this.GetCardLogicValue(bFirstList[FirstAnalyseData.bThreeFirst[0]]); 	//比较数值
                        }

                        case SssDef.CT_FIVE_MIXED_FLUSH_FIRST_A:				//A在前顺子
                        {
                            //数据验证
                            SssLib.ASSERT(bNextList[0]!=bFirstList[0]) ;
                            // if(bNextList[0]==bFirstList[0]) return this.bfalse ;

                            if(this.GetCardLogicValue(bNextList[0]) == this.GetCardLogicValue(bFirstList[0]))
                                return this.GetCardColor(bNextList[0]) > this.GetCardColor(bFirstList[0]) ;			//比较花色
                            else
                                return this.GetCardLogicValue(bNextList[0]) > this.GetCardLogicValue(bFirstList[0]) ;	//比较数值

                        }
                        case SssDef.CT_FIVE_MIXED_FLUSH_NO_A:			//没A杂顺
                        {
                            //数据验证
                            SssLib.ASSERT(bNextList[0]!=bFirstList[0]) ;
                            // if(bNextList[0]==bFirstList[0]) return this.bfalse ;

                            if(this.GetCardLogicValue(bNextList[0])==this.GetCardLogicValue(bFirstList[0]))
                                return this.GetCardColor(bNextList[0]) > this.GetCardColor(bFirstList[0]) ;			//比较花色
                            else
                                return this.GetCardLogicValue(bNextList[0]) > this.GetCardLogicValue(bFirstList[0]); 	//比较数值
                        }
                        case SssDef.CT_FIVE_MIXED_FLUSH_BACK_A:		//A在后顺子
                        {
                            //数据验证
                            SssLib.ASSERT(bNextList[0]!=bFirstList[0]) ;
                            // if(bNextList[0]==bFirstList[0]) return this.bfalse ;

                            if(this.GetCardLogicValue(bNextList[0])==this.GetCardLogicValue(bFirstList[0]))
                                return this.GetCardColor(bNextList[0]) > this.GetCardColor(bFirstList[0]) ;			//比较花色
                            else
                                return this.GetCardLogicValue(bNextList[0]) > this.GetCardLogicValue(bFirstList[0]); 	//比较数值

                        }

                        case SssDef.CT_FIVE_FLUSH:				//同花五牌
                        {
                            //数据验证
                            SssLib.ASSERT(bNextList[0]!=bFirstList[0]) ;
                            // if(bNextList[0]==bFirstList[0]) return this.bfalse ;

                            //比较数值
                            for(let i=0; i<5; ++i)
                                if(this.GetCardLogicValue(bNextList[i]) != this.GetCardLogicValue(bFirstList[i]))
                                    return this.GetCardLogicValue(bNextList[i]) > this.GetCardLogicValue(bFirstList[i]) ;

                            //比较花色
                            return this.GetCardColor(bNextList[0]) > this.GetCardColor(bFirstList[0]) ;
                        }

                        case SssDef.CT_FIVE_THREE_DEOUBLE:			//三条一对
                        {
                            //数据验证
                            SssLib.ASSERT(bNextList[NextAnalyseData.bThreeFirst[0]]!=bFirstList[FirstAnalyseData.bThreeFirst[0]]) ;
                            // if(bNextList[NextAnalyseData.bThreeFirst[0]]==bFirstList[FirstAnalyseData.bThreeFirst[0]]) return this.bfalse ;

                            if(this.GetCardLogicValue(bNextList[NextAnalyseData.bThreeFirst[0]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bThreeFirst[0]]))
                                return this.GetCardColor(bNextList[NextAnalyseData.bThreeFirst[0]]) > this.GetCardColor(bFirstList[FirstAnalyseData.bThreeFirst[0]]) ;			//比较花色
                            else
                                return this.GetCardLogicValue(bNextList[NextAnalyseData.bThreeFirst[0]]) > this.GetCardLogicValue(bFirstList[FirstAnalyseData.bThreeFirst[0]]); 	//比较数值
                        }

                        case SssDef.CT_FIVE_FOUR_ONE:			//四带一张
                        {
                            //数据验证
                            SssLib.ASSERT(bNextList[NextAnalyseData.bFourFirst[0]]!=bFirstList[FirstAnalyseData.bFourFirst[0]]) ;
                            // if(bNextList[NextAnalyseData.bFourFirst[0]]==bFirstList[FirstAnalyseData.bFourFirst[0]]) return this.bfalse ;

                            if(this.GetCardLogicValue(bNextList[NextAnalyseData.bFourFirst[0]]) == this.GetCardLogicValue(bFirstList[FirstAnalyseData.bFourFirst[0]]))
                                return this.GetCardColor(bNextList[NextAnalyseData.bFourFirst[0]]) > this.GetCardColor(bFirstList[FirstAnalyseData.bFourFirst[0]]) ;			//比较花色
                            else
                                return this.GetCardLogicValue(bNextList[NextAnalyseData.bFourFirst[0]]) > this.GetCardLogicValue(bFirstList[FirstAnalyseData.bFourFirst[0]]) ;	//比较数值

                        }
                        case SssDef.CT_FIVE_BOMB:      //五相
                        {
                            SssLib.ASSERT(bNextList[NextAnalyseData.bFiveFirst[0]]!=bFirstList[FirstAnalyseData.bFiveFirst[0]]) ;
                            // if(bNextList[NextAnalyseData.bFiveFirst[0]]==bFirstList[FirstAnalyseData.bFiveFirst[0]]) return this.bfalse ;
                            if(this.GetCardLogicValue(bNextList[NextAnalyseData.bFiveFirst[0]]) == this.GetCardLogicValue(bFirstList[FirstAnalyseData.bFiveFirst[0]]))
                                return this.GetCardColor(bNextList[NextAnalyseData.bFiveFirst[0]]) > this.GetCardColor(bFirstList[FirstAnalyseData.bFiveFirst[0]]) ;			//比较花色
                            else
                                return this.GetCardLogicValue(bNextList[NextAnalyseData.bFiveFirst[0]]) > this.GetCardLogicValue(bFirstList[FirstAnalyseData.bFiveFirst[0]]) ;	//比较数值
                        }
                        case SssDef.CT_FIVE_STRAIGHT_FLUSH_NO_A:   //没A同花顺
                        case SssDef.CT_FIVE_STRAIGHT_FLUSH_FIRST_A://A在前同花顺
                        case SssDef.CT_FIVE_STRAIGHT_FLUSH_BACK_A: //A在后同花顺
                        {
                            //数据验证
                            SssLib.ASSERT(bNextList[0]!=bFirstList[0]) ;
                            // if(bNextList[0]==bFirstList[0]) return this.bfalse ;

                            //比较数值
                            for(let i=0; i<5; ++i)
                                if(this.GetCardLogicValue(bNextList[i]) != this.GetCardLogicValue(bFirstList[i]))
                                    return this.GetCardLogicValue(bNextList[i]) > this.GetCardLogicValue(bFirstList[i]) ;

                            //比较花色
                            return this.GetCardColor(bNextList[0]) > this.GetCardColor(bFirstList[0]) ;

                        }
                        default:
                            // #ifdef _DEBUG
                            // 					AfxMessageBox("错误扑克类型！") ;
                            // #endif
                            return this.bfalse ;
                    }

                }
                else
                {
                    //同花顺牌
                    //  				if( bNextType==CT_FIVE_STRAIGHT_FLUSH_FIRST_A || bNextType==CT_FIVE_STRAIGHT_FLUSH)
                    //  				{
                    //  					if(CT_FIVE_STRAIGHT_FLUSH_FIRST_A==bFirstType || CT_FIVE_STRAIGHT_FLUSH==bFirstType)
                    //  					{
                    //  						if(bNextType!=bFirstType)
                    //  							return bNextType > bFirstType ;
                    //
                    //  						//比较数值
                    //  						for(let i=0; i<5; ++i)
                    //  							if(this.GetCardLogicValue(bNextList[i]) != this.GetCardLogicValue(bFirstList[i]))
                    //  								return this.GetCardLogicValue(bNextList[i]) > this.GetCardLogicValue(bFirstList[i]) ;
                    //
                    //  						//比较花色
                    //  						return this.GetCardColor(bNextList[0]) > this.GetCardColor(bFirstList[0]) ;
                    //  					}
                    //  				}
                    return bNextType>bFirstType ;
                }
            }
            else
            {
                if(bNextType==bFirstType)
                {
                    switch(bFirstType)
                    {
                        case SssDef.CT_THIRTEEN_FLUSH:
                        {
                            return this.GetCardColor(bNextList[0])>this.GetCardColor(bFirstList[0]);
                            // return this.bfalse;
                        }
                        case SssDef.CT_TWELVE_KING:
                        {
                            let AllSame=this.btrue;
                            for(let i=0;i<13;i++)
                            {
                                if(this.GetCardLogicValue(bNextList[i])!=this.GetCardLogicValue(bFirstList[i]))
                                {
                                    AllSame=this.bfalse;
                                    return this.GetCardLogicValue(bNextList[i])>this.GetCardLogicValue(bFirstList[i]);
                                }
                            }
                            if(AllSame)
                            {
                                return this.GetCardColor(bNextList[0])>this.GetCardColor(bFirstList[0]);
                            }
                            return this.bfalse;
                        }
                        case SssDef.CT_THREE_STRAIGHTFLUSH:
                        {
                            let AllSame=this.btrue;
                            for(let i=0;i<13;i++)
                            {
                                if(this.GetCardLogicValue(bNextList[i])!=this.GetCardLogicValue(bFirstList[i]))
                                {
                                    AllSame=this.bfalse;
                                    return this.GetCardLogicValue(bNextList[i])>this.GetCardLogicValue(bFirstList[i]);
                                }
                            }
                            if(AllSame)
                            {
                                return this.GetCardColor(bNextList[0])>this.GetCardColor(bFirstList[0]);
                            }
                            return this.bfalse;
                        }
                        case SssDef.CT_THREE_BOMB:
                        {
                            SssLib.ASSERT(bNextList[NextAnalyseData.bFourFirst[0]]!=bFirstList[FirstAnalyseData.bFourFirst[0]]) ;
                            // if(bNextList[NextAnalyseData.bFourFirst[0]]==bFirstList[FirstAnalyseData.bFourFirst[0]]) return this.bfalse ;

                            if(this.GetCardLogicValue(bNextList[NextAnalyseData.bFourFirst[0]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bFourFirst[0]]))
                            {
                                if(this.GetCardLogicValue(bNextList[NextAnalyseData.bFourFirst[1]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bFourFirst[1]]))
                                {
                                    if(this.GetCardLogicValue(bNextList[NextAnalyseData.bFourFirst[2]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bFourFirst[2]]))
                                    {
                                        if(this.GetCardLogicValue(bNextList[NextAnalyseData.bOneFirst[0]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bOneFirst[0]]))
                                        {
                                            return this.GetCardColor(bNextList[NextAnalyseData.bFourFirst[0]])>this.GetCardColor(bFirstList[FirstAnalyseData.bFourFirst[0]]);
                                        }
                                        else
                                        {
                                            return this.GetCardLogicValue(bNextList[NextAnalyseData.bOneFirst[0]])>this.GetCardLogicValue(bFirstList[FirstAnalyseData.bOneFirst[0]]);
                                        }
                                    }
                                    else
                                    {
                                        return this.GetCardLogicValue(bNextList[NextAnalyseData.bFourFirst[2]])>this.GetCardLogicValue(bFirstList[FirstAnalyseData.bFourFirst[2]]);
                                    }
                                }
                                else
                                {
                                    return this.GetCardLogicValue(bNextList[NextAnalyseData.bFourFirst[1]])>this.GetCardLogicValue(bFirstList[FirstAnalyseData.bFourFirst[1]]);
                                }
                            }
                            else
                                return this.GetCardLogicValue(bNextList[NextAnalyseData.bFourFirst[0]]) > this.GetCardLogicValue(bFirstList[FirstAnalyseData.bFourFirst[0]]); 	//比较数值
                            return this.bfalse;
                        }
                        case SssDef.CT_ALL_BIG:
                        {
                            let AllSame=this.btrue;
                            for(let i=0;i<13;i++)
                            {
                                if(this.GetCardLogicValue(bNextList[i])!=this.GetCardLogicValue(bFirstList[i]))
                                {
                                    AllSame=this.bfalse;
                                    return this.GetCardLogicValue(bNextList[i])>this.GetCardLogicValue(bFirstList[i]);
                                }
                            }
                            if(AllSame)
                            {
                                return this.GetCardColor(bNextList[0])>this.GetCardColor(bFirstList[0]);
                            }
                            return this.bfalse;
                        }
                        case SssDef.CT_ALL_SMALL:
                        {

                            let AllSame=this.btrue;
                            for(let i=0;i<13;i++)
                            {
                                if(this.GetCardLogicValue(bNextList[i])!=this.GetCardLogicValue(bFirstList[i]))
                                {
                                    AllSame=this.bfalse;
                                    return this.GetCardLogicValue(bNextList[i])>this.GetCardLogicValue(bFirstList[i]);
                                }
                            }
                            if(AllSame)
                            {
                                return this.GetCardColor(bNextList[0])>this.GetCardColor(bFirstList[0]);
                            }
                            return this.bfalse;
                        }
                        case SssDef.CT_SAME_COLOR:
                        {
                            let AllSame=this.btrue;
                            for(let i=0;i<13;i++)
                            {
                                if(this.GetCardLogicValue(bNextList[i])!=this.GetCardLogicValue(bFirstList[i]))
                                {
                                    AllSame=this.bfalse;
                                    return this.GetCardLogicValue(bNextList[i])>this.GetCardLogicValue(bFirstList[i]);
                                }
                            }
                            if(AllSame)
                            {
                                return this.GetCardColor(bNextList[0])>this.GetCardColor(bFirstList[0]);
                            }
                            return this.bfalse;
                        }
                        case SssDef.CT_FOUR_THREESAME:
                        {

                            SssLib.ASSERT(bNextList[NextAnalyseData.bThreeFirst[0]]!=bFirstList[FirstAnalyseData.bThreeFirst[0]]) ;
                            // if(bNextList[NextAnalyseData.bThreeFirst[0]]==bFirstList[FirstAnalyseData.bThreeFirst[0]]) return this.bfalse ;

                            if(this.GetCardLogicValue(bNextList[NextAnalyseData.bThreeFirst[0]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bThreeFirst[0]]))
                            {
                                if(this.GetCardLogicValue(bNextList[NextAnalyseData.bThreeFirst[1]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bThreeFirst[1]]))
                                {
                                    if(this.GetCardLogicValue(bNextList[NextAnalyseData.bThreeFirst[2]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bThreeFirst[2]]))
                                    {
                                        if(this.GetCardLogicValue(bNextList[NextAnalyseData.bThreeFirst[3]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bThreeFirst[3]]))
                                        {
                                            if(this.GetCardLogicValue(bNextList[NextAnalyseData.bOneFirst[0]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bOneFirst[0]]))
                                            {
                                                return this.GetCardColor(bNextList[NextAnalyseData.bThreeFirst[0]])>this.GetCardColor(bFirstList[FirstAnalyseData.bThreeFirst[0]]);
                                            }
                                            else
                                            {
                                                return this.GetCardLogicValue(bNextList[NextAnalyseData.bOneFirst[0]])>this.GetCardLogicValue(bFirstList[FirstAnalyseData.bOneFirst[0]]);
                                            }

                                        }
                                        else
                                        {
                                            return this.GetCardLogicValue(bNextList[NextAnalyseData.bThreeFirst[3]])>this.GetCardLogicValue(bFirstList[FirstAnalyseData.bThreeFirst[3]]);
                                        }
                                    }
                                    else
                                    {
                                        return this.GetCardLogicValue(bNextList[NextAnalyseData.bThreeFirst[2]])>this.GetCardLogicValue(bFirstList[FirstAnalyseData.bThreeFirst[2]]);
                                    }
                                }
                                else
                                {
                                    return this.GetCardLogicValue(bNextList[NextAnalyseData.bThreeFirst[1]])>this.GetCardLogicValue(bFirstList[FirstAnalyseData.bThreeFirst[1]]);
                                }
                            }
                            else
                                return this.GetCardLogicValue(bNextList[NextAnalyseData.bThreeFirst[0]]) > this.GetCardLogicValue(bFirstList[FirstAnalyseData.bThreeFirst[0]]); 	//比较数值
                            return this.bfalse;
                        }

                        case SssDef.CT_FIVEPAIR_THREE:
                        {

                            SssLib.ASSERT(bNextList[NextAnalyseData.bTwoFirst[0]]!=bFirstList[FirstAnalyseData.bTwoFirst[0]]) ;
                            // if(bNextList[NextAnalyseData.bTwoFirst[0]]==bFirstList[FirstAnalyseData.bTwoFirst[0]]) return this.bfalse ;

                            if(this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[0]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[0]]))
                            {
                                if(this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[1]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[1]]))
                                {
                                    if(this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[2]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[2]]))
                                    {
                                        if(this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[3]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[3]]))
                                        {
                                            if(this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[4]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[4]]))
                                            {
                                                if(this.GetCardLogicValue(bNextList[NextAnalyseData.bThreeFirst[0]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bThreeFirst[0]]))
                                                {
                                                    return this.GetCardColor(bNextList[NextAnalyseData.bTwoFirst[0]])>this.GetCardColor(bFirstList[FirstAnalyseData.bTwoFirst[0]]);
                                                }
                                                else
                                                {
                                                    return this.GetCardLogicValue(bNextList[NextAnalyseData.bThreeFirst[0]])>this.GetCardLogicValue(bFirstList[FirstAnalyseData.bThreeFirst[0]]);
                                                }
                                            }
                                            else
                                            {
                                                return this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[4]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[4]]);
                                            }
                                        }
                                        else
                                        {
                                            return this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[3]])>this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[3]]);
                                        }
                                    }
                                    else
                                    {
                                        return this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[2]])>this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[2]]);
                                    }
                                }
                                else
                                {
                                    return this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[1]])>this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[1]]);
                                }
                            }
                            else
                                return this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[0]]) > this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[0]]); 	//比较数值
                            return this.bfalse;
                        }

                        case SssDef.CT_SIXPAIR:
                        {
                            SssLib.ASSERT(bNextList[NextAnalyseData.bTwoFirst[0]]!=bFirstList[FirstAnalyseData.bTwoFirst[0]]) ;
                            // if(bNextList[NextAnalyseData.bTwoFirst[0]]==bFirstList[FirstAnalyseData.bTwoFirst[0]]) return this.bfalse ;

                            if(this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[0]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[0]]))
                            {
                                if(this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[1]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[1]]))
                                {
                                    if(this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[2]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[2]]))
                                    {
                                        if(this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[3]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[3]]))
                                        {
                                            if(this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[4]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[4]]))
                                            {
                                                if(this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[5]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[5]]))
                                                {
                                                    if(this.GetCardLogicValue(bNextList[NextAnalyseData.bOneFirst[0]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bOneFirst[0]]))
                                                    {
                                                        return this.GetCardColor(bNextList[NextAnalyseData.bTwoFirst[0]])>this.GetCardColor(bFirstList[FirstAnalyseData.bTwoFirst[0]]);
                                                    }
                                                    else
                                                    {
                                                        return this.GetCardLogicValue(bNextList[NextAnalyseData.bOneFirst[0]])>this.GetCardLogicValue(bFirstList[FirstAnalyseData.bOneFirst[0]]);
                                                    }
                                                }
                                                else
                                                {
                                                    return this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[5]])>this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[5]]);
                                                }
                                            }
                                            else
                                            {
                                                return this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[4]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[4]]);
                                            }
                                        }
                                        else
                                        {
                                            return this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[3]])>this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[3]]);
                                        }
                                    }
                                    else
                                    {
                                        return this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[2]])>this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[2]]);
                                    }
                                }
                                else
                                {
                                    return this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[1]])>this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[1]]);
                                }
                            }
                            else
                                return this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[0]]) > this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[0]]); 	//比较数值
                            return this.bfalse;
                        }
                        case SssDef.CT_THREE_FLUSH:
                        {
                            let AllSame=this.btrue;
                            for(let i=0;i<13;i++)
                            {
                                if(this.GetCardLogicValue(bNextList[i])!=this.GetCardLogicValue(bFirstList[i]))
                                {
                                    AllSame=this.bfalse;
                                    return this.GetCardLogicValue(bNextList[i])>this.GetCardLogicValue(bFirstList[i]);
                                }
                            }
                            if(AllSame)
                            {
                                return this.GetCardColor(bNextList[0])>this.GetCardColor(bFirstList[0]);
                            }
                            return this.bfalse;
                        }
                        case SssDef.CT_THREE_STRAIGHT:
                        {
                            let AllSame=this.btrue;
                            for(let i=0;i<13;i++)
                            {
                                if(this.GetCardLogicValue(bNextList[i])!=this.GetCardLogicValue(bFirstList[i]))
                                {
                                    AllSame=this.bfalse;
                                    return this.GetCardLogicValue(bNextList[i])>this.GetCardLogicValue(bFirstList[i]);
                                }
                            }
                            if(AllSame)
                            {
                                return this.GetCardColor(bNextList[0])>this.GetCardColor(bFirstList[0]);
                            }
                            return this.bfalse;
                        }
                    }
                }
                else
                    return bNextType>bFirstType;
            }
        }
        else
        {
            //开始对比
            if(bNextType==bFirstType)
            {
                switch(bFirstType)
                {
                    case SssDef.CT_SINGLE:				//单牌类型
                    {
                        //数据验证
                        SssLib.ASSERT(bNextList[0]!=bFirstList[0]) ;
                        // if(bNextList[0]==bFirstList[0]) return this.bfalse ;

                        let bAllSame=this.btrue ;

                        for(let i=0 ; i<3 ; ++i)
                            if(this.GetCardLogicValue(bNextList[i]) != this.GetCardLogicValue(bFirstList[i]))
                            {
                                bAllSame = this.bfalse ;
                                break;
                            }

                        if(this.btrue==bAllSame)
                            return this.GetCardColor(bNextList[0]) > this.GetCardColor(bFirstList[0]) ;			//比较花色
                        else
                        {
                            for(let i=0 ; i<3 ; ++i)
                                if(this.GetCardLogicValue(bNextList[i]) != this.GetCardLogicValue(bFirstList[i]))
                                    return this.GetCardLogicValue(bNextList[i]) > this.GetCardLogicValue(bFirstList[i]) ;
                            return bNextCount < bFirstCount ;
                        }

                        return bNextCount < bFirstCount ;

                    }
                    case SssDef.CT_ONE_DOUBLE:			//对带一张
                    {
                        //数据验证
                        SssLib.ASSERT(bNextList[NextAnalyseData.bTwoFirst[0]]!=bFirstList[FirstAnalyseData.bTwoFirst[0]]) ;
                        // if(bNextList[NextAnalyseData.bTwoFirst[0]]==bFirstList[FirstAnalyseData.bTwoFirst[0]]) return this.bfalse ;

                        if(this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[0]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[0]]))
                        {
                            if(this.GetCardLogicValue(bNextList[NextAnalyseData.bOneFirst[0]])!=this.GetCardLogicValue(bFirstList[FirstAnalyseData.bOneFirst[0]]))
                                return this.GetCardLogicValue(bNextList[NextAnalyseData.bOneFirst[0]]) > this.GetCardLogicValue(bFirstList[FirstAnalyseData.bOneFirst[0]]) ;

                            return this.GetCardColor(bNextList[NextAnalyseData.bTwoFirst[0]]) > this.GetCardColor(bFirstList[FirstAnalyseData.bTwoFirst[0]]) ;			//比较花色
                        }
                        else
                            return this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[0]]) > this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[0]]); 	//比较数值

                        return bNextCount < bFirstCount ;
                    }
                    case SssDef.CT_FIVE_TWO_DOUBLE:	//两对牌型
                    {
                        //数据验证
                        SssLib.ASSERT(bNextList[NextAnalyseData.bTwoFirst[0]]!=bFirstList[FirstAnalyseData.bTwoFirst[0]]) ;
                        // if(bNextList[NextAnalyseData.bTwoFirst[0]]==bFirstList[FirstAnalyseData.bTwoFirst[0]]) return this.bfalse ;

                        if(this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[0]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[0]]))
                        {
                            if(this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[1]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[1]]))
                            {
                                //对比单牌
                                if(this.GetCardLogicValue(bNextList[NextAnalyseData.bOneFirst[0]])!=this.GetCardLogicValue(bFirstList[FirstAnalyseData.bOneFirst[0]]))
                                    return this.GetCardLogicValue(bNextList[NextAnalyseData.bOneFirst[0]]) > this.GetCardLogicValue(bFirstList[FirstAnalyseData.bOneFirst[0]]) ;

                                return this.GetCardColor(bNextList[NextAnalyseData.bTwoFirst[0]]) > this.GetCardColor(bFirstList[FirstAnalyseData.bTwoFirst[0]]) ;			//比较花色
                            }
                            else
                                return this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[1]]) > this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[1]]); 	//比较数值
                        }
                        else
                            return this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[0]]) > this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[0]]); //比较数值
                        //return bNextCount < bFirstCount ;
                    }

                    case SssDef.CT_THREE:				//三张牌型
                    {
                        //数据验证
                        if(bNextList[NextAnalyseData.bThreeFirst[0]]==bFirstList[FirstAnalyseData.bThreeFirst[0]])
                        {
                            // #ifdef _DEBUG
                            //
                            // 						AfxMessageBox("bNextList[NextAnalyseData.bThreeFirst[0]]!=bFirstList[FirstAnalyseData.bThreeFirst[0]]") ;
                            // #endif
                        }
                        SssLib.ASSERT(bNextList[NextAnalyseData.bThreeFirst[0]]!=bFirstList[FirstAnalyseData.bThreeFirst[0]]) ;
                        // if(bNextList[NextAnalyseData.bThreeFirst[0]]==bFirstList[FirstAnalyseData.bThreeFirst[0]]) return this.bfalse ;

                        if(this.GetCardLogicValue(bNextList[NextAnalyseData.bThreeFirst[0]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bThreeFirst[0]]))
                            return this.GetCardColor(bNextList[NextAnalyseData.bThreeFirst[0]]) > this.GetCardColor(bFirstList[FirstAnalyseData.bThreeFirst[0]]) ;			//比较花色
                        else
                            return this.GetCardLogicValue(bNextList[NextAnalyseData.bThreeFirst[0]]) > this.GetCardLogicValue(bFirstList[FirstAnalyseData.bThreeFirst[0]]); //比较数值
                        return bNextCount < bFirstCount ;
                    }

                    case SssDef.CT_FIVE_MIXED_FLUSH_FIRST_A:                //A在前顺子
                    case SssDef.CT_FIVE_MIXED_FLUSH_NO_A:            //没A杂顺
                    case SssDef.CT_FIVE_MIXED_FLUSH_BACK_A:        //A在后顺子
                    {
                        //获得王牌
                        let FirstJokerCount = 0;
                        let NextJokerCount = 0;
                        for (let i = 0; i < 2; i++) {
                            if (this.GetCardLogicValue(bFirstList[i]) == SssDef.CARD_DW || this.GetCardLogicValue(bFirstList[i]) == SssDef.CARD_XW) {
                                FirstJokerCount++;
                            }
                            if (this.GetCardLogicValue(bNextList[i]) == SssDef.CARD_DW || this.GetCardLogicValue(bNextList[i]) == SssDef.CARD_XW) {
                                NextJokerCount++;
                            }
                        }

                        if (FirstJokerCount > 0 || NextJokerCount > 0) {
                            let FirstStraight = true;
                            let NextStraight = true;
                            let FirstTwoValue = false;
                            let NextTwoValue = false;
                            let FirstbigCard = 0;
                            let NextbigCard = 0;
                            for (let i = FirstJokerCount; i < 4; i++) {
                                if (this.GetCardLogicValue(bFirstList[i]) != (this.GetCardLogicValue(bFirstList[i + 1]) + 1)) {
                                    if (this.GetCardLogicValue(bFirstList[i]) - this.GetCardLogicValue(bFirstList[i + 1]) == 3) {
                                        FirstTwoValue == true;
                                    }
                                    FirstStraight = false;
                                }
                            }
                            for (let i = NextJokerCount; i < 4; i++) {
                                if (this.GetCardLogicValue(bNextList[i]) != (this.GetCardLogicValue(bNextList[i + 1]) + 1)) {
                                    if (this.GetCardLogicValue(bNextList[i]) - this.GetCardLogicValue(bNextList[i + 1]) == 3) {
                                        NextTwoValue == true;
                                    }
                                    NextStraight = false;
                                }
                            }
                            if (FirstStraight) {
                                FirstbigCard = this.GetCardLogicValue(bFirstList[FirstJokerCount]) + FirstJokerCount;
                            } else if (!FirstStraight) {
                                if (FirstJokerCount == 2 && !FirstTwoValue) {
                                    FirstbigCard = this.GetCardLogicValue(bFirstList[FirstJokerCount]) + 1;
                                } else {
                                    FirstbigCard = this.GetCardLogicValue(bFirstList[FirstJokerCount]);
                                }
                            }
                            if (NextStraight) {
                                NextbigCard = this.GetCardLogicValue(bNextList[NextJokerCount]) + NextJokerCount;
                            } else if (!NextStraight) {
                                if (NextJokerCount == 2 && !NextTwoValue) {
                                    NextbigCard = this.GetCardLogicValue(bNextList[NextJokerCount]) + 1;
                                } else {
                                    NextbigCard = this.GetCardLogicValue(bNextList[NextJokerCount]);
                                }
                            }
                            if (FirstbigCard == NextbigCard) {
                                if (NextJokerCount == FirstJokerCount) {
                                    for (let StraightJoker = FirstJokerCount; StraightJoker < 5; StraightJoker++) {
                                        if (this.GetCardLogicValue(bFirstList[StraightJoker])!=this.GetCardLogicValue(bNextList[StraightJoker])) {
                                            return this.GetCardLogicValue(bFirstList[StraightJoker])<this.GetCardLogicValue(bNextList[StraightJoker])
                                        }
                                        if (this.GetCardColor(bFirstList[StraightJoker])!=this.GetCardColor(bNextList[StraightJoker])) {
                                            return this.GetCardColor(bFirstList[StraightJoker])<this.GetCardColor(bNextList[StraightJoker])
                                        }
                                    }
                                    return true;
                                }
                                return FirstJokerCount>NextJokerCount
                            }
                            return FirstbigCard < NextbigCard;
                        }
                        for (let straightnum = 0; straightnum < 5; straightnum++) {
                            if (this.GetCardLogicValue(bFirstList[straightnum])!=this.GetCardLogicValue(bNextList[straightnum])) {
                                return this.GetCardLogicValue(bFirstList[straightnum])<this.GetCardLogicValue(bNextList[straightnum])
                            }
                            if (this.GetCardColor(bFirstList[straightnum])!=this.GetCardColor(bNextList[straightnum])) {
                                return this.GetCardColor(bFirstList[straightnum])<this.GetCardColor(bNextList[straightnum])
                            }
                        }
                        return true;
                    }

                    case SssDef.CT_FIVE_FLUSH:				//同花五牌
                    {
                        //数据验证
                        SssLib.ASSERT(bNextList[0] != bFirstList[0]);
                        //if(bNextList[0]==bFirstList[0]) return false ;
                        let FirstThreeCount = FirstAnalyseData.bThreeCount;
                        let FirstTwoCount = FirstAnalyseData.bTwoCount;
                        let NextThreeCount = NextAnalyseData.bThreeCount;
                        let NextTwoCount = NextAnalyseData.bTwoCount;
                        if (FirstThreeCount > 0 && NextThreeCount > 0) {//同花都有3条
                            return this.GetCardLogicValue(bFirstList[FirstAnalyseData.bThreeFirst[0]]) < this.GetCardLogicValue(bNextList[NextAnalyseData.bThreeFirst[0]]);
                        }
                        if(FirstThreeCount>0||NextThreeCount>0){
                            return FirstThreeCount<NextThreeCount;
                        }
                        if (FirstThreeCount == 0 && NextThreeCount == 0) {
                            if (FirstTwoCount == NextTwoCount && FirstTwoCount != 0) {//同花有对子
                                return this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[0]]) < this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[0]]);
                            } else if(FirstTwoCount>0&&NextTwoCount>0){
                                return FirstTwoCount < NextTwoCount
                            }
                        }
                        if(FirstTwoCount>0&&NextTwoCount==0)
                        {
                            return false;
                        }
                        if(NextTwoCount>0&&FirstTwoCount==0){
                            return true;
                        }

                        //比较数值
                        for (let i = 0; i < 5; ++i)
                            if (this.GetCardLogicValue(bNextList[i]) != this.GetCardLogicValue(bFirstList[i]))
                                return this.GetCardLogicValue(bNextList[i]) > this.GetCardLogicValue(bFirstList[i]);

                        //比较花色
                        return this.GetCardColor(bNextList[0]) > this.GetCardColor(bFirstList[0]);
                    }

                    case SssDef.CT_FIVE_THREE_DEOUBLE:			//三条一对
                    {
                        //数据验证
                        SssLib.ASSERT(bNextList[NextAnalyseData.bThreeFirst[0]]!=bFirstList[FirstAnalyseData.bThreeFirst[0]]) ;
                        // if(bNextList[NextAnalyseData.bThreeFirst[0]]==bFirstList[FirstAnalyseData.bThreeFirst[0]]) return this.bfalse ;

                        if(this.GetCardLogicValue(bNextList[NextAnalyseData.bThreeFirst[0]])==this.GetCardLogicValue(bFirstList[FirstAnalyseData.bThreeFirst[0]]))
                            return this.GetCardColor(bNextList[NextAnalyseData.bThreeFirst[0]]) > this.GetCardColor(bFirstList[FirstAnalyseData.bThreeFirst[0]]) ;			//比较花色
                        else
                            return this.GetCardLogicValue(bNextList[NextAnalyseData.bThreeFirst[0]]) > this.GetCardLogicValue(bFirstList[FirstAnalyseData.bThreeFirst[0]]); 	//比较数值
                    }

                    case SssDef.CT_FIVE_FOUR_ONE:			//四带一张
                    {
                        //数据验证
                        SssLib.ASSERT(bNextList[NextAnalyseData.bFourFirst[0]]!=bFirstList[FirstAnalyseData.bFourFirst[0]]) ;
                        // if(bNextList[NextAnalyseData.bFourFirst[0]]==bFirstList[FirstAnalyseData.bFourFirst[0]]) return this.bfalse ;

                        if(this.GetCardLogicValue(bNextList[NextAnalyseData.bFourFirst[0]]) == this.GetCardLogicValue(bFirstList[FirstAnalyseData.bFourFirst[0]]))
                            return this.GetCardColor(bNextList[NextAnalyseData.bFourFirst[0]]) > this.GetCardColor(bFirstList[FirstAnalyseData.bFourFirst[0]]) ;			//比较花色
                        else
                            return this.GetCardLogicValue(bNextList[NextAnalyseData.bFourFirst[0]]) > this.GetCardLogicValue(bFirstList[FirstAnalyseData.bFourFirst[0]]) ;	//比较数值

                    }

                    case SssDef.CT_FIVE_STRAIGHT_FLUSH_NO_A:   //没A同花顺
                    case SssDef.CT_FIVE_STRAIGHT_FLUSH_FIRST_A://A在前同花顺
                    case SssDef.CT_FIVE_STRAIGHT_FLUSH_BACK_A: //A在后同花顺
                    {
                        //获得王牌
                        let FirstJokerCount = 0;
                        let NextJokerCount = 0;
                        for (let i = 0; i < 2; i++) {
                            if (this.GetCardLogicValue(bFirstList[i]) == SssDef.CARD_DW || this.GetCardLogicValue(bFirstList[i]) == SssDef.CARD_XW) {
                                FirstJokerCount++;
                            }
                            if (this.GetCardLogicValue(bNextList[i]) == SssDef.CARD_DW || this.GetCardLogicValue(bNextList[i]) == SssDef.CARD_XW) {
                                NextJokerCount++;
                            }
                        }

                        if (FirstJokerCount > 0 || NextJokerCount > 0) {
                            let FirstStraight = true;
                            let NextStraight = true;
                            let FirstTwoValue = false;
                            let NextTwoValue = false;
                            let FirstbigCard = 0;
                            let NextbigCard = 0;
                            for (let i = FirstJokerCount; i < 4; i++) {
                                if (this.GetCardLogicValue(bFirstList[i]) != (this.GetCardLogicValue(bFirstList[i + 1]) + 1)) {
                                    if (this.GetCardLogicValue(bFirstList[i]) - this.GetCardLogicValue(bFirstList[i + 1]) == 3) {
                                        FirstTwoValue == true;
                                    }
                                    FirstStraight = false;
                                }
                            }
                            for (let i = NextJokerCount; i < 4; i++) {
                                if (this.GetCardLogicValue(bNextList[i]) != (this.GetCardLogicValue(bNextList[i + 1]) + 1)) {
                                    if (this.GetCardLogicValue(bNextList[i]) - this.GetCardLogicValue(bNextList[i + 1]) == 3) {
                                        NextTwoValue == true;
                                    }
                                    NextStraight = false;
                                }
                            }
                            if (FirstStraight) {
                                FirstbigCard = this.GetCardLogicValue(bFirstList[FirstJokerCount]) + FirstJokerCount;
                            } else if (!FirstStraight) {
                                if (FirstJokerCount == 2 && !FirstTwoValue) {
                                    FirstbigCard = this.GetCardLogicValue(bFirstList[FirstJokerCount]) + 1;
                                } else {
                                    FirstbigCard = this.GetCardLogicValue(bFirstList[FirstJokerCount]);
                                }
                            }
                            if (NextStraight) {
                                NextbigCard = this.GetCardLogicValue(bNextList[NextJokerCount]) + NextJokerCount;
                            } else if (!NextStraight) {
                                if (NextJokerCount == 2 && !NextTwoValue) {
                                    NextbigCard = this.GetCardLogicValue(bNextList[NextJokerCount]) + 1;
                                } else {
                                    NextbigCard = this.GetCardLogicValue(bNextList[NextJokerCount]);
                                }
                            }
                            if (FirstbigCard == NextbigCard) {
                                return this.GetCardColor(bNextList[2]) > this.GetCardColor(bFirstList[2])
                            }
                            return FirstbigCard < NextbigCard;
                        }
                        //比较数值
                        for (let i = 0; i < 5; i++) {
                            if (this.GetCardLogicValue(bNextList[i]) != this.GetCardLogicValue(bFirstList[i])) {
                                return this.GetCardLogicValue(bNextList[i]) > this.GetCardLogicValue(bFirstList[i]);
                            }
                        }

                        //比较花色
                        return this.GetCardColor(bNextList[0]) > this.GetCardColor(bFirstList[0]);

                  

                    }
                    default:
                        // #ifdef _DEBUG
                        // 				AfxMessageBox("错误扑克类型！") ;
                        // #endif
                        return this.bfalse ;
                }

            }
            else
            {
                //同花顺牌
                // 			if( bNextType==CT_FIVE_STRAIGHT_FLUSH_FIRST_A || bNextType==CT_FIVE_STRAIGHT_FLUSH)
                // 			{
                // 				if(CT_FIVE_STRAIGHT_FLUSH_FIRST_A==bFirstType || CT_FIVE_STRAIGHT_FLUSH==bFirstType)
                // 				{
                // 					if(bNextType!=bFirstType)
                // 						return bNextType > bFirstType ;
                //
                // 					//比较数值
                // 					for(let i=0; i<5; ++i)
                // 						if(this.GetCardLogicValue(bNextList[i]) != this.GetCardLogicValue(bFirstList[i]))
                // 							return this.GetCardLogicValue(bNextList[i]) > this.GetCardLogicValue(bFirstList[i]) ;
                //
                // 					//比较花色
                // 					return this.GetCardColor(bNextList[0]) > this.GetCardColor(bFirstList[0]) ;
                //
                // 				}
                // 			}
                return bNextType>bFirstType ;
            }
        }


        return this.bfalse;
    }

    /*
	*	分析扑克的单张，一对。。。的数目，并记录下每种类型扑克的第一张牌（也就是最大的牌）位置以便比较大小，同时判断同一花色是否有五张
	*/
    //分析扑克
    //分析扑克
    AnalyseCard(  bCardDataList ,  bCardCount ,  AnalyseData)
    {
        //排列扑克
        let bCardData=SssLib.oneDArr(13) ;
        SssLib.CopyMemory(bCardData , bCardDataList , bCardCount) ;
        this.SortCardList(bCardData , bCardCount , this.enDescend) ;

        //变量定义
        let bSameCount = 1 ,	bCardValueTemp=0,	bSameColorCount = 1 ,	bFirstCardIndex = 0 ;	//记录下标

        SssLib.ASSERT(3==bCardCount || 5==bCardCount||13==bCardCount) ;

        //设置结果
        SssLib.memset(AnalyseData,0,SssLib.sizeof(AnalyseData));

        if (((this.GetCardLogicValue(bCardData[0])==SssDef.CARD_DW || this.GetCardLogicValue(bCardData[0]) == SssDef.CARD_XW)) && this.GetCardLogicValue(bCardData[1])<SssDef.CARD_XW)
        {
            let bLogicValue=this.GetCardLogicValue(bCardData[1]);
            let bCardColor = this.GetCardColor(bCardData[1]) ;
            bFirstCardIndex=1;
            //扑克分析
            for(let i =2;i<bCardCount;i++)
            {
                //获取扑克
                bCardValueTemp=this.GetCardLogicValue(bCardData[i]);

                if (bCardValueTemp==bLogicValue) bSameCount++;

                //保存结果
                if ((bCardValueTemp!=bLogicValue)||(i==(bCardCount-1)))
                {
                    switch (bSameCount)
                    {
                        case 1:		//一张
                            break;
                        case 2:		//两张
                        {
                            AnalyseData.bTwoFirst[AnalyseData.bTwoCount]	 = bFirstCardIndex ;
                            AnalyseData.bTwoCount++ ;
                            break;
                        }
                        case 3:		//三张
                        {
                            AnalyseData.bThreeFirst[AnalyseData.bThreeCount] = bFirstCardIndex ;
                            AnalyseData.bThreeCount++ ;
                            break;
                        }
                        case 4:		//四张
                        {
                            AnalyseData.bFourFirst[AnalyseData.bFourCount]   = bFirstCardIndex ;
                            AnalyseData.bFourCount++ ;
                            break;
                        }
                    }
                }

                //设置变量
                if (bCardValueTemp!=bLogicValue)
                {
                    if(bSameCount==1)
                    {
                        if(i!=bCardCount-1)
                        {
                            AnalyseData.bOneFirst[AnalyseData.bOneCount]	= bFirstCardIndex ;
                            AnalyseData.bOneCount++ ;
                        }
                        else
                        {
                            AnalyseData.bOneFirst[AnalyseData.bOneCount]	= bFirstCardIndex ;
                            AnalyseData.bOneCount++ ;
                            AnalyseData.bOneFirst[AnalyseData.bOneCount]	= i ;
                            AnalyseData.bOneCount++ ;
                        }
                    }
                    else
                    {
                        if(i==bCardCount-1)
                        {
                            AnalyseData.bOneFirst[AnalyseData.bOneCount]	= i ;
                            AnalyseData.bOneCount++ ;
                        }
                    }
                    bSameCount=1;
                    bLogicValue=bCardValueTemp;
                    bFirstCardIndex = i ;
                }
                if(this.GetCardColor(bCardData[i])!=bCardColor ) bSameColorCount = 1 ;
                else									   ++bSameColorCount ;
            }

            //是否同花
            AnalyseData.bStraight = ((bCardCount-1)==bSameColorCount) ? this.btrue : this.bfalse ;

            //开始分析
            switch (bCardCount)
            {
                case 3:	//三条类型
                {

                    //如果有一个对子的话 剩下一个王正好组成三条
                    if(AnalyseData.bTwoCount ==1){ AnalyseData.bTwoCount=0; AnalyseData.bThreeCount =1;AnalyseData.bThreeFirst[0]=AnalyseData.bTwoFirst[0];}
                    //如果两张都是单牌的话就组成一个对子
                    if(AnalyseData.bOneCount == 2)
                    {
                        AnalyseData.bOneCount=1;
                        AnalyseData.bTwoCount=1;
                        AnalyseData.bTwoFirst[0]=AnalyseData.bOneFirst[0];
                        AnalyseData.bOneFirst[0]=AnalyseData.bOneFirst[1];
                    }
                    return ;
                }
                case 5:	//五张牌型
                {
                    //把四带一变成五相
                    if (AnalyseData.bFourCount==1)
                    {
                        AnalyseData.bFourCount = 0;
                        AnalyseData.bFiveCount =1;
                        AnalyseData.bFiveFirst[0] = AnalyseData.bFourFirst[0];
                    }
                    //把三带一变成4带1
                    if (AnalyseData.bThreeCount==1 && AnalyseData.bOneCount==1)
                    {
                        AnalyseData.bThreeCount=0;
                        AnalyseData.bFourCount=1;
                        AnalyseData.bFourFirst[0]=AnalyseData.bThreeFirst[0];
                    }//把两队改三条一对
                    else if(AnalyseData.bTwoCount==2)
                    {
                        AnalyseData.bTwoCount=1;
                        AnalyseData.bThreeCount=1;
                        AnalyseData.bThreeFirst[0]=AnalyseData.bTwoFirst[0];
                        AnalyseData.bTwoFirst[0]=AnalyseData.bTwoFirst[1];
                    }//一对两单改成三条带单
                    else if (AnalyseData.bTwoCount==1 && AnalyseData.bOneCount ==2 )
                    {
                        AnalyseData.bTwoCount=0;
                        AnalyseData.bThreeCount=1;
                        AnalyseData.bThreeFirst[0]=AnalyseData.bTwoFirst[0];

                    }
                    else if (AnalyseData.bOneCount==4 )
                    {
                        AnalyseData.bOneCount=3;
                        AnalyseData.bTwoFirst[0]=AnalyseData.bOneFirst[0];
                        AnalyseData.bOneFirst[0]=AnalyseData.bOneFirst[1];
                        AnalyseData.bOneFirst[1]=AnalyseData.bOneFirst[2];
                        AnalyseData.bOneFirst[2]=AnalyseData.bOneFirst[3];
                        AnalyseData.bTwoCount=1;
                    }
                    return;
                }
                case 13://13张特殊牌型
                {
                    //除了一张大小王  还有12张牌
                    //12张  改成  13水
                    if(AnalyseData.bOneCount==12)
                    {
                        AnalyseData.bOneFirst[AnalyseData.bOneCount++]=0;
                    }
                    ///////////////////////////////三个炸弹///////////////////////////////
                    if(AnalyseData.bFourCount==2 && AnalyseData.bThreeCount==1)
                    {
                        AnalyseData.bFourFirst[AnalyseData.bFourCount++]=AnalyseData.bThreeFirst[--AnalyseData.bThreeCount];
                    }
                    ///////////////////////////////四套冲三/////////////////////////////////
                    if(AnalyseData.bThreeCount==3 && AnalyseData.bTwoCount==1&&AnalyseData.bOneCount==1)
                    {
                        AnalyseData.bThreeFirst[AnalyseData.bThreeCount++]=AnalyseData.bTwoFirst[--AnalyseData.bTwoCount];
                    }
                    ///////////////////////////////五对冲三/////////////////////////////////
                    if (AnalyseData.bTwoCount == 6)
                    {
                        AnalyseData.bThreeFirst[AnalyseData.bThreeCount++] = AnalyseData.bTwoFirst[--AnalyseData.bTwoCount];
                    }

                    if (AnalyseData.bTwoCount == 4 && AnalyseData.bThreeCount == 1 )
                    {
                        AnalyseData.bTwoFirst[AnalyseData.bTwoCount++]=AnalyseData.bOneFirst[--AnalyseData.bOneCount];
                    }
                    if (AnalyseData.bTwoCount == 3 && AnalyseData.bThreeCount ==2 )
                    {
                        AnalyseData.bFourFirst[AnalyseData.bFourCount++]=AnalyseData.bThreeFirst[--AnalyseData.bThreeCount];
                    }
                    if (AnalyseData.bTwoCount == 2 && AnalyseData.bFourCount ==1 && AnalyseData.bThreeCount ==1)
                    {
                        AnalyseData.bTwoFirst[AnalyseData.bTwoCount++]=AnalyseData.bOneFirst[--AnalyseData.bOneCount];
                    }
                    if( AnalyseData.bTwoCount == 2 && AnalyseData.bFourCount== 2 )
                    {
                        AnalyseData.bThreeFirst[AnalyseData.bThreeCount++]=AnalyseData.bTwoFirst[--AnalyseData.bTwoCount];
                    }
                    if(AnalyseData.bFourCount == 2 && AnalyseData.bThreeCount == 1)
                    {
                        AnalyseData.bTwoFirst[AnalyseData.bTwoCount++]=AnalyseData.bOneFirst[--AnalyseData.bOneCount];
                    }
                    ///////////////////////////////六对半  /////////////////////////////////
                    if (AnalyseData.bTwoCount == 5 && AnalyseData.bOneCount == 2)
                    {
                        AnalyseData.bTwoFirst[AnalyseData.bTwoCount++]=AnalyseData.bOneFirst[--AnalyseData.bOneCount];
                    }

                    if (AnalyseData.bTwoCount ==1 && AnalyseData.bFourCount == 2)
                    {
                        AnalyseData.bTwoFirst[AnalyseData.bTwoCount++]=AnalyseData.bOneFirst[--AnalyseData.bOneCount];
                    }
                }
            }

        }
        else if (this.GetCardLogicValue(bCardData[0])==SssDef.CARD_DW && this.GetCardLogicValue(bCardData[1]) == SssDef.CARD_XW)
        {
            let bLogicValue=this.GetCardLogicValue(bCardData[2]);
            let bCardColor = this.GetCardColor(bCardData[2]) ;
            bFirstCardIndex=2;
            if(bCardCount==3){
                AnalyseData.bOneCount++
            }
            //扑克分析
            for(let i =3;i<bCardCount;i++)
            {
                //获取扑克
                bCardValueTemp=this.GetCardLogicValue(bCardData[i]);

                if (bCardValueTemp==bLogicValue) bSameCount++;

                //保存结果
                if ((bCardValueTemp!=bLogicValue)||(i==(bCardCount-1)))
                {
                    switch (bSameCount)
                    {
                        case 1:		//一张
                            break;
                        case 2:		//两张
                        {
                            AnalyseData.bTwoFirst[AnalyseData.bTwoCount]	 = bFirstCardIndex ;
                            AnalyseData.bTwoCount++ ;
                            break;
                        }
                        case 3:		//三张
                        {
                            AnalyseData.bThreeFirst[AnalyseData.bThreeCount] = bFirstCardIndex ;
                            AnalyseData.bThreeCount++ ;
                            break;
                        }
                        case 4:		//四张
                        {
                            AnalyseData.bFourFirst[AnalyseData.bFourCount]   = bFirstCardIndex ;
                            AnalyseData.bFourCount++ ;
                            break;
                        }
                    }
                }

                //设置变量
                if (bCardValueTemp!=bLogicValue)
                {
                    if(bSameCount==1)
                    {
                        if(i!=bCardCount-1)
                        {
                            AnalyseData.bOneFirst[AnalyseData.bOneCount]	= bFirstCardIndex ;
                            AnalyseData.bOneCount++ ;
                        }
                        else
                        {
                            AnalyseData.bOneFirst[AnalyseData.bOneCount]	= bFirstCardIndex ;
                            AnalyseData.bOneCount++ ;
                            AnalyseData.bOneFirst[AnalyseData.bOneCount]	= i ;
                            AnalyseData.bOneCount++ ;
                        }
                    }
                    else
                    {
                        if(i==bCardCount-1)
                        {
                            AnalyseData.bOneFirst[AnalyseData.bOneCount]	= i ;
                            AnalyseData.bOneCount++ ;
                        }
                    }
                    bSameCount=1;
                    bLogicValue=bCardValueTemp;
                    bFirstCardIndex = i ;
                }
                if(this.GetCardColor(bCardData[i])!=bCardColor ) bSameColorCount = 1 ;
                else									   ++bSameColorCount ;
            }

            //是否同花
            AnalyseData.bStraight = ((bCardCount-2)==bSameColorCount) ? this.btrue : this.bfalse ;

            //开始分析
            switch (bCardCount)
            {
                case 3:	//三条类型
                {
                    //一共就三张牌	大小王两张 就剩下一张了 组成个三条吧
                    if(AnalyseData.bOneCount ==1)
                    {
                        AnalyseData.bOneCount=0;
                        AnalyseData.bThreeCount =1;
                        AnalyseData.bThreeFirst[0]=AnalyseData.bOneFirst[0];
                    }
                    return ;
                }
                case 5:	//五张牌型
                {
                    /////////////////一共就5张牌 大小王两张  剩下三张了/////////////////////////////
                    //这三张是三条的话 就只能组成 五相
                    if(AnalyseData.bThreeCount==1)
                    {
                        AnalyseData.bThreeCount=0;
                        AnalyseData.bFiveCount=1;
                        AnalyseData.bFiveFirst[0]=AnalyseData.bThreeFirst[0];
                    }
                    else if(AnalyseData.bTwoCount==1 && AnalyseData.bOneCount==1)
                    {
                        AnalyseData.bTwoCount=0;
                        AnalyseData.bFourCount=1;
                        AnalyseData.bFourFirst[0]=AnalyseData.bTwoFirst[0];
                    }//这三张是单牌 就组成三带二
                    else if (AnalyseData.bOneCount==3)
                    {
                        AnalyseData.bOneCount=2;
                        AnalyseData.bThreeCount=1;
                        AnalyseData.bThreeFirst[0]=AnalyseData.bOneFirst[0];
                        AnalyseData.bOneFirst[0]=AnalyseData.bOneFirst[1];
                        AnalyseData.bOneFirst[1]=AnalyseData.bOneFirst[2];
                        AnalyseData.bOneFirst[2]=AnalyseData.bOneFirst[3];
                    }
                    return;
                }
                case 13://13张特殊牌型
                {
                    //11张改成13水
                    if (AnalyseData.bOneCount==11)
                    {
                        AnalyseData.bOneFirst[AnalyseData.bOneCount++]=0;
                        AnalyseData.bOneFirst[AnalyseData.bOneCount++]=1;
                    }
                    ///////////////////////////////三个炸弹///////////////////////////////

                    if (AnalyseData.bFourCount==2&& AnalyseData.bThreeCount==1) //2个4张+1个3张
                    {
                        AnalyseData.bFourFirst[AnalyseData.bFourCount++]=AnalyseData.bThreeFirst[--AnalyseData.bThreeCount];
                    }

                    if (AnalyseData.bFourCount==2&& AnalyseData.bTwoCount==1)//2个4张+1个2张+1个1张
                    {
                        AnalyseData.bFourFirst[AnalyseData.bFourCount++]=AnalyseData.bTwoFirst[--AnalyseData.bTwoCount];
                    }

                    if (AnalyseData.bFourCount==1&& AnalyseData.bThreeCount==2)//1个4张+2个3张
                    {
                        AnalyseData.bFourFirst[AnalyseData.bFourCount++]=AnalyseData.bThreeFirst[--AnalyseData.bThreeCount];
                        AnalyseData.bFourFirst[AnalyseData.bFourCount++]=AnalyseData.bThreeFirst[--AnalyseData.bThreeCount];
                    }

                    ///////////////////////////////四套冲三///////////////////////////////// 4个3张
                    if(AnalyseData.bThreeCount==3 && AnalyseData.bTwoCount==1)//3个3张+1个2张
                    {
                        AnalyseData.bThreeFirst[AnalyseData.bThreeCount++]=AnalyseData.bTwoFirst[--AnalyseData.bTwoCount];
                    }

                    if(AnalyseData.bThreeCount==3 && AnalyseData.bOneCount==2)//3个3张+2个1张
                    {
                        AnalyseData.bThreeFirst[AnalyseData.bThreeCount++]=AnalyseData.bOneFirst[--AnalyseData.bOneCount];
                    }

                    if(AnalyseData.bThreeCount==2 && AnalyseData.bTwoCount==2)//2个3张+2个2张
                    {
                        AnalyseData.bThreeFirst[AnalyseData.bThreeCount++]=AnalyseData.bTwoFirst[--AnalyseData.bTwoCount];
                        AnalyseData.bThreeFirst[AnalyseData.bThreeCount++]=AnalyseData.bTwoFirst[--AnalyseData.bTwoCount];
                    }

                    ///////////////////////////////五对冲三/////////////////////////////////
                    if (AnalyseData.bTwoCount == 5 && AnalyseData.bOneCount ==1)
                    {
                        AnalyseData.bThreeFirst[AnalyseData.bThreeCount++] = AnalyseData.bOneFirst[--AnalyseData.bOneCount];
                    }

                    if (AnalyseData.bTwoCount== 4 && AnalyseData.bThreeCount==1)
                    {
                        AnalyseData.bTwoFirst[AnalyseData.bTwoCount++] = 0;
                    }

                    if (AnalyseData.bTwoCount == 3 && AnalyseData.bThreeCount ==1)
                    {
                        AnalyseData.bTwoFirst[AnalyseData.bTwoCount++]=AnalyseData.bOneFirst[--AnalyseData.bOneCount];
                        AnalyseData.bTwoFirst[AnalyseData.bTwoCount++]=AnalyseData.bOneFirst[--AnalyseData.bOneCount];
                    }

                    if (AnalyseData.bTwoCount == 2 && AnalyseData.bThreeCount ==2)
                    {
                        AnalyseData.bTwoFirst[AnalyseData.bTwoCount++]=AnalyseData.bOneFirst[--AnalyseData.bOneCount];
                        AnalyseData.bFourFirst[AnalyseData.bFourCount++]=AnalyseData.bThreeFirst[--AnalyseData.bThreeCount];
                    }

                    if(AnalyseData.bTwoCount ==2 && AnalyseData.bFourCount ==1 && AnalyseData.bThreeCount==1)
                    {
                        AnalyseData.bTwoFirst[AnalyseData.bTwoCount++]=0;
                    }

                    if ((AnalyseData.bTwoCount== 3 && AnalyseData.bFourCount==1)
                        ||(AnalyseData.bTwoCount ==1 && AnalyseData.bFourCount ==2))
                    {
                        AnalyseData.bThreeFirst[AnalyseData.bThreeCount++] = AnalyseData.bOneFirst[--AnalyseData.bOneCount];
                    }

                    ///////////////////////////////六对半  /////////////////////////////////
                    if ((AnalyseData.bTwoCount == 4 && AnalyseData.bOneCount == 3)
                        ||(AnalyseData.bFourCount == 2 && AnalyseData.bOneCount == 3))
                    {
                        AnalyseData.bTwoFirst[AnalyseData.bTwoCount++]=AnalyseData.bOneFirst[--AnalyseData.bOneCount];
                        AnalyseData.bTwoFirst[AnalyseData.bTwoCount++]=AnalyseData.bOneFirst[--AnalyseData.bOneCount];
                    }
                }
            }
        }
        else
        {
            let bLogicValue=this.GetCardLogicValue(bCardData[0]);
            let bCardColor = this.GetCardColor(bCardData[0]) ;
            //扑克分析
            for(let i =1;i<bCardCount;i++)
            {
                //获取扑克
                bCardValueTemp=this.GetCardLogicValue(bCardData[i]);

                if (bCardValueTemp==bLogicValue ) bSameCount++;

                //保存结果
                if ((bCardValueTemp!=bLogicValue)||(i==(bCardCount-1)))
                {
                    switch (bSameCount)
                    {
                        case 1:		//一张
                            break;
                        case 2:		//两张
                        {
                            AnalyseData.bTwoFirst[AnalyseData.bTwoCount]	 = bFirstCardIndex ;
                            AnalyseData.bTwoCount++ ;
                            break;
                        }
                        case 3:		//三张
                        {
                            AnalyseData.bThreeFirst[AnalyseData.bThreeCount] = bFirstCardIndex ;
                            AnalyseData.bThreeCount++ ;
                            break;
                        }
                        case 4:		//四张
                        {
                            AnalyseData.bFourFirst[AnalyseData.bFourCount]   = bFirstCardIndex ;
                            AnalyseData.bFourCount++ ;
                            break;
                        }
                        case 5:    //五张
                        {
                            AnalyseData.bFiveFirst[AnalyseData.bFiveCount]   = bFirstCardIndex ;
                            AnalyseData.bFiveCount++ ;
                            break;
                        }
                    }
                }

                //设置变量
                if (bCardValueTemp!=bLogicValue)
                {
                    if(bSameCount==1)
                    {
                        if(i!=bCardCount-1)
                        {
                            AnalyseData.bOneFirst[AnalyseData.bOneCount]	= bFirstCardIndex ;
                            AnalyseData.bOneCount++ ;
                        }
                        else
                        {
                            AnalyseData.bOneFirst[AnalyseData.bOneCount]	= bFirstCardIndex ;
                            AnalyseData.bOneCount++ ;
                            AnalyseData.bOneFirst[AnalyseData.bOneCount]	= i ;
                            AnalyseData.bOneCount++ ;
                        }
                    }
                    else
                    {
                        if(i==bCardCount-1)
                        {
                            AnalyseData.bOneFirst[AnalyseData.bOneCount]	= i ;
                            AnalyseData.bOneCount++ ;
                        }
                    }
                    bSameCount=1;
                    bLogicValue=bCardValueTemp;
                    bFirstCardIndex = i ;
                }
                if(this.GetCardColor(bCardData[i])!= bCardColor ) bSameColorCount = 1 ;
                else									   ++bSameColorCount ;
            }

            //是否同花
            AnalyseData.bStraight = (bCardCount==bSameColorCount) ? this.btrue : this.bfalse ;

        }


        return;
    }

    //分析扑克
    AnalysebCardData( cbCardData ,   cbCardCount,   AnalyseResult)
    {
        //设置结果
        SssLib.ZeroMemory(AnalyseResult,SssLib.sizeof(AnalyseResult));

        //扑克分析
        for(let i =0;i<cbCardCount;i++)
        {
            //变量定义
            let cbSameCount=1,cbCardValueTemp=0;
            let cbLogicValue=this.GetCardLogicValue(cbCardData[i]);

            //搜索同牌
            for (let j=i+1;j<cbCardCount;j++)
            {
                //获取扑克
                if (this.GetCardLogicValue(cbCardData[j])!=cbLogicValue) break;

                //设置变量
                cbSameCount++;
            }

            //设置结果
            switch (cbSameCount)
            {
                case 1:		//单张
                {
                    let cbIndex=AnalyseResult.cbSignedCount++;
                    AnalyseResult.cbSignedCardData[cbIndex*cbSameCount]=cbCardData[i];
                    break;
                }
                case 2:		//两张
                {
                    let cbIndex=AnalyseResult.cbDoubleCount++;
                    AnalyseResult.cbDoubleCardData[cbIndex*cbSameCount]=cbCardData[i];
                    AnalyseResult.cbDoubleCardData[cbIndex*cbSameCount+1]=cbCardData[i+1];
                    break;
                }
                case 3:		//三张
                {
                    let cbIndex=AnalyseResult.cbThreeCount++;
                    AnalyseResult.cbThreeCardData[cbIndex*cbSameCount]=cbCardData[i];
                    AnalyseResult.cbThreeCardData[cbIndex*cbSameCount+1]=cbCardData[i+1];
                    AnalyseResult.cbThreeCardData[cbIndex*cbSameCount+2]=cbCardData[i+2];
                    break;
                }
                case 4:		//四张
                {
                    let cbIndex=AnalyseResult.cbFourCount++;
                    AnalyseResult.cbFourCardData[cbIndex*cbSameCount]=cbCardData[i];
                    AnalyseResult.cbFourCardData[cbIndex*cbSameCount+1]=cbCardData[i+1];
                    AnalyseResult.cbFourCardData[cbIndex*cbSameCount+2]=cbCardData[i+2];
                    AnalyseResult.cbFourCardData[cbIndex*cbSameCount+3]=cbCardData[i+3];
                    break;
                }
            }

            //设置索引
            i+=cbSameCount-1;
        }

        return;
    }

    GetType(   bCardData ,   bCardCount )
    {
        let Type=new tagAnalyseType();
        SssLib.ZeroMemory(Type,SssLib.sizeof(Type));
        if(bCardCount==0)
        {
            SssLib.ZeroMemory(Type,SssLib.sizeof(Type));
            return Type;
        }
        //排列扑克
        let CardData=SssLib.oneDArr(13) ;
        SssLib.CopyMemory(CardData , bCardData , bCardCount) ;
        this.SortCardList(CardData , bCardCount , this.enDescend) ;

        let Index=SssLib.oneDArr(13);
        let Number=0;
        let SameValueCount=1;

        let Num=SssLib.oneDArr(9);
        if (this.GetCardLogicValue(CardData[0]) >=SssDef.CARD_XW && this.GetCardLogicValue(CardData[1]) <SssDef.CARD_XW)
        {
            //判断数值相同的牌
            let bLogicValue=this.GetCardLogicValue(CardData[1]);
            Index[Number++]=1;
            for(let i=2;i<bCardCount;i++)
            {
                if(bLogicValue==this.GetCardLogicValue(CardData[i]))
                {
                    SameValueCount++;
                    Index[Number++]=i;
                }
                if( bLogicValue!=this.GetCardLogicValue(CardData[i])||i==bCardCount-1)
                {
                    if(SameValueCount==1)
                    {
                        Type.bOnePare=this.btrue;
                        Type.cbOnePare[Num[0]++]=Index[SameValueCount-1];
                        Type.cbOnePare[Num[0]++]=0;
                        Type.btOnePare++;
                    }
                    else if(SameValueCount==2)
                    {
                        Type.bOnePare=this.btrue;
                        Type.cbOnePare[Num[0]++]=Index[SameValueCount-2];
                        Type.cbOnePare[Num[0]++]=Index[SameValueCount-1];
                        Type.btOnePare++;
                        Type.bThreeSame=this.btrue;
                        Type.cbThreeSame[Num[2]++]=Index[SameValueCount-2];
                        Type.cbThreeSame[Num[2]++]=Index[SameValueCount-1];
                        Type.cbThreeSame[Num[2]++]=0;
                        Type.btThreeSame++;
                        //printf("%d,%d  ",Index[0],Index[1]);
                    }
                    else if(SameValueCount==3)
                    {
                        Type.bOnePare=this.btrue;
                        Type.cbOnePare[Num[0]++]=Index[SameValueCount-3];
                        Type.cbOnePare[Num[0]++]=Index[SameValueCount-2];
                        //printf("%d,%d  ",Index[0],Index[1]);
                        Type.bThreeSame=this.btrue;
                        Type.cbThreeSame[Num[2]++]=Index[SameValueCount-3];
                        Type.cbThreeSame[Num[2]++]=Index[SameValueCount-2];
                        Type.cbThreeSame[Num[2]++]=Index[SameValueCount-1];
                        Type.btThreeSame++;
                        Type.bFourSame=this.btrue;
                        Type.cbFourSame[Num[6]++]=Index[SameValueCount-3];
                        Type.cbFourSame[Num[6]++]=Index[SameValueCount-2];
                        Type.cbFourSame[Num[6]++]=Index[SameValueCount-1];
                        Type.cbFourSame[Num[6]++]=0;
                        Type.btFourSame++;
                    }
                    else if(SameValueCount>=4)
                    {
                        Type.bOnePare=this.btrue;
                        Type.cbOnePare[Num[0]++]=Index[SameValueCount-4];
                        Type.cbOnePare[Num[0]++]=Index[SameValueCount-3];
                        Type.btOnePare++;
                        //printf("%d,%d  ",Index[0],Index[1]);
                        Type.bThreeSame=this.btrue;
                        Type.cbThreeSame[Num[2]++]=Index[SameValueCount-4];
                        Type.cbThreeSame[Num[2]++]=Index[SameValueCount-3];
                        Type.cbThreeSame[Num[2]++]=Index[SameValueCount-2];
                        Type.btThreeSame++;

                        Type.bFourSame=this.btrue;
                        Type.cbFourSame[Num[6]++]=Index[SameValueCount-4];
                        Type.cbFourSame[Num[6]++]=Index[SameValueCount-3];
                        Type.cbFourSame[Num[6]++]=Index[SameValueCount-2];
                        Type.cbFourSame[Num[6]++]=Index[SameValueCount-1];
                        Type.btFourSame++;

                        Type.bFiveSame = this.btrue;
                        Type.cbFiveSame[Num[8]++] = Index[SameValueCount-4];
                        Type.cbFiveSame[Num[8]++] =	Index[SameValueCount-3];
                        Type.cbFiveSame[Num[8]++] =	Index[SameValueCount-2];
                        Type.cbFiveSame[Num[8]++] =	Index[SameValueCount-1];
                        Type.cbFiveSame[Num[8]++] = 0;
                        Type.btFiveSame++;
                        if(SameValueCount>4){
                            Type.cbFiveSame[Num[8]++] = Index[SameValueCount-5];
                            Type.cbFiveSame[Num[8]++] = Index[SameValueCount-4];
                            Type.cbFiveSame[Num[8]++] = Index[SameValueCount-3];
                            Type.cbFiveSame[Num[8]++] = Index[SameValueCount-2];
                            Type.cbFiveSame[Num[8]++] = Index[SameValueCount-1];
                            Type.btFiveSame++;
                        }
                    }
                    Number=0;
                    SssLib.ZeroMemory(Index,SssLib.sizeof(Index));
                    // Index[Number++]=i;
                    if(i<bCardCount-1){
                        Index[Number++]=i;
                    }else{
                        Type.cbOnePare[Num[0]++]=i++; 
                    }
                    SameValueCount=1;
                    bLogicValue=this.GetCardLogicValue(CardData[i]);
                }

            }
        }
        else if (this.GetCardLogicValue(CardData[0]) ==SssDef.CARD_DW && this.GetCardLogicValue(CardData[1]) ==SssDef.CARD_XW)
        {
            //判断数值相同的牌
            let bLogicValue=this.GetCardLogicValue(CardData[2]);
            Index[Number++]=2;
            for(let i=3;i<bCardCount;i++)
            {
                if(bLogicValue==this.GetCardLogicValue(CardData[i]))
                {
                    SameValueCount++;
                    Index[Number++]=i;
                }
                if( bLogicValue!=this.GetCardLogicValue(CardData[i])||i==bCardCount-1)
                {
                    if(SameValueCount==1)
                    {
                        Type.bOnePare=this.btrue;
                        Type.cbOnePare[Num[0]++]=Index[SameValueCount-1];
                        Type.cbOnePare[Num[0]++]=0;
                        Type.btOnePare++;
                        /*Type.bThreeSame=this.btrue;
						Type.cbThreeSame[Num[2]++]=Index[SameValueCount-1];
						Type.cbThreeSame[Num[2]++]=0;
						Type.cbThreeSame[Num[2]++]=1;
						Type.btThreeSame++;*/
                    }
                    else if(SameValueCount==2)
                    {
                        Type.bOnePare=this.btrue;
                        Type.cbOnePare[Num[0]++]=Index[SameValueCount-2];
                        Type.cbOnePare[Num[0]++]=Index[SameValueCount-1];
                        Type.btOnePare++;
                        //printf("%d,%d  ",Index[0],Index[1]);
                        Type.bThreeSame=this.btrue;
                        Type.cbThreeSame[Num[2]++]=Index[SameValueCount-2];
                        Type.cbThreeSame[Num[2]++]=Index[SameValueCount-1];
                        Type.cbThreeSame[Num[2]++]=0;
                        Type.btThreeSame++;
                        Type.bFourSame=this.btrue;
                        Type.cbFourSame[Num[6]++]=Index[SameValueCount-2];
                        Type.cbFourSame[Num[6]++]=Index[SameValueCount-1];
                        Type.cbFourSame[Num[6]++]=0;
                        Type.cbFourSame[Num[6]++]=1;
                        Type.btFourSame++;
                    }
                    else if(SameValueCount==3)
                    {
                        Type.bOnePare=this.btrue;
                        Type.cbOnePare[Num[0]++]=Index[SameValueCount-3];
                        Type.cbOnePare[Num[0]++]=Index[SameValueCount-2];
                        Type.btOnePare++;
                        //printf("%d,%d  ",Index[0],Index[1]);
                        Type.bThreeSame=this.btrue;
                        Type.cbThreeSame[Num[2]++]=Index[SameValueCount-3];
                        Type.cbThreeSame[Num[2]++]=Index[SameValueCount-2];
                        Type.cbThreeSame[Num[2]++]=Index[SameValueCount-1];
                        Type.btThreeSame++;
                        
                        Type.bFourSame=this.btrue;
                        Type.cbFourSame[Num[6]++]=Index[SameValueCount-3];
                        Type.cbFourSame[Num[6]++]=Index[SameValueCount-2];
                        Type.cbFourSame[Num[6]++]=Index[SameValueCount-1];
                        Type.cbFourSame[Num[6]++]=0;
                        Type.btFourSame++;

                        Type.bFiveSame = this.btrue;
                        Type.cbFiveSame[Num[8]++] =	Index[SameValueCount-3];
                        Type.cbFiveSame[Num[8]++] =	Index[SameValueCount-2];
                        Type.cbFiveSame[Num[8]++] =	Index[SameValueCount-1];
                        Type.cbFiveSame[Num[8]++] = 0;
                        Type.cbFiveSame[Num[8]++] = 1;
                        Type.btFiveSame++;
                    }
                    else if(SameValueCount==4)
                    {
                        Type.bOnePare=this.btrue;
                        Type.cbOnePare[Num[0]++]=Index[SameValueCount-4];
                        Type.cbOnePare[Num[0]++]=Index[SameValueCount-3];
                        Type.btOnePare++;
                        //printf("%d,%d  ",Index[0],Index[1]);
                        Type.bThreeSame=this.btrue;
                        Type.cbThreeSame[Num[2]++]=Index[SameValueCount-4];
                        Type.cbThreeSame[Num[2]++]=Index[SameValueCount-3];
                        Type.cbThreeSame[Num[2]++]=Index[SameValueCount-2];
                        Type.btThreeSame++;

                        Type.bFourSame=this.btrue;
                        Type.cbFourSame[Num[6]++]=Index[SameValueCount-4];
                        Type.cbFourSame[Num[6]++]=Index[SameValueCount-3];
                        Type.cbFourSame[Num[6]++]=Index[SameValueCount-2];
                        Type.cbFourSame[Num[6]++]=Index[SameValueCount-1];
                        Type.btFourSame++;

                        Type.bFiveSame = this.btrue;
                        Type.cbFiveSame[Num[8]++] = Index[SameValueCount-4];
                        Type.cbFiveSame[Num[8]++] =	Index[SameValueCount-3];
                        Type.cbFiveSame[Num[8]++] =	Index[SameValueCount-2];
                        Type.cbFiveSame[Num[8]++] =	Index[SameValueCount-1];
                        Type.cbFiveSame[Num[8]++] = 0;
                        Type.btFiveSame++;
                    }
                    else if (SameValueCount > 4)
                    {
                        Type.bOnePare=this.btrue;
                        Type.cbOnePare[Num[0]++]=Index[SameValueCount-4];
                        Type.cbOnePare[Num[0]++]=Index[SameValueCount-3];
                        Type.btOnePare++;
                        //printf("%d,%d  ",Index[0],Index[1]);
                        Type.bThreeSame=this.btrue;
                        Type.cbThreeSame[Num[2]++]=Index[SameValueCount-4];
                        Type.cbThreeSame[Num[2]++]=Index[SameValueCount-3];
                        Type.cbThreeSame[Num[2]++]=Index[SameValueCount-2];
                        Type.btThreeSame++;

                        Type.bFourSame=this.btrue;
                        Type.cbFourSame[Num[6]++]=Index[SameValueCount-4];
                        Type.cbFourSame[Num[6]++]=Index[SameValueCount-3];
                        Type.cbFourSame[Num[6]++]=Index[SameValueCount-2];
                        Type.cbFourSame[Num[6]++]=Index[SameValueCount-1];
                        Type.btFourSame++;

                        Type.bFiveSame = this.btrue;
                        Type.cbFiveSame[Num[8]++] = Index[SameValueCount-5];
                        Type.cbFiveSame[Num[8]++] = Index[SameValueCount-4];
                        Type.cbFiveSame[Num[8]++] = Index[SameValueCount-3];
                        Type.cbFiveSame[Num[8]++] = Index[SameValueCount-2];
                        Type.cbFiveSame[Num[8]++] = Index[SameValueCount-1];;
                        Type.btFiveSame++;
                        Type.cbFiveSame[Num[8]++] = Index[SameValueCount-4];
                        Type.cbFiveSame[Num[8]++] = Index[SameValueCount-3];
                        Type.cbFiveSame[Num[8]++] = Index[SameValueCount-2];
                        Type.cbFiveSame[Num[8]++] = Index[SameValueCount-1];
                        Type.cbFiveSame[Num[8]++] = 0;
                        Type.btFiveSame++;
                    }
                    Number=0;
                    SssLib.ZeroMemory(Index,SssLib.sizeof(Index));
                    // Index[Number++]=i;
                    if(i<bCardCount-1){
                        Index[Number++]=i;
                    }else{
                        Type.cbOnePare[Num[0]++]=i++; 
                    }
                    SameValueCount=1;
                    bLogicValue=this.GetCardLogicValue(CardData[i]);
                }

            }
        }
        else
        {
            //判断数值相同的牌
            let bLogicValue=this.GetCardLogicValue(CardData[0]);
            Index[Number++]=0;
            for(let i=1;i<bCardCount;i++)
            {
                if(bLogicValue==this.GetCardLogicValue(CardData[i]))
                {
                    SameValueCount++;
                    Index[Number++]=i;
                }
                if(bLogicValue!=this.GetCardLogicValue(CardData[i])||i==bCardCount-1)
                {
                    if(SameValueCount==1)
                    {

                    }
                    else if(SameValueCount==2)
                    {
                        Type.bOnePare=this.btrue;
                        Type.cbOnePare[Num[0]++]=Index[SameValueCount-2];
                        Type.cbOnePare[Num[0]++]=Index[SameValueCount-1];
                        Type.btOnePare++;
                        //printf("%d,%d  ",Index[0],Index[1]);
                    }
                    else if(SameValueCount==3)
                    {
                        Type.bOnePare=this.btrue;
                        Type.cbOnePare[Num[0]++]=Index[SameValueCount-3];
                        Type.cbOnePare[Num[0]++]=Index[SameValueCount-2];
                        //printf("%d,%d  ",Index[0],Index[1]);
                        Type.bThreeSame=this.btrue;
                        Type.cbThreeSame[Num[2]++]=Index[SameValueCount-3];
                        Type.cbThreeSame[Num[2]++]=Index[SameValueCount-2];
                        Type.cbThreeSame[Num[2]++]=Index[SameValueCount-1];
                        Type.btThreeSame++;
                    }
                    else if(SameValueCount==4)
                    {
                        Type.bOnePare=this.btrue;
                        Type.cbOnePare[Num[0]++]=Index[SameValueCount-4];
                        Type.cbOnePare[Num[0]++]=Index[SameValueCount-3];
                        Type.btOnePare++;
                        //printf("%d,%d  ",Index[0],Index[1]);
                        Type.bThreeSame=this.btrue;
                        Type.cbThreeSame[Num[2]++]=Index[SameValueCount-4];
                        Type.cbThreeSame[Num[2]++]=Index[SameValueCount-3];
                        Type.cbThreeSame[Num[2]++]=Index[SameValueCount-2];
                        Type.btThreeSame++;

                        Type.bFourSame=this.btrue;
                        Type.cbFourSame[Num[6]++]=Index[SameValueCount-4];
                        Type.cbFourSame[Num[6]++]=Index[SameValueCount-3];
                        Type.cbFourSame[Num[6]++]=Index[SameValueCount-2];
                        Type.cbFourSame[Num[6]++]=Index[SameValueCount-1];
                        Type.btFourSame++;
                    }
                    else if(SameValueCount>4){
                        Type.bOnePare=this.btrue;
                        Type.cbOnePare[Num[0]++]=Index[SameValueCount-5];
                        Type.cbOnePare[Num[0]++]=Index[SameValueCount-4];
                        Type.btOnePare++;
                        //printf("%d,%d  ",Index[0],Index[1]);
                        Type.bThreeSame=this.btrue;
                        Type.cbThreeSame[Num[2]++]=Index[SameValueCount-5];
                        Type.cbThreeSame[Num[2]++]=Index[SameValueCount-4];
                        Type.cbThreeSame[Num[2]++]=Index[SameValueCount-3];
                        Type.btThreeSame++;

                        Type.bFourSame=this.btrue;
                        Type.cbFourSame[Num[6]++]=Index[SameValueCount-5];
                        Type.cbFourSame[Num[6]++]=Index[SameValueCount-4];
                        Type.cbFourSame[Num[6]++]=Index[SameValueCount-3];
                        Type.cbFourSame[Num[6]++]=Index[SameValueCount-2];
                        Type.btFourSame++;

                        Type.bFiveSame = this.btrue;
                        Type.cbFiveSame[Num[8]++] = Index[SameValueCount-5];
                        Type.cbFiveSame[Num[8]++] = Index[SameValueCount-4];
                        Type.cbFiveSame[Num[8]++] = Index[SameValueCount-3];
                        Type.cbFiveSame[Num[8]++] = Index[SameValueCount-2];
                        Type.cbFiveSame[Num[8]++] = Index[SameValueCount-1];
                        Type.btFiveSame++;
                    }
                    Number=0;
                    SssLib.ZeroMemory(Index,SssLib.sizeof(Index));
                    // Index[Number++]=i;
                    if(i<bCardCount-1){
                        Index[Number++]=i;
                    }else{
                        Type.cbOnePare[Num[0]++]=i++; 
                    }
                    SameValueCount=1;
                    bLogicValue=this.GetCardLogicValue(CardData[i]);
                }

            }
        }





        //判断两对
        let OnePareCount=parseInt(JSON.stringify(Num[0]/2));
        let ThreeSameCount=parseInt(JSON.stringify(Num[2]/3));
        if(OnePareCount>=2)
        {
            Type.bTwoPare=this.bfalse;
            for(let i=0;i<OnePareCount;i++)
            {
                for(let j=i+1;j<OnePareCount;j++)
                {
                    if (//CardData[Type.cbOnePare[i*2]] == CardData[Type.cbOnePare[i*2+1]] 
                        //|| 
                        CardData[Type.cbOnePare[i*2]] == CardData[Type.cbOnePare[j*2]]
                        || CardData[Type.cbOnePare[i*2+1]] == CardData[Type.cbOnePare[j*2]] 
                        || CardData[Type.cbOnePare[i*2+1]] == CardData[Type.cbOnePare[j*2+1]]
                        || CardData[Type.cbOnePare[j*2+1]] == CardData[Type.cbOnePare[i*2]] 
                        //|| CardData[Type.cbOnePare[j*2+1]] == CardData[Type.cbOnePare[j*2]]
                        )	
                        continue;
                    Type.cbTwoPare[Num[1]++]=Type.cbOnePare[i*2];
                    Type.cbTwoPare[Num[1]++]=Type.cbOnePare[i*2+1];
                    Type.cbTwoPare[Num[1]++]=Type.cbOnePare[j*2];
                    Type.cbTwoPare[Num[1]++]=Type.cbOnePare[j*2+1];
                    Type.btTwoPare++;
                    Type.bTwoPare=this.btrue;
                }
            }
        }


        //判断葫芦
        if(OnePareCount>0&&ThreeSameCount>0)
        {
            for(let i=0;i<ThreeSameCount;i++)
            {
                for(let j=0;j<OnePareCount;j++)
                {
                    if(//bCardData [Type.cbThreeSame[i*3]] == bCardData [Type.cbThreeSame[i*3+1]]
                        // || bCardData [Type.cbThreeSame[i*3]] == bCardData[Type.cbThreeSame[i*3+2]]||
                        bCardData [Type.cbThreeSame[i*3]] == bCardData [Type.cbOnePare[j*2]]
                        || bCardData [Type.cbThreeSame[i*3]] == bCardData [Type.cbOnePare[j*2+1]]
                        // || bCardData [Type.cbThreeSame[i*3+1]] == bCardData[Type.cbThreeSame[i*3+2]]
                        || bCardData [Type.cbThreeSame[i*3+1]] == bCardData [Type.cbOnePare[j*2]]
                        || bCardData [Type.cbThreeSame[i*3+1]] == bCardData [Type.cbOnePare[j*2+1]]
                        || bCardData [Type.cbThreeSame[i*3+2]] == bCardData [Type.cbOnePare[j*2]]
                        || bCardData [Type.cbThreeSame[i*3+2]] == bCardData [Type.cbOnePare[j*2+1]]
                        || bCardData [Type.cbOnePare[j*2]] == bCardData[Type.cbThreeSame[i*3+2]])
                    {
                        continue;
                    }

                    /*if (bCardData [Type.cbThreeSame[i*3]] != bCardData [Type.cbOnePare[j*2]]
					&& bCardData [Type.cbThreeSame[i*3]] != bCardData [Type.cbOnePare[j*2+1]]
					&& bCardData [Type.cbThreeSame[i*3+1]] != bCardData [Type.cbOnePare[j*2]]
					&& bCardData [Type.cbThreeSame[i*3+1]] != bCardData [Type.cbOnePare[j*2+1]]
					&& bCardData [Type.cbThreeSame[i*3+2]] != bCardData [Type.cbOnePare[j*2]]
					&& bCardData [Type.cbThreeSame[i*3+2]] != bCardData [Type.cbOnePare[j*2+1]])*/
                    {
                        Type.bGourd=this.btrue;
                        Type.cbGourd[Num[5]++]=Type.cbThreeSame[i*3];
                        Type.cbGourd[Num[5]++]=Type.cbThreeSame[i*3+1];
                        Type.cbGourd[Num[5]++]=Type.cbThreeSame[i*3+2];
                        Type.cbGourd[Num[5]++]=Type.cbOnePare[j*2];
                        Type.cbGourd[Num[5]++]=Type.cbOnePare[j*2+1];
                        Type.btGourd++;
                    }
                }
            }
        }


        //判断顺子及同花顺
        Number=0;
        SssLib.ZeroMemory(Index,SssLib.sizeof(Index));
        let Straight=1;
        let bStraight=this.GetCardLogicValue(CardData[0]);
        if (this.GetCardLogicValue(CardData[0]) >=SssDef.CARD_XW && this.GetCardLogicValue(CardData[1]) <SssDef.CARD_XW)
        {
            bStraight=this.GetCardLogicValue(CardData[1]);
            Index[Number++]=1;
            let bUsedW = this.bfalse;
            for(let i=2;i<bCardCount;i++)
            {
                if(bStraight==this.GetCardLogicValue(CardData[i])+1)
                {
                    Straight++;
                    Index[Number++]=i;
                    bStraight=this.GetCardLogicValue(CardData[i]);
                }
                else if ((bStraight==this.GetCardLogicValue(CardData[i])+2)&&(bUsedW == this.bfalse))
                {
                    bUsedW = this.btrue;
                    Straight++;
                    Index[Number++]=0;
                    Straight++;
                    Index[Number++]=i;
                    bStraight=this.GetCardLogicValue(CardData[i]);
                }
                if(bStraight>this.GetCardLogicValue(CardData[i])+1||i==bCardCount-1)
                {
                    if (Straight == 4 && bUsedW == this.bfalse)
                    {
                        Straight++;
                        Index[Number++]=0;
                    }
                    if(Straight>=5)
                    {
                        Type.bStraight=this.btrue;
                        for(let j=0;j<Straight;j++)
                        {
                            if(Straight-j>=5)
                            {
                                if (bCardData[Index[j]] == bCardData[Index[j+1]]	||  bCardData[Index[j]] == bCardData[Index[j+2]]
                                    ||  bCardData[Index[j]] == bCardData[Index[j+3]]	||  bCardData[Index[j]] == bCardData[Index[j+4]]
                                    ||  bCardData[Index[j+1]] == bCardData[Index[j+2]]	||  bCardData[Index[j+1]] == bCardData[Index[j+3]]
                                    ||  bCardData[Index[j+1]] == bCardData[Index[j+4]]	||  bCardData[Index[j+2]] == bCardData[Index[j+3]]
                                    ||  bCardData[Index[j+2]] == bCardData[Index[j+4]]	||  bCardData[Index[j+3]] == bCardData[Index[j+4]]
                                )
                                {
                                    continue;
                                }
                                Type.cbStraight[Num[3]++]=Index[j];
                                Type.cbStraight[Num[3]++]=Index[j+1];
                                Type.cbStraight[Num[3]++]=Index[j+2];
                                Type.cbStraight[Num[3]++]=Index[j+3];
                                Type.cbStraight[Num[3]++]=Index[j+4];
                                Type.btStraight++;

                                //从手牌中找到和顺子5张中其中一张数值相同的牌，组成另一种顺子
                                for(let k=j;k<j+5;k++)
                                {
                                    for(let m=0;m<bCardCount;m++)
                                    {
                                        if(this.GetCardLogicValue(CardData[Index[k]])==this.GetCardLogicValue(CardData[m])&&this.GetCardColor(CardData[Index[k]])!=this.GetCardColor(CardData[m]))
                                        {
                                            for(let n=j;n<j+5;n++)
                                            {
                                                if(n==k)
                                                {
                                                    Type.cbStraight[Num[3]++]=m;
                                                }
                                                else
                                                {
                                                    Type.cbStraight[Num[3]++]=Index[n];
                                                }
                                            }
                                            Type.btStraight++;

                                        }
                                    }
                                }
                            }
                            else
                            {
                                break;
                            }
                        }

                    }
                    if(bCardCount-i<5)
                    {
                        break;
                    }
                    bStraight=this.GetCardLogicValue(CardData[i]);
                    Straight=1;
                    Number=0;
                    SssLib.ZeroMemory(Index,SssLib.sizeof(Index));
                    Index[Number++]=i;
                    bUsedW = this.bfalse;
                }
            }


            //存在2 检测A2345顺子
            if(this.GetCardLogicValue(CardData[bCardCount-1])==2)
            {
                Number=0;
                Straight=2;
                bStraight=this.GetCardLogicValue(CardData[1]);
                SssLib.ZeroMemory(Index,SssLib.sizeof(Index));
                let bFind = this.bfalse;

                if (bStraight==14)
                {
                    Index[Number++]=1;
                    bStraight=this.GetCardLogicValue(CardData[bCardCount-1]);
                    Index[Number++]=bCardCount-1;

                    bUsedW = this.bfalse;
                    for(let i=bCardCount-2;i>=0;i--)
                    {
                        if(bStraight==this.GetCardLogicValue(CardData[i])-1)
                        {
                            Straight++;
                            Index[Number++]=i;
                            bStraight=this.GetCardLogicValue(CardData[i]);
                            continue;
                        }

                        if((bStraight==this.GetCardLogicValue(CardData[i])-2)
                            &&(this.bfalse == bUsedW))//保证鬼只使用一次
                        {
                            Straight++;
                            Index[Number++]=0;
                            Straight++;
                            Index[Number++]=i;
                            bStraight=this.GetCardLogicValue(CardData[i]);
                            bUsedW = this.btrue;
                        }
                    }

                    if (Straight == 4 && bUsedW == this.bfalse)
                    {
                        Straight++;
                        Index[Number++]=0;
                    }
                }
                else
                {
                    Index[Number++]=0;
                    bStraight=this.GetCardLogicValue(CardData[bCardCount-1]);
                    Index[Number++]=bCardCount-1;
                    for(let i=bCardCount-2;i>=0;i--)
                    {
                        if(bStraight==this.GetCardLogicValue(CardData[i])-1)
                        {
                            Straight++;
                            Index[Number++]=i;
                            bStraight=this.GetCardLogicValue(CardData[i]);
                        }
                    }
                }

                if(Straight>=5)
                {
                    Type.bStraight=this.btrue;
                    for(let j=0;j<5;j++)
                    {
                        Type.cbStraight[Num[3]++]=Index[j];
                    }
                    Type.btStraight++;

                    //从手牌中找到和顺子5张中其中一张数值相同的牌，组成另一种顺子
                    for(let k=0;k<5;k++)
                    {
                        for(let m=0;m<bCardCount;m++)
                        {
                            if(this.GetCardLogicValue(CardData[Index[k]])==this.GetCardLogicValue(CardData[m])&&this.GetCardColor(CardData[Index[k]])!=this.GetCardColor(CardData[m]))
                            {
                                for(let n=0;n<5;n++)
                                {
                                    if(n==k)
                                    {
                                        Type.cbStraight[Num[3]++]=m;
                                    }
                                    else
                                    {
                                        Type.cbStraight[Num[3]++]=Index[n];
                                    }
                                }
                                Type.btStraight++;
                            }
                        }
                    }

                }
            }

            //存在3并且存在A 检测A2345顺子
            if((this.GetCardLogicValue(CardData[bCardCount-1])==3)
                &&(this.GetCardLogicValue(CardData[1])==14))
            {
                Number=0;
                Straight=3;
                SssLib.ZeroMemory(Index,SssLib.sizeof(Index));

                Index[Number++]=0;
                Index[Number++]=1;
                bStraight=this.GetCardLogicValue(CardData[bCardCount-1]);
                Index[Number++]=bCardCount-1;

                for(let i=bCardCount-2;i>=0;i--)
                {
                    if(bStraight==this.GetCardLogicValue(CardData[i])-1)
                    {
                        Straight++;
                        Index[Number++]=i;
                        bStraight=this.GetCardLogicValue(CardData[i]);
                    }
                }


                if(Straight>=5)
                {
                    Type.bStraight=this.btrue;
                    for(let j=0;j<5;j++)
                    {
                        Type.cbStraight[Num[3]++]=Index[j];
                    }
                    Type.btStraight++;

                    //从手牌中找到和顺子5张中其中一张数值相同的牌，组成另一种顺子
                    for(let k=0;k<5;k++)
                    {
                        for(let m=0;m<bCardCount;m++)
                        {
                            if(this.GetCardLogicValue(CardData[Index[k]])==this.GetCardLogicValue(CardData[m])&&this.GetCardColor(CardData[Index[k]])!=this.GetCardColor(CardData[m]))
                            {
                                for(let n=0;n<5;n++)
                                {
                                    if(n==k)
                                    {
                                        Type.cbStraight[Num[3]++]=m;
                                    }
                                    else
                                    {
                                        Type.cbStraight[Num[3]++]=Index[n];
                                    }
                                }
                                Type.btStraight++;
                            }
                        }
                    }

                }
            }
        }
        else if (this.GetCardLogicValue(CardData[0]) ==SssDef.CARD_DW && this.GetCardLogicValue(CardData[1]) ==SssDef.CARD_XW)
        {
            bStraight=this.GetCardLogicValue(CardData[2]);
            Index[Number++]=2;

            let bUsedDW = this.bfalse;
            let bUsedXW = this.bfalse;
            for(let i=3;i<bCardCount;i++)
            {
                if(bStraight==this.GetCardLogicValue(CardData[i])+1)
                {
                    Straight++;
                    Index[Number++]=i;
                    bStraight=this.GetCardLogicValue(CardData[i]);
                }
                else if ((bStraight==this.GetCardLogicValue(CardData[i])+2)&&((bUsedDW==this.bfalse)||(bUsedXW==this.bfalse)))
                {
                    if (bUsedDW == this.bfalse)
                    {
                        Straight++;
                        Index[Number++]=0;
                        bUsedDW = this.btrue;
                    }
                    else if (bUsedXW == this.bfalse)
                    {
                        Straight++;
                        Index[Number++]=1;
                        bUsedXW = this.btrue;
                    }

                    Straight++;
                    Index[Number++]=i;
                    bStraight=this.GetCardLogicValue(CardData[i]);
                }
                else if ((bStraight == this.GetCardLogicValue(CardData[i]+3))&&(bUsedDW==this.bfalse)&&(bUsedXW==this.bfalse))
                {
                    Straight++;
                    Index[Number++]=0;
                    Straight++;
                    Index[Number++]=1;
                    Straight++;
                    Index[Number++]=i;
                    bStraight=this.GetCardLogicValue(CardData[i]);
                    bUsedDW = this.btrue;
                    bUsedXW = this.btrue;
                }
                if(bStraight>this.GetCardLogicValue(CardData[i])+1||i==bCardCount-1)
                {
                    if (Straight==4&&((bUsedDW==this.bfalse)||(bUsedXW==this.bfalse)))
                    {
                        if (bUsedDW == this.bfalse)
                        {
                            Straight++;
                            Index[Number++]=0;
                            bUsedDW = this.btrue;
                        }
                        else if (bUsedXW == this.bfalse)
                        {
                            Straight++;
                            Index[Number++]=1;
                            bUsedXW = this.btrue;
                        }
                    }

                    if (Straight==3&&((bUsedDW==this.bfalse)&&(bUsedXW==this.bfalse)))
                    {
                        Straight++;
                        Index[Number++]=0;
                        Straight++;
                        Index[Number++]=1;
                    }

                    if(Straight>=5)
                    {
                        Type.bStraight=this.btrue;
                        for(let j=0;j<Straight;j++)
                        {
                            if(Straight-j>=5)
                            {
                                if (bCardData[Index[j]] == bCardData[Index[j+1]]	||  bCardData[Index[j]] == bCardData[Index[j+2]]
                                    ||  bCardData[Index[j]] == bCardData[Index[j+3]]	||  bCardData[Index[j]] == bCardData[Index[j+4]]
                                    ||  bCardData[Index[j+1]] == bCardData[Index[j+2]]	||  bCardData[Index[j+1]] == bCardData[Index[j+3]]
                                    ||  bCardData[Index[j+1]] == bCardData[Index[j+4]]	||  bCardData[Index[j+2]] == bCardData[Index[j+3]]
                                    ||  bCardData[Index[j+2]] == bCardData[Index[j+4]]	||  bCardData[Index[j+3]] == bCardData[Index[j+4]]
                                )
                                {
                                    continue;
                                }
                                Type.cbStraight[Num[3]++]=Index[j];
                                Type.cbStraight[Num[3]++]=Index[j+1];
                                Type.cbStraight[Num[3]++]=Index[j+2];
                                Type.cbStraight[Num[3]++]=Index[j+3];
                                Type.cbStraight[Num[3]++]=Index[j+4];
                                Type.btStraight++;
                                //从手牌中找到和顺子5张中其中一张数值相同的牌，组成另一种顺子
                                for(let k=j;k<j+5;k++)
                                {
                                    for(let m=0;m<bCardCount;m++)
                                    {
                                        if(this.GetCardLogicValue(CardData[Index[k]])==this.GetCardLogicValue(CardData[m])&&this.GetCardColor(CardData[Index[k]])!=this.GetCardColor(CardData[m]))
                                        {
                                            for(let n=j;n<j+5;n++)
                                            {
                                                if(n==k)
                                                {
                                                    Type.cbStraight[Num[3]++]=m;
                                                }
                                                else
                                                {
                                                    Type.cbStraight[Num[3]++]=Index[n];
                                                }
                                            }
                                            Type.btStraight++;
                                        }
                                    }
                                }
                            }
                            else
                            {
                                break;
                            }
                        }

                    }
                    if(bCardCount-i<5)
                    {
                        break;
                    }
                    bStraight=this.GetCardLogicValue(CardData[i]);
                    Straight=1;
                    Number=0;
                    SssLib.ZeroMemory(Index,SssLib.sizeof(Index));
                    Index[Number++]=i;
                    bUsedDW = this.bfalse;
                    bUsedXW = this.bfalse;
                }
            }



            //存在2 检测A2345顺子
            if(this.GetCardLogicValue(CardData[bCardCount-1])==2)
            {
                Number=0;
                Straight=2;
                bStraight=this.GetCardLogicValue(CardData[2]);
                SssLib.ZeroMemory(Index,SssLib.sizeof(Index));
                let bFind = this.bfalse;
                if (bStraight==14)
                {
                    //Index[Number++]=1;
                    Index[Number++]=2;		//下标0,1位置是鬼，所以是从下标2位置的A开始
                    bStraight=this.GetCardLogicValue(CardData[bCardCount-1]);
                    Index[Number++]=bCardCount-1;

                    let bDWused = this.bfalse;
                    let bXWused = this.bfalse;
                    for(let i=bCardCount-2;i>=0;i--)
                    {
                        if(bStraight==this.GetCardLogicValue(CardData[i])-1)
                        {
                            Straight++;
                            Index[Number++]=i;
                            bStraight=this.GetCardLogicValue(CardData[i]);
                            continue;
                        }
                        else if((bStraight==this.GetCardLogicValue(CardData[i])-2)
                            &&((this.bfalse == bDWused)||(this.bfalse == bDWused)))//保证大小鬼只使用一次
                        {
                            if (bDWused == this.bfalse)
                            {
                                bDWused = this.btrue;
                                Straight++;
                                Index[Number++]=0;
                                Straight++;
                                Index[Number++]=i;
                                bStraight=this.GetCardLogicValue(CardData[i]);
                            }
                            else if (bXWused == this.bfalse)
                            {
                                bXWused = this.btrue;
                                Straight++;
                                Index[Number++]=1;
                                Straight++;
                                Index[Number++]=i;
                                bStraight=this.GetCardLogicValue(CardData[i]);
                            }
                        }
                        else if ((bStraight == this.GetCardLogicValue(CardData[i]-3))
                            &&(this.bfalse == bDWused)&&(this.bfalse == bDWused))//保证大小鬼只使用一次
                        {
                            Straight++;
                            Index[Number++]=0;
                            Straight++;
                            Index[Number++]=1;
                            Straight++;
                            Index[Number++]=i;
                            bStraight=this.GetCardLogicValue(CardData[i]);
                        }
                    }
                }
                else
                {
                    Index[Number++]=SssLib.rand()%2;//大小鬼任取一张
                    bStraight=this.GetCardLogicValue(CardData[bCardCount-1]);
                    Index[Number++]=bCardCount-1;
                    for(let i=bCardCount-2;i>=0;i--)
                    {
                        if(bStraight==this.GetCardLogicValue(CardData[i])-1)
                        {
                            Straight++;
                            Index[Number++]=i;
                            bStraight=this.GetCardLogicValue(CardData[i]);
                        }
                    }
                }
                if(Straight>=5)
                {
                    Type.bStraight=this.btrue;
                    for(let j=0;j<5;j++)
                    {
                        Type.cbStraight[Num[3]++]=Index[j];
                    }
                    Type.btStraight++;

                    //从手牌中找到和顺子5张中其中一张数值相同的牌，组成另一种顺子
                    for(let k=0;k<5;k++)
                    {
                        for(let m=0;m<bCardCount;m++)
                        {
                            if(this.GetCardLogicValue(CardData[Index[k]])==this.GetCardLogicValue(CardData[m])&&this.GetCardColor(CardData[Index[k]])!=this.GetCardColor(CardData[m]))
                            {
                                for(let n=0;n<5;n++)
                                {
                                    if(n==k)
                                    {
                                        Type.cbStraight[Num[3]++]=m;
                                    }
                                    else
                                    {
                                        Type.cbStraight[Num[3]++]=Index[n];
                                    }
                                }
                                Type.btStraight++;
                            }
                        }
                    }

                }
            }

            //存在3 检测A2345顺子
            if(this.GetCardLogicValue(CardData[bCardCount-1])==3)
            {
                Number=0;
                Straight=3;
                bStraight=this.GetCardLogicValue(CardData[2]);
                SssLib.ZeroMemory(Index,SssLib.sizeof(Index));
                let bFind = this.bfalse;
                if (bStraight==14)
                {
                    Index[Number++]=1;
                    Index[Number++] = 2;
                    bStraight=this.GetCardLogicValue(CardData[bCardCount-1]);
                    Index[Number++]=bCardCount-1;

                    let bDWused = this.bfalse;

                    for(let i=bCardCount-2;i>=0;i--)
                    {
                        if(bStraight==this.GetCardLogicValue(CardData[i])-1)
                        {
                            Straight++;
                            Index[Number++]=i;
                            bStraight=this.GetCardLogicValue(CardData[i]);
                            continue;
                        }
                        else if((bStraight==this.GetCardLogicValue(CardData[i])-2)
                            &&(this.bfalse == bDWused))//保证大鬼只使用一次
                        {
                            if (bDWused == this.bfalse)
                            {
                                bDWused = this.btrue;
                                Straight++;
                                Index[Number++]=0;
                                Straight++;
                                Index[Number++]=i;
                                bStraight=this.GetCardLogicValue(CardData[i]);
                            }
                        }
                    }
                }
                else
                {
                    Index[Number++]=0;
                    Index[Number++]=1;
                    bStraight=this.GetCardLogicValue(CardData[bCardCount-1]);
                    Index[Number++]=bCardCount-1;
                    for(let i=bCardCount-2;i>=0;i--)
                    {
                        if(bStraight==this.GetCardLogicValue(CardData[i])-1)
                        {
                            Straight++;
                            Index[Number++]=i;
                            bStraight=this.GetCardLogicValue(CardData[i]);
                        }
                    }
                }
                if(Straight>=5)
                {
                    Type.bStraight=this.btrue;
                    for(let j=0;j<5;j++)
                    {
                        Type.cbStraight[Num[3]++]=Index[j];
                    }
                    Type.btStraight++;
                    //从手牌中找到和顺子5张中其中一张数值相同的牌，组成另一种顺子
                    for(let k=0;k<5;k++)
                    {
                        for(let m=0;m<bCardCount;m++)
                        {
                            if(this.GetCardLogicValue(CardData[Index[k]])==this.GetCardLogicValue(CardData[m])&&this.GetCardColor(CardData[Index[k]])!=this.GetCardColor(CardData[m]))
                            {
                                for(let n=0;n<5;n++)
                                {
                                    if(n==k)
                                    {
                                        Type.cbStraight[Num[3]++]=m;
                                    }
                                    else
                                    {
                                        Type.cbStraight[Num[3]++]=Index[n];
                                    }
                                }
                                Type.btStraight++;


                            }
                        }
                    }

                }
            }



            //存在4和A 检测A2345顺子
            if((this.GetCardLogicValue(CardData[bCardCount-1])==4)
                &&(this.GetCardLogicValue(CardData[2])==14))
            {
                Number=0;
                Straight=4;
                bStraight=this.GetCardLogicValue(CardData[2]);
                SssLib.ZeroMemory(Index,SssLib.sizeof(Index));

                Index[Number++]=0;
                Index[Number++]=1;
                Index[Number++]=2;
                bStraight=this.GetCardLogicValue(CardData[bCardCount-1]);
                Index[Number++]=bCardCount-1;
                for(let i=bCardCount-2;i>=0;i--)
                {
                    if(bStraight==this.GetCardLogicValue(CardData[i])-1)
                    {
                        Straight++;
                        Index[Number++]=i;
                        bStraight=this.GetCardLogicValue(CardData[i]);
                    }
                }

                if(Straight>=5)
                {
                    Type.bStraight=this.btrue;
                    for(let j=0;j<5;j++)
                    {
                        Type.cbStraight[Num[3]++]=Index[j];
                    }
                    Type.btStraight++;


                    //从手牌中找到和顺子5张中其中一张数值相同的牌，组成另一种顺子
                    for(let k=0;k<5;k++)
                    {
                        for(let m=0;m<bCardCount;m++)
                        {
                            if(this.GetCardLogicValue(CardData[Index[k]])==this.GetCardLogicValue(CardData[m])&&this.GetCardColor(CardData[Index[k]])!=this.GetCardColor(CardData[m]))
                            {
                                for(let n=0;n<5;n++)
                                {
                                    if(n==k)
                                    {
                                        Type.cbStraight[Num[3]++]=m;
                                    }
                                    else
                                    {
                                        Type.cbStraight[Num[3]++]=Index[n];
                                    }
                                }
                                Type.btStraight++;

                            }
                        }
                    }

                }
            }

        }
        else
        {
            bStraight=this.GetCardLogicValue(CardData[0]);
            Index[Number++]=0;
            if(bStraight!=14)
            {
                for(let i=1;i<bCardCount;i++)
                {
                    if(bStraight==this.GetCardLogicValue(CardData[i])+1)
                    {
                        Straight++;
                        Index[Number++]=i;
                        bStraight=this.GetCardLogicValue(CardData[i]);
                    }
                    if(bStraight>this.GetCardLogicValue(CardData[i])+1||i==bCardCount-1)
                    {
                        if(Straight>=5)
                        {
                            Type.bStraight=this.btrue;
                            for(let j=0;j<Straight;j++)
                            {
                                if(Straight-j>=5)
                                {
                                    Type.cbStraight[Num[3]++]=Index[j];
                                    Type.cbStraight[Num[3]++]=Index[j+1];
                                    Type.cbStraight[Num[3]++]=Index[j+2];
                                    Type.cbStraight[Num[3]++]=Index[j+3];
                                    Type.cbStraight[Num[3]++]=Index[j+4];
                                    Type.btStraight++;
                                    //从手牌中找到和顺子5张中其中一张数值相同的牌，组成另一种顺子
                                    for(let k=j;k<j+5;k++)
                                    {
                                        for(let m=0;m<bCardCount;m++)
                                        {
                                            if(this.GetCardLogicValue(CardData[Index[k]])==this.GetCardLogicValue(CardData[m])&&this.GetCardColor(CardData[Index[k]])!=this.GetCardColor(CardData[m]))
                                            {
                                                for(let n=j;n<j+5;n++)
                                                {
                                                    if(n==k)
                                                    {
                                                        Type.cbStraight[Num[3]++]=m;
                                                    }
                                                    else
                                                    {
                                                        Type.cbStraight[Num[3]++]=Index[n];
                                                    }
                                                }
                                                Type.btStraight++;
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    break;
                                }
                            }

                        }
                        if(bCardCount-i<5)
                        {
                            break;
                        }
                        bStraight=this.GetCardLogicValue(CardData[i]);
                        Straight=1;
                        Number=0;
                        SssLib.ZeroMemory(Index,SssLib.sizeof(Index));
                        Index[Number++]=i;
                    }
                }

            }
            if(bStraight==14)
            {
                for(let i=1;i<bCardCount;i++)
                {
                    if(bStraight==this.GetCardLogicValue(CardData[i])+1)
                    {
                        Straight++;
                        Index[Number++]=i;
                        bStraight=this.GetCardLogicValue(CardData[i]);
                    }
                    if(bStraight>this.GetCardLogicValue(CardData[i])+1||i==bCardCount-1)
                    {
                        if(Straight>=5)
                        {
                            Type.bStraight=this.btrue;
                            for(let j=0;j<Straight;j++)
                            {
                                if(Straight-j>=5)
                                {
                                    Type.cbStraight[Num[3]++]=Index[j];
                                    Type.cbStraight[Num[3]++]=Index[j+1];
                                    Type.cbStraight[Num[3]++]=Index[j+2];
                                    Type.cbStraight[Num[3]++]=Index[j+3];
                                    Type.cbStraight[Num[3]++]=Index[j+4];
                                    Type.btStraight++;
                                    //从手牌中找到和顺子5张中其中一张数值相同的牌，组成另一种顺子
                                    for(let k=j;k<j+5;k++)
                                    {
                                        for(let m=0;m<bCardCount;m++)
                                        {
                                            if(this.GetCardLogicValue(CardData[Index[k]])==this.GetCardLogicValue(CardData[m])&&this.GetCardColor(CardData[Index[k]])!=this.GetCardColor(CardData[m]))
                                            {
                                                for(let n=j;n<j+5;n++)
                                                {
                                                    if(n==k)
                                                    {
                                                        Type.cbStraight[Num[3]++]=m;
                                                    }
                                                    else
                                                    {
                                                        Type.cbStraight[Num[3]++]=Index[n];
                                                    }
                                                }
                                                Type.btStraight++;
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    break;
                                }
                            }
                        }
                        if(bCardCount-i<5)
                        {
                            break;
                        }
                        bStraight=this.GetCardLogicValue(CardData[i]);
                        Straight=1;
                        Number=0;
                        SssLib.ZeroMemory(Index,SssLib.sizeof(Index));
                        Index[Number++]=i;
                    }
                }
                if(this.GetCardLogicValue(CardData[bCardCount-1])==2)
                {
                    Number=0;
                    let BackA=1;
                    let FrontA=1;
                    bStraight=this.GetCardLogicValue(CardData[0]);
                    SssLib.ZeroMemory(Index,SssLib.sizeof(Index));
                    Index[Number++]=0;
                    bStraight=this.GetCardLogicValue(CardData[bCardCount-1]);
                    Index[Number++]=bCardCount-1;
                    for(let i=bCardCount-2;i>=0;i--)
                    {
                        if(bStraight==this.GetCardLogicValue(CardData[i])-1)
                        {
                            FrontA++;
                            Index[Number++]=i;
                            bStraight=this.GetCardLogicValue(CardData[i]);
                        }
                    }
                    if(FrontA+BackA>=5)
                    {
                        Type.bStraight=this.btrue;
                        for(let i=BackA;i>0;i--)
                        {
                            for(let j=1;j<=FrontA;j++)
                            {
                                if(i+j==5)
                                {
                                    for(let k=0;k<i;k++)
                                    {
                                        Type.cbStraight[Num[3]++]=Index[k];
                                    }
                                    for(let k=0;k<j;k++)
                                    {
                                        Type.cbStraight[Num[3]++]=Index[k+BackA];
                                    }
                                    break;
                                }
                            }
                        }
                        Type.btStraight++;
                    }
                }

            }
        }

        //判断同花
        Number=0;
        SssLib.ZeroMemory(Index,SssLib.sizeof(Index));
        this.SortCardList(CardData , bCardCount , this.enColor) ;
        let cbCardData=SssLib.oneDArr(13);
        SssLib.CopyMemory(cbCardData , bCardData , bCardCount) ;
        this.SortCardList(cbCardData , bCardCount , this.enDescend) ;
        if (this.GetCardLogicValue(CardData[0]) >=SssDef.CARD_XW && this.GetCardLogicValue(CardData[1]) <SssDef.CARD_XW)
        {
            let SameColorCount=1;
            let bCardColor = this.GetCardColor(CardData[1]) ;
            Index[Number++]=1;

            for(let i=2;i<bCardCount;i++)
            {
                if(bCardColor==this.GetCardColor(CardData[i]))
                {
                    SameColorCount++;
                    Index[Number++]=i;
                }
                if(bCardColor!=this.GetCardColor(CardData[i])||i==bCardCount-1)
                {
                    if (SameColorCount==4)
                    {
                        SameColorCount++;
                        Index[Number++]=0;
                    }
                    if(SameColorCount>=5)
                    {
                        Type.bFlush=this.btrue;
                        //切换位置
                        for(let j=0;j<SameColorCount;j++)
                        {
                            for(let k=0;k<bCardCount;k++)
                            {
                                if(this.GetCardLogicValue(CardData[Index[j]])==this.GetCardLogicValue(cbCardData[k])
                                    &&this.GetCardColor(CardData[Index[j]])==this.GetCardColor(cbCardData[k]))
                                {
                                    Index[j]=k;
                                    break;
                                }
                            }
                        }
                        //排序位置
                        let SaveIndex=0;
                        for(let j=0;j<SameColorCount;j++)
                        {
                            for(let k=j+1;k<SameColorCount;k++)
                            {
                                if(Index[j]>Index[k])
                                {
                                    SaveIndex=Index[j];
                                    Index[j]=Index[k];
                                    Index[k]=SaveIndex;
                                }
                            }
                        }
                        //判断到花色和数值相同的时候，index会重复记录成一个下标
                        //因为手牌中为降序排列，所以碰到相同index的时候，一个下标增加1
                        //该操作为了解决 同花提示只提示4张的问题
                        for (let j = 0; j < SameColorCount; j++) {
                            if(j<SameColorCount-1&&this.GetCardLogicValue(cbCardData[Index[j]])==this.GetCardLogicValue(cbCardData[Index[j+1]])){
                                Index[j+1]=Index[j]+1;
                            }
                        }


                        //同花顺
                        if (this.GetCardLogicValue(cbCardData[Index[0]]) >= SssDef.CARD_XW) {
                            if (((this.GetCardLogicValue(cbCardData[Index[1]]) == 14) && ((this.GetCardLogicValue(cbCardData[Index[2]]) == 5) || (this.GetCardLogicValue(cbCardData[Index[2]]) == 4)))
                                || (4 >= (this.GetCardLogicValue(cbCardData[Index[1]]) - this.GetCardLogicValue(cbCardData[Index[4]])))) {
                                let bSameCard = false;
                                for (let bSameCardnum = 0; bSameCardnum < 4; bSameCardnum++) {
                                    if (this.GetCardLogicValue(cbCardData[Index[bSameCardnum]]) == this.GetCardLogicValue(cbCardData[Index[bSameCardnum + 1]])
                                        && this.GetCardColor(cbCardData[Index[bSameCardnum]]) == this.GetCardColor(cbCardData[Index[bSameCardnum + 1]])) {
                                        bSameCard = true;
                                        break;
                                    }
                                }
                                if (!bSameCard) {
                                    Type.bStraightFlush = this.btrue;
                                    Type.cbStraightFlush[Num[7]++] = Index[0];
                                    Type.cbStraightFlush[Num[7]++] = Index[1];
                                    Type.cbStraightFlush[Num[7]++] = Index[2];
                                    Type.cbStraightFlush[Num[7]++] = Index[3];
                                    Type.cbStraightFlush[Num[7]++] = Index[4];
                                    Type.btStraightFlush++;
                                }
                            }
                        }
                        else
                        {
                            //同花A2345特殊处理
                            if (this.GetCardLogicValue(cbCardData[Index[0]])==14)
                            {
                                for(let i =1;i<SameColorCount;i++)
                                {

                                    if(this.GetCardLogicValue(cbCardData[Index[i]])==5)
                                    {
                                        if (SameColorCount-i==4)
                                        {
                                            let straightUnfounded = false
                                            for (let j = i; j < i + 3; j++) {
                                                if (this.GetCardLogicValue(cbCardData[Index[j]]) == this.GetCardLogicValue(cbCardData[Index[j + 1]])
                                                    && this.GetCardColor(cbCardData[Index[j]]) == this.GetCardColor(cbCardData[Index[j + 1]])) {
                                                    straightUnfounded = true;
                                                    break;
                                                }
                                            }
                                            if(!straightUnfounded){
                                                Type.bStraightFlush=this.btrue;
                                                Type.cbStraightFlush[Num[7]++]=Index[0];
                                                Type.cbStraightFlush[Num[7]++]=Index[i];
                                                Type.cbStraightFlush[Num[7]++]=Index[i+1];
                                                Type.cbStraightFlush[Num[7]++]=Index[i+2];
                                                Type.cbStraightFlush[Num[7]++]=Index[i+3];
                                                Type.btStraightFlush++;
                                            }
                                        }
                                        else if (SameColorCount-i==3)
                                        {
                                            let straightUnfounded = false
                                            for (let j = i; j < i + 2; j++) {
                                                if (this.GetCardLogicValue(cbCardData[Index[j]]) == this.GetCardLogicValue(cbCardData[Index[j + 1]])
                                                    && this.GetCardColor(cbCardData[Index[j]]) == this.GetCardColor(cbCardData[Index[j + 1]])) {
                                                    straightUnfounded = true;
                                                    break;
                                                }
                                            }
                                            if(!straightUnfounded){
                                                Type.bStraightFlush=this.btrue;
                                                Type.cbStraightFlush[Num[7]++]=0;//鬼
                                                Type.cbStraightFlush[Num[7]++]=Index[0];//A
                                                Type.cbStraightFlush[Num[7]++]=Index[i];
                                                Type.cbStraightFlush[Num[7]++]=Index[i+1];
                                                Type.cbStraightFlush[Num[7]++]=Index[i+2];
                                                Type.btStraightFlush++;
                                            }
                                        }

                                    }

                                    if(this.GetCardLogicValue(cbCardData[Index[i]])==4)
                                    {
                                        if (SameColorCount-i==3)
                                        {
                                            let straightUnfounded = false
                                            for (let j = i; j < i +2; j++) {
                                                if (this.GetCardLogicValue(cbCardData[Index[j]]) == this.GetCardLogicValue(cbCardData[Index[j + 1]])
                                                    && this.GetCardColor(cbCardData[Index[j]]) == this.GetCardColor(cbCardData[Index[j + 1]])) {
                                                    straightUnfounded = true;
                                                    break;
                                                }
                                            }
                                            if(!straightUnfounded){
                                                Type.bStraightFlush=this.btrue;
                                                Type.cbStraightFlush[Num[7]++]=0;//鬼
                                                Type.cbStraightFlush[Num[7]++]=Index[0];//A
                                                Type.cbStraightFlush[Num[7]++]=Index[i];
                                                Type.cbStraightFlush[Num[7]++]=Index[i+1];
                                                Type.cbStraightFlush[Num[7]++]=Index[i+2];
                                                Type.btStraightFlush++;
                                            }
                                        }
                                    }
                                }
                            }


                            for(let i =0;i<SameColorCount;i++)
                            {
                                if (SameColorCount-i>=5)
                                {
                                    if (4==(this.GetCardLogicValue(cbCardData[Index[i]])-this.GetCardLogicValue(cbCardData[Index[i+4]])))
                                    {
                                        let straightUnfounded = false
                                        for (let j = i; j < i + 4; j++) {
                                            if (this.GetCardLogicValue(cbCardData[Index[j]]) == this.GetCardLogicValue(cbCardData[Index[j + 1]])
                                                && this.GetCardColor(cbCardData[Index[j]]) == this.GetCardColor(cbCardData[Index[j + 1]])) {
                                                straightUnfounded = true;
                                                break;
                                            }
                                        }
                                        if(!straightUnfounded){
                                            Type.bStraightFlush=this.btrue;
                                            Type.cbStraightFlush[Num[7]++]=Index[i];
                                            Type.cbStraightFlush[Num[7]++]=Index[i+1];
                                            Type.cbStraightFlush[Num[7]++]=Index[i+2];
                                            Type.cbStraightFlush[Num[7]++]=Index[i+3];
                                            Type.cbStraightFlush[Num[7]++]=Index[i+4];
                                            Type.btStraightFlush++;
                                        }
                                    }
                                    else if (4>=(this.GetCardLogicValue(cbCardData[Index[i]])-this.GetCardLogicValue(cbCardData[Index[i+3]])))
                                    {
                                        let straightUnfounded = false
                                        for (let j = i; j < i + 3; j++) {
                                            if (this.GetCardLogicValue(cbCardData[Index[j]]) == this.GetCardLogicValue(cbCardData[Index[j + 1]])
                                                && this.GetCardColor(cbCardData[Index[j]]) == this.GetCardColor(cbCardData[Index[j + 1]])) {
                                                straightUnfounded = true;
                                                break;
                                            }
                                        }
                                        if(!straightUnfounded){
                                            Type.bStraightFlush=this.btrue;
                                            Type.cbStraightFlush[Num[7]++]=0;
                                            Type.cbStraightFlush[Num[7]++]=Index[i];
                                            Type.cbStraightFlush[Num[7]++]=Index[i+1];
                                            Type.cbStraightFlush[Num[7]++]=Index[i+2];
                                            Type.cbStraightFlush[Num[7]++]=Index[i+3];
                                            Type.btStraightFlush++;
                                        }
                                    }

                                }
                                else if(SameColorCount-i==4)
                                {
                                    if (4>=this.GetCardLogicValue(cbCardData[Index[i]])-this.GetCardLogicValue(cbCardData[Index[i+3]]))
                                    {
                                        let straightUnfounded = false
                                        for (let j = i; j < i + 3; j++) {
                                            if (this.GetCardLogicValue(cbCardData[Index[j]]) == this.GetCardLogicValue(cbCardData[Index[j + 1]])
                                                && this.GetCardColor(cbCardData[Index[j]]) == this.GetCardColor(cbCardData[Index[j + 1]])) {
                                                straightUnfounded = true;
                                                break;
                                            }
                                        }
                                        if(!straightUnfounded){
                                            Type.bStraightFlush=this.btrue;
                                            Type.cbStraightFlush[Num[7]++]=0;
                                            Type.cbStraightFlush[Num[7]++]=Index[i];
                                            Type.cbStraightFlush[Num[7]++]=Index[i+1];
                                            Type.cbStraightFlush[Num[7]++]=Index[i+2];
                                            Type.cbStraightFlush[Num[7]++]=Index[i+3];
                                            Type.btStraightFlush++;
                                        }
                                    }
                                }

                            }

                        }


                        for(let j=0;j<SameColorCount;j++)
                        {
                            if(SameColorCount-j>=5)
                            {
                                Type.cbFlush[Num[4]++]=Index[j];
                                Type.cbFlush[Num[4]++]=Index[j+1];
                                Type.cbFlush[Num[4]++]=Index[j+2];
                                Type.cbFlush[Num[4]++]=Index[j+3];
                                Type.cbFlush[Num[4]++]=Index[j+4];
                                Type.btFlush++;
                            }
                            else
                            {
                                break;
                            }
                        }
                    }
                    if(bCardCount-i<4)
                    {
                        break;
                    }
                    Number=0;
                    SssLib.ZeroMemory(Index,SssLib.sizeof(Index));
                    SameColorCount=1;
                    Index[Number++]=i;
                    bCardColor=this.GetCardColor(CardData[i]);
                }
            }
        }
        else if (this.GetCardLogicValue(CardData[0]) ==SssDef.CARD_DW && this.GetCardLogicValue(CardData[1]) ==SssDef.CARD_XW)
        {
            let SameColorCount=1;
            let bCardColor = this.GetCardColor(CardData[2]) ;
            Index[Number++]=2;

            for(let i=3;i<bCardCount;i++)
            {
                if(bCardColor==this.GetCardColor(CardData[i]))
                {
                    SameColorCount++;
                    Index[Number++]=i;
                }
                if(bCardColor!=this.GetCardColor(CardData[i])||i==bCardCount-1)
                {
                    if (SameColorCount==4)
                    {
                        SameColorCount++;
                        Index[Number++]=0;
                    }
                    if (SameColorCount == 3)
                    {
                        SameColorCount++;
                        Index[Number++]=0;
                        SameColorCount++;
                        Index[Number++]=1;
                    }
                    if(SameColorCount>=5)
                    {
                        Type.bFlush=this.btrue;

                        for(let j=0;j<SameColorCount;j++)
                        {
                            for(let k=0;k<bCardCount;k++)
                            {
                                if(this.GetCardLogicValue(CardData[Index[j]])==this.GetCardLogicValue(cbCardData[k])
                                    &&this.GetCardColor(CardData[Index[j]])==this.GetCardColor(cbCardData[k]))
                                {
                                    Index[j]=k;
                                    break;
                                }
                            }
                        }
                        let SaveIndex=0;
                        for(let j=0;j<SameColorCount;j++)
                        {
                            for(let k=j+1;k<SameColorCount;k++)
                            {
                                if(Index[j]>Index[k])
                                {
                                    SaveIndex=Index[j];
                                    Index[j]=Index[k];
                                    Index[k]=SaveIndex;
                                }
                            }
                        }
                        //判断到花色和数值相同的时候，index会重复记录成一个下标
                        //因为手牌中为降序排列，所以碰到相同index的时候，一个下标增加1
                        //该操作为了解决 同花提示只提示4张的问题
                        for (let j = 0; j < SameColorCount; j++) {
                            if(j<SameColorCount-1&&this.GetCardLogicValue(cbCardData[Index[j]])==this.GetCardLogicValue(cbCardData[Index[j+1]])){
                                Index[j+1]=Index[j]+1;
                            }
                        }

                        //同花顺
                        if (this.GetCardLogicValue(cbCardData[Index[0]]) == SssDef.CARD_DW && this.GetCardLogicValue(cbCardData[Index[1]]) == SssDef.CARD_XW) {
                            if (((this.GetCardLogicValue(cbCardData[Index[2]]) == 14) && ((this.GetCardLogicValue(cbCardData[Index[3]]) == 5) || (this.GetCardLogicValue(cbCardData[Index[3]]) == 4) || (this.GetCardLogicValue(cbCardData[Index[3]]) == 3)))
                                || (4 >= (this.GetCardLogicValue(cbCardData[Index[2]]) - this.GetCardLogicValue(cbCardData[Index[4]])))) {
                                let bSameCard = false;
                                for (let bSameCardnum = 0; bSameCardnum < 4; bSameCardnum++) {
                                    if (this.GetCardLogicValue(cbCardData[Index[bSameCardnum]]) == this.GetCardLogicValue(cbCardData[Index[bSameCardnum + 1]])
                                        && this.GetCardColor(cbCardData[Index[bSameCardnum]]) == this.GetCardColor(cbCardData[Index[bSameCardnum + 1]])) {
                                        bSameCard = true;
                                        break;
                                    }
                                }
                                if (!bSameCard) {
                                    Type.bStraightFlush = this.btrue;
                                    Type.cbStraightFlush[Num[7]++] = Index[0];
                                    Type.cbStraightFlush[Num[7]++] = Index[1];
                                    Type.cbStraightFlush[Num[7]++] = Index[2];
                                    Type.cbStraightFlush[Num[7]++] = Index[3];
                                    Type.cbStraightFlush[Num[7]++] = Index[4];
                                    Type.btStraightFlush++;
                                }  
                            }
                        }
                        else if (this.GetCardLogicValue(cbCardData[Index[0]]) >= SssDef.CARD_XW && this.GetCardLogicValue(cbCardData[Index[1]]) < SssDef.CARD_XW) {
                            let bSameCard = false;
                            for (let bSameCardnum = 0; bSameCardnum < 4; bSameCardnum++) {
                                if (this.GetCardLogicValue(cbCardData[Index[bSameCardnum]]) == this.GetCardLogicValue(cbCardData[Index[bSameCardnum + 1]])
                                    && this.GetCardColor(cbCardData[Index[bSameCardnum]]) == this.GetCardColor(cbCardData[Index[bSameCardnum + 1]])) {
                                    bSameCard = true;
                                    break;
                                }
                            }
                            if (((this.GetCardLogicValue(cbCardData[Index[1]]) == 14) && ((this.GetCardLogicValue(cbCardData[Index[2]]) == 5) || (this.GetCardLogicValue(cbCardData[Index[2]]) == 4)))
                                || (4 >= (this.GetCardLogicValue(cbCardData[Index[1]]) - this.GetCardLogicValue(cbCardData[Index[4]])))) {
                                if (!bSameCard) {
                                    Type.bStraightFlush = this.btrue;
                                    Type.cbStraightFlush[Num[7]++] = Index[0];
                                    Type.cbStraightFlush[Num[7]++] = Index[1];
                                    Type.cbStraightFlush[Num[7]++] = Index[2];
                                    Type.cbStraightFlush[Num[7]++] = Index[3];
                                    Type.cbStraightFlush[Num[7]++] = Index[4];
                                    Type.btStraightFlush++;
                                } 
                            }
                            if ((this.GetCardLogicValue(cbCardData[Index[1]]) != 14)
                                && (this.GetCardLogicValue(cbCardData[Index[1]]) - this.GetCardLogicValue(cbCardData[Index[4]]) >= 4)
                                && !bSameCard){
                                if (this.GetCardLogicValue(cbCardData[Index[1]]) - this.GetCardLogicValue(cbCardData[Index[3]]) <= 4){
                                    Type.bStraightFlush = true;
                                    Type.cbStraightFlush[Num[7]++] = Index[0];
                                    Type.cbStraightFlush[Num[7]++] = Index[1];
                                    Type.cbStraightFlush[Num[7]++] = Index[2];
                                    Type.cbStraightFlush[Num[7]++] = Index[3];
                                    Type.cbStraightFlush[Num[7]++] = 1;//鬼
                                    Type.btStraightFlush++;
                                }
                                else if (this.GetCardLogicValue(cbCardData[Index[2]]) - this.GetCardLogicValue(cbCardData[Index[4]]) <= 4){
                                    Type.bStraightFlush = true;
                                    Type.cbStraightFlush[Num[7]++] = Index[0];
                                    Type.cbStraightFlush[Num[7]++] = Index[2];
                                    Type.cbStraightFlush[Num[7]++] = Index[3];
                                    Type.cbStraightFlush[Num[7]++] = Index[4];
                                    Type.cbStraightFlush[Num[7]++] = 1;//鬼
                                    Type.btStraightFlush++;
                                };
                            }
                        }
                        else
                        {
                            //同花A2345特殊处理
                            if (this.GetCardLogicValue(cbCardData[Index[0]])==14)
                            {
                                for(let i =1;i<SameColorCount;i++)
                                {

                                    if(this.GetCardLogicValue(cbCardData[Index[i]])==5)
                                    {
                                        if (SameColorCount-i==4)
                                        {
                                            let straightUnfounded = false
                                            for (let j = i; j < i+3; j++) {
                                                if (this.GetCardLogicValue(cbCardData[Index[j]]) == this.GetCardLogicValue(cbCardData[Index[j + 1]])
                                                    && this.GetCardColor(cbCardData[Index[j]]) == this.GetCardColor(cbCardData[Index[j + 1]])) {
                                                    straightUnfounded = true;
                                                    break;
                                                }
                                            }
                                            if(!straightUnfounded){
                                                Type.bStraightFlush=this.btrue;
                                                Type.cbStraightFlush[Num[7]++]=Index[0];
                                                Type.cbStraightFlush[Num[7]++]=Index[i];
                                                Type.cbStraightFlush[Num[7]++]=Index[i+1];
                                                Type.cbStraightFlush[Num[7]++]=Index[i+2];
                                                Type.cbStraightFlush[Num[7]++]=Index[i+3];
                                                Type.btStraightFlush++;
                                            }
                                        }
                                        else if (SameColorCount-i==3)
                                        {
                                            let straightUnfounded = false
                                            for (let j = i; j < i+2; j++) {
                                                if (this.GetCardLogicValue(cbCardData[Index[j]]) == this.GetCardLogicValue(cbCardData[Index[j + 1]])
                                                    && this.GetCardColor(cbCardData[Index[j]]) == this.GetCardColor(cbCardData[Index[j + 1]])) {
                                                    straightUnfounded = true;
                                                    break;
                                                }
                                            }
                                            if(!straightUnfounded){
                                                Type.bStraightFlush=this.btrue;
                                                Type.cbStraightFlush[Num[7]++]=0;//鬼
                                                Type.cbStraightFlush[Num[7]++]=Index[0];//A
                                                Type.cbStraightFlush[Num[7]++]=Index[i];
                                                Type.cbStraightFlush[Num[7]++]=Index[i+1];
                                                Type.cbStraightFlush[Num[7]++]=Index[i+2];
                                                Type.btStraightFlush++;
                                            }
                                        }
                                        else if (SameColorCount-i==2)
                                        {
                                            let straightUnfounded = false
                                            for (let j = i; j < i + 1; j++) {
                                                if (this.GetCardLogicValue(cbCardData[Index[j]]) == this.GetCardLogicValue(cbCardData[Index[j + 1]])
                                                    && this.GetCardColor(cbCardData[Index[j]]) == this.GetCardColor(cbCardData[Index[j + 1]])) {
                                                    straightUnfounded = true;
                                                    break;
                                                }
                                            }
                                            if(!straightUnfounded){
                                                Type.bStraightFlush=this.btrue;
                                                Type.cbStraightFlush[Num[7]++]=0;//鬼
                                                Type.cbStraightFlush[Num[7]++]=1;
                                                Type.cbStraightFlush[Num[7]++]=Index[0];//A
                                                Type.cbStraightFlush[Num[7]++]=Index[i];
                                                Type.cbStraightFlush[Num[7]++]=Index[i+1];
                                                Type.btStraightFlush++;
                                            }
                                        }

                                    }
                                    else if(this.GetCardLogicValue(cbCardData[Index[i]])==4)
                                    {
                                        if (SameColorCount-i==3)
                                        {
                                            let straightUnfounded = false
                                            for (let j = i; j < i + 2; j++) {
                                                if (this.GetCardLogicValue(cbCardData[Index[j]]) == this.GetCardLogicValue(cbCardData[Index[j + 1]])
                                                    && this.GetCardColor(cbCardData[Index[j]]) == this.GetCardColor(cbCardData[Index[j + 1]])) {
                                                    straightUnfounded = true;
                                                    break;
                                                }
                                            }
                                            if(!straightUnfounded){
                                                Type.bStraightFlush=this.btrue;
                                                Type.cbStraightFlush[Num[7]++]=0;//鬼
                                                Type.cbStraightFlush[Num[7]++]=Index[0];//A
                                                Type.cbStraightFlush[Num[7]++]=Index[i];
                                                Type.cbStraightFlush[Num[7]++]=Index[i+1];
                                                Type.cbStraightFlush[Num[7]++]=Index[i+2];
                                                Type.btStraightFlush++;
                                            }
                                        }
                                        else if (SameColorCount-i==2)
                                        {
                                            let straightUnfounded = false
                                            for (let j = i; j < i + 1; j++) {
                                                if (this.GetCardLogicValue(cbCardData[Index[j]]) == this.GetCardLogicValue(cbCardData[Index[j + 1]])
                                                    && this.GetCardColor(cbCardData[Index[j]]) == this.GetCardColor(cbCardData[Index[j + 1]])) {
                                                    straightUnfounded = true;
                                                    break;
                                                }
                                            }
                                            if(!straightUnfounded){
                                                Type.bStraightFlush=this.btrue;
                                                Type.cbStraightFlush[Num[7]++]=0;//鬼
                                                Type.cbStraightFlush[Num[7]++]=1;
                                                Type.cbStraightFlush[Num[7]++]=Index[0];//A
                                                Type.cbStraightFlush[Num[7]++]=Index[i];
                                                Type.cbStraightFlush[Num[7]++]=Index[i+1];

                                                Type.btStraightFlush++;
                                            }
                                        }
                                    }
                                    else if(this.GetCardLogicValue(cbCardData[Index[i]])==3)
                                    {
                                        if (SameColorCount-i==2)
                                        {
                                            let straightUnfounded = false
                                            for (let j = i; j < i + 1; j++) {
                                                if (this.GetCardLogicValue(cbCardData[Index[j]]) == this.GetCardLogicValue(cbCardData[Index[j + 1]])
                                                    && this.GetCardColor(cbCardData[Index[j]]) == this.GetCardColor(cbCardData[Index[j + 1]])) {
                                                    straightUnfounded = true;
                                                    break;
                                                }
                                            }
                                            if(!straightUnfounded){
                                                Type.bStraightFlush=this.btrue;
                                                Type.cbStraightFlush[Num[7]++]=0;//鬼
                                                Type.cbStraightFlush[Num[7]++]=1;
                                                Type.cbStraightFlush[Num[7]++]=Index[0];//A
                                                Type.cbStraightFlush[Num[7]++]=Index[i];
                                                Type.cbStraightFlush[Num[7]++]=Index[i+1];
                                                Type.btStraightFlush++;
                                            }
                                        }
                                    }
                                }
                            }


                            for (let i = 0; i < SameColorCount; i++) {
                                if (SameColorCount - i >= 5) {
                                    if (4 == (this.GetCardLogicValue(cbCardData[Index[i]]) - this.GetCardLogicValue(cbCardData[Index[i + 4]]))) {
                                        let straightUnfounded = false
                                        for (let j = i; j < i + 4; j++) {
                                            if (this.GetCardLogicValue(cbCardData[Index[j]]) == this.GetCardLogicValue(cbCardData[Index[j + 1]])
                                                && this.GetCardColor(cbCardData[Index[j]]) == this.GetCardColor(cbCardData[Index[j + 1]])) {
                                                straightUnfounded = true;
                                                break;
                                            }
                                        }
                                        if (!straightUnfounded) {
                                            Type.bStraightFlush = this.btrue;
                                            Type.cbStraightFlush[Num[7]++] = Index[i];
                                            Type.cbStraightFlush[Num[7]++] = Index[i + 1];
                                            Type.cbStraightFlush[Num[7]++] = Index[i + 2];
                                            Type.cbStraightFlush[Num[7]++] = Index[i + 3];
                                            Type.cbStraightFlush[Num[7]++] = Index[i + 4];
                                            Type.btStraightFlush++;
                                        }
                                    }
                                    else if (4 >= (this.GetCardLogicValue(cbCardData[Index[i]]) - this.GetCardLogicValue(cbCardData[Index[i + 3]]))) {
                                        let straightUnfounded = false
                                        for (let j = i; j < i + 3; j++) {
                                            if (this.GetCardLogicValue(cbCardData[Index[j]]) == this.GetCardLogicValue(cbCardData[Index[j + 1]])
                                                && this.GetCardColor(cbCardData[Index[j]]) == this.GetCardColor(cbCardData[Index[j + 1]])) {
                                                straightUnfounded = true;
                                                break;
                                            }
                                        }
                                        if (!straightUnfounded) {
                                            Type.bStraightFlush = this.btrue;
                                            Type.cbStraightFlush[Num[7]++] = 0;
                                            Type.cbStraightFlush[Num[7]++] = Index[i];
                                            Type.cbStraightFlush[Num[7]++] = Index[i + 1];
                                            Type.cbStraightFlush[Num[7]++] = Index[i + 2];
                                            Type.cbStraightFlush[Num[7]++] = Index[i + 3];
                                            Type.btStraightFlush++;
                                        }
                                    }
                                    else if (4 >= (this.GetCardLogicValue(cbCardData[Index[i]]) - this.GetCardLogicValue(cbCardData[Index[i + 2]]))) {
                                        let straightUnfounded = false
                                        for (let j = i; j < i + 2; j++) {
                                            if (this.GetCardLogicValue(cbCardData[Index[j]]) == this.GetCardLogicValue(cbCardData[Index[j + 1]])
                                                && this.GetCardColor(cbCardData[Index[j]]) == this.GetCardColor(cbCardData[Index[j + 1]])) {
                                                straightUnfounded = true;
                                                break;
                                            }
                                        }
                                        if (!straightUnfounded) {
                                            Type.bStraightFlush = this.btrue;
                                            Type.cbStraightFlush[Num[7]++] = 0;
                                            Type.cbStraightFlush[Num[7]++] = 1;
                                            Type.cbStraightFlush[Num[7]++] = Index[i];
                                            Type.cbStraightFlush[Num[7]++] = Index[i + 1];
                                            Type.cbStraightFlush[Num[7]++] = Index[i + 2];
                                            Type.btStraightFlush++;
                                        }
                                    }

                                }
                                else if (SameColorCount - i == 4) {
                                    if (4 >= (this.GetCardLogicValue(cbCardData[Index[i]]) - this.GetCardLogicValue(cbCardData[Index[i + 3]]))) {
                                        let straightUnfounded = false
                                        for (let j = i; j < i + 3; j++) {
                                            if (this.GetCardLogicValue(cbCardData[Index[j]]) == this.GetCardLogicValue(cbCardData[Index[j + 1]])
                                                && this.GetCardColor(cbCardData[Index[j]]) == this.GetCardColor(cbCardData[Index[j + 1]])) {
                                                straightUnfounded = true;
                                                break;
                                            }
                                        }
                                        if (!straightUnfounded) {
                                            Type.bStraightFlush = this.btrue;
                                            Type.cbStraightFlush[Num[7]++] = 0;
                                            Type.cbStraightFlush[Num[7]++] = Index[i];
                                            Type.cbStraightFlush[Num[7]++] = Index[i + 1];
                                            Type.cbStraightFlush[Num[7]++] = Index[i + 2];
                                            Type.cbStraightFlush[Num[7]++] = Index[i + 3];
                                            Type.btStraightFlush++;
                                        }
                                    }
                                    else if (4 >= (this.GetCardLogicValue(cbCardData[Index[i]]) - this.GetCardLogicValue(cbCardData[Index[i + 2]]))) {
                                        let straightUnfounded = false
                                        for (let j = i; j < i + 2; j++) {
                                            if (this.GetCardLogicValue(cbCardData[Index[j]]) == this.GetCardLogicValue(cbCardData[Index[j + 1]])
                                                && this.GetCardColor(cbCardData[Index[j]]) == this.GetCardColor(cbCardData[Index[j + 1]])) {
                                                straightUnfounded = true;
                                                break;
                                            }
                                        }
                                        if (!straightUnfounded) {
                                            Type.bStraightFlush = this.btrue;
                                            Type.cbStraightFlush[Num[7]++] = 0;
                                            Type.cbStraightFlush[Num[7]++] = 1;
                                            Type.cbStraightFlush[Num[7]++] = Index[i];
                                            Type.cbStraightFlush[Num[7]++] = Index[i + 1];
                                            Type.cbStraightFlush[Num[7]++] = Index[i + 2];

                                            Type.btStraightFlush++;
                                        }
                                    }
                                }
                                else if (SameColorCount - i == 3) {
                                    if (4 >= (this.GetCardLogicValue(cbCardData[Index[i]]) - this.GetCardLogicValue(cbCardData[Index[i + 2]]))) {
                                        let straightUnfounded = false
                                        for (let j = i; j < i + 2; j++) {
                                            if (this.GetCardLogicValue(cbCardData[Index[j]]) == this.GetCardLogicValue(cbCardData[Index[j + 1]])
                                                && this.GetCardColor(cbCardData[Index[j]]) == this.GetCardColor(cbCardData[Index[j + 1]])) {
                                                straightUnfounded = true;
                                                break;
                                            }
                                        }
                                        if (!straightUnfounded) {
                                            Type.bStraightFlush = this.btrue;
                                            Type.cbStraightFlush[Num[7]++] = 0;
                                            Type.cbStraightFlush[Num[7]++] = 1;
                                            Type.cbStraightFlush[Num[7]++] = Index[i];
                                            Type.cbStraightFlush[Num[7]++] = Index[i + 1];
                                            Type.cbStraightFlush[Num[7]++] = Index[i + 2];

                                            Type.btStraightFlush++;
                                        }
                                    }
                                }
                            }

                        }


                        for(let j=0;j<SameColorCount;j++)
                        {
                            if(SameColorCount-j>=5)
                            {
                                Type.cbFlush[Num[4]++]=Index[j];
                                Type.cbFlush[Num[4]++]=Index[j+1];
                                Type.cbFlush[Num[4]++]=Index[j+2];
                                Type.cbFlush[Num[4]++]=Index[j+3];
                                Type.cbFlush[Num[4]++]=Index[j+4];
                                Type.btFlush++;
                            }
                            else
                            {
                                break;
                            }
                        }
                    }
                    if(bCardCount-i<3)
                    {
                        break;
                    }
                    Number=0;
                    SssLib.ZeroMemory(Index,SssLib.sizeof(Index));
                    SameColorCount=1;
                    Index[Number++]=i;
                    bCardColor=this.GetCardColor(CardData[i]);
                }
            }
        }
        else
        {
            let SameColorCount=1;
            let bCardColor = this.GetCardColor(CardData[0]) ;
            Index[Number++]=0;

            for(let i=1;i<bCardCount;i++)
            {
                if(bCardColor==this.GetCardColor(CardData[i]))
                {
                    SameColorCount++;
                    Index[Number++]=i;
                }
                if(bCardColor!=this.GetCardColor(CardData[i])||i==bCardCount-1)
                {
                    if(SameColorCount>=5)
                    {
                        Type.bFlush=this.btrue;

                        for(let j=0;j<SameColorCount;j++)
                        {
                            for(let k=0;k<bCardCount;k++)
                            {
                                if(this.GetCardLogicValue(CardData[Index[j]])==this.GetCardLogicValue(cbCardData[k])
                                    &&this.GetCardColor(CardData[Index[j]])==this.GetCardColor(cbCardData[k]))
                                {
                                    Index[j]=k;
                                    break;
                                }
                            }
                        }
                        let SaveIndex=0;
                        for(let j=0;j<SameColorCount;j++)
                        {
                            for(let k=j+1;k<SameColorCount;k++)
                            {
                                if(Index[j]>Index[k])
                                {
                                    SaveIndex=Index[j];
                                    Index[j]=Index[k];
                                    Index[k]=SaveIndex;
                                }
                            }
                        }
                        //判断到花色和数值相同的时候，index会重复记录成一个下标
                        //因为手牌中为降序排列，所以碰到相同index的时候，一个下标增加1
                        //该操作为了解决 同花提示只提示4张的问题
                        for (let j = 0; j < SameColorCount; j++) {
                            if(j<SameColorCount-1&&this.GetCardLogicValue(cbCardData[Index[j]])==this.GetCardLogicValue(cbCardData[Index[j+1]])){
                                Index[j+1]=Index[j]+1;
                            }
                        }


                        for(let j=0;j<SameColorCount;j++)
                        {
                            if(SameColorCount-j>=5)
                            {
                                Type.cbFlush[Num[4]++]=Index[j];
                                Type.cbFlush[Num[4]++]=Index[j+1];
                                Type.cbFlush[Num[4]++]=Index[j+2];
                                Type.cbFlush[Num[4]++]=Index[j+3];
                                Type.cbFlush[Num[4]++]=Index[j+4];
                                Type.btFlush++;

                                //同花A2345特殊处理
                                if (this.GetCardLogicValue(cbCardData[Index[j]])==14)
                                {
                                    for(let i =j+1;i<SameColorCount;i++)
                                    {

                                        if(this.GetCardLogicValue(cbCardData[Index[i]])==5)
                                        {
                                            if (SameColorCount-i>=4)
                                            {
                                                let straightUnfounded = false
                                                for (let k = i; k < i + 3; k++) {
                                                    if (this.GetCardLogicValue(cbCardData[Index[k]]) == this.GetCardLogicValue(cbCardData[Index[k + 1]])
                                                        && this.GetCardColor(cbCardData[Index[k]]) == this.GetCardColor(cbCardData[Index[k + 1]])) {
                                                        straightUnfounded = true;
                                                        break;
                                                    }
                                                }
                                                if(!straightUnfounded){
                                                    Type.bStraightFlush=this.btrue;
                                                    Type.cbStraightFlush[Num[7]++]=Index[j];//A
                                                    Type.cbStraightFlush[Num[7]++]=Index[i];//5
                                                    Type.cbStraightFlush[Num[7]++]=Index[i+1];//4
                                                    Type.cbStraightFlush[Num[7]++]=Index[i+2];//3
                                                    Type.cbStraightFlush[Num[7]++]=Index[i+3];//2
                                                    Type.btStraightFlush++;
                                                }
                                            }
                                        }

                                    }
                                }

                                if(this.GetCardLogicValue(cbCardData[Index[j]])-this.GetCardLogicValue(cbCardData[Index[j+4]])==4)
                                {
                                    let straightUnfounded = false
                                    for (let k = j; k < j + 4; k++) {
                                        if (this.GetCardLogicValue(cbCardData[Index[k]]) == this.GetCardLogicValue(cbCardData[Index[k + 1]])
                                            && this.GetCardColor(cbCardData[Index[k]]) == this.GetCardColor(cbCardData[Index[k + 1]])) {
                                            straightUnfounded = true;
                                            break;
                                        }
                                    }
                                    if(!straightUnfounded){
                                        Type.bStraightFlush=this.btrue;
                                        Type.cbStraightFlush[Num[7]++]=Index[j];
                                        Type.cbStraightFlush[Num[7]++]=Index[j+1];
                                        Type.cbStraightFlush[Num[7]++]=Index[j+2];
                                        Type.cbStraightFlush[Num[7]++]=Index[j+3];
                                        Type.cbStraightFlush[Num[7]++]=Index[j+4];
                                        Type.btStraightFlush++;
                                    }
                                }
                            }
                            else
                            {
                                break;
                            }
                        }
                    }
                    if(bCardCount-i<5)
                    {
                        break;
                    }
                    Number=0;
                    SssLib.ZeroMemory(Index,SssLib.sizeof(Index));
                    SameColorCount=1;
                    Index[Number++]=i;
                    bCardColor=this.GetCardColor(CardData[i]);
                }
            }

        }
        return Type;
    }

    AppendCard( bAppendCard, bAppendCount, bCardData, bCardCount )
    {
        SssLib.ASSERT(bAppendCount+bCardCount<=13);
        for(let i=0;i<bAppendCount;i++)
        {
            bCardData[bCardCount+i]=bAppendCard[i];
        }
        bCardCount+=bAppendCount;
        return this.btrue;
    }

    GetCardCount(   bCardData )
    {
        let Number=0;
        if(0==this.GetCardLogicValue(bCardData[1])&&0==this.GetCardLogicValue(bCardData[2]))
        {
            return 0;
        }
        else
        {
            for(let i=0;i<5;i++)
            {
                if(this.GetCardLogicValue(bCardData[i])>0)
                {
                    Number++;
                }
                else
                {
                    break;
                }
            }
        }
        return Number;
    }

    TheBestCard( tagCardType, btHandCardData, btHandCardCount, btFrontCard, btMidCard, btBackCard )
    {
        if(btHandCardCount!=13)
        {
            return;
        }
        let btCardCount=btHandCardCount;
        let btCardData=SssLib.oneDArr(13);
        SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
        let btCardData1=SssLib.oneDArr(13);
        let btCardData2=SssLib.oneDArr(13);
        SssLib.ZeroMemory(btCardData1,SssLib.sizeof(btCardData1));
        SssLib.ZeroMemory(btCardData2,SssLib.sizeof(btCardData2));
        let btCardCount1=0;
        let btCardCount2=0;
        let FrontCard=SssLib.oneDArr(3);
        let MidCard=SssLib.oneDArr(5);
        let BackCard=SssLib.oneDArr(5);
        let btAllShuiShu=0;
        SssLib.ZeroMemory(FrontCard,SssLib.sizeof(FrontCard));
        SssLib.ZeroMemory(MidCard,SssLib.sizeof(MidCard));
        SssLib.ZeroMemory(BackCard,SssLib.sizeof(BackCard));
        let FrontFrontCard=SssLib.oneDArr(3);
        let FrontMidCard=SssLib.oneDArr(5);
        let FrontBackCard=SssLib.oneDArr(5);
        let btFrontAllShuiShu=0;
        SssLib.ZeroMemory(FrontFrontCard,SssLib.sizeof(FrontFrontCard));
        SssLib.ZeroMemory(FrontMidCard,SssLib.sizeof(FrontMidCard));
        SssLib.ZeroMemory(FrontBackCard,SssLib.sizeof(FrontBackCard));
        let bCycling=this.btrue;
        let bFront=this.bfalse;
        let bMid=this.bfalse;
        let bBack=this.bfalse;
        let bFirst=this.btrue;
        let btFront=0;
        let btMid=0;
        let btBack=0;
        let tagCardType1=new tagAnalyseType();
        let tagCardType2=new tagAnalyseType();
        SssLib.ZeroMemory(tagCardType1,SssLib.sizeof(tagCardType1));
        SssLib.ZeroMemory(tagCardType2,SssLib.sizeof(tagCardType2));
        let btTemp=SssLib.oneDArr(13);
        SssLib.ZeroMemory(btTemp,SssLib.sizeof(btTemp));

        if(tagCardType.bStraightFlush)    //有同花顺
        {
            for(let i=0;i<tagCardType.btStraightFlush;i++)
            {
                SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                btCardCount=btHandCardCount;
                for(let j=0;j<5;j++)
                {
                    BackCard[j]=btCardData[tagCardType.cbStraightFlush[i*5+j]];
                }
                this.RemoveCard(BackCard,5,btCardData,btCardCount);
                btCardCount1= btCardCount-=5;
                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                tagCardType1=this.GetType(btCardData1,btCardCount1);
                if(tagCardType1.bStraightFlush)      //有同花顺
                {
                    for(let j=0;j<tagCardType1.btStraightFlush;j++)
                    {
                        btCardCount1=btCardCount;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);

                        for(let k=0;k<5;k++)
                        {
                            MidCard[k]=btCardData1[tagCardType1.cbStraightFlush[j*5+k]];
                        }
                        this.RemoveCard(MidCard,5,btCardData1,btCardCount1);
                        for(let k=0;k<3;k++)
                        {
                            FrontCard[k]=btCardData1[k];
                        }
                        if(bFirst)
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                bFirst=this.bfalse;
                            }
                        }
                        else
                        {
                            btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                    ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                btFrontAllShuiShu=btAllShuiShu;
                            }
                        }
                    }

                }
                else if(tagCardType1.bFourSame)      //有铁支
                {
                    for(let j=0;j<tagCardType1.btFourSame;j++)
                    {
                        btCardCount1=btCardCount;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);

                        for(let k=0;k<4;k++)
                        {
                            MidCard[k]=btCardData1[tagCardType1.cbFourSame[j*4+k]];
                        }
                        this.RemoveCard(MidCard,4,btCardData1,btCardCount1);
                        btCardCount2=btCardCount1-=4;
                        SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                        tagCardType2=this.GetType(btCardData2,btCardCount2);
                        if(tagCardType2.bThreeSame)  //剩下三条
                        {
                            for(let k=3;k>=0;k--)
                            {
                                if(this.GetCardLogicValue(btCardData2[k])!=this.GetCardLogicValue(btCardData2[tagCardType2.cbThreeSame[0]]))
                                {
                                    btTemp[0]=MidCard[4]=btCardData2[k];
                                    break;
                                }
                            }
                            this.RemoveCard(btTemp,1,btCardData2,btCardCount2);
                            SssLib.CopyMemory(FrontCard,btCardData2,SssLib.sizeof(FrontCard));
                        }
                        else if(tagCardType2.bTwoPare)//剩下两对
                        {
                            MidCard[4]=btCardData2[tagCardType2.cbTwoPare[3]];
                            FrontCard[0]=btCardData2[tagCardType2.cbTwoPare[0]];
                            FrontCard[1]=btCardData2[tagCardType2.cbTwoPare[1]];
                            FrontCard[2]=btCardData2[tagCardType2.cbTwoPare[2]];
                        }
                        else if(tagCardType2.bOnePare)//剩下一对
                        {
                            for(let k=3;k>=0;k--)
                            {
                                if(this.GetCardLogicValue(btCardData2[k])!=this.GetCardLogicValue(btCardData2[tagCardType2.cbOnePare[0]]))
                                {
                                    btTemp[0]=MidCard[4]=btCardData2[k];
                                    break;
                                }
                            }
                            this.RemoveCard(btTemp,1,btCardData2,btCardCount2);
                            SssLib.CopyMemory(FrontCard,btCardData2,SssLib.sizeof(FrontCard));
                        }
                        else                         //剩下散牌
                        {
                            MidCard[4]=btCardData2[3];
                            SssLib.CopyMemory(FrontCard,btCardData2,SssLib.sizeof(FrontCard));
                        }
                        if(bFirst)
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                bFirst=this.bfalse;
                            }
                        }
                        else
                        {
                            btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                    ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                btFrontAllShuiShu=btAllShuiShu;
                            }
                        }
                    }
                }
                else
                {
                    if(tagCardType1.bGourd)         //有葫芦
                    {
                        let bThreeSame=this.bfalse;
                        for(let j=0;j<tagCardType1.btThreeSame;j++)     //前敦三条
                        {
                            btCardCount1=btCardCount;
                            SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);

                            for(let k=0;k<3;k++)
                            {
                                FrontCard[k]=btCardData1[tagCardType1.cbThreeSame[j*3+k]];
                            }
                            this.RemoveCard(FrontCard,3,btCardData1,btCardCount1);
                            btCardCount2=btCardCount1-=3;
                            SssLib.CopyMemory(MidCard,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                            if(bFirst)
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                {
                                    bThreeSame=this.btrue;
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                    bFirst=this.bfalse;
                                }
                            }
                            else
                            {
                                btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                        ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                                {
                                    bThreeSame=this.btrue;
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    btFrontAllShuiShu=btAllShuiShu;
                                }
                            }
                        }
                        if(bThreeSame==this.bfalse)                          //前敦不能为三条
                        {
                            for(let j=0;j<tagCardType1.btGourd;j++)     //中敦葫芦
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<5;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbGourd[j*5+k]];
                                }
                                this.RemoveCard(MidCard,5,btCardData1,btCardCount1);
                                SssLib.CopyMemory(FrontCard,btCardData1,SssLib.sizeof(FrontCard));
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                            ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=btAllShuiShu;
                                    }
                                }
                            }
                        }

                    }
                    else if(tagCardType1.bFlush)         //有同花
                    {
                        let bThreeSame=this.bfalse;
                        if(tagCardType1.bThreeSame)      //有三条
                        {
                            for(let j=0;j<tagCardType1.btThreeSame;j++)     //前敦三条
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);

                                for(let k=0;k<3;k++)
                                {
                                    FrontCard[k]=btCardData1[tagCardType1.cbThreeSame[j*3+k]];
                                }
                                this.RemoveCard(FrontCard,3,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=3;
                                SssLib.CopyMemory(MidCard,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        bThreeSame=this.btrue;
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                            ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                                    {
                                        bThreeSame=this.btrue;
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=btAllShuiShu;
                                    }
                                }
                            }
                        }
                        if(bThreeSame==this.bfalse)                          //前敦不能为三条
                        {
                            for(let j=0;j<tagCardType1.btFlush;j++)    //中敦同花
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<5;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbFlush[j*5+k]];
                                }
                                this.RemoveCard(MidCard,5,btCardData1,btCardCount1);
                                SssLib.CopyMemory(FrontCard,btCardData1,SssLib.sizeof(FrontCard));
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                            ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=btAllShuiShu;
                                    }
                                }
                            }
                            if(tagCardType1.bStraight)                 //有顺子
                            {
                                for(let j=0;j<tagCardType1.btStraight;j++)    //中敦顺子
                                {
                                    btCardCount1=btCardCount;
                                    SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                    for(let k=0;k<5;k++)
                                    {
                                        MidCard[k]=btCardData1[tagCardType1.cbStraight[j*5+k]];
                                    }
                                    this.RemoveCard(MidCard,5,btCardData1,btCardCount1);
                                    SssLib.CopyMemory(FrontCard,btCardData1,SssLib.sizeof(FrontCard));
                                    if(bFirst)
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                            bFirst=this.bfalse;
                                        }
                                    }
                                    else
                                    {
                                        btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                                ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            btFrontAllShuiShu=btAllShuiShu;
                                        }
                                    }
                                }
                            }
                            if(tagCardType1.bThreeSame)                //有三条
                            {
                                for(let j=0;j<tagCardType1.btThreeSame;j++)    //中敦三条
                                {
                                    btCardCount1=btCardCount;
                                    SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                    for(let k=0;k<3;k++)
                                    {
                                        MidCard[k]=btCardData1[tagCardType1.cbThreeSame[j*3+k]];
                                    }
                                    this.RemoveCard(MidCard,3,btCardData1,btCardCount1);
                                    MidCard[3]=btCardData1[3];
                                    MidCard[4]=btCardData1[4];
                                    SssLib.CopyMemory(FrontCard,btCardData1,SssLib.sizeof(FrontCard));
                                    if(bFirst)
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                            bFirst=this.bfalse;
                                        }
                                    }
                                    else
                                    {
                                        btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                                ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            btFrontAllShuiShu=btAllShuiShu;
                                        }
                                    }
                                }
                            }
                        }

                    }
                    else if(tagCardType1.bStraight)      //有顺子
                    {
                        let bThreeSame=this.bfalse;
                        if(tagCardType1.bThreeSame)      //有三条
                        {
                            for(let j=0;j<tagCardType1.btThreeSame;j++)     //前敦三条
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);

                                for(let k=0;k<3;k++)
                                {
                                    FrontCard[k]=btCardData1[tagCardType1.cbThreeSame[j*3+k]];
                                }
                                this.RemoveCard(FrontCard,3,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=3;
                                SssLib.CopyMemory(MidCard,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        bThreeSame=this.btrue;
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                            ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                                    {
                                        bThreeSame=this.btrue;
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=btAllShuiShu;
                                    }
                                }
                            }
                        }
                        if(bThreeSame==this.bfalse)                          //前敦不能为三条
                        {
                            for(let j=0;j<tagCardType1.btStraight;j++)    //中敦顺子
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<5;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbStraight[j*5+k]];
                                }
                                this.RemoveCard(MidCard,5,btCardData1,btCardCount1);
                                SssLib.CopyMemory(FrontCard,btCardData1,SssLib.sizeof(FrontCard));
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                            ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=btAllShuiShu;
                                    }
                                }
                            }
                            if(tagCardType1.bThreeSame)                //有三条
                            {
                                for(let j=0;j<tagCardType1.btThreeSame;j++)    //中敦三条
                                {
                                    btCardCount1=btCardCount;
                                    SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                    for(let k=0;k<3;k++)
                                    {
                                        MidCard[k]=btCardData1[tagCardType1.cbThreeSame[j*3+k]];
                                    }
                                    this.RemoveCard(MidCard,3,btCardData1,btCardCount1);
                                    MidCard[3]=btCardData1[3];
                                    MidCard[4]=btCardData1[4];
                                    SssLib.CopyMemory(FrontCard,btCardData1,SssLib.sizeof(FrontCard));
                                    if(bFirst)
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                            bFirst=this.bfalse;
                                        }
                                    }
                                    else
                                    {
                                        btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                                ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            btFrontAllShuiShu=btAllShuiShu;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if(tagCardType1.bThreeSame)     //有三条
                    {
                        for(let j=0;j<tagCardType1.btThreeSame;j++)    //中敦三条
                        {
                            btCardCount1=btCardCount;
                            SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                            for(let k=0;k<3;k++)
                            {
                                MidCard[k]=btCardData1[tagCardType1.cbThreeSame[j*3+k]];
                            }
                            this.RemoveCard(MidCard,3,btCardData1,btCardCount1);
                            MidCard[3]=btCardData1[3];
                            MidCard[4]=btCardData1[4];
                            SssLib.CopyMemory(FrontCard,btCardData1,SssLib.sizeof(FrontCard));
                            if(bFirst)
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                    bFirst=this.bfalse;
                                }
                            }
                            else
                            {
                                btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                        ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    btFrontAllShuiShu=btAllShuiShu;
                                }
                            }
                        }
                    }
                    else if(tagCardType1.bTwoPare)       //有两对
                    {
                        if(tagCardType1.btOnePare>=3)
                        {
                            btCardCount1=btCardCount;
                            SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                            btTemp[0]=FrontCard[0]=btCardData1[tagCardType1.cbOnePare[0]];
                            btTemp[1]=FrontCard[1]=btCardData1[tagCardType1.cbOnePare[1]];
                            btTemp[2]=MidCard[0]=btCardData1[tagCardType1.cbOnePare[2]];
                            btTemp[3]=MidCard[1]=btCardData1[tagCardType1.cbOnePare[3]];
                            btTemp[4]=MidCard[2]=btCardData1[tagCardType1.cbOnePare[4]];
                            btTemp[5]=MidCard[3]=btCardData1[tagCardType1.cbOnePare[5]];
                            this.RemoveCard(btTemp,6,btCardData1,btCardCount1);
                            FrontCard[2]=btCardData1[0];
                            MidCard[4]=btCardData1[1];
                            if(bFirst)
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                    bFirst=this.bfalse;
                                }
                            }
                            else
                            {
                                btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                        ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    btFrontAllShuiShu=btAllShuiShu;
                                }
                            }
                        }
                        else
                        {
                            for(let j=0;j<tagCardType1.btTwoPare;j++)    //中敦两对
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<4;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbTwoPare[j*4+k]];
                                }
                                this.RemoveCard(MidCard,4,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=4;
                                SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                tagCardType2=this.GetType(btCardData2,btCardCount2);
                                if(tagCardType2.bTwoPare)     //剩下两对
                                {
                                    MidCard[4]=btCardData2[tagCardType2.cbTwoPare[3]];
                                    FrontCard[0]=btCardData2[tagCardType2.cbTwoPare[0]];
                                    FrontCard[1]=btCardData2[tagCardType2.cbTwoPare[1]];
                                    FrontCard[2]=btCardData2[tagCardType2.cbTwoPare[2]];
                                }
                                else if(tagCardType2.bOnePare) //剩下一对
                                {
                                    for(let k=3;k>=0;k--)
                                    {
                                        if(this.GetCardLogicValue(btCardData2[k])!=this.GetCardLogicValue(btCardData2[tagCardType2.cbOnePare[0]]))
                                        {
                                            btTemp[0]=MidCard[4]=btCardData2[k];
                                            break;
                                        }
                                    }
                                    this.RemoveCard(btTemp,1,btCardData2,btCardCount2);
                                    SssLib.CopyMemory(FrontCard,btCardData2,SssLib.sizeof(FrontCard));
                                }
                                else                           //剩下散牌
                                {
                                    MidCard[4]=btCardData2[3];
                                    SssLib.CopyMemory(FrontCard,btCardData2,SssLib.sizeof(FrontCard));
                                }
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                            ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=btAllShuiShu;
                                    }
                                }
                            }
                        }

                    }
                    else if(tagCardType1.bOnePare)       //有一对
                    {
                        for(let j=0;j<tagCardType1.btOnePare;j++)    //中敦一对
                        {
                            btCardCount1=btCardCount;
                            SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                            for(let k=0;k<2;k++)
                            {
                                MidCard[k]=btCardData1[tagCardType1.cbOnePare[j*2+k]];
                            }
                            this.RemoveCard(MidCard,2,btCardData1,btCardCount1);
                            btCardCount2=btCardCount1-=2;
                            SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                            for(let k=0;k<6;k++)
                            {
                                if(k<3)
                                {
                                    FrontCard[k]=btCardData2[k];
                                }
                                else
                                {
                                    MidCard[k-1]=btCardData2[k];
                                }
                            }
                            if(bFirst)
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                    bFirst=this.bfalse;
                                }
                            }
                            else
                            {
                                btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                        ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    btFrontAllShuiShu=btAllShuiShu;
                                }
                            }
                        }
                    }
                    else                                 //散牌
                    {
                        btCardCount1=btCardCount;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        MidCard[0]=btCardData1[0];
                        MidCard[1]=btCardData1[4];
                        MidCard[2]=btCardData1[5];
                        MidCard[3]=btCardData1[6];
                        MidCard[4]=btCardData1[7];

                        FrontCard[0]=btCardData1[1];
                        FrontCard[1]=btCardData1[2];
                        FrontCard[2]=btCardData1[3];
                        if(bFirst)
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                bFirst=this.bfalse;
                            }
                        }
                        else
                        {
                            btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                    ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                btFrontAllShuiShu=btAllShuiShu;
                            }
                        }
                    }
                }

            }
        }
        else if(tagCardType.bFourSame)   //铁支
        {
            for(let i=0;i<tagCardType.btFourSame;i++)
            {
                SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                btCardCount=btHandCardCount;
                for(let j=0;j<4;j++)
                {
                    BackCard[j]=btCardData[tagCardType.cbFourSame[i*4+j]];
                }
                this.RemoveCard(BackCard,4,btCardData,btCardCount);
                btCardCount1= btCardCount-=4;
                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                tagCardType1=this.GetType(btCardData1,btCardCount1);
                if(tagCardType1.bFourSame)      //有铁支
                {
                    for(let j=0;j<tagCardType1.btFourSame;j++)
                    {
                        btCardCount1=btCardCount;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        for(let k=0;k<4;k++)
                        {
                            MidCard[k]=btCardData1[tagCardType1.cbFourSame[j*4+k]];
                        }
                        this.RemoveCard(MidCard,4,btCardData1,btCardCount1);
                        btCardCount2=btCardCount1-=4;
                        SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                        tagCardType2=this.GetType(btCardData2,btCardCount2);
                        if(tagCardType2.bFourSame)    //剩下铁支
                        {
                            if(this.GetCardLogicValue(btCardData2[0])==this.GetCardLogicValue(btCardData2[1]))
                            {
                                BackCard[4]=btCardData2[4];
                                MidCard[4]=btCardData2[3];
                                SssLib.CopyMemory(FrontCard,btCardData2,SssLib.sizeof(FrontCard));
                            }
                            else
                            {
                                BackCard[4]=btCardData2[0];
                                MidCard[4]=btCardData2[4];
                                SssLib.CopyMemory2(FrontCard,btCardData2,SssLib.sizeof(FrontCard),1);
                            }
                        }
                        else if(tagCardType2.bGourd)  //剩下葫芦
                        {
                            BackCard[4]=btCardData2[tagCardType2.cbGourd[4]];
                            MidCard[4]=btCardData2[tagCardType2.cbGourd[3]];
                            FrontCard[0]=btCardData2[tagCardType2.cbGourd[0]];
                            FrontCard[1]=btCardData2[tagCardType2.cbGourd[1]];
                            FrontCard[2]=btCardData2[tagCardType2.cbGourd[2]];
                        }
                        else if(tagCardType2.bFlush)  //剩下同花
                        {
                            BackCard[4]=btCardData2[tagCardType2.cbFlush[4]];
                            MidCard[4]=btCardData2[tagCardType2.cbFlush[3]];
                            FrontCard[0]=btCardData2[tagCardType2.cbFlush[0]];
                            FrontCard[1]=btCardData2[tagCardType2.cbFlush[1]];
                            FrontCard[2]=btCardData2[tagCardType2.cbFlush[2]];
                        }
                        else if(tagCardType2.bStraight)  //剩下顺子
                        {
                            BackCard[4]=btCardData2[tagCardType2.cbStraight[4]];
                            MidCard[4]=btCardData2[tagCardType2.cbStraight[3]];
                            FrontCard[0]=btCardData2[tagCardType2.cbStraight[0]];
                            FrontCard[1]=btCardData2[tagCardType2.cbStraight[1]];
                            FrontCard[2]=btCardData2[tagCardType2.cbStraight[2]];
                        }
                        else if(tagCardType2.bThreeSame)  //剩下三条
                        {
                            for(let k=0;k<3;k++)
                            {
                                btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbThreeSame[k]];
                            }
                            this.RemoveCard(btTemp,3,btCardData2,btCardCount2);
                            BackCard[4]=btCardData2[1];
                            MidCard[4]=btCardData2[0];
                        }
                        else if(tagCardType2.bTwoPare)//剩下两对
                        {
                            for(let k=4;k>=0;k--)
                            {
                                if(this.GetCardLogicValue(btCardData2[k])!=this.GetCardLogicValue(btCardData2[tagCardType2.cbTwoPare[0]])
                                    &&this.GetCardLogicValue(btCardData2[k])!=this.GetCardLogicValue(btCardData2[tagCardType2.cbTwoPare[2]]))
                                {
                                    btTemp[0]=BackCard[4]=btCardData2[k];
                                    break;
                                }
                            }
                            //this.RemoveCard(btTemp,1,btCardData2,btCardCount2);
                            MidCard[4]=btCardData2[tagCardType2.cbTwoPare[3]];
                            FrontCard[0]=btCardData2[tagCardType2.cbTwoPare[0]];
                            FrontCard[1]=btCardData2[tagCardType2.cbTwoPare[1]];
                            FrontCard[2]=btCardData2[tagCardType2.cbTwoPare[2]];
                        }
                        else if(tagCardType2.bOnePare)//剩下一对
                        {
                            btTemp[0]=FrontCard[0]=btCardData2[tagCardType2.cbOnePare[0]];
                            btTemp[1]=FrontCard[1]=btCardData2[tagCardType2.cbOnePare[1]];
                            this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                            FrontCard[2]=btCardData2[0];
                            BackCard[4]=btCardData2[2];
                            MidCard[4]=btCardData2[1];
                        }
                        else                         //剩下散牌
                        {
                            BackCard[4]=btCardData2[4];
                            MidCard[4]=btCardData2[3];
                            SssLib.CopyMemory(FrontCard,btCardData2,SssLib.sizeof(FrontCard));
                        }
                        if(bFirst)
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                bFirst=this.bfalse;
                            }
                        }
                        else
                        {
                            btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                    ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                btFrontAllShuiShu=btAllShuiShu;
                            }
                        }
                    }
                }
                else
                {
                    if(tagCardType1.bGourd)         //有葫芦
                    {
                        let bThreeSame=this.bfalse;
                        for(let j=0;j<tagCardType1.btThreeSame;j++)     //前敦三条
                        {
                            btCardCount1=btCardCount;
                            SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);

                            for(let k=0;k<3;k++)
                            {
                                FrontCard[k]=btCardData1[tagCardType1.cbThreeSame[j*3+k]];
                            }
                            this.RemoveCard(FrontCard,3,btCardData1,btCardCount1);
                            btCardCount2=btCardCount1-=3;
                            SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                            tagCardType2=this.GetType(btCardData2,btCardCount2);
                            if(tagCardType2.bGourd)             //剩下葫芦
                            {
                                for(let k=0;k<5;k++)
                                {
                                    btTemp[k]=MidCard[k]=btCardData2[tagCardType2.cbGourd[k]];
                                }
                                this.RemoveCard(btTemp,5,btCardData2,btCardCount2);
                                BackCard[4]=btCardData2[0];
                            }
                            else if(tagCardType2.bFlush)        //剩下同花
                            {
                                for(let k=0;k<5;k++)
                                {
                                    btTemp[k]=MidCard[k]=btCardData2[tagCardType2.cbFlush[k]];
                                }
                                this.RemoveCard(btTemp,5,btCardData2,btCardCount2);
                                BackCard[4]=btCardData2[0];
                            }
                            else if(tagCardType2.bStraight)     //剩下顺子
                            {
                                for(let k=0;k<5;k++)
                                {
                                    btTemp[k]=MidCard[k]=btCardData2[tagCardType2.cbStraight[k]];
                                }
                                this.RemoveCard(btTemp,5,btCardData2,btCardCount2);
                                BackCard[4]=btCardData2[0];
                            }
                            else if(tagCardType2.bThreeSame)    //剩下三条
                            {
                                for(let k=0;k<3;k++)
                                {
                                    btTemp[k]=MidCard[k]=btCardData2[tagCardType2.cbThreeSame[k]];
                                }
                                this.RemoveCard(btTemp,3,btCardData2,btCardCount2);
                                MidCard[3]=btCardData2[0];
                                MidCard[4]=btCardData2[1];
                                BackCard[4]=btCardData2[2];
                            }
                            else                                //其他
                            {
                                for(let k=0;k<5;k++)
                                {
                                    MidCard[k]=btCardData2[k];
                                }
                                BackCard[4]=btCardData2[5];
                            }
                            if(bFirst)
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                {
                                    bThreeSame=this.btrue;
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                    bFirst=this.bfalse;
                                }
                            }
                            else
                            {
                                btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                        ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                                {
                                    bThreeSame=this.btrue;
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    btFrontAllShuiShu=btAllShuiShu;
                                }
                            }
                        }
                        if(bThreeSame==this.bfalse)                          //前敦不能为三条
                        {
                            for(let j=0;j<tagCardType1.btGourd;j++)     //中敦葫芦
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<5;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbGourd[j*5+k]];
                                }
                                this.RemoveCard(MidCard,5,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=5;
                                SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                tagCardType2=this.GetType(btCardData2,btCardCount2);
                                if(tagCardType2.bTwoPare)            //剩下两对
                                {
                                    BackCard[4]=btCardData2[tagCardType2.cbTwoPare[3]];
                                    for(let k=0;k<3;k++)
                                    {
                                        FrontCard[k]=btCardData2[tagCardType2.cbTwoPare[k]];
                                    }
                                }
                                else if(tagCardType2.bOnePare)       //剩下一对
                                {
                                    for(let k=3;k>=0;k--)
                                    {
                                        if(this.GetCardLogicValue(btCardData2[k])!=this.GetCardLogicValue(btCardData2[tagCardType2.cbOnePare[0]]))
                                        {
                                            btTemp[0]=BackCard[4]=btCardData2[k];
                                            break;
                                        }
                                    }
                                    this.RemoveCard(btTemp,1,btCardData2,btCardCount2);
                                    SssLib.CopyMemory(FrontCard,btCardData2,SssLib.sizeof(FrontCard));
                                }
                                else                                 //剩下散牌
                                {
                                    BackCard[4]=btCardData2[3];
                                    SssLib.CopyMemory(FrontCard,btCardData2,SssLib.sizeof(FrontCard));
                                }
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                            ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=btAllShuiShu;
                                    }
                                }
                            }
                        }

                    }
                    else if(tagCardType1.bFlush)         //有同花
                    {
                        let bThreeSame=this.bfalse;
                        if(tagCardType1.bThreeSame)      //有三条
                        {
                            for(let j=0;j<tagCardType1.btThreeSame;j++)     //前敦三条
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);

                                for(let k=0;k<3;k++)
                                {
                                    FrontCard[k]=btCardData1[tagCardType1.cbThreeSame[j*3+k]];
                                }
                                this.RemoveCard(FrontCard,3,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=3;
                                SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                tagCardType2=this.GetType(btCardData2,btCardCount2);
                                if(tagCardType2.bFlush)        //剩下同花
                                {
                                    for(let k=0;k<5;k++)
                                    {
                                        btTemp[k]=MidCard[k]=btCardData2[tagCardType2.cbFlush[k]];
                                    }
                                    this.RemoveCard(btTemp,5,btCardData2,btCardCount2);
                                    BackCard[4]=btCardData2[0];
                                }
                                else if(tagCardType2.bStraight)     //剩下顺子
                                {
                                    for(let k=0;k<5;k++)
                                    {
                                        btTemp[k]=MidCard[k]=btCardData2[tagCardType2.cbStraight[k]];
                                    }
                                    this.RemoveCard(btTemp,5,btCardData2,btCardCount2);
                                    BackCard[4]=btCardData2[0];
                                }
                                else                                //其他
                                {
                                    for(let k=0;k<5;k++)
                                    {
                                        MidCard[k]=btCardData2[k];
                                    }
                                    BackCard[4]=btCardData2[5];
                                }
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        bThreeSame=this.btrue;
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                            ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                                    {
                                        bThreeSame=this.btrue;
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=btAllShuiShu;
                                    }
                                }
                            }
                        }
                        if(bThreeSame==this.bfalse)                          //前敦不能为三条
                        {
                            for(let j=0;j<tagCardType1.btFlush;j++)    //中敦同花
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<5;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbFlush[j*5+k]];
                                }
                                this.RemoveCard(MidCard,5,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=5;
                                SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                tagCardType2=this.GetType(btCardData2,btCardCount2);
                                if(tagCardType2.bTwoPare)            //剩下两对
                                {
                                    BackCard[4]=btCardData2[tagCardType2.cbTwoPare[3]];
                                    for(let k=0;k<3;k++)
                                    {
                                        FrontCard[k]=btCardData2[tagCardType2.cbTwoPare[k]];
                                    }
                                }
                                else if(tagCardType2.bOnePare)       //剩下一对
                                {
                                    for(let k=3;k>=0;k--)
                                    {
                                        if(this.GetCardLogicValue(btCardData2[k])!=this.GetCardLogicValue(btCardData2[tagCardType2.cbOnePare[0]]))
                                        {
                                            btTemp[0]=BackCard[4]=btCardData2[k];
                                            break;
                                        }
                                    }
                                    this.RemoveCard(btTemp,1,btCardData2,btCardCount2);
                                    SssLib.CopyMemory(FrontCard,btCardData2,SssLib.sizeof(FrontCard));
                                }
                                else                                 //剩下散牌
                                {
                                    BackCard[4]=btCardData2[3];
                                    SssLib.CopyMemory(FrontCard,btCardData2,SssLib.sizeof(FrontCard));
                                }
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                            ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=btAllShuiShu;
                                    }
                                }
                            }
                            if(tagCardType1.bStraight)                 //有顺子
                            {
                                for(let j=0;j<tagCardType1.btStraight;j++)    //中敦顺子
                                {
                                    btCardCount1=btCardCount;
                                    SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                    for(let k=0;k<5;k++)
                                    {
                                        MidCard[k]=btCardData1[tagCardType1.cbStraight[j*5+k]];
                                    }
                                    this.RemoveCard(MidCard,5,btCardData1,btCardCount1);
                                    btCardCount2=btCardCount1-=5;
                                    SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                    tagCardType2=this.GetType(btCardData2,btCardCount2);
                                    if(tagCardType2.bTwoPare)            //剩下两对
                                    {
                                        BackCard[4]=btCardData2[tagCardType2.cbTwoPare[3]];
                                        for(let k=0;k<3;k++)
                                        {
                                            FrontCard[k]=btCardData2[tagCardType2.cbTwoPare[k]];
                                        }
                                    }
                                    else if(tagCardType2.bOnePare)       //剩下一对
                                    {
                                        for(let k=3;k>=0;k--)
                                        {
                                            if(this.GetCardLogicValue(btCardData2[k])!=this.GetCardLogicValue(btCardData2[tagCardType2.cbOnePare[0]]))
                                            {
                                                btTemp[0]=BackCard[4]=btCardData2[k];
                                                break;
                                            }
                                        }
                                        this.RemoveCard(btTemp,1,btCardData2,btCardCount2);
                                        SssLib.CopyMemory(FrontCard,btCardData2,SssLib.sizeof(FrontCard));
                                    }
                                    else                                 //剩下散牌
                                    {
                                        BackCard[4]=btCardData2[3];
                                        SssLib.CopyMemory(FrontCard,btCardData2,SssLib.sizeof(FrontCard));
                                    }
                                    if(bFirst)
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                            bFirst=this.bfalse;
                                        }
                                    }
                                    else
                                    {
                                        btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                                ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            btFrontAllShuiShu=btAllShuiShu;
                                        }
                                    }
                                }
                            }
                            if(tagCardType1.bThreeSame)                //有三条
                            {
                                for(let j=0;j<tagCardType1.btThreeSame;j++)    //中敦三条
                                {
                                    btCardCount1=btCardCount;
                                    SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                    for(let k=0;k<3;k++)
                                    {
                                        MidCard[k]=btCardData1[tagCardType1.cbThreeSame[j*3+k]];
                                    }
                                    this.RemoveCard(MidCard,3,btCardData1,btCardCount1);
                                    MidCard[3]=btCardData1[3];
                                    MidCard[4]=btCardData1[4];
                                    btCardCount2=btCardCount1-=5;
                                    SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                    //剩下散牌
                                    BackCard[4]=btCardData2[3];
                                    SssLib.CopyMemory(FrontCard,btCardData2,SssLib.sizeof(FrontCard));
                                    if(bFirst)
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                            bFirst=this.bfalse;
                                        }
                                    }
                                    else
                                    {
                                        btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                                ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            btFrontAllShuiShu=btAllShuiShu;
                                        }
                                    }
                                }
                            }
                        }

                    }
                    else if(tagCardType1.bStraight)      //有顺子
                    {
                        let bThreeSame=this.bfalse;
                        if(tagCardType1.bThreeSame)      //有三条
                        {
                            for(let j=0;j<tagCardType1.btThreeSame;j++)     //前敦三条
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);

                                for(let k=0;k<3;k++)
                                {
                                    FrontCard[k]=btCardData1[tagCardType1.cbThreeSame[j*3+k]];
                                }
                                this.RemoveCard(FrontCard,3,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=3;
                                SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                tagCardType2=this.GetType(btCardData2,btCardCount2);
                                if(tagCardType2.bStraight)     //剩下顺子
                                {
                                    for(let k=0;k<5;k++)
                                    {
                                        btTemp[k]=MidCard[k]=btCardData2[tagCardType2.cbStraight[k]];
                                    }
                                    this.RemoveCard(btTemp,5,btCardData2,btCardCount2);
                                    BackCard[4]=btCardData2[0];
                                }
                                else                                //其他
                                {
                                    for(let k=0;k<5;k++)
                                    {
                                        MidCard[k]=btCardData2[k];
                                    }
                                    BackCard[4]=btCardData2[5];
                                }
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        bThreeSame=this.btrue;
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                            ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                                    {
                                        bThreeSame=this.btrue;
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=btAllShuiShu;
                                    }
                                }
                            }
                        }
                        if(bThreeSame==this.bfalse)                          //前敦不能为三条
                        {
                            for(let j=0;j<tagCardType1.btStraight;j++)    //中敦顺子
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<5;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbStraight[j*5+k]];
                                }
                                this.RemoveCard(MidCard,5,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=5;
                                SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                tagCardType2=this.GetType(btCardData2,btCardCount2);
                                if(tagCardType2.bTwoPare)            //剩下两对
                                {
                                    BackCard[4]=btCardData2[tagCardType2.cbTwoPare[3]];
                                    for(let k=0;k<3;k++)
                                    {
                                        FrontCard[k]=btCardData2[tagCardType2.cbTwoPare[k]];
                                    }
                                }
                                else if(tagCardType2.bOnePare)       //剩下一对
                                {
                                    for(let k=3;k>=0;k--)
                                    {
                                        if(this.GetCardLogicValue(btCardData2[k])!=this.GetCardLogicValue(btCardData2[tagCardType2.cbOnePare[0]]))
                                        {
                                            btTemp[0]=BackCard[4]=btCardData2[k];
                                            break;
                                        }
                                    }
                                    this.RemoveCard(btTemp,1,btCardData2,btCardCount2);
                                    SssLib.CopyMemory(FrontCard,btCardData2,SssLib.sizeof(FrontCard));
                                }
                                else                                 //剩下散牌
                                {
                                    BackCard[4]=btCardData2[3];
                                    SssLib.CopyMemory(FrontCard,btCardData2,SssLib.sizeof(FrontCard));
                                }
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                            ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=btAllShuiShu;
                                    }
                                }
                            }
                            if(tagCardType1.bThreeSame)                //有三条
                            {
                                for(let j=0;j<tagCardType1.btThreeSame;j++)    //中敦三条
                                {
                                    btCardCount1=btCardCount;
                                    SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                    for(let k=0;k<3;k++)
                                    {
                                        MidCard[k]=btCardData1[tagCardType1.cbThreeSame[j*3+k]];
                                    }
                                    this.RemoveCard(MidCard,3,btCardData1,btCardCount1);
                                    MidCard[3]=btCardData1[3];
                                    MidCard[4]=btCardData1[4];
                                    btCardCount2=btCardCount1-=5;
                                    SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                    //剩下散牌
                                    BackCard[4]=btCardData2[3];
                                    SssLib.CopyMemory(FrontCard,btCardData2,SssLib.sizeof(FrontCard));
                                    if(bFirst)
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                            bFirst=this.bfalse;
                                        }
                                    }
                                    else
                                    {
                                        btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                                ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            btFrontAllShuiShu=btAllShuiShu;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if(tagCardType1.bThreeSame)     //有三条
                    {
                        for(let j=0;j<tagCardType1.btThreeSame;j++)    //中敦三条
                        {
                            btCardCount1=btCardCount;
                            SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                            for(let k=0;k<3;k++)
                            {
                                MidCard[k]=btCardData1[tagCardType1.cbThreeSame[j*3+k]];
                            }
                            this.RemoveCard(MidCard,3,btCardData1,btCardCount1);
                            MidCard[3]=btCardData1[3];
                            MidCard[4]=btCardData1[4];
                            BackCard[4]=btCardData1[5];
                            SssLib.CopyMemory(FrontCard,btCardData1,SssLib.sizeof(FrontCard));
                            if(bFirst)
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                    bFirst=this.bfalse;
                                }
                            }
                            else
                            {
                                btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                        ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    btFrontAllShuiShu=btAllShuiShu;
                                }
                            }
                        }
                    }
                    else if(tagCardType1.bTwoPare)       //有两对
                    {
                        if(tagCardType1.btOnePare>=3)
                        {
                            btCardCount1=btCardCount;
                            SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                            btTemp[0]=FrontCard[0]=btCardData1[tagCardType1.cbOnePare[0]];
                            btTemp[1]=FrontCard[1]=btCardData1[tagCardType1.cbOnePare[1]];
                            btTemp[2]=MidCard[0]=btCardData1[tagCardType1.cbOnePare[2]];
                            btTemp[3]=MidCard[1]=btCardData1[tagCardType1.cbOnePare[3]];
                            btTemp[4]=MidCard[2]=btCardData1[tagCardType1.cbOnePare[4]];
                            btTemp[5]=MidCard[3]=btCardData1[tagCardType1.cbOnePare[5]];
                            this.RemoveCard(btTemp,6,btCardData1,btCardCount1);
                            FrontCard[2]=btCardData1[0];
                            MidCard[4]=btCardData1[1];
                            BackCard[4]=btCardData1[2];
                            if(bFirst)
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                    bFirst=this.bfalse;
                                }
                            }
                            else
                            {
                                btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                        ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    btFrontAllShuiShu=btAllShuiShu;
                                }
                            }
                        }
                        else
                        {
                            for(let j=0;j<tagCardType1.btTwoPare;j++)    //中敦两对
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<4;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbTwoPare[j*4+k]];
                                }
                                this.RemoveCard(MidCard,4,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=4;
                                SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                tagCardType2=this.GetType(btCardData2,btCardCount2);
                                if(tagCardType2.bTwoPare)     //剩下两对
                                {
                                    btTemp[0]=MidCard[4]=btCardData2[tagCardType2.cbTwoPare[3]];
                                    btTemp[1]=FrontCard[0]=btCardData2[tagCardType2.cbTwoPare[0]];
                                    btTemp[2]=FrontCard[1]=btCardData2[tagCardType2.cbTwoPare[1]];
                                    btTemp[3]=FrontCard[2]=btCardData2[tagCardType2.cbTwoPare[2]];
                                    this.RemoveCard(btTemp,4,btCardData2,btCardCount2);
                                    BackCard[4]=btCardData2[0];
                                }
                                else if(tagCardType2.bOnePare) //剩下一对
                                {
                                    btTemp[0]=FrontCard[0]=btCardData2[tagCardType2.cbOnePare[0]];
                                    btTemp[1]=FrontCard[1]=btCardData2[tagCardType2.cbOnePare[1]];
                                    this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                    MidCard[4]=btCardData2[1];
                                    BackCard[4]=btCardData2[2];
                                }
                                else                           //剩下散牌
                                {
                                    BackCard[4]=btCardData2[4];
                                    MidCard[4]=btCardData2[3];
                                    SssLib.CopyMemory(FrontCard,btCardData2,SssLib.sizeof(FrontCard));
                                }
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                            ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=btAllShuiShu;
                                    }
                                }
                            }
                        }

                    }
                    else if(tagCardType1.bOnePare)       //有一对
                    {
                        for(let j=0;j<tagCardType1.btOnePare;j++)    //中敦一对
                        {
                            btCardCount1=btCardCount;
                            SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                            for(let k=0;k<2;k++)
                            {
                                MidCard[k]=btCardData1[tagCardType1.cbOnePare[j*2+k]];
                            }
                            this.RemoveCard(MidCard,2,btCardData1,btCardCount1);
                            btCardCount2=btCardCount1-=2;
                            SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                            BackCard[4]=btCardData2[6];
                            MidCard[2]=btCardData2[5];
                            MidCard[3]=btCardData2[4];
                            MidCard[4]=btCardData2[3];
                            SssLib.CopyMemory(FrontCard,btCardData2,SssLib.sizeof(FrontCard));
                            if(bFirst)
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                    bFirst=this.bfalse;
                                }
                            }
                            else
                            {
                                btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                        ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    btFrontAllShuiShu=btAllShuiShu;
                                }
                            }
                        }
                    }
                    else                                 //散牌
                    {
                        btCardCount1=btCardCount;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        BackCard[4]=btCardData1[8];
                        MidCard[0]=btCardData1[0];
                        MidCard[1]=btCardData1[4];
                        MidCard[2]=btCardData1[5];
                        MidCard[3]=btCardData1[6];
                        MidCard[4]=btCardData1[7];

                        FrontCard[0]=btCardData1[1];
                        FrontCard[1]=btCardData1[2];
                        FrontCard[2]=btCardData1[3];
                        if(bFirst)
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                bFirst=this.bfalse;
                            }
                        }
                        else
                        {
                            btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&(btAllShuiShu>btFrontAllShuiShu
                                    ||(this.CompareCard(FrontFrontCard,FrontCard,3,3,this.bfalse)&&btAllShuiShu==btFrontAllShuiShu)))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                btFrontAllShuiShu=btAllShuiShu;
                            }
                        }
                    }
                }

            }
        }

        else if(tagCardType.bGourd)      //有葫芦
        {
            let bThreeSame=this.bfalse;
            for(let i=0;i<tagCardType.btThreeSame;i++)
            {
                SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                btCardCount=btHandCardCount;
                for(let j=0;j<3;j++)
                {
                    FrontCard[j]=btCardData[tagCardType.cbThreeSame[i*3+j]];
                }
                this.RemoveCard(FrontCard,3,btCardData,btCardCount);
                btCardCount1=btCardCount-=3;
                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                tagCardType1=this.GetType(btCardData1,btCardCount1);
                if(tagCardType1.bGourd)    //有葫芦
                {
                    for(let j=0;j<tagCardType1.btGourd;j++)
                    {
                        btCardCount1=btCardCount;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        for(let k=0;k<5;k++)
                        {
                            BackCard[k]=btCardData1[tagCardType1.cbGourd[j*5+k]];
                        }
                        this.RemoveCard(BackCard,5,btCardData1,btCardCount1);
                        SssLib.CopyMemory(MidCard,btCardData1,SssLib.sizeof(MidCard));
                        if(bFirst)
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                            {
                                bThreeSame=this.btrue;
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                bFirst=this.bfalse;
                            }
                        }
                        else
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                            {
                                bThreeSame=this.btrue;
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                btFrontAllShuiShu=btAllShuiShu;
                            }
                        }
                    }
                }
                if(tagCardType1.bFlush)    //有同花
                {
                    for(let j=0;j<tagCardType1.btFlush;j++)
                    {
                        btCardCount1=btCardCount;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        for(let k=0;k<5;k++)
                        {
                            BackCard[k]=btCardData1[tagCardType1.cbFlush[j*5+k]];
                        }
                        this.RemoveCard(BackCard,5,btCardData1,btCardCount1);
                        SssLib.CopyMemory(MidCard,btCardData1,SssLib.sizeof(MidCard));
                        if(bFirst)
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                            {
                                bThreeSame=this.btrue;
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                bFirst=this.bfalse;
                            }
                        }
                        else
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                            {
                                bThreeSame=this.btrue;
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                btFrontAllShuiShu=btAllShuiShu;
                            }
                        }
                    }
                }
                if(tagCardType1.bStraight)  //有顺子
                {
                    for(let j=0;j<tagCardType1.btStraight;j++)
                    {
                        btCardCount1=btCardCount;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        for(let k=0;k<5;k++)
                        {
                            BackCard[k]=btCardData1[tagCardType1.cbStraight[j*5+k]];
                        }
                        this.RemoveCard(BackCard,5,btCardData1,btCardCount1);
                        SssLib.CopyMemory(MidCard,btCardData1,SssLib.sizeof(MidCard));
                        if(bFirst)
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                            {
                                bThreeSame=this.btrue;
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                bFirst=this.bfalse;
                            }
                        }
                        else
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                            {
                                bThreeSame=this.btrue;
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                btFrontAllShuiShu=btAllShuiShu;
                            }
                        }
                    }
                }
                if(tagCardType1.bThreeSame) //有三条
                {
                    for(let j=0;j<tagCardType1.btThreeSame;j++)
                    {
                        btCardCount1=btCardCount;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        for(let k=0;k<3;k++)
                        {
                            BackCard[k]=btCardData1[tagCardType1.cbThreeSame[j*3+k]];
                        }
                        this.RemoveCard(BackCard,3,btCardData1,btCardCount1);
                        btCardCount2=btCardCount1-=3;
                        SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                        tagCardType2=this.GetType(btCardData2,btCardCount2);
                        if(tagCardType2.bThreeSame)
                        {
                            for(let k=0;k<tagCardType2.btThreeSame;k++)
                            {
                                for(let m=0;m<3;m++)
                                {
                                    MidCard[m]=btCardData2[tagCardType2.cbThreeSame[k*3+m]];
                                }
                                this.RemoveCard(MidCard,3,btCardData2,btCardCount2);
                                BackCard[3]=btCardData2[2];
                                BackCard[4]=btCardData2[3];
                                MidCard[3]=btCardData2[0];
                                MidCard[4]=btCardData2[1];
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        bThreeSame=this.btrue;
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        bThreeSame=this.btrue;
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=btAllShuiShu;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if(bThreeSame==this.bfalse)
            {
                for(let i=0;i<tagCardType.btGourd;i++)            //第三敦为葫芦
                {
                    SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                    btCardCount=btHandCardCount;
                    for(let j=0;j<5;j++)
                    {
                        BackCard[j]=btCardData[tagCardType.cbGourd[i*5+j]];
                    }
                    this.RemoveCard(BackCard,5,btCardData,btCardCount);
                    btCardCount1=btCardCount-=5;
                    SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                    tagCardType1=this.GetType(btCardData1,btCardCount1);
                    if(tagCardType1.bGourd)        //剩下葫芦
                    {
                        for(let j=0;j<tagCardType1.btGourd;j++)
                        {
                            btCardCount1=btCardCount;
                            SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                            for(let k=0;k<5;k++)
                            {
                                MidCard[k]=btCardData1[tagCardType1.cbGourd[j*5+k]];
                            }
                            this.RemoveCard(MidCard,5,btCardData1,btCardCount1);
                            SssLib.CopyMemory(FrontCard,btCardData1,SssLib.sizeof(FrontCard));
                            if(bFirst)
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    bFirst=this.bfalse;
                                }
                            }
                            else
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                    this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                }
                            }
                        }
                    }
                    if(tagCardType1.bFlush)        //剩下同花
                    {
                        for(let j=0;j<tagCardType1.btFlush;j++)
                        {
                            btCardCount1=btCardCount;
                            SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                            for(let k=0;k<5;k++)
                            {
                                MidCard[k]=btCardData1[tagCardType1.cbFlush[j*5+k]];
                            }
                            this.RemoveCard(MidCard,5,btCardData1,btCardCount1);
                            SssLib.CopyMemory(FrontCard,btCardData1,SssLib.sizeof(FrontCard));
                            if(bFirst)
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    bFirst=this.bfalse;
                                }
                            }
                            else
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                    this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                }
                            }
                        }
                    }
                    if(tagCardType1.bStraight)     //剩下顺子
                    {
                        for(let j=0;j<tagCardType1.btStraight;j++)
                        {
                            btCardCount1=btCardCount;
                            SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                            for(let k=0;k<5;k++)
                            {
                                MidCard[k]=btCardData1[tagCardType1.cbStraight[j*5+k]];
                            }
                            this.RemoveCard(MidCard,5,btCardData1,btCardCount1);
                            SssLib.CopyMemory(FrontCard,btCardData1,SssLib.sizeof(FrontCard));
                            if(bFirst)
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    bFirst=this.bfalse;
                                }
                            }
                            else
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                    this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                }
                            }
                        }
                    }
                    if(tagCardType1.bThreeSame)    //剩下三条
                    {
                        for(let j=0;j<tagCardType1.btThreeSame;j++)
                        {
                            btCardCount1=btCardCount;
                            SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                            for(let k=0;k<3;k++)
                            {
                                MidCard[k]=btCardData1[tagCardType1.cbThreeSame[j*3+k]];
                            }
                            this.RemoveCard(MidCard,3,btCardData1,btCardCount1);
                            btCardCount2=btCardCount1-=3;
                            SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                            tagCardType2=this.GetType(btCardData2,btCardCount2);
                            if(tagCardType2.bThreeSame)  //三条
                            {
                                for(let k=0;k<3;k++)
                                {
                                    FrontCard[k]=btCardData2[tagCardType2.cbThreeSame[k]];
                                }
                                this.RemoveCard(FrontCard,3,btCardData2,btCardCount2);
                                MidCard[3]=btCardData2[0];
                                MidCard[4]=btCardData2[1];
                            }
                            else if(tagCardType2.bTwoPare)  //两对
                            {
                                for(let k=0;k<4;k++)
                                {
                                    if(k<2)
                                    {
                                        btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbTwoPare[k]];
                                    }
                                    else
                                    {
                                        btTemp[k]=MidCard[k+1]=btCardData2[tagCardType2.cbTwoPare[k]];
                                    }
                                }
                                this.RemoveCard(btTemp,4,btCardData2,btCardCount2);
                                FrontCard[2]=btCardData2[0];
                            }
                            else if(tagCardType2.bOnePare)  //一对
                            {
                                for(let k=0;k<2;k++)
                                {
                                    btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                }
                                this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                FrontCard[2]=btCardData2[0];
                                MidCard[3]=btCardData2[1];
                                MidCard[4]=btCardData2[2];
                            }
                            else                            //散牌
                            {
                                for(let k=0;k<5;k++)
                                {
                                    if(k<3)
                                    {
                                        FrontCard[k]=btCardData2[k];
                                    }
                                    else
                                    {
                                        MidCard[k]=btCardData2[k];
                                    }
                                }
                            }
                            if(bFirst)
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    bFirst=this.bfalse;
                                }
                            }
                            else
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                    this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                }
                            }
                        }
                    }
                    if(tagCardType1.bTwoPare)      //剩下两对
                    {
                        if(tagCardType1.btOnePare>=3)
                        {
                            btCardCount1=btCardCount;
                            SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                            btTemp[0]=FrontCard[0]=btCardData1[tagCardType1.cbOnePare[0]];
                            btTemp[1]=FrontCard[1]=btCardData1[tagCardType1.cbOnePare[1]];
                            btTemp[2]=MidCard[0]=btCardData1[tagCardType1.cbOnePare[2]];
                            btTemp[3]=MidCard[1]=btCardData1[tagCardType1.cbOnePare[3]];
                            btTemp[4]=MidCard[2]=btCardData1[tagCardType1.cbOnePare[4]];
                            btTemp[5]=MidCard[3]=btCardData1[tagCardType1.cbOnePare[5]];
                            this.RemoveCard(btTemp,6,btCardData1,btCardCount1);
                            FrontCard[2]=btCardData1[0];
                            MidCard[4]=btCardData1[1];
                            if(bFirst)
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                    bFirst=this.bfalse;
                                }
                            }
                            else
                            {
                                btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                    this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    btFrontAllShuiShu=btAllShuiShu;
                                }
                            }
                        }
                        else
                        {
                            for(let j=0;j<tagCardType1.btTwoPare;j++)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<4;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbTwoPare[j*4+k]];
                                }
                                this.RemoveCard(MidCard,4,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=4;
                                SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                tagCardType2=this.GetType(btCardData2,btCardCount2);
                                if(tagCardType2.bTwoPare)  //两对
                                {
                                    for(let k=0;k<4;k++)
                                    {
                                        if(k<3)
                                        {
                                            FrontCard[k]=btCardData2[tagCardType2.cbTwoPare[k]];
                                        }
                                        else
                                        {
                                            MidCard[k+1]=btCardData2[tagCardType2.cbTwoPare[k]];
                                        }
                                    }
                                }
                                else if(tagCardType2.bOnePare)  //一对
                                {
                                    for(let k=0;k<2;k++)
                                    {
                                        btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                    }
                                    this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                    MidCard[4]=btCardData2[1];
                                }
                                else                            //散牌
                                {
                                    for(let k=0;k<4;k++)
                                    {
                                        if(k<3)
                                        {
                                            FrontCard[k]=btCardData2[k];
                                        }
                                        else
                                        {
                                            MidCard[k+1]=btCardData2[k];
                                        }
                                    }
                                }
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }

                    }
                    if(tagCardType1.bOnePare)      //剩下一对
                    {
                        for(let j=0;j<tagCardType1.btOnePare;j++)
                        {
                            btCardCount1=btCardCount;
                            SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                            for(let k=0;k<2;k++)
                            {
                                MidCard[k]=btCardData1[tagCardType1.cbOnePare[j*2+k]];
                            }
                            this.RemoveCard(MidCard,2,btCardData1,btCardCount1);
                            btCardCount2=btCardCount1-=2;
                            SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                            tagCardType2=this.GetType(btCardData2,btCardCount2);
                            if(tagCardType2.bOnePare)  //一对
                            {
                                for(let k=0;k<2;k++)
                                {
                                    btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                }
                                this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                FrontCard[2]=btCardData2[0];
                                MidCard[2]=btCardData2[1];
                                MidCard[3]=btCardData2[2];
                                MidCard[4]=btCardData2[3];
                            }
                            else                            //散牌
                            {
                                for(let k=0;k<6;k++)
                                {
                                    if(k<3)
                                    {
                                        FrontCard[k]=btCardData2[k];
                                    }
                                    else
                                    {
                                        MidCard[k-1]=btCardData2[k];
                                    }
                                }
                            }
                            if(bFirst)
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    bFirst=this.bfalse;
                                }
                            }
                            else
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                    this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                }
                            }
                        }
                    }
                    //散牌
                    btCardCount1=btCardCount;
                    SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                    MidCard[0]=btCardData1[0];
                    MidCard[1]=btCardData1[4];
                    MidCard[2]=btCardData1[5];
                    MidCard[3]=btCardData1[6];
                    MidCard[4]=btCardData1[7];
                    FrontCard[0]=btCardData1[1];
                    FrontCard[1]=btCardData1[2];
                    FrontCard[2]=btCardData1[3];
                    if(bFirst)
                    {
                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                        {
                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                            bFirst=this.bfalse;
                        }
                    }
                    else
                    {
                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                            this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                        {
                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                        }
                    }
                }
                if(tagCardType.bFlush)       //第三敦为同花
                {
                    for(let i=0;i<tagCardType.btFlush;i++)
                    {
                        SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                        btCardCount=btHandCardCount;
                        for(let j=0;j<5;j++)
                        {
                            BackCard[j]=btCardData[tagCardType.cbFlush[i*5+j]];
                        }
                        this.RemoveCard(BackCard,5,btCardData,btCardCount);
                        btCardCount1=btCardCount-=5;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        tagCardType1=this.GetType(btCardData1,btCardCount1);
                        if(tagCardType1.bFlush)        //剩下同花
                        {
                            for(let j=0;j<tagCardType1.btFlush;j++)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<5;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbFlush[j*5+k]];
                                }
                                this.RemoveCard(MidCard,5,btCardData1,btCardCount1);
                                SssLib.CopyMemory(FrontCard,btCardData1,SssLib.sizeof(FrontCard));
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        else if(tagCardType1.bStraight)     //剩下顺子
                        {
                            for(let j=0;j<tagCardType1.btStraight;j++)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<5;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbStraight[j*5+k]];
                                }
                                this.RemoveCard(MidCard,5,btCardData1,btCardCount1);
                                SssLib.CopyMemory(FrontCard,btCardData1,SssLib.sizeof(FrontCard));
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        else if(tagCardType1.bThreeSame)    //剩下三条
                        {
                            for(let j=0;j<tagCardType1.btThreeSame;j++)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<3;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbThreeSame[j*3+k]];
                                }
                                this.RemoveCard(MidCard,3,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=3;
                                SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                tagCardType2=this.GetType(btCardData2,btCardCount2);
                                if(tagCardType2.bThreeSame)  //三条
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        FrontCard[k]=btCardData2[tagCardType2.cbThreeSame[k]];
                                    }
                                    this.RemoveCard(FrontCard,3,btCardData2,btCardCount2);
                                    MidCard[3]=btCardData2[0];
                                    MidCard[4]=btCardData2[1];
                                }
                                else if(tagCardType2.bTwoPare)  //两对
                                {
                                    for(let k=0;k<4;k++)
                                    {
                                        if(k<2)
                                        {
                                            btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbTwoPare[k]];
                                        }
                                        else
                                        {
                                            btTemp[k]=MidCard[k+1]=btCardData2[tagCardType2.cbTwoPare[k]];
                                        }
                                    }
                                    this.RemoveCard(btTemp,4,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                }
                                else if(tagCardType2.bOnePare)  //一对
                                {
                                    for(let k=0;k<2;k++)
                                    {
                                        btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                    }
                                    this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                    MidCard[3]=btCardData2[1];
                                    MidCard[4]=btCardData2[2];
                                }
                                else                            //散牌
                                {
                                    for(let k=0;k<5;k++)
                                    {
                                        if(k<3)
                                        {
                                            FrontCard[k]=btCardData2[k];
                                        }
                                        else
                                        {
                                            MidCard[k]=btCardData2[k];
                                        }
                                    }
                                }
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        else if(tagCardType1.bTwoPare)      //剩下两对
                        {
                            if(tagCardType1.btOnePare>=3)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                btTemp[0]=FrontCard[0]=btCardData1[tagCardType1.cbOnePare[0]];
                                btTemp[1]=FrontCard[1]=btCardData1[tagCardType1.cbOnePare[1]];
                                btTemp[2]=MidCard[0]=btCardData1[tagCardType1.cbOnePare[2]];
                                btTemp[3]=MidCard[1]=btCardData1[tagCardType1.cbOnePare[3]];
                                btTemp[4]=MidCard[2]=btCardData1[tagCardType1.cbOnePare[4]];
                                btTemp[5]=MidCard[3]=btCardData1[tagCardType1.cbOnePare[5]];
                                this.RemoveCard(btTemp,6,btCardData1,btCardCount1);
                                FrontCard[2]=btCardData1[0];
                                MidCard[4]=btCardData1[1];

                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=btAllShuiShu;
                                    }
                                }
                            }
                            else
                            {
                                for(let j=0;j<tagCardType1.btTwoPare;j++)
                                {
                                    btCardCount1=btCardCount;
                                    SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                    for(let k=0;k<4;k++)
                                    {
                                        MidCard[k]=btCardData1[tagCardType1.cbTwoPare[j*4+k]];
                                    }
                                    this.RemoveCard(MidCard,4,btCardData1,btCardCount1);
                                    btCardCount2=btCardCount1-=4;
                                    SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                    tagCardType2=this.GetType(btCardData2,btCardCount2);
                                    if(tagCardType2.bTwoPare)  //两对
                                    {
                                        for(let k=0;k<4;k++)
                                        {
                                            if(k<3)
                                            {
                                                FrontCard[k]=btCardData2[tagCardType2.cbTwoPare[k]];
                                            }
                                            else
                                            {
                                                MidCard[k+1]=btCardData2[tagCardType2.cbTwoPare[k]];
                                            }
                                        }
                                    }
                                    else if(tagCardType2.bOnePare)  //一对
                                    {
                                        for(let k=0;k<2;k++)
                                        {
                                            btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                        }
                                        this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                        FrontCard[2]=btCardData2[0];
                                        MidCard[4]=btCardData2[1];
                                    }
                                    else                            //散牌
                                    {
                                        for(let k=0;k<4;k++)
                                        {
                                            if(k<3)
                                            {
                                                FrontCard[k]=btCardData2[k];
                                            }
                                            else
                                            {
                                                MidCard[k+1]=btCardData2[k];
                                            }
                                        }
                                    }
                                    if(bFirst)
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            bFirst=this.bfalse;
                                        }
                                    }
                                    else
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                            this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        }
                                    }
                                }
                            }

                        }
                        else if(tagCardType1.bOnePare)      //剩下一对
                        {
                            for(let j=0;j<tagCardType1.btOnePare;j++)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<2;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbOnePare[j*2+k]];
                                }
                                this.RemoveCard(MidCard,2,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=2;
                                SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                tagCardType2=this.GetType(btCardData2,btCardCount2);
                                if(tagCardType2.bOnePare)  //一对
                                {
                                    for(let k=0;k<2;k++)
                                    {
                                        btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                    }
                                    this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                    MidCard[2]=btCardData2[1];
                                    MidCard[3]=btCardData2[2];
                                    MidCard[4]=btCardData2[3];
                                }
                                else                            //散牌
                                {
                                    for(let k=0;k<6;k++)
                                    {
                                        if(k<3)
                                        {
                                            FrontCard[k]=btCardData2[k];
                                        }
                                        else
                                        {
                                            MidCard[k-1]=btCardData2[k];
                                        }
                                    }
                                }
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        //散牌
                        btCardCount1=btCardCount;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        MidCard[0]=btCardData1[0];
                        MidCard[1]=btCardData1[4];
                        MidCard[2]=btCardData1[5];
                        MidCard[3]=btCardData1[6];
                        MidCard[4]=btCardData1[7];
                        FrontCard[0]=btCardData1[1];
                        FrontCard[1]=btCardData1[2];
                        FrontCard[2]=btCardData1[3];
                        if(bFirst)
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                bFirst=this.bfalse;
                            }
                        }
                        else
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                            }
                        }
                    }
                }
                if(tagCardType.bStraight)     //第三敦为顺子
                {
                    for(let i=0;i<tagCardType.btStraight;i++)
                    {
                        SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                        btCardCount=btHandCardCount;
                        for(let j=0;j<5;j++)
                        {
                            BackCard[j]=btCardData[tagCardType.cbStraight[i*5+j]];
                        }
                        this.RemoveCard(BackCard,5,btCardData,btCardCount);
                        btCardCount1=btCardCount-=5;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        tagCardType1=this.GetType(btCardData1,btCardCount1);
                        if(tagCardType1.bStraight)     //剩下顺子
                        {
                            for(let j=0;j<tagCardType1.btStraight;j++)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<5;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbStraight[j*5+k]];
                                }
                                this.RemoveCard(MidCard,5,btCardData1,btCardCount1);
                                SssLib.CopyMemory(FrontCard,btCardData1,SssLib.sizeof(FrontCard));
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        else if(tagCardType1.bThreeSame)    //剩下三条
                        {
                            for(let j=0;j<tagCardType1.btThreeSame;j++)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<3;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbThreeSame[j*3+k]];
                                }
                                this.RemoveCard(MidCard,3,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=3;
                                SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                tagCardType2=this.GetType(btCardData2,btCardCount2);
                                if(tagCardType2.bThreeSame)  //三条
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        FrontCard[k]=btCardData2[tagCardType2.cbThreeSame[k]];
                                    }
                                    this.RemoveCard(FrontCard,3,btCardData2,btCardCount2);
                                    MidCard[3]=btCardData2[0];
                                    MidCard[4]=btCardData2[1];
                                }
                                else if(tagCardType2.bTwoPare)  //两对
                                {
                                    for(let k=0;k<4;k++)
                                    {
                                        if(k<2)
                                        {
                                            btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbTwoPare[k]];
                                        }
                                        else
                                        {
                                            btTemp[k]=MidCard[k+1]=btCardData2[tagCardType2.cbTwoPare[k]];
                                        }
                                    }
                                    this.RemoveCard(btTemp,4,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                }
                                else if(tagCardType2.bOnePare)  //一对
                                {
                                    for(let k=0;k<2;k++)
                                    {
                                        btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                    }
                                    this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                    MidCard[3]=btCardData2[1];
                                    MidCard[4]=btCardData2[2];
                                }
                                else                            //散牌
                                {
                                    for(let k=0;k<5;k++)
                                    {
                                        if(k<3)
                                        {
                                            FrontCard[k]=btCardData2[k];
                                        }
                                        else
                                        {
                                            MidCard[k]=btCardData2[k];
                                        }
                                    }
                                }
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        else if(tagCardType1.bTwoPare)      //剩下两对
                        {
                            if(tagCardType1.btOnePare>=3)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                btTemp[0]=FrontCard[0]=btCardData1[tagCardType1.cbOnePare[0]];
                                btTemp[1]=FrontCard[1]=btCardData1[tagCardType1.cbOnePare[1]];
                                btTemp[2]=MidCard[0]=btCardData1[tagCardType1.cbOnePare[2]];
                                btTemp[3]=MidCard[1]=btCardData1[tagCardType1.cbOnePare[3]];
                                btTemp[4]=MidCard[2]=btCardData1[tagCardType1.cbOnePare[4]];
                                btTemp[5]=MidCard[3]=btCardData1[tagCardType1.cbOnePare[5]];
                                this.RemoveCard(btTemp,6,btCardData1,btCardCount1);
                                FrontCard[2]=btCardData1[0];
                                MidCard[4]=btCardData1[1];
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=btAllShuiShu;
                                    }
                                }
                            }
                            else
                            {
                                for(let j=0;j<tagCardType1.btTwoPare;j++)
                                {
                                    btCardCount1=btCardCount;
                                    SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                    for(let k=0;k<4;k++)
                                    {
                                        MidCard[k]=btCardData1[tagCardType1.cbTwoPare[j*4+k]];
                                    }
                                    this.RemoveCard(MidCard,4,btCardData1,btCardCount1);
                                    btCardCount2=btCardCount1-=4;
                                    SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                    tagCardType2=this.GetType(btCardData2,btCardCount2);
                                    if(tagCardType2.bTwoPare)  //两对
                                    {
                                        for(let k=0;k<4;k++)
                                        {
                                            if(k<3)
                                            {
                                                FrontCard[k]=btCardData2[tagCardType2.cbTwoPare[k]];
                                            }
                                            else
                                            {
                                                MidCard[k+1]=btCardData2[tagCardType2.cbTwoPare[k]];
                                            }
                                        }
                                    }
                                    else if(tagCardType2.bOnePare)  //一对
                                    {
                                        for(let k=0;k<2;k++)
                                        {
                                            btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                        }
                                        this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                        FrontCard[2]=btCardData2[0];
                                        MidCard[4]=btCardData2[1];
                                    }
                                    else                            //散牌
                                    {
                                        for(let k=0;k<4;k++)
                                        {
                                            if(k<3)
                                            {
                                                FrontCard[k]=btCardData2[k];
                                            }
                                            else
                                            {
                                                MidCard[k+1]=btCardData2[k];
                                            }
                                        }
                                    }
                                    if(bFirst)
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            bFirst=this.bfalse;
                                        }
                                    }
                                    else
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                            this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        }
                                    }
                                }
                            }

                        }
                        else if(tagCardType1.bOnePare)      //剩下一对
                        {
                            for(let j=0;j<tagCardType1.btOnePare;j++)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<2;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbOnePare[j*2+k]];
                                }
                                this.RemoveCard(MidCard,2,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=2;
                                SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                tagCardType2=this.GetType(btCardData2,btCardCount2);
                                if(tagCardType2.bOnePare)  //一对
                                {
                                    for(let k=0;k<2;k++)
                                    {
                                        btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                    }
                                    this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                    MidCard[2]=btCardData2[1];
                                    MidCard[3]=btCardData2[2];
                                    MidCard[4]=btCardData2[3];
                                }
                                else                            //散牌
                                {
                                    for(let k=0;k<6;k++)
                                    {
                                        if(k<3)
                                        {
                                            FrontCard[k]=btCardData2[k];
                                        }
                                        else
                                        {
                                            MidCard[k-1]=btCardData2[k];
                                        }
                                    }
                                }
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        //散牌
                        btCardCount1=btCardCount;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        MidCard[0]=btCardData1[0];
                        MidCard[1]=btCardData1[4];
                        MidCard[2]=btCardData1[5];
                        MidCard[3]=btCardData1[6];
                        MidCard[4]=btCardData1[7];
                        FrontCard[0]=btCardData1[1];
                        FrontCard[1]=btCardData1[2];
                        FrontCard[2]=btCardData1[3];
                        if(bFirst)
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                bFirst=this.bfalse;
                            }
                        }
                        else
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                            }
                        }
                    }
                }
                if(tagCardType.bThreeSame)    //第三敦为三条
                {
                    for(let i=0;i<tagCardType.btThreeSame;i++)
                    {
                        SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                        btCardCount=btHandCardCount;
                        for(let j=0;j<3;j++)
                        {
                            BackCard[j]=btCardData[tagCardType.cbThreeSame[i*3+j]];
                        }
                        this.RemoveCard(BackCard,3,btCardData,btCardCount);
                        btCardCount1=btCardCount-=3;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        tagCardType1=this.GetType(btCardData1,btCardCount1);
                        if(tagCardType1.bThreeSame)    //剩下三条
                        {
                            for(let j=0;j<tagCardType1.btThreeSame;j++)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<3;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbThreeSame[j*3+k]];
                                }
                                this.RemoveCard(MidCard,3,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=3;
                                SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                tagCardType2=this.GetType(btCardData2,btCardCount2);
                                if(tagCardType2.bThreeSame)  //三条
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        FrontCard[k]=btCardData2[tagCardType2.cbThreeSame[k]];
                                    }
                                    this.RemoveCard(FrontCard,3,btCardData2,btCardCount2);
                                    MidCard[3]=btCardData2[0];
                                    MidCard[4]=btCardData2[1];
                                    BackCard[3]=btCardData2[2];
                                    BackCard[4]=btCardData2[3];
                                }
                                else if(tagCardType2.bTwoPare)  //两对
                                {
                                    for(let k=0;k<4;k++)
                                    {
                                        if(k<2)
                                        {
                                            btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbTwoPare[k]];
                                        }
                                        else
                                        {
                                            btTemp[k]=BackCard[k+1]=btCardData2[tagCardType2.cbTwoPare[k]];
                                        }
                                    }
                                    this.RemoveCard(btTemp,4,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                    MidCard[3]=btCardData2[1];
                                    MidCard[4]=btCardData2[2];
                                }
                                else if(tagCardType2.bOnePare)  //一对
                                {
                                    for(let k=0;k<2;k++)
                                    {
                                        btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                    }
                                    this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                    MidCard[3]=btCardData2[1];
                                    MidCard[4]=btCardData2[2];
                                    BackCard[3]=btCardData2[3];
                                    BackCard[4]=btCardData2[4];
                                }
                                else                            //散牌
                                {
                                    FrontCard[0]=btCardData2[0];
                                    FrontCard[1]=btCardData2[1];
                                    FrontCard[2]=btCardData2[2];
                                    MidCard[3]=btCardData2[3];
                                    MidCard[4]=btCardData2[4];
                                    BackCard[3]=btCardData2[5];
                                    BackCard[4]=btCardData2[6];
                                }
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        else if(tagCardType1.bTwoPare)      //剩下两对
                        {
                            if(tagCardType1.btOnePare>=3)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                btTemp[0]=FrontCard[0]=btCardData1[tagCardType1.cbOnePare[0]];
                                btTemp[1]=FrontCard[1]=btCardData1[tagCardType1.cbOnePare[1]];
                                btTemp[2]=MidCard[0]=btCardData1[tagCardType1.cbOnePare[2]];
                                btTemp[3]=MidCard[1]=btCardData1[tagCardType1.cbOnePare[3]];
                                btTemp[4]=MidCard[2]=btCardData1[tagCardType1.cbOnePare[4]];
                                btTemp[5]=MidCard[3]=btCardData1[tagCardType1.cbOnePare[5]];
                                this.RemoveCard(btTemp,6,btCardData1,btCardCount1);
                                FrontCard[2]=btCardData1[0];
                                MidCard[4]=btCardData1[1];
                                BackCard[3]=btCardData1[2];
                                BackCard[4]=btCardData1[3];
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=btAllShuiShu;
                                    }
                                }
                            }
                            else
                            {
                                for(let j=0;j<tagCardType1.btTwoPare;j++)
                                {
                                    btCardCount1=btCardCount;
                                    SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                    for(let k=0;k<4;k++)
                                    {
                                        MidCard[k]=btCardData1[tagCardType1.cbTwoPare[j*4+k]];
                                    }
                                    this.RemoveCard(MidCard,4,btCardData1,btCardCount1);
                                    btCardCount2=btCardCount1-=4;
                                    SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                    tagCardType2=this.GetType(btCardData2,btCardCount2);
                                    if(tagCardType2.bTwoPare)  //两对
                                    {
                                        for(let k=0;k<4;k++)
                                        {
                                            if(k<3)
                                            {
                                                btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbTwoPare[k]];
                                            }
                                            else
                                            {
                                                btTemp[k]=MidCard[k+1]=btCardData2[tagCardType2.cbTwoPare[k]];
                                            }
                                        }
                                        this.RemoveCard(btTemp,4,btCardData2,btCardCount2);
                                        BackCard[3]=btCardData2[0];
                                        BackCard[4]=btCardData2[1];
                                    }
                                    else if(tagCardType2.bOnePare)  //一对
                                    {
                                        for(let k=0;k<2;k++)
                                        {
                                            btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                        }
                                        this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                        FrontCard[2]=btCardData2[0];
                                        MidCard[4]=btCardData2[1];
                                        BackCard[3]=btCardData2[2];
                                        BackCard[4]=btCardData2[3];
                                    }
                                    else                            //散牌
                                    {
                                        FrontCard[0]=btCardData2[0];
                                        FrontCard[1]=btCardData2[1];
                                        FrontCard[2]=btCardData2[2];
                                        MidCard[4]=btCardData2[3];
                                        BackCard[3]=btCardData2[4];
                                        BackCard[4]=btCardData2[5];
                                    }
                                    if(bFirst)
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            bFirst=this.bfalse;
                                        }
                                    }
                                    else
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                            this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        }
                                    }
                                }
                            }

                        }
                        else if(tagCardType1.bOnePare)      //剩下一对
                        {
                            for(let j=0;j<tagCardType1.btOnePare;j++)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<2;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbOnePare[j*2+k]];
                                }
                                this.RemoveCard(MidCard,2,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=2;
                                SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                tagCardType2=this.GetType(btCardData2,btCardCount2);
                                if(tagCardType2.bOnePare)  //一对
                                {
                                    for(let k=0;k<2;k++)
                                    {
                                        btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                    }
                                    this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                    MidCard[2]=btCardData2[1];
                                    MidCard[3]=btCardData2[2];
                                    MidCard[4]=btCardData2[3];
                                    BackCard[3]=btCardData2[4];
                                    BackCard[4]=btCardData2[5];
                                }
                                else                            //散牌
                                {
                                    FrontCard[0]=btCardData2[0];
                                    FrontCard[1]=btCardData2[1];
                                    FrontCard[2]=btCardData2[2];
                                    MidCard[2]=btCardData2[3];
                                    MidCard[3]=btCardData2[4];
                                    MidCard[4]=btCardData2[5];
                                    BackCard[3]=btCardData2[6];
                                    BackCard[4]=btCardData2[7];
                                }
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        //散牌
                        btCardCount1=btCardCount;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        MidCard[0]=btCardData1[0];
                        MidCard[1]=btCardData1[4];
                        MidCard[2]=btCardData1[5];
                        MidCard[3]=btCardData1[6];
                        MidCard[4]=btCardData1[7];
                        BackCard[3]=btCardData1[8];
                        BackCard[4]=btCardData1[9];
                        FrontCard[0]=btCardData1[1];
                        FrontCard[1]=btCardData1[2];
                        FrontCard[2]=btCardData1[3];
                        if(bFirst)
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                bFirst=this.bfalse;
                            }
                        }
                        else
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                            }
                        }
                    }
                }
                if(tagCardType.bTwoPare)      //第三敦为两对
                {
                    if(tagCardType.btOnePare<4)
                    {
                        for(let i=0;i<tagCardType.btTwoPare;i++)
                        {
                            SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                            btCardCount=btHandCardCount;
                            for(let j=0;j<4;j++)
                            {
                                BackCard[j]=btCardData[tagCardType.cbTwoPare[i*4+j]];
                            }
                            this.RemoveCard(BackCard,4,btCardData,btCardCount);
                            btCardCount1=btCardCount-=4;
                            SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                            tagCardType1=this.GetType(btCardData1,btCardCount1);
                            if(tagCardType1.bTwoPare)      //剩下两对
                            {
                                if(tagCardType1.btOnePare>=3)
                                {
                                    btCardCount1=btCardCount;
                                    SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                    btTemp[0]=FrontCard[0]=btCardData1[tagCardType1.cbOnePare[0]];
                                    btTemp[1]=FrontCard[1]=btCardData1[tagCardType1.cbOnePare[1]];
                                    btTemp[2]=MidCard[0]=btCardData1[tagCardType1.cbOnePare[2]];
                                    btTemp[3]=MidCard[1]=btCardData1[tagCardType1.cbOnePare[3]];
                                    btTemp[4]=MidCard[2]=btCardData1[tagCardType1.cbOnePare[4]];
                                    btTemp[5]=MidCard[3]=btCardData1[tagCardType1.cbOnePare[5]];
                                    this.RemoveCard(btTemp,6,btCardData1,btCardCount1);
                                    FrontCard[2]=btCardData1[0];
                                    MidCard[4]=btCardData1[1];
                                    BackCard[4]=btCardData1[2];
                                    if(bFirst)
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                            bFirst=this.bfalse;
                                        }
                                    }
                                    else
                                    {
                                        btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                            this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            btFrontAllShuiShu=btAllShuiShu;
                                        }
                                    }
                                }
                                else
                                {
                                    for(let j=0;j<tagCardType1.btTwoPare;j++)
                                    {
                                        btCardCount1=btCardCount;
                                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                        for(let k=0;k<4;k++)
                                        {
                                            MidCard[k]=btCardData1[tagCardType1.cbTwoPare[j*4+k]];
                                        }
                                        this.RemoveCard(MidCard,4,btCardData1,btCardCount1);
                                        btCardCount2=btCardCount1-=4;
                                        SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                        tagCardType2=this.GetType(btCardData2,btCardCount2);
                                        if(tagCardType2.bTwoPare)  //两对
                                        {
                                            for(let k=0;k<4;k++)
                                            {
                                                if(k<3)
                                                {
                                                    btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbTwoPare[k]];
                                                }
                                                else
                                                {
                                                    btTemp[k]=MidCard[k+1]=btCardData2[tagCardType2.cbTwoPare[k]];
                                                }
                                            }
                                            this.RemoveCard(btTemp,4,btCardData2,btCardCount2);
                                            BackCard[4]=btCardData2[0];
                                        }
                                        else if(tagCardType2.bOnePare)  //一对
                                        {
                                            for(let k=0;k<2;k++)
                                            {
                                                btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                            }
                                            this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                            FrontCard[2]=btCardData2[0];
                                            MidCard[4]=btCardData2[1];
                                            BackCard[4]=btCardData2[2];
                                        }
                                        else                            //散牌
                                        {
                                            FrontCard[0]=btCardData2[0];
                                            FrontCard[1]=btCardData2[1];
                                            FrontCard[2]=btCardData2[2];
                                            MidCard[4]=btCardData2[3];
                                            BackCard[4]=btCardData2[4];
                                        }
                                        if(bFirst)
                                        {
                                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                            {
                                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                                bFirst=this.bfalse;
                                            }
                                        }
                                        else
                                        {
                                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                                this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                            {
                                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            }
                                        }
                                    }
                                }

                            }
                            else if(tagCardType1.bOnePare)      //剩下一对
                            {
                                for(let j=0;j<tagCardType1.btOnePare;j++)
                                {
                                    btCardCount1=btCardCount;
                                    SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                    for(let k=0;k<2;k++)
                                    {
                                        MidCard[k]=btCardData1[tagCardType1.cbOnePare[j*2+k]];
                                    }
                                    this.RemoveCard(MidCard,2,btCardData1,btCardCount1);
                                    btCardCount2=btCardCount1-=2;
                                    SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                    tagCardType2=this.GetType(btCardData2,btCardCount2);
                                    if(tagCardType2.bOnePare)  //一对
                                    {
                                        for(let k=0;k<2;k++)
                                        {
                                            btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                        }
                                        this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                        FrontCard[2]=btCardData2[0];
                                        MidCard[2]=btCardData2[1];
                                        MidCard[3]=btCardData2[2];
                                        MidCard[4]=btCardData2[3];
                                        BackCard[4]=btCardData2[4];
                                    }
                                    else                            //散牌
                                    {
                                        FrontCard[0]=btCardData2[0];
                                        FrontCard[1]=btCardData2[1];
                                        FrontCard[2]=btCardData2[2];
                                        MidCard[2]=btCardData2[3];
                                        MidCard[3]=btCardData2[4];
                                        MidCard[4]=btCardData2[5];
                                        BackCard[4]=btCardData2[6];
                                    }
                                    if(bFirst)
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            bFirst=this.bfalse;
                                        }
                                    }
                                    else
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                            this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        }
                                    }
                                }
                            }
                            //散牌
                            btCardCount1=btCardCount;
                            SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                            MidCard[0]=btCardData1[0];
                            MidCard[1]=btCardData1[4];
                            MidCard[2]=btCardData1[5];
                            MidCard[3]=btCardData1[6];
                            MidCard[4]=btCardData1[7];
                            BackCard[4]=btCardData1[8];
                            FrontCard[0]=btCardData1[1];
                            FrontCard[1]=btCardData1[2];
                            FrontCard[2]=btCardData1[3];
                            if(bFirst)
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    bFirst=this.bfalse;
                                }
                            }
                            else
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                    this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                }
                            }
                        }
                    }
                    else
                    {
                        if(tagCardType.btOnePare==4)
                        {
                            SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                            btCardCount=btHandCardCount;
                            btTemp[0]=BackCard[0]=btCardData[tagCardType.cbOnePare[0]];
                            btTemp[1]=BackCard[1]=btCardData[tagCardType.cbOnePare[1]];
                            btTemp[2]=BackCard[2]=btCardData[tagCardType.cbOnePare[6]];
                            btTemp[3]=BackCard[3]=btCardData[tagCardType.cbOnePare[7]];
                            btTemp[4]=MidCard[0]=btCardData[tagCardType.cbOnePare[2]];
                            btTemp[5]=MidCard[1]=btCardData[tagCardType.cbOnePare[3]];
                            btTemp[6]=MidCard[2]=btCardData[tagCardType.cbOnePare[4]];
                            btTemp[7]=MidCard[3]=btCardData[tagCardType.cbOnePare[5]];
                            this.RemoveCard(btTemp,8,btCardData,btCardCount);
                            FrontCard[0]=btCardData[0];
                            FrontCard[1]=btCardData[1];
                            FrontCard[2]=btCardData[2];
                            MidCard[4]=btCardData[3];
                            BackCard[4]=btCardData[4];
                            if(this.GetCardLogicValue(FrontCard[0])==14&&this.GetCardLogicValue(FrontCard[1])==13)
                            {
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                            else
                            {
                                SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                                btCardCount=btHandCardCount;
                                btTemp[0]=BackCard[0]=btCardData[tagCardType.cbOnePare[4]];
                                btTemp[1]=BackCard[1]=btCardData[tagCardType.cbOnePare[5]];
                                btTemp[2]=BackCard[2]=btCardData[tagCardType.cbOnePare[6]];
                                btTemp[3]=BackCard[3]=btCardData[tagCardType.cbOnePare[7]];
                                btTemp[4]=MidCard[0]=btCardData[tagCardType.cbOnePare[0]];
                                btTemp[5]=MidCard[1]=btCardData[tagCardType.cbOnePare[1]];
                                btTemp[6]=FrontCard[0]=btCardData[tagCardType.cbOnePare[2]];
                                btTemp[7]=FrontCard[1]=btCardData[tagCardType.cbOnePare[3]];
                                this.RemoveCard(btTemp,8,btCardData,btCardCount);
                                FrontCard[2]=btCardData[0];
                                MidCard[2]=btCardData[1];
                                MidCard[3]=btCardData[2];
                                MidCard[4]=btCardData[3];
                                BackCard[4]=btCardData[4];
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        else if(tagCardType.btOnePare==5)
                        {
                            SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                            btCardCount=btHandCardCount;
                            btTemp[0]=FrontCard[0]=btCardData[tagCardType.cbOnePare[0]];
                            btTemp[1]=FrontCard[1]=btCardData[tagCardType.cbOnePare[1]];
                            btTemp[2]=MidCard[0]=btCardData[tagCardType.cbOnePare[4]];
                            btTemp[3]=MidCard[1]=btCardData[tagCardType.cbOnePare[5]];
                            btTemp[4]=MidCard[2]=btCardData[tagCardType.cbOnePare[6]];
                            btTemp[5]=MidCard[3]=btCardData[tagCardType.cbOnePare[7]];
                            btTemp[6]=BackCard[0]=btCardData[tagCardType.cbOnePare[2]];
                            btTemp[7]=BackCard[1]=btCardData[tagCardType.cbOnePare[3]];
                            btTemp[8]=BackCard[2]=btCardData[tagCardType.cbOnePare[8]];
                            btTemp[9]=BackCard[3]=btCardData[tagCardType.cbOnePare[9]];
                            this.RemoveCard(btTemp,10,btCardData,btCardCount);
                            FrontCard[2]=btCardData[0];
                            MidCard[4]=btCardData[1];
                            BackCard[4]=btCardData[2];
                            if(bFirst)
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    bFirst=this.bfalse;
                                }
                            }
                            else
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                    this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                }
                            }
                        }
                    }
                }
                if(tagCardType.bOnePare)      //第三敦为一对
                {
                    for(let i=0;i<tagCardType.btOnePare;i++)
                    {
                        SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                        btCardCount=btHandCardCount;
                        for(let j=0;j<2;j++)
                        {
                            BackCard[j]=btCardData[tagCardType.cbOnePare[i*2+j]];
                        }
                        this.RemoveCard(BackCard,2,btCardData,btCardCount);
                        btCardCount1=btCardCount-=2;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        tagCardType1=this.GetType(btCardData1,btCardCount1);
                        if(tagCardType1.bOnePare)      //剩下一对
                        {
                            for(let j=0;j<tagCardType1.btOnePare;j++)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<2;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbOnePare[j*2+k]];
                                }
                                this.RemoveCard(MidCard,2,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=2;
                                SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                tagCardType2=this.GetType(btCardData2,btCardCount2);
                                if(tagCardType2.bOnePare)  //一对
                                {
                                    for(let k=0;k<2;k++)
                                    {
                                        btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                    }
                                    this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                    MidCard[2]=btCardData2[1];
                                    MidCard[3]=btCardData2[2];
                                    MidCard[4]=btCardData2[3];
                                    BackCard[2]=btCardData2[4];
                                    BackCard[3]=btCardData2[5];
                                    BackCard[4]=btCardData2[6];
                                }
                                else                            //散牌
                                {
                                    FrontCard[0]=btCardData2[0];
                                    FrontCard[1]=btCardData2[1];
                                    FrontCard[2]=btCardData2[2];
                                    MidCard[2]=btCardData2[3];
                                    MidCard[3]=btCardData2[4];
                                    MidCard[4]=btCardData2[5];
                                    BackCard[2]=btCardData2[6];
                                    BackCard[3]=btCardData2[7];
                                    BackCard[4]=btCardData2[8];
                                }
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {

                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        // 									for(let m=0;m<3;m++)
                                        // 									{
                                        // 									    printf("FrontFrontCard[%d]=%d ",m,FrontFrontCard[m]);
                                        // 									}
                                        // 									for(let m=0;m<5;m++)
                                        // 									{
                                        // 									    printf("FrontMidCard[%d]=%d ",m,FrontMidCard[m]);
                                        // 									}
                                        // 									for(let m=0;m<5;m++)
                                        // 									{
                                        //                                        printf("FrontBackCard[%d]=%d ",m,FrontBackCard[m]);
                                        // 									}
                                        // 									printf("\n");
                                        // 									for(let m=0;m<3;m++)
                                        // 									{
                                        // 										printf("FrontCard[%d]=%d ",m,FrontCard[m]);
                                        // 									}
                                        // 									for(let m=0;m<5;m++)
                                        // 									{
                                        // 										printf("MidCard[%d]=%d ",m,MidCard[m]);
                                        // 									}
                                        // 									for(let m=0;m<5;m++)
                                        // 									{
                                        // 										printf("BackCard[%d]=%d ",m,BackCard[m]);
                                        // 									}
                                        // 									printf("\n");
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        //散牌
                        btCardCount1=btCardCount;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        MidCard[0]=btCardData1[0];
                        MidCard[1]=btCardData1[4];
                        MidCard[2]=btCardData1[5];
                        MidCard[3]=btCardData1[6];
                        MidCard[4]=btCardData1[7];
                        BackCard[2]=btCardData1[8];
                        BackCard[3]=btCardData1[9];
                        BackCard[4]=btCardData1[10];
                        FrontCard[0]=btCardData1[1];
                        FrontCard[1]=btCardData1[2];
                        FrontCard[2]=btCardData1[3];
                        if(bFirst)
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                bFirst=this.bfalse;
                            }
                        }
                        else
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                            }
                        }
                    }
                }
            }
        }
        else if(tagCardType.bFlush) //有同花
        {
            let bThreeSame=this.bfalse;
            for(let i=0;i<tagCardType.btThreeSame;i++)
            {
                SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                btCardCount=btHandCardCount;
                for(let j=0;j<3;j++)
                {
                    FrontCard[j]=btCardData[tagCardType.cbThreeSame[i*3+j]];
                }
                this.RemoveCard(FrontCard,3,btCardData,btCardCount);
                btCardCount1=btCardCount-=3;
                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                tagCardType1=this.GetType(btCardData1,btCardCount1);
                if(tagCardType1.bFlush)    //有同花
                {
                    for(let j=0;j<tagCardType1.btFlush;j++)
                    {
                        btCardCount1=btCardCount;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        for(let k=0;k<5;k++)
                        {
                            BackCard[k]=btCardData1[tagCardType1.cbFlush[j*5+k]];
                        }
                        this.RemoveCard(BackCard,5,btCardData1,btCardCount1);
                        SssLib.CopyMemory(MidCard,btCardData1,SssLib.sizeof(MidCard));
                        if(bFirst)
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                            {
                                bThreeSame=this.btrue;
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                bFirst=this.bfalse;
                            }
                        }
                        else
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                            {
                                bThreeSame=this.btrue;
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                btFrontAllShuiShu=btAllShuiShu;
                            }
                        }
                    }
                }
                if(tagCardType1.bStraight)  //有顺子
                {
                    for(let j=0;j<tagCardType1.btStraight;j++)
                    {
                        btCardCount1=btCardCount;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        for(let k=0;k<5;k++)
                        {
                            BackCard[k]=btCardData1[tagCardType1.cbStraight[j*5+k]];
                        }
                        this.RemoveCard(BackCard,5,btCardData1,btCardCount1);
                        SssLib.CopyMemory(MidCard,btCardData1,SssLib.sizeof(MidCard));
                        if(bFirst)
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                            {
                                bThreeSame=this.btrue;
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                bFirst=this.bfalse;
                            }
                        }
                        else
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                            {
                                bThreeSame=this.btrue;
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                btFrontAllShuiShu=btAllShuiShu;
                            }
                        }
                    }
                }
                if(tagCardType1.bThreeSame) //有三条
                {
                    for(let j=0;j<tagCardType1.btThreeSame;j++)
                    {
                        btCardCount1=btCardCount;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        for(let k=0;k<3;k++)
                        {
                            BackCard[k]=btCardData1[tagCardType1.cbThreeSame[j*3+k]];
                        }
                        this.RemoveCard(BackCard,3,btCardData1,btCardCount1);
                        btCardCount2=btCardCount1-=3;
                        SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                        tagCardType2=this.GetType(btCardData2,btCardCount2);
                        if(tagCardType2.bThreeSame)
                        {
                            for(let k=0;k<tagCardType2.btThreeSame;k++)
                            {
                                for(let m=0;m<3;m++)
                                {
                                    MidCard[m]=btCardData2[tagCardType2.cbThreeSame[k*3+m]];
                                }
                                this.RemoveCard(MidCard,3,btCardData2,btCardCount2);
                                BackCard[3]=btCardData2[2];
                                BackCard[4]=btCardData2[3];
                                MidCard[3]=btCardData2[0];
                                MidCard[4]=btCardData2[1];
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        bThreeSame=this.btrue;
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        bThreeSame=this.btrue;
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=btAllShuiShu;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if(bThreeSame==this.bfalse)
            {
                if(tagCardType.bFlush)       //第三敦为同花
                {
                    for(let i=0;i<tagCardType.btFlush;i++)
                    {
                        SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                        btCardCount=btHandCardCount;
                        for(let j=0;j<5;j++)
                        {
                            BackCard[j]=btCardData[tagCardType.cbFlush[i*5+j]];
                        }
                        this.RemoveCard(BackCard,5,btCardData,btCardCount);
                        btCardCount1=btCardCount-=5;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        tagCardType1=this.GetType(btCardData1,btCardCount1);
                        if(tagCardType1.bFlush)        //剩下同花
                        {
                            for(let j=0;j<tagCardType1.btFlush;j++)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<5;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbFlush[j*5+k]];
                                }
                                this.RemoveCard(MidCard,5,btCardData1,btCardCount1);
                                SssLib.CopyMemory(FrontCard,btCardData1,SssLib.sizeof(FrontCard));
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        else if(tagCardType1.bStraight)     //剩下顺子
                        {
                            for(let j=0;j<tagCardType1.btStraight;j++)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<5;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbStraight[j*5+k]];
                                }
                                this.RemoveCard(MidCard,5,btCardData1,btCardCount1);
                                SssLib.CopyMemory(FrontCard,btCardData1,SssLib.sizeof(FrontCard));
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        else if(tagCardType1.bThreeSame)    //剩下三条
                        {
                            for(let j=0;j<tagCardType1.btThreeSame;j++)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<3;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbThreeSame[j*3+k]];
                                }
                                this.RemoveCard(MidCard,3,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=3;
                                SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                tagCardType2=this.GetType(btCardData2,btCardCount2);
                                if(tagCardType2.bThreeSame)  //三条
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        FrontCard[k]=btCardData2[tagCardType2.cbThreeSame[k]];
                                    }
                                    this.RemoveCard(FrontCard,3,btCardData2,btCardCount2);
                                    MidCard[3]=btCardData2[0];
                                    MidCard[4]=btCardData2[1];
                                }
                                else if(tagCardType2.bTwoPare)  //两对
                                {
                                    for(let k=0;k<4;k++)
                                    {
                                        if(k<2)
                                        {
                                            btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbTwoPare[k]];
                                        }
                                        else
                                        {
                                            btTemp[k]=MidCard[k+1]=btCardData2[tagCardType2.cbTwoPare[k]];
                                        }
                                    }
                                    this.RemoveCard(btTemp,4,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                }
                                else if(tagCardType2.bOnePare)  //一对
                                {
                                    for(let k=0;k<2;k++)
                                    {
                                        btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                    }
                                    this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                    MidCard[3]=btCardData2[1];
                                    MidCard[4]=btCardData2[2];
                                }
                                else                            //散牌
                                {
                                    for(let k=0;k<5;k++)
                                    {
                                        if(k<3)
                                        {
                                            FrontCard[k]=btCardData2[k];
                                        }
                                        else
                                        {
                                            MidCard[k]=btCardData2[k];
                                        }
                                    }
                                }
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        else if(tagCardType1.bTwoPare)      //剩下两对
                        {
                            if(tagCardType1.btOnePare>=3)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                btTemp[0]=FrontCard[0]=btCardData1[tagCardType1.cbOnePare[0]];
                                btTemp[1]=FrontCard[1]=btCardData1[tagCardType1.cbOnePare[1]];
                                btTemp[2]=MidCard[0]=btCardData1[tagCardType1.cbOnePare[2]];
                                btTemp[3]=MidCard[1]=btCardData1[tagCardType1.cbOnePare[3]];
                                btTemp[4]=MidCard[2]=btCardData1[tagCardType1.cbOnePare[4]];
                                btTemp[5]=MidCard[3]=btCardData1[tagCardType1.cbOnePare[5]];
                                this.RemoveCard(btTemp,6,btCardData1,btCardCount1);
                                FrontCard[2]=btCardData1[0];
                                MidCard[4]=btCardData1[1];
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=btAllShuiShu;
                                    }
                                }
                            }
                            else
                            {
                                for(let j=0;j<tagCardType1.btTwoPare;j++)
                                {
                                    btCardCount1=btCardCount;
                                    SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                    for(let k=0;k<4;k++)
                                    {
                                        MidCard[k]=btCardData1[tagCardType1.cbTwoPare[j*4+k]];
                                    }
                                    this.RemoveCard(MidCard,4,btCardData1,btCardCount1);
                                    btCardCount2=btCardCount1-=4;
                                    SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                    tagCardType2=this.GetType(btCardData2,btCardCount2);
                                    if(tagCardType2.bTwoPare)  //两对
                                    {
                                        for(let k=0;k<4;k++)
                                        {
                                            if(k<3)
                                            {
                                                FrontCard[k]=btCardData2[tagCardType2.cbTwoPare[k]];
                                            }
                                            else
                                            {
                                                MidCard[k+1]=btCardData2[tagCardType2.cbTwoPare[k]];
                                            }
                                        }
                                    }
                                    else if(tagCardType2.bOnePare)  //一对
                                    {
                                        for(let k=0;k<2;k++)
                                        {
                                            btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                        }
                                        this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                        FrontCard[2]=btCardData2[0];
                                        MidCard[4]=btCardData2[1];
                                    }
                                    else                            //散牌
                                    {
                                        for(let k=0;k<4;k++)
                                        {
                                            if(k<3)
                                            {
                                                FrontCard[k]=btCardData2[k];
                                            }
                                            else
                                            {
                                                MidCard[k+1]=btCardData2[k];
                                            }
                                        }
                                    }
                                    if(bFirst)
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            bFirst=this.bfalse;
                                        }
                                    }
                                    else
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                            this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        }
                                    }
                                }
                            }

                        }
                        else if(tagCardType1.bOnePare)      //剩下一对
                        {
                            for(let j=0;j<tagCardType1.btOnePare;j++)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<2;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbOnePare[j*2+k]];
                                }
                                this.RemoveCard(MidCard,2,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=2;
                                SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                tagCardType2=this.GetType(btCardData2,btCardCount2);
                                if(tagCardType2.bOnePare)  //一对
                                {
                                    for(let k=0;k<2;k++)
                                    {
                                        btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                    }
                                    this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                    MidCard[2]=btCardData2[1];
                                    MidCard[3]=btCardData2[2];
                                    MidCard[4]=btCardData2[3];
                                }
                                else                            //散牌
                                {
                                    for(let k=0;k<6;k++)
                                    {
                                        if(k<3)
                                        {
                                            FrontCard[k]=btCardData2[k];
                                        }
                                        else
                                        {
                                            MidCard[k-1]=btCardData2[k];
                                        }
                                    }
                                }
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        //散牌
                        btCardCount1=btCardCount;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        MidCard[0]=btCardData1[0];
                        MidCard[1]=btCardData1[4];
                        MidCard[2]=btCardData1[5];
                        MidCard[3]=btCardData1[6];
                        MidCard[4]=btCardData1[7];
                        FrontCard[0]=btCardData1[1];
                        FrontCard[1]=btCardData1[2];
                        FrontCard[2]=btCardData1[3];
                        if(bFirst)
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                bFirst=this.bfalse;
                            }
                        }
                        else
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                            }
                        }
                    }
                }
                if(tagCardType.bStraight)     //第三敦为顺子
                {
                    for(let i=0;i<tagCardType.btStraight;i++)
                    {
                        SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                        btCardCount=btHandCardCount;
                        for(let j=0;j<5;j++)
                        {
                            BackCard[j]=btCardData[tagCardType.cbStraight[i*5+j]];
                        }
                        this.RemoveCard(BackCard,5,btCardData,btCardCount);
                        btCardCount1=btCardCount-=5;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        tagCardType1=this.GetType(btCardData1,btCardCount1);
                        if(tagCardType1.bStraight)     //剩下顺子
                        {
                            for(let j=0;j<tagCardType1.btStraight;j++)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<5;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbStraight[j*5+k]];
                                }
                                this.RemoveCard(MidCard,5,btCardData1,btCardCount1);
                                SssLib.CopyMemory(FrontCard,btCardData1,SssLib.sizeof(FrontCard));
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        else if(tagCardType1.bThreeSame)    //剩下三条
                        {
                            for(let j=0;j<tagCardType1.btThreeSame;j++)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<3;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbThreeSame[j*3+k]];
                                }
                                this.RemoveCard(MidCard,3,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=3;
                                SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                tagCardType2=this.GetType(btCardData2,btCardCount2);
                                if(tagCardType2.bThreeSame)  //三条
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        FrontCard[k]=btCardData2[tagCardType2.cbThreeSame[k]];
                                    }
                                    this.RemoveCard(FrontCard,3,btCardData2,btCardCount2);
                                    MidCard[3]=btCardData2[0];
                                    MidCard[4]=btCardData2[1];
                                }
                                else if(tagCardType2.bTwoPare)  //两对
                                {
                                    for(let k=0;k<4;k++)
                                    {
                                        if(k<2)
                                        {
                                            btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbTwoPare[k]];
                                        }
                                        else
                                        {
                                            btTemp[k]=MidCard[k+1]=btCardData2[tagCardType2.cbTwoPare[k]];
                                        }
                                    }
                                    this.RemoveCard(btTemp,4,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                }
                                else if(tagCardType2.bOnePare)  //一对
                                {
                                    for(let k=0;k<2;k++)
                                    {
                                        btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                    }
                                    this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                    MidCard[3]=btCardData2[1];
                                    MidCard[4]=btCardData2[2];
                                }
                                else                            //散牌
                                {
                                    for(let k=0;k<5;k++)
                                    {
                                        if(k<3)
                                        {
                                            FrontCard[k]=btCardData2[k];
                                        }
                                        else
                                        {
                                            MidCard[k]=btCardData2[k];
                                        }
                                    }
                                }
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        else if(tagCardType1.bTwoPare)      //剩下两对
                        {
                            if(tagCardType1.btOnePare>=3)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                btTemp[0]=FrontCard[0]=btCardData1[tagCardType1.cbOnePare[0]];
                                btTemp[1]=FrontCard[1]=btCardData1[tagCardType1.cbOnePare[1]];
                                btTemp[2]=MidCard[0]=btCardData1[tagCardType1.cbOnePare[2]];
                                btTemp[3]=MidCard[1]=btCardData1[tagCardType1.cbOnePare[3]];
                                btTemp[4]=MidCard[2]=btCardData1[tagCardType1.cbOnePare[4]];
                                btTemp[5]=MidCard[3]=btCardData1[tagCardType1.cbOnePare[5]];
                                this.RemoveCard(btTemp,6,btCardData1,btCardCount1);
                                FrontCard[2]=btCardData1[0];
                                MidCard[4]=btCardData1[1];
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=btAllShuiShu;
                                    }
                                }
                            }
                            else
                            {
                                for(let j=0;j<tagCardType1.btTwoPare;j++)
                                {
                                    btCardCount1=btCardCount;
                                    SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                    for(let k=0;k<4;k++)
                                    {
                                        MidCard[k]=btCardData1[tagCardType1.cbTwoPare[j*4+k]];
                                    }
                                    this.RemoveCard(MidCard,4,btCardData1,btCardCount1);
                                    btCardCount2=btCardCount1-=4;
                                    SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                    tagCardType2=this.GetType(btCardData2,btCardCount2);
                                    if(tagCardType2.bTwoPare)  //两对
                                    {
                                        for(let k=0;k<4;k++)
                                        {
                                            if(k<3)
                                            {
                                                FrontCard[k]=btCardData2[tagCardType2.cbTwoPare[k]];
                                            }
                                            else
                                            {
                                                MidCard[k+1]=btCardData2[tagCardType2.cbTwoPare[k]];
                                            }
                                        }
                                    }
                                    else if(tagCardType2.bOnePare)  //一对
                                    {
                                        for(let k=0;k<2;k++)
                                        {
                                            btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                        }
                                        this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                        FrontCard[2]=btCardData2[0];
                                        MidCard[4]=btCardData2[1];
                                    }
                                    else                            //散牌
                                    {
                                        for(let k=0;k<4;k++)
                                        {
                                            if(k<3)
                                            {
                                                FrontCard[k]=btCardData2[k];
                                            }
                                            else
                                            {
                                                MidCard[k+1]=btCardData2[k];
                                            }
                                        }
                                    }
                                    if(bFirst)
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            bFirst=this.bfalse;
                                        }
                                    }
                                    else
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                            this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        }
                                    }
                                }
                            }

                        }
                        else if(tagCardType1.bOnePare)      //剩下一对
                        {
                            for(let j=0;j<tagCardType1.btOnePare;j++)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<2;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbOnePare[j*2+k]];
                                }
                                this.RemoveCard(MidCard,2,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=2;
                                SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                tagCardType2=this.GetType(btCardData2,btCardCount2);
                                if(tagCardType2.bOnePare)  //一对
                                {
                                    for(let k=0;k<2;k++)
                                    {
                                        btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                    }
                                    this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                    MidCard[2]=btCardData2[1];
                                    MidCard[3]=btCardData2[2];
                                    MidCard[4]=btCardData2[3];
                                }
                                else                            //散牌
                                {
                                    for(let k=0;k<6;k++)
                                    {
                                        if(k<3)
                                        {
                                            FrontCard[k]=btCardData2[k];
                                        }
                                        else
                                        {
                                            MidCard[k-1]=btCardData2[k];
                                        }
                                    }
                                }
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        //散牌
                        btCardCount1=btCardCount;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        MidCard[0]=btCardData1[0];
                        MidCard[1]=btCardData1[4];
                        MidCard[2]=btCardData1[5];
                        MidCard[3]=btCardData1[6];
                        MidCard[4]=btCardData1[7];
                        FrontCard[0]=btCardData1[1];
                        FrontCard[1]=btCardData1[2];
                        FrontCard[2]=btCardData1[3];
                        if(bFirst)
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                bFirst=this.bfalse;
                            }
                        }
                        else
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                            }
                        }
                    }
                }
                if(tagCardType.bThreeSame)    //第三敦为三条
                {
                    for(let i=0;i<tagCardType.btThreeSame;i++)
                    {
                        SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                        btCardCount=btHandCardCount;
                        for(let j=0;j<3;j++)
                        {
                            BackCard[j]=btCardData[tagCardType.cbThreeSame[i*3+j]];
                        }
                        this.RemoveCard(BackCard,3,btCardData,btCardCount);
                        btCardCount1=btCardCount-=3;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        tagCardType1=this.GetType(btCardData1,btCardCount1);
                        if(tagCardType1.bThreeSame)    //剩下三条
                        {
                            for(let j=0;j<tagCardType1.btThreeSame;j++)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<3;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbThreeSame[j*3+k]];
                                }
                                this.RemoveCard(MidCard,3,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=3;
                                SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                tagCardType2=this.GetType(btCardData2,btCardCount2);
                                if(tagCardType2.bThreeSame)  //三条
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        FrontCard[k]=btCardData2[tagCardType2.cbThreeSame[k]];
                                    }
                                    this.RemoveCard(FrontCard,3,btCardData2,btCardCount2);
                                    MidCard[3]=btCardData2[0];
                                    MidCard[4]=btCardData2[1];
                                    BackCard[3]=btCardData2[2];
                                    BackCard[4]=btCardData2[3];
                                }
                                else if(tagCardType2.bTwoPare)  //两对
                                {
                                    for(let k=0;k<4;k++)
                                    {
                                        if(k<2)
                                        {
                                            btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbTwoPare[k]];
                                        }
                                        else
                                        {
                                            btTemp[k]=BackCard[k+1]=btCardData2[tagCardType2.cbTwoPare[k]];
                                        }
                                    }
                                    this.RemoveCard(btTemp,4,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                    MidCard[3]=btCardData2[1];
                                    MidCard[4]=btCardData2[2];
                                }
                                else if(tagCardType2.bOnePare)  //一对
                                {
                                    for(let k=0;k<2;k++)
                                    {
                                        btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                    }
                                    this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                    MidCard[3]=btCardData2[1];
                                    MidCard[4]=btCardData2[2];
                                    BackCard[3]=btCardData2[3];
                                    BackCard[4]=btCardData2[4];
                                }
                                else                            //散牌
                                {
                                    FrontCard[0]=btCardData2[0];
                                    FrontCard[1]=btCardData2[1];
                                    FrontCard[2]=btCardData2[2];
                                    MidCard[3]=btCardData2[3];
                                    MidCard[4]=btCardData2[4];
                                    BackCard[3]=btCardData2[5];
                                    BackCard[4]=btCardData2[6];
                                }
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        else if(tagCardType1.bTwoPare)      //剩下两对
                        {
                            if(tagCardType1.btOnePare>=3)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                btTemp[0]=FrontCard[0]=btCardData1[tagCardType1.cbOnePare[0]];
                                btTemp[1]=FrontCard[1]=btCardData1[tagCardType1.cbOnePare[1]];
                                btTemp[2]=MidCard[0]=btCardData1[tagCardType1.cbOnePare[2]];
                                btTemp[3]=MidCard[1]=btCardData1[tagCardType1.cbOnePare[3]];
                                btTemp[4]=MidCard[2]=btCardData1[tagCardType1.cbOnePare[4]];
                                btTemp[5]=MidCard[3]=btCardData1[tagCardType1.cbOnePare[5]];
                                this.RemoveCard(btTemp,6,btCardData1,btCardCount1);
                                FrontCard[2]=btCardData1[0];
                                MidCard[4]=btCardData1[1];
                                BackCard[3]=btCardData1[2];
                                BackCard[4]=btCardData1[3];
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=btAllShuiShu;
                                    }
                                }
                            }
                            else
                            {
                                for(let j=0;j<tagCardType1.btTwoPare;j++)
                                {
                                    btCardCount1=btCardCount;
                                    SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                    for(let k=0;k<4;k++)
                                    {
                                        MidCard[k]=btCardData1[tagCardType1.cbTwoPare[j*4+k]];
                                    }
                                    this.RemoveCard(MidCard,4,btCardData1,btCardCount1);
                                    btCardCount2=btCardCount1-=4;
                                    SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                    tagCardType2=this.GetType(btCardData2,btCardCount2);
                                    if(tagCardType2.bTwoPare)  //两对
                                    {
                                        for(let k=0;k<4;k++)
                                        {
                                            if(k<3)
                                            {
                                                btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbTwoPare[k]];
                                            }
                                            else
                                            {
                                                btTemp[k]=MidCard[k+1]=btCardData2[tagCardType2.cbTwoPare[k]];
                                            }
                                        }
                                        this.RemoveCard(btTemp,4,btCardData2,btCardCount2);
                                        BackCard[3]=btCardData2[0];
                                        BackCard[4]=btCardData2[1];
                                    }
                                    else if(tagCardType2.bOnePare)  //一对
                                    {
                                        for(let k=0;k<2;k++)
                                        {
                                            btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                        }
                                        this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                        FrontCard[2]=btCardData2[0];
                                        MidCard[4]=btCardData2[1];
                                        BackCard[3]=btCardData2[2];
                                        BackCard[4]=btCardData2[3];
                                    }
                                    else                            //散牌
                                    {
                                        FrontCard[0]=btCardData2[0];
                                        FrontCard[1]=btCardData2[1];
                                        FrontCard[2]=btCardData2[2];
                                        MidCard[4]=btCardData2[3];
                                        BackCard[3]=btCardData2[4];
                                        BackCard[4]=btCardData2[5];
                                    }
                                    if(bFirst)
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            bFirst=this.bfalse;
                                        }
                                    }
                                    else
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                            this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        }
                                    }
                                }
                            }

                        }
                        else if(tagCardType1.bOnePare)      //剩下一对
                        {
                            for(let j=0;j<tagCardType1.btOnePare;j++)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<2;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbOnePare[j*2+k]];
                                }
                                this.RemoveCard(MidCard,2,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=2;
                                SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                tagCardType2=this.GetType(btCardData2,btCardCount2);
                                if(tagCardType2.bOnePare)  //一对
                                {
                                    for(let k=0;k<2;k++)
                                    {
                                        btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                    }
                                    this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                    MidCard[2]=btCardData2[1];
                                    MidCard[3]=btCardData2[2];
                                    MidCard[4]=btCardData2[3];
                                    BackCard[3]=btCardData2[4];
                                    BackCard[4]=btCardData2[5];
                                }
                                else                            //散牌
                                {
                                    FrontCard[0]=btCardData2[0];
                                    FrontCard[1]=btCardData2[1];
                                    FrontCard[2]=btCardData2[2];
                                    MidCard[2]=btCardData2[3];
                                    MidCard[3]=btCardData2[4];
                                    MidCard[4]=btCardData2[5];
                                    BackCard[3]=btCardData2[6];
                                    BackCard[4]=btCardData2[7];
                                }
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        //散牌
                        btCardCount1=btCardCount;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        MidCard[0]=btCardData1[0];
                        MidCard[1]=btCardData1[4];
                        MidCard[2]=btCardData1[5];
                        MidCard[3]=btCardData1[6];
                        MidCard[4]=btCardData1[7];
                        BackCard[3]=btCardData1[8];
                        BackCard[4]=btCardData1[9];
                        FrontCard[0]=btCardData1[1];
                        FrontCard[1]=btCardData1[2];
                        FrontCard[2]=btCardData1[3];
                        if(bFirst)
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                bFirst=this.bfalse;
                            }
                        }
                        else
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                            }
                        }
                    }
                }
                if(tagCardType.bTwoPare)      //第三敦为两对
                {
                    if(tagCardType.btOnePare<4)
                    {
                        for(let i=0;i<tagCardType.btTwoPare;i++)
                        {
                            SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                            btCardCount=btHandCardCount;
                            for(let j=0;j<4;j++)
                            {
                                BackCard[j]=btCardData[tagCardType.cbTwoPare[i*4+j]];
                            }
                            this.RemoveCard(BackCard,4,btCardData,btCardCount);
                            btCardCount1=btCardCount-=4;
                            SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                            tagCardType1=this.GetType(btCardData1,btCardCount1);
                            if(tagCardType1.bTwoPare)      //剩下两对
                            {
                                if(tagCardType1.btOnePare>=3)
                                {
                                    btCardCount1=btCardCount;
                                    SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                    btTemp[0]=FrontCard[0]=btCardData1[tagCardType1.cbOnePare[0]];
                                    btTemp[1]=FrontCard[1]=btCardData1[tagCardType1.cbOnePare[1]];
                                    btTemp[2]=MidCard[0]=btCardData1[tagCardType1.cbOnePare[2]];
                                    btTemp[3]=MidCard[1]=btCardData1[tagCardType1.cbOnePare[3]];
                                    btTemp[4]=MidCard[2]=btCardData1[tagCardType1.cbOnePare[4]];
                                    btTemp[5]=MidCard[3]=btCardData1[tagCardType1.cbOnePare[5]];
                                    this.RemoveCard(btTemp,6,btCardData1,btCardCount1);
                                    FrontCard[2]=btCardData1[0];
                                    MidCard[4]=btCardData1[1];
                                    BackCard[4]=btCardData1[2];
                                    if(bFirst)
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                            bFirst=this.bfalse;
                                        }
                                    }
                                    else
                                    {
                                        btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                            this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            btFrontAllShuiShu=btAllShuiShu;
                                        }
                                    }
                                }
                                else
                                {
                                    for(let j=0;j<tagCardType1.btTwoPare;j++)
                                    {
                                        btCardCount1=btCardCount;
                                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                        for(let k=0;k<4;k++)
                                        {
                                            MidCard[k]=btCardData1[tagCardType1.cbTwoPare[j*4+k]];
                                        }
                                        this.RemoveCard(MidCard,4,btCardData1,btCardCount1);
                                        btCardCount2=btCardCount1-=4;
                                        SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                        tagCardType2=this.GetType(btCardData2,btCardCount2);
                                        if(tagCardType2.bTwoPare)  //两对
                                        {
                                            for(let k=0;k<4;k++)
                                            {
                                                if(k<3)
                                                {
                                                    btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbTwoPare[k]];
                                                }
                                                else
                                                {
                                                    btTemp[k]=MidCard[k+1]=btCardData2[tagCardType2.cbTwoPare[k]];
                                                }
                                            }
                                            this.RemoveCard(btTemp,4,btCardData2,btCardCount2);
                                            BackCard[4]=btCardData2[0];
                                        }
                                        else if(tagCardType2.bOnePare)  //一对
                                        {
                                            for(let k=0;k<2;k++)
                                            {
                                                btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                            }
                                            this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                            FrontCard[2]=btCardData2[0];
                                            MidCard[4]=btCardData2[1];
                                            BackCard[4]=btCardData2[2];
                                        }
                                        else                            //散牌
                                        {
                                            FrontCard[0]=btCardData2[0];
                                            FrontCard[1]=btCardData2[1];
                                            FrontCard[2]=btCardData2[2];
                                            MidCard[4]=btCardData2[3];
                                            BackCard[4]=btCardData2[4];
                                        }
                                        if(bFirst)
                                        {
                                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                            {
                                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                                bFirst=this.bfalse;
                                            }
                                        }
                                        else
                                        {
                                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                                this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                            {
                                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            }
                                        }
                                    }
                                }

                            }
                            else if(tagCardType1.bOnePare)      //剩下一对
                            {
                                for(let j=0;j<tagCardType1.btOnePare;j++)
                                {
                                    btCardCount1=btCardCount;
                                    SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                    for(let k=0;k<2;k++)
                                    {
                                        MidCard[k]=btCardData1[tagCardType1.cbOnePare[j*2+k]];
                                    }
                                    this.RemoveCard(MidCard,2,btCardData1,btCardCount1);
                                    btCardCount2=btCardCount1-=2;
                                    SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                    tagCardType2=this.GetType(btCardData2,btCardCount2);
                                    if(tagCardType2.bOnePare)  //一对
                                    {
                                        for(let k=0;k<2;k++)
                                        {
                                            btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                        }
                                        this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                        FrontCard[2]=btCardData2[0];
                                        MidCard[2]=btCardData2[1];
                                        MidCard[3]=btCardData2[2];
                                        MidCard[4]=btCardData2[3];
                                        BackCard[4]=btCardData2[4];
                                    }
                                    else                            //散牌
                                    {
                                        FrontCard[0]=btCardData2[0];
                                        FrontCard[1]=btCardData2[1];
                                        FrontCard[2]=btCardData2[2];
                                        MidCard[2]=btCardData2[3];
                                        MidCard[3]=btCardData2[4];
                                        MidCard[4]=btCardData2[5];
                                        BackCard[4]=btCardData2[6];
                                    }
                                    if(bFirst)
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            bFirst=this.bfalse;
                                        }
                                    }
                                    else
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                            this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        }
                                    }
                                }
                            }
                            //散牌
                            btCardCount1=btCardCount;
                            SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                            MidCard[0]=btCardData1[0];
                            MidCard[1]=btCardData1[4];
                            MidCard[2]=btCardData1[5];
                            MidCard[3]=btCardData1[6];
                            MidCard[4]=btCardData1[7];
                            BackCard[4]=btCardData1[8];
                            FrontCard[0]=btCardData1[1];
                            FrontCard[1]=btCardData1[2];
                            FrontCard[2]=btCardData1[3];
                            if(bFirst)
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    bFirst=this.bfalse;
                                }
                            }
                            else
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                    this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                }
                            }
                        }
                    }
                    else
                    {
                        if(tagCardType.btOnePare==4)
                        {
                            SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                            btCardCount=btHandCardCount;
                            btTemp[0]=BackCard[0]=btCardData[tagCardType.cbOnePare[0]];
                            btTemp[1]=BackCard[1]=btCardData[tagCardType.cbOnePare[1]];
                            btTemp[2]=BackCard[2]=btCardData[tagCardType.cbOnePare[6]];
                            btTemp[3]=BackCard[3]=btCardData[tagCardType.cbOnePare[7]];
                            btTemp[4]=MidCard[0]=btCardData[tagCardType.cbOnePare[2]];
                            btTemp[5]=MidCard[1]=btCardData[tagCardType.cbOnePare[3]];
                            btTemp[6]=MidCard[2]=btCardData[tagCardType.cbOnePare[4]];
                            btTemp[7]=MidCard[3]=btCardData[tagCardType.cbOnePare[5]];
                            this.RemoveCard(btTemp,8,btCardData,btCardCount);
                            FrontCard[0]=btCardData[0];
                            FrontCard[1]=btCardData[1];
                            FrontCard[2]=btCardData[2];
                            MidCard[4]=btCardData[3];
                            BackCard[4]=btCardData[4];
                            if(this.GetCardLogicValue(FrontCard[0])==14&&this.GetCardLogicValue(FrontCard[1])==13)
                            {
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                            else
                            {
                                SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                                btCardCount=btHandCardCount;
                                btTemp[0]=BackCard[0]=btCardData[tagCardType.cbOnePare[4]];
                                btTemp[1]=BackCard[1]=btCardData[tagCardType.cbOnePare[5]];
                                btTemp[2]=BackCard[2]=btCardData[tagCardType.cbOnePare[6]];
                                btTemp[3]=BackCard[3]=btCardData[tagCardType.cbOnePare[7]];
                                btTemp[4]=MidCard[0]=btCardData[tagCardType.cbOnePare[0]];
                                btTemp[5]=MidCard[1]=btCardData[tagCardType.cbOnePare[1]];
                                btTemp[6]=FrontCard[0]=btCardData[tagCardType.cbOnePare[2]];
                                btTemp[7]=FrontCard[1]=btCardData[tagCardType.cbOnePare[3]];
                                this.RemoveCard(btTemp,8,btCardData,btCardCount);
                                FrontCard[2]=btCardData[0];
                                MidCard[2]=btCardData[1];
                                MidCard[3]=btCardData[2];
                                MidCard[4]=btCardData[3];
                                BackCard[4]=btCardData[4];
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        else if(tagCardType.btOnePare==5)
                        {
                            SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                            btCardCount=btHandCardCount;
                            btTemp[0]=FrontCard[0]=btCardData[tagCardType.cbOnePare[0]];
                            btTemp[1]=FrontCard[1]=btCardData[tagCardType.cbOnePare[1]];
                            btTemp[2]=MidCard[0]=btCardData[tagCardType.cbOnePare[4]];
                            btTemp[3]=MidCard[1]=btCardData[tagCardType.cbOnePare[5]];
                            btTemp[4]=MidCard[2]=btCardData[tagCardType.cbOnePare[6]];
                            btTemp[5]=MidCard[3]=btCardData[tagCardType.cbOnePare[7]];
                            btTemp[6]=BackCard[0]=btCardData[tagCardType.cbOnePare[2]];
                            btTemp[7]=BackCard[1]=btCardData[tagCardType.cbOnePare[3]];
                            btTemp[8]=BackCard[2]=btCardData[tagCardType.cbOnePare[8]];
                            btTemp[9]=BackCard[3]=btCardData[tagCardType.cbOnePare[9]];
                            this.RemoveCard(btTemp,10,btCardData,btCardCount);
                            FrontCard[2]=btCardData[0];
                            MidCard[4]=btCardData[1];
                            BackCard[4]=btCardData[2];
                            if(bFirst)
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    bFirst=this.bfalse;
                                }
                            }
                            else
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                    this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                }
                            }
                        }
                    }
                }
                if(tagCardType.bOnePare)      //第三敦为一对
                {
                    for(let i=0;i<tagCardType.btOnePare;i++)
                    {
                        SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                        btCardCount=btHandCardCount;
                        for(let j=0;j<2;j++)
                        {
                            BackCard[j]=btCardData[tagCardType.cbOnePare[i*2+j]];
                        }
                        this.RemoveCard(BackCard,2,btCardData,btCardCount);
                        btCardCount1=btCardCount-=2;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        tagCardType1=this.GetType(btCardData1,btCardCount1);
                        if(tagCardType1.bOnePare)      //剩下一对
                        {
                            for(let j=0;j<tagCardType1.btOnePare;j++)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<2;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbOnePare[j*2+k]];
                                }
                                this.RemoveCard(MidCard,2,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=2;
                                SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                tagCardType2=this.GetType(btCardData2,btCardCount2);
                                if(tagCardType2.bOnePare)  //一对
                                {
                                    for(let k=0;k<2;k++)
                                    {
                                        btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                    }
                                    this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                    MidCard[2]=btCardData2[1];
                                    MidCard[3]=btCardData2[2];
                                    MidCard[4]=btCardData2[3];
                                    BackCard[2]=btCardData2[4];
                                    BackCard[3]=btCardData2[5];
                                    BackCard[4]=btCardData2[6];
                                }
                                else                            //散牌
                                {
                                    FrontCard[0]=btCardData2[0];
                                    FrontCard[1]=btCardData2[1];
                                    FrontCard[2]=btCardData2[2];
                                    MidCard[2]=btCardData2[3];
                                    MidCard[3]=btCardData2[4];
                                    MidCard[4]=btCardData2[5];
                                    BackCard[2]=btCardData2[6];
                                    BackCard[3]=btCardData2[7];
                                    BackCard[4]=btCardData2[8];
                                }
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        //散牌
                        btCardCount1=btCardCount;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        MidCard[0]=btCardData1[0];
                        MidCard[1]=btCardData1[4];
                        MidCard[2]=btCardData1[5];
                        MidCard[3]=btCardData1[6];
                        MidCard[4]=btCardData1[7];
                        BackCard[2]=btCardData1[8];
                        BackCard[3]=btCardData1[9];
                        BackCard[4]=btCardData1[10];
                        FrontCard[0]=btCardData1[1];
                        FrontCard[1]=btCardData1[2];
                        FrontCard[2]=btCardData1[3];
                        if(bFirst)
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                bFirst=this.bfalse;
                            }
                        }
                        else
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                            }
                        }
                    }
                }
            }
        }
        else if(tagCardType.bStraight)//有顺子
        {
            let bThreeSame=this.bfalse;
            for(let i=0;i<tagCardType.btThreeSame;i++)
            {
                SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                btCardCount=btHandCardCount;
                for(let j=0;j<3;j++)
                {
                    FrontCard[j]=btCardData[tagCardType.cbThreeSame[i*3+j]];
                }
                this.RemoveCard(FrontCard,3,btCardData,btCardCount);
                btCardCount1=btCardCount-=3;
                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                tagCardType1=this.GetType(btCardData1,btCardCount1);
                if(tagCardType1.bStraight)  //有顺子
                {
                    for(let j=0;j<tagCardType1.btStraight;j++)
                    {
                        btCardCount1=btCardCount;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        for(let k=0;k<5;k++)
                        {
                            BackCard[k]=btCardData1[tagCardType1.cbStraight[j*5+k]];
                        }
                        this.RemoveCard(BackCard,5,btCardData1,btCardCount1);
                        SssLib.CopyMemory(MidCard,btCardData1,SssLib.sizeof(MidCard));
                        if(bFirst)
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                            {
                                bThreeSame=this.btrue;
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                bFirst=this.bfalse;
                            }
                        }
                        else
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                            {
                                bThreeSame=this.btrue;
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                btFrontAllShuiShu=btAllShuiShu;
                            }
                        }
                    }
                }
                if(tagCardType1.bThreeSame) //有三条
                {
                    for(let j=0;j<tagCardType1.btThreeSame;j++)
                    {
                        btCardCount1=btCardCount;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        for(let k=0;k<3;k++)
                        {
                            BackCard[k]=btCardData1[tagCardType1.cbThreeSame[j*3+k]];
                        }
                        this.RemoveCard(BackCard,3,btCardData1,btCardCount1);
                        btCardCount2=btCardCount1-=3;
                        SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                        tagCardType2=this.GetType(btCardData2,btCardCount2);
                        if(tagCardType2.bThreeSame)
                        {
                            for(let k=0;k<tagCardType2.btThreeSame;k++)
                            {
                                for(let m=0;m<3;m++)
                                {
                                    MidCard[m]=btCardData2[tagCardType2.cbThreeSame[k*3+m]];
                                }
                                this.RemoveCard(MidCard,3,btCardData2,btCardCount2);
                                BackCard[3]=btCardData2[2];
                                BackCard[4]=btCardData2[3];
                                MidCard[3]=btCardData2[0];
                                MidCard[4]=btCardData2[1];
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        bThreeSame=this.btrue;
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        bThreeSame=this.btrue;
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=btAllShuiShu;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if(bThreeSame==this.bfalse)
            {
                if(tagCardType.bStraight)     //第三敦为顺子
                {
                    for(let i=0;i<tagCardType.btStraight;i++)
                    {
                        SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                        btCardCount=btHandCardCount;
                        for(let j=0;j<5;j++)
                        {
                            BackCard[j]=btCardData[tagCardType.cbStraight[i*5+j]];
                        }
                        this.RemoveCard(BackCard,5,btCardData,btCardCount);
                        btCardCount1=btCardCount-=5;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        tagCardType1=this.GetType(btCardData1,btCardCount1);
                        if(tagCardType1.bStraight)     //剩下顺子
                        {
                            for(let j=0;j<tagCardType1.btStraight;j++)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<5;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbStraight[j*5+k]];
                                }
                                this.RemoveCard(MidCard,5,btCardData1,btCardCount1);
                                SssLib.CopyMemory(FrontCard,btCardData1,SssLib.sizeof(FrontCard));
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        else if(tagCardType1.bThreeSame)    //剩下三条
                        {
                            for(let j=0;j<tagCardType1.btThreeSame;j++)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<3;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbThreeSame[j*3+k]];
                                }
                                this.RemoveCard(MidCard,3,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=3;
                                SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                tagCardType2=this.GetType(btCardData2,btCardCount2);
                                if(tagCardType2.bThreeSame)  //三条
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        FrontCard[k]=btCardData2[tagCardType2.cbThreeSame[k]];
                                    }
                                    this.RemoveCard(FrontCard,3,btCardData2,btCardCount2);
                                    MidCard[3]=btCardData2[0];
                                    MidCard[4]=btCardData2[1];
                                }
                                else if(tagCardType2.bTwoPare)  //两对
                                {
                                    for(let k=0;k<4;k++)
                                    {
                                        if(k<2)
                                        {
                                            btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbTwoPare[k]];
                                        }
                                        else
                                        {
                                            btTemp[k]=MidCard[k+1]=btCardData2[tagCardType2.cbTwoPare[k]];
                                        }
                                    }
                                    this.RemoveCard(btTemp,4,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                }
                                else if(tagCardType2.bOnePare)  //一对
                                {
                                    for(let k=0;k<2;k++)
                                    {
                                        btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                    }
                                    this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                    MidCard[3]=btCardData2[1];
                                    MidCard[4]=btCardData2[2];
                                }
                                else                            //散牌
                                {
                                    for(let k=0;k<5;k++)
                                    {
                                        if(k<3)
                                        {
                                            FrontCard[k]=btCardData2[k];
                                        }
                                        else
                                        {
                                            MidCard[k]=btCardData2[k];
                                        }
                                    }
                                }
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        else if(tagCardType1.bTwoPare)      //剩下两对
                        {
                            if(tagCardType1.btOnePare>=3)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                btTemp[0]=FrontCard[0]=btCardData1[tagCardType1.cbOnePare[0]];
                                btTemp[1]=FrontCard[1]=btCardData1[tagCardType1.cbOnePare[1]];
                                btTemp[2]=MidCard[0]=btCardData1[tagCardType1.cbOnePare[2]];
                                btTemp[3]=MidCard[1]=btCardData1[tagCardType1.cbOnePare[3]];
                                btTemp[4]=MidCard[2]=btCardData1[tagCardType1.cbOnePare[4]];
                                btTemp[5]=MidCard[3]=btCardData1[tagCardType1.cbOnePare[5]];
                                this.RemoveCard(btTemp,6,btCardData1,btCardCount1);
                                FrontCard[2]=btCardData1[0];
                                MidCard[4]=btCardData1[1];
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=btAllShuiShu;
                                    }
                                }
                            }
                            else
                            {
                                for(let j=0;j<tagCardType1.btTwoPare;j++)
                                {
                                    btCardCount1=btCardCount;
                                    SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                    for(let k=0;k<4;k++)
                                    {
                                        MidCard[k]=btCardData1[tagCardType1.cbTwoPare[j*4+k]];
                                    }
                                    this.RemoveCard(MidCard,4,btCardData1,btCardCount1);
                                    btCardCount2=btCardCount1-=4;
                                    SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                    tagCardType2=this.GetType(btCardData2,btCardCount2);
                                    if(tagCardType2.bTwoPare)  //两对
                                    {
                                        for(let k=0;k<4;k++)
                                        {
                                            if(k<3)
                                            {
                                                FrontCard[k]=btCardData2[tagCardType2.cbTwoPare[k]];
                                            }
                                            else
                                            {
                                                MidCard[k+1]=btCardData2[tagCardType2.cbTwoPare[k]];
                                            }
                                        }
                                    }
                                    else if(tagCardType2.bOnePare)  //一对
                                    {
                                        for(let k=0;k<2;k++)
                                        {
                                            btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                        }
                                        this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                        FrontCard[2]=btCardData2[0];
                                        MidCard[4]=btCardData2[1];
                                    }
                                    else                            //散牌
                                    {
                                        for(let k=0;k<4;k++)
                                        {
                                            if(k<3)
                                            {
                                                FrontCard[k]=btCardData2[k];
                                            }
                                            else
                                            {
                                                MidCard[k+1]=btCardData2[k];
                                            }
                                        }
                                    }
                                    if(bFirst)
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            bFirst=this.bfalse;
                                        }
                                    }
                                    else
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                            this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        }
                                    }
                                }
                            }

                        }
                        else if(tagCardType1.bOnePare)      //剩下一对
                        {
                            for(let j=0;j<tagCardType1.btOnePare;j++)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<2;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbOnePare[j*2+k]];
                                }
                                this.RemoveCard(MidCard,2,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=2;
                                SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                tagCardType2=this.GetType(btCardData2,btCardCount2);
                                if(tagCardType2.bOnePare)  //一对
                                {
                                    for(let k=0;k<2;k++)
                                    {
                                        btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                    }
                                    this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                    MidCard[2]=btCardData2[1];
                                    MidCard[3]=btCardData2[2];
                                    MidCard[4]=btCardData2[3];
                                }
                                else                            //散牌
                                {
                                    for(let k=0;k<6;k++)
                                    {
                                        if(k<3)
                                        {
                                            FrontCard[k]=btCardData2[k];
                                        }
                                        else
                                        {
                                            MidCard[k-1]=btCardData2[k];
                                        }
                                    }
                                }
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        //散牌
                        btCardCount1=btCardCount;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        MidCard[0]=btCardData1[0];
                        MidCard[1]=btCardData1[4];
                        MidCard[2]=btCardData1[5];
                        MidCard[3]=btCardData1[6];
                        MidCard[4]=btCardData1[7];
                        FrontCard[0]=btCardData1[1];
                        FrontCard[1]=btCardData1[2];
                        FrontCard[2]=btCardData1[3];
                        if(bFirst)
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                bFirst=this.bfalse;
                            }
                        }
                        else
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                            }
                        }
                    }
                }
                if(tagCardType.bThreeSame)    //第三敦为三条
                {
                    for(let i=0;i<tagCardType.btThreeSame;i++)
                    {
                        SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                        btCardCount=btHandCardCount;
                        for(let j=0;j<3;j++)
                        {
                            BackCard[j]=btCardData[tagCardType.cbThreeSame[i*3+j]];
                        }
                        this.RemoveCard(BackCard,3,btCardData,btCardCount);
                        btCardCount1=btCardCount-=3;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        tagCardType1=this.GetType(btCardData1,btCardCount1);
                        if(tagCardType1.bThreeSame)    //剩下三条
                        {
                            for(let j=0;j<tagCardType1.btThreeSame;j++)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<3;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbThreeSame[j*3+k]];
                                }
                                this.RemoveCard(MidCard,3,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=3;
                                SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                tagCardType2=this.GetType(btCardData2,btCardCount2);
                                if(tagCardType2.bThreeSame)  //三条
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        FrontCard[k]=btCardData2[tagCardType2.cbThreeSame[k]];
                                    }
                                    this.RemoveCard(FrontCard,3,btCardData2,btCardCount2);
                                    MidCard[3]=btCardData2[0];
                                    MidCard[4]=btCardData2[1];
                                    BackCard[3]=btCardData2[2];
                                    BackCard[4]=btCardData2[3];
                                }
                                else if(tagCardType2.bTwoPare)  //两对
                                {
                                    for(let k=0;k<4;k++)
                                    {
                                        if(k<2)
                                        {
                                            btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbTwoPare[k]];
                                        }
                                        else
                                        {
                                            btTemp[k]=BackCard[k+1]=btCardData2[tagCardType2.cbTwoPare[k]];
                                        }
                                    }
                                    this.RemoveCard(btTemp,4,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                    MidCard[3]=btCardData2[1];
                                    MidCard[4]=btCardData2[2];
                                }
                                else if(tagCardType2.bOnePare)  //一对
                                {
                                    for(let k=0;k<2;k++)
                                    {
                                        btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                    }
                                    this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                    MidCard[3]=btCardData2[1];
                                    MidCard[4]=btCardData2[2];
                                    BackCard[3]=btCardData2[3];
                                    BackCard[4]=btCardData2[4];
                                }
                                else                            //散牌
                                {
                                    FrontCard[0]=btCardData2[0];
                                    FrontCard[1]=btCardData2[1];
                                    FrontCard[2]=btCardData2[2];
                                    MidCard[3]=btCardData2[3];
                                    MidCard[4]=btCardData2[4];
                                    BackCard[3]=btCardData2[5];
                                    BackCard[4]=btCardData2[6];
                                }
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        else if(tagCardType1.bTwoPare)      //剩下两对
                        {
                            if(tagCardType1.btOnePare>=3)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                btTemp[0]=FrontCard[0]=btCardData1[tagCardType1.cbOnePare[0]];
                                btTemp[1]=FrontCard[1]=btCardData1[tagCardType1.cbOnePare[1]];
                                btTemp[2]=MidCard[0]=btCardData1[tagCardType1.cbOnePare[2]];
                                btTemp[3]=MidCard[1]=btCardData1[tagCardType1.cbOnePare[3]];
                                btTemp[4]=MidCard[2]=btCardData1[tagCardType1.cbOnePare[4]];
                                btTemp[5]=MidCard[3]=btCardData1[tagCardType1.cbOnePare[5]];
                                this.RemoveCard(btTemp,6,btCardData1,btCardCount1);
                                FrontCard[2]=btCardData1[0];
                                MidCard[4]=btCardData1[1];
                                BackCard[3]=btCardData1[2];
                                BackCard[4]=btCardData1[3];
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        btFrontAllShuiShu=btAllShuiShu;
                                    }
                                }
                            }
                            else
                            {
                                for(let j=0;j<tagCardType1.btTwoPare;j++)
                                {
                                    btCardCount1=btCardCount;
                                    SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                    for(let k=0;k<4;k++)
                                    {
                                        MidCard[k]=btCardData1[tagCardType1.cbTwoPare[j*4+k]];
                                    }
                                    this.RemoveCard(MidCard,4,btCardData1,btCardCount1);
                                    btCardCount2=btCardCount1-=4;
                                    SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                    tagCardType2=this.GetType(btCardData2,btCardCount2);
                                    if(tagCardType2.bTwoPare)  //两对
                                    {
                                        for(let k=0;k<4;k++)
                                        {
                                            if(k<3)
                                            {
                                                btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbTwoPare[k]];
                                            }
                                            else
                                            {
                                                btTemp[k]=MidCard[k+1]=btCardData2[tagCardType2.cbTwoPare[k]];
                                            }
                                        }
                                        this.RemoveCard(btTemp,4,btCardData2,btCardCount2);
                                        BackCard[3]=btCardData2[0];
                                        BackCard[4]=btCardData2[1];
                                    }
                                    else if(tagCardType2.bOnePare)  //一对
                                    {
                                        for(let k=0;k<2;k++)
                                        {
                                            btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                        }
                                        this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                        FrontCard[2]=btCardData2[0];
                                        MidCard[4]=btCardData2[1];
                                        BackCard[3]=btCardData2[2];
                                        BackCard[4]=btCardData2[3];
                                    }
                                    else                            //散牌
                                    {
                                        FrontCard[0]=btCardData2[0];
                                        FrontCard[1]=btCardData2[1];
                                        FrontCard[2]=btCardData2[2];
                                        MidCard[4]=btCardData2[3];
                                        BackCard[3]=btCardData2[4];
                                        BackCard[4]=btCardData2[5];
                                    }
                                    if(bFirst)
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            bFirst=this.bfalse;
                                        }
                                    }
                                    else
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                            this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        }
                                    }
                                }
                            }

                        }
                        else if(tagCardType1.bOnePare)      //剩下一对
                        {
                            for(let j=0;j<tagCardType1.btOnePare;j++)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<2;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbOnePare[j*2+k]];
                                }
                                this.RemoveCard(MidCard,2,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=2;
                                SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                tagCardType2=this.GetType(btCardData2,btCardCount2);
                                if(tagCardType2.bOnePare)  //一对
                                {
                                    for(let k=0;k<2;k++)
                                    {
                                        btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                    }
                                    this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                    MidCard[2]=btCardData2[1];
                                    MidCard[3]=btCardData2[2];
                                    MidCard[4]=btCardData2[3];
                                    BackCard[3]=btCardData2[4];
                                    BackCard[4]=btCardData2[5];
                                }
                                else                            //散牌
                                {
                                    FrontCard[0]=btCardData2[0];
                                    FrontCard[1]=btCardData2[1];
                                    FrontCard[2]=btCardData2[2];
                                    MidCard[2]=btCardData2[3];
                                    MidCard[3]=btCardData2[4];
                                    MidCard[4]=btCardData2[5];
                                    BackCard[3]=btCardData2[6];
                                    BackCard[4]=btCardData2[7];
                                }
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        //散牌
                        btCardCount1=btCardCount;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        MidCard[0]=btCardData1[0];
                        MidCard[1]=btCardData1[4];
                        MidCard[2]=btCardData1[5];
                        MidCard[3]=btCardData1[6];
                        MidCard[4]=btCardData1[7];
                        BackCard[3]=btCardData1[8];
                        BackCard[4]=btCardData1[9];
                        FrontCard[0]=btCardData1[1];
                        FrontCard[1]=btCardData1[2];
                        FrontCard[2]=btCardData1[3];
                        if(bFirst)
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                bFirst=this.bfalse;
                            }
                        }
                        else
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                            }
                        }
                    }
                }
                if(tagCardType.bTwoPare)      //第三敦为两对
                {
                    if(tagCardType.btOnePare<4)
                    {
                        for(let i=0;i<tagCardType.btTwoPare;i++)
                        {
                            SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                            btCardCount=btHandCardCount;
                            for(let j=0;j<4;j++)
                            {
                                BackCard[j]=btCardData[tagCardType.cbTwoPare[i*4+j]];
                            }
                            this.RemoveCard(BackCard,4,btCardData,btCardCount);
                            btCardCount1=btCardCount-=4;
                            SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                            tagCardType1=this.GetType(btCardData1,btCardCount1);
                            if(tagCardType1.bTwoPare)      //剩下两对
                            {
                                if(tagCardType1.btOnePare>=3)
                                {
                                    btCardCount1=btCardCount;
                                    SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                    btTemp[0]=FrontCard[0]=btCardData1[tagCardType1.cbOnePare[0]];
                                    btTemp[1]=FrontCard[1]=btCardData1[tagCardType1.cbOnePare[1]];
                                    btTemp[2]=MidCard[0]=btCardData1[tagCardType1.cbOnePare[2]];
                                    btTemp[3]=MidCard[1]=btCardData1[tagCardType1.cbOnePare[3]];
                                    btTemp[4]=MidCard[2]=btCardData1[tagCardType1.cbOnePare[4]];
                                    btTemp[5]=MidCard[3]=btCardData1[tagCardType1.cbOnePare[5]];
                                    this.RemoveCard(btTemp,6,btCardData1,btCardCount1);
                                    FrontCard[2]=btCardData1[0];
                                    MidCard[4]=btCardData1[1];
                                    BackCard[4]=btCardData1[2];
                                    if(bFirst)
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            btFrontAllShuiShu=this.ThreeDunAllShuiShu(FrontFrontCard,FrontMidCard,FrontBackCard);
                                            bFirst=this.bfalse;
                                        }
                                    }
                                    else
                                    {
                                        btAllShuiShu=this.ThreeDunAllShuiShu(FrontCard,MidCard,BackCard);
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                            this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            btFrontAllShuiShu=btAllShuiShu;
                                        }
                                    }
                                }
                                else
                                {
                                    for(let j=0;j<tagCardType1.btTwoPare;j++)
                                    {
                                        btCardCount1=btCardCount;
                                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                        for(let k=0;k<4;k++)
                                        {
                                            MidCard[k]=btCardData1[tagCardType1.cbTwoPare[j*4+k]];
                                        }
                                        this.RemoveCard(MidCard,4,btCardData1,btCardCount1);
                                        btCardCount2=btCardCount1-=4;
                                        SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                        tagCardType2=this.GetType(btCardData2,btCardCount2);
                                        if(tagCardType2.bTwoPare)  //两对
                                        {
                                            for(let k=0;k<4;k++)
                                            {
                                                if(k<3)
                                                {
                                                    btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbTwoPare[k]];
                                                }
                                                else
                                                {
                                                    btTemp[k]=MidCard[k+1]=btCardData2[tagCardType2.cbTwoPare[k]];
                                                }
                                            }
                                            this.RemoveCard(btTemp,4,btCardData2,btCardCount2);
                                            BackCard[4]=btCardData2[0];
                                        }
                                        else if(tagCardType2.bOnePare)  //一对
                                        {
                                            for(let k=0;k<2;k++)
                                            {
                                                btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                            }
                                            this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                            FrontCard[2]=btCardData2[0];
                                            MidCard[4]=btCardData2[1];
                                            BackCard[4]=btCardData2[2];
                                        }
                                        else                            //散牌
                                        {
                                            FrontCard[0]=btCardData2[0];
                                            FrontCard[1]=btCardData2[1];
                                            FrontCard[2]=btCardData2[2];
                                            MidCard[4]=btCardData2[3];
                                            BackCard[4]=btCardData2[4];
                                        }
                                        if(bFirst)
                                        {
                                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                            {
                                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                                bFirst=this.bfalse;
                                            }
                                        }
                                        else
                                        {
                                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                                this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                            {
                                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            }
                                        }
                                    }
                                }

                            }
                            else if(tagCardType1.bOnePare)      //剩下一对
                            {
                                for(let j=0;j<tagCardType1.btOnePare;j++)
                                {
                                    btCardCount1=btCardCount;
                                    SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                    for(let k=0;k<2;k++)
                                    {
                                        MidCard[k]=btCardData1[tagCardType1.cbOnePare[j*2+k]];
                                    }
                                    this.RemoveCard(MidCard,2,btCardData1,btCardCount1);
                                    btCardCount2=btCardCount1-=2;
                                    SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                    tagCardType2=this.GetType(btCardData2,btCardCount2);
                                    if(tagCardType2.bOnePare)  //一对
                                    {
                                        for(let k=0;k<2;k++)
                                        {
                                            btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                        }
                                        this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                        FrontCard[2]=btCardData2[0];
                                        MidCard[2]=btCardData2[1];
                                        MidCard[3]=btCardData2[2];
                                        MidCard[4]=btCardData2[3];
                                        BackCard[4]=btCardData2[4];
                                    }
                                    else                            //散牌
                                    {
                                        FrontCard[0]=btCardData2[0];
                                        FrontCard[1]=btCardData2[1];
                                        FrontCard[2]=btCardData2[2];
                                        MidCard[2]=btCardData2[3];
                                        MidCard[3]=btCardData2[4];
                                        MidCard[4]=btCardData2[5];
                                        BackCard[4]=btCardData2[6];
                                    }
                                    if(bFirst)
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                            bFirst=this.bfalse;
                                        }
                                    }
                                    else
                                    {
                                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                            this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                        {
                                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        }
                                    }
                                }
                            }
                            //散牌
                            btCardCount1=btCardCount;
                            SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                            MidCard[0]=btCardData1[0];
                            MidCard[1]=btCardData1[4];
                            MidCard[2]=btCardData1[5];
                            MidCard[3]=btCardData1[6];
                            MidCard[4]=btCardData1[7];
                            BackCard[4]=btCardData1[8];
                            FrontCard[0]=btCardData1[1];
                            FrontCard[1]=btCardData1[2];
                            FrontCard[2]=btCardData1[3];
                            if(bFirst)
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    bFirst=this.bfalse;
                                }
                            }
                            else
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                    this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                }
                            }
                        }
                    }
                    else
                    {
                        if(tagCardType.btOnePare==4)
                        {
                            SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                            btCardCount=btHandCardCount;
                            btTemp[0]=BackCard[0]=btCardData[tagCardType.cbOnePare[0]];
                            btTemp[1]=BackCard[1]=btCardData[tagCardType.cbOnePare[1]];
                            btTemp[2]=BackCard[2]=btCardData[tagCardType.cbOnePare[6]];
                            btTemp[3]=BackCard[3]=btCardData[tagCardType.cbOnePare[7]];
                            btTemp[4]=MidCard[0]=btCardData[tagCardType.cbOnePare[2]];
                            btTemp[5]=MidCard[1]=btCardData[tagCardType.cbOnePare[3]];
                            btTemp[6]=MidCard[2]=btCardData[tagCardType.cbOnePare[4]];
                            btTemp[7]=MidCard[3]=btCardData[tagCardType.cbOnePare[5]];
                            this.RemoveCard(btTemp,8,btCardData,btCardCount);
                            FrontCard[0]=btCardData[0];
                            FrontCard[1]=btCardData[1];
                            FrontCard[2]=btCardData[2];
                            MidCard[4]=btCardData[3];
                            BackCard[4]=btCardData[4];
                            if(this.GetCardLogicValue(FrontCard[0])==14&&this.GetCardLogicValue(FrontCard[1])==13)
                            {
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                            else
                            {
                                SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                                btCardCount=btHandCardCount;
                                btTemp[0]=BackCard[0]=btCardData[tagCardType.cbOnePare[4]];
                                btTemp[1]=BackCard[1]=btCardData[tagCardType.cbOnePare[5]];
                                btTemp[2]=BackCard[2]=btCardData[tagCardType.cbOnePare[6]];
                                btTemp[3]=BackCard[3]=btCardData[tagCardType.cbOnePare[7]];
                                btTemp[4]=MidCard[0]=btCardData[tagCardType.cbOnePare[0]];
                                btTemp[5]=MidCard[1]=btCardData[tagCardType.cbOnePare[1]];
                                btTemp[6]=FrontCard[0]=btCardData[tagCardType.cbOnePare[2]];
                                btTemp[7]=FrontCard[1]=btCardData[tagCardType.cbOnePare[3]];
                                this.RemoveCard(btTemp,8,btCardData,btCardCount);
                                FrontCard[2]=btCardData[0];
                                MidCard[2]=btCardData[1];
                                MidCard[3]=btCardData[2];
                                MidCard[4]=btCardData[3];
                                BackCard[4]=btCardData[4];
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        else if(tagCardType.btOnePare==5)
                        {
                            SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                            btCardCount=btHandCardCount;
                            btTemp[0]=FrontCard[0]=btCardData[tagCardType.cbOnePare[0]];
                            btTemp[1]=FrontCard[1]=btCardData[tagCardType.cbOnePare[1]];
                            btTemp[2]=MidCard[0]=btCardData[tagCardType.cbOnePare[4]];
                            btTemp[3]=MidCard[1]=btCardData[tagCardType.cbOnePare[5]];
                            btTemp[4]=MidCard[2]=btCardData[tagCardType.cbOnePare[6]];
                            btTemp[5]=MidCard[3]=btCardData[tagCardType.cbOnePare[7]];
                            btTemp[6]=BackCard[0]=btCardData[tagCardType.cbOnePare[2]];
                            btTemp[7]=BackCard[1]=btCardData[tagCardType.cbOnePare[3]];
                            btTemp[8]=BackCard[2]=btCardData[tagCardType.cbOnePare[8]];
                            btTemp[9]=BackCard[3]=btCardData[tagCardType.cbOnePare[9]];
                            this.RemoveCard(btTemp,10,btCardData,btCardCount);
                            FrontCard[2]=btCardData[0];
                            MidCard[4]=btCardData[1];
                            BackCard[4]=btCardData[2];
                            if(bFirst)
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    bFirst=this.bfalse;
                                }
                            }
                            else
                            {
                                if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                    this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                {
                                    SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                    SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                    SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                }
                            }
                        }
                    }
                }
                if(tagCardType.bOnePare)      //第三敦为一对
                {
                    for(let i=0;i<tagCardType.btOnePare;i++)
                    {
                        SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                        btCardCount=btHandCardCount;
                        for(let j=0;j<2;j++)
                        {
                            BackCard[j]=btCardData[tagCardType.cbOnePare[i*2+j]];
                        }
                        this.RemoveCard(BackCard,2,btCardData,btCardCount);
                        btCardCount1=btCardCount-=2;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        tagCardType1=this.GetType(btCardData1,btCardCount1);
                        if(tagCardType1.bOnePare)      //剩下一对
                        {
                            for(let j=0;j<tagCardType1.btOnePare;j++)
                            {
                                btCardCount1=btCardCount;
                                SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                                for(let k=0;k<2;k++)
                                {
                                    MidCard[k]=btCardData1[tagCardType1.cbOnePare[j*2+k]];
                                }
                                this.RemoveCard(MidCard,2,btCardData1,btCardCount1);
                                btCardCount2=btCardCount1-=2;
                                SssLib.CopyMemory(btCardData2,btCardData1,SssLib.sizeof(btCardData1[0])*btCardCount2);
                                tagCardType2=this.GetType(btCardData2,btCardCount2);
                                if(tagCardType2.bOnePare)  //一对
                                {
                                    for(let k=0;k<2;k++)
                                    {
                                        btTemp[k]=FrontCard[k]=btCardData2[tagCardType2.cbOnePare[k]];
                                    }
                                    this.RemoveCard(btTemp,2,btCardData2,btCardCount2);
                                    FrontCard[2]=btCardData2[0];
                                    MidCard[2]=btCardData2[1];
                                    MidCard[3]=btCardData2[2];
                                    MidCard[4]=btCardData2[3];
                                    BackCard[2]=btCardData2[4];
                                    BackCard[3]=btCardData2[5];
                                    BackCard[4]=btCardData2[6];
                                }
                                else                            //散牌
                                {
                                    FrontCard[0]=btCardData2[0];
                                    FrontCard[1]=btCardData2[1];
                                    FrontCard[2]=btCardData2[2];
                                    MidCard[2]=btCardData2[3];
                                    MidCard[3]=btCardData2[4];
                                    MidCard[4]=btCardData2[5];
                                    BackCard[2]=btCardData2[6];
                                    BackCard[3]=btCardData2[7];
                                    BackCard[4]=btCardData2[8];
                                }
                                if(bFirst)
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                        bFirst=this.bfalse;
                                    }
                                }
                                else
                                {
                                    if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                        this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                                    {
                                        SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                        SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                        SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                    }
                                }
                            }
                        }
                        //散牌
                        btCardCount1=btCardCount;
                        SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
                        MidCard[0]=btCardData1[0];
                        MidCard[1]=btCardData1[4];
                        MidCard[2]=btCardData1[5];
                        MidCard[3]=btCardData1[6];
                        MidCard[4]=btCardData1[7];
                        BackCard[2]=btCardData1[8];
                        BackCard[3]=btCardData1[9];
                        BackCard[4]=btCardData1[10];
                        FrontCard[0]=btCardData1[1];
                        FrontCard[1]=btCardData1[2];
                        FrontCard[2]=btCardData1[3];
                        if(bFirst)
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                                bFirst=this.bfalse;
                            }
                        }
                        else
                        {
                            if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                                this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                            {
                                SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                                SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                                SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                            }
                        }
                    }
                }
            }
        }
        else if(tagCardType.bThreeSame)//有三条
        {
            SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
            btCardCount=btHandCardCount;
            for(let i=0;i<3;i++)
            {
                FrontBackCard[i]=btCardData[tagCardType.cbThreeSame[i]];
            }
            this.RemoveCard(BackCard,3,btCardData,btCardCount);
            btCardCount1=btCardCount-=3;
            SssLib.CopyMemory(btCardData1,btCardData,SssLib.sizeof(btCardData[0])*btCardCount1);
            FrontFrontCard[0]=btCardData1[1];
            FrontFrontCard[1]=btCardData1[2];
            FrontFrontCard[2]=btCardData1[3];
            FrontMidCard[0]=btCardData1[0];
            FrontMidCard[1]=btCardData1[4];
            FrontMidCard[2]=btCardData1[5];
            FrontMidCard[3]=btCardData1[6];
            FrontMidCard[4]=btCardData1[7];
            FrontBackCard[3]=btCardData1[8];
            FrontBackCard[4]=btCardData1[9];

        }
        else if(tagCardType.bTwoPare)//有两对
        {
            if(tagCardType.btOnePare==2)
            {
                SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                btCardCount=btHandCardCount;
                btTemp[0]=FrontBackCard[0]=btCardData[tagCardType.cbOnePare[0]];
                btTemp[1]=FrontBackCard[1]=btCardData[tagCardType.cbOnePare[1]];
                btTemp[2]=FrontMidCard[0]=btCardData[tagCardType.cbOnePare[2]];
                btTemp[3]=FrontMidCard[1]=btCardData[tagCardType.cbOnePare[3]];
                this.RemoveCard(btTemp,4,btCardData,btCardCount);
                FrontFrontCard[0]=btCardData[0];
                FrontFrontCard[1]=btCardData[1];
                FrontFrontCard[2]=btCardData[2];
                FrontMidCard[2]=btCardData[3];
                FrontMidCard[3]=btCardData[4];
                FrontMidCard[4]=btCardData[5];
                FrontBackCard[2]=btCardData[6];
                FrontBackCard[3]=btCardData[7];
                FrontBackCard[4]=btCardData[8];
            }
            else if(tagCardType.btOnePare==3)
            {
                SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                btCardCount=btHandCardCount;

                btTemp[0]=FrontBackCard[0]=btCardData[tagCardType.cbOnePare[0]];
                btTemp[1]=FrontBackCard[1]=btCardData[tagCardType.cbOnePare[1]];
                btTemp[2]=FrontMidCard[0]=btCardData[tagCardType.cbOnePare[2]];
                btTemp[3]=FrontMidCard[1]=btCardData[tagCardType.cbOnePare[3]];
                btTemp[4]=FrontFrontCard[0]=btCardData[tagCardType.cbOnePare[4]];
                btTemp[5]=FrontFrontCard[1]=btCardData[tagCardType.cbOnePare[5]];
                this.RemoveCard(btTemp,6,btCardData,btCardCount);
                FrontFrontCard[2]=btCardData[0];
                FrontMidCard[2]=btCardData[1];
                FrontMidCard[3]=btCardData[2];
                FrontMidCard[4]=btCardData[3];
                FrontBackCard[2]=btCardData[4];
                FrontBackCard[3]=btCardData[5];
                FrontBackCard[4]=btCardData[6];
            }
            else if(tagCardType.btOnePare==4)
            {
                SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                btCardCount=btHandCardCount;
                btTemp[0]=BackCard[0]=btCardData[tagCardType.cbOnePare[0]];
                btTemp[1]=BackCard[1]=btCardData[tagCardType.cbOnePare[1]];
                btTemp[2]=BackCard[2]=btCardData[tagCardType.cbOnePare[6]];
                btTemp[3]=BackCard[3]=btCardData[tagCardType.cbOnePare[7]];
                btTemp[4]=MidCard[0]=btCardData[tagCardType.cbOnePare[2]];
                btTemp[5]=MidCard[1]=btCardData[tagCardType.cbOnePare[3]];
                btTemp[6]=MidCard[2]=btCardData[tagCardType.cbOnePare[4]];
                btTemp[7]=MidCard[3]=btCardData[tagCardType.cbOnePare[5]];
                this.RemoveCard(btTemp,8,btCardData,btCardCount);
                FrontCard[0]=btCardData[0];
                FrontCard[1]=btCardData[1];
                FrontCard[2]=btCardData[2];
                MidCard[4]=btCardData[3];
                BackCard[4]=btCardData[4];
                if(this.GetCardLogicValue(FrontCard[0])==14&&this.GetCardLogicValue(FrontCard[1])==13)
                {
                    if(bFirst)
                    {
                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                        {
                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                            bFirst=this.bfalse;
                        }
                    }
                    else
                    {
                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                            this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                        {
                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                        }
                    }
                }
                else
                {
                    SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                    btCardCount=btHandCardCount;
                    btTemp[0]=BackCard[0]=btCardData[tagCardType.cbOnePare[4]];
                    btTemp[1]=BackCard[1]=btCardData[tagCardType.cbOnePare[5]];
                    btTemp[2]=BackCard[2]=btCardData[tagCardType.cbOnePare[6]];
                    btTemp[3]=BackCard[3]=btCardData[tagCardType.cbOnePare[7]];
                    btTemp[4]=MidCard[0]=btCardData[tagCardType.cbOnePare[0]];
                    btTemp[5]=MidCard[1]=btCardData[tagCardType.cbOnePare[1]];
                    btTemp[6]=FrontCard[0]=btCardData[tagCardType.cbOnePare[2]];
                    btTemp[7]=FrontCard[1]=btCardData[tagCardType.cbOnePare[3]];
                    this.RemoveCard(btTemp,8,btCardData,btCardCount);
                    FrontCard[2]=btCardData[0];
                    MidCard[2]=btCardData[1];
                    MidCard[3]=btCardData[2];
                    MidCard[4]=btCardData[3];
                    BackCard[4]=btCardData[4];
                    if(bFirst)
                    {
                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse))
                        {
                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                            bFirst=this.bfalse;
                        }
                    }
                    else
                    {
                        if(this.CompareCard(FrontCard,MidCard,3,5,this.bfalse)&&this.CompareCard(MidCard,BackCard,5,5,this.bfalse)&&
                            this.IsBiggerThanFront(FrontFrontCard,FrontMidCard,FrontBackCard,FrontCard,MidCard,BackCard))
                        {
                            SssLib.CopyMemory(FrontFrontCard,FrontCard,SssLib.sizeof(FrontCard));
                            SssLib.CopyMemory(FrontMidCard,MidCard,SssLib.sizeof(MidCard));
                            SssLib.CopyMemory(FrontBackCard,BackCard,SssLib.sizeof(BackCard));
                        }
                    }
                }
            }
            else if(tagCardType.btOnePare==5)
            {
                SssLib.CopyMemory(btCardData,btHandCardData,SssLib.sizeof(btCardData));
                btCardCount=btHandCardCount;
                btTemp[0]=FrontFrontCard[0]=btCardData[tagCardType.cbOnePare[0]];
                btTemp[1]=FrontFrontCard[1]=btCardData[tagCardType.cbOnePare[1]];
                btTemp[2]=FrontMidCard[0]=btCardData[tagCardType.cbOnePare[4]];
                btTemp[3]=FrontMidCard[1]=btCardData[tagCardType.cbOnePare[5]];
                btTemp[4]=FrontMidCard[2]=btCardData[tagCardType.cbOnePare[6]];
                btTemp[5]=FrontMidCard[3]=btCardData[tagCardType.cbOnePare[7]];
                btTemp[6]=FrontBackCard[0]=btCardData[tagCardType.cbOnePare[2]];
                btTemp[7]=FrontBackCard[1]=btCardData[tagCardType.cbOnePare[3]];
                btTemp[8]=FrontBackCard[2]=btCardData[tagCardType.cbOnePare[8]];
                btTemp[9]=FrontBackCard[3]=btCardData[tagCardType.cbOnePare[9]];
                this.RemoveCard(btTemp,10,btCardData,btCardCount);
                FrontFrontCard[2]=btCardData[0];
                FrontMidCard[4]=btCardData[1];
                FrontBackCard[4]=btCardData[2];
            }
        }
        this.SortCardList(FrontFrontCard,3,this.enDescend);
        this.SortCardList(FrontMidCard,5,this.enDescend);
        this.SortCardList(FrontBackCard,5,this.enDescend);
        SssLib.CopyMemory(btFrontCard,FrontFrontCard,SssLib.sizeof(FrontFrontCard));
        SssLib.CopyMemory(btMidCard,FrontMidCard,SssLib.sizeof(FrontMidCard));
        SssLib.CopyMemory(btBackCard,FrontBackCard,SssLib.sizeof(FrontBackCard));
    }

    ThreeDunAllShuiShu(  btFrontCard, btMidCard, btBackCard )
    {
        let AllShuiShu=0;
        let tagCardType1=new tagAnalyseType();
        let tagCardType2=new tagAnalyseType();
        let tagCardType3=new tagAnalyseType();
        SssLib.ZeroMemory(tagCardType1,SssLib.sizeof(tagCardType1));
        SssLib.ZeroMemory(tagCardType2,SssLib.sizeof(tagCardType2));
        SssLib.ZeroMemory(tagCardType3,SssLib.sizeof(tagCardType3));
        tagCardType1=this.GetType(btFrontCard,3);
        tagCardType2=this.GetType(btMidCard,5);
        tagCardType3=this.GetType(btBackCard,5);
        if(tagCardType1.bThreeSame)
        {
            AllShuiShu+=3;
        }
        else
        {
            AllShuiShu+=1;
        }

        if(tagCardType2.btFiveSame)
        {
            AllShuiShu+=20;
        }
        else if(tagCardType2.bStraightFlush)
        {
            AllShuiShu+=10;
        }
        else if(tagCardType2.bFourSame)
        {
            AllShuiShu+=8;
        }
        else if(tagCardType2.bGourd)
        {
            AllShuiShu+=2;
        }
        else
        {
            AllShuiShu+=1;
        }

        if (tagCardType3.btFiveSame)
        {
            AllShuiShu+=10;
        }
        if(tagCardType3.bStraightFlush)
        {
            AllShuiShu+=5;
        }
        else if(tagCardType3.bFourSame)
        {
            AllShuiShu+=4;
        }
        else
        {
            AllShuiShu+=1;
        }
        return AllShuiShu;
    }

    IsBiggerThanFront(  btFrontFrontCard, btFrontMidCard, btFrontBackCard, btFrontCard, btMidCard, btBackCard)
    {
        let btFrontShuiShu=this.ThreeDunAllShuiShu(btFrontFrontCard,btFrontMidCard,btFrontBackCard);
        let btShuiShu=this.ThreeDunAllShuiShu(btFrontCard,btMidCard,btBackCard);
        let tagFrontFrontCardType=new tagAnalyseType();
        let tagFrontMidCardType=new tagAnalyseType();
        let tagFrontBackCardType=new tagAnalyseType();
        let tagFrontCardType=new tagAnalyseType();
        let tagMidCardType=new tagAnalyseType();
        let tagBackCardType=new tagAnalyseType();
        SssLib.ZeroMemory(tagFrontFrontCardType,SssLib.sizeof(tagFrontFrontCardType));
        SssLib.ZeroMemory(tagFrontMidCardType,SssLib.sizeof(tagFrontMidCardType));
        SssLib.ZeroMemory(tagFrontBackCardType,SssLib.sizeof(tagFrontBackCardType));
        SssLib.ZeroMemory(tagFrontCardType,SssLib.sizeof(tagFrontCardType));
        SssLib.ZeroMemory(tagMidCardType,SssLib.sizeof(tagMidCardType));
        SssLib.ZeroMemory(tagBackCardType,SssLib.sizeof(tagBackCardType));
        tagFrontFrontCardType=this.GetType(btFrontFrontCard,3);
        tagFrontMidCardType=this.GetType(btFrontMidCard,5);
        tagFrontBackCardType=this.GetType(btFrontBackCard,5);
        tagFrontCardType=this.GetType(btFrontCard,3);
        tagMidCardType=this.GetType(btMidCard,5);
        tagBackCardType=this.GetType(btBackCard,5);
        let btFrontWin=0;
        let btWin=0;
        let btCompare=0;

        let btFrontCanWin=0;
        let btCanWin=0;
        if(this.IsSameCardData(btFrontFrontCard,btFrontCard,3,3)==this.bfalse)
        {
            if(!(tagFrontFrontCardType.bThreeSame&&tagFrontCardType.bThreeSame))
            {
                if(this.CompareCard(btFrontFrontCard,btFrontCard,3,3,this.btrue))
                {

                    btCompare++;
                }
                else
                {
                    btCompare--;
                }
            }
        }

        if(this.IsSameCardData(btFrontMidCard,btMidCard,5,5)==this.bfalse)
        {
            if(!(tagFrontMidCardType.bThreeSame&&tagMidCardType.bThreeSame))
            {
                if(this.CompareCard(btFrontMidCard,btMidCard,5,5,this.btrue))
                {
                    btCompare++;
                }
                else
                {
                    btCompare--;
                }
            }
            else
            {
                let btSpecialCard=SssLib.oneDArr(13);
                SssLib.ZeroMemory(btSpecialCard,SssLib.sizeof(btSpecialCard));
                if(this.GetCardType(btMidCard,5,btSpecialCard)>this.GetCardType(btFrontMidCard,5,btSpecialCard))
                {
                    btCompare++;
                }
                else if(this.GetCardType(btMidCard,5,btSpecialCard)<this.GetCardType(btFrontMidCard,5,btSpecialCard))
                {
                    btCompare--;
                }
            }
        }

        if(this.IsSameCardData(btFrontBackCard,btBackCard,5,5)==this.bfalse)
        {
            if(!(tagFrontBackCardType.bThreeSame&&tagBackCardType.bThreeSame))
            {
                if(this.CompareCard(btFrontBackCard,btBackCard,5,5,this.btrue))
                {
                    btCompare++;
                }
                else
                {
                    btCompare--;
                }
            }
            else
            {
                let btSpecialCard=SssLib.oneDArr(13);
                SssLib.ZeroMemory(btSpecialCard,SssLib.sizeof(btSpecialCard));
                if(this.GetCardType(btBackCard,5,btSpecialCard)>this.GetCardType(btFrontBackCard,5,btSpecialCard))
                {
                    btCompare++;
                }
                else if(this.GetCardType(btBackCard,5,btSpecialCard)<this.GetCardType(btFrontBackCard,5,btSpecialCard))
                {
                    btCompare--;
                }
            }
        }
        //前面的牌
        if(tagFrontFrontCardType.bThreeSame)
        {
            btFrontWin+=1;
            btFrontCanWin+=3;
        }
        else if(tagFrontFrontCardType.bOnePare)
        {
            btFrontWin+=1;
            btFrontCanWin+=1;
        }
        else
        {
            if(this.GetCardLogicValue(btFrontFrontCard[0])==14)
            {
                btFrontWin+=0;
                btFrontCanWin+=0;
            }
            else
            {
                btFrontWin+=-1;
                btFrontCanWin+=-1;
            }

        }
        //第二敦
        if(tagFrontMidCardType.bFiveSame)
        {
            btFrontWin+=1;
            btFrontCanWin+=20;
        }
        if(tagFrontMidCardType.bStraightFlush)
        {
            btFrontWin+=1;
            btFrontCanWin+=10;
        }
        else if(tagFrontMidCardType.bFourSame)
        {
            btFrontWin+=1;
            btFrontCanWin+=8;
        }
        else if(tagFrontMidCardType.bGourd)
        {
            btFrontWin+=1;
            btFrontCanWin+=5;
        }
        else if(tagFrontMidCardType.bFlush)
        {
            btFrontWin+=1;
            btFrontCanWin+=4;
        }
        else if(tagFrontMidCardType.bStraight)
        {
            btFrontWin+=1;
            btFrontCanWin+=3;
        }
        else if(tagFrontMidCardType.bThreeSame)
        {
            btFrontWin+=1;
            btFrontCanWin+=2;
        }
        else if(tagFrontMidCardType.bTwoPare)
        {
            if(this.GetCardLogicValue(btFrontMidCard[tagFrontMidCardType.cbTwoPare[0]])<6)
            {
                btFrontWin+=0;
                btFrontCanWin+=0;
            }
            else
            {
                btFrontWin+=1;
                btFrontCanWin+=1;
            }
        }
        else if(tagFrontMidCardType.bOnePare)
        {
            if(this.GetCardLogicValue(btFrontMidCard[tagFrontMidCardType.cbOnePare[0]])<12)
            {
                btFrontWin+=-1;
                btFrontCanWin+=-1;
            }
            else
            {
                btFrontWin+=0;
                btFrontCanWin+=0;
            }
        }
        else
        {
            btFrontWin+=-1;
            btFrontCanWin+=-2;
        }

        //第三敦
        if (tagFrontBackCardType.bFiveSame)
        {
            btFrontWin+=1;
            btFrontCanWin+=10;
        }
        if(tagFrontBackCardType.bStraightFlush)
        {
            btFrontWin+=1;
            btFrontCanWin+=5;
        }
        else if(tagFrontBackCardType.bFourSame)
        {
            btFrontWin+=1;
            btFrontCanWin+=4;
        }
        else if(tagFrontBackCardType.bGourd)
        {
            btFrontWin+=1;
            btFrontCanWin+=3;
        }
        else if(tagFrontBackCardType.bFlush)
        {
            if(this.GetCardLogicValue(btFrontBackCard[tagFrontBackCardType.cbFlush[0]])<11)
            {
                btFrontWin+=0;
                btFrontCanWin+=1;
            }
            else
            {
                btFrontWin+=1;
                btFrontCanWin+=2;
            }
        }
        else if(tagFrontBackCardType.bStraight)
        {
            if(this.GetCardLogicValue(btFrontBackCard[tagFrontBackCardType.cbStraight[0]])<11)
            {
                btFrontWin+=-1;
                btFrontCanWin+=-1;
            }
            else
            {
                btFrontWin+=0;
                btFrontCanWin+=0;
            }
        }
        else
        {
            if(tagFrontBackCardType.bThreeSame)
            {
                btFrontCanWin+=-2;
            }
            else if(tagFrontBackCardType.bTwoPare)
            {
                btFrontCanWin+=-3;
            }
            else if(tagFrontBackCardType.bOnePare)
            {
                btFrontCanWin+=-4;
            }
            else
            {
                btFrontCanWin+=-5;
            }
            btFrontWin+=-1;
        }
        //现在的牌
        if(tagFrontCardType.bThreeSame)
        {
            btWin+=1;
            btCanWin+=3;
        }
        else if(tagFrontCardType.bOnePare)
        {
            btWin+=1;
            btCanWin+=1;
        }
        else
        {
            if(this.GetCardLogicValue(btFrontCard[0])==14)
            {
                btWin+=0;
                btCanWin+=0;
            }
            else
            {
                btWin+=-1;
                btCanWin+=-1;
            }
        }
        //第二敦
        if(tagMidCardType.bFiveSame)
        {
            btWin+=1;
            btCanWin+=20;
        }
        if(tagMidCardType.bStraightFlush)
        {
            btWin+=1;
            btCanWin+=10;
        }
        else if(tagMidCardType.bFourSame)
        {
            btWin+=1;
            btCanWin+=8;
        }
        else if(tagMidCardType.bGourd)
        {
            btWin+=1;
            btCanWin+=5;
        }
        else if(tagMidCardType.bFlush)
        {
            btWin+=1;
            btCanWin+=4;
        }
        else if(tagMidCardType.bStraight)
        {
            btWin+=1;
            btCanWin+=3;
        }
        else if(tagMidCardType.bThreeSame)
        {
            btWin+=1;
            btCanWin+=2;
        }
        else if(tagMidCardType.bTwoPare)
        {
            if(this.GetCardLogicValue(btMidCard[tagMidCardType.cbTwoPare[0]])<6)
            {
                btWin+=0;
                btCanWin+=0;
            }
            else
            {
                btWin+=1;
                btCanWin+=1;
            }
        }
        else if(tagMidCardType.bOnePare)
        {
            if(this.GetCardLogicValue(btMidCard[tagMidCardType.cbOnePare[0]])<12)
            {
                btWin+=-1;
                btCanWin+=-1;
            }
            else
            {
                btWin+=0;
                btCanWin+=0;
            }
        }
        else
        {
            btWin+=-1;
            btCanWin+=-2;
        }
        //第三敦
        if(tagBackCardType.bFiveSame)
        {
            btWin+=1;
            btCanWin+=10;
        }
        if(tagBackCardType.bStraightFlush)
        {
            btWin+=1;
            btCanWin+=5;
        }
        else if(tagBackCardType.bFourSame)
        {
            btWin+=1;
            btCanWin+=4;
        }
        else if(tagBackCardType.bGourd)
        {
            btWin+=1;
            btCanWin+=3;
        }
        else if(tagBackCardType.bFlush)
        {
            if(this.GetCardLogicValue(btBackCard[tagBackCardType.cbFlush[0]])<11)
            {
                btWin+=0;
                btCanWin+=1;
            }
            else
            {
                btWin+=1;
                btCanWin+=2;
            }
        }
        else if(tagBackCardType.bStraight)
        {
            if(this.GetCardLogicValue(btBackCard[tagBackCardType.cbStraight[0]])<11)
            {
                btWin+=-1;
                btCanWin+=-1;
            }
            else
            {
                btWin+=0;
                btCanWin+=0;
            }
        }
        else
        {
            if(tagBackCardType.bThreeSame)
            {
                btCanWin+=-2;
            }
            else if(tagBackCardType.bTwoPare)
            {
                btCanWin+=-3;
            }
            else if(tagBackCardType.bOnePare)
            {
                btCanWin+=-4;
            }
            else
            {
                btCanWin+=-5;
            }
            btWin+=-1;
        }

        if(btShuiShu==btFrontShuiShu)
        {
            if(btWin>btFrontWin)
            {
                return this.btrue;
            }
            else if(btWin==btFrontWin)
            {
                if(btCompare>=1)
                {
                    return this.btrue;
                }
                else
                {
                    if(btCanWin>btFrontCanWin)
                    {
                        return this.btrue;
                    }
                    else
                    {
                        return this.bfalse;
                    }
                }
            }
            else
            {
                return this.bfalse;
            }
        }
        else if(btShuiShu==btFrontShuiShu+1)
        {
            if(btFrontWin-btWin>=4)
            {
                return this.bfalse;
            }
            else
            {
                return this.btrue;
            }
        }
        else if(btShuiShu+1==btFrontShuiShu)
        {
            if(btWin-btFrontWin>=4)
            {
                return this.btrue;
            }
            else
            {
                return this.bfalse;
            }
        }
        else if(btShuiShu>btFrontShuiShu)
        {
            return this.btrue;
        }
        else if(btShuiShu<btFrontShuiShu)
        {
            return this.bfalse;
        }
        return this.bfalse;
    }

    IsSameCardData(   btFirstCard ,  btNextCard ,  btFirstCount,  btNextCount)
    {
        if(btNextCount!=btFirstCount)
        {
            return this.bfalse;
        }
        for(let i=0;i<btFirstCount;i++)
        {
            if(btFirstCard[i]!=btNextCard[i])
            {
                return this.bfalse;
            }
        }
        return this.btrue;
    }

    //自动摆牌
    AutoPutCard(  btHandCardData ,  btHandCardCount,  btFrontCard ,  btMidCard ,  btBackCard )
    {
        //定义变量
        let bCardList=SssLib.oneDArr(13);
        SssLib.memcpy(bCardList, btHandCardData, sizeof_BYTE*13);
        let bLeftCCount = 13;
        let bTempCard=SssLib.twoDArr(3,5);
        let bTempCCount=SssLib.oneDArr(3);
        let bSigCCount = 0;		//用于散牌填充时的计数
        let bCardType=SssLib.oneDArr(3);


        //摆牌开始
        for (let i = 0; i < 3; i++)
        {
            //这边有传引用，可以给个临时值解决
            let yinyongObj={value:0}
            bCardType[i] = this.GetMaxCardData(bCardList, bLeftCCount, bTempCard[i], yinyongObj, (i==2?3:5));
            //注意了
            bTempCCount[i]=yinyongObj.value;
            this.RemoveCard(bTempCard[i], bTempCCount[i], bCardList, bLeftCCount);
            bLeftCCount -= bTempCCount[i];
        }

        SssLib.ASSERT(bLeftCCount+bTempCCount[0]+bTempCCount[1]+bTempCCount[2] == 13);
        SssLib.ASSERT(bTempCCount[0]<=5&&bTempCCount[1]<=5&&bTempCCount[2]<=3);

        if (bLeftCCount == 0)
            return;

        this.SortCardList(bCardList, bLeftCCount, this.enDescend);

        //散牌填充
        while (bTempCCount[2] < 3)
        {
            bTempCard[2][bTempCCount[2]++] = bCardList[bSigCCount++];
        }
        while (bTempCCount[0] < 5)
        {
            bTempCard[0][bTempCCount[0]++] = bCardList[bSigCCount++];
        }
        while (bTempCCount[1] < 5)
        {
            bTempCard[1][bTempCCount[1]++] = bCardList[bSigCCount++];
        }
        SssLib.ASSERT(bSigCCount == bLeftCCount);

        //牌组填充
        SssLib.memcpy(btFrontCard, bTempCard[2], sizeof_BYTE*3);
        SssLib.memcpy(btMidCard, bTempCard[1], sizeof_BYTE*5);
        SssLib.memcpy(btBackCard, bTempCard[0], sizeof_BYTE*5);

        //if( bCardType[2] != this.GetCardType(bTempCard[2], 3) ||
        //	bCardType[0] != this.GetCardType(bTempCard[0], 5) ||
        //	bCardType[1] != this.GetCardType(bTempCard[1], 5))
        //	MyMsgBox(_T("前[%d %d (%x %x %x)]  中[%d %d (%x %x %x %x %x)]  后[%d %d (%x %x %x %x %x)]"),
        //		bCardType[2], this.GetCardType(bTempCard[2], 3), bTempCard[2][0], bTempCard[2][1], bTempCard[2][2],
        //		bCardType[1], this.GetCardType(bTempCard[1], 5), bTempCard[1][0], bTempCard[1][1], bTempCard[1][2], bTempCard[1][3], bTempCard[1][4],
        //		bCardType[0], this.GetCardType(bTempCard[0], 5), bTempCard[0][0], bTempCard[0][1], bTempCard[0][2], bTempCard[0][3], bTempCard[0][4]);

        return;
    }

    /****************************************************
     *函数名：GetMaxCardData
     *功能：  从得定牌组中抽取出最大牌型的牌	JJ
     *参数：	 cbCardData				原牌(3< <=13)		IN
     cbCardCount			原牌数目			IN
     cbMaxCardData			取出的最大牌(<=5)	OUT
     bMaxCardCount			取出牌数目(1<= <=5) OUT
     *返回值：最大类型 (用于单元测试做校验,实际无用,不能做为可靠数据)
     ****************************************************/
    GetMaxCardData(cbCardData, cbCardCount,  bMaxCardData,bMaxCardCount,  bNeedCCount)
    {
        //校验数据
        SssLib.ASSERT(cbCardCount <= 13 || cbCardCount > 3);

        //定义变量
        let bKCount = 0;
        let evCardList=SssLib.CListByteArr(15);	//0位存王牌,1位保留,其他位按逻辑值存放
        let evColorList=SssLib.CListByteArr(4);	//方梅红黑
        let bCardArray=SssLib.oneDArr(13);
        SssLib.memcpy(bCardArray, cbCardData, sizeof_BYTE*cbCardCount);

        this.SortCardList(bCardArray, cbCardCount, this.enDescend);

        //分析扑克
        for (let i = 0; i < cbCardCount; i++)
        {
            //保存王牌
            if (bCardArray[i] == 0x4e || bCardArray[i] == 0x4f)
            {
                evCardList[0].AddTail(bCardArray[i]);
                continue;
            }

            //保存其他
            let bLogicNum = this.GetCardLogicValue(bCardArray[i]);
            let bColor = this.GetCardColor(bCardArray[i]);

            SssLib.ASSERT(bLogicNum>1 && bLogicNum<15 && bColor>=0 && bColor<=3);
            SssLib.ASSERT(evCardList[bLogicNum].Find(bCardArray[i]) == NULL);

            evCardList[bLogicNum].AddTail(bCardArray[i]);
            evColorList[bColor].AddTail(bCardArray[i]);
        }

        SssLib.ASSERT(evCardList[0].GetCount() <= 2);

        //寻找同顺
        if (bNeedCCount == 5)
        {
            for (let i = 0; i < 4; i++)
            {
                if (evColorList[i].GetCount()+evCardList[0].GetCount() >= 5)	//同花+王牌数大于等于5
                {
                    let bCount=0;
                    if (evCardList[0].GetCount() >= 0 && evColorList[i].GetCount() >= 5)		//不带王
                    {

                        if (this.GetCardValue(evColorList[i].GetHead()) == 1 &&						//A在后同花顺
                            this.GetCardLogicValue(evColorList[i].GetAt(evColorList[i].FindIndex(evColorList[i].GetCount()-4))) != 5)
                        {

                            let bFstCard = evColorList[i].GetAt(evColorList[i].FindIndex(0));
                            let bLstCard = evColorList[i].GetAt(evColorList[i].FindIndex(4));

                            if (this.GetCardLogicValue(bFstCard) -  this.GetCardLogicValue(bLstCard) == 4)
                            {
                                for (let k = 0; k < 5; k++)
                                    bMaxCardData[k] = evColorList[i].GetAt(evColorList[i].FindIndex(k));
                                bMaxCardCount.value = 5;
                                return SssDef.CT_FIVE_STRAIGHT_FLUSH_BACK_A;
                            }

                        }
                        else if (this.GetCardValue(evColorList[i].GetHead()) == 1 &&						//检查A2345顺
                            this.GetCardLogicValue(evColorList[i].GetAt(evColorList[i].FindIndex(evColorList[i].GetCount()-4))) == 5)
                        {
                            bMaxCardData[0] = evColorList[i].GetHead();
                            for (let k = 1; k < 5; k++)
                                bMaxCardData[k] = evColorList[i].GetAt(evColorList[i].FindIndex(evColorList[i].GetCount()-k));
                            bMaxCardCount.value = 5;
                            return SssDef.CT_FIVE_STRAIGHT_FLUSH_FIRST_A;
                        }
                        else
                        {
                            for (let j = 0; j < evColorList[i].GetCount()-4; j++)
                            {
                                let bFstCard = evColorList[i].GetAt(evColorList[i].FindIndex(j));
                                let bLstCard = evColorList[i].GetAt(evColorList[i].FindIndex(j+4));

                                if (this.GetCardLogicValue(bFstCard) -  this.GetCardLogicValue(bLstCard) == 4)
                                {
                                    for (let k = 0; k < 5; k++)
                                        bMaxCardData[k] = evColorList[i].GetAt(evColorList[i].FindIndex(j+k));
                                    bMaxCardCount.value = 5;
                                    return SssDef.CT_FIVE_STRAIGHT_FLUSH_NO_A;
                                }
                            }
                        }

                    }
                    if (evCardList[0].GetCount() >= 1 && evColorList[i].GetCount() >= 4)		//带单王
                    {
                        if (this.GetCardLogicValue(evColorList[i].GetAt(evColorList[i].FindIndex(3))) >=10)
                        {
                            bMaxCardData[0] = evCardList[0].GetHead();
                            bMaxCardData[1] = evColorList[i].GetHead();
                            for (let k = 1; k < 4; k++)
                                bMaxCardData[k+1] = evColorList[i].GetAt(evColorList[i].FindIndex(evColorList[i].GetCount()-k));
                            bMaxCardCount.value = 5;
                            return SssDef.CT_FIVE_STRAIGHT_FLUSH_BACK_A;
                        }
                        else if (this.GetCardValue(evColorList[i].GetHead()) == 1 &&						//检查A2345顺
                            this.GetCardLogicValue(evColorList[i].GetAt(evColorList[i].FindIndex(evColorList[i].GetCount()-3))) <= 5)
                        {
                            bMaxCardData[0] = evCardList[0].GetHead();
                            bMaxCardData[1] = evColorList[i].GetHead();
                            for (let k = 1; k < 4; k++)
                                bMaxCardData[k+1] = evColorList[i].GetAt(evColorList[i].FindIndex(evColorList[i].GetCount()-k));
                            bMaxCardCount.value = 5;
                            return SssDef.CT_FIVE_STRAIGHT_FLUSH_FIRST_A;
                        }
                        else if (this.GetCardLogicValue(evColorList[i].GetAt(evColorList[i].FindIndex(evColorList[i].GetCount()-4))) <= 5)	//检查A2345顺
                        {
                            bMaxCardData[0] = evCardList[0].GetHead();
                            for (let k = 1; k < 5; k++)
                                bMaxCardData[k] = evColorList[i].GetAt(evColorList[i].FindIndex(evColorList[i].GetCount()-k));
                            bMaxCardCount.value = 5;
                            return SssDef.CT_FIVE_STRAIGHT_FLUSH_FIRST_A;
                        }
                        else
                        {
                            for (let j = 0; j < evColorList[i].GetCount()-3; j++)
                            {
                                let bFstCard = evColorList[i].GetAt(evColorList[i].FindIndex(j));
                                let bLstCard = evColorList[i].GetAt(evColorList[i].FindIndex(j+3));

                                if ( (this.GetCardLogicValue(bFstCard) -  this.GetCardLogicValue(bLstCard) == 3) ||
                                    (this.GetCardLogicValue(bFstCard) -  this.GetCardLogicValue(bLstCard) == 4) )
                                {
                                    bMaxCardData[0] = evCardList[0].GetHead();
                                    for (let k = 0; k < 4; k++)
                                        bMaxCardData[k+1] = evColorList[i].GetAt(evColorList[i].FindIndex(j+k));
                                    bMaxCardCount.value = 5;
                                    return SssDef.CT_FIVE_STRAIGHT_FLUSH_NO_A;
                                }
                            }
                        }
                    }
                    if (evCardList[0].GetCount() == 2 && evColorList[i].GetCount() >= 3)		//带双王
                    {
                        if (this.GetCardLogicValue(evColorList[i].GetAt(evColorList[i].FindIndex(2))) >=10)
                        {
                            bMaxCardData[0] = evCardList[0].GetHead();
                            bMaxCardData[1] = evCardList[0].GetTail();
                            for (let k = 1; k < 4; k++)
                                bMaxCardData[k+1] = evColorList[i].GetAt(evColorList[i].FindIndex(evColorList[i].GetCount()-k));
                            bMaxCardCount.value = 5;
                            return SssDef.CT_FIVE_STRAIGHT_FLUSH_BACK_A;
                        }
                        else if (this.GetCardValue(evColorList[i].GetHead()) == 1 &&						//检查A2345顺
                            this.GetCardLogicValue(evColorList[i].GetAt(evColorList[i].FindIndex(evColorList[i].GetCount()-2))) <= 5)
                        {
                            bMaxCardData[0] = evCardList[0].GetHead();
                            bMaxCardData[1] = evCardList[0].GetTail();
                            bMaxCardData[2] = evColorList[i].GetHead();
                            for (let k = 1; k < 3; k++)
                                bMaxCardData[k+2] = evColorList[i].GetAt(evColorList[i].FindIndex(evColorList[i].GetCount()-k));
                            bMaxCardCount.value = 5;
                            return SssDef.CT_FIVE_STRAIGHT_FLUSH_FIRST_A;
                        }
                        else if (this.GetCardLogicValue(evColorList[i].GetAt(evColorList[i].FindIndex(evColorList[i].GetCount()-3))) <= 5)	//检查A2345顺
                        {
                            bMaxCardData[0] = evCardList[0].GetHead();
                            bMaxCardData[1] = evCardList[0].GetTail();
                            for (let k = 1; k < 4; k++)
                                bMaxCardData[k+2] = evColorList[i].GetAt(evColorList[i].FindIndex(evColorList[i].GetCount()-k));
                            bMaxCardCount.value = 5;
                            return SssDef.CT_FIVE_STRAIGHT_FLUSH_FIRST_A;
                        }
                        else
                        {
                            for (let j = 0; j < evColorList[i].GetCount()-2; j++)
                            {
                                let bFstCard = evColorList[i].GetAt(evColorList[i].FindIndex(j));
                                let bLstCard = evColorList[i].GetAt(evColorList[i].FindIndex(j+2));

                                if ( (this.GetCardLogicValue(bFstCard) -  this.GetCardLogicValue(bLstCard) == 2) ||
                                    (this.GetCardLogicValue(bFstCard) -  this.GetCardLogicValue(bLstCard) == 3) ||
                                    (this.GetCardLogicValue(bFstCard) -  this.GetCardLogicValue(bLstCard) == 4))
                                {
                                    bMaxCardData[0] = evCardList[0].GetHead();
                                    bMaxCardData[1] = evCardList[0].GetTail();
                                    for (let k = 0; k < 3; k++)
                                        bMaxCardData[k+2] = evColorList[i].GetAt(evColorList[i].FindIndex(j+k));
                                    bMaxCardCount.value = 5;
                                    return SssDef.CT_FIVE_STRAIGHT_FLUSH_NO_A;
                                }
                            }
                        }
                    }
                }
            }
        }

        //寻找五相
        if (bNeedCCount == 5)
        {
            for (let i = 14; i > 1; i--)
            {
                if (evCardList[i].GetCount()== 4 && evCardList[0].GetCount() > 0)
                {
                    bMaxCardData[0] = evCardList[0].GetAt(evCardList[0].FindIndex(0));
                    for (let k = 0; k < evCardList[i].GetCount(); k++)
                        bMaxCardData[1+k] = evCardList[i].GetAt(evCardList[i].FindIndex(k));
                    bMaxCardCount.value = 5;
                    return SssDef.CT_FIVE_BOMB;
                }
            }
            for (let i = 14; i > 1; i--)
            {
                if (evCardList[i].GetCount()== 3 && evCardList[0].GetCount() == 2)
                {
                    bMaxCardData[0] = 0x4f;
                    bMaxCardData[1] = 0x4e;
                    for (let k = 0; k < evCardList[i].GetCount(); k++)
                        bMaxCardData[2+k] = evCardList[i].GetAt(evCardList[i].FindIndex(k));
                    bMaxCardCount.value = 5;
                    return SssDef.CT_FIVE_BOMB;
                }
            }
        }

        //寻找炸弹
        if (bNeedCCount == 5)
        {
            for (let i = 14; i > 1; i--)
            {
                if (evCardList[i].GetCount() + evCardList[0].GetCount() >= 4)
                {
                    SssLib.ASSERT(evCardList[i].GetCount()<=4&&evCardList[i].GetCount()>=2);
                    let j = 0;
                    for (; j < 4 - evCardList[i].GetCount(); j++)
                    {
                        bMaxCardData[j] = evCardList[0].GetAt(evCardList[0].FindIndex(j));
                    }
                    for (let k = 0; k < evCardList[i].GetCount(); k++)
                        bMaxCardData[j+k] = evCardList[i].GetAt(evCardList[i].FindIndex(k));
                    bMaxCardCount.value = 4;
                    return SssDef.CT_FIVE_FOUR_ONE;
                }
            }
        }

        //寻找葫芦
        if (bNeedCCount == 5)
        {
            for (let i = 14; i > 1; i--)
            {
                if (evCardList[i].GetCount() + evCardList[0].GetCount() == 3)
                {
                    SssLib.ASSERT(evCardList[i].GetCount()<=3&&evCardList[i].GetCount()>=1);
                    //寻找一对
                    let bDoubleLogicCard = 0;
                    for (let k = 2; k < 15; k++)
                    {
                        if (k == i) continue;
                        if (evCardList[k].GetCount() >= 2)
                        {
                            bDoubleLogicCard = k;
                            break;
                        }
                    }
                    if (bDoubleLogicCard == 0)	break;

                    let j = 0;
                    for (; j < 3 - evCardList[i].GetCount(); j++)
                    {
                        bMaxCardData[j] = evCardList[0].GetAt(evCardList[0].FindIndex(j));
                    }
                    for (let k = 0; k < evCardList[i].GetCount(); k++)
                        bMaxCardData[j+k] = evCardList[i].GetAt(evCardList[i].FindIndex(k));
                    bMaxCardData[3] = evCardList[bDoubleLogicCard].GetAt(evCardList[bDoubleLogicCard].FindIndex(0));
                    bMaxCardData[4] = evCardList[bDoubleLogicCard].GetAt(evCardList[bDoubleLogicCard].FindIndex(1));
                    bMaxCardCount.value = 5;
                    return SssDef.CT_FIVE_THREE_DEOUBLE;
                }
            }
        }

        //寻找同花
        if (bNeedCCount == 5)
        {
            let bPossibleCard=SssLib.twoDArr(4,5);	//各个能组成同花的牌组
            let maxCardColorList=new SssLib.CList_BYTE();
            for (let i = 0; i < 4; i++)
            {
                if (evColorList[i].GetCount() + evCardList[0].GetCount() >= 5)
                {
                    if (evColorList[i].GetCount() >= 5)
                    {
                        for (let k = 0; k < 5; k++)
                            bPossibleCard[i][k] = evColorList[i].GetAt(evColorList[i].FindIndex(k));
                    }
                    else
                    {
                        let j = 0;
                        for (; j < 5 - evColorList[i].GetCount(); j++)
                        {
                            bPossibleCard[i][j] = evCardList[0].GetAt(evCardList[0].FindIndex(j));
                        }
                        for (let k = 0; k < evColorList[i].GetCount(); k++)
                            bPossibleCard[i][j+k] = evColorList[i].GetAt(evColorList[i].FindIndex(k));
                    }
                    maxCardColorList.AddTail(i);
                }
            }
            if (maxCardColorList.GetCount() != 0)
            {
                let bMax = maxCardColorList.GetAt(maxCardColorList.FindIndex(0));
                for (let i = 1; i < maxCardColorList.GetCount(); i++)
                {
                    let bColor = maxCardColorList.GetAt(maxCardColorList.FindIndex(i));
                    if (this.CompareCard(bPossibleCard[bMax], bPossibleCard[bColor], 5, 5, this.btrue))
                        bMax = bColor;
                }
                SssLib.memcpy(bMaxCardData, bPossibleCard[bMax], sizeof_BYTE*5);
                bMaxCardCount.value = 5;
                return SssDef.CT_FIVE_FLUSH;
            }
        }

        //寻找顺子
        if (bNeedCCount == 5)
        {
            for (let i = 14; i > 4; i--)
            {
                let bHaveCard=SssLib.oneDArr(5);
                for (let k = 0; k < 4; k++)
                    bHaveCard[k] = (evCardList[i-k].GetCount()>0);
                bHaveCard[4] = ( ((i == 5)?evCardList[14].GetCount():evCardList[i-4].GetCount()) > 0 );
                let bCount = (bHaveCard[0]?1:0) + (bHaveCard[1]?1:0) + (bHaveCard[2]?1:0) + (bHaveCard[3]?1:0) + (bHaveCard[4]?1:0);
                if (bCount + evCardList[0].GetCount() >= 5)
                {
                    SssLib.ASSERT(bCount>=3&&bCount<=5);
                    let j = 0;
                    for (; j < 5 - bCount; j++)
                    {
                        bMaxCardData[j] = evCardList[0].GetAt(evCardList[0].FindIndex(j));
                    }
                    for (let k = 0; k < 4; k++)
                    {
                        if (bHaveCard[k])
                            bMaxCardData[j++] = evCardList[i-k].GetHead();
                    }

                    let bFirstCardNum = ( (i == 5)?14:i-4 );
                    if (bHaveCard[4])
                        bMaxCardData[4] = evCardList[bFirstCardNum].GetHead();

                    bMaxCardCount.value = 5;

                    return ((i==14)?SssDef.CT_FIVE_MIXED_FLUSH_BACK_A:( (i == 5)?SssDef.CT_FIVE_MIXED_FLUSH_FIRST_A:SssDef.CT_FIVE_MIXED_FLUSH_NO_A ));
                }
            }
        }

        //寻找三条
        for (let i = 14; i > 1; i--)
        {
            if (evCardList[i].GetCount() + evCardList[0].GetCount() == 3)
            {
                SssLib.ASSERT(evCardList[i].GetCount()<=3&&evCardList[i].GetCount()>=1);

                let j = 0;
                for (; j < 3 - evCardList[i].GetCount(); j++)
                {
                    bMaxCardData[j] = evCardList[0].GetAt(evCardList[0].FindIndex(j));
                }
                for (let k = 0; k < evCardList[i].GetCount(); k++)
                    bMaxCardData[j+k] = evCardList[i].GetAt(evCardList[i].FindIndex(k));
                bMaxCardCount.value = 3;
                return SssDef.CT_THREE;
            }
        }

        //寻找两对
        if (bNeedCCount == 5)
        {
            for (let i = 14; i > 1; i--)
            {
                if (evCardList[i].GetCount() + evCardList[0].GetCount() == 2)
                {
                    SssLib.ASSERT(evCardList[i].GetCount()<=2&&evCardList[i].GetCount()>=0);

                    //寻找一对
                    let bDoubleLogicCard = 0;
                    for (let k = 2; k < 15; k++)
                    {
                        if (k == i) continue;
                        if (evCardList[k].GetCount() >= 2)
                        {
                            bDoubleLogicCard = k;
                            break;
                        }
                    }
                    if (bDoubleLogicCard == 0)	break;

                    let j = 0;
                    for (; j < 2 - evCardList[i].GetCount(); j++)
                    {
                        bMaxCardData[j] = evCardList[0].GetAt(evCardList[0].FindIndex(j));
                    }
                    for (let k = 0; k < evCardList[i].GetCount(); k++)
                        bMaxCardData[j+k] = evCardList[i].GetAt(evCardList[i].FindIndex(k));

                    bMaxCardData[2] = evCardList[bDoubleLogicCard].GetAt(evCardList[bDoubleLogicCard].FindIndex(0));
                    bMaxCardData[3] = evCardList[bDoubleLogicCard].GetAt(evCardList[bDoubleLogicCard].FindIndex(1));

                    bMaxCardCount.value = 4;
                    return SssDef.CT_FIVE_TWO_DOUBLE;
                }
            }
        }

        //寻找对子
        for (let i = 14; i > 1; i--)
        {
            if (evCardList[i].GetCount() + evCardList[0].GetCount() == 2)
            {
                SssLib.ASSERT(evCardList[i].GetCount()<=2&&evCardList[i].GetCount()>=0);

                let j = 0;
                for (; j < 2 - evCardList[i].GetCount(); j++)
                {
                    bMaxCardData[j] = evCardList[0].GetAt(evCardList[0].FindIndex(j));
                }
                for (let k = 0; k < evCardList[i].GetCount(); k++)
                    bMaxCardData[j+k] = evCardList[i].GetAt(evCardList[i].FindIndex(k));

                bMaxCardCount.value = 2;
                return SssDef.CT_ONE_DOUBLE;
            }
        }

        //寻找散牌
        for (let i = 14; i > 1; i--)
        {
            if (evCardList[i].GetCount() == 1)
            {
                bMaxCardCount.value = 1;
                bMaxCardData[0] = evCardList[i].GetHead();
                return SssDef.CT_SINGLE;
            }
        }

        //MyMsgBox(_T("SssCards::this.GetMaxCardData Error!"));

        return SssDef.CT_INVALID;
    }

    IsFlush( cbCardData,  cbCardCount,  bMaxCardData,  bMaxCardCount,  bNeedCCount)
    {
        //校验数据
        SssLib.ASSERT(cbCardCount <= 13 || cbCardCount > 3);

        //定义变量
        let bKCount = 0;
        let  evCardList= SssLib.CListByteArr(15);	//0位存王牌,1位保留,其他位按逻辑值存放
        let  evColorList= SssLib.CListByteArr(4);	//方梅红黑
        let bCardArray=SssLib.oneDArr(13)
        SssLib.memcpy(bCardArray, cbCardData, sizeof_BYTE*cbCardCount);

        this.SortCardList(bCardArray, cbCardCount, this.enDescend);

        //分析扑克
        for (let i = 0; i < cbCardCount; i++)
        {
            //保存王牌
            if (bCardArray[i] == 0x4e || bCardArray[i] == 0x4f)
            {
                evCardList[0].AddTail(bCardArray[i]);
                continue;
            }

            //保存其他
            let bLogicNum = this.GetCardLogicValue(bCardArray[i]);
            let bColor = this.GetCardColor(bCardArray[i]);

            SssLib.ASSERT(bLogicNum>1 && bLogicNum<15 && bColor>=0 && bColor<=3);
            SssLib.ASSERT(evCardList[bLogicNum].Find(bCardArray[i]) == NULL);

            evCardList[bLogicNum].AddTail(bCardArray[i]);
            evColorList[bColor].AddTail(bCardArray[i]);
        }

        SssLib.ASSERT(evCardList[0].GetCount() <= 2);

        //寻找同花
        let bPossibleCard=SssLib.twoDArr(4,5);	//各个能组成同花的牌组
        let  maxCardColorList=new SssLib.CList_BYTE();
        for (let i = 0; i < 4; i++)
        {
            if (evColorList[i].GetCount() + evCardList[0].GetCount() >= bNeedCCount)
            {
                if (evColorList[i].GetCount() >= bNeedCCount)
                {
                    for (let k = 0; k < bNeedCCount; k++)
                        bPossibleCard[i][k] = evColorList[i].GetAt(evColorList[i].FindIndex(k));
                }
                else
                {
                    let j = 0;
                    for (; j < bNeedCCount - evColorList[i].GetCount(); j++)
                    {
                        bPossibleCard[i][j] = evCardList[0].GetAt(evCardList[0].FindIndex(j));
                    }
                    for (let k = 0; k < evColorList[i].GetCount(); k++)
                        bPossibleCard[i][j+k] = evColorList[i].GetAt(evColorList[i].FindIndex(k));
                }
                maxCardColorList.AddTail(i);
            }
        }
        if (maxCardColorList.GetCount() != 0)
        {
            let bMax = maxCardColorList.GetAt(maxCardColorList.FindIndex(0));
            for (let i = 1; i < maxCardColorList.GetCount(); i++)
            {
                let bColor = maxCardColorList.GetAt(maxCardColorList.FindIndex(i));
                if (this.CompareCard(bPossibleCard[bMax], bPossibleCard[bColor], bNeedCCount, bNeedCCount, this.btrue))
                    bMax = bColor;
            }
            SssLib.memcpy(bMaxCardData, bPossibleCard[bMax], sizeof_BYTE*bNeedCCount);
            bMaxCardCount = bNeedCCount;
            return this.btrue;
        }
        return this.bfalse;
    }

    //是否顺子
    IsStraight(cbCardData,  cbCardCount,  cbMaxCardData, bMaxCardCount,  bNeedCCount)
    {
        //校验数据
        SssLib.ASSERT(cbCardCount <= 13 || cbCardCount > 3);

        //定义变量
        let bKCount = 0;
        let  evCardList=SssLib.CListByteArr(15);	//0位存王牌,1位保留,其他位按逻辑值存放
        let  evColorList=SssLib.CListByteArr(4);	//方梅红黑
        let bCardArray=SssLib.oneDArr(13);
        SssLib.memcpy(bCardArray, cbCardData, sizeof_BYTE*cbCardCount);

        this.SortCardList(bCardArray, cbCardCount, this.enDescend);

        //分析扑克
        for (let i = 0; i < cbCardCount; i++)
        {
            //保存王牌
            if (bCardArray[i] == 0x4e || bCardArray[i] == 0x4f)
            {
                evCardList[0].AddTail(bCardArray[i]);
                continue;
            }

            //保存其他
            let bLogicNum = this.GetCardLogicValue(bCardArray[i]);
            let bColor = this.GetCardColor(bCardArray[i]);

            SssLib.ASSERT(bLogicNum>1 && bLogicNum<15 && bColor>=0 && bColor<=3);
            SssLib.ASSERT(evCardList[bLogicNum].Find(bCardArray[i]) == NULL);

            evCardList[bLogicNum].AddTail(bCardArray[i]);
            evColorList[bColor].AddTail(bCardArray[i]);
        }

        SssLib.ASSERT(evCardList[0].GetCount() <= 2);

        //寻找顺子
        for (let i = 14; i > bNeedCCount-1; i--)
        {
            let bHaveCard=SssLib.oneDArr(5)
            for (let k = 0; k < bNeedCCount-1; k++)
                bHaveCard[k] = (evCardList[i-k].GetCount()>0);
            bHaveCard[bNeedCCount-1] = ( ((i == bNeedCCount)?evCardList[14].GetCount():evCardList[i-bNeedCCount+1].GetCount()) > 0 );

            let bCount = 0;
            for (let m=0;m<bNeedCCount-1;m++)
            {
                bCount += (bHaveCard[m]?1:0) ;
            }

            if (bCount + evCardList[0].GetCount() >= bNeedCCount)
            {
                SssLib.ASSERT(bCount>=bNeedCCount-2&&bCount<=bNeedCCount);
                let j = 0;
                for (; j < bNeedCCount - bCount; j++)
                {
                    cbMaxCardData[j] = evCardList[0].GetAt(evCardList[0].FindIndex(j));
                }
                for (let k = 0; k < bNeedCCount-1; k++)
                {
                    if (bHaveCard[k])
                        cbMaxCardData[j++] = evCardList[i-k].GetHead();
                }

                let bFirstCardNum = ( (i == bNeedCCount)?14:i-bNeedCCount+1 );
                if (bHaveCard[bNeedCCount-1])
                    cbMaxCardData[bNeedCCount-1] = evCardList[bFirstCardNum].GetHead();

                bMaxCardCount = bNeedCCount;

                return this.btrue;
            }
        }
        return this.bfalse;
    }

    //是否是三同花顺
    IsThreeFlushStraight(  cbCardData ,   cbCardCount)
    {
        //校验数据
        SssLib.ASSERT(cbCardCount <= 13 || cbCardCount>3);

        let bCardList=SssLib.oneDArr(13);
        SssLib.memcpy(bCardList,cbCardData,sizeof_BYTE*cbCardCount);
        this.SortCardList(bCardList,cbCardCount,this.enDescend);
        let bLeftCount = cbCardCount;
        let cbStraightFlush=SssLib.oneDArr(5)
        let bTempCount = 5;

        let tagCardType = this.GetType(bCardList,bLeftCount);
        if (tagCardType.bStraightFlush)
        {
            for(let i = 0;i<tagCardType.btStraightFlush;++i)
            {
                SssLib.CopyMemory(bCardList,cbCardData,SssLib.sizeof(bCardList));
                bLeftCount = 13;
                this.SortCardList(bCardList,13,this.enDescend);
                SssLib.ZeroMemory(cbStraightFlush,SssLib.sizeof(cbStraightFlush));
                cbStraightFlush[0]=bCardList[tagCardType.cbStraightFlush[i*5]];
                cbStraightFlush[1]=bCardList[tagCardType.cbStraightFlush[i*5+1]];
                cbStraightFlush[2]=bCardList[tagCardType.cbStraightFlush[i*5+2]];
                cbStraightFlush[3]=bCardList[tagCardType.cbStraightFlush[i*5+3]];
                cbStraightFlush[4]=bCardList[tagCardType.cbStraightFlush[i*5+4]];

                //移除第一个同花顺
                this.RemoveCard(cbStraightFlush, bTempCount, bCardList, bLeftCount);
                bLeftCount -= bTempCount;

                //备份剩余牌
                let bLeftCardList=SssLib.oneDArr(13)
                SssLib.CopyMemory(bLeftCardList,bCardList,bLeftCount);
                let bLeftCount1 =bLeftCount;

                let tagCardType1 = this.GetType(bCardList,bLeftCount);
                if (tagCardType1.bStraightFlush)
                {
                    for (let j = 0;j<tagCardType1.btStraightFlush;++j)
                    {
                        //重新赋值
                        SssLib.CopyMemory(bCardList,bLeftCardList,bLeftCount1);
                        SssLib.ZeroMemory(cbStraightFlush,SssLib.sizeof(cbStraightFlush));
                        bLeftCount =bLeftCount1;
                        cbStraightFlush[0]=bCardList[tagCardType1.cbStraightFlush[j*5]];
                        cbStraightFlush[1]=bCardList[tagCardType1.cbStraightFlush[j*5+1]];
                        cbStraightFlush[2]=bCardList[tagCardType1.cbStraightFlush[j*5+2]];
                        cbStraightFlush[3]=bCardList[tagCardType1.cbStraightFlush[j*5+3]];
                        cbStraightFlush[4]=bCardList[tagCardType1.cbStraightFlush[j*5+4]];
                        //移除第二个同花顺
                        this.RemoveCard(cbStraightFlush, bTempCount, bCardList, bLeftCount);
                        bLeftCount -= bTempCount;


                        //判断剩余3张是否也符合同花顺
                        let bThreeStraightFlush = this.bfalse;
                        this.SortCardList(bCardList , bLeftCount, this.enDescend) ;

                        if (this.GetCardLogicValue(bCardList[0]) >=SssDef.CARD_XW && this.GetCardLogicValue(bCardList[1]) <SssDef.CARD_XW)
                        {
                            if((this.GetCardColor(bCardList[1]) == this.GetCardColor(bCardList[2]))&&
                                (this.GetCardLogicValue(bCardList[1])-this.GetCardLogicValue(bCardList[2])==1
                                    || this.GetCardLogicValue(bCardList[1])-this.GetCardLogicValue(bCardList[2])==2
                                    || (this.GetCardLogicValue(bCardList[1]) == 14 &&this.GetCardLogicValue(bCardList[2])<=3))
                            )
                            {
                                bThreeStraightFlush = this.btrue;
                            }
                        }
                        else if (this.GetCardLogicValue(bCardList[0]) ==SssDef.CARD_DW && this.GetCardLogicValue(bCardList[1]) ==SssDef.CARD_XW)
                        {
                            bThreeStraightFlush = this.btrue;
                        }
                        else
                        {
                            if((this.GetCardColor(bCardList[0]) == this.GetCardColor(bCardList[1]) && this.GetCardColor(bCardList[0]) == this.GetCardColor(bCardList[2]))&&
                                ((this.GetCardLogicValue(bCardList[0])==this.GetCardLogicValue(bCardList[1])+1 && this.GetCardLogicValue(bCardList[1])==this.GetCardLogicValue(bCardList[2])+1)
                                    || (this.GetCardLogicValue(bCardList[0]) == 14 &&this.GetCardLogicValue(bCardList[1])==3 &&this.GetCardLogicValue(bCardList[2])==2)))
                            {
                                bThreeStraightFlush = this.btrue;
                            }
                        }
                        if (bThreeStraightFlush)
                        {
                            return this.btrue;
                        }
                    }

                }
            }
        }

        return this.bfalse;
    }
    getCardDatas(){
        return this.m_bCardListData;
    }

     //单例处理
     private static _instance:SssCards;
     public static getInstance ():SssCards{
         if(!this._instance){
             this._instance = new SssCards();
         }
         return this._instance;
     }

    // ShowCard(m_bHandCardData,m_bSegmentCard,m_topTenCardGroup,m_bHandCardCount,m_nCurrentUser=0)
    // {
    //     m_bHandCardCount=m_bHandCardData.length;
    //     if (m_bHandCardCount<=0)
    //     {
    //         return ;
    //     }else if (m_bHandCardCount < HAND_CARD_COUNT)
    //     {
    //         CopyMemory(m_bHandCardData , m_bTmpHandCardData , SssLib.sizeof(m_bHandCardData)) ;
    //         m_bHandCardCount = HAND_CARD_COUNT;
    //     }
     
    //     this.SortCardList(m_bHandCardData,HAND_CARD_COUNT);


    //     this.AutoPutCard(m_bHandCardData,m_bHandCardCount,m_bSegmentCard[m_nCurrentUser][0],m_bSegmentCard[m_nCurrentUser][1],m_bSegmentCard[m_nCurrentUser][2]);
    //     // 乌龙判断
    //     // let bDragon = false ;
    //     // if((true==this.CompareCard(m_bSegmentCard[m_nCurrentUser][0] , m_bSegmentCard[m_nCurrentUser][1], 3 , 5 , false)) &&
    //     // (true==this.CompareCard(m_bSegmentCard[m_nCurrentUser][1], m_bSegmentCard[m_nCurrentUser][2] , 5 , 5 , false)))
    //     // bDragon = false ;
    //     // else
    //     // bDragon = true
    //     let bDragon = true ;


    //     if(bDragon)
    //     {
    //         //恢复扑克
    //         let bCardCount=HAND_CARD_COUNT;

    //         let SEARCHE_COUNT = 10000 ;
    //         // ASSERT(bCardCount==13) ;
    //         if(bCardCount!=13) return ;
    //         let bAllSegmentCardIndex=SssLib.thrDArr(SEARCHE_COUNT,3,5) ;            //分段扑克

    //         let bSegmentScore=SssLib.oneDArr(SEARCHE_COUNT) ;                            //分段权重
    //         let bCardDataIndex = [0,1,2,3,4,5,6,7,8,9,10,11,12] ;    //扑克下标
    //         let bFrontCardType ,                                        //前墩类型
    //             bMidCardType,                                            //中墩类型
    //             bBackCardType;                                            //后墩类型
    //         let bCardData=SssLib.oneDArr(5) ;
    //         SssLib.ZeroMemory(bAllSegmentCardIndex , SssLib.sizeof(bAllSegmentCardIndex)) ;
    //         SssLib.ZeroMemory(bSegmentScore , SssLib.sizeof(bSegmentScore)) ;

    //         //srand(time(NULL));

    //         let  bSegCount=0 ;
    //         let bSearchCount = 0 ;
    //         let bStop = false ;
    //         while(false==bStop)
    //         {
    //             ++bSearchCount ;
    //             let bCardIndex=0 ;                                        //扑克下标
    //             //前墩扑克


    //             for(let bFrontCard=0 ; bFrontCard<3 ; ++bFrontCard)
    //             {
    //                 bCardIndex = SssLib.rand()%(13-bFrontCard) ;
    //                 bAllSegmentCardIndex[bSegCount][0][bFrontCard] = bCardDataIndex[bCardIndex] ;
    //                 bCardData[bFrontCard] = m_bHandCardData[bCardDataIndex[bCardIndex]] ;
    //                 bCardDataIndex[bCardIndex] = bCardDataIndex[13-bFrontCard-1] ;
    //             }

    //             this.SortCardList(bCardData , 3 , this.enDescend) ;
    //             bFrontCardType = this.GetCardType(bCardData , 3,this.btCardSpecialData) ;

    //             //中墩扑克
    //             for(let bMidCard=0 ; bMidCard<5 ; ++bMidCard)
    //             {
    //                 bCardIndex = SssLib.rand()%(10-bMidCard) ;
    //                 bAllSegmentCardIndex[bSegCount][1][bMidCard] = bCardDataIndex[bCardIndex] ;
    //                 bCardData[bMidCard] = m_bHandCardData[bCardDataIndex[bCardIndex]] ;
    //                 bCardDataIndex[bCardIndex] = bCardDataIndex[10-bMidCard-1] ;
    //             }

    //             this.SortCardList(bCardData , 5 , this.enDescend) ;
    //             bMidCardType = this.GetCardType(bCardData , 5,this.btCardSpecialData) ;

    //             //后墩扑克
    //             for(let bBackCard=0 ; bBackCard<5 ; ++bBackCard)
    //             {
    //                 bAllSegmentCardIndex[bSegCount][2][bBackCard] = bCardDataIndex[bBackCard] ;
    //                 bCardData[bBackCard] = m_bHandCardData[bCardDataIndex[bBackCard]] ;
    //             }
    //             this.SortCardList(bCardData , 5 , this.enDescend) ;


    //             bBackCardType = this.GetCardType(bCardData , 5,this.btCardSpecialData) ;


    //             if(bBackCardType>bMidCardType && bMidCardType>bFrontCardType) 
    //             {
    //                 bSegmentScore[bSegCount] = bFrontCardType+bMidCardType+bBackCardType ;
    //                 bSegCount++;                
    //             }

    //             //恢复数据
    //             for(let i=0 ; i<13 ; ++i)
    //                 bCardDataIndex[i] = i ;

    //             //停止搜索
    //             if(bSegCount>=SEARCHE_COUNT || bSearchCount>=100000) bStop = true ;
    //             //搜到一个
    //             if(true==bStop && 0==bSegCount) bStop = false ; 

    //             //搜索不到
    //             if(bSearchCount>=100000)
    //             {
    //             let bIndex=0 ; 
    //                 for(let i=0 ; i<3 ; ++i)
    //                     for(let j=0 ; j<5 ; ++j)
    //                         bAllSegmentCardIndex[0][i][j]=bIndex++ ;
    //                 bStop = true ;
    //                 break ;
    //             }
    //         }

    //         //找出权重前10的组合，并记录在数组中的位置
    //         // let findBest = function(index, next){
    //         //     if(bSegmentScore[m_bestGroupIndex[index]] < bSegmentScore[next]){
    //         //         m_bestGroupIndex[index]=i+1;

    //         //         continue
    //         //     }
    //         //     else{
    //         //         index++;
    //         //         if(index < 10){
    //         //             findBest(index,next)
    //         //         }
    //         //     }
    //         // }
    //         // for(let i=0;i<bSegmentScore.length-1;i++){
    //         //     this.findBest(0,i+1)
    //         // }
            

    //         // 返回所有组合
    //         let bMaxScore=bSegmentScore[0] ;
    //         let bIndex=0 ;
    //         for(let i=0 ; i<bSegCount ; ++i)
    //         {
    //             // if(bMaxScore<bSegmentScore[i])
    //             // {
    //                 // bIndex=i ;
    //                 // bMaxScore=bSegmentScore[i] ;
    //             // }
    //             bIndex=i ;
    //             bMaxScore=bSegmentScore[i] ;
    //             //设置前墩
    //             for(let j=0;j<3;j++)
    //             {
    //                 m_bSegmentCard[i][0][j]=m_bHandCardData[bAllSegmentCardIndex[bIndex][0][j]];
    //             }
    //             //设置中敦，后敦
    //             for(let j=0;j<5;j++)
    //             {
    //                 m_bSegmentCard[i][1][j]=m_bHandCardData[bAllSegmentCardIndex[bIndex][1][j]];
    //                 m_bSegmentCard[i][2][j]=m_bHandCardData[bAllSegmentCardIndex[bIndex][2][j]];
    //             }
    //         }
    //         //找出权重前10的组合，并记录在数组中的位置
    //         for (let i=0; i<bSegmentScore.length; i++) {
    //             for(let j = 0; j<bSegmentScore.length-1-i; j++){
    //                 if (bSegmentScore[j] < bSegmentScore[j+1]) {
    //                     let tempScore = bSegmentScore[j]
    //                     bSegmentScore[j] = bSegmentScore[j+1]
    //                     bSegmentScore[j+1] = tempScore
    //                     let tempCard = m_bSegmentCard[j]
    //                     m_bSegmentCard[j] = m_bSegmentCard[j+1]
    //                     m_bSegmentCard[j+1] = tempCard
    //                 }
    //             }
    //         }
    //         let count = 0;
    //         for(let i = 0; i<5000; i++){
    //             let flag = false;
    //             for (let j = 0; j<3; j++) {
    //                    if (!m_bSegmentCard[i][0][j]) flag = true
    //             }
    //             if (flag) {
    //                 count++
    //                 continue
    //             }
    //             for (let j = 0; j<5; j++) {
    //                    if (!m_bSegmentCard[i][1][j]) flag = true
    //             }
    //             if (flag) {
    //                 count++
    //                 continue
    //             }
    //             for (let j = 0; j<5; j++) {
    //                    if (!m_bSegmentCard[i][2][j]) flag = true
    //             }
    //             if (flag) {
    //                 count++
    //                 continue
    //             }
    //             if(i>count && bSegmentScore[i] == bSegmentScore[i-1]){
    //                 continue
    //             }
    //             m_topTenCardGroup.push(m_bSegmentCard[i])
    //             count = 0;
    //             //console.log(`${i}组`, m_bSegmentCard[i])
    //             if (m_topTenCardGroup.length > 9) break;
    //         }

    //     }
    // }

    ShowCard(m_bHandCardData,m_bHandCardCount,SEARCHE_COUNT) {
        let bCardDataIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];    //扑克下标
        let bFrontCardType,                                     //前墩类型
            bMidCardType,                                           //中墩类型
            bBackCardType;                                          //后墩类型
        let bCardData = SssLib.thrDArr(SEARCHE_COUNT, 3, 5);//自动摆牌数组
        //console.log('bCardData', bCardData)
        let bCardDataQuan=SssLib.twoDArr(SEARCHE_COUNT,3);//存储权重
        let bCardDataType = SssLib.twoDArr(SEARCHE_COUNT, 3);
        let tempm_bHandCardData=SssLib.oneDArr(13);
        SssLib.CopyMemory(tempm_bHandCardData,m_bHandCardData,13);

        let bSegCount = 0;

        this.SortCardList(tempm_bHandCardData, 13, 0);
        this.SortCardList(m_bHandCardData, 13, 0);

        //分析扑克牌
        let chaipuke = function (CardData,bCardCount,self) {
            let newCardData = self.GetType(CardData, bCardCount);

            let btFiveSame = 0;
            let btStraightFlush = 1;
            let btFourSame = 2;
            let btGourd = 3;
            let btFlush = 4;
            let btStraight = 5;
            let btThreeSame = 6;
            let btTwoPare = 7;
            let btOnePare = 8;
            let CardType = {};
            if (newCardData.btFiveSame > 0) {
                CardType[btFiveSame] = newCardData.cbFiveSame;
            }
            if (newCardData.btStraightFlush > 0) {
                CardType[btStraightFlush] = newCardData.cbStraightFlush;
            }
            if (newCardData.btFourSame > 0) {
                CardType[btFourSame] = newCardData.cbFourSame;
            }
            if (newCardData.btGourd > 0) {
                CardType[btGourd] = newCardData.cbGourd;
            }
            if (newCardData.btFlush > 0) {
                CardType[btFlush] = newCardData.cbFlush;
            }
            if (newCardData.btStraight > 0) {
                CardType[btStraight] = newCardData.cbStraight;
            }
            if (newCardData.btThreeSame > 0) {
                CardType[btThreeSame] = newCardData.cbThreeSame;
            }
            if (newCardData.btTwoPare > 0) {
                CardType[btTwoPare] = newCardData.cbTwoPare;
            }
            if (newCardData.btOnePare > 0) {
                CardType[btOnePare] = newCardData.cbOnePare;
            }
            // //console.log("=CardType=", CardType, bCardCount);
            return CardType;
        }


        let CardType = chaipuke(tempm_bHandCardData,13,this);

        //开始自动摆摊
        for (let Backi = 0; Backi < 9; Backi++) {
            if (CardType[Backi] != null) {
                let num = this.GetTypeValue(Backi);//获取牌型的数量值
                for (let count = 0; count < 5; count++) {
                    SssLib.CopyMemory(tempm_bHandCardData,m_bHandCardData,13);
                    bCardDataIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];    //扑克下标
                    if (CardType[Backi][count * num] == 0 && CardType[Backi][count * num + 1] == 0) {
                        break;
                    }
                    let bBackCardType = 0;
                    let bMidCardType = 0;
                    let bFrontCardType = 0;
                    for (let j = 0; j < num; j++) {
                        let newnum = num * count + j;
                        bCardData[bSegCount][2][j] = m_bHandCardData[CardType[Backi][newnum]];//将牌型放入后墩
                        bCardDataIndex[CardType[Backi][newnum]] = -1;
                    }

                    //移除扑克
                    let tempbCardData = SssLib.oneDArr(5);
                    SssLib.CopyMemory(tempbCardData, bCardData[bSegCount][2], 5);
                    this.RemoveCard(tempbCardData, num, tempm_bHandCardData, 13);
                    let temppp = SssLib.oneDArr(13 - num);
                    SssLib.CopyMemory(temppp, tempm_bHandCardData, (13 - num));

                    //临时数组
                    let zhongduntemppp=SssLib.oneDArr(13 - num);
                    this.SortCardList(temppp,13 - num,0);
                    SssLib.CopyMemory(zhongduntemppp,temppp,13 - num);

                    //中墩
                    let MidCardType = chaipuke(temppp, 13 - num,this);
                    let MidCardIndex = [];//初始化扑克下标
                    for (let IndexInit = 0; IndexInit < 13 - num; IndexInit++) {
                        MidCardIndex.push(IndexInit);
                    }
                    if(JSON.stringify(MidCardType) == "{}"){
                        bCardData[bSegCount][1][0] = temppp[0];//中前墩都是乌龙了，那就最大两张分别放吧
                        bCardData[bSegCount][0][0] = temppp[1];
                        for (let i = 2; i < 6; i++) {
                            bCardData[bSegCount][1][i - 1] = temppp[i];
                            }
                            
                        for (let j = 6; j < 8; j++) {
                            bCardData[bSegCount][0][j-5]=temppp[j];
                        }
                        //后墩
                        if (num != 5) {
                            let len = temppp.length;
                            for (let bBackCard = 8; bBackCard < len; ++bBackCard) {
                                bCardData[bSegCount][2][bBackCard + num - 8] = temppp[bBackCard];
                            }
                        }
                        //判断相公
                        this.checkXiangGongCard(bCardData[bSegCount],0);

                        bBackCardType=this.GetCardType(bCardData[bSegCount][2], 5, this.btCardSpecialData);
                        bFrontCardType=this.GetCardType(bCardData[bSegCount][0], 3, this.btCardSpecialData);
                        bMidCardType=this.GetCardType(bCardData[bSegCount][1], 5, this.btCardSpecialData);
                        let BackNewQuan=this.CheckCardQuan(bCardData[bSegCount][2],2,bBackCardType);
                        let MidNewQuan=this.CheckCardQuan(bCardData[bSegCount][1],1,bMidCardType);
                        let FrontNewQuan=this.CheckCardQuan(bCardData[bSegCount][0],0,bFrontCardType);
                        //保存类型
                        bCardDataType[bSegCount][2] = bBackCardType;
                        bCardDataType[bSegCount][1] = bMidCardType;
                        bCardDataType[bSegCount][0] = bFrontCardType;
                        //保存权重
                        bCardDataQuan[bSegCount][2] = BackNewQuan;
                        bCardDataQuan[bSegCount][1] = MidNewQuan;
                        bCardDataQuan[bSegCount][0] = FrontNewQuan;
                        bSegCount++;
                        continue;
                    } else {
                        for (let midi = 0; midi < 9; midi++) {
                            if (MidCardType[midi] != null) {
                                let midnum = this.GetTypeValue(midi);//获取牌型的数量值
                                for (let midcount = 0; midcount < MidCardType[midi].length;midcount++)
                                {
                                    SssLib.CopyMemory(zhongduntemppp,temppp,13 - num);
                                    for (let IndexInit = 0; IndexInit < 13 - num; IndexInit++) {
                                        MidCardIndex[IndexInit] = IndexInit;
                                    }
                                    if (MidCardType[midi][midcount * midnum] == 0 && MidCardType[midi][midcount * midnum + 1] == 0) {
                                        break;
                                    }
                                    SssLib.CopyMemory(bCardData[bSegCount][2], tempbCardData, 5);
                                    for (let midj = 0; midj < midnum; midj++) {
                                        let newmidnum = midnum * midcount + midj;
                                        bCardData[bSegCount][1][midj] = temppp[MidCardType[midi][newmidnum]];//将牌型放入中墩
                                        MidCardIndex[MidCardType[midi][newmidnum]] = -1;
                                    }
                                    //优化
                                    let NoUseCard = [];
                                    for (let NoUseNum = 0; NoUseNum < 13 - num; NoUseNum++) {
                                        if (MidCardIndex[NoUseNum] != -1) {
                                            NoUseCard.push(temppp[MidCardIndex[NoUseNum]])
                                        }
                                    }
                                    //移除扑克
                                    //将牌型放入前墩
                                    let NoUseCardType = chaipuke(NoUseCard, NoUseCard.length, this);
                                    if (NoUseCardType[6] != null) {
                                        for (let bFrontCard = 0; bFrontCard < 3; ++bFrontCard) {
                                            bCardData[bSegCount][0][bFrontCard] = NoUseCard[NoUseCardType[6][bFrontCard]];
                                            NoUseCard[NoUseCardType[6][bFrontCard]] = -1
                                        }
                                        for (let i = 0; i < NoUseCard.length; ++i) {
                                            if (NoUseCard[i] == -1) {
                                                NoUseCard.splice(i, 1);
                                                i = -1;
                                            }
                                        }
                                    } else if (NoUseCardType[8] != null) {
                                        for (let bFrontCard = 0; bFrontCard < 2; ++bFrontCard) {
                                            bCardData[bSegCount][0][bFrontCard] = NoUseCard[NoUseCardType[8][bFrontCard]];
                                            NoUseCard[NoUseCardType[8][bFrontCard]] = -1;
                                        }
                                        for (let i = 0; i < NoUseCard.length; ++i) {
                                            if (NoUseCard[i] == -1) {
                                                NoUseCard.splice(i, 1);
                                                i = -1;
                                            }
                                        }
                                    }
                                    //不足5张
                                    //牌型不满足5张要补数量
                                    let NoUseCardWalls=NoUseCard.length;
                                    this.SortCardList(NoUseCard,NoUseCardWalls,0);
                                    //后墩
                                    if (num != 5) {
                                        for (let bBackCard = num; bBackCard < 5; ++bBackCard) {
                                            bCardData[bSegCount][2][bBackCard] = NoUseCard[NoUseCardWalls-1];
                                            NoUseCardWalls--;
                                        }
                                    }
                                    //中墩
                                    if (midnum != 5) {
                                        for (let midCard = midnum; midCard < 5; ++midCard) {
                                            bCardData[bSegCount][1][midCard] = NoUseCard[NoUseCardWalls-1];
                                            NoUseCardWalls--;
                                        }
                                    }
                                    //前墩
                                    if(NoUseCard!=null){
                                        let len=NoUseCardWalls;
                                       for (let bFrontCard = 0; bFrontCard < len; ++bFrontCard) {
                                                bCardData[bSegCount][0][2-bFrontCard] = NoUseCard[NoUseCardWalls-1];
                                                NoUseCardWalls--;
                                            } 
                                    }
                                    //判断相公
                                    this.checkXiangGongCard(bCardData[bSegCount],0);
                                    
                                    bBackCardType = this.GetCardType(bCardData[bSegCount][2], 5, this.btCardSpecialData);
                                    bMidCardType = this.GetCardType(bCardData[bSegCount][1], 5, this.btCardSpecialData);
                                    bFrontCardType = this.GetCardType(bCardData[bSegCount][0], 3, this.btCardSpecialData);
                                    let BackNewQuan=this.CheckCardQuan(bCardData[bSegCount][2],2,bBackCardType);
                                    let MidNewQuan=this.CheckCardQuan(bCardData[bSegCount][1],1,bMidCardType);
                                    let FrontNewQuan=this.CheckCardQuan(bCardData[bSegCount][0],0,bFrontCardType);
                                    //保存类型
                                    if (bMidCardType == 5 || bMidCardType == 6 || bMidCardType == 7) {//顺子与同花顺统一
                                        bMidCardType = 5;
                                    }
                                    if (bBackCardType == 5 || bBackCardType == 6 || bBackCardType == 7) {
                                        bBackCardType = 5;
                                    }
                                    if (bMidCardType == 16 || bMidCardType == 17 || bMidCardType == 18) {
                                        bMidCardType = 16;
                                    }
                                    if (bBackCardType == 16 || bBackCardType == 17 || bBackCardType == 18) {
                                        bBackCardType = 16;
                                    }
                                    //保存类型
                                    bCardDataType[bSegCount][2] = bBackCardType;
                                    bCardDataType[bSegCount][1] = bMidCardType;
                                    bCardDataType[bSegCount][0] = bFrontCardType;
                                    //保存权重
                                    bCardDataQuan[bSegCount][2] = BackNewQuan;
                                    bCardDataQuan[bSegCount][1] = MidNewQuan;
                                    bCardDataQuan[bSegCount][0] = FrontNewQuan;
                                    bSegCount++;
                                    if (bSegCount >= SEARCHE_COUNT) {
                                        //console.log('bCardDataTypebCardDataTypebCardDataType',bCardDataType,bCardDataQuan)
                                        let Quan = this.getNewQuan(bCardDataType, bCardDataQuan);
                                        return this.GetNewCardDate(Quan, bCardData);
                                    }
                                    for (let IndexInit = 0; IndexInit < 13 - num; IndexInit++) {
                                        MidCardIndex[IndexInit] = IndexInit;
                                    }
                                }//4
                            }//3
                        }
                    }
                }//2
            }//1
        }
        let Quan=this.getNewQuan(bCardDataType,bCardDataQuan);
        return this.GetNewCardDate(Quan,bCardData);
    }
    GetTypeValue(num){
        switch(num){
            case 0:
            case 1:
            case 3:
            case 4:
            case 5:
                return 5;
            break;

            case 2:
            case 7:
                return 4;
            break;
            case 6:
                return 3;
            case 8:
                return 2;
        }
    }
    //分析权重
    getNewQuan(CardType, quan) {
        let liquan = [];
        for (let i = 0; i < CardType.length; i++) {
            let num = 0;
            let NewQuan = 0;
            for (let j = 0; j < 3; j++) {
                num += CardType[i][j];
                NewQuan += quan[i][j];
            }
            liquan.push({count: i, Num: num, CardQuan: NewQuan});
        }
        liquan.sort(function (a, b) {
            return b.CardQuan - a.CardQuan;
        });

        //console.log("liquan=", liquan);
        let numtemp = [];
        numtemp.push(liquan[0].count);
        let quantemp = 0;
        for (let i = 1; i < liquan.length - 1; i++) {
            //判断相同权重的牌型是否都相同
            if ((CardType[liquan[quantemp].count][2] != CardType[liquan[i].count][2])
                || (CardType[liquan[quantemp].count][1] != CardType[liquan[i].count][1])
                || (CardType[liquan[quantemp].count][0] != CardType[liquan[i].count][0])) {
                let Allequal = false;
                for (let j = 0; j < numtemp.length; j++) {
                    let quannum = 0;
                    for (let k = 0; k < 3; k++) {
                        quannum += CardType[numtemp[j]][k]
                    }

                    if ((liquan[i].Num == quannum)
                        && (CardType[liquan[i].count][2] == CardType[numtemp[j]][2])
                        && (CardType[liquan[i].count][1] == CardType[numtemp[j]][1])
                        && (CardType[liquan[i].count][0] == CardType[numtemp[j]][0])) {
                        Allequal = true;
                        break;
                    }

                }
                if (Allequal) {
                    continue;
                }
            } else {
                continue;
            }
            if (liquan[i].Num == 0) {
                break;
            }
            numtemp.push(liquan[i].count);
            quantemp = i;
        }
        //console.log("numtemp=", numtemp);
        return numtemp;
    }
    CheckCardQuan(CardDate,Dun,CardType){
        switch(Dun){
            case 0:
            {
                switch(CardType){
                    case SssDef.CT_THREE:
                    {
                        return 80;
                    }
                    case SssDef.CT_ONE_DOUBLE:
                    {
                        let value=0.1*(this.GetCardLogicValue(CardDate[1])-1);

                        return 25*(value+0.5);
                    }
                    case SssDef.CT_SINGLE:
                    {
                        let value=0.1*(this.GetCardLogicValue(CardDate[0])-1);
                        return 9*value;
                    }
                }
            }
            case 1:
            {
                switch(CardType){
                    case SssDef.CT_FIVE_BOMB:
                    {
                    return 100;
                    }
                    case SssDef.CT_FIVE_STRAIGHT_FLUSH_BACK_A:
                    case SssDef.CT_FIVE_STRAIGHT_FLUSH_FIRST_A:
                    case SssDef.CT_FIVE_STRAIGHT_FLUSH_NO_A:
                    {
                    return 90;
                    }
                    case SssDef.CT_FIVE_FOUR_ONE:{
                    return 80;
                    }
                    case SssDef.CT_FIVE_THREE_DEOUBLE:
                    {
                    return 60;
                    }
                    case SssDef.CT_FIVE_FLUSH:
                    {
                    return 40;
                    }
                    case SssDef.CT_FIVE_MIXED_FLUSH_NO_A:                              //没A杂顺
                    case SssDef.CT_FIVE_MIXED_FLUSH_FIRST_A:                              //A在前顺子
                    case SssDef.CT_FIVE_MIXED_FLUSH_BACK_A:                            //A在后顺子
                    {
                    return 35;
                    }
                    case SssDef.CT_THREE:
                    {
                    return 30;
                    }
                    case SssDef.CT_FIVE_TWO_DOUBLE:
                    {
                    let value=0.1*(this.GetCardLogicValue(CardDate[1])-1);
                    return 15*(value+0.5);
                    }
                    case SssDef.CT_ONE_DOUBLE:
                    {
                    let value=0;
                    for(let i=0;i<4;i++){
                        if(this.GetCardLogicValue(CardDate[0])>=15){
                            value=0.1*(this.GetCardLogicValue(CardDate[1])-1);
                            break;
                        }
                        if(this.GetCardLogicValue(CardDate[i])==this.GetCardLogicValue(CardDate[i+1])){
                            value=0.1*(this.GetCardLogicValue(CardDate[i])-1);
                            break;
                        }
                    }
                    return 10*value;
                    }
                    case SssDef.CT_SINGLE:
                    {
                    let value=0.1*(this.GetCardLogicValue(CardDate[0])-1);
                    return 8*value;
                    }
                }
            }
            case 2:
            {
                switch(CardType){
                    case SssDef.CT_FIVE_BOMB://五同
                    return 100;
                    case SssDef.CT_FIVE_STRAIGHT_FLUSH_BACK_A://同花顺
                    case SssDef.CT_FIVE_STRAIGHT_FLUSH_NO_A:
                    case SssDef.CT_FIVE_STRAIGHT_FLUSH_FIRST_A:
                    return 80;
                    case SssDef.CT_FIVE_FOUR_ONE://铁支
                    return 70;
                    case SssDef.CT_FIVE_THREE_DEOUBLE://葫芦
                    {
                    return 40;
                    }
                    case SssDef.CT_FIVE_FLUSH://同花
                    return 30;
                    case SssDef.CT_FIVE_MIXED_FLUSH_NO_A:                              //没A杂顺
                    case SssDef.CT_FIVE_MIXED_FLUSH_FIRST_A:                              //A在前顺子
                    case SssDef.CT_FIVE_MIXED_FLUSH_BACK_A:                            //A在后顺子
                    return 20;
                    case SssDef.CT_THREE://三条
                    return 14;
                    case SssDef.CT_FIVE_TWO_DOUBLE://两对
                    return 8;
                    case SssDef.CT_ONE_DOUBLE://一对
                    return 5;
                    case SssDef.CT_SINGLE://单排
                    return 1;
                }
            }
        }
    }
    GetNewCardDate(NewQuan,bCardData){
        let lastCardData=[];
        for(let num=0;num<NewQuan.length;num++){
            for(let i=0;i<bCardData.length;i++){
                if(NewQuan[num]==i){
                    lastCardData.push(bCardData[i]);
                }
            }
        }
        return this.checkXiangGong(lastCardData);
    }
    checkXiangGong(bCardData) {
        for(let i=0;i<bCardData.length;i++){
            if(!(this.CompareCard(bCardData[i][0],bCardData[i][1],3,5,false)&&this.CompareCard(bCardData[i][1],bCardData[i][2],5,5,false))){
                bCardData.splice(i,1);
            }
        }
        return bCardData;
    }
    checkXiangGongCard(bCardData,count){
        let num=count%2
        let FirstCard=bCardData[num];
        let SecondCard=bCardData[num+1];
        let FirstLen=0;
        if(num==0){
            FirstLen=3;
        }else{
            FirstLen=5;
        }
        if (!this.CompareCard(FirstCard, SecondCard, FirstLen, 5, false)) {
            let tempcard = [];
            for (let i = 0; i < FirstLen; i++) {
                tempcard.push(SecondCard[i]);
                SecondCard[i] = FirstCard[i];
                FirstCard[i] = tempcard[i];
            }
            count++;
            this.checkXiangGongCard(bCardData,count);
        }else if(count==0){
             count++;
            this.checkXiangGongCard(bCardData,count);
        }
    }
}



//////////////////////////////////////////////////////////////////////////




