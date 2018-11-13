 
import BaseMgr from "../../../Plat/Libs/BaseMgr"; 
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import UserMgr from "../../../Plat/GameMgrs/UserMgr";
import GameAudioCfg from "../../../Plat/CfgMgrs/GameAudioCfg";
import MpnnConst from "../BullMgr/MpnnConst";

//牛牛结果的音频字典
let resultAudioDic ={
    0:'niu0',
    1:'niu1',
    2:'niu2',
    3:'niu3',
    4:'niu4',
    5:'niu5',
    6:'niu6',
    7:'niu7',
    8:'niu8',
    9:'niu9',
    10:'niu10',
    12:'niu0',      //顺子
    13:'niu0',      //同花
    14:'niu0',      //葫芦
    15:'niu13',      //炸弹
    17:'niu12',      //五花
    18:'niu11',      //五小牛

}
let opaudiodic={
    
};
let BGMName = "backmusic";
//流程声音
let processaudiodic={};
processaudiodic[MpnnConst.process.start]='audio_start';     //开始
processaudiodic['onPrepare'] = "audio_ready";               //准备
processaudiodic[MpnnConst.process.giveCards]='audio_fapai'; //准备完毕，发牌
processaudiodic[MpnnConst.process.settle]='audio_win';      //结算
//与服务器段已知的牌字典
export default class MpnnAudio extends BaseMgr
{    
   //单例
   private static _instance:MpnnAudio;
   public static getInstance ():MpnnAudio{
       if(!this._instance){
           this._instance = new MpnnAudio();
       }
       return this._instance;
   }
    constructor()   
    {
        super();
    }      
    destroy(){
        GameAudioCfg.getInstance().stopbackgroudMusic();
        super.destroy();
        MpnnAudio._instance=null;
        delete MpnnAudio._instance;
    }  
    
    uncacheAll(){

    }
    playOpAudio(sex,op)
    {
      
    }
    //播放结果语音
    playResultAudio(sex,resultType)
    {
        let type = parseInt(resultType);
        let audiotag=resultAudioDic[type]; 
        GameAudioCfg.getInstance().play(audiotag,sex);
    }
      /**
     * 播放背景音乐
     * @api public
     */
    public playBGM () {
        GameAudioCfg.getInstance().playBGM(BGMName);
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
  
}
 
 


 
 