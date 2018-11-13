import TbnnLogic from "./TbnnLogic";

//牛牛玩家对象
// interface t_userInfo {
//     bettype:number,
//     bowner:any,
//     gameid:number,
//     gamestarted:any,
//     id:number,
//     inroom:any,
//     password:number,
//     prepared:any,
//     rid:number,
//     roundcount:number,
//     seatcount:number,
//     seatid:number,
//     verified:any
// }
export default class TbnnPlayer {
    uid:number=null
    seatid:number=null
    logic:TbnnLogic = null
    constructor()  
	{ 
		this.uid=null;//uid  
		this.seatid=null 
    } 
    
    public init(seatid:number,logic:TbnnLogic)
	{ 
		this.seatid=seatid
		this.logic=logic;
    } 
}
