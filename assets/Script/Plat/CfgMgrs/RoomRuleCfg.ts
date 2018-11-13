import BaseCfg from "../Libs/BaseCfg";


export default class RoomRuleCfg extends BaseCfg{

	private roomrulePath=null;
	private roomRules=null;
	constructor(){
		super();
		this.roomrulePath=this.getFullPath('roomrule');
	}

	private static _instance:RoomRuleCfg; 
	public static getInstance ():RoomRuleCfg{
		if(!this._instance){
			this._instance = new RoomRuleCfg();
		}
		return this._instance;
	}
	loadCb(name,data){ 
		this.loaded=true; 
		this.roomRules={};
		for(let key in data){
			this.roomRules[key] = data[key]
		}
	}
	getRoomRuleById(id){
		return this.roomRules[id]
	}

	load()
	{
		this.loadRes(this.roomrulePath,this.loadCb);
	}
}
