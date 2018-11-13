import BaseCfg from "../Libs/BaseCfg";

export default class FilterCfg extends BaseCfg{
  
    //单例处理
	private filterPath=null; 
	private filterData=null; 
	constructor(){
		super();
		this.filterPath=this.getFullPath('filter');
	}
	
    private static _instance:FilterCfg; 
    public static getInstance ():FilterCfg{
        if(!this._instance){
            this._instance = new FilterCfg();
        }
        return this._instance;
	} 
	loadCb(name,data){   
		this.loaded=true;
		this.filterData = data; 
	}
	getFilterData(){
		return this.filterData;
	}
	load()
	{ 
     	//先去判断有几个游戏要加载 
		this.loadRes(this.filterPath,this.loadCb);
	} 
}

