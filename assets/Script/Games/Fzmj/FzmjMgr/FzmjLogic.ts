import FzmjPlayer from "./FzmjPlayer"; 
 
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import FzmjProp from "./FzmjProp";
import { MahjongDef } from "../../../GameCommon/Mahjong/MahjongDef"; 
import MahjongLogic from "../../../GameCommon/Mahjong/MahjongLogic";
import FzmjCards from "./FzmjCards";
import MahjongAudio from "../../../GameCommon/Mahjong/MahjongAudio";

//与服务器段已知的牌字典
export default class FzmjLogic extends MahjongLogic
{       
    //单例处理
    private static _instance:FzmjLogic;
    public static getInstance ():FzmjLogic{
        if(!this._instance){
            this._instance = new FzmjLogic();
        }
        return this._instance;
    }
    destroy(){
        super.destroy();
        delete FzmjLogic._instance;
        FzmjLogic._instance=null;
    }
    constructor(){
        super(); 
    }
    //重写基类的方法
    initMahjong(){ 
        this.mahjongcards=new FzmjCards(16);
        //创建四个角色
        for (let i = 0;i<this.seatcount;i++)
        {
            this.players[i]=new FzmjPlayer;
            this.players[i].init(i,this)
        }   
        MahjongAudio.getInstance().initPlayers(this.players);
        let cfg=RoomMgr.getInstance().getFangKaCfg();
        this.prop=new FzmjProp(cfg); 
        //不带花牌的话就移除花
        if(!this.prop.get_b_daihuapai())
        {
            this.mahjongcards.removeHua();//不带花牌就移除花
        }
    }  
}
 
 


 
 
