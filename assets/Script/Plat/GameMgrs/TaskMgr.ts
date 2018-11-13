//公告管理
import BaseMgr from "../Libs/BaseMgr";
import QEventDef from "./GEventDef";

export default class TaskMgr extends BaseMgr{
    //任务列表
    private taskList: any = [];
    //任务项预制数据
    private taskItemInfo: any = {};
    //邀请好友数据
    private inviteInfo: any = {};

    routes:{} = null;

    constructor () {
        super();
        this.routes = {
            'http.reqDailyActivity': this.http_reqDailyActivity,
            'http.reqDailyActivityReceive': this.http_reqDailyActivityReceive,
        };
        this.inviteInfo = {
			InvitedAmount: 0,
			PeopleAmount: [1, 3, 5, 10, 20],
			RewardType: [1, 1, 1, 1, 1],
			RewardAmount: [100, 200, 300, 400, 500]
		};
        this.reqDailyActivity ()
    }

    getTaskList () {
        return this.taskList;
    }

    //设置任务项预制数据
    setTaskItemInfo (obj) {
        this.taskItemInfo = obj;
    }
    //取任务项预制数据
    getTaskItemInfo () {
        return this.taskItemInfo;
    }

    getInviteInfo () {
        return this.inviteInfo;
    }

    closeTaskPanel () {
        this.gemit(QEventDef.closeActivityModule);
    }

    reqDailyActivityReceive(rewardtype){
        let msg = {
            reward_type:rewardtype,
        }
        this.send_msg('http.reqDailyActivityReceive', msg)
    }

    http_reqDailyActivityReceive(msg){
    }

    reqDailyActivity () {
        this.send_msg("http.reqDailyActivity")
    }
    http_reqDailyActivity (msg){
        this.taskList = msg
    }
    //单例处理
    private static _instance: TaskMgr;
    public static getInstance (): TaskMgr{
        if(!this._instance){
            this._instance = new TaskMgr();
        }
        return this._instance;
    }
}
