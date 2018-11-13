import QgmjPlayer from "./QgmjPlayer"; 
 
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import QgmjProp from "./QgmjProp";
import { MahjongDef } from "../../../GameCommon/Mahjong/MahjongDef"; 
import MahjongLogic from "../../../GameCommon/Mahjong/MahjongLogic";
import QgmjCards from "./QgmjCards";
 

//与服务器段已知的牌字典
export default class QgmjLogic extends MahjongLogic
{       
    //单例处理
    private static _instance:QgmjLogic;
    public static getInstance ():QgmjLogic{
        if(!this._instance){
            this._instance = new QgmjLogic();
        }
        return this._instance;
    }
    destroy(){
        super.destroy();
        delete QgmjLogic._instance;
        QgmjLogic._instance=null;
    }
    constructor(){
        super();
    }
    //重写基类的方法
    initMahjong(){ 
        this.mahjongcards=new QgmjCards(13);
        //创建四个角色
        for (let i = 0;i<this.seatcount;i++)
        {
            this.players[i]=new QgmjPlayer;
            this.players[i].init(i,this)
        }   
        let cfg=RoomMgr.getInstance().getFangKaCfg();
        this.prop=new QgmjProp(cfg);
        this.isMingYou=this.prop.get_v_youjintype()==1; 
    }
}
 
 


 
 
