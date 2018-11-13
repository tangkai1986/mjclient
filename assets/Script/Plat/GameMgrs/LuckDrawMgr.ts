import BaseMgr from "../Libs/BaseMgr";


export default class LuckDrawMgr  extends BaseMgr {
    awardListInfo : any =[]
    drawResult : any = {}
    uid:any = null
    bDraw:any = null
    wechatNum:any = null
    record:any = null
    routes : any = {}
    constructor ()
    {
        super();
        this.wechatNum : 'dzwp01',
        this.routes = {
            'http.reqTrunTable':this.http_reqTrunTable,
            'http.reqTrunTableLottery':this.http_reqTrunTableLottery,
            'http.reqTrunTableDetails':this.http_reqTrunTableDetails,
        }
        this.reqTrunTable()
    }

    getAwardList(){
        return this.awardListInfo;
    }

    getDrawed(){
        return this.bDraw;
    }

    getWechatNum(){
        return this.wechatNum;
    }

    getDrawResult() {
        return this.drawResult;
    }

    getDrawRecord(){
        return this.record;
    }

    reqTrunTable(){
        this.send_msg('http.reqTrunTable');
    }

    http_reqTrunTable(msg){
        this.awardListInfo = msg.award;
        this.bDraw = msg.is_lottery
        //console.log(this.awardListInfo, this.bDraw)
    }

    reqTrunTableLottery(){
        this.send_msg('http.reqTrunTableLottery');
    }

    http_reqTrunTableLottery(msg){
        //console.log('抽奖结果', msg)
        this.drawResult = msg;
    }

    reqTrunTableDetails(){
        this.send_msg('http.reqTrunTableDetails')
    }

    http_reqTrunTableDetails(msg){
        this.record = msg.list[0]
        //console.log('抽奖记录', this.record, msg)
    }


    private static _instance:LuckDrawMgr;
    public static getInstance():LuckDrawMgr{
        if(!this._instance){
            this._instance = new LuckDrawMgr;
        }
        return this._instance;
    }


}
