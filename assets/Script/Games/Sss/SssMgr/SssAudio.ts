import BaseMgr from "../../../Plat/Libs/BaseMgr";
import GameAudioCfg from "../../../Plat/CfgMgrs/GameAudioCfg";

//大菠萝普通牌型音效字典
let cardTypeDict = {
    1: "SAN_PAI",           // 乌龙
    2: "DUI_ZI",            // 对子
    3: "LIANG_DUI",         // 两对
    4: "SAN_TIAO",          // 三条
    5: "SHUN_ZI",           // 顺子
    8: "TONG_HUA",          // 同花
    9: "HU_LU",             // 葫芦
    10: "TIE_ZHI",          // 铁支
    11: "TONG_HUA_SHUN",    // 同花顺
    14: "CHONG_SAN",        // 冲三
    19: "ZHONG_DUN_HU_LU",  // 中墩葫芦
    44: "WU_TONG",          // 五同
};
//大菠萝特殊牌型音效字典
let specialCardTypeDict = {
    214:"SAN_SHUN_ZI",       //三顺子
    215:"SAN_TONG_HUA",      //三同花
    216:"LIU_DUI_BAN",       //六对半
    217:"5DUI_3TIAO",        //五对三条
    218:"CHOU_YI_SE",        //凑一色
    219:"QUAN_XIAO",         //全小
    220:"QUAN_DA",           //全大
    321:"SAN_TONG_HUA_SHUN", //三同花顺
    322:"12HUANG_ZU",        //十二皇族
    423:"SAN_FEN_TIAN_XIA",  //三分天下
    424:"4TAO_3TIAO",        //四套三条
    425:"YI_TIAO_LONG",      //一条龙
    526:"ZHI_ZUN_QING_LONG", //清龙
};
let gunDict = {
    gunReady: "GAME_GUNREADY",
    gun: "GAME_GUN"
};
let BGMName = "BK_MUSIC";
let GameStart = "GAME_START";
let Clock = "GAME_WARN";
let OutCard = "OUT_CARD";
let ChangeScore = "score";
let SpecialBGM = "teshupai";
let CompareCard = "start_compare";
let GameShuffle = "GAME_SHUFFLE";
let QuanLeiDa = "QUAN_LEI_DA";
let GameFaPai = "GAME_CARD";
let GamePeiPai = "throw";
let GameWin = "win";
let GameLose = "lose";
let processAudio = ["", "", "", "", ""];

//与服务器段已知的牌字典
export default class SssAudio extends BaseMgr
{    
    //单例处理
    private static _instance:SssAudio;
    public static getInstance ():SssAudio{
        if(!this._instance){
            this._instance = new SssAudio();
        }
        return this._instance;
    }
    constructor()   
    {
        super();
        this.routes={ 
            onProcess:this.onProcess,
            onStartGame:this.onStartGame,
        }
    }
    destroy(){
        GameAudioCfg.getInstance().stopbackgroudMusic();
        super.destroy();
        SssAudio._instance=null;
        delete SssAudio._instance;
    }
    uncacheAll(){

    }
    /**
     * 播放指定名称的游戏流程音频
     * @param {String} name
     * @param {Boolean} flag
     * @api private
     */
    private playGameProcessAudio (name, flag) {
        GameAudioCfg.getInstance().playGameProcessAudio(name, flag);
    }
    /**
     * 播放牌音效
     * @param {String} code  牌类型
     * @param {Number} type  0: 普通牌 1: 特殊牌
     * @api public
     */
    public playCardTypeAudio (code, type) {
        let cfg = type ? specialCardTypeDict : cardTypeDict;
        GameAudioCfg.getInstance().play(cfg[code.toString()], 1);
    }
    /**
     * 播放背景音乐
     * @api public
     */
    public playBGM () {
        GameAudioCfg.getInstance().playBGM(BGMName);
    }
    /**
     * 暂停背景音乐
     * @api public
     */
    public pauseBGM () {
        GameAudioCfg.getInstance().pausebackgroudMusic();
    }
    /**
     * 恢复背景音乐
     * @api public
     */
    public resumeBGM () {
        GameAudioCfg.getInstance().resumebackgroudMusic();
    }
    /**
     * 暂停游戏语音
     * @api public
     */
    public pauseGameYYAudio () {
        GameAudioCfg.getInstance().pauseGameYYAudio();
    }
    /**
     * 恢复游戏语音
     * @api public
     */
    public resumeGameYYAudio () {
        GameAudioCfg.getInstance().resumeGameYYAudio();
    }
    /**
     * 暂停游戏音效
     * @api public
     */
    public pauseGameProcessAudio () {
        GameAudioCfg.getInstance().pauseGameProcessAudio();
    }
    /**
     * 恢复游戏音效
     * @api public
     */
    public resumeGameProcessAudio () {
        GameAudioCfg.getInstance().resumeGameProcessAudio();
    }
    
    /**
     * 游戏流程音效
     * @param {Object} msg
     */
    onProcess(msg) {
        if (!processAudio[msg.process]) return;
        this.playGameProcessAudio(processAudio[msg.process], false);
    }
    /**
     * 游戏开始音效
     */
    onStartGame() {
        this.playGameProcessAudio(GameStart, false);
    }
    /**
     * 播放打枪音效
     * @api public
     */
    public playGun () {
        this.playGameProcessAudio(gunDict.gunReady, false);
        setTimeout(() => {
            this.playGameProcessAudio(gunDict.gun, false);
        }, 300)
    }
    /**
     * 出牌音效
     * @api public
     */
    public playOutCard () {
        this.playGameProcessAudio(OutCard, false);
    }

    /**
     * 分数变化音效
     */
    playChangeScore () {
        this.playGameProcessAudio(ChangeScore, false);
    }
    /**
     * 倒计时音效
     * @api public
     */
    public playClock () {
        this.playGameProcessAudio(Clock, false);
    }
    /**
     * 特殊牌bgm
     * @api public
     */
    public playSpecialBGM () {
        this.playGameProcessAudio(SpecialBGM, false);
    }
    /**
     * 开始比牌音效
     * @api public
     */
    public playStartCompare () {
        GameAudioCfg.getInstance().play(CompareCard, 1);
    }
    /**
     * 洗牌音效
     * @api public
     */
    public playXiPai () {
        this.playGameProcessAudio(GameShuffle, false);
    }
    /**
     * 全垒打
     * @api public
     */
    public playQuanLeiDa () {
        GameAudioCfg.getInstance().play(QuanLeiDa, 1);
    }
    /**
     * 发牌
     * @api public
     */
    public playGameFaPai () {
        this.playGameProcessAudio(GameFaPai, false);
    }
    /**
     * 上牌音效
     * @api public
     */
    public playGameAddToPier () {
        this.playGameProcessAudio(GamePeiPai, false);
    }
    /**
     * 比牌胜利音效
     * @api public
     */
    public playCompareWin () {
        this.playGameProcessAudio(GameWin, false);
    }
    /**
     * 比牌输掉音效
     * @api public
     */
    public playCompareLose () {
        this.playGameProcessAudio(GameLose, false);
    }

}
 
 


 
 
