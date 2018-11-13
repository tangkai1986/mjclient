import BaseCfg from "../Libs/BaseCfg";


export default class RoomCostCfg extends BaseCfg {
	private roomcostPath=null;
	private roomcost=null;
	constructor(){
		super();
		this.roomcostPath=this.getFullPath('roomcost'); 
	}
	
	private static _instance:RoomCostCfg; 
	public static getInstance ():RoomCostCfg{
		if(!this._instance){
			this._instance = new RoomCostCfg();
		}
		return this._instance;
	}

	loadCb(name,data){
		this.loaded=true;
		this.roomcost = data;
	}
	getRoomCost(gamename, yike, roundcount, playercount, paytype){
		if(roundcount == 0) {
			yike = 1;
		}
		let info = this.roomcost[gamename];
		for (let i = 0; i < info.length; i++) {
			if(info[i].special == yike
				&&info[i].roundcount == roundcount
				&&info[i].playercount == playercount
				&&info[i].type == paytype){
				return info[i].price
			}
		}
	}

	load()
	{
		this.loadRes(this.roomcostPath,this.loadCb);
	}
}
