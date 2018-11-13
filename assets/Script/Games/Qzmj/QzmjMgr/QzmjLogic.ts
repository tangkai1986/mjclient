import QzmjPlayer from "./QzmjPlayer"; 
 
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import QzmjProp from "./QzmjProp";
import { MahjongDef } from "../../../GameCommon/Mahjong/MahjongDef"; 
import MahjongLogic from "../../../GameCommon/Mahjong/MahjongLogic";
import QzmjCards from "./QzmjCards";
 

//与服务器段已知的牌字典
export default class QzmjLogic extends MahjongLogic
{       
    //单例处理
    private static _instance:QzmjLogic;
    public static getInstance ():QzmjLogic{
        if(!this._instance){
            this._instance = new QzmjLogic();
        }
        return this._instance;
    }
    destroy(){
        super.destroy();
        delete QzmjLogic._instance;
        QzmjLogic._instance=null;
    }
    constructor(){
        super(); 
    }
    //重写基类的方法
    initMahjong(){ 
        this.mahjongcards=new QzmjCards(16);
        //创建四个角色
        for (let i = 0;i<this.seatcount;i++)
        {
            this.players[i]=new QzmjPlayer;
            this.players[i].init(i,this)
        }   
        let cfg=RoomMgr.getInstance().getFangKaCfg();
        this.prop=new QzmjProp(cfg);
        this.isMingYou=this.prop.get_v_youjintype()==1; 
    }
}
 
 


 
 
