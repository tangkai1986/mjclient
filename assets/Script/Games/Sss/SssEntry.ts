import ModuleMgr from "../../Plat/GameMgrs/ModuleMgr";
let modules={

	SssSetCard:'SubLayer/Games/Sss/Prefab_SssSetCards',
	SssRecord: 'SubLayer/Games/Sss/SssRecord',
}

export default class SssEntry{
    private static _instance:SssEntry;
    constructor() {}
    public static getInstance ():SssEntry{
        if(!this._instance){
            this._instance = new SssEntry();
        }
        return this._instance;
    }
    registerModules() {
        ModuleMgr.getInstance().registerGame(modules);
	//console.log("输出一句log")
    }
}
