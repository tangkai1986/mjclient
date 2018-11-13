//游戏战绩
import BaseMgr from "../Libs/BaseMgr";
import LoginMgr from "./LoginMgr";
import UserMgr from "./UserMgr";
import GameCateCfg from "../CfgMgrs/GameCateCfg";
import SubGameMgr from "./SubGameMgr";

export default class GameRecordMgr extends BaseMgr{
    /*该茶馆详细数据
    memberlist:{id, icon, name, identity, 
            diamond, diamondMax}
    */ 
    record_list:any = []
    real_record_list:any = []
    record_type:number = 0;
    game_type:number = 0
    record_club:number = 0
    record_max:number = 100
    //协议列表
    routes:{} = null

    constructor (){
        super(); 
        this.record_type = 0;
        this.game_type = 0;
        this.record_club = 0;
        this.record_max = 100;
        let uid = UserMgr.getInstance().getUid();
        this.record_list = [];
        this.real_record_list=[];
        this.routes={
            "http.reqGambleRecordList":this.http_reqGambleRecordList,
        }
    }

    http_reqGambleRecordList(msg){ 
        if (msg.page == 1){
            this.record_list = null;
            this.record_list = [];
            this.record_type = msg.r_type;
            this.game_type = msg.g_type;
            this.record_club = msg.club;
        }
        if (this.record_list.length == null || this.record_list.length == 0){
            this.record_list = msg.list;
        }else{
            this.record_list = this.record_list.concat(msg.list);
        }
        //筛选出存在的游戏
        this.real_record_list=[];
        for(let i = 0;i<this.record_list.length;++i)
        {
            let item=this.record_list[i]
            let gameid=item.gameid;
            if(gameid)
            {
                let game=GameCateCfg.getInstance().getGameById(gameid)
                //游戏可能会在运营过程中关闭或开启,所以要判断游戏是否存在
                if(game&&(SubGameMgr.getInstance().getSubGameState(game.code)==0))
                {
                    this.real_record_list.push(item)
                }
            }
            else
            {
                this.real_record_list.push(item) 
            }
        }
    }

    getRecordType(){
        return this.record_type;
    }

    getGameType(){
        return this.game_type;
    }

    getRecordClub(){
        return this.record_club;
    }

    getRecordMax(){
        return this.record_max;
    }

    getRecordList(){
        return this.real_record_list;//返回已下载了子游戏的战绩列表
    }
    reqGambleRecordList(page, r_type=this.record_type, g_type=this.game_type, club_id=this.record_club){
        let info = {
            page:page,
            r_type:r_type,
            g_type:g_type,
            club:club_id,
        }
        this.send_msg("http.reqGambleRecordList", info);
    }

    //单例处理
    private static _instance:GameRecordMgr;
    public static getInstance ():GameRecordMgr{
        if(!this._instance){
            this._instance = new GameRecordMgr();
        }
        return this._instance;
    }
}