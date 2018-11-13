import BaseControl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UiMgr from "../../GameMgrs/UiMgr";
import ModuleMgr from "../../GameMgrs/ModuleMgr";
import SettingMgr from "../../GameMgrs/SettingMgr";
import FrameMgr from "../../GameMgrs/FrameMgr";
import LuckDrawMgr from "../../GameMgrs/LuckDrawMgr";
import Prefab_luckDrawTipCtrl from "../../Modules/Plaza/Prefab_luckDrawTipCtrl";
import ServerMgr from "../../../AppStart/AppMgrs/ServerMgr";
import AppInfoMgr from "../../../AppStart/AppMgrs/AppInfoMgr";
import UserMgr from "../../GameMgrs/UserMgr";
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_LuckDrawCtrl;
//模型，数据处理
class Model extends BaseModel{
    awardListInfo : any = {}
    drawResult : any = {}
    bDraw : any = null
    drawRecord : any = null 
    isRunning : any = false;
    wechatNum : string = ''
    propID:number = 0
    propName:string = ""
    shareUrl:any = ServerMgr.getInstance().getDownLoadPage();
	constructor()
	{
        super();
        this.awardListInfo = LuckDrawMgr.getInstance().getAwardList();
        //console.log('awardListInfo', this.awardListInfo)
        this.bDraw = LuckDrawMgr.getInstance().getDrawed();
        this.wechatNum = LuckDrawMgr.getInstance().getWechatNum();
	}
    private setDrawResult(){
        for(let key in this.awardListInfo){
            if(this.awardListInfo[key].item_id == this.drawResult.item_id){
                this.propID = key
            }
        }
        this.propName = this.drawResult.name
    }
}

class View extends BaseView{
	ui={
        //在这里声明ui
        button_CloseBtn:null,
        button_CopyWechat:null,
        button_RewardRecord:null,
        button_StartDraw:null,
        node_RewardFrame:null,
        array_AwardList:[],
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
        this.initUi();
        this.addGrayLayer();
	}
	//初始化ui
	initUi()
	{
        let self = this
		this.ui.button_CloseBtn = ctrl.CloseBtn;
		this.ui.button_CopyWechat = ctrl.CopyWechat;
		this.ui.button_RewardRecord = ctrl.RewardRecord;
        this.ui.button_StartDraw = ctrl.StartDraw;
        this.ui.array_AwardList = ctrl.AwardList;
        this.ui.node_RewardFrame = ctrl.RewardFrame;
        this.ui.node_RewardFrame.active = false;
        for (let key in this.model.awardListInfo) {
            let sprite = this.ui.array_AwardList[key];
            //转盘容错处理
            if(this.model.awardListInfo[key].icon) {
                let imagePath = 'Plat/' + this.model.awardListInfo[key].icon
                cc.loader.loadRes(imagePath, cc.SpriteFrame, function (err, spriteFrame) {
                    if (err) return cc.error("no find image path: %s", imagePath)
                    if(cc.isValid(sprite) && sprite) {
                        sprite.spriteFrame = spriteFrame
                    }
                });
            }
        }
    }

    FrameTurnAround(delTime, playCount, propID, propName){
        let self = this;
        self.model.isRunning = true;
        let pos = [];
        for(let i = 0; i < this.ui.array_AwardList.length; i++){
            //console.log(i)
            let framePos = this.ui.array_AwardList[i].node.getPosition();
            pos.push(framePos);
        }
        let action = function (delTime, playCount, propID, propName) {
	        self.ui.node_RewardFrame.active = true
	        self.ui.node_RewardFrame.runAction(
	            cc.sequence(cc.delayTime(delTime),cc.callFunc(function(sender, data) {
	                playCount++
	                delTime += (delTime > 0.1 ? 0.02 : 0.001)
	                playCount = playCount<= 11 ? playCount : 0
	                //if (playCount == 0) //console.log(delTime)
	                sender.setPosition(pos[playCount]) 
	                if (delTime <= 0.5) {

                        if (delTime > 0.22 && propID == playCount){
                            self.ui.node_RewardFrame.runAction(
                                cc.sequence(cc.delayTime(0.3),cc.callFunc(()=>{
                                    //回调分享接口
                                    let awardTime = new Date()
                                    let year = awardTime.getFullYear() + '年';
                                    let month = awardTime.getMonth() + 1 +'月';
                                    let date = awardTime.getDate() + '日';
                                    let awardTimeLab = year + month + date;
                                    let cb = ()=>{
                                        self.srcShootAndShare(self.model.propName, self.model.shareUrl)
                                    }
                                    self.showTipMsg('恭喜您获得' + propName + '\n请分享到朋友圈领取奖励！', cb, 'shareBtn', awardTimeLab);
                                    self.model.isRunning = false;
                                }))
                            )
                            return
                        }
	                     action(delTime, playCount, propID, propName)
	                }
	        })))
        }
        action(delTime, playCount, propID, propName); 
    }

    public showTipMsg(content:string, okcb?:Function, btnLab?:string, awardTimeLab?:string){
    	ModuleMgr.getInstance().start_sub_module(G_MODULE.LuckDrawTipPanel, (prefabComp:Prefab_luckDrawTipCtrl)=>{
            prefabComp.showTip(content, okcb, btnLab, awardTimeLab)
        }, 'Prefab_luckDrawTipCtrl')
    }

    public srcShootAndShare(propName, shareUrl){
        let self = this
        let appname=AppInfoMgr.getInstance().getAppName();
        G_PLATFORM.wxShareContent(G_PLATFORM.WX_SHARE_TYPE.WXSceneTimeline, `${appname}分享送豪礼啦，我抽中了${propName}，一起下载拼手气吧！`,appname, shareUrl)
    }
}

@ccclass
export default class Prefab_LuckDrawCtrl extends BaseControl {
	@property({
		tooltip : "关闭界面按钮",
		type : cc.Node
	})
	CloseBtn : cc.Node = null;

	@property({
		tooltip : "复制微信号",
		type : cc.Node
	})
	CopyWechat : cc.Node = null;

	@property({
		tooltip : "中奖记录",
		type : cc.Node
	})
	RewardRecord : cc.Node = null;

	@property({
		tooltip : "点击抽奖",
		type : cc.Node
	})
	StartDraw : cc.Node = null;

    @property({
        tooltip : "奖品列表",
        type : cc.Sprite
    })
    AwardList : cc.Sprite[] = [];
    
    @property({
        tooltip : "抽奖框",
        type : cc.Node
    })
    RewardFrame : cc.Node = null;

    onLoad () {
    	//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
		this.initMvc(Model,View);
    }

    //定义网络事件
    defineNetEvents()
    {
        this.n_events = {
            'http.reqTrunTable':this.http_reqTrunTable,
            'http.reqTrunTableLottery':this.http_reqTrunTableLottery,
            'http.reqTrunTableDetails':this.http_reqTrunTableDetails,   
        } 
    }
    //定义全局事件
    defineGlobalEvents()
    {

    }

    connectUi()
    {
        this.connect(G_UiType.button, this.ui.button_CloseBtn, this.click_buttonCloseCB, '关闭界面按钮');
        this.connect(G_UiType.button, this.ui.button_CopyWechat, this.copyWechatCB, '复制微信号');
        this.connect(G_UiType.image, this.ui.button_RewardRecord, this.rewardRecordCB, '打开中奖记录');
        this.connect(G_UiType.button, this.ui.button_StartDraw, this.startDrawCB, '开始抽奖');
    }

    click_buttonCloseCB(){
        //console.log('关闭界面');
        if(this.model.isRunning){
            return
        }
        this.finish();
    }

    copyWechatCB(){
        //console.log('复制了微信号');
        if (cc.sys.isNative)
            G_PLATFORM.copyToClipboard ("bmfj119");
    }

    rewardRecordCB(){
        //console.log('打开中奖记录');
        LuckDrawMgr.getInstance().reqTrunTableDetails()
    }


    http_reqTrunTableDetails(){
        this.model.drawRecord = LuckDrawMgr.getInstance().getDrawRecord()
        if (this.model.bDraw == 1){
            //回调分享接口
            let awardTime = new Date()
            let year = awardTime.getFullYear() + '年';
            let month = awardTime.getMonth() + 1 +'月';
            let date = awardTime.getDate() + '日';
            let awardTimeLab = year + month + date;
            let cb = ()=>{
                this.view.srcShootAndShare(this.model.drawRecord.name, this.model.shareUrl)
            }
            this.view.showTipMsg('恭喜您获得' + this.model.drawRecord.name + '\n请分享到朋友圈领取奖励！', cb, 'shareBtn', awardTimeLab.toString());
        }
        else{
            this.view.showTipMsg('您今日还未抽奖！', null, 'knowBtn', ''); 
        } 
    }

    drawTurn(){
        this.view.FrameTurnAround(0.01, 0, this.model.propID, this.model.propName);
    }

    startDrawCB(){
        if(this.model.isRunning){
            return
        }
        LuckDrawMgr.getInstance().reqTrunTableLottery()
    }

    http_reqTrunTableLottery(){
        //console.log('开始抽奖');
        this.model.drawResult = LuckDrawMgr.getInstance().getDrawResult()
        if (typeof(this.model.drawResult) == 'string') {
            this.view.showTipMsg(this.model.drawResult + '\n明天记得再来哦!', null, 'knowBtn', '');
            return
        }
        this.model.setDrawResult()
        LuckDrawMgr.getInstance().reqTrunTable()
        this.drawTurn()
    }
    http_reqTrunTable(){
        this.model.bDraw = LuckDrawMgr.getInstance().getDrawed()
        UserMgr.getInstance().reqMyInfo();
    }

    

    start () {

    }

    // update (dt) {},
}
