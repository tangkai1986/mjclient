import BaseMgr from "../Libs/BaseMgr";
import FrameMgr from "./FrameMgr";
import UserMgr from "./UserMgr";
import RechargeMgr from "./RechargeMgr";

export default class bindAgentMgr extends BaseMgr{
    routes:{} = null;
    agentID = null;
    confirmNode = null;
    inputNode = null;
    constructor (){
        super();
        this.routes={
            "http.reqBindAgent":this.http_reqBindAgent,
        }
    }

    reqBindAgent(ID,node){
        this.agentID = ID;
    }

    getAgentID(){
        return this.agentID
    }

    sendID(){
        let info = {
            code:this.agentID,
        }
        this.send_msg("http.reqBindAgent",info)
    }

    http_reqBindAgent(msg){
        if(msg.result){
            //console.log(msg)
            this.gemit("closBindAgent")
            let text = '绑定成功';
            RechargeMgr.getInstance().reqReqGoodsList();
            FrameMgr.getInstance().showTips(text,null, 35, cc.color(0,255,0), cc.p(0,0), "Arial", 1000);
            UserMgr.getInstance().reqMyInfo();
        }else{
            this.gemit("closeConfirm")
            let text = '绑定失败，请检查后重新输入';
            FrameMgr.getInstance().showTips(text, null, 35, cc.color(255,0,0), cc.p(0,0), "Arial", 1000);
        }
    }
    

    private static _instance:bindAgentMgr;
    public static getInstance ():bindAgentMgr{
        if(!this._instance){
            this._instance = new bindAgentMgr();
        }
        return this._instance;
    }
}