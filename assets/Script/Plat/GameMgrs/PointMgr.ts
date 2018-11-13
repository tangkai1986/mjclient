
import BaseMgr from "../Libs/BaseMgr";
import MyUdid from "../Libs/MyUdid";
 
export default class PointMgr extends BaseMgr{
    routes:{} = null 
    ID:null;
    constructor (){
        super(); 
        this.routes={
            
        }
        this.getID();
    }

    getID(){
        this.ID = MyUdid();
    }
    //客户端启动
    lunchPoint(){
        //this.sendmsg(3)
    }
    //微信登陆
    wxLoginPoint(){
        //this.sendmsg(4)
    }
    //客户端进入大厅
    enterHallPoint(){
        //this.sendmsg(5)
    }

    sendmsg(type){
        let msg = {}
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS){
            msg = {
                type: type,
                _imei: this.ID,
            }
            this.send_msg("http.reqPoint", msg)
        }
    }
    
    //单例处理
    private static _instance:PointMgr;
    public static getInstance ():PointMgr{
        if(!this._instance){
            this._instance = new PointMgr();
        }
        return this._instance;
    }
}