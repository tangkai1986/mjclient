import BaseCfg from "../Libs/BaseCfg";
 
export default class NameCfg extends BaseCfg{
  
	//单例处理
	private nameData = null;
	private namePath=null;
	constructor(){
		super();
		this.namePath=this.getFullPath('name');
	}
	
    private static _instance:NameCfg;
    public static getInstance ():NameCfg{
        if(!this._instance){
            this._instance = new NameCfg();
        }
        return this._instance;
	} 
	loadCb(name,data){
		this.loaded=true;
		this.nameData = data;
	}
	getName()
	{
		return this.nameData;
	}
	load()
	{
		this.loadRes(this.namePath,this.loadCb);
	}
}

