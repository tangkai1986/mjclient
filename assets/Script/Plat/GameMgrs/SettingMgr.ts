import BaseMgr from "../Libs/BaseMgr";
import BetMgr from "./BetMgr";
import LocalStorage from "../Libs/LocalStorage";

 
export default class SettingMgr extends BaseMgr{
    controlInfo:any = {}
    notifyInfo:any = {}
    musicInfo:any = {}
    defaultInfo:any = {}
    routes:{} = null
    isPlaza = true;
    //====== 
    uid:any = null 
    constructor (){
        super();
        this.controlInfo = {
            bMjClick:true,
            bMjDrag:true,
            bSssAutoMate:true,
        }
        this.notifyInfo = {
            bMatchAD : false,
            bMatchBegin : true,
            bClubMatchSignUp : true,
            bClubMatchInvite : false,
        }
        this.musicInfo = {
            bMusicSwitch:true,
            musicVolume:20,
            bEffectSwitch:true,
            effectVolume:50,
            bYySwitch:true,
            yyVolume:60,
            bTipSwitch:true,
            bTopolectSwitch:false,
        }
        if(LocalStorage.getInstance().getControlInfoCfg()){
            this.controlInfo = LocalStorage.getInstance().getControlInfoCfg().controlInfo;
            this.notifyInfo = LocalStorage.getInstance().getControlInfoCfg().notifyInfo;
            this.musicInfo = LocalStorage.getInstance().getControlInfoCfg().musicInfo;
        }
        this.routes={ 
        }
    }
    getControlInfo(){
        if(LocalStorage.getInstance().getControlInfoCfg()){
            let setting = LocalStorage.getInstance().getControlInfoCfg();
            return setting.controlInfo;
        }
        return this.controlInfo;
    }
    getNotifyInfo(){
        if(LocalStorage.getInstance().getControlInfoCfg()){
            let setting = LocalStorage.getInstance().getControlInfoCfg();
            return setting.notifyInfo;
        }
        return this.notifyInfo;
    }
    getMusicInfo(){
        if(LocalStorage.getInstance().getControlInfoCfg()){
            let setting = LocalStorage.getInstance().getControlInfoCfg();
            return setting.musicInfo;
        }
        return this.musicInfo;
    }    
    setProperty (value, PropertyName, childProName) {
    	if (isNaN(value)) return //console.log("value 不能为空")
    	if (!PropertyName) return //console.log("PropertyName 不能为空")
    	if (childProName) {
    		this[PropertyName][childProName] = value
    	} else {
			this[PropertyName] = value
        }
        let setting ={};
        setting.controlInfo = this.controlInfo;
        setting.notifyInfo = this.notifyInfo;
        setting.musicInfo = this.musicInfo;
        LocalStorage.getInstance().setControlInfoCfg(setting);
    }
    getGameID()
    {
        return BetMgr.getInstance().getGameId();
    }
    setIsPlaza(name){
        this.isPlaza = name;
    }
    getIsPlaza(){
        return this.isPlaza;
    }
 
    //单例处理
    private static _instance:SettingMgr;
    public static getInstance ():SettingMgr{
        if(!this._instance){
            this._instance = new SettingMgr();
        }
        return this._instance;
    }
}