import ModuleMgr from "../../Plat/GameMgrs/ModuleMgr";

let modules={ 
    //麻将房间内的预制体 
    Settle:'SubLayer/Games/Lymj/LymjSettle',//结算
    GambleRecord:'SubLayer/Games/Lymj/LymjGambleRecord',//战绩
}

export default class LymjEntry{ 
    private static _instance:LymjEntry;
    constructor()
    { 
    }  
    public static getInstance ():LymjEntry{
        if(!this._instance){
            this._instance = new LymjEntry();
        }
        return this._instance;
    } 
    registerModules()
    {
        ModuleMgr.getInstance().registerGame(modules);
    }
}
