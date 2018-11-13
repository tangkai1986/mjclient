import LoginMgr from "../GameMgrs/LoginMgr";

 
export default class NetNotify{
	
	private static _instance = null;
	private m_listenlist=[];
	public static getInstance() : NetNotify{
        if (NetNotify._instance == null){
            NetNotify._instance = new NetNotify();
        }
        return NetNotify._instance;
	}
	regNotifyListener(listener){
		this.m_listenlist.push(listener)
	}
	unregNotifyListener(listener){
		//console.log("移除了监听=",listener,this.m_listenlist.length)
		for(let i = 0;i<this.m_listenlist.length;++i)
		{ 
			if(this.m_listenlist[i]==listener)
			{ 
				this.m_listenlist.remove(i);
				break;
			}
		}
	}
	dealResp(notifyname,msg){
		let bBroadCast=true;
		for(var i = 0;i<this.m_listenlist.length;i++)  
		{  
			var v=this.m_listenlist[i]
			let ret=v.dealResp(notifyname,msg);
			bBroadCast=bBroadCast&&ret;
		}
		return bBroadCast
	}  
}
