import ModuleMgr from "../../Plat/GameMgrs/ModuleMgr";

let modules={ 
    //麻将房间内的预制体 
    Settle:'SubLayer/Games/Qzmj/QzmjSettle',//结算
    GambleRecord:'SubLayer/Games/Qzmj/QzmjGambleRecord',//战绩
}

export default class QzmjEntry{ 
    private static _instance:QzmjEntry;
    constructor()
    { 
    }  
    public static getInstance ():QzmjEntry{
        if(!this._instance){
            this._instance = new QzmjEntry();
        }
        return this._instance;
    } 
    registerModules()
    {
        ModuleMgr.getInstance().registerGame(modules);
    }
}
