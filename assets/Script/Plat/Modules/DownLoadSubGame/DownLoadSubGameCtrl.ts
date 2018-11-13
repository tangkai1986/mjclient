import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";   
import BetMgr from "../../GameMgrs/BetMgr"; 
import GameCateCfg from "../../CfgMgrs/GameCateCfg";
import SubGameMgr from "../../GameMgrs/SubGameMgr";

const {ccclass, property} = cc._decorator;

let ctrl : Prefab_DownLoadSubGameCtrl;
//模型，数据处理
class Model extends BaseModel{
    ruleName:string = null;
    ruleData:any = null;
    gameId:number = null;
    game=null;
    gamecode=null;
    gamename=null;
    state=0;
    alreadydownloadsize=0;
    totalfilesize=0;
    speed=0;
    downloaders=null;
    bUpdated=null;
	constructor()
	{
        super();
    }
    updateGameId(gameid)
    { 
        this.gameId = gameid;
        this.game=GameCateCfg.getInstance().getGameById(this.gameId); 
        this.gamename=this.game.name;//游戏名字
        this.gamecode=this.game.code;//游戏code
        this.downloaders=SubGameMgr.getInstance().getDownLoaders();
        this.bUpdated=SubGameMgr.getInstance().gameIsUpdated(this.gamecode);
    }
    //更新版本检测状态
    updateState(state)
    {
        this.state=state; 
    }
    updateProcess(speed,alreadydownloadsize,totalfilesize)
    {
        this.speed=speed;
        this.alreadydownloadsize=alreadydownloadsize;
        this.totalfilesize=totalfilesize;
    }    
    loadProcess(){
        let loader=this.downloaders[this.gamecode];
        this.speed=loader.getSpeed();
        this.alreadydownloadsize=loader.getAlreadLoadSize();
        this.totalfilesize=loader.getTotalSize();
    }
    getCurDownLoader()
    {
        return this.downloaders[this.gamecode];
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi(); 
    } 
	ui={
		//在这里声明ui
        btn_ok : ctrl.btn_ok,
        node_loading : ctrl.node_loading,
        lbl_statetip : ctrl.lbl_statetip,
        progress_loading:ctrl.progress_loading,
        lbl_loadingpercent:ctrl.lbl_loadingpercent,
        lbl_process:ctrl.lbl_process, 
    }; 
	//初始化ui
	initUi(){  
        this.ui.progress_loading.progress = 0;
        this.ui.node_loading.active=false;  
        this.ui.node_loading.active=false;  
        this.ui.lbl_statetip.string=''; 
        this.ui.btn_ok.node.active=false;
    }
    //更新进度显示
    updateProcess()
    { 
        if(this.model.totalfilesize>0)
        { 
            let percent=this.model.alreadydownloadsize/this.model.totalfilesize
            this.ui.progress_loading.progress =percent;
            let m=1024*1024;
            let alreadydownloadm=(this.model.alreadydownloadsize/m).toFixed(2);
            let totalfilesizem=(this.model.totalfilesize/m).toFixed(2); 
            let kspeed=(this.model.speed/1024).toFixed(2); 
            let processstring=`(${alreadydownloadm}MB/${totalfilesizem}MB)`;
            this.ui.lbl_process.string=processstring;
        } 
    }
    updateState(){
        this.ui.node_loading.active=false;  
        this.ui.lbl_statetip.string=''; 
        this.ui.btn_ok.node.active=false;
        switch(this.model.state)
        {
            case SUBGAMEDOWNLOAD_STATE.none: 
                this.ui.lbl_statetip.string='正在加载游戏'
            break; 
            case SUBGAMEDOWNLOAD_STATE.downloading:  
                this.updateLoadingProcess(); 
            break; 
            case SUBGAMEDOWNLOAD_STATE.downfailed: 
                this.ui.lbl_statetip.string='下载失败请检查你的网络状况再重试' 
                this.ui.btn_ok.node.active=true;
            break; 
            case SUBGAMEDOWNLOAD_STATE.ready: 
                this.updateReadyInfo();
            break;
            case SUBGAMEDOWNLOAD_STATE.que: 
                this.ui.lbl_statetip.string='正在下载队列中等待'  
            break; 
            case SUBGAMEDOWNLOAD_STATE.complete:  
                this.ui.lbl_statetip.string='下载完成'
            break;
            

        }
    }        
    updateReadyInfo(){
        let downloader=this.model.getCurDownLoader();
        let subgamestate=SubGameMgr.getInstance().getSubGameState(this.model.gamecode);
        let gamename=this.model.gamename;
        let tipstr='';
        let m=1024*1024;
        let totalsize=(downloader.getTotalSize()/m).toFixed(2);
        switch(subgamestate)
        {
            case 1://表示有版本更新
                tipstr=`【${gamename}】需要更新,是否马上更新(${totalsize}MB)?`
            break;
            case 2://未下载
                tipstr=`您还未下载【${gamename}】,是否马上下载(${totalsize}MB)?`
            break;
        }
        this.ui.lbl_statetip.string=tipstr;   
        this.ui.btn_ok.node.active=true;      
    } 
    updateLoadingProcess(){
        this.ui.node_loading.active=true;   
        this.updateProcess();
    }
}

@ccclass
export default class Prefab_DownLoadSubGameCtrl extends BaseCtrl { 
    //确定按钮
    @property(cc.Button)
    btn_ok:cc.Button = null;  
    //下载或更新的进度条
    @property(cc.Node)
    node_loading:cc.Node = null; 
    //子游戏版本信息
    @property(cc.Label)
    lbl_statetip:cc.Label = null; 
     
    
    //下载进度条
    @property(cc.Label)
    lbl_loadingpercent:cc.Label = null; 
    
    //下载的进度条
    @property(cc.ProgressBar)
    progress_loading:cc.ProgressBar=null; 
 
    //已下载进度
    @property(cc.Label)
    lbl_process:cc.Label=null; 
    
    private completeCb=null;
    onLoad () {
        //创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
        this.initMvc(Model,View);  
        SubGameMgr.getInstance().registerCb(this.downLoadSubGameCb.bind(this),this.processCb.bind(this));  
    }
    onDestroy(){
        SubGameMgr.getInstance().unRegisterCb();
        super.onDestroy();
    }
    //定义网络事件
	defineNetEvents()
	{
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
    {
        let self=this; 
        this.ui.btn_ok.node.on(cc.Node.EventType.TOUCH_END, function(event) {
            self.btn_ok_cb();
        }, this) 
    }
    start () {

    } 
    btn_ok_cb()
    {
        //判断是否是
        let downloader=this.model.getCurDownLoader(); 
        let state:SUBGAMEDOWNLOAD_STATE=downloader.getState();
        let process_state:SUBGAMEPROCESS_STATE=downloader.getProcessState();
        //判断下载状态，再结合进度状态，下载失败可能出现在md5列表获取阶段或下载子游戏过程阶段
        switch(state)
        {
            case SUBGAMEDOWNLOAD_STATE.ready:
                downloader.startDownLoad(); 
            break;
            case SUBGAMEDOWNLOAD_STATE.downfailed:
                switch(process_state)
                {
                    case SUBGAMEPROCESS_STATE.none://表示在获取md5列表过程中失败
                        downloader.downloadSubMd5dic();
                    break;
                    case SUBGAMEPROCESS_STATE.loading://表示在下载过程中失败
                        downloader.retry(); 
                    break; 
                } 
            break; 
        }
    } 
    //更新游戏id,然后获取当前进度
    updateGameId(gameId)
    {
        this.model.updateGameId(gameId); 
        SubGameMgr.getInstance().updateGameId(this.model.gamecode);
        this.ui.node_loading.active=false;  
        this.ui.lbl_statetip.string=''; 
        this.ui.btn_ok.node.active=false; 
        let downloader=this.model.getCurDownLoader();
        if(!downloader)
        {
            return;
        }
        let state:SUBGAMEDOWNLOAD_STATE=downloader.getState();
        let process_state:SUBGAMEPROCESS_STATE=downloader.getProcessState();
        //console.log("downloader=",downloader,state,process_state)
        this.setState(state);
        if(this.model.bUpdated)
        { 
            return;
        }
        switch(state)
        {
            case SUBGAMEDOWNLOAD_STATE.downfailed:
            case SUBGAMEDOWNLOAD_STATE.que:
            
            break;
            default:
                switch(process_state)
                {
                    case SUBGAMEPROCESS_STATE.none://啥都还没开始
                        downloader.downloadSubMd5dic();
                    break;
                    case SUBGAMEPROCESS_STATE.sizeCaled://已经计算了
                        this.view.updateReadyInfo();//更新准备提示信息
                    break;
        
                    case SUBGAMEPROCESS_STATE.loading://已经计算了
                        this.view.updateLoadingProcess();//更新准备提示信息
                    break;
                    
                } 
            break; 
        } 
    }
    registerCompleteCb(completeCb){
        this.completeCb=completeCb;
    }
    unRegisterCompleteCb(){
        this.completeCb=null;
    }
    downLoadSubGameCb(gamecode,state:SUBGAMEDOWNLOAD_STATE)
    { 
        if(this.model.gamecode!=gamecode)
        {
            return;
        }
        this.setState(state);
    }
    setState(state:SUBGAMEDOWNLOAD_STATE)
    {
        this.model.updateState(state)
        this.view.updateState(); 
        switch(this.model.state)
        {
            case SUBGAMEDOWNLOAD_STATE.none:  
            case SUBGAMEDOWNLOAD_STATE.complete: 
                if(this.completeCb)
                {
                    this.completeCb();
                }
            break;
        } 
    }   
    processCb(gamecode,speed,alreadydownloadsize,totalfilesize){ 
         
        if(this.model.gamecode!=gamecode)
        {
            return;
        }
        this.model.updateProcess(speed,alreadydownloadsize,totalfilesize);
        this.view.updateProcess();
    }     
    
}
