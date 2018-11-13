import BaseCfg from "../Libs/BaseCfg";
import ProductSettingCfg from "./ProductSettingCfg";
 
 
export default class GameCateCfg extends BaseCfg{
  
	//单例处理 
	private gamecatePath=null;
	private games=null;
	constructor(){
		super();
		this.gamecatePath=this.getFullPath('gamecate');
	}
	
    private static _instance:GameCateCfg; 
    public static getInstance ():GameCateCfg{
        if(!this._instance){
            this._instance = new GameCateCfg();
        }
        return this._instance;
	} 
	loadCb(name,data){ 
		this.loaded=true; 
		this.games=[]; 
		let gameDic={};
		for(let i = 0 ;i<data.length;++i)
		{ 
			let item=data[i]
			if(item.exist==1)
			{
				gameDic[item.code]=item; 
			}
		} 
		//按客户的需求修改显示的顺序
		let orderGames=['fzmj','qzmj','lymj']
		for(let i = 0;i<orderGames.length;++i)
		{
			let code=orderGames[i];
			this.games.push(gameDic[code])
		}
	}
	//根据productsetting去再次筛选游戏
	refreshGames(){
		let newlist=[];
		for(let i=0;i<this.games.length;++i)
		{
			let item=this.games[i];
			if(ProductSettingCfg.getInstance().isContainGame(item.code))
			{
				newlist.push(item);
			}
		}
		this.games=newlist;//设置为新的游戏列表
	}
	getGames(){
		return this.games;
	}
	getGameIndex(id)
	{
		for(let i=0;i<this.games.length;++i)
		{
			let item=this.games[i];
			if(item.id==id)
			{
				return i;
			}
		}
		return 0;	
	}
	getGameById(id)
	{
		for(let i=0;i<this.games.length;++i)
		{
			let item=this.games[i];
			if(item.id==id)
			{
				return item;
			}
		}
		return null;
	}
	load()
	{ 
		//先去判断有几个游戏要加载
		this.loadRes(this.gamecatePath,this.loadCb);
	}
}

