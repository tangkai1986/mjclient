 
 
import BaseMgr from "../../Plat/Libs/BaseMgr";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";
import UserMgr from "../../Plat/GameMgrs/UserMgr";
import GameAudioCfg from "../../Plat/CfgMgrs/GameAudioCfg";
import { MahjongDef } from "./MahjongDef";
//麻将子的音频字典
let cardaudiodic={
    //万
    17:'yiwan',
    18:'erwan',
    19:'sanwan',
    20:'siwan',
    21:'wuwan',
    22:'liuwan',
    23:'qiwan',
    24:'bawan',
    25:'jiuwan',
    
    //条
    33:'yitiao',
    34:'ertiao',
    35:'santiao',
    36:'sitiao',
    37:'wutiao',
    38:'liutiao',
    39:'qitiao',
    40:'batiao',
    41:'jiutiao',

    //筒
    49:'yitong',
    50:'ertong',
    51:'santong',
    52:'sitong',
    53:'wutong',
    54:'liutong',
    55:'qitong',
    56:'batong',
    57:'jiutong',



    //其他
    65:'dongfeng',//东
    67:'nanfeng',//南  
    69:'xifeng',//西  
    71:'beifeng',//北    
    73:'hongzhong',//中   
    75:'facai',//发  
    77:'baiban',//白
}

//操作的声音字典
let opaudiodic={};
opaudiodic[MahjongDef.op_hu]='pinghu';
opaudiodic[MahjongDef.op_angang]='angang';
opaudiodic[MahjongDef.op_gang]='gang';
opaudiodic[MahjongDef.event_bugang]='gang';
opaudiodic[MahjongDef.op_peng]='peng';
opaudiodic[MahjongDef.op_chi]='chi';
opaudiodic[MahjongDef.op_zimo]='zimo'; 
opaudiodic[MahjongDef.op_sanjindao]='sanjindao'; 
opaudiodic[MahjongDef.op_qianggang_hu]='qiangganghu'; 
opaudiodic[MahjongDef.op_danyou]='youjin'; 
opaudiodic[MahjongDef.op_shuangyou]='shuangyou'; 
opaudiodic[MahjongDef.op_bazhanghua]='bazhanghua'; 
opaudiodic[MahjongDef.op_sanyou]='sanyou';
opaudiodic[MahjongDef.op_tianhu]='tianhu';
opaudiodic[MahjongDef.op_qiangjinhu]='youjin';
opaudiodic[MahjongDef.op_sijindao]='youjin';
opaudiodic[MahjongDef.op_wujindao]='youjin';
opaudiodic[MahjongDef.op_liujindao]='youjin';
opaudiodic[MahjongDef.op_gaibaoqiangjin]='shuangyou';

//流程声音
let processaudiodic={};
processaudiodic[MahjongDef.process_ready]='duijukaishi'; //对局开始
processaudiodic[MahjongDef.process_buhua]='buhua';   //补花
processaudiodic[MahjongDef.process_kaijin]='kaijin'; //开金
let BGMName = "yxbg";                             //背景音乐
let Clock = "Clock";                              //倒计时音效
let Dice = "dice";                                //摇骰子音效
let Down = "down";                                //出牌音效
let CardHover = "card_hover";                     //选牌音效
//与服务器段已知的牌字典
export default class MahjongAudio extends BaseMgr
{    
    //单例处理
    private  players= null;
    private  seatID= null;
    private static _instance:MahjongAudio;   
    public static getInstance ():MahjongAudio{
        if(!this._instance){
            this._instance = new MahjongAudio();
        }
        return this._instance;
    }
    constructor()   
    {
        super();
        this.routes={ 
            onProcess:this.onProcess,    
            onOp:this.onOp,  
            onSeatChange:this.onSeatChange, 
        } 
    }    
    //重写是否可以合法路由
    isValidToRoute(){
        return RoomMgr.getInstance().getMySeatId()!=null; 
    }  
    destroy(){
        GameAudioCfg.getInstance().stopbackgroudMusic();
        super.destroy();
        MahjongAudio._instance=null;
        delete MahjongAudio._instance;
    }  
    //玩家操作
    onOp(msg)
    {
        // body  
        //配置操作接收
        let event=msg.event; 
        let op=MahjongDef.op_cfg[event]
        let opdic={};   
        let uid=RoomMgr.getInstance().getUidBySeatId(msg.opseatid);
        this.seatID = msg.opseatid;
        let userinfo=UserMgr.getInstance().getUserById(uid);
        let sex=userinfo.sex;
        switch(op)
        {
            case MahjongDef.op_chupai:
            case MahjongDef.op_gaipai:
                this.playChuPaiAudio(sex,msg.card);
                this.playDown();
            break;
            case MahjongDef.op_chi:
            case MahjongDef.op_peng:
            case MahjongDef.op_gang:
            case MahjongDef.op_angang:
            case MahjongDef.op_bugang:
                this.playOpAudio(sex,op);//播放操作的声音
                this.playDown();
            break;
            default:
                this.playOpAudio(sex,op);//播放操作的声音
            break;
        }
    } 
    initPlayers(players)
    {
        this.players = players;
    }
    uncacheAll(){

    }
    playOpAudio(sex,op)
    {
        let audiotag=opaudiodic[op];
        if(this.players)
        {
            if(op==MahjongDef.op_hu ||op==MahjongDef.op_zimo){
                let hutype = this.players[this.seatID].getHuType();
                ////console.log("hutypeAudio",hutype);
                let name = null;
                switch(hutype)
                {
                    case MahjongDef.hutype_hunyise:
                        name = "hunyise";
                    break;
                    case MahjongDef.hutype_qingyise:
                        name = "qingyise";
                    break;   
                    case MahjongDef.hutype_jinque:
                        name = "jinque";
                    break;
                    case MahjongDef.hutype_jinlong:
                        name = "jinlong";
                    break;
                    default:
                        ////console.log("hutype不存在",hutype);
                }
                if(name){
                    GameAudioCfg.getInstance().play(name,sex);
                    return;
                }
            }
        }
        GameAudioCfg.getInstance().play(audiotag,sex);
    }
    playChuPaiAudio(sex,card)
    {
        ////console.log("playChuPaiAudio",sex,card);
        if(card==0)//金牌提示是否要特殊
        {
            //金牌1
            card = RoomMgr.getInstance().getLogic().getInstance().jin;
        }else if(card==1){
            //金牌2
            card = RoomMgr.getInstance().getLogic().getInstance().jin2;
        }
        ////console.log("playChuPaiAudio",sex,card);
        let audiotag=cardaudiodic[card];
        GameAudioCfg.getInstance().play(audiotag,sex);
    }
    /**
     * 播放出牌音乐
     * @api public
     */
    public playDown(){
        GameAudioCfg.getInstance().play(Down,1);
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
     * 播放倒计时音效
     * @api public
     */
    public playClock(){
        GameAudioCfg.getInstance().playGameProcessAudio(Clock,false);
    }
    /**
     * 播放摇骰子音效
     * @api public
     */
    public playDice(){
        GameAudioCfg.getInstance().playGameProcessAudio(Dice,false);
    }
    /**
     * 播放选牌音效
     * @api public
     */
    public playCardHover(){
        GameAudioCfg.getInstance().playGameProcessAudio(CardHover,false);
    }

    onProcess(msg)
    { 
        let process=msg.process;
        ////console.log("process",process);
        if(process == MahjongDef.process_buhua){
            GameAudioCfg.getInstance().play("buhua",UserMgr.getInstance().getMySex());
            return;
        }
        let audiotag=processaudiodic[process];        
        ////console.log("audiotag",audiotag);
        if(audiotag)
        {
            GameAudioCfg.getInstance().playGameProcessAudio(audiotag,false);
        }
    }
    onSeatChange(msg)
    {
        if (msg.needbupai&&msg.huaarr.length>0){
            GameAudioCfg.getInstance().play("buhua",UserMgr.getInstance().getMySex());
        }
    }
}
 
 


 
 