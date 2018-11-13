import BaseCfg from "../Libs/BaseCfg";

export default class UserDefaultCfg extends BaseCfg{
  
    //单例处理
	private cfgPath=null;  
	private defaultCfg=null;
	constructor(){
		super();
		this.cfgPath=this.getFullPath('userdefault');
	}
	
    private static _instance:UserDefaultCfg; 
    public static getInstance ():UserDefaultCfg{
        if(!this._instance){
            this._instance = new UserDefaultCfg();
        }
        return this._instance;
	} 
	loadCb(name,data){   
		this.loaded=true;
		this.defaultCfg=data; 
		//console.log("默认配置=",this.defaultCfg,typeof(data))
	}
	getVoiceState(){
		return this.defaultCfg.voicestate;
	}
	load()
	{ 
     	//先去判断有几个游戏要加载 
		this.loadRes(this.cfgPath,this.loadCb);
	}  
}

