import BaseMgr from "../Libs/BaseMgr";
import viewLogicSeatConvertMgr from "./viewLogicSeatConvertMgr";
import UserMgr from "./UserMgr";
import GameCateCfg from "../CfgMgrs/GameCateCfg";
import RoomOptionCfg from "../CfgMgrs/RoomOptionCfg";


export default class BunchInfoMgr extends BaseMgr{
    bunchInfo = null;
    memberlist = null;
    plazzaFlag = false;
    gameid = null;
    roomOption = null;
    roomName = null;
    roomid = null;
    constructor (){
        super();
        this.resetData();
        this.routes={
            "http.reqGambleRecord":this.http_reqGambleRecord,
            'http.reqUsers' : this.http_reqUsers,
        }
        viewLogicSeatConvertMgr.getInstance();
    }
    //数据刷新
    http_reqUsers(msg){
        if(this.memberlist != null && this.memberlist.length != null){
            for (let user in msg.users){
                let userdata = msg.users[user];
                for (let i = 0; i < this.memberlist.length; i ++) {
                    if(!this.memberlist[i]) continue;
                    if(this.memberlist[i].id==userdata.id) {
                        this.memberlist[i] = userdata;
                        break;
                    }
                }
            }
        }
    }

    resetData()
    {
        this.bunchInfo=null;
        this.memberlist=null;
        this.plazzaFlag = false;
        this.roomOption = null;
        this.roomName = null;
        viewLogicSeatConvertMgr.getInstance().clear();
    }
    clear(){
        delete BunchInfoMgr._instance;
        BunchInfoMgr._instance=null;
        BunchInfoMgr.getInstance();
        viewLogicSeatConvertMgr.getInstance().clear();
    }
    setBunchInfo(data)
    {
        this.bunchInfo=data;
    }
    getBunchInfo()
    {
        return this.bunchInfo;
    }
    setMembelist(data)
    {
        if(this.memberlist){
            for(let i = 0; i < data.length; i ++){
                if(data[i]){
                    this.memberlist[i] = data[i];
                }
            }
        }else{
            this.memberlist=data;
        }
    }
    getMembelist()
    {
        return this.memberlist;
    }
    getMyLogicSeatId (){
        let myUsrId = UserMgr.getInstance().getUid();
        let mySeatID;
        for (let i = 0; i < this.memberlist.length; i ++) {
            if(!this.memberlist[i]) continue;
            if(this.memberlist[i].id==myUsrId) {
                mySeatID = i;
                break;
            }
        }
        return mySeatID
    }
    getUidBySeatId (logicSeatId){
        return this.memberlist[logicSeatId].id
    }
    getGameId()
    {
        return this.gameid;
    }
    setRoomId(data){
        this.roomid = data;
    }
    getRoomId(){
        return this.roomid;
    }
    http_reqGambleRecord(msg)
    {
        //console.log("http_reqGambleRecord=",msg);
        this.gameid = msg.gameid;
        this.bunchInfo = msg.bunchInfo;
        this.memberlist = msg.MembeListr;
        this.roomid = msg.roomid;
        // let myUsrId = UserMgr.getInstance().getUid();
        let mySeatID = this.getMyLogicSeatId();
        // for (let i in this.memberlist) {
        //     if(this.memberlist[i].id==myUsrId) {
        //         mySeatID = i;
        //         break;
        //     }
        // }
        viewLogicSeatConvertMgr.getInstance().setMySeatId(parseInt(mySeatID),msg.bunchInfo.seatcount);
    }
    reqMatchGameId(recordcode){ 
        let msg={
            recordcode:recordcode,
        }
        this.send_msg("http.reqMatchGameId", msg);
    }
    reqGambleRecord(bunchid)
    {
        this.plazzaFlag = true;
        let info = {
            bunchid:bunchid
        }
        this.send_msg("http.reqGambleRecord", info);
    }
    //大厅就是true
    getplazzaFlag()
    {
        return this.plazzaFlag;
    }
    getSeatCount()
    {
        return this.bunchInfo.seatcount;
    }
    getRoomOption()
    {
        return this.roomOption;
    }
    getRoomName()
    {
        return this.roomName;
    }
    //显示最终结算
    showFinalSettle(gameid){
        let ucfirst=function(str) {
            var str = str.toLowerCase();
            str = str.replace(/\b\w+\b/g, function(word){
              return word.substring(0,1).toUpperCase()+word.substring(1);
            });
            return str; 
        }
        let catecfg = GameCateCfg.getInstance().getGameById(gameid)
        let gamecode=catecfg.code;
        let upper=ucfirst(gamecode);
        this.roomOption = RoomOptionCfg.getInstance().getRoomDescToString(gameid,this.bunchInfo.roomValue);
        this.roomName = catecfg.name;
        let resname=`GameStatistics/${gamecode}/${upper}FinalSettle`; 
        //console.log("资源名字=",resname,catecfg,this.roomOption)
		cc.loader.loadRes(resname, (err, prefab:cc.Prefab)=> { 
			if(err){
				cc.error(err) 
			}else{
				let prefabNode = cc.instantiate(prefab);
                prefabNode.parent = cc.director.getScene();
				let prefabComp = null;
                //居中显示
                let winSize = cc.director.getVisibleSize();
                prefabNode.position=cc.p(winSize.width/2,winSize.height/2);  
			} 
		}); 
    }
    //单例处理
    private static _instance:BunchInfoMgr
    public static getInstance ():BunchInfoMgr{
        if(!this._instance){
            this._instance = new BunchInfoMgr();
        }
        return this._instance;
    }
}
