import BaseMgr from "../Libs/BaseMgr";

export default class MarqueMgr extends BaseMgr{
    routes:{} = null
    private marqueeText:string = null;
    constructor (){
        super();
        this.routes={
            "http.reqHorseRaceLamp":this.http_reqHorseRaceLamp,
        }
    }

    private http_reqHorseRaceLamp(msg){
        this.marqueeText = msg.result.horse_race_lamp;

    }
    reqHorseRaceLamp(){
        this.send_msg('http.reqHorseRaceLamp',{gid:8});
    }
    getMarqueeText(){
        return this.marqueeText;
    }

    private static _instance:MarqueMgr;
    public static getInstance ():MarqueMgr{
        if(!this._instance){
            this._instance = new MarqueMgr();
        }
        return this._instance;
    }
}