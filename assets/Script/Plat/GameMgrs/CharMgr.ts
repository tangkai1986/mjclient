//聊天管理
//TODO 管理房间聊天
import BaseMgr from "../Libs/BaseMgr";
import QuickAudioCfg from "./../CfgMgrs/QuickAudioCfg";
 
export default class CharMgr extends BaseMgr{
    routes:{} = null 
    //====== 
    ChatText:any = null
    uid:any = null

    constructor (){
        super(); 
        this.routes={
            
        }

    }
    sendText(msg){
        this.send_msg('http.reqChat',msg);
    }
    //单例处理
    private static _instance:CharMgr;
    public static getInstance ():CharMgr{
        if(!this._instance){
            this._instance = new CharMgr();
        }
        return this._instance;
    }
}