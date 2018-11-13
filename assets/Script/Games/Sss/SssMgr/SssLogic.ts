import BaseMgr from "../../../Plat/Libs/BaseMgr";
import UserMgr from "../../../Plat/GameMgrs/UserMgr";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import { SssDef } from "./SssDef";
import SssResMgr from "./SssResMgr";
import GEventDef from "../../../Plat/GameMgrs/GEventDef";
import SssCards from "./SssCards";

export default class SssLogic extends BaseMgr {
    routes = {};                    // 网络事件列表
    roomInfo = RoomMgr.getInstance().getRoomInfo();// 房间信息
    roomValue = RoomMgr.getInstance().getFangKaCfg();// 房间配置项
    mySeatId = RoomMgr.getInstance().getMySeatId();// 本家的位置ID
    myHandCard = [];                // 自己的手牌
    curSpecialType = null;          // 当前特殊牌类型
    curSpecialCard = [[], [], []];    // 特殊牌型的排列
    specialCard = [];               // 比牌阶段全部特殊牌型数据
    finalCardList = {};             // 摆好的最终牌列表
    cardTypeList = {};              // 所有玩家的牌型
    scoreList = {};                 // 所有玩家的墩分
    totalScoreList = {};                // 所有玩家的最后总分
    dunSort = [[], [], []];
    daqiangIndex = [];
    quanleida = {};
    quanleidaIndex = null;
    maCard = null;
    maCardCount = null;
    maCardMap = {};
    dissRoom = false;               // 房间解散状态
    gameHide = false;               // 游戏前后台切换状态
    nextReadyTime = 0;                // 收到settle后比牌结束的时间戳
    timeDiff = 0;                     // 客户端与服务端的时间差
    curTime = 0;
    movieFinisTO = null;              // setTimeout对象, 前后台切换需要清理
    bipaiTO = null;                   // setTimeout对象, 前后台切换需要清理
    specialTO = null;                 // setTimeout对象, 前后台切换需要清理
    daqiangTO = null;                 // setTimeout对象, 前后台切换需要清理
    resendMovieFinishTO = null;       // setTimeout对象, 前后台切换需要清理
    bipaistate = false;               // 比牌状态
    curProcess = 0;                   // 客户端当前流程
    settlePlayerNum = 0;              // 参与结算的人数
    constructor() {
        super();
        this.routes = {
            "onProcess": this.onProcess,
            "onStartGame": this.onStartGame,
            "onGameSettle": this.onGameSettle,
            "onSyncData": this.onSyncData,
            "onDissolutionRoom": this.onDissolutionRoom,
            "onGameFinished": this.onGameFinished
        };
        G_FRAME.globalEmitter.on("EnterBackground", this.EnterBackground.bind(this), this);
        G_FRAME.globalEmitter.on("EnterForeground", this.EnterForeground.bind(this), this);
    }
    //全局时间回调
    EnterBackground() {
        this.gameHide = true;
        this.bipaistate = false;
    }
    EnterForeground() {
        // 理论上切回到前台要把所有 setTimeout, animation, action, schedule 全部清除掉
        this.clearAllTimeout()
    }
    clearAllTimeout() {
        if (this.movieFinisTO !== null) clearTimeout(this.movieFinisTO);
        if (this.bipaiTO !== null) clearTimeout(this.bipaiTO);
        if (this.specialTO !== null) clearTimeout(this.specialTO);
        if (this.daqiangTO !== null) clearTimeout(this.daqiangTO);
        if (this.resendMovieFinishTO !== null) clearTimeout(this.resendMovieFinishTO);
    }
    //end
    //网络消息回调
    onProcess(msg) {
        if (msg.process == SssDef.process_peipai || msg.process == SssDef.process_dengdaijiesuan) {
            // 掉线回来如果是配牌或则是等待结算状态, 应该把这个值设回 false
            this.gameHide = false;
        }
        this.curProcess = msg.process;
        if (msg.process == SssDef.process_fapai) {
            this.mySeatId = msg.seatid;
            this.myHandCard = msg.handcard;
            this.curSpecialType = msg.teshupaixing;
            this.curSpecialCard = msg.SpecialCard;
            this.maCard = msg.maCard;
            this.maCardCount = msg.maCardCount;
            // 发牌的时候进行服务端时间同步, 计算出时间差
            let serverCurTime = msg.pushCardTime.substring(4);
            let clinetCurTime = Date.now().toString().substring(4);
            this.timeDiff = clinetCurTime - serverCurTime;
        }
        if (msg.process == SssDef.process_cheatcheck) {
            // 作弊检测的时候进行服务端时间同步, 计算出时间差
            let serverCurTime = msg.serverCurTime.substring(4);
            let clinetCurTime = Date.now().toString().substring(4);
            this.timeDiff = clinetCurTime - serverCurTime;
        }
    }

    onStartGame() {
        // 每个界面的状态自己管理
        this.gameHide = false;
    }

    clearSettleData() {
        this.finalCardList = {};
        this.scoreList = {};
        this.cardTypeList = {};
        this.daqiangIndex = [];
        this.specialCard = [];
        this.quanleida = {};
        this.quanleidaIndex = null;
        // 前后台切换造成比牌变慢的罪魁祸首
        for (let i = 0; i < 3; ++i) {
            this.dunSort[i] = [];
        }
        this.bipaistate = false;
    }

    onGameFinished(msg) {
        this.clearAllTimeout();
        this.clear();
        if (RoomMgr.getInstance().isBunchFinish()) {
            RoomMgr.getInstance().showFinalSettle();
        } else if (!this.dissRoom) {
            //console.log("十三水当前局结束");
            this.gemit(GEventDef.sss_roundEnd);
        }
    }

    onGameSettle(msg) {
        //console.log("十三水gamesettle", msg);
        RoomMgr.getInstance().bGameIsStarted = false;
        RoomMgr.getInstance().preparemap = {};
        RoomMgr.getInstance().roundindex += RoomMgr.getInstance().roundindex == 0 ? 1 : 0;
        // 收到settle后为了安全起见把所有timeout清除掉
        this.clearAllTimeout();
        this.updateSettleData(msg.wanjiasettle);
        // 收到 msg 后, 全部比牌完的时间戳
        this.nextReadyTime = parseInt(msg.settleTime.substring(4)) + this.timeDiff + this.getAnimTime();
    }

    updateSettleData(wanjiasettle) {
        this.clearSettleData();
        let upPierArr = [], midPierArr = [], downPierArr = [];
        for (let key in wanjiasettle) {
            this.finalCardList[key] = wanjiasettle[key].handcards;
            this.cardTypeList[key] = wanjiasettle[key].allduntype;
            this.scoreList[key] = wanjiasettle[key].alldunfen;
            if (JSON.stringify(wanjiasettle[key].daqiangfen) != "{}") {
                for (let seatid in wanjiasettle[key].daqiangfen) {
                    this.daqiangIndex.push({
                        from: parseInt(key),
                        target: parseInt(seatid),
                        score: wanjiasettle[key].daqiangfen[seatid]
                    });
                }
            }
            if (wanjiasettle[key].isteshupaixing > 0) {
                this.specialCard.push({
                    seatid: parseInt(key),
                    cardType: wanjiasettle[key].isteshupaixing,
                    cardTypeScore: wanjiasettle[key].cardtypefen,
                    totalScore: wanjiasettle[key].teshupaixingyingfen
                });
            } else {
                upPierArr.push({ seatid: parseInt(key), cards: wanjiasettle[key].handcards[0] });
                midPierArr.push({ seatid: parseInt(key), cards: wanjiasettle[key].handcards[1] });
                downPierArr.push({ seatid: parseInt(key), cards: wanjiasettle[key].handcards[2] });
            }
            if (wanjiasettle[key].quanleidafen != 0) {
                this.quanleida[key] = wanjiasettle[key].quanleidafen;
                if (wanjiasettle[key].quanleidafen > 0) {
                    this.quanleidaIndex = parseInt(key);
                }
            }
            this.maCardMap[key] = wanjiasettle[key].maCardCount;
        }
        this.sortBipaiIndex(upPierArr, midPierArr, downPierArr);
        this.sortDaqiangIndex();
    }

    getNextReadyTime() {
        //console.log("下次自动准备时间戳", this.nextReadyTime)
        return this.nextReadyTime;
    }

    onSyncData(msg) {
        //console.log("十三大水数据恢复", msg);
        this.myHandCard = msg.handcard;
        this.mySeatId = RoomMgr.getInstance().getMySeatId();
        this.finalCardList[this.mySeatId] = msg.settleCard;
        this.timeDiff = Date.now() - msg.ServerTime;
        if (msg.process == SssDef.process_peipai || msg.process == SssDef.process_dengdaijiesuan) {
            // 掉线回来如果是配牌或则是等待结算状态, 应该把这个值设回 false
            this.gameHide = false;
        }
        if (RoomMgr.getInstance().isBunchFinish()) {
            return RoomMgr.getInstance().showFinalSettle();
        }
        if (msg.process == SssDef.process_peipai) {
            if (msg.state == SssDef.state_peipai) {
                if (!cc.director.getScene().getChildByName("Prefab_SssSetCards")) {
                    this.mySeatId = msg.seatid;
                    this.myHandCard = msg.handcard;
                    this.curSpecialType = msg.teshupaixing;
                    this.curSpecialCard = msg.SpecialCard;
                    this.maCard = msg.maCard;
                    this.maCardCount = msg.maCardCount;
                }
            }
        } else if (msg.process == SssDef.process_gamesettle) {
            RoomMgr.getInstance().bGameIsStarted = false;
            RoomMgr.getInstance().preparemap = {};
            RoomMgr.getInstance().roundindex += RoomMgr.getInstance().roundindex == 0 ? 1 : 0;
            this.curTime = Date.now() - this.timeDiff;
            this.nextReadyTime = (msg.roundend_time + this.timeDiff).toString().substring(4);
            if (msg.roundend_time > this.curTime) {
                this.clearAllTimeout();
                this.updateSettleData(msg.settle_data.wanjiasettle);
                this.bipaistate = true;
                this.settlePlayerNum = Object.keys(msg.settle_data.wanjiasettle).length;
                let restTime = this.getAnimTime() - (msg.roundend_time - this.curTime),
                    bipaiTime = 1350 * this.settlePlayerNum,
                    daqiangTime = bipaiTime + 750 * this.daqiangIndex.length;
                if (restTime > 0 && restTime <= bipaiTime) {
                    this.recoveryBipaiAnim(restTime);
                } else if (restTime > bipaiTime && restTime <= daqiangTime) {
                    this.recoveryDaqiangAnim(restTime - bipaiTime);
                } else if (restTime > daqiangTime && this.getAnimTime() - restTime > 250) {
                    this.recoverySpecialCardAnim(restTime - daqiangTime);
                }
            }
        }
    }

    recoveryBipaiAnim(restTime) {
        for (let i = 1; i < 4; ++i) {
            if (restTime <= i * 450 * this.settlePlayerNum) {
                this.send_bipai(i);
                break;
            }
        }
    }

    recoveryDaqiangAnim(restTime) {
        let index = Math.ceil(restTime / 750);
        this.send_daqiang(index);
    }

    recoverySpecialCardAnim(restTime) {
        let index = Math.ceil(restTime / 3000);
        this.send_specialCard(index);
    }

    onDissolutionRoom(msg) {
        this.dissRoom = msg.result;
    }

    //end
    //发送网络消息接口
    send_peipai(data, isteshupaixing) {
        let msg = {
            'data': data,
            'isteshu': isteshupaixing,
            'allcard': this.myHandCard,
            'event': SssDef.event_peipai
        }
        console.error("大菠萝 出牌 数据", msg);
        this.finalCardList[this.mySeatId] = data;
        this.send_msg('room.roomHandler.playerOp', msg);
    }

    send_xipai() {
        this.send_msg("room.roomHandler.xiPai");
    }
    //end
    getAnimTime() {
        let time = 0;
        let specialTime = () => {
            if (this.specialCard.length != 0) {
                time += (this.specialCard.length * 3000 + 1000)
            } else if (JSON.stringify(this.quanleida) != '{}') {
                time += 3000;
            }
        };
        let daqianTime = (index) => {
            if (index >= this.daqiangIndex.length) {
                time += 250;
                return specialTime();
            }
            time += 750;
            daqianTime(index + 1)
        };
        let ordinaryTime = (index) => {
            if (index >= 3 || this.dunSort[0].length == 0) {
                return daqianTime(0)
            }
            time += (450 * (this.dunSort[0].length + 1));
            ordinaryTime(index + 1)
        };
        ordinaryTime(0);
        return time + 250;
    }
    //发送全局消息
    send_bipai(index) {
        if (index >= 3 || this.dunSort[0].length == 0) {
            this.send_daqiang(0);
            return;
        }
        this.gemit(GEventDef.sss_startBipai, { index: index, time: 450 * this.dunSort[0].length });
        this.bipaiTO = setTimeout(() => {
            this.send_bipai(index + 1);
        }, 450 * (this.dunSort[0].length + 1));
    }

    send_daqiang(index) {
        if (index >= this.daqiangIndex.length) {
            this.specialTO = setTimeout(() => {
                this.send_specialCard();
            }, 250);
            return;
        }
        this.gemit(GEventDef.sss_startDaqiang, this.daqiangIndex[index]);
        this.daqiangTO = setTimeout(() => {
            this.send_daqiang(index + 1);
        }, 750);
    }

    send_specialCard(start = 0) {
        if (this.specialCard.length != 0) {
            this.specialCard.sort((a, b) => {
                return a.cardType - b.cardType;
            });
            this.gemit(GEventDef.sss_specialCard, { data: this.specialCard, start: start });
        } else if (JSON.stringify(this.quanleida) != '{}') {
            this.gemit(GEventDef.sss_quanleida, this.quanleida);
        }
    }
    //end
    //数据的get和set接口
    getMyHandCard() {
        return this.myHandCard;
    }

    getCurSpecialType() {
        return this.curSpecialType
    }

    getCurSpecialCard() {
        return this.curSpecialCard
    }

    getFinalCard(seatid) {
        return this.finalCardList[seatid];
    }

    getCardType(seatid) {
        return this.cardTypeList[seatid];
    }

    getScore(seatid) {
        return this.scoreList[seatid];
    }

    getTotalScore(seatid) {
        return this.totalScoreList[seatid];
    }

    getDunSort(index) {
        return this.dunSort[index];
    }

    getRoomInfo() {
        return this.roomInfo;
    }

    getRoomValue() {
        return this.roomValue;
    }
    getMaCard() {
        return this.maCard;
    }

    getMaCardMap() {
        return this.maCardMap;
    }

    setBiPaiState(bool) {
        this.bipaistate = bool;
    }
    getBiPaiState() {
        return this.bipaistate;
    }
    //end
    sortBipaiIndex(upPierArr, midPierArr, downPierArr) {
        for (let i = 0; i < arguments.length; ++i) {
            let cardCount = i > 0 ? 5 : 3;
            arguments[i].sort((a, b) => {
                return SssCards.getInstance().CompareCard(a.cards, b.cards, cardCount, cardCount, false) ? -1 : 1;
            });
            for (let j = 0; j < arguments[i].length; ++j) {
                this.dunSort[i].push(arguments[i][j].seatid);
            }
        }
    }

    sortDaqiangIndex() {
        if (this.quanleidaIndex == null) return;
        let start = null, end = null;
        for (let i = 0; i < this.daqiangIndex.length; ++i) {
            if (this.daqiangIndex[i].from == this.quanleidaIndex && start == null) {
                start = i;
            }
            if (this.daqiangIndex[i].from != this.quanleidaIndex && start != null) {
                end = i;
                break;
            }
        }
        this.daqiangIndex.push(...this.daqiangIndex.splice(start, end - start));
    }

    clear() {
        // this.roomInfo = null;
        // this.roomValue = null;
        // this.mySeatId = null;
        this.myHandCard = [];
        this.finalCardList = {};
        this.scoreList = {};
        this.cardTypeList = {};
        this.daqiangIndex = [];
        this.specialCard = [];
        this.quanleida = {};
        this.quanleidaIndex = null;
        this.curSpecialType = null;
        for (let i = 0; i < 3; ++i) {
            this.curSpecialCard[i] = [];
        }
        for (let i = 0; i < 3; ++i) {
            this.dunSort[i] = [];
        }
        this.bipaistate = false;
    }

    destroy() {
        super.destroy();
        SssLogic._instance = null;
        delete SssLogic._instance;
    }
    //单例处理
    private static _instance: SssLogic;
    public static getInstance(): SssLogic {
        if (!this._instance) {
            this._instance = new SssLogic();
        }
        return this._instance;
    }
}