//茶馆管理
import BaseMgr from "../Libs/BaseMgr";
import LoginMgr from "./LoginMgr";
import UserMgr from "./UserMgr";

export default class ClubGameMgr extends BaseMgr{
    /*该茶馆详细数据
    
    gameList:{id, name, type, pay, mCount, mMax, time, round}
    */ 
    club_id:number = null
    gameList:any = {}
    //协议列表
    routes:{} = null
    //是否进入
    club_enter:boolean = false;
    //修改数据存储列表
    private club_change_list:any = {};

    constructor (){
        super(); 
        this.club_id = -1;
        this.gameList = {};
        this.routes={
            "http.onClubGame":this.http_onClubGame,

            "http.reqClubGameList":this.http_reqClubGameList,
        }
    }

    
    onGameCreateEvent(msg){
        let data = {
            id:msg.id, 
            name:msg.name, 
            type:msg.type, 
            pay:msg.pay, 
            mCount:msg.mCount, 
            mMax:msg.mMax, 
            time:msg.time, 
            round:msg.round
        }
        this.gameList.splice(0,0,data)
    }
    onGameColseEvent(msg){
        this.removeClubGame(msg.id);
    }
    onGameRemoveEvent(msg){
        let data = this.getClubGameData(msg.id)
        data.mCount=msg.mCount;
    }

    http_onClubGame(msg){
        let data = msg.states;
        switch(data.state){
            case CLUB_GAME_STATE.CREATE:
                this.onGameCreateEvent(data);
                break;
            case CLUB_GAME_STATE.COLSE:
                this.onGameColseEvent(data);
                break;
            case CLUB_GAME_STATE.REMOVE:
                this.onGameRemoveEvent(data);
                break;
            default:
                break;
        }
    }
    
    http_reqClubGameList(msg){
        //console.log("ClubMember");
        console.dir(msg);
        if (this.gameList.length == null){
            this.gameList = msg.list;
        }else{
            this.gameList = this.gameList.concat(msg.list);
        }
    }
    //数据获取
    
    getClubGameList(){
        return this.gameList;
    }
    getClubGameData(id){
        let count = this.gameList.length;
        for (let i = 0; i < count; i++){
            let data = this.gameList[i];
            if (id == data.id){
                return data
            }
        }
        return null;
    }

    //数据修改
    removeClubGame(room_id){
        let room_list = this.gameList,
            count = room_list.length;
        for (let i = 0; i < count; i++){
            let data = room_list[i];
            if (room_id == data.id){
                room_list.splice(i,1);
                break
            }
        }
    }

    //游戏列表
    reqClubGameList(club_id, page, game_type:number = 0){
        if (page == 1){
            this.gameList = null
            this.gameList = {}
        }
        let clubinfo={
            'id':club_id,
            'page':page,
            'type':game_type,
        }
        this.send_msg('http.reqClubGameList', clubinfo);
    }
    //单例处理
    private static _instance:ClubGameMgr;
    public static getInstance ():ClubGameMgr{
        if(!this._instance){
            this._instance = new ClubGameMgr();
        }
        return this._instance;
    }
}