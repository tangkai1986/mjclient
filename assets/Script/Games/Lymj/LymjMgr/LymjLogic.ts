import LymjPlayer from "./LymjPlayer"; 
 
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import LymjProp from "./LymjProp";
import { MahjongDef } from "../../../GameCommon/Mahjong/MahjongDef"; 
import MahjongLogic from "../../../GameCommon/Mahjong/MahjongLogic";
import LymjCards from "./LymjCards";
 

//与服务器段已知的牌字典
export default class LymjLogic extends MahjongLogic
{       
    //单例处理
    private static _instance:LymjLogic;
    public static getInstance ():LymjLogic{
        if(!this._instance){
            this._instance = new LymjLogic();
        }
        return this._instance;
    }
    destroy(){
        super.destroy();
        delete LymjLogic._instance;
        LymjLogic._instance=null;
    }

    constructor(){
        super();
    }
    //重写基类的方法
    initMahjong(){ 
        this.mahjongcards=new LymjCards(13);
        //创建四个角色
        for (let i = 0;i<this.seatcount;i++)
        {
            this.players[i]=new LymjPlayer;
            this.players[i].init(i,this)
        }   
        let cfg=RoomMgr.getInstance().getFangKaCfg();
        this.prop=new LymjProp(cfg);
        this.isQuanZiDong=this.prop.get_b_quanzimo()==1;//全自动
    }
}
 
 


 
 
