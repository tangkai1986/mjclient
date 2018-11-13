import BaseCfg from "../Libs/BaseCfg"; 
 
export default class JbcCfg extends BaseCfg{
  
	//单例处理 
	private jbccfgPath=null;
	private jbcCfg=null;
	constructor(){
		super();
		this.jbccfgPath=this.getFullPath('jbccfg'); 
	}
	
    private static _instance:JbcCfg; 
    public static getInstance ():JbcCfg{
        if(!this._instance){
            this._instance = new JbcCfg();
        }
        return this._instance;
	} 
	loadCb(name,data){ 
		this.loaded=true; 
		this.jbcCfg=data;  
	}
	getCfgByGameCode(gamecode)
	{
		return this.jbcCfg[gamecode]
	}
	getCfgByGameCodeAndBetType(gamecode,bettype)
	{
		let items=this.jbcCfg[gamecode];
		for(let i = 0;i<items.length;++i)
		{
			if(items[i].bettype==bettype)
			{
				return items[i];
			}
		}
		return null;
	}
	load()
	{
		//先去判断有几个游戏要加载
		this.loadRes(this.jbccfgPath,this.loadCb);
	}
}

