//抢庄牛牛的定义

export default {
    //游戏玩法分类
    gameType:{
        normal:1,                       //普通
        grabDealer:2,                   //抢庄
    },
    //客户端通知事件
    clientEvent:{
        onInitRoom_qznn:"onInitRoom_qznn",//房间初始信息
        onStart:"onStart_qznn",//当游戏开始的时候
        onPeopleGrab:"onPeopleGrab_qznn",//玩家选择了抢或者不抢
        onConfirmDealer:"onConfirmDealer_qznn",//当确认庄家
        onPeopleChooseChip:"onPeopleChooseChip_qznn",//当闲家选择了筹码
        onGiveCards:"onGiveCards_qznn",//操作通知
        onProcess:"onProcess_qznn",//进度通知
        onSettle:"onSettle_qznn",//同步数据
        onTanPai:"onTanPai_qznn", //有人摊牌
    },
    //进度
    process:{
        start:1,            //开始游戏
        grabDealer:2,       //抢庄
        chooseChip:3,       //闲家选择筹码
        giveCards:4,        //发牌
        settle:5,           //结算
    },
    //客户端操作事件
    oprEvent:{
        oprTanPai:1,
        oprPrepare:2,//test 模拟准备
        oprGrabDealer:3,//选择抢庄或者不抢庄
        oprChooseChip:4,//闲家选择筹码
    },
    config:{
        bigCardOffWRate:0.4,            //大张卡牌，牌间距占牌本身的比例
        minCardOffWRate:0.4,            //小张卡牌，牌间距占牌本身的比例
        maxGroupCardsNum:5,             //一组手牌最大数量
        cardIntervalTime:0.1,           //发牌间隔
        cardMoveTime:0.25,              //卡牌移动的时间
    }
}