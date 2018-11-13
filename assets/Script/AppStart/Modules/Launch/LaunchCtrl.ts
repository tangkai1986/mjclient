import ServerMgr from "../../AppMgrs/ServerMgr";
import VersionMgr from "../../AppMgrs/VersionMgr";


const {ccclass, property} = cc._decorator;

let ctrl : LaunchCtrl;
//模型，数据处理
class Model { 
    num = null;
    state=0;
    alreadydownloadsize=0;
    totalfilesize=0;
    bBackFromHotupdate=false;
    speed=0;
    constructor()
    { 
        this.bBackFromHotupdate=VersionMgr.getInstance().isBackFromHotupdate();//因为狗日的creator要热更新完重启，所以用了野路子应对
        ////console.log("是否是从重启中会来=",this.bBackFromHotupdate)
        VersionMgr.getInstance().resetBackFromHotupdate();//重置这个重启回到游戏的标记
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
}
//视图, 界面显示或动画，在这里完成
class View {
    ui={ 
        loading_jinduguang:null,        //进度光
        loading_jdtpercent:null,        //进度百分比label
        lbl_statetip:null,        //状态显示
        lbl_info:null,        //信息提示
        node_loading:null,
        panel_tip:null,
        btn_ok:null, 
        lbl_sizeprocess:null,
        panel_fixdlg:null,
        btn_agree:null,
        btn_refuse:null,
        lbl_fixclient:null,
        progress_loading:ctrl.progress_loading,
        btn_clearCache:ctrl.btn_clearCache,
    }; 
    guangbiaostartx=-450; 
    private node=null;
    private model:Model=null

    constructor(model)
    { 
        this.model=model; 
        this.node=ctrl.node;  
        this.initUi();
    } 
    private maxwidth=920;
    initUi()
    {    
        this.ui.panel_fixdlg=ctrl.panel_fixdlg;
        this.ui.lbl_fixclient=ctrl.lbl_fixclient;
        this.ui.lbl_fixclient.node.active=false;
        this.ui.btn_agree=ctrl.btn_agree;
        this.ui.btn_refuse=ctrl.btn_refuse;
        this.ui.btn_ok=ctrl.btn_ok;
        this.ui.lbl_sizeprocess=ctrl.lbl_sizeprocess;
        this.ui.panel_tip=ctrl.panel_tip;
        this.ui.lbl_info=ctrl.lbl_info;  
        this.ui.node_loading = ctrl.node_loading;
        this.ui.lbl_statetip = ctrl.lbl_statetip;
        this.ui.loading_jinduguang = ctrl.loading_jinduguang;
        this.ui.loading_jdtpercent = ctrl.loading_jdtpercent;
        this.ui.lbl_statetip.string='正在获取配置'
        this.ui.loading_jdtpercent.string = '';   
        this.ui.node_loading.active=false; 
        this.ui.panel_tip.active=false;
        this.ui.loading_jinduguang.x = this.guangbiaostartx;
        this.ui.progress_loading.progress = 0; 
        if(this.model.bBackFromHotupdate)
        {
            this.ui.lbl_statetip.string='更新完毕'
            this.ui.loading_jdtpercent.string = `100%`; 
            this.ui.progress_loading.progress = 1;
        }
    }
    //更新进度显示
    updateProcess()
    { 
        if(this.model.totalfilesize>0)
        { 
            let percent=this.model.alreadydownloadsize/this.model.totalfilesize
            let process=Math.floor(percent*100);
            let processwidth=this.maxwidth*percent;
            this.ui.loading_jinduguang.x = this.guangbiaostartx+processwidth;
            this.ui.progress_loading.progress=percent;
            this.ui.loading_jdtpercent.string = `${process}%`;  
            let m=1024*1024;
            let alreadydownloadm=(this.model.alreadydownloadsize/m).toFixed(2);
            let totalfilesizem=(this.model.totalfilesize/m).toFixed(2); 
            let kspeed=(this.model.speed/1024).toFixed(2);
            this.ui.lbl_sizeprocess.string=`(${alreadydownloadm}M/${totalfilesizem}M) (${kspeed}k/s)`
            
        }
        else
        {
            this.ui.loading_jdtpercent.string = '';
        }
    }
    updateState(){
        this.ui.node_loading.active=false; 
        this.ui.panel_tip.active=false;
        this.ui.lbl_statetip.string=''; 
        switch(this.model.state)
        {
            case ASSETDOWNLOAD_STATE.none: 
                this.ui.lbl_statetip.string='正在加载游戏'
            break;
            case ASSETDOWNLOAD_STATE.checking:  
                this.ui.lbl_statetip.string='正在检测版本'
            break; 
            case ASSETDOWNLOAD_STATE.downloading:   
                this.ui.node_loading.active=true;  
                this.ui.lbl_sizeprocess.string='...'
            break;
            case ASSETDOWNLOAD_STATE.complete: 
                this.ui.node_loading.active=true; 
                this.ui.lbl_statetip.string='更新完毕'
            break;
            case ASSETDOWNLOAD_STATE.downfailed: 
                this.ui.lbl_info.string='下载失败请检查你的网络状况再重试'
                this.ui.panel_tip.active=true;
            break;
            case ASSETDOWNLOAD_STATE.neterr: 
                this.ui.lbl_info.string='下载失败请检查你的网络状况再重试'
                this.ui.panel_tip.active=true;
            break; 
            case ASSETDOWNLOAD_STATE.loadproducterr:
                this.ui.lbl_info.string='获取失败请检查你的网络状况再重试'
                this.ui.panel_tip.active=true;
            break;
            case ASSETDOWNLOAD_STATE.loadingproduct:
                this.ui.lbl_statetip.string='正在获取配置'
            break;
            case ASSETDOWNLOAD_STATE.loadremotemd5:
                this.ui.lbl_statetip.string='正在获取远程版本列表'
            break;
            case ASSETDOWNLOAD_STATE.needdownloadnewverison: 
                this.ui.lbl_info.string='发现新版本,点击确定前往下载,安装前请卸载当前版本'
                this.ui.panel_tip.active=true;
            break; 
        }
    } 
}
//控制器
@ccclass
export default class LaunchCtrl extends cc.Component { 
     
    @property(cc.Node)
    node_loading=null; 
    @property(cc.Node)
    loading_jinduguang=null; 

    @property(cc.Label)
    loading_jdtpercent:cc.Label = null; 
    @property(cc.Label)
    lbl_statetip:cc.Label = null; 
    @property(cc.Node)
    panel_tip:cc.Node = null; 
    
    @property(cc.Node)
    panel_fixdlg:cc.Node = null; 
    
    @property(cc.Button)
    btn_agree:cc.Button = null; 
    
    
    @property(cc.Button)
    btn_refuse:cc.Button = null; 

    @property(cc.Label)
    lbl_info:cc.Label = null; 
    
    @property(cc.Button)
    btn_ok:cc.Button = null; 
    
    
    @property(cc.Label)
    lbl_sizeprocess:cc.Label = null; 

    
    @property(cc.Button)
    btn_clearCache:cc.Button = null;

    

    //下载的进度条
    @property(cc.ProgressBar)
    progress_loading:cc.ProgressBar=null; 

    @property(cc.Button)
    lbl_fixclient:cc.Button = null; 
    private model:Model = null;
    private view:View = null;
    private ui=null;
    onLoad (){ 
        //创建mvc模式中模型和视图
        //控制器
        ctrl = this;
        //数据模型
        this.model = new Model();
        //视图
        this.view = new View(this.model);
        //引用视图的ui  
        this.ui=this.view.ui; 
        //绑定ui操作
        this.connectUi(); 
        ServerMgr.getInstance().loadLoacalSetting(this.loadDataCb.bind(this));
        this.setState(ASSETDOWNLOAD_STATE.loadingproduct);

        // let result=jsbMahjong.getTingDic(6,[0,23,24,25,36,37,38,39,40,49,50,51,53,54],19, 0,-1,false);
		// let tingDic={};
		// let index=0;
		// //解析这个听tingDic;
		// while(index<result.length){
		// 	let cardValue=result[index++]; 
		// 	let bXianJin=result[index++]; 
		// 	let cardsCount=result[index++]; 
		// 	let info=[];
		// 	for(let i = 0;i<cardsCount;++i){ 
		// 		let v=result[index++];
		// 		let huType=v&0xFF;
		// 		let jinCount=(v>>8)&0xFF;
		// 		let cardValue=(v>>16)&0xFF;
		// 		info.push({jinCount:jinCount,huType:huType,cardValue:cardValue});
		// 	}
		// 	tingDic[cardValue]={bXianJin:bXianJin,info:info};
		// }
		//console.log("getTingDicNative=",JSON.stringify(tingDic) ); 
    }
    isIPhoneX () {
        let size = cc.view.getFrameSize();
        ////console.log("设备 size", size)
        if(
            cc.sys.isNative && cc.sys.platform == cc.sys.IPHONE
            && ((size.width == 2436 && size.height == 1125) 
            ||(size.width == 1125 && size.height == 2436))
        ) {
            return true;
        }
        return false;
    }
    resetDesignResolution (canvas) {
        let width = 720;
        let size = cc.view.getFrameSize();
        let proportion = size.height/size.width;
        let height = width*proportion;
        canvas.designResolution=new cc.Size(width, height)
        //canvas.fitHeight = true
        canvas.fitWidth = true
    }
    connectUi()
    { 
        let self=this; 
        this.ui.btn_ok.node.on(cc.Node.EventType.TOUCH_END, function(event) {
            self.btn_ok_cb();
        }, this) 
        this.ui.btn_refuse.node.on(cc.Node.EventType.TOUCH_END, function(event) {
            self.btn_refuse_cb();
        }, this)  
        this.ui.btn_agree.node.on(cc.Node.EventType.TOUCH_END, function(event) {
            self.btn_agree_cb();
        }, this)   
        this.ui.lbl_fixclient.node.on(cc.Node.EventType.TOUCH_END, function(event) {
            self.lbl_fixclient_cb();
        }, this) 

        this.ui.btn_clearCache.node.on(cc.Node.EventType.TOUCH_END, (event)=> {
            this.clearCacheCb();
        }, this) 

        
    }
    //清空缓存
    clearCacheCb(){
        VersionMgr.getInstance().clearHotUpdate();
    }
    start () {
        if (this.isIPhoneX()) {
            this.resetDesignResolution(this.node.getComponent(cc.Canvas))
        }
        cc.director.setDisplayStats(false);
    } 
    lbl_fixclient_cb(){
        this.ui.panel_fixdlg.active=true;
    }
    btn_agree_cb(){
        //清空缓存
        VersionMgr.getInstance().clearHotUpdate();
    }
    btn_refuse_cb(){
        this.ui.panel_fixdlg.active=false;
    }
    btn_ok_cb(){
        switch(this.model.state)
        { 
            case ASSETDOWNLOAD_STATE.downfailed:  
                VersionMgr.getInstance().retryFiles();
                this.ui.panel_tip.active=false;
                this.ui.node_loading.active=true;
            break;
            case ASSETDOWNLOAD_STATE.neterr:  
                VersionMgr.getInstance().retryVersion();
                this.ui.panel_tip.active=false;
                this.ui.node_loading.active=true;
            break;
            case ASSETDOWNLOAD_STATE.loadproducterr:
                ServerMgr.getInstance().loadLoacalSetting(this.loadDataCb.bind(this));
                this.setState(ASSETDOWNLOAD_STATE.loadingproduct);
            break;   
            case ASSETDOWNLOAD_STATE.needdownloadnewverison:
            {
                let downLoadPage=ServerMgr.getInstance().getDownLoadPage()
                ////console.log("下载页=",downLoadPage)
                cc.sys.openURL(downLoadPage);
            }
            break;
        }
    }
    update (dt) { 
    } 
    gotoLogin(){
        let cb=function()
		{ 
            cc.loader.loadRes('SubLayer/Plat/MsgBox/MsgBoxLoadingAni', (err, prefab:cc.Prefab)=> { 
                if(err){
                    cc.error(err) 
                }else{
                    let prefabNode = cc.instantiate(prefab);
                    prefabNode.parent = cc.director.getScene();
                    prefabNode.position=cc.p(640,360) 
                } 
            }); 
        }  
        cc.director.loadScene('Login',cb.bind(this))
    }
    checkVersionCb(state:ASSETDOWNLOAD_STATE)
    { 
        this.setState(state);
    }
    setState(state:ASSETDOWNLOAD_STATE)
    {
        this.model.updateState(state)
        this.view.updateState();
        ////console.log("回调回来了")
        switch(this.model.state)
        {
            case ASSETDOWNLOAD_STATE.none: 
                this.gotoLogin();
            break; 
        } 
    }
    processCb(speed,alreadydownloadsize,totalfilesize){ 
        this.model.updateProcess(speed,alreadydownloadsize,totalfilesize);
        this.view.updateProcess();
    }
    checkVersion(){ 
        //加载完服务器配置后就检查热更新 
        ////console.log("判断是否是从游戏重启中会来=",this.model.bBackFromHotupdate)
        if(this.model.bBackFromHotupdate)
        {
            VersionMgr.getInstance().initDirs();
            VersionMgr.getInstance().readLoaclVersionInfo();//读取本地版本号 
            this.gotoLogin();
            return;
        } 
        if (ServerMgr.getInstance().isEnableHotUpdate()) 
        {  
            VersionMgr.getInstance().initDirs();
            VersionMgr.getInstance().checkVersion(this.checkVersionCb.bind(this),this.processCb.bind(this)); 
        } 
        else
        { 
            this.gotoLogin();
        }
    }
    loadDataCb(code){
        if(code==0)
        {
            this.checkVersion();
        }
        else
        {
            this.setState(ASSETDOWNLOAD_STATE.loadproducterr);
        }
    }
}
