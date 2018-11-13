//notify属性配置,包含算分，以及各种事件开关
import BaseMgr from "../Libs/BaseMgr";
import RoomMgr from "./RoomMgr";
export default class NotifyMgr extends BaseMgr{
    reqMap=null;
    notifyList=[];
    constructor(){
        super();
        this.routes={
            'onNotify':this.onNotify,
        }
        this.reqMap={
            1:'http.reqHorseRaceLamp',//跑马灯修改
            2:'http.reqGameSwitch',//游戏开关修改
            3:'http.reqGameSite',//游戏版本修改
            4:'http.reqGameFreeList',//游戏限免添加修改删除
            5:'http.reqMyInfo',//用户个人信息修改
            6:'http.reqMailList',//用户有新邮件
            7:'http.reqMyInfo',//苹果内购充值，修改个人钻石
            //8:'http.reqDailyActivity',//每日任务列表
        }
    }
    //重获所有的推送
    refreshNotifies()
    {
        //过滤掉重复的资源
        let notifyDic={};
        for(let i=0;i<this.notifyList.length;++i)
        {
            let item=this.notifyList[i];
            notifyDic[item.type]=item;
        }
        //重置推送
        this.notifyList=[];
        for(let k in notifyDic)
        {
            let msg=notifyDic[k];
            this.reqByNotify(msg);
        }
    }
    //根据推送信息请求数据
    reqByNotify(msg)
    {
        let type=msg.type;
        let reqMsg={gid:msg.gid};
        switch(type)
        {
            case 6://邮件要发参数class2
            {
                reqMsg={class:2};
            }
            break;  
        } 
        let reqName=this.reqMap[type];
        if(reqName){
          let gid=msg.gid;
          this.send_msg(reqName,reqMsg);
        }
    }
    onNotify(msg){
        if(RoomMgr.getInstance().isInRoom())
        {
            this.notifyList.push(msg);
            return;
        }
        this.reqByNotify(msg);
    }
    private static _instance:NotifyMgr
    public static getInstance ():NotifyMgr{
        if(!this._instance)
          this._instance = new NotifyMgr();
        return this._instance;
    }
}
