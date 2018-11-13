//
import BaseMgr from "../Libs/BaseMgr";  
import JbcCfg from "../CfgMgrs/JbcCfg";
import GameCateCfg from "../CfgMgrs/GameCateCfg";
import LocalStorage from "../Libs/LocalStorage";

  
export default class BetMgr extends BaseMgr{
    private betType = 1;
    private gameId = 1; 
    //单例处理
    constructor(){
        super();
    }
    private static _instance:BetMgr; 
    public static getInstance ():BetMgr{
        if(!this._instance){
            this._instance = new BetMgr();
        }
        return this._instance;
    }

    setGameId(gameId:number){        
        this.gameId = gameId;
        LocalStorage.getInstance().setCreateRoomInfoCfg(this.gameId);
    }
    setBetType(bettype:number)
    {
        this.betType=bettype;
    }
    
    getGameName(){
        let game=GameCateCfg.getInstance().getGameById(this.gameId);
        return game.name;
    }
    getGameId(){
        if(LocalStorage.getInstance().getCreateRoomInfoCfg()){
            this.gameId = LocalStorage.getInstance().getCreateRoomInfoCfg();
        }
        return this.gameId;
    }
    getBetType(){
        return this.betType;
    }
     
    getJbcCfg()
    {
        let game=GameCateCfg.getInstance().getGameById(this.gameId);
        return JbcCfg.getInstance().getCfgByGameCodeAndBetType(game.code,this.betType) 
    }
}