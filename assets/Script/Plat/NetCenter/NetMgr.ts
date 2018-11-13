import GameNet from "./GameNet";
import LoginMgr from "../GameMgrs/LoginMgr";

enum G_NETTYPE
{
	httpPost=1,
	ws,
	httpGet,
	pomelo
} 
window['G_NETTYPE']=G_NETTYPE;
let netdef_reqmaxtime=10000;
export default class NetMgr{  
	private static _instance = null;    
	private msgindex=0;//消息索引
	private msgrecords={};
	private _uid=null;
	private _token=null;
	private timer_req=null;//请求的事件检测定时器 
	private reconnectingRecord={};
    public static getInstance() : NetMgr{
        if (NetMgr._instance == null){
            NetMgr._instance = new NetMgr();
        }
        return NetMgr._instance;
	}  
	//获取发送记录
	getMsgRecords(){
		return this.msgrecords;
	}
	//设置登录信息
	setLoginInfo(uid,token)
	{
		this._uid=uid;
		this._token=token; 
	}
	constructor(){ 
		window['g_netMgr']=this;
		this.timer_req=setInterval(this.checkReq.bind(this),5)
	}
	restartTimer(){
		if(this.timer_req)
		{
			clearInterval(this.timer_req);
			this.timer_req=null;
		}
		this.timer_req=setInterval(this.checkReq.bind(this),5)
	}
	//高数网络管理pomelo断开了
	pomeloDisconnected(){
		//console.log("告诉网络管理pomelo断开了")
		this.reconnectingRecord[G_NETTYPE.pomelo]=true;
	}
	//告诉网络管理pomelo正在连接中
	pomeloConnecting(){
		this.reconnectingRecord[G_NETTYPE.pomelo]=true;
	}
	pomeloConnected(){
		if(this.reconnectingRecord[G_NETTYPE.pomelo])
		{
			delete this.reconnectingRecord[G_NETTYPE.pomelo];
		}
	}
	//在LoginMgr重连后清空pomelo的请求
	clearPomeloReqs(){ 
		//console.log("清空pomelo记录")
		//清除pomelo发送记录
		if(this.reconnectingRecord[G_NETTYPE.pomelo])
		{
			delete this.reconnectingRecord[G_NETTYPE.pomelo];
		}
		//this.msgrecords={};
		for(let route in this.msgrecords)
		{
			let record=this.msgrecords[route];
			if(record.serverType==G_NETTYPE.pomelo) 
			{
				delete this.msgrecords[route];
			}
		} 		
	}
	//重发pomelo的消息
	resendPomeloReqs(){	
		//console.log("重发pomelo记录")
		//说明重新连接上了去除重连pomelo的记录
		if(this.reconnectingRecord[G_NETTYPE.pomelo])
		{
			delete this.reconnectingRecord[G_NETTYPE.pomelo];
		}		
		//找到pomelo的发送记录重新发送
		let pomeloReSendMsgs=[];	
		for(let route in this.msgrecords)
		{
			let record=this.msgrecords[route];
			if(record.serverType==G_NETTYPE.pomelo) 
			{
				pomeloReSendMsgs.push(record);
			}
		} 
		//重发pomelo的消息
		if(pomeloReSendMsgs.length>0)
		{
			GameNet.getInstance().reSendMsgs(pomeloReSendMsgs);
		} 		
	}
 
	//检测发送队列
	checkReq(){
		//超时的服务器类型 
        //记录需要重新投递的http消息队列
		let httpReSendMsgs=[];
		//记录需要重连的网络
		let webNeedReconnect={}; 
		let needShowJuHua=false;
		for(let route in this.msgrecords)
		{  
			let record=this.msgrecords[route];
			if(record.serverType==G_NETTYPE.ws){
				//先过滤掉ws服务器
				continue;
			}
			let date=new Date()
			let time = Date.parse(date);
			////console.log("需要显示菊花route=",route)
			needShowJuHua=true;
			if(time-record.time>netdef_reqmaxtime)
			{ 
				//如果是当前类型服务器已经停止了则直接不考虑其超时问题,直接加入到重连成功后的重发队列并移除
				//在重连前都要记录重发时间
				let date=new Date()
				let time = Date.parse(date) ;
				record.time=time;//重置发送时间
				switch(record.serverType)
				{
					case G_NETTYPE.pomelo://表示长连接的服务器  
					{ 
						//说明需要重新连接
						webNeedReconnect[record.serverType]=true;
						record.waitreconnect=true;  
					}
					break;
					case G_NETTYPE.httpPost:
					case G_NETTYPE.httpGet:
					{ 
						//短连接部分直接插入重新投递
						httpReSendMsgs.push(record); 
					}
					break;
				} 
			}
		} 
		//重发http的消息
		if(httpReSendMsgs.length>0)
		{
			GameNet.getInstance().reSendMsgs(httpReSendMsgs);
		}  
		for(let serverType in webNeedReconnect)
		{  
			//如果不是在重连中就去重连并且设置重连标记为true
			if(!this.reconnectingRecord[serverType])
			{
				//去断开当前连接 
				this.reconnectingRecord[serverType]=true;
				////console.log("需要显示菊花serverType=",serverType)
				switch(serverType)
				{					
					case G_NETTYPE.pomelo://表示长连接的服务器 
						//console.log("在这里断开了") 
						GameNet.getInstance().disconnect();//LoginMgr里面会监听重连成功后的消息
					break;
					case G_NETTYPE.ws:
					break;
				}
			}
		}
		//当前类型有连接上就菊花
		for(let serverType in this.reconnectingRecord)
		{   
			needShowJuHua=true
		}
		//只要有  
		let scene=cc.director.getScene();
		let juhuaNode=scene.getChildByTag(this.getJuHuaTag())
	    //这里去刷新菊花
		if(juhuaNode)
		{   
			let ctrl=juhuaNode.getComponent('MsgBoxLoadingAni');
			ctrl.updateJuHua(needShowJuHua); 
		} 
	}
	getJuHuaTag(){
		return 20180325;
	}
	//清除定时器
	clearTimer(){
		if(this.timer_req!=null){
			clearTimeout(this.timer_req);
			this.timer_req=null;
		}
	}
	destroy(){
		this.clearTimer();
		delete NetMgr._instance;
		NetMgr._instance=null;
	}
	//转换消息成带msgindex的格式
	convertMsg(route,msg)
	{
		let words=route.split('.');
		let wordslen= words.length 
		let serverType=-1;
		let ret=null;
		let newmsg=null;
		if (wordslen<=0){ 
			return ret;
		}
		let server=words[0]; 
		switch(route)
		{
			case 'http.reqLogin':
			case 'http.reqRegister':
			case 'http.reqGameSwitch':
			case 'http.reqPoint':
			break;
			default:
			if(this._token==null)
			{
				return -1;
			}
			break;

		}
		switch(server)
		{
			case 'http':
				serverType=G_NETTYPE.httpPost;
				//判断http投递情况
                newmsg={
					head:{ 
						msgindex:this.msgindex,
						token:this._token,
						route:route,
					},
					body:msg
				}
				
			break;
			case 'ws':
				serverType=G_NETTYPE.ws;
				newmsg = msg;
				newmsg.token = this._token;
				//判断ws投递情况
			break;
			case 'hget':
				serverType=G_NETTYPE.httpGet;
				//判断hget投递情况
			break;
			default:
				serverType=G_NETTYPE.pomelo;
				msg.msgindex=this.msgindex;
				//判断pomelo投递情况
			break;
		} 
		//将消息保存下来
		
		let date=new Date()
		let time = Date.parse(date) ;
		let newRecord={};
		newRecord['time']=time;
		newRecord['serverType']=serverType;
		newRecord['route']=route;
		if(newmsg)
		{
			newRecord['msg']=newmsg; 
		}
		else
		{
			newRecord['msg']=msg; 
		}
		//判断这个服务器是否在重连，如果是在重连则加入重连后发送的队列
		if(this.reconnectingRecord[newRecord['serverType']])
		{
			//记录成等待重连后发送
			newRecord['waitreconnect']=true; 
		}
		else{
			//类型是websocket则不加入到发送队列
			if(serverType!=G_NETTYPE.ws) {
				this.msgrecords[route]=newRecord
			}
			ret={
				serverType:serverType,
				msg:newRecord['msg'],
			}
		}
		this.msgindex++; 
		return ret;
	}
	//消息回复后的处理
	doneWithRoute(route,code){ 
		if(this.msgrecords[route])
		{ 
			delete this.msgrecords[route];
		} 
		let scene=cc.director.getScene();
		let juhuaNode=scene.getChildByTag(this.getJuHuaTag())
	    //去除菊花
		if(juhuaNode)
		{   
			let ctrl=juhuaNode.getComponent('MsgBoxLoadingAni');
			ctrl.updateJuHua(false); 
		} 
	} 
} 
	
   
