import BaseCfg from "../Libs/BaseCfg";

export default class GameResCfg extends BaseCfg{
  
    //单例处理
	private gameresPath=null; 
	private gameResList = null;
	constructor(){
		super();
		this.gameresPath=this.getFullPath('gameres');
	}
	
    private static _instance:GameResCfg; 
    public static getInstance ():GameResCfg{
        if(!this._instance){
            this._instance = new GameResCfg();
        }
        return this._instance;
	} 
	loadCb(name,data){   
		this.loaded=true;
        this.gameResList = data.clubres;
        //console.log("GameResCfg", this.gameResList);
	}
	load()
	{ 
     	//先去判断有几个游戏要加载 
		this.loadRes(this.gameresPath, this.loadCb);
    }
    getGameResList(){
        return this.gameResList;
    }
    getGameResData(id){
        let count = this.gameResList.length;
        //console.log("GameResCfg", count);
        if (count){
            for (let i = 0; i < count; i++){
                let data = this.gameResList[i];
                if (data.id == id){
                    return data;
                }
            }
        }
        return null;
    }
}

