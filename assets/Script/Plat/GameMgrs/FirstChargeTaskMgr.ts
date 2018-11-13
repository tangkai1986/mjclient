
import BaseMgr from "../Libs/BaseMgr";
import UserMgr from "./UserMgr";
import FrameMgr from "./FrameMgr";

export default class FirstChargeTaskMgr extends BaseMgr{
    routes:{} = null
    public isGetReward = null;
    constructor (){
        super();
        this.isGetReward = UserMgr.getInstance().getMyInfo().is_get_reward;
        this.routes={
            "http.reqReceiveFirstCharge":this.http_reqReceiveFirstCharge,
            'http.reqMyInfo' : this.http_reqMyInfo,
        }
    }

    http_reqReceiveFirstCharge(msg){
        FrameMgr.getInstance().showMsgBox(`获得${msg.itemid}${msg.amount}个`); 
        UserMgr.getInstance().reqMyInfo();
    }
    http_reqMyInfo(msg){
        this.isGetReward = UserMgr.getInstance().getMyInfo().is_get_reward;
    }

    //请求领取首充奖励
    FirstCharge(){
        if(this.isGetReward == 0){
            this.send_msg("http.reqReceiveFirstCharge")
            return
        }
        FrameMgr.getInstance().showMsgBox('已经领取过奖励'); 
    }

    private static _instance:FirstChargeTaskMgr;
    public static getInstance ():FirstChargeTaskMgr{
        if(!this._instance){
            this._instance = new FirstChargeTaskMgr();
        }
        return this._instance;
    }
}