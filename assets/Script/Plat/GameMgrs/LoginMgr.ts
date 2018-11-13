import BaseMgr from "../Libs/BaseMgr";
import GameNet from "../NetCenter/GameNet";
import NetNotify from "../NetCenter/NetNotify";
import PlatMgr from "./PlatMgr";
import ServerMgr from "../../AppStart/AppMgrs/ServerMgr"; 
import NetMgr from "../NetCenter/NetMgr";
import RoomMgr from "./RoomMgr";
import LocalStorage from "../Libs/LocalStorage";
import FrameMgr from "./FrameMgr";
import GEventDef from "./GEventDef";
import BetMgr from "./BetMgr";
import GameCateCfg from "../CfgMgrs/GameCateCfg";
import ClubChatMgr from "./ClubChatMgr";
  
enum ServerType {
	server_gate=1,
    server_connector
} 
enum PlatState {
	state_gate=1,
    state_connector,
    state_plat,
    state_game,
} 
export default class LoginMgr extends BaseMgr{
 
    private connector_host=null;
    private connector_port=null;  
    private gate_host=null;
    private gate_port=null;
    private m_servertype:ServerType = ServerType.server_gate;
    private _uid=null;
    private _token;
    private _webRootUrl;
    private serverCfg=null
    private plat_state=PlatState.state_gate; 
    routes:{} = null
    private b_switchAccount=false;
    private b_prepareSwitchToGameSvr=false;//准备切换到游戏服务器
    private b_prepareSwitchToDatingSvr=false;//准备切换到大厅服务器
    private b_inDaTing=true;//是否在大厅中
    logout(){
        this.b_switchAccount=true;
        this.send_msg('connector.entryHandler.logout');
    }
    //注销
    logOut(){ 
        //清空微信登录信息缓存
        ClubChatMgr.getInstance().closeSocket();
        LocalStorage.getInstance().removeWeChatToken();
        this.destroy() 
        NetMgr.getInstance().destroy();
        pomelo.clearListener();
    }
    destroy(){
        //console.log("LoginMgr清空了自己")
        super.destroy();
        delete LoginMgr._instance;
        LoginMgr._instance=null; 
    }
    //设置当前状态
    setState(plat_state)
    {
        this.plat_state=plat_state;
    }
    constructor (){
        super(); 
        this.routes = {
            'http.reqRegister' : this.http_reqRegister,
            'http.reqLogin' : this.http_reqLogin,
            'gate.entry.req' : this.gate_entry_req,
        }
        this.serverCfg=ServerMgr.getInstance().getServerCfg();
        if(this.serverCfg.platSvrHost.indexOf('.com')>=0)
        {
            this._webRootUrl=this.serverCfg.platSvrHost
        }
        else
        {
            this._webRootUrl=`http://${this.serverCfg.platSvrHost}:${this.serverCfg.platSvrPort}`
        } 
        GameNet.getInstance().setWebHost(`${this._webRootUrl}`) 

        
        // 将这个按键监听注册到全局
        if (cc.sys.os == cc.sys.OS_ANDROID){
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyDown.bind(this), window)
        }
        // 注册前后台切换事件
        cc.game.on(cc.game.EVENT_HIDE, () => {
            G_FRAME.globalEmitter.emit("EnterBackground");
        });
        cc.game.on(cc.game.EVENT_SHOW, () => {
            G_FRAME.globalEmitter.emit("EnterForeground");
        });
    }
    
    onKeyDown (event) {
        switch (event.keyCode) {
            case cc.KEY.back:
                this.gemit("backPressed");
                break;
            default:
                //console.log("啥瘠薄key, 不处理")
        }
    }

    getWetRootUrl()
    {
        return this._webRootUrl;
    }
    getUid()
    {
        return this._uid;
    }
    restartGame(){ 
        cc.audioEngine.stopAll();
        cc.game.restart();
    }
    kicked(){   
        LoginMgr.getInstance().logOut();
        if(this.b_switchAccount)//判断自己是不是切换账号，就暴力重启
        {  
            this.restartGame();
        }
        else{
            FrameMgr.getInstance().showMsgBox("重复进入服务器,可能是网络状况不佳或在别处登录此账号,请重新尝试",this.ok_cb.bind(this),'断开连接');
        }
    }
    private ok_cb(event){
        this.restartGame(); 
    }
    //连接服连接状态回调
    connectConnector(event_type,event){
        switch(event_type)
        {
            case 'connect': 
                NetMgr.getInstance().pomeloConnected();
                NetMgr.getInstance().clearPomeloReqs();
                //console.log("连接上了",this.plat_state)
                switch(this.plat_state)
                {
                    case PlatState.state_connector:   
                        if(this.b_inDaTing)
                        {
                            this.setState(PlatState.state_plat)
                            PlatMgr.getInstance().enterPlat();
                        }
                        else
                        {
                            this.setState(PlatState.state_game);
                            PlatMgr.getInstance().enterGameSvr();
                        }
                    break;
                    case PlatState.state_plat: 
                        PlatMgr.getInstance().enterPlat(); 
                    break;
                    case PlatState.state_game: 
                        PlatMgr.getInstance().enterGameSvr();
                    break;
                }
            break;
            case 'disconnect':
                //console.log("收到断开连接的消息")
                //console.log("大厅状态this.b_inDaTing=",this.b_inDaTing)
                //console.log("切服状态this.b_prepareSwitchToGameSvr=",this.b_prepareSwitchToGameSvr)
			    this.gemit('ge_close_gonggao');  
                //如果在大厅中 
                if(this.b_inDaTing)
                {
                    if(this.b_prepareSwitchToGameSvr)
                    {
                        //如果是准备切换到子游戏，那么就将大厅状态去除
                        this.b_inDaTing=false;//不在大厅中
                        this.plat_state=PlatState.state_gate; 
                        this.b_prepareSwitchToGameSvr=false;
                        //console.log("正在切服到游戏服中this.loginPomelo")
                        this.loginPomelo();
                    }
                    else
                    {
                        //console.log("直接连接游戏服")
                        //发起重连 
                        //告诉网络管理pomelo断开了
                        NetMgr.getInstance().pomeloDisconnected();
                        GameNet.getInstance().connect(this.connector_host,this.connector_port,this.connectcb.bind(this)); 
                    }
                }
                else
                { 
                    if(this.b_prepareSwitchToDatingSvr)
                    {
                        //console.log("this.b_prepareSwitchToDatingSvr步骤1")
                        //如果是准备切换到大厅，那么就将大厅状态设置为true
                        this.b_inDaTing=true;//在大厅中
                        this.plat_state=PlatState.state_gate; 
                        this.b_prepareSwitchToDatingSvr=false;
                        this.start_module(G_MODULE.Plaza);
                        this.loginPomelo();
                    }
                    else{
                        //console.log("this.b_prepareSwitchToDatingSvr=false步骤2")
                        //发起重连 
                        //告诉网络管理pomelo断开了
                        NetMgr.getInstance().pomeloDisconnected();
                        GameNet.getInstance().connect(this.connector_host,this.connector_port,this.connectcb.bind(this)); 
                    }
                }
            break;
            case 'onKick':
                this.kicked();
            break;
        }
    }
    //pomelo gate的连接回调
    gateConnectCb(event_type,event){
        switch(event_type)
        {
            case 'connect': 
                //清除pomelo的发送队列
                NetMgr.getInstance().pomeloConnected();
                NetMgr.getInstance().clearPomeloReqs(); 
                this.queryEntry();//获得大厅入口 
                 
            break;
            case 'disconnect': 
            
			    this.gemit('ge_close_gonggao');
                //gate断开有两种情况，一种是获取到了游戏服后断开，一种是gate服连接被拒
                //console.log("断开了gate")
                //告诉网络管理pomelo断开了
                NetMgr.getInstance().pomeloDisconnected();
                switch(this.plat_state)
                {
                    case PlatState.state_connector:
                        //如果当前状态是连接服状态则去重新连接连接服
                        this.m_servertype=ServerType.server_connector;
                        GameNet.getInstance().connect(this.connector_host,this.connector_port,this.connectcb.bind(this));
                    break;
                    case  PlatState.state_gate: 
                        //如果当前状态是gate则在这里重连gate
                        GameNet.getInstance().connect(this.gate_host,this.gate_port,this.connectcb.bind(this)); 
                    break;
                }
            break;
            case 'onKick':
                this.kicked();
            break;
        }
    }
    connectcb(event_type,event){  
        switch(this.m_servertype)
        {
            case ServerType.server_gate: 
                this.gateConnectCb(event_type,event)
            break;
            case  ServerType.server_connector:
                this.connectConnector(event_type,event)
            break;
        } 
	}  
	//去获取连接服ip和端口
	queryEntry(){
        //console.log("去获取连接服ip和端口")
		let route = 'gate.entry.req'; 
		let msg={ 
			'token':this._token,
		} 
		GameNet.getInstance().send_msg(route,msg);
    }  
    //获取到连接服务器后就断开gate
    gate_entry_req (msg){
        //body
        //console.log("获取连接服成功后去断开gate")
        this.connector_host=msg.host;
        this.connector_port=msg.port;
        this.setState(PlatState.state_connector);
        GameNet.getInstance().disconnect();
        //并且去连接
    }  
    //登录pomelo长连接服
    loginPomelo(msg=null)    //服务器返回数据msg
    {  
        //body  
        this.m_servertype=ServerType.server_gate
        if(msg)
        {
            this._uid=msg.uid;
            if(!window['__errorUserInfo'])
            {
                window['__errorUserInfo']={};
            }
            window['__errorUserInfo']['uid']=msg.uid;
            console.log("loginPomelo",msg.token);
            this._token=msg.token;  
            //在网络管理中记录下登录信息
            NetMgr.getInstance().setLoginInfo(this._uid,this._token)
            GameNet.getInstance().setSocketNetToken(this._token);
        }
        //登录成功后连接gate
        //如果在大厅状态中,就去登录大厅
        if(this.b_inDaTing)
        {
            let servercfg=ServerMgr.getInstance().getServerCfg();
            this.gate_host=servercfg.gameSvrHost;
            this.gate_port=servercfg.gameSvrPort;
            // 判断是否微信登陆
            let cache = this.getWeChatLoginCache() || {};
            if (cache.plat == 2) {
                cache.uid= this._uid;
                cache.token= this._token;
                cache.gate_host= this.gate_host;
                cache.gate_port= this.gate_port;
                //console.log("cachexxxxxxxxxxxxxxxxxxxxxxxxxxxxx=",cache)
                this.setWeChatLoginCache(cache);
            }
        }
        else 
        { 
            let gameid=BetMgr.getInstance().getGameId();
            let game=GameCateCfg.getInstance().getGameById(gameid);
            //console.log("连接子游戏=",game.code)
            let cfg=ServerMgr.getInstance().getSubGameCfg(game.code)
            this.gate_host=cfg.host;
            this.gate_port=cfg.port;
        }
        GameNet.getInstance().connect(this.gate_host,this.gate_port,this.connectcb.bind(this));
    }
    setLoginCache (data) {
        this._uid = data.uid;
        this._token = data.token;
        NetMgr.getInstance().setLoginInfo(data.uid,data.token); 
        GameNet.getInstance().setSocketNetToken(data.token);
        //console.log("token=",data.token)
        this.gate_host = data.gate_host;
        this.gate_port = data.gate_port;
    }
    weChatAutoLogin () {
        this.m_servertype=ServerType.server_gate
        GameNet.getInstance().connect(this.gate_host,this.gate_port,this.connectcb.bind(this));
    }
    // 微信登陆需要记录登陆信息
    // token 验证失败的时候取上次微信缓存信息重新登陆
    weChatLogin (msg) {
        this.setWeChatLoginCache(msg);
        this.reqLogin(msg)
    }
    //断开大厅,准备跳转游戏服务器
    disconnectDaTing(){
        //console.log("哈哈哈=disconnectDaTing")
        this.b_prepareSwitchToGameSvr=true;
        GameNet.getInstance().disconnect();
    }
    
    //断开游戏服跳转大厅
    disconnectGameSvr(){
        //console.log("哈哈哈=disconnectGameSvr") 
        this.b_prepareSwitchToDatingSvr=true;
        GameNet.getInstance().disconnect();
    }
    //登录nodejs服回调
    http_reqLogin (msg){ 
        this.loginPomelo(msg)
    } 
    //注册nodejs服回调
    http_reqRegister (msg){
        //body
        this.loginPomelo(msg)
    }
    //请求登录nodejs服
    reqLogin (msg){ 
        msg.gameSvrTag=this.serverCfg.gameSvrTag 
        this.send_msg('http.reqLogin',msg) 
    }
    //请求注册nodejs服
    reqRegister (msg){ 
        msg.gameSvrTag=this.serverCfg.gameSvrTag 
        this.send_msg('http.reqRegister',msg) 
    }
    getToken(){
        return this._token;
    }
    getHost () {
        return this.gate_host
    }
    getPort () {
        return this.gate_port
    }
    // 微信登陆数据写入缓存
    setWeChatLoginCache (data) {
        // LocalStorage.getInstance().setData("WeChatToken", data);
        LocalStorage.getInstance().setWeChatToken(data);
    }
    // 获取微信登陆本地缓存
    getWeChatLoginCache () {
        // return LocalStorage.getInstance().getData("WeChatToken");
        return LocalStorage.getInstance().getWeChatToken();
    }
    //单例处理
    private static _instance:LoginMgr;
    public static getInstance ():LoginMgr{
        if(!this._instance){
            this._instance = new LoginMgr();
        }
        return this._instance;
    }
}