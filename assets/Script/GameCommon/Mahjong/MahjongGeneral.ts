  
let MahjongGeneral={}; 
let MajiangType={}
MajiangType.emMJType_Wan    = 1; //万  
MajiangType.emMJType_Tiao   = 2; //条  
MajiangType.emMJType_Tong   = 3; //筒  
MajiangType.emMJType_Zi = 4; //字  
MajiangType.emMJType_Hua    = 5 ; //花   

 
let COB=function(  m,   n) {  
    return m << 4 | (n & 0x0F);  
}  
  
let  Majiang_Type=function(  m) {  
    return  m >> 4 ;  
}  
  
let  Majiang_Value=function(  m) {  
    return m & 0x0F;  
}  

let emMJ = {};
  
emMJ.emMJ_Joker = 0;     //变后的赖子  
emMJ.emMJ_Joker2 = 1;     //另一个赖子
emMJ.emMJ_1Wan = COB(MajiangType.emMJType_Wan, 1);  
emMJ.emMJ_2Wan = COB(MajiangType.emMJType_Wan, 2);  
emMJ.emMJ_3Wan = COB(MajiangType.emMJType_Wan, 3);  
emMJ.emMJ_4Wan = COB(MajiangType.emMJType_Wan, 4);  
emMJ.emMJ_5Wan = COB(MajiangType.emMJType_Wan, 5);  
emMJ.emMJ_6Wan = COB(MajiangType.emMJType_Wan, 6);  
emMJ.emMJ_7Wan = COB(MajiangType.emMJType_Wan, 7);  
emMJ.emMJ_8Wan = COB(MajiangType.emMJType_Wan, 8);  
emMJ.emMJ_9Wan = COB(MajiangType.emMJType_Wan, 9);  

emMJ.emMJ_1Tiao = COB(MajiangType.emMJType_Tiao, 1);  
emMJ.emMJ_2Tiao = COB(MajiangType.emMJType_Tiao, 2);  
emMJ.emMJ_3Tiao = COB(MajiangType.emMJType_Tiao, 3);  
emMJ.emMJ_4Tiao = COB(MajiangType.emMJType_Tiao, 4);  
emMJ.emMJ_5Tiao = COB(MajiangType.emMJType_Tiao, 5);  
emMJ.emMJ_6Tiao = COB(MajiangType.emMJType_Tiao, 6);  
emMJ.emMJ_7Tiao = COB(MajiangType.emMJType_Tiao, 7);  
emMJ.emMJ_8Tiao = COB(MajiangType.emMJType_Tiao, 8);  
emMJ.emMJ_9Tiao = COB(MajiangType.emMJType_Tiao, 9);  

emMJ.emMJ_1Tong = COB(MajiangType.emMJType_Tong, 1);  
emMJ.emMJ_2Tong = COB(MajiangType.emMJType_Tong, 2);  
emMJ.emMJ_3Tong = COB(MajiangType.emMJType_Tong, 3);  
emMJ.emMJ_4Tong = COB(MajiangType.emMJType_Tong, 4);  
emMJ.emMJ_5Tong = COB(MajiangType.emMJType_Tong, 5);  
emMJ.emMJ_6Tong = COB(MajiangType.emMJType_Tong, 6);  
emMJ.emMJ_7Tong = COB(MajiangType.emMJType_Tong, 7);  
emMJ.emMJ_8Tong = COB(MajiangType.emMJType_Tong, 8);  
emMJ.emMJ_9Tong = COB(MajiangType.emMJType_Tong, 9);  

emMJ.emMJ_DongFeng =     COB(MajiangType.emMJType_Zi, 1);//东 
emMJ.emMJ_NanFeng =      COB(MajiangType.emMJType_Zi, 3);//南  
emMJ.emMJ_XiFeng =       COB(MajiangType.emMJType_Zi, 5);//西  
emMJ.emMJ_BeiFeng =      COB(MajiangType.emMJType_Zi, 7);//北  

emMJ.emMJ_HongZhong =    COB(MajiangType.emMJType_Zi, 9);//中 
emMJ.emMJ_FaCai =        COB(MajiangType.emMJType_Zi, 11);//发 
emMJ.emMJ_BaiBan =       COB(MajiangType.emMJType_Zi, 13);//白  

//一副中花牌各只有一张  
emMJ.emMJ_Mei =  COB(MajiangType.emMJType_Hua, 1);//梅  
emMJ.emMJ_Lan =  COB(MajiangType.emMJType_Hua, 3);//兰  
emMJ.emMJ_Ju =   COB(MajiangType.emMJType_Hua, 5);//菊  
emMJ.emMJ_Zhu =  COB(MajiangType.emMJType_Hua, 7);//竹  
emMJ.emMJ_Chun =     COB(MajiangType.emMJType_Hua, 9);//春  
emMJ.emMJ_Xia =  COB(MajiangType.emMJType_Hua, 11);//夏  
emMJ.emMJ_Qiu =  COB(MajiangType.emMJType_Hua, 13);//秋  
emMJ.emMJ_Dong =     COB(MajiangType.emMJType_Hua,15)  //冬  
emMJ.emMJ_TEST =  3  //用来检测闲金


MahjongGeneral.MajiangType=MajiangType; 
MahjongGeneral.emMJ=emMJ;
MahjongGeneral.Majiang_Type=Majiang_Type; 
MahjongGeneral.isJoker=function(cardvalue)
{
	return cardvalue==emMJ.emMJ_Joker||cardvalue==emMJ.emMJ_Joker2;
} 
MahjongGeneral.isBaiBan=function(cardvalue)
{
	return cardvalue==emMJ.emMJ_BaiBan;
} 
MahjongGeneral.isNumberCard=function(cardvalue)
{
	return Majiang_Type(cardvalue)<MajiangType.emMJType_Zi;
} 
export const MahjongGeneral=MahjongGeneral;