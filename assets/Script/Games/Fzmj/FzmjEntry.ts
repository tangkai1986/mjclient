import ModuleMgr from "../../Plat/GameMgrs/ModuleMgr";

let modules={ 
    //麻将房间内的预制体 
    Settle:'SubLayer/Games/Fzmj/FzmjSettle',//结算
    GambleRecord:'SubLayer/Games/Fzmj/FzmjGambleRecord',//战绩
    Fzmjhaidilaoyue:'SubLayer/Games/Fzmj/Fzmj_haidilaoyue',//海底捞月
}

export default class FzmjEntry{ 
    private static _instance:FzmjEntry;
    constructor()
    { 
    }  
    public static getInstance ():FzmjEntry{
        if(!this._instance){
            this._instance = new FzmjEntry();
        }
        return this._instance;
    } 
    registerModules()
    {
        ModuleMgr.getInstance().registerGame(modules);
    }
}
