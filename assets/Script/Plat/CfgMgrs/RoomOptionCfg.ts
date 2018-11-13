import BaseCfg from "../Libs/BaseCfg";
import RoomMgr from "../GameMgrs/RoomMgr";
 
 
export default class RoomOptionCfg extends BaseCfg{ 
	//单例处理 
	private roomOptionPath=null;
	private content = null;
	private data = null;
	private title = null;
	private payTypeInfo = ['首局结算时房主支付','首局结算时所有玩家各支付','总结算时赢家按比例共支付']
	constructor(){
		super();
		this.roomOptionPath=this.getFullPath('roomoption');
	}
	
    private static _instance:RoomOptionCfg; 
    public static getInstance ():RoomOptionCfg{
        if(!this._instance){
            this._instance = new RoomOptionCfg();
        }
        return this._instance;
	} 
	loadCb(name,data){ 
		this.loaded=true;
		this.data = data;
	}

	getGameRoomOption(gameId){
		return this.data[gameId];
	}

	getContentTransToString(gameId, roomInfo){
		this.content = [];
		let gameData = this.data[gameId]
		for(let key in roomInfo){
			let value = roomInfo[key]
			let clubid = RoomMgr.getInstance().getEnterFangKaClubId()
            let paysource = RoomMgr.getInstance().getEnterFangKaPaysource()
            if(key == "v_paytype" && clubid != 0 && paysource > 1){
                value = 3
            }else if(key == "v_youjinjiangli"){
            	// let contentString = value
                // if(roomInfo.b_yike == 1){
            	// 	this.content.push(contentString)
            	// }
            }else if(key == "v_shasanjiangli" && gameId == 1){
            	// let contentString = value
                // if(roomInfo.b_yike == 1 && roomInfo.v_seatcount>3){
            	// 	this.content.push(contentString)
            	// }
			}else if(key == "v_allotFlowerData"){
				if(roomInfo.v_extendRule == 3){
					let contentString = `方块+${roomInfo[key][0]}梅花+${roomInfo[key][1]}红桃+${roomInfo[key][2]}黑桃+${roomInfo[key][3]}`
					this.content.push(contentString)
				}
			}else if(key == "v_buyHorseData"){
				if(roomInfo.v_buyHorse){
					let contentString = gameData.content[key][value.toString()]
					this.content.push(contentString)
				}
			}else if(key == "b_yike"|| key == "t_bazhanghua"||key == "v_paytype"||key == "v_fangfei"||key == 'b_hupai'||key == 'v_playerbuyLimit'||key == "t_youjin"){
				//不显示
			}else if(key == 'v_fullstart' && gameId == 13){
				//不显示
			}else if(key == 'v_startModel' && gameId != 13){
				//不显示
			}else{
				if(gameData.content[key] != null && gameData.content[key] != undefined) {
	            	let contentString = gameData.content[key][value.toString()]
	                this.content.push(contentString)
				}
            }
		}
		return this.content
	}
	getRoomDescToString(gameId, roomInfo){
		this.content = [];
		let gameData = this.data[gameId]
		for(let key in roomInfo){
			let value = roomInfo[key]
			let clubid = RoomMgr.getInstance().getEnterFangKaClubId()
            let paysource = RoomMgr.getInstance().getEnterFangKaPaysource()
            if(key == "v_paytype" && clubid != 0 && paysource > 1){
                value = 3
            }else if(key == "v_youjinjiangli"){
            	// let contentString = value
                // if(roomInfo.b_yike == 1){
            	// 	this.content.push(contentString)
            	// }
            }else if(key == "v_shasanjiangli" && gameId == 1){
            	// let contentString = value
                // if(roomInfo.b_yike == 1 && roomInfo.v_seatcount>3){
            	// 	this.content.push(contentString)
            	// }
			}else if(key == "v_allotFlowerData"){
				if(roomInfo.v_extendRule == 3){
					let contentString = `方块+${roomInfo[key][0]}梅花+${roomInfo[key][1]}红桃+${roomInfo[key][2]}黑桃+${roomInfo[key][3]}`
					this.content.push(contentString)
				}
			}else if(key == "v_buyHorseData"){
				if(roomInfo.v_buyHorse){
					let contentString = gameData.content[key][value.toString()]
					this.content.push(contentString)
				}
			}else if(key == "b_yike"|| key == "t_bazhanghua"||key == "v_paytype"||key == "v_fangfei"||key == 'b_hupai'||key == 'v_playerbuyLimit'||key == "v_roundcount"||key == "v_seatcount"){
				//不显示
			}else if(key == 'v_fullstart' && gameId == 13){
				//不显示
			}
			else if(key == "t_youjin"||key=="v_youjintype"){
				if(!!gameData.content[key])
				{
					let contentString = gameData.content[key][value.toString()]
					this.content.push(contentString)
				}
			}
			else if(key == 'v_startModel' && gameId != 13){
				//不显示
			}else{
				if(gameData.content[key] != null && gameData.content[key] != undefined) {
					if(gameData.content[key]["describe"]) {
		            	let contentString = gameData.content[key]["describe"][value.toString()]
		                this.content.push(contentString)
					}
					else
					{
		            	let contentString = gameData.content[key][value.toString()]
		                this.content.push(contentString)
					}
				}
            }
		}
		return this.content
	}
	getTitleTransToString(gameId, roomInfo){
		this.title = [];
		let gameData = this.data[gameId]
		for(let key in roomInfo){
			let value = roomInfo[key]
			if(key == "v_youjinjiangli"){
            	// let titleString = gameData.title['v_youjinjiangli']
            	// if(roomInfo.b_yike == 1){
            	// 	this.title.push(titleString)
            	// }
            }else if(key == "v_shasanjiangli"&& gameId == 1){
            	// let titleString = gameData.title['v_shasanjiangli']
                // if(roomInfo.b_yike == 1 && roomInfo.v_seatcount>3){
            	// 	this.title.push(titleString)
            	// }
			}else if(key == "v_allotFlowerData"){
				if(roomInfo.v_extendRule == 3){
					let titleString = gameData.title[key]
                	this.title.push(titleString)
				}
			} else if (key == "v_buyHorseData") {
				if (roomInfo.v_buyHorse) {
					let titleString = gameData.title[key]
					this.title.push(titleString)
				}
			} else if (key == "b_yike" || key == "t_bazhanghua" || key == "v_paytype" || key == "v_fangfei" || key == "b_hupai"||key == 'v_playerbuyLimit'||key == "t_youjin") {
				//不显示
			} else if (key == 'v_fullstart' && gameId == 13){
				//不显示
			} else if (key == 'v_startModel' && gameId != 13){
				//不显示
			}
			else{
            	let titleString = gameData.title[key]
                this.title.push(titleString)
            }
		}
		return this.title
	}
	getFanfei(gameId, roomInfo){
		let gameData = this.data[gameId]
		let text = this.payTypeInfo[roomInfo.v_paytype]+roomInfo["v_fangfei"] + '钻石'
		return text
	}
	load()
	{
		//先去判断有几个游戏要加载
		this.loadRes(this.roomOptionPath,this.loadCb);
	}
}