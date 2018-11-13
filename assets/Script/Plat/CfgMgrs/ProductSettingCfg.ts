import BaseCfg from "../Libs/BaseCfg";
import ServerMgr from "../../AppStart/AppMgrs/ServerMgr";
 
 
export default class ProductSettingCfg extends BaseCfg{
  
	//单例处理 
	private productsettingPath=null;
	private productSettings=null;
	constructor(){
		super();
		this.productsettingPath=this.getFullPath('productsetting');
	}
	
    private static _instance:ProductSettingCfg; 
    public static getInstance ():ProductSettingCfg{
        if(!this._instance){
            this._instance = new ProductSettingCfg();
        }
        return this._instance;
	} 
	loadCb(name,data){ 
		this.loaded=true; 
		this.productSettings=data[ServerMgr.getInstance().getProductTag()]; 
	}
	isContainGame(game)
	{
		if(this.productSettings==null)
		{
			return true;
		}
		let games=this.productSettings.games;
		for(let i=0;i<games.length;++i)
		{
			if(games[i]==game)
			{
				return true;
			}
		}
		return false;
	} 
	load()
	{
		//先去判断有几个游戏要加载
		this.loadRes(this.productsettingPath,this.loadCb);
	}
}

