//牛牛的定义

export default {
    //游戏玩法分类
    gameType:{
        normal:1,                       //普通
        grabDealer:2,                   //抢庄
    },

    //客户端通知事件
    clientEvent:{
        onInitRoom_Mpnn:"onInitRoom_mpnn",//当游戏开始的时候
        onStart:"onStart_mpnn",//当游戏开始的时候
        onGiveCards:"onGiveCards_mpnn",//操作通知
        onProcess:"onProcess_mpnn",//进度通知
        onSettle:"onSettle_mpnn",//同步数据
        onTanPai:"onTanPai_mpnn", //有人摊牌
        onSyncData:"onSyncData_mpnn", //断线重连
        onMidEnter:"onMidEnter_mpnn",//中途加入
        //明牌相关
        onChooseGrab:"onChooseGrab",//有人抢庄
        onConfirmGrab:"onConfirmGrab",//确认庄家
        onChooseChip:"onChooseChip",//有闲家下注
        onChipInfo:"onChipInfo",//下注相关的信息
    },
    //进度
    process:{
        start:1,            //开始游戏
        giveCards:2,        //发牌（并入抢庄）
        chooseChip:3,       //闲家选择下注
        calculate:4,        //算牌时间
        settle:5,           //结算
    },
    //客户端操作事件
    oprEvent:{
        oprTanPai:1,
        oprChooseGrab:2,//选择是否抢庄
        oprChooseChip:3,//选择下注的筹码值
        oprBuyChip:4,//闲家买码
        oprTestStart:11,//test
        oprTestCards:12,//test
    },
    config:{
        bigCardOffWRate: 1.2,            //大张卡牌，牌间距占牌本身的比例
        minCardOffWRate:0.4,            //小张卡牌，牌间距占牌本身的比例
        maxGroupCardsNum:5,             //一组手牌最大数量
        cardIntervalTime:0.1,           //发牌间隔
        cardMoveTime:0.25,              //卡牌移动的时间
    },
    //称号枚举
    title:{
        nothing:0,
        winer:1,                        //大赢家
        loser:2,                        //慈善家
        maxNiuniu:3,                    //牛牛次数最多
    }
}

// OX_VALUE0: 0,									//混合牌型
// OX_THREE_SAME: 11,                            //三条：有三张相同点数的牌；（3倍）
// OX_ORDER_NUMBER: 12,                           //顺子：五张牌是顺子，最小的顺子12345，最大的为910JQK；（3倍）
// OX_FIVE_SAME_FLOWER: 13,                       //同花：五张牌花色一样；（3倍）
// OX_THREE_SAME_TWAIN: 14,                       //葫芦：三张相同点数的牌+一对；（3倍）
// OX_FOUR_SAME: 15,								//炸弹：有4张相同点数的牌；（4倍）
// OX_STRAIGHT_FLUSH: 16,                          //同花顺：五张牌是顺子且是同一种花色；（4倍）
// OX_FIVE_KING: 17,								//五花：五张牌都是KQJ；（5倍）
// OX_FIVE_CALVES: 18								//五小牛：5张牌都小于5点且加起来不超过10；（5倍）