//茶馆管理
import BaseMgr from "../Libs/BaseMgr";
import LoginMgr from "./LoginMgr";
import UserMgr from "./UserMgr";

import ClubMemberMgr from "./ClubMemberMgr";
import ClubGameMgr from "./ClubGameMgr";
import RoomMgr from "./RoomMgr";
import FrameMgr from "./FrameMgr";
import LocalStorage from "../Libs/LocalStorage";
import ClubChatMgr from "./ClubChatMgr";

const IDENTITY_TYPE = {
	MEMBER:"0",
	MANAGE:"1",
	CAPTAIN:"3",
}

const CLUB_INFO_STATE = {
	ENTER:1,
	DISSOVE:2,
    EXIT:3,
    CHANGE:4,
    GAME:5,
    CHANGEM:6,
    APPLY:7,
    BLACK:11,
    CREATE:12,
}

const CLUB_GAME_STATE = {
	CREATE:1,
	COLSE:2,
    REMOVE:3,
}

const OPEN_GAME_MGR = {
	MEMBER:0,
	MANAGE:1,
}

window['IDENTITY_TYPE']=IDENTITY_TYPE;
window['CLUB_INFO_STATE']=CLUB_INFO_STATE;
window['CLUB_GAME_STATE']=CLUB_GAME_STATE;
window['OPEN_GAME_MGR']=OPEN_GAME_MGR;

export default class ClubMgr extends BaseMgr{
    //该茶馆简化数据 key:index data:{id, icon, name, gameCount, diamond}
    clublist:any = []
    /*该茶馆详细数据 key:id  
    data:{id, icon, name, mCount, mMax, OpenGame, diamond, 
            captainId, notice, memberlist, gameList, applyList, blackList}
    memberlist:{id, icon, name, identity, 
            diamond, diamondMax}    fightRecord:{id, id}
    applyList:{id, icon, name}
    blackList:{id, icon, name}

    */
    clubinfo:any = {}
    //搜索列表 key index {id,icon,name,notice,count,max,captain_name,apply}
    seeklist:any = {}
    //记录临时缓存
    recordList:any = {}
    //申请列表
    applyList:any = {};
    //黑名单列表
    blackList:any = {};
    //协议列表
    routes:{} = null
    //是否进入
    club_enter:boolean = false;
    //修改数据存储列表
    private club_change_list:any = {};
    //退出茶馆的ID
    dissolveID = null;
    constructor (){
        super();
        this.clublist = [];
        this.seeklist = {};
        this.recordList = {};
        this.applyList = {};
        this.blackList = {};
        this.routes={
            "ws.reqOnConnect":this.ws_reqOnConnect,
            "http.onClubInfo":this.http_onClubInfo,

            "http.reqClubList":this.http_reqClubList,
            "http.reqClubTop":this.http_reqClubTop,
            "http.reqClubInfo":this.http_reqClubInfo,
            "http.reqClubSeekList":this.http_reqClubSeekList,
            "http.reqClubExit":this.http_reqClubExit,
            "http.reqClubDissolve":this.http_reqClubDissolve,
            "http.reqClubApplyList":this.http_reqClubApplyList,
            "http.reqClubBlacklist":this.http_reqClubBlacklist,
            "http.reqClubApplyJoin":this.http_reqClubApplyJoin,
            "http.reqClubRefuseJoin":this.http_reqClubRefuseJoin,
            "http.reqClubJoinBlacklist":this.http_reqClubJoinBlacklist,
            "http.reqClubChangeAvater":this.http_reqClubChangeAvater,
            "http.reqClubChangeName":this.http_reqClubChangeName,
            "http.reqClubChangeNotice":this.http_reqClubChangeNotice,
            "http.reqClubChangeOpenGame":this.http_reqClubChangeOpenGame,
            "http.reqClubKick":this.http_reqClubKick,
            "http.reqClubJoin":this.http_reqClubJoin,
            "http.reqClubBlacklisRemove":this.http_reqClubBlacklisRemove,
            "http.reqClubRecordList":this.http_reqClubRecordList,
            "http.reqClubRecordData":this.http_reqClubRecordData,
            "http.reqClubRecharge":this.http_reqClubRecharge,
        }
    }

    ws_reqOnConnect(msg){
        console.log("ws_reqOnConnect")
        this.reqClubList(1);
    }
    private onClubEnterEvent(msg){
        let user_id = UserMgr.getInstance().getUid();
        if (msg.change_id == user_id){
            this.reqClubList();
        }else{
            if (msg.operation_id != user_id){
                this.reqClubList();
            }
        }
    }
    private onClubDissoveEvent(msg){
        this.reqClubList();
        let roomMgr = RoomMgr.getInstance()
        if (roomMgr.isInRoom()){
            let club = roomMgr.getEnterFangKaClubId();
            //console.log("onClubDissoveEvent", club);
            //console.log("onClubDissoveEvent", roomMgr.isGameStarted());
            if (club != 0 && club == msg.club_id){
                if (roomMgr.isGameStarted()){
                    // FrameMgr.getInstance().showHintBox(`茶馆${msg.club_name}已被解散，请珍惜最后一次对局！`, ()=>{});
                }else{
                    FrameMgr.getInstance().showHintBox(`茶馆${msg.club_name}已被解散，牌局结束！`, ()=>{
                        //添加返回大厅 待填充
                    });
                }
            }
        }else{
            let user_id = UserMgr.getInstance().getUid();
			if (msg.operation_id != user_id){
				FrameMgr.getInstance().showMsgBox(`茶馆${msg.club_name}已解散`, ()=>{}, "提示");
			}
        }
    }
    private onClubExitEvent(msg){
        let user_id = UserMgr.getInstance().getUid();
        this.reqClubList();
    }
    private onClubChangeEvent(msg){
        let user_id = UserMgr.getInstance().getUid();
        if (msg.operation_id != user_id){
            this.reqClubInfo(msg.club_id);
        }
    }
    private onClubChangeMemberEvent(msg){
        let user_id = UserMgr.getInstance().getUid();
        if (msg.operation_id != user_id){
            this.reqClubInfo(msg.club_id);
        }
    }
    private onClubApplyList(msg){
        let data = this.getClubInfo(msg.club_id);
        if (data != null){
            if (data.identity != IDENTITY_TYPE.MEMBER){
                this.reqClubInfo(msg.club_id);
            }
        }
    }


    //茶馆消息监听进行相对应数据刷新
    http_onClubInfo(msg){
        //console.log("http_onClubInfo state",msg.states.state);
        
        let data = msg.states;
        switch(data.state){
            case CLUB_INFO_STATE.ENTER:
                this.onClubEnterEvent(data);
                break;
            case CLUB_INFO_STATE.DISSOVE:
                this.onClubDissoveEvent(data);
                break;
            case CLUB_INFO_STATE.EXIT:
                this.onClubExitEvent(data);
                break;
            case CLUB_INFO_STATE.CHANGE:
                this.onClubChangeEvent(data);
                break;
            case CLUB_INFO_STATE.GAME:

                break;
            case CLUB_INFO_STATE.CHANGEM:
                this.onClubChangeMemberEvent(data);
                break;
            case CLUB_INFO_STATE.APPLY:
                this.onClubApplyList(data);
                break;
            case CLUB_INFO_STATE.CREATE:
                this.reqClubList();
                break
            default:
                break;
        }
    }
    //设置数据------------------------------------------------
    http_reqClubInfo(msg) {
        //console.log("ClubInfo", msg);
        this.setClubListData(msg);
        //console.log("ClubInfo..1", this.clublist);
    }
    http_reqClubList(msg){
        //console.log("ClubList");
        console.dir(msg);
        this.clublist = msg.list;
        LocalStorage.getInstance().setClubList(this.clublist)
        if (this.clublist.length != 0){
            this.club_enter = true;
        }else if(this.clublist.length == 0){
            this.club_enter = false;
        }
        if(this.clublist.length>0&&this.clublist[0].id)
        {
            this.reqClubInfo(this.clublist[0].id,1);
        }
    }
    http_reqClubTop(msg){
        //console.log("茶馆列表置顶消息",msg);
    }
    http_reqClubSeekList(msg){
        //console.log("SeekList");
        console.dir(msg);
        this.seeklist = msg.list;
    }
    http_reqClubApplyList(msg){
        let attributeFun = (item)=>{
            let bInList = false;
            for (let i = 0; i < this.applyList.length; ++i) {
                if(this.applyList[i].id==item.id){
                    bInList = true;
                }
            }
            if(!bInList) return item;
        }
        let id = msg.clubId;
        if (this.applyList.length == null){
            //console.log("this.applyList1",msg);
            this.applyList = msg.list;
        }else{
            let newApply = msg.list.filter(attributeFun)
            this.applyList = this.applyList.concat(newApply);
            //console.log("this.applyList2",msg);
            
        }
    }
    http_reqClubBlacklist(msg){
        let id = msg.clubId;
        if (this.blackList.length == null){
            this.blackList = msg.list;
        }else{
            this.blackList = this.blackList.concat(msg.list);
        }
    }

    http_reqClubApplyJoin(msg){ 

    }
    http_reqClubRefuseJoin(msg){

    }
    http_reqClubJoinBlacklist(msg){
        //console.log('加入黑名单后的返回', msg)
    }
    http_reqClubExit(msg){
        for(let i = 0;i<this.clublist.length;i++){
            if(this.clublist[i].id == this.dissolveID){
                this.clublist.splice(i,1);
                break;
            }
        }
        LocalStorage.getInstance().setClubList(this.clublist)
        this.reqClubList();
    }
    http_reqClubDissolve(msg){
        for(let i = 0;i<this.clublist.length;i++){
            if(this.clublist[i].id == this.dissolveID){
                this.clublist.splice(i,1);
                break;
            }
        }
        LocalStorage.getInstance().setClubList(this.clublist)
        this.reqClubList();
    }
    http_reqClubChangeAvater(msg){
        console.dir(msg);
        let id = msg.clubId,
            data = this.getClubListData(id);
        data.avater = msg.msg;
    }
    http_reqClubChangeName(msg){
        let id = this.club_change_list.id,
        name = this.club_change_list.name,
            data = this.getClubListData(id);
        data.name = name;
    }
    http_reqClubChangeNotice(msg){
        let id = this.club_change_list.id,
            notice = this.club_change_list.notice,
            data = this.getClubListData(id);
        data.notice = notice;
    }
    http_reqClubChangeOpenGame(msg){
        console.dir(msg);
        let id = this.club_change_list.id,
            openGame = this.club_change_list.identity,
            data = this.getClubListData(id);
        data.openGame = openGame;
    }
    http_reqClubKick(msg){
        let id = this.club_change_list.id,
            pid = this.club_change_list.playerid;
        this.removeClubMemberCount(id);
    }
    http_reqClubJoin(msg){
        this.addClubMemberCount(msg.club_id);
    }
    http_reqClubBlacklisRemove(msg){
        
    }
    http_reqClubRecordList(msg){
        //console.log("http_reqClubRecordList", msg)
        this.recordList = msg
    }
    http_reqClubRecordData(msg){
        //console.log("http_reqClubRecordData", msg)
        
    }
    http_reqClubRecharge(msg){
        let data = msg.data,
            club_data = this.getClubListData(data.clubId);
        club_data.diamond = data.diamond;
    }
    //获取数据-------------------------------------------------
    getClubList(){
        return this.clublist;
    }
    getClubInfo(id){
        return this.getClubListData(id);
    }
    getClubApplyList(id){
        return this.applyList;
    }
    getClubBlackList(id){
        return this.blackList;
    }
    getClubRecordList(){
        return this.recordList;
    }
    setClubListData(msg_data){
        let count = this.clublist.length;
        for (let i = 0; i < count; i++){
            let data = this.clublist[i];
            if (msg_data.id == data.id){
                this.clublist[i] = msg_data;
            }
        }
    }
    getClubListData(id){
        let count = this.clublist.length;
        for (let i = 0; i < count; i++){
            let data = this.clublist[i];
            if (id == data.id){
                return data
            }
        }
        return null;
    }
    getClubIdentity(id){
        let count = this.clublist.length;
        for (let i = 0; i < count; i++){
            let data = this.clublist[i];
            if (id == data.id){
                return data.identity;
            }
        }
        return "0";
    }
    //获取相对应茶馆的红点提示
    getClubApplyDot(id){
        let count = this.clublist.length;
        for (let i = 0; i < count; i++){
            let data = this.clublist[i];
            if (id == data.id){
                return data.apply;
            }
        }
        return 0;
    }
    //获取相对应茶馆的钻石数
    getClubDiamond(id){
        let count = this.clublist.length;
        for (let i = 0; i < count; i++){
            let data = this.clublist[i];
            if (id == data.id){
                return data.diamond;
            }
        }
        return 0;
    }
    getSeekList(){
        return this.seeklist;
    }
    //改变茶馆列表的排序
    changeClubList(id){
        let list = this.clublist;
        for(let i = 0;i<list.length;i++){
            if(id == list[i].id){
                let temp = list[i];
                list.splice(i,1);
                list.unshift(temp);   
                LocalStorage.getInstance().setClubList(list);
                break;
            }
        }
    }
    addClubMemberCount(id){
        //console.log("addClubMemberCount")
        let club_data = this.getClubListData(id),
            count = Number(club_data.mCount);
        count++;
        //console.log(club_data, id);
        if (club_data != null)
            club_data.mCount = ""+count;
        if (this.clublist[id] != null){
            let clubInfo = this.clublist[id]; 
            clubInfo.mCount=""+count;
        }
        //console.log(count);
    }
    removeClubMemberCount(id){
        let club_data = this.getClubListData(id),
            count = Number(club_data.mCount);
        count--;
        if (club_data != null)
            club_data.mCount = ""+count;
        if (this.clublist[id] != null){
            let clubInfo = this.clublist[id]; 
            clubInfo.mCount = ""+count;
        }
    }

    //获取用户信息
    reqClubs(uids){
    }
    getHeadPng(headid){
        let webRootUrl=LoginMgr.getInstance().getWetRootUrl();
        // body
        return `${webRootUrl}/static/avater/default_${headid}.png`
    } 
    reqCreate(icon, name){
        let clubinfo={
            'avater':icon, 
            'name':name,
        }
        this.send_msg('http.reqClubCreate',clubinfo);
    }
    reqClubList(restartType=null){
        let clubinfo={
            'page':1,
            'restartType':restartType
        }
        this.send_msg('http.reqClubList', clubinfo);
    }

    reqClubTop(club_id){
        let clubinfo={
            'club_id':club_id,
        }
        this.send_msg('http.reqClubTop', clubinfo);
    }

    reqClubInfo(club_id,type){
        let clubinfo={
            'id':club_id,
            'type':type
        }
        this.send_msg('http.reqClubInfo', clubinfo);
    }
    reqClubSeekList(name){
        let clubinfo={
            'keyword':name,
        }
        this.send_msg('http.reqClubSeekList', clubinfo);
    }
    reqApplyClub(club_id){
        let clubinfo={
            'id':club_id,
        }
        this.send_msg('http.reqApplyClub', clubinfo);
    }
    reqClubExit(club_id){
        let clubinfo={
            'id':club_id,
        }
        this.dissolveID = club_id;
        this.send_msg('http.reqClubExit', clubinfo);
    }
    reqClubDissolve(club_id){
        let clubinfo={
            'id':club_id,
        }
        this.dissolveID = club_id;
        this.send_msg('http.reqClubDissolve', clubinfo);
    }
    reqClubJoin(club_id, playerid){
        let clubinfo={
            'id':club_id,
            'playerid':playerid,
        }
        this.send_msg('http.reqClubJoin', clubinfo);
    }
    //未加入茶馆
    reqClubApplyList(club_id, page){
        if (page == 1){
            this.applyList = null
            this.applyList = {}
        }
        let clubinfo={
            'id':club_id,
            'page':page, 
        }
        this.send_msg('http.reqClubApplyList', clubinfo);
    }
    reqClubBlacklist(club_id, page){
        if (page == 1){
            this.blackList = null
            this.blackList = {}
        }
        let clubinfo={
            'id':club_id,
            'page':page, 
        }
        this.send_msg('http.reqClubBlacklist', clubinfo);
    }
    
    reqClubApplyJoin(club_id){
        let clubinfo={
            'id':club_id,
        }
        this.send_msg('http.reqClubApplyJoin', clubinfo);
    }

    reqClubRefuseJoin(club_id, playerId){
        let clubinfo={
            'id':club_id,
            'playerid':playerId,
        }
        this.send_msg('http.reqClubRefuseJoin', clubinfo);
    }

    reqClubJoinBlacklist(club_id, playerId){
        let clubinfo={
            'id':club_id,
            'playerid':playerId,
        }
        this.send_msg('http.reqClubJoinBlacklist', clubinfo);
    }
    reqClubBlacklisRemove(club_id, playerId){
        let clubinfo={
            'id':club_id,
            'playerid':playerId,
        }
        this.send_msg('http.reqClubBlacklisRemove', clubinfo);
    }
    //记录列表
    reqClubRecordList(club_id){
        let clubinfo={
            'id':club_id,
        }
        this.send_msg('http.reqClubRecordList', clubinfo);
    }
    reqClubRecordData(game_id){
        let clubinfo={
            'id':game_id,
        }
        this.send_msg('http.reqClubRecordData', clubinfo);
    }

    //界面控制修改
    reqClubChangeIcon(club_id, icon){
        let clubinfo={
            'id':club_id,
            'icon':icon,
        }
        this.club_change_list = clubinfo;
        this.send_msg('http.reqClubChangeAvater', clubinfo);
        //this.reqClubTop(club_id);
    }
    reqClubChangeName(club_id, name){
        let clubinfo={
            'id':club_id,
            'name':name,
        }
        this.club_change_list = clubinfo;
        this.send_msg('http.reqClubChangeName', clubinfo);
        //this.reqClubTop(club_id);
    }
    reqClubChangeNotice(club_id, notice){
        let clubinfo={
            'id':club_id,
            'notice':notice,
        }
        this.club_change_list = clubinfo;
        this.send_msg('http.reqClubChangeNotice', clubinfo);
        //this.reqClubTop(club_id);
    }
    reqClubChangeOpenGame(club_id, identity){
        let clubinfo={
            'id':club_id,
            'identity':identity,
        }
        this.club_change_list = clubinfo;
        this.send_msg('http.reqClubChangeOpenGame', clubinfo);
    }
    reqClubChangeIdentity(club_id, memberid, identity){
        let clubinfo={
            'id':club_id,
            'playerid':memberid,
            'identity':identity,
        }
        this.club_change_list = clubinfo;
        this.send_msg('http.reqClubChangeIdentity', clubinfo);
        //this.reqClubTop(club_id);
    }
    reqClubKick(club_id, member_id){
        let clubinfo={
            'id':club_id,
            'playerid':member_id,
        }
        this.club_change_list = clubinfo;
        this.send_msg('http.reqClubKick', clubinfo);
        //this.reqClubTop(club_id);
    }
    reqClubRecharge(club_id, diamond){
        let clubinfo={
            'id':club_id,
            'count':diamond,
        }
        this.send_msg('http.reqClubRecharge', clubinfo);
    }
 
    //单例处理
    private static _instance:ClubMgr;
    public static getInstance ():ClubMgr{
        if(!this._instance){
            this._instance = new ClubMgr();
        }
        return this._instance;
    }
}