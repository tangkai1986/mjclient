//比赛
import BaseMgr from "../Libs/BaseMgr";
import LoginMgr from "./LoginMgr";
import UserMgr from "./UserMgr";

const MATCH_GAME_TYPE = {
    GAME_PRACTICE:0,
    GAME_DAY_REDPAPER:1,
    GAME_WEEK_REDPAPER:2,
    GAME_BIGAWARD:3,
    GAME_CLUB:4,
}

window["MATCH_GAME_TYPE"] = MATCH_GAME_TYPE;

export default class MatchGameMgr extends BaseMgr{
    //协议列表
    routes:{} = null;
    private timestamp = null;      //sever_time 
    private matchData = null;      

    constructor (){
        super();
        this.timestamp = {
            sever_time:0,   //服务端时间戳 时间差  必要参数  服务端当前时间，与客户端对比出时间差
        }
        this.matchData = {};

        for (let i = MATCH_GAME_TYPE.GAME_PRACTICE; i<=MATCH_GAME_TYPE.GAME_CLUB; i++){
            this.matchData[i] = {
                Id:0,
                GameId:0,
                Host:0,         //举办方
                Icon:"",        //图片
                Enter:0,        //是否报名成功
                Count:0,        //当前报名数
                Amount:0,       //报名人数上限
                Cost:0,         //费用
                Award:{},
                Share:0,        //是否有分享
                begin_time:0,   //比赛开始时间
                end_time:0,     //比赛结束时间
            }
        }

        this.routes={

        }
    }

    getMathcGame(type){
        return this.matchData[type];
    }

    getTime(time){
        return this.timestamp.sever_time + time;
    }

    //单例处理
    private static _instance:MatchGameMgr;
    public static getInstance ():MatchGameMgr{
        if(!this._instance){
            this._instance = new MatchGameMgr();
        }
        return this._instance;
    }
}