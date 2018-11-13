//茶馆管理
import BaseMgr from "../Libs/BaseMgr";
import LoginMgr from "./LoginMgr";
import UserMgr from "./UserMgr";

export default class ClubMemberMgr extends BaseMgr{
    /*该茶馆详细数据
    memberlist:{id, icon, name, identity, 
            diamond, diamondMax}
    */ 
    club_id:number = null
    memberlist:any = {}
    //协议列表
    routes:{} = null
    //是否进入
    refresh_club_id:number = 0;
    //修改数据存储列表
    private club_change_list:any = {};

    constructor (){
        super(); 
        this.club_id = -1;
        this.refresh_club_id = 0;
        this.memberlist = {};
        this.routes={
            "http.onClubInfo":this.http_onClubInfo,

            "http.reqClubList":this.http_reqClubList,
            "http.reqClubInfo":this.http_reqClubInfo,
            "http.reqClubMember":this.http_reqClubMember,
            "http.reqClubClearDiamond":this.http_reqClubClearDiamond,
            "http.reqClubChangeIdentity":this.http_reqClubChangeIdentity,
            "http.reqClubKick":this.http_reqClubKick,
        }
    }

    private onClubEnterEvent(msg){
        let user_id = UserMgr.getInstance().getUid();
        if (msg.change_id != user_id){
            this.reqClubMember(msg.club_id, 1);
        }
    }
    private onClubExitEvent(msg){
        let user_id = UserMgr.getInstance().getUid();
        if (msg.change_id != user_id){
            this.removeClubMember(msg.club_id, msg.change_id);
        }
    }
    private onClubChangeMemberEvent(msg){
        let user_id = UserMgr.getInstance().getUid();
        if (msg.operation_id != user_id){
            this.refresh_club_id = msg.club_id;
        }
    }

    //茶馆消息监听进行相对应数据刷新
    http_onClubInfo(msg){
        if (this.club_id != msg.states.club_id)
            return;
        let data = msg.states;
        switch(data.state){
            case CLUB_INFO_STATE.ENTER:
                this.onClubEnterEvent(data);
                break;
            case CLUB_INFO_STATE.EXIT:
                this.onClubExitEvent(data);
                break;
            case CLUB_INFO_STATE.CHANGEM:
                this.onClubChangeMemberEvent(data);
                break;
            case CLUB_INFO_STATE.APPLY:
                break;
            default:
                break;
        }
    }
    http_reqClubList(){
        if (this.refresh_club_id != 0){
            this.reqClubMember(this.refresh_club_id, 1);
            this.refresh_club_id = 0;
        }
    }
    http_reqClubInfo(){
        if (this.refresh_club_id != 0){
            this.reqClubMember(this.refresh_club_id, 1);
            this.refresh_club_id = 0;
        }
    }

    http_reqClubClearDiamond(msg){
        let id = this.club_change_list.id,
            pid = this.club_change_list.playerid,
            data = this.getClubMemberData(pid);
        if (id != this.club_id)
            return;
        data.diamond = 0;
    }
    
    http_reqClubChangeIdentity(msg){
        this.reqClubMember(this.club_id, 1);
    }

    http_reqClubKick(msg){
        let id = this.club_id,
            pid = msg.playerid;
        if (id != this.club_id)
            return;
        this.removeClubMember(id, pid);
    }

    http_reqClubMember(msg){
        //console.log("ClubMember");
        console.dir(msg);
        let id = msg.clubId;
        if (this.club_id != id)
            return;
        if (this.memberlist.length == null){
            this.memberlist = msg.list;
        }else{
            this.memberlist = this.memberlist.concat(msg.list);
        }
    }
    //数据获取
    
    getClubMemberList(){
        //console.log(this.memberlist)
        return this.memberlist;
    }
    
    getClubMemberData(playerid){
        let member_list = this.memberlist,
            count = member_list.length;
        for (let i = 0; i < count; i++){
            let data = member_list[i];
            if (playerid == data.id){
                return data
            }
        }
        return null;
    }


    //数据修改
    removeClubMember(club_id, playerid){
        let member_list = this.memberlist,
            count = member_list.length;
        for (let i = 0; i < count; i++){
            let data = member_list[i];
            if (playerid == data.id){
                member_list.splice(i,1);
                break
            }
        }
    }


    reqClubTop(club_id){
        let clubinfo={
            'club_id':club_id,
        }
        this.send_msg('http.reqClubTop', clubinfo);
    }
    //发包
    reqClubMember(club_id, page){
        if (page == 1){
            this.memberlist = null
            this.memberlist = {}
        }
        let clubinfo={
            'id':club_id,
            'page':page, 
        }
        this.club_id = club_id;
        this.send_msg('http.reqClubMember', clubinfo);
    }
    
    reqClubClearDiamond(club_id, member_id){
        let clubinfo={
            'id':club_id,
            'playerid':member_id,
        }
        this.club_change_list = clubinfo;
        this.send_msg('http.reqClubClearDiamond', clubinfo);
        //this.reqClubTop(club_id);
    }
    
    //单例处理
    private static _instance:ClubMemberMgr;
    public static getInstance ():ClubMemberMgr{
        if(!this._instance){
            this._instance = new ClubMemberMgr();
        }
        return this._instance;
    }
}