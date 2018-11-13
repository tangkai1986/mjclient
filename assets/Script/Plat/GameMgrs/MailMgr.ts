/**
 * 邮件数据层
 * TODO:
 *  邮件服务端目前未有数据, 一切网络事件先用全局事件模拟操作
 */
import BaseMgr from "../Libs/BaseMgr";

export default class MailMgr extends BaseMgr{

    _mailData = null;
    _curReadMailID = null;
    routes:{} = null;
    _mailDetail = null;
    _mailGetResult = null;
    _mailReadResult = null;
    constructor () {
        super();
        this.routes = {
            'http.reqMailList' : this.http_reqMailList,
            'http.reqMailInfo' : this.http_reqMailInfo,
            'http.reqMailGet' : this.http_reqMailGet,
            'http.reqMailAllRead' : this.http_reqMailAllRead,
            'http.reqMailAllGet' : this.http_reqMailAllGet,
        }
        this.reqMailList({"class":2});
    }

    getTestMailData () {
        let localMailData = [
			{
                id : 1,                         // 邮件ID
                name : "[系统邮件]",            // 邮件标题
                detail : "这是一封系统邮件这是一封系统邮件这是一封系统邮件这是一封系统邮件这是一封系统邮件这是一封系统邮件这是一封系统邮件这是一封系统邮件这是一封系统邮件这是一封系统邮件这是一封系统邮件这是一封系统邮件这是一封系统邮件这是一封系统邮件",    // 邮件文本内容
				read : false,                   // 是否已读
                receive : false,                // 是否领取奖励
                prize : null                    // 附件 如果这项没有数据默认为没有物品的邮件
			},
			{
				id : 2,
				name : "[好友邮件]",
				detail : "这是一封有附件的好友邮件",
				read : false,
                receive : false,
                prize : {
                    gold: {},
                    masonry: {},
                    exchange: {},
                    giftBag: {}
                }
			},
			{
				id : 3,
				name : "[抽奖邮件]",
				detail : "这是一封抽奖邮件",
                read : false,
                receive : false,
                prize : null
			},
			{
				id : 4,
				name : "[比赛邮件]",
				detail : "这是一封比赛邮件",
                read : false,
                receive : false,
                prize : null
			}
        ]
        return localMailData;
    };
    
    // 请求邮件数据
    reqMailList (msg) {
        //console.log("http 请求邮件数据");
        this.send_msg('http.reqMailList', msg);
    }

    // 存储邮件数据
    http_reqMailList (data) {
        //console.log("http 请求回调,收到邮件数据将其存储",data);
        // 策划案只需要 50 条邮件, 真实数据到来之后这里做个数据截取
        // 没显示的邮件状态不会改变, 也不会消失, 等待玩家下次的邮件列表请求显示
        this._mailData = data.maillist;
    }

    // 通知服务器阅读了指定邮件
    reqMailInfo () {
        let emailID = this.getCurReadMailID();
        //console.log("阅读ID="+emailID+"的邮件");
        this.send_msg("http.reqMailInfo", {"id":emailID})
    }

    // 邮件阅读结果
    http_reqMailInfo (data) {
        //console.log("阅读邮件结果", data);
        this._mailDetail = data;
        this.updateMailReadStatus();
    }
    updateMailReadStatus()
    {
        for (let i = 0; i < this._mailData.length; ++i) {
            if (this._mailData[i].id == this._curReadMailID) {
                this._mailData[i].status = 1;
                break;
            }
        }

    }
    // 通知服务器领取指定邮件奖励
    reqMailGet () {
        let emailID = this.getCurReadMailID();
        //console.log("领取ID="+emailID+"的邮件邮件奖励")
        this.send_msg('http.reqMailGet', {"id":emailID});
    }

    // 邮件奖励领取结果
    http_reqMailGet (data) {
        //console.log("邮件奖励领取结果", data);
        this._mailGetResult = data;
    }

    // 阅读所有邮件
    reqMailAllRead (msg) {
        //console.log("阅读所有邮件");
        this.send_msg('http.reqMailAllRead', {"id":msg.toString()});
    }

    // 阅读所有邮件结果
    http_reqMailAllRead (data) {
        //console.log("阅读所有邮件结果", data);
        this._mailReadResult = data; 
    }

    // 领取所有邮件奖励
    reqMailAllGet (msg) {
        //console.log("领取所有邮件奖励");
        this.send_msg('http.reqMailAllGet', {"id":msg.toString()});
    }

    // 领取所有邮件奖励结果
    http_reqMailAllGet (data) {
        //console.log("领取所有邮件奖励结果", data)
        this._mailGetResult = data;
    }

    // 过滤邮件
    filterMailData (mailItemData, localMailData) {
        // 过滤无奖励品并且已读的邮件
        if (!mailItemData.prize && !mailItemData.read) {
            localMailData.push(mailItemData);
        }
        // 过滤有奖励品并且已领取的邮件
        if (mailItemData.prize && !mailItemData.receive) {
            localMailData.push(mailItemData);
        }
    }
    getAllReadMailIDList()
    {
        let IDList = [];
        if (this._mailData == null || this._mailData == undefined) {
            return;
        }
        for (var i = 0; i < this._mailData.length; ++i) {
            if (this._mailData[i].type==0) {
                IDList.push(this._mailData[i].id);
            }
        }
        return IDList;
    }
    getAllGetMailIDList()
    {
        let IDList = [];
        if (this._mailData == null || this._mailData == undefined) {
            return;
        }
        for (var i = 0; i < this._mailData.length; ++i) {
            if (this._mailData[i].type==1) {
                IDList.push(this._mailData[i].id);
            }
        }
        return IDList;
    }
    // 获取邮件数据
    getMailData () {
        //console.log("获取邮件数据");
        return this._mailData;
    }
    getMailDetail()
    {
        return this._mailDetail;
    }
    // 设置当前阅读的邮件ID
    setCurReadMailID (emailID) {
        this._curReadMailID = emailID;
    }
    getMailDataByID(emailID)
    {
        for (var i = 0; i < this._mailData.length; ++i) {
            if (this._mailData[i].id==emailID) {
                return this._mailData[i];
            }
        }
    }
    // 获取当前阅读的邮件ID
    getCurReadMailID () {
        return this._curReadMailID;
    }
    // 获取当前阅读的邮件内容
    getCurReadMailContent () {
        let curReadMailID = this.getCurReadMailID();
        let curReadMailContent = null;
        for (let i = 0; i < this._mailData.length; i++) {
            let mailItemData = this._mailData[i];
            if (mailItemData.id == curReadMailID) {
                curReadMailContent = mailItemData;
                break;
            }
        }
        return curReadMailContent;
    }

    // 单例模式
    private static _instance:MailMgr;
    public static getInstance ():MailMgr {
        if (!this._instance) {
            this._instance = new MailMgr();
        }
        return this._instance;
    }
}
