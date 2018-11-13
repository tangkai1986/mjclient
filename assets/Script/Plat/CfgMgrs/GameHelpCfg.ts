import BaseCfg from "../Libs/BaseCfg"; 
 
export default class GameHelpCfg extends BaseCfg{
  
	//单例处理 
	private gamehelpPath=null;
	private gamehelpCfg=null;
	constructor(){
		super();
		this.gamehelpPath=this.getFullPath('gamehelp'); 
	}
	
    private static _instance:GameHelpCfg; 
    public static getInstance ():GameHelpCfg{
        if(!this._instance){
            this._instance = new GameHelpCfg();
        }
        return this._instance;
	} 
	loadCb(name,data){ 
		this.loaded=true; 
		this.gamehelpCfg=data;  
	}
	getCfg(){
		return this.gamehelpCfg;
	}
	getCfgByGameCode(gamecode)
	{
		return this.gamehelpCfg[gamecode]
	} 
	load()
	{
		//先去判断有几个游戏要加载
		this.loadRes(this.gamehelpPath,this.loadCb);
	}
}

