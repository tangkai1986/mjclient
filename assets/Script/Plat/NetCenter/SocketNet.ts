import RoomMgr from "../GameMgrs/RoomMgr";
import NetNotify from "./NetNotify";   
import FrameMgr from "../GameMgrs/FrameMgr";
 
export default class SocketNet{
    private static _instance = null;
    private SocketList:any = {};
    private EneterSocket:WebSocket = null;
    private bColse = false;
    private lockReconnect = false;  //避免ws重复连接
    private token = null;
    //心跳检测
        //timeout: 540000,        //9分钟发一次心跳
        //timeout: 3600,        //1分钟发一次心跳
    private timeout = 10000;        //3分钟发一次心跳
    private timeoutObj = null;
    private serverTimeoutObj = null;
    private tickReset = ()=>{
        if(this.timeoutObj) {
            clearTimeout(this.timeoutObj);
            this.timeoutObj=null;
        }
        if(this.serverTimeoutObj) {
            clearTimeout(this.serverTimeoutObj);
            this.serverTimeoutObj=null;
        }
        return this;
    };
    private tickStart = ()=> {
        let self = this;
        //存在心跳包
        if(this.timeoutObj) {
            return;
        }
        //存在超时回调
        if(this.serverTimeoutObj) {
            return;
        }
        this.timeoutObj = setTimeout(()=> {
            //这里发送一个心跳，后端收到后，返回一个心跳消息，
            //onmessage拿到返回的心跳就说明连接正常
            if(!self.EneterSocket) return;
            self.EneterSocket.send('ping');
            console.log("ping!")
            self.serverTimeoutObj = setTimeout(()=>{
                //如果超过一定时间还没重置，说明后端主动断开了
                //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
                if(self.EneterSocket)self.EneterSocket.close();     
            },self.timeout)
        },this.timeout)
    }
    public setToken(token)
    {
        this.token = token;
    }
    //发送网络消息
    private emit(route,msg)
    {   
        G_FRAME.netEmitter.emit(route,msg)
        return true;
    }

    private onOpen(msg, strUrl){
        //刷新管理器的数据 
        this.SocketList[strUrl] = this.EneterSocket;
        //this.EneterSocket = null;
        //console.log("this.onOpen", this.SocketList, strUrl, this.EneterSocket)
        this.EneterSocket.send(JSON.stringify({action:"ws.reqOnConnect",data:{url:null,token:this.token}}));
        //NetNotify.getInstance().dealResp("webSocketOpen", {});
        this.tickReset().tickStart();      //心跳检测重置
    }
    private onClose(msg, strUrl){
        //console.log("reqWSUrl onClose", msg);
        if (this.SocketList[strUrl] != null){
            delete this.SocketList[strUrl];
        }
        if (this.EneterSocket != null){
            delete this.EneterSocket;
        }
        this.reconnect(strUrl);
        //console.log("this.SocketList1", this.SocketList, strUrl, this.EneterSocket)
        // if (!this.bColse) this.initWebSocket(strUrl);
        // else this.bColse = false;
    }
    public reconnect(url) {
        if (this.lockReconnect) return;
        this.lockReconnect = true;
        setTimeout( ()=>{     //没连接上会一直重连，设置延迟避免请求过多
            this.initWebSocket(url);
            this.lockReconnect = false;
        }, 2000);
    }
    private onMessage(msg){
        this.tickReset().tickStart();      //拿到任何消息都说明当前连接是正常的
        if(msg.data == 'pong') {
            return;
        }
        //在房间内不进行俱乐部socket收发数据
        if(RoomMgr.getInstance().isInRoom()) {
            return;
        }
        var resp = JSON.parse(msg.data)
        //console.log("receive socket data",msg.data,resp.head.route)
        let route = resp.head.route;
        let data = resp.body;
        //数据有问题或者不合理不处理
        if(!data||data.length ==0) {
            return;
        }
        //刷新管理器的数据 
        NetNotify.getInstance().dealResp(route, data);
        //广播网络消息 
        this.emit(route, data);

        //console.log("websocket", route, data);
    }
    private onError(msg, strUrl){
        //console.log("onError", msg);
        if (this.SocketList[strUrl] != null){
            delete this.SocketList[strUrl];
        }
        if (this.EneterSocket != null){
            delete this.EneterSocket;
        }
        this.reconnect(strUrl);
    }

    public initWebSocket(strUrl){
        console.log("reqWSUrl", strUrl, this.SocketList);
        if (this.SocketList[strUrl] != null){
            //console.log("已建立连接");
            return ;
        }
        //无效地址不进行websocket链接
        if(!strUrl) {
            return;
        }
        let _web=null;
        try {
            _web = new WebSocket(strUrl);
            this.EneterSocket = _web;
            this.initEventHandle(strUrl);
        } catch (e) {
            //x]alert("line98");
            this.reconnect(strUrl);
            console.log(e);
        }
        //console.log("initWebSocket", _web, strUrl);
        // this.EneterSocket = _web;
    }
    public initEventHandle(strUrl) {

        this.EneterSocket.onopen = (evt)=>{
            this.onOpen(evt, strUrl);
        };
        this.EneterSocket.onclose = (evt)=>{
            this.onClose(evt, strUrl);
        };
        this.EneterSocket.onmessage = (evt)=>{
            this.onMessage(evt);
        };
        this.EneterSocket.onerror = (evt)=>{
            this.onError(evt, strUrl);
        };
    }
    public send_msg(route, msg){
        //在房间内不进行俱乐部socket收发数据
        if(RoomMgr.getInstance().isInRoom()) {
            return;
        }
        //监测
        if (msg.url == null || msg.url == ""){
            //console.log("连接地址有误", msg.url)
            return ;
        } 
        let websocket = this.SocketList[msg.url];
        if (websocket == null){
            console.log("尚未连接该地址", msg.url)
            return ;
        }
        //构建发包
        msg.url = null;
        var info = {
            action:route,
            data:msg,
        }
        console.log("send socket data",msg)
        //websocket已经可以发送才执行send,不然不做发送websocket
        if (websocket && typeof(websocket) == 'object' && websocket.readyState === 1) {
            websocket.send(JSON.stringify(info));
        }
        else{
            return;
        }
    }
    public closeWebSocket(strUrl){
        let websocket = this.SocketList[strUrl];
        console.log("连接地址有误", websocket, strUrl);
        if (websocket == null){
            //console.log("无需清理，无连接", strUrl)
            return ;
        }
        this.bColse = true;
        websocket.close();
        delete this.SocketList[strUrl];
    }

    public static getInstance() : SocketNet{
        if (SocketNet._instance == null){
            SocketNet._instance = new SocketNet();
            //SocketNet._instance.heartbeatSchedule();
        }
        return SocketNet._instance;
    }
}
