import ModuleMgr from "../../Plat/GameMgrs/ModuleMgr";

let modules={ 
    //麻将房间内的预制体 
    Settle:'SubLayer/Games/Qgmj/QgmjSettle',//结算
    GambleRecord:'SubLayer/Games/Qgmj/QgmjGambleRecord',//战绩
}

export default class QgmjEntry{ 
    private static _instance:QgmjEntry;
    constructor()
    { 
    }  
    public static getInstance ():QgmjEntry{
        if(!this._instance){
            this._instance = new QgmjEntry();
        }
        return this._instance;
    } 
    registerModules()
    {
        ModuleMgr.getInstance().registerGame(modules);
    }
}
