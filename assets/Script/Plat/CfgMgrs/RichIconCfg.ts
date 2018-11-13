import BaseCfg from "../Libs/BaseCfg";

export default class RichIconCfg extends BaseCfg{
  
    //单例处理
	private richPath=null; 
	private richdata = null;
	constructor(){
		super();
		this.richPath=this.getFullPath('richtext');
	}
	
    private static _instance:RichIconCfg; 
    public static getInstance ():RichIconCfg{
        if(!this._instance){
            this._instance = new RichIconCfg();
        }
        return this._instance;
	} 
	loadCb(name,data){   
		this.loaded=true;
		this.richdata = data;
		//console.log("RichIconCfg", this.richdata);
	}
	load()
	{ 
     	//先去判断有几个游戏要加载 
		this.loadRes(this.richPath,this.loadCb);
	}
	getRichCfg()
	{
		 return this.richdata;
	}
}

