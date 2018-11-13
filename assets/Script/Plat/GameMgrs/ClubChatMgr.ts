//茶馆管理
import BaseMgr from "../Libs/BaseMgr";
import LoginMgr from "./LoginMgr";
import UserMgr from "./UserMgr";



const CLUB_CHAT_TYPE = cc.Enum({
    TYPE_LABEL:0,		//普通文字类型
	TYPE_BLEND:1,		//混合文字图片类型
	TYPE_VOICE:2,		//语音类型
	TYPE_ROOM_ENTER:3, 	//进入房间
	TYPE_ROOM_MODIFICATION:4,	//房间修改
    TYPE_ROOM_EXIT:5,   //房间解散
})

window["CLUB_CHAT_TYPE"] = CLUB_CHAT_TYPE;

export default class ClubChatMgr extends BaseMgr{
    /*该茶馆详细数据
    
    club_chat:{id, icon, name, type, text, room_data}
    room_data:{id, name, type, paySource, payType, payCount, count, countMax, round, roundMax, time, state}
    */ 
    private club_id:number = null
    private club_chat:any = {}
    private club_web:WebSocket = null
    private club_url:string = ""
    private club_chat_max:number = 40;
    //协议列表
    routes:{} = null

    constructor (){
        super(); 
        this.club_id = -1;
        this.club_url = "";
        this.club_chat = {};
        this.routes={
            "http.reqWSUrl":this.http_reqWSUrl,
            "webSocketOpen":this.webSocketOpen,
            "ws.reqOnConnect":this.ws_reqOnConnect,
            "ws.reqSendClubChat":this.ws_reqSendClubChat,
            "ws.onClubChat":this.ws_onClubChat,
        }
    }
    //收包监测
    http_reqWSUrl(msg){
        //console.log("http_reqWSUrl")
        if (msg == ""){
            return ;
        }
        if (this.club_url != "" && (this.club_url != msg+"/")){
            this.close_websocket(this.club_url);
        }
        this.club_url = msg+"/";
        this.start_websocket(this.club_url);
    }
    closeSocket(){
        if (this.club_url != "")this.close_websocket(this.club_url);
        this.club_url = "";
    }
    webSocketOpen(){
        //console.log("webSocketOpen");
        this.reqOnConnect();
    }
    ws_reqOnConnect(msg){
        //console.log("ws_reqOnConnect");
    }
    ws_reqSendClubChat(){
        //console.log("ws_reqSendClubChat");
    }

    ws_onClubChat(msg){
        //console.log("ws_onClubChatroute",msg,this.club_chat);
        if (this.club_chat[msg.clubid] == null){
            this.club_chat[msg.clubid] = new Array();
        }
        if (msg.type == CLUB_CHAT_TYPE.TYPE_ROOM_MODIFICATION){
            this.refreshChatStrip(msg);
        }else if (msg.type == CLUB_CHAT_TYPE.TYPE_ROOM_EXIT){
            this.clearClubData(msg);
        }else{
            let roomMsgIdx = this.findSameRoomIdMes(msg);
            if(roomMsgIdx>=0) {
                this.club_chat[msg.clubid][roomMsgIdx]=msg;
            }
            else{
                this.club_chat[msg.clubid].push(msg);
            }
        }

        //聊天保存条目
        if (this.club_chat[msg.clubid].length > this.club_chat_max){
            this.club_chat[msg.clubid].splice(0,1);
        }
        // this.send_msg("ws.onClubChat",msg);
    }
    findSameRoomIdMes(msg)
    {
        let clubChatList = this.club_chat[msg.clubid];
        let roomMesIdx = -1;
        for (let chatIdx = 0; chatIdx < clubChatList.length; chatIdx++) {
            if(clubChatList[chatIdx].room_data.id==msg.room_data.id)
            {
                roomMesIdx = chatIdx;
                break;
            }
        } 
        return roomMesIdx;
    }
    //只删除房间创建的信息
    clearClubData(msg)
    {
        let list = this.club_chat[msg.clubid],
            count = list.length;
        for (let i = 0; i<count; i++){
            let data = list[i];
            let room = data.room_data;
            if (room.id == msg.room_data.id){
                room.state = msg.room_data.state;
                this.club_chat[msg.clubid].splice(i,1);
                break;
            }
        }
    }
    //删除房间信息
    clearClubAllData()
    {
        this.club_chat = {};
    }

    //发包
    reqWSUrl(){
        this.send_msg("http.reqWSUrl");
    }

    reqOnConnect(){
        let info = {
            url:this.club_url,
        }
        this.send_msg("ws.reqOnConnect", info);
    }

    reqSendClubChat(chat){
        let info = {
            url:this.club_url,
            clubid:chat.club_id,
            type:chat.type,
            text:chat.text,
        }
        this.send_msg("ws.reqSendClubChat", info);
    }

    //数据获取
    getClubChat(id){
        if (this.club_chat[id] == null){
            this.club_chat[id] = new Array();
        }
        return this.club_chat[id];
    }
    getClubChatMax(){
        return this.club_chat_max;
    }
    refreshChatStrip(msg){
        let list = this.club_chat[msg.clubid],
            count = list.length;
        if (count == null)
            return; 
        for (let i = 0; i<count; i++){
            let data = list[i];
            if (data.type == CLUB_CHAT_TYPE.TYPE_ROOM_ENTER){
                let room = data.room_data;
                if (room.id == msg.room_data.id){
                    room.state = msg.room_data.state;
                    if (msg.room_data.state == 1){
                        room.count = msg.room_data.count;
                        room.round = msg.room_data.round;
                    }
                    // else{
                    //     this.club_chat[msg.clubid].splice(i,1);
                    //     break;
                    // }
                }
            }
        }
    }

    //单例处理
    private static _instance:ClubChatMgr;
    public static getInstance ():ClubChatMgr{
        if(!this._instance){
            this._instance = new ClubChatMgr();
        }
        return this._instance;
    }
}