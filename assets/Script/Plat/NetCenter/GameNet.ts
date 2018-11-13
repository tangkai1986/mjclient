import NetCode from "./NetCode";
import NetNotify from "./NetNotify";   
import SocketNet from "./SocketNet";
import FrameMgr from "../GameMgrs/FrameMgr"; 
import NetMgr from "./NetMgr";  
import NetErrMgr from "../GameMgrs/NetErrMgr"; 
import LogMgr from "../GameMgrs/LogMgr";
   
export default class GameNet{
	private static _instance = null;  
	private webhost;     
	private logenable=true;  
	private netIsConnect=false;
 
    public static getInstance() : GameNet{
        if (GameNet._instance == null){
            GameNet._instance = new GameNet();
        }
        return GameNet._instance;
	} 
	setWebHost(webhost)
	{
		this.webhost=webhost
	}
	//发送网络消息
	emit(route,msg)
	{   
		G_FRAME.netEmitter.emit(route,msg)
		return true;
	}
	setSocketNetToken(token)
	{
		SocketNet.getInstance().setToken(token);
	}

	//拼装数据
	send_msg(route,msg){ 
		//如果没有消息就构造一个
		if(msg==null||msg=='undefined')
		{
			msg={}
		}  
		//绑定一个消息id
		let info=NetMgr.getInstance().convertMsg(route,msg); 
		if(!info)
		{
			return 0;
		}
		let serverType=info.serverType;
		let newmsg=info.msg;
		switch(serverType)
		{
			case G_NETTYPE.httpPost://http post
				this.webPostReq(route,newmsg); 
				console.log("发哦送了数据httpPost===",route,newmsg)
			break;
			case G_NETTYPE.ws://ws
				this.websocket(route,newmsg); 
				console.log("发哦送了数据ws===",route,newmsg)
			break;
			case G_NETTYPE.httpGet://http get
				this.webGetReq(route,newmsg); 
				console.log("发哦送了数据httpGet===",route,newmsg)
			break;
			case G_NETTYPE.pomelo://pomelo
				this.pomeloReq(route,newmsg); 
				console.log("发哦送了数据pomelo===",route,newmsg)
			break;
		} 
		return serverType; 
	}
	//重发消息
    reSendMsgs(records){
		for(let i = 0;i<records.length;++i)
		{	
			let record=records[i];
			let serverType=record.serverType;
			let route=record.route;
			let msg=record.msg;	

			switch(serverType)
			{
				case G_NETTYPE.httpPost://http post
					this.webPostReq(route,msg); 
				break;
				case G_NETTYPE.ws://ws
					this.websocket(route,msg); 
				break;
				case G_NETTYPE.httpGet://http get
					this.webGetReq(route,msg); 
				break;
				case G_NETTYPE.pomelo://pomelo
					this.pomeloReq(route,msg); 
				break;
			} 
		}
	}
	//tcp请求
	pomeloReq(route,msg){  
		pomelo.request(route,msg)
	} 
	//tcp请求
 
    
	msgcb(route,code,data){  
		//onnotify容错在notifymgr中处理
		// if(route == 'onNotify') {
		// 	return;
		// }
		NetMgr.getInstance().doneWithRoute(route,code);
		//错误处理 
		//记录到操作log中
		LogMgr.getInstance().addRecevie(route);
		if(route=='http.queResult')//这个是服务器队列添加结果不予理会
		{
			//console.log("收到了http.queResult")
			return;
		} 
		if(data)
		{
			if(data.coolingtime!=null)
			{
				FrameMgr.getInstance().showTips(`操作太过频繁,请等待${data.coolingtime}秒再试`, null,35, cc.color(255,0,0), cc.p(0,0), "Arial", 1000); 
				return;
			}
		} 
		if(code!=null)
		{
			code=parseInt(code);
		}
		let errmsg=NetCode.getInstance().check(code)
		let ret=NetErrMgr.getInstance().dealWithError(code);
		if(ret)
		{
			return;
		}
		else
		{
			if (errmsg!=null){    
				//在这里去恢复房间数据
				//根据错误码去纠正错误  
				FrameMgr.getInstance().showTips(`${errmsg}`, null,35, cc.color(255,0,0), cc.p(0,0), "Arial", 1000);  
				return;
			}
		}  
		//刷新管理器的数据 
		let bBroadCast=NetNotify.getInstance().dealResp(route,data)  
		//广播网络消息 
		if(bBroadCast)
		{
			this.emit(route,data);
		}
	} 

	//http请求
	webPostReq(route,msg){ 
		let xhr = cc.loader.getXMLHttpRequest();   
		let self=this;
		xhr.onreadystatechange = function () {   
			if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {  
				let respone = xhr.responseText;   
				let resp = JSON.parse(respone)
				let head=resp.head;
				let body=resp.body;  
				self.msgcb(head.route,head.code,body)   
			}  
		};   
		// note: In Internet Explorer, the timeout property may be set only after calling the open()  
		// method and before calling the send() method.  
		xhr.timeout = 5000; 
		xhr.onerror = (error)=> {
            //console.log("客户端出错啦webPostReq")
		} 
		//console.log("发哦送了数据===",route,msg)
		xhr.open("POST", this.webhost,true); 
		xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");   
		xhr.send(JSON.stringify(msg)); 
		 

	} 
 
	connect(host,port,connectcb)
	{   
		//广播连接事件 
		let cfg={
			host:host,
			port:port,
			debug:true,
			msgcb:this.msgcb.bind(this),
			connectcb:connectcb, 
		}
		//console.log("连接配置=",JSON.stringify(cfg))
		pomelo.init(cfg)
		//告诉网络管理pomelo开始连接
		NetMgr.getInstance().pomeloConnecting();
	} 
	disconnect()
	{
		//
		pomelo.disconnect() 
	}

	websocket(route, msg){
		SocketNet.getInstance().send_msg(route, msg);
	}

	initWebSocket(url){
		return SocketNet.getInstance().initWebSocket(url);
	}

	closeWebSocket(url){
		SocketNet.getInstance().closeWebSocket(url);
	}

	//web get
	//http请求
	webGetReq(route, msg){ 
		let xhr = cc.loader.getXMLHttpRequest();   
		xhr.onreadystatechange = function () {   
			if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {  
				var httpStatus = xhr.statusText;
				var response = xhr.responseText;
				//console.log("Status: Got GET response! " + httpStatus);
			}else{
				//console.log("Status: fail GET response! " + httpStatus);
			}
		};   
		// note: In Internet Explorer, the timeout property may be set only after calling the open()  
		// method and before calling the send() method.  
		xhr.timeout = 5000; 
		xhr.onerror = (error)=> {
            //console.log("客户端出错啦webGetReq")
        }
		xhr.open("POST", msg);
		xhr.send(); 
		
		//console.log("发送=", route, msg)
	} 
} 
	
   
