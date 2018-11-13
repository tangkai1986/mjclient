import BaseMgr from "../Libs/BaseMgr";  
import AudioCfg from "../CfgMgrs/AudioCfg";
 
import RoomMgr from "./RoomMgr";

export default class AudioMgr extends BaseMgr{
    public effectVolume = null;
    public musicVolume = null;
    public voiceVolume = null;
    isValidToRoute(){
        return RoomMgr.getInstance().getMySeatId()!=null; 
    }
    //单例处理
    constructor(){
        super();
        this.effectVolume = 1;
        this.musicVolume = 1;
        this.voiceVolume = 1;
    }

    setMusicVolume(volume){
        this.musicVolume = volume;        
    }
    getMusicVolume(){
        return this.musicVolume;
    }

    setEffectVolume(volume){
        this.effectVolume = volume;        
    }
    getEffectVolume(){
        return this.effectVolume;
    }

    setVoiceVolume(volume){
        this.voiceVolume = volume;        
    }
    getVoiceVolume(){
        return this.voiceVolume;
    }

    play(name)
    {
        AudioCfg.getInstance().play(name);
    }
    stopbackgroudMusic()
    {
        AudioCfg.getInstance().stopbackgroudMusic();
    }
    pausebackgroudMusic()
    {
        AudioCfg.getInstance().pausebackgroudMusic();
    }
    resumebackgroudMusic()
    {
        AudioCfg.getInstance().resumebackgroudMusic();
    }

    private static _instance:AudioMgr; 
    public static getInstance ():AudioMgr{
        if(!this._instance){
            this._instance = new AudioMgr();
        }
        return this._instance;
    }

}