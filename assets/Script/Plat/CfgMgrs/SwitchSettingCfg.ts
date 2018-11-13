import BaseCfg from "../Libs/BaseCfg";
import ServerMgr from "../../AppStart/AppMgrs/ServerMgr";
 
 
export default class SwitchSettingCfg extends BaseCfg{
  
	//单例处理 
	private productsettingPath=null;
	private switchSettings=null;
	private loadCb2=null;//给外部用的
	constructor(){
		super();
		this.productsettingPath=this.getFullPath('switchsetting');
	}
	
    private static _instance:SwitchSettingCfg; 
    public static getInstance ():SwitchSettingCfg{
        if(!this._instance){
            this._instance = new SwitchSettingCfg();
        }
        return this._instance;
	} 
	getSetting(){
		return this.switchSettings;
	}
	loadCb(name,data){ 
		this.loaded=true; 
		this.switchSettings=data[ServerMgr.getInstance().getProductTag()];  
		this.loadCb2();
	}
  
	load(loadCb2)
	{
		this.loadCb2=loadCb2;
		//先去判断有几个游戏要加载
		this.loadRes(this.productsettingPath,this.loadCb);
	}
}

