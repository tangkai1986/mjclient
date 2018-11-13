var SssDef={};

SssDef.looprc_op=1;//主循环录像类型-操作
//手牌数量 
SssDef.cardcount=13;
//gm操作
SssDef.gmop_changecard=1;//gm换牌
SssDef.gmop_changewallorder=2;//gm更换牌墙顺序
SssDef.gmreq_cards=1;//gm请求牌型

SssDef.state_idle=1;//等待状态
SssDef.state_xiazhu=2;//下注状态
SssDef.state_peipai=3;//配牌状态
SssDef.state_dengdaijiesuan=4;// 等待结算状态

SssDef.process_cheatcheck = 0;//检测外挂
SssDef.process_ready=1;//准备
SssDef.process_xiazhu=2;//下注
SssDef.process_fapai=3;//发牌
SssDef.process_peipai=4;//配牌
SssDef.process_dengdaijiesuan=5;//等待结算
SssDef.process_gamesettle=7;//游戏结算 

//服务器检测各种时间的等级

//玩家操作
SssDef.op_xiazhu=0;//下注
SssDef.op_peipai=1;//配牌
SssDef.op_restartgame=2;//重启牌局
//玩家事件
SssDef.event_xiazhu=0;//下注
SssDef.event_peipai=1;//配牌
//客户端通知事件
SssDef.onOp='onOp';//操作通知
SssDef.onXiaZhu='onXiaZhu';//下注通知
SssDef.onEvent='onEvent';//牌事件通知
SssDef.onProcess='onProcess';//进度通知 
SssDef.onSyncData='onSyncData';//同步数据
SssDef.onDeposit='onDeposit';//托管
SssDef.onGmOp='onGmOp';//gm操作通知

SssDef.op_cfg={}
SssDef.op_cfg[SssDef.event_xiazhu]=SssDef.op_xiazhu;//下注
SssDef.op_cfg[SssDef.event_peipai]=SssDef.op_peipai;//配牌
//扑克类型
SssDef.CT_INVALID=						    0;								//错误类型
SssDef.CT_SINGLE=						    1;								//单牌类型
SssDef.CT_ONE_DOUBLE=					    2;								//只有一对
SssDef.CT_FIVE_TWO_DOUBLE=				    3;								//两对牌型
SssDef.CT_THREE=						    4;								//三张牌型
SssDef.CT_FIVE_MIXED_FLUSH_NO_A=		    5;								//没A杂顺  34567
SssDef.CT_FIVE_MIXED_FLUSH_FIRST_A=		    6;								//A在前顺子  12345
SssDef.CT_FIVE_MIXED_FLUSH_BACK_A=		    7;								//A在后顺子  10 11
SssDef.CT_FIVE_FLUSH=					    8;								//同花五牌
SssDef.CT_FIVE_THREE_DEOUBLE=			    9;								//三条一对
SssDef.CT_FIVE_FOUR_ONE=				    15;								//四带一张
SssDef.CT_FIVE_STRAIGHT_FLUSH_NO_A=		    16;								//没A同花顺
SssDef.CT_FIVE_STRAIGHT_FLUSH_FIRST_A=	    17;								//A在前同花顺
SssDef.CT_FIVE_STRAIGHT_FLUSH_BACK_A=	    18;								//A在后同花顺
SssDef.CT_FIVE_BOMB=					    44;								//五同类型
SssDef.CT_FIVE_MID_THREE_DEOUBLE=		    100;							//中墩葫芦
//特殊牌型
SssDef.CT_THIRTEEN_FLUSH=                   526;                              //同花大菠萝,清龙                 （同一花色，A~K各一张牌）
SssDef.CT_THIRTEEN=                         425;                              //大菠萝，一条龙                      （A~K各一张牌）
SssDef.CT_FOUR_THREESAME=                   424;                              //四套冲三：                            四组三条+单牌
SssDef.CT_THREE_BOMB=                       423;                              //三炸弹，三分天下                 （三组铁支+单牌）
SssDef.CT_TWELVE_KING=                      322;                              //十二皇族，                      （十三张牌均为A、K、Q、J）
SssDef.CT_THREE_STRAIGHTFLUSH=              321;                              //三同花顺，                     （中道，尾道均为同花顺，头道为三张相同花色且连续的牌）
SssDef.CT_ALL_BIG=                          220;                              //全大：                               十三张牌在（8、9、10、J、Q、K、A）的范围
SssDef.CT_ALL_SMALL=                        219;                              //全小：                              十三张牌在（2、3、4、5、6、7、8）的范围
SssDef.CT_SAME_COLOR=                       218;                              //凑一色：                             十三张牌全部为红色或者黑色
SssDef.CT_FIVEPAIR_THREE=                   217;                              //五对冲三，                            五个对子+三条
SssDef.CT_SIXPAIR=                          216;                              //六对半，报道六队半，                  （六个对子+任意单牌）
SssDef.CT_THREE_FLUSH=                      215;                              //三同花，报道三同花
SssDef.CT_THREE_STRAIGHT=                   214;                              //三顺子，三顺子

SssDef.LX_ONEPARE=                          13;                              //一对
SssDef.LX_TWOPARE=                          14;                              //两对
SssDef.LX_THREESAME=                        15;                              //三条
SssDef.LX_STRAIGHT=                         16;                              //顺子
SssDef.LX_FLUSH=                            17;                              //同花
SssDef.LX_GOURD=                            18;                              //葫芦
SssDef.LX_FOURSAME=                         19;                              //铁支
SssDef.LX_STRAIGHTFLUSH=                    20;                              //同花顺
//数值掩码
SssDef.CARD_MASK_COLOR=				        0xF0;							//花色掩码
SssDef.CARD_MASK_VALUE=				        0x0F;							//数值掩码
SssDef.CARD_DW=						        16;                                 //大王
SssDef.CARD_XW=						        15;                                 //小王
//扑克数目
SssDef.CARD_COUNT=						    54;								//扑克数目

SssDef.enDescend=0;															//降序类型
SssDef.enAscend=1;																//升序类型
SssDef.enColor=2;																	//花色类型

SssDef.cardTypeNames={};
SssDef.cardTypeNames[SssDef.CT_SINGLE]= 1;
SssDef.cardTypeNames[SssDef.CT_ONE_DOUBLE] = 2;
SssDef.cardTypeNames[SssDef.CT_FIVE_TWO_DOUBLE] = 3;
SssDef.cardTypeNames[SssDef.CT_THREE] = 4;
SssDef.cardTypeNames[SssDef.CT_FIVE_MIXED_FLUSH_NO_A] = 5;
SssDef.cardTypeNames[SssDef.CT_FIVE_MIXED_FLUSH_FIRST_A] = 5;
SssDef.cardTypeNames[SssDef.CT_FIVE_MIXED_FLUSH_BACK_A] = 5;
SssDef.cardTypeNames[SssDef.CT_FIVE_FLUSH] = 8;
SssDef.cardTypeNames[SssDef.CT_FIVE_THREE_DEOUBLE] = 9;
SssDef.cardTypeNames[SssDef.CT_FIVE_FOUR_ONE] = 10;
SssDef.cardTypeNames[SssDef.CT_FIVE_STRAIGHT_FLUSH_NO_A] = 11;
SssDef.cardTypeNames[SssDef.CT_FIVE_STRAIGHT_FLUSH_FIRST_A] = 11;
SssDef.cardTypeNames[SssDef.CT_FIVE_STRAIGHT_FLUSH_BACK_A] = 11;
SssDef.cardTypeNames[SssDef.CT_FIVE_BOMB] = 44;

SssDef.specialCardNames = {};
SssDef.specialCardNames[SssDef.CT_THIRTEEN_FLUSH] = '清龙';
SssDef.specialCardNames[SssDef.CT_THIRTEEN] = '一条龙';
SssDef.specialCardNames[SssDef.CT_FOUR_THREESAME] = '四套三条';
SssDef.specialCardNames[SssDef.CT_THREE_BOMB] = '三分天下';
SssDef.specialCardNames[SssDef.CT_TWELVE_KING] = '十二皇族';
SssDef.specialCardNames[SssDef.CT_THREE_STRAIGHTFLUSH] = '三同花顺';
SssDef.specialCardNames[SssDef.CT_ALL_BIG] = '全大';
SssDef.specialCardNames[SssDef.CT_ALL_SMALL] = '全小';
SssDef.specialCardNames[SssDef.CT_SAME_COLOR] = '凑一色';
SssDef.specialCardNames[SssDef.CT_FIVEPAIR_THREE] = '五对三条';
SssDef.specialCardNames[SssDef.CT_SIXPAIR] = '六对半';
SssDef.specialCardNames[SssDef.CT_THREE_FLUSH] = '三同花';
SssDef.specialCardNames[SssDef.CT_THREE_STRAIGHT] = '三顺子';
//大菠萝座位信息配置
SssDef.seatCfg = {
    2: [
        {seatPos:[-500, -270], seatType:1, cardPos:[0, -200], cardScale:1.5},
        {seatPos:[-200, 270], seatType:1, cardPos:[0, 200], cardScale:1.5}
    ],
    3: [
        {seatPos:[-500, -270], seatType:1, cardPos:[0, -200], cardScale:1.5},
        {seatPos:[500, 150], seatType:1, cardPos:[300, 150], cardScale:1.5},
        {seatPos:[-500, 150], seatType:1, cardPos:[-300, 150], cardScale:1.5}
    ],
    4: [
        {seatPos:[-500, -270], seatType:1, cardPos:[0, -200], cardScale:1.5},
        {seatPos:[590, 0], seatType:1, cardPos:[380, 0], cardScale:1.5},
        {seatPos:[-200, 270], seatType:1, cardPos:[0, 200], cardScale:1.5},
        {seatPos:[-590, 0], seatType:1, cardPos:[-380, 0], cardScale:1.5}
    ],
    5: [
        {seatPos:[-500, -270], seatType:1, cardPos:[0, -200], cardScale:1.5},
        {seatPos:[590, 0], seatType:1, cardPos:[400, 0], cardScale:1.5},
        {seatPos:[370, 270], seatType:1, cardPos:[170, 200], cardScale:1.5},
        {seatPos:[-370, 270], seatType:1, cardPos:[-170, 200], cardScale:1.5},
        {seatPos:[-590, 0], seatType:1, cardPos:[-400, 0], cardScale:1.5}
    ],
    6: [
        {seatPos:[-500, -270], seatType:1, cardPos:[-170, -200], cardScale:1.5},
        {seatPos:[370, -240], seatType:1, cardPos:[170, -200], cardScale:1.5},
        {seatPos:[590, 0], seatType:1, cardPos:[400, 0], cardScale:1.5},
        {seatPos:[370, 270], seatType:1, cardPos:[170, 200], cardScale:1.5},
        {seatPos:[-370, 270], seatType:1, cardPos:[-170, 200], cardScale:1.5},
        {seatPos:[-590, 0], seatType:1, cardPos:[-400, 0], cardScale:1.5}
    ],
    7: [
        {seatPos:[-490, -300], seatType:0, cardPos:[0, -196], cardScale:1.5},
        {seatPos:[580, -87], seatType:1, cardPos:[430, -77], cardScale:1},
        {seatPos:[580, 127], seatType:1, cardPos:[430, 147], cardScale:1},
        {seatPos:[208, 300], seatType:0, cardPos:[208, 150], cardScale:1},
        {seatPos:[-208, 300], seatType:0, cardPos:[-208, 150], cardScale:1},
        {seatPos:[-580, 127], seatType:1, cardPos:[-430, 147], cardScale:1},
        {seatPos:[-580, -87], seatType:1, cardPos:[-430, -77], cardScale:1}
    ],
    8: [
        {seatPos:[-490, -300], seatType:0, cardPos:[-175, -196], cardScale:1.5},
        {seatPos:[253, -300], seatType:0, cardPos:[244, -150], cardScale:1},
        {seatPos:[580, -87], seatType:1, cardPos:[430, -77], cardScale:1},
        {seatPos:[580, 127], seatType:1, cardPos:[430, 147], cardScale:1},
        {seatPos:[208, 300], seatType:0, cardPos:[208, 150], cardScale:1},
        {seatPos:[-208, 300], seatType:0, cardPos:[-208, 150], cardScale:1},
        {seatPos:[-580, 127], seatType:1, cardPos:[-430, 147], cardScale:1},
        {seatPos:[-580, -87], seatType:1, cardPos:[-430, -77], cardScale:1}
    ],
    9: [
        {seatPos:[-490, -300], seatType:0, cardPos:[-175, -196], cardScale:1.5},
        {seatPos:[253, -300], seatType:0, cardPos:[244, -150], cardScale:1},
        {seatPos:[580, -87], seatType:1, cardPos:[430, -77], cardScale:1},
        {seatPos:[580, 127], seatType:1, cardPos:[430, 147], cardScale:1},
        {seatPos:[253, 300], seatType:0, cardPos:[244, 150], cardScale:1},
        {seatPos:[0, 300], seatType:0, cardPos:[0, 150], cardScale:1},
        {seatPos:[-253, 300], seatType:0, cardPos:[-244, 150], cardScale:1},
        {seatPos:[-580, 127], seatType:1, cardPos:[-430, 147], cardScale:1},
        {seatPos:[-580, -87], seatType:1, cardPos:[-430, -77], cardScale:1}
    ],
    10: [
        {seatPos:[-253, -300], seatType:0, cardPos:[-244, -150], cardScale:1},
        {seatPos:[0, -300], seatType:0, cardPos:[0, -150], cardScale:1},
        {seatPos:[253, -300], seatType:0, cardPos:[244, -150], cardScale:1},
        {seatPos:[580, -87], seatType:1, cardPos:[430, -77], cardScale:1},
        {seatPos:[580, 127], seatType:1, cardPos:[430, 147], cardScale:1},
        {seatPos:[253, 300], seatType:0, cardPos:[244, 150], cardScale:1},
        {seatPos:[0, 300], seatType:0, cardPos:[0, 150], cardScale:1},
        {seatPos:[-253, 300], seatType:0, cardPos:[-244, 150], cardScale:1},
        {seatPos:[-580, 127], seatType:1, cardPos:[-430, 147], cardScale:1},
        {seatPos:[-580, -87], seatType:1, cardPos:[-430, -77], cardScale:1}
    ]
};

SssDef.chineseNumber = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
SssDef.cardColor = ["方块", "草花", "红桃", "黑桃"];
SssDef.cardNumber = ["", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export const SssDef = SssDef;