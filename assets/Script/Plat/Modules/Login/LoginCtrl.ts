import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import platform from "../../GameMgrs/Platform/platform";
import LoginMgr from "../../GameMgrs/LoginMgr";
import FrameMgr from "../../GameMgrs/FrameMgr";
import SwitchMgr from "../../GameMgrs/SwitchMgr";
import VerifyMgr from "../../GameMgrs/VerifyMgr";
import VersionMgr from "../../../AppStart/AppMgrs/VersionMgr";
import ServerMgr from "../../../AppStart/AppMgrs/ServerMgr";
import PointMgr from "../../GameMgrs/PointMgr";
import LocalStorage from "../../Libs/LocalStorage";
import SwitchSettingCfg from "../../CfgMgrs/SwitchSettingCfg";

//MVC编码示范,
const {ccclass, property} = cc._decorator;
let ctrl : LoginCtrl;
//模型，数据处理
class Model extends BaseModel {
    private username=''
    private password=''
    public visitorSwitch = null;
    public wxSwitch = null;
    public kefuSwtich = null;    
    public agreementSwitch=null;
    public versioninfo=null;
    public backgroudMusicID = null;
    constructor()
    {
        super(); 
        this.visitorSwitch = SwitchMgr.getInstance().get_switch_visitors_login();
        this.wxSwitch = SwitchMgr.getInstance().get_switch_wechat_login();
        this.kefuSwtich = SwitchMgr.getInstance().get_switch_customer_service();        
        this.agreementSwitch=SwitchMgr.getInstance().get_switch_wechat_agreement();
        this.versioninfo=VersionMgr.getInstance().getVersionInfo();
        this.initClubList();
    }
    updateSwitch(msg)
    {
        this.visitorSwitch = msg.cfg.switch_visitors_login;
        this.wxSwitch = msg.cfg.switch_wechat_login;
        this.kefuSwtich = msg.cfg.switch_customer_service;
        this.agreementSwitch = msg.cfg.switch_wechat_agreement;
    }
    initClubList(){
        if(LocalStorage.getInstance().getClubList()){
            LocalStorage.getInstance().removeDataByKey('clublist')
        }
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    ui={
        btn_phone_login:null,
        btn_visitor_login:null,
        btn_tiaokuan:null,
        btn_zhengce:null,
        btn_kefu:null,
        testBtns:[],
        toggle_tiaokuan:null,
        lbl_version:null,
        btn_clearCache:ctrl.btn_clearCache,
    }
    constructor(model){
        super(model);
        this.node=ctrl.node;  
        this.initUi();
    } 
    initUi()
    {
        this.ui.lbl_version=ctrl.lbl_version;
        this.ui.btn_phone_login=ctrl.btn_phone_login;
        this.ui.btn_visitor_login=ctrl.btn_visitor_login;
        this.ui.btn_tiaokuan = ctrl.btn_tiaokuan;
        this.ui.btn_zhengce = ctrl.btn_zhengce;
        this.ui.btn_kefu = ctrl.btn_kefu; 
        this.ui.btn_visitor_login.active=false;
        this.ui.btn_phone_login.active=false;
        this.ui.btn_kefu.active = false;
        this.ui.toggle_tiaokuan = ctrl.toggle_tiaokuan;
        this.ui.toggle_tiaokuan.node.active = false;
        this.ui.btn_tiaokuan.active = false;
        this.ui.btn_zhengce.active = false;
        //测试按钮
        this.showTestBtns();  
        let bEnableHotUpdate=ServerMgr.getInstance().isEnableHotUpdate();
        this.ui.lbl_version.node.active=bEnableHotUpdate;
        let versioninfo=this.model.versioninfo;
        if(bEnableHotUpdate&&versioninfo)
        {
            let versionstr=`V${versioninfo.versionstr} RES_${versioninfo.versioncode}_${versioninfo.svn}`;
            this.ui.lbl_version.string=versionstr; 
        }
    }
    showTestBtns()
    {
        let startx=-400;
        let starty= 100;
        let interX=140;
        let interY=60;
        let linecount=6;
        for(var i = 0;i<10;++i)
        { 
            let curNode = new cc.Node();
            let curLab = curNode.addComponent(cc.Label);
            curLab.string=`test${i+1}`;
            curNode.parent = this.node;
            curNode.active=!cc.sys.isMobile;
            curNode.position=cc.p(startx+(i%linecount)*interX,starty-interY*Math.floor(i/linecount));
            this.ui.testBtns.push(curNode)
        }
    } 
    //游客、微信登录开关
    showLoginButtons(){
        //这边暂时将游客登录代码关闭,因为国庆期间并且不知道后台
        this.ui.btn_visitor_login.active = this.model.visitorSwitch ==1?true:false;
        this.ui.btn_phone_login.active = this.model.wxSwitch==1?true:false;
    }
    //客服开关控制
    showKefuBtn(){
        this.ui.btn_kefu.active = this.model.kefuSwtich == 1?true:false;
    }
    hideXieyi(){
        this.ui.toggle_tiaokuan.node.active = false;
        this.ui.btn_tiaokuan.active = false;
        this.ui.btn_zhengce.active = false;
    }
    //协议开关控制
    showXieyiBtn(){
        let bool = this.model.agreementSwitch == 1 ? true : false;
        this.ui.btn_tiaokuan.active = bool;
        this.ui.btn_zhengce.active = bool;
        this.ui.toggle_tiaokuan.node.active = bool;
    }
}
//c, 控制
@ccclass
export default class LoginCtrl extends BaseCtrl {
    //这边去声明ui组件
    @property({
        tooltip : "游客登录",
        type : cc.Node
    })
    btn_visitor_login = null;
    @property({
        tooltip : "微信登录",
        type : cc.Node
    })
    btn_phone_login = null; 
    @property({
        tooltip : "服务条款",
        type : cc.Node
    })
    btn_tiaokuan = null;
    @property({
        tooltip : "隐私政策",
        type : cc.Node
    })
    btn_zhengce = null;
    @property({
        tooltip : "客服",
        type : cc.Node
    })
    btn_kefu = null;
    @property({
        tooltip : "版本号",
        type : cc.Label
    })
    lbl_version:cc.Label = null;  
    @property({
        tooltip : "条款协议",
        type : cc.Toggle
    })
    toggle_tiaokuan:cc.Toggle = null;


    
    @property(cc.Button)
    btn_clearCache:cc.Button = null;
    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离  
    private bShowExitDlg=false;//显示退出对话框
  
    onLoad (){
        //创建mvc模式中模型和视图
        //控制器
        ctrl = this;
        //数据模型 
        this.initMvc(Model,View);
        FrameMgr.getInstance();
        // 初始化 android ios 平台单例
        platform.getInstance();
        //添加背景音乐
        this.model.backgroudMusicID = cc.audioEngine.play(cc.url.raw("/resources/audio/plat/bgm_1.mp3"), true, 1);
        
    }
    //定义网络事件
    defineNetEvents()
    {
        this.n_events={
            'connector.entryHandler.enterPlat':this.connector_entryHandler_enterPlat,
            'http.reqGameSwitch':this.http_reqGameSwitch,
        }
    }
    //定义全局事件
    defineGlobalEvents()
    {
        this.g_events={
            'weChat_empowerment_success': this.weChat_empowerment_success, 
			'backPressed':this.backPressed,
        }
    } 
	exitGameCb(){
		cc.game.end();
	}
	cancelExitCb(){
	    this.bShowExitDlg=false;
	}
	//返回键
	backPressed()
	{
		if(this.bShowExitDlg)
		{
			return;
		}
		FrameMgr.getInstance().showDialog("确定离开",this.exitGameCb.bind(this), "系统提示",this.cancelExitCb.bind(this));
	    this.bShowExitDlg=true;
	}
    //绑定操作的回调
    connectUi()
    {  
        this.connect(G_UiType.image,this.ui.btn_visitor_login,this.btn_visitor_login_cb,'点击游客登录');
        this.connect(G_UiType.image,this.ui.btn_phone_login,this.btn_phone_login_cb,'点击手机登录');
        this.connect(G_UiType.image,this.ui.btn_tiaokuan,this.btn_tiaokuan_cb,"点击同意服务条款");
        this.connect(G_UiType.image,this.ui.btn_zhengce,this.btn_zhengce_cb,"点击同意隐私政策");
        this.connect(G_UiType.image,this.ui.btn_kefu,this.btn_kefu_cb,"点击客服按钮")
        for(let i = 0;i<this.ui.testBtns.length;++i)
        {
            var item=this.ui.testBtns[i];
            item.on(cc.Node.EventType.TOUCH_END, function (event) {
                //加入操作日志
            //去登录服务器
            var msg={
                'username':`test${i+1}`,
                'password':`test${i+1}`
            }
            switch(i)
            {
                case 6:{
                    msg={
                        'username':`oUY641eUPgIxE0WT-VkXCasAjJw0`,
                        'password':`123456`
                    }
                }
                break;
                
                case 7:{
                    msg={
                        'username':`oUY641WzO6CLona5D4ddyQ5Im35Y`,
                        'password':`123456`
                    }
                }
                break;
                case 8:{
                    msg={
                        'username':`oUY641ewOVkqNQyNAVhpGhm3TLug`,
                        'password':`123456`
                    }
                }
                break;
                case 9:{
                    msg={
                        'username':`oUY641QYUt2a8nIs64d8IByAsmWs`,
                        'password':`123456`
                    }
                }
                break;
            }  
            LoginMgr.getInstance().reqLogin(msg);  
            },this);
        }
        
        this.ui.btn_clearCache.node.on(cc.Node.EventType.TOUCH_END, (event)=> {
            this.clearCacheCb();
        }, this) 
    }
    
    //清空缓存
    clearCacheCb(){
        VersionMgr.getInstance().clearHotUpdate();
    }
    http_reqGameSwitch(msg){
        this.model.updateSwitch(msg) 
        this.view.showKefuBtn();
        // 检测微信缓存登陆信息, 判断是否需要自动登陆
        let weChatLoginCache = LoginMgr.getInstance().getWeChatLoginCache();
        if (weChatLoginCache){
            this.ui.toggle_tiaokuan.getComponent(cc.Toggle).isChecked == true;
            this.view.hideXieyi();
            LoginMgr.getInstance().setLoginCache(weChatLoginCache);
            LoginMgr.getInstance().weChatAutoLogin();
            PointMgr.getInstance().wxLoginPoint();//微信登陆数据统计
        }
        else{
            this.view.showXieyiBtn();
            this.view.showLoginButtons();
        }
    }
    start () {
        if (this.isIPhoneX()) {
            this.resetDesignResolution(this.node.getComponent(cc.Canvas))
        }
        LoginMgr.getInstance();//初始化login
        PointMgr.getInstance().lunchPoint();//启动游戏数据统计
        this.loadSwitchSetting();
    }
    //加载完本地开关配置后才加载服务器的开关设置
    loadSwitchSettingCb(){
        SwitchMgr.getInstance().reqGameSwitch();
    }
    //加载开关配置,优先级高于服务器配置
    loadSwitchSetting(){
        SwitchSettingCfg.getInstance().load(this.loadSwitchSettingCb.bind(this));
    }
    //网络事件回调begin
    connector_entryHandler_enterPlat(msg)
    {
        //进入加载页面
        this.start_module(G_MODULE.LoadingPlat); 
    }
    //end
    //全局事件回调begin
    weChat_empowerment_success (msg) {
        LoginMgr.getInstance().weChatLogin(msg)
    }
    //end
    //按钮或任何控件操作的回调begin
 
    btn_visitor_login_cb(node,event)
    {
        if(this.ui.toggle_tiaokuan.getComponent(cc.Toggle).isChecked == true){
            //去登录服务器
            // var msg={
            //     'username':'test1',
            //     'password':'test1'
            // }
            // LoginMgr.getInstance().reqLogin(msg); 
            var getRandomArea=function (downNum:number, upNum:number) {
                return parseInt(Math.random() * (upNum - downNum + 1) + downNum + '');
            } 
            var msg={
                'username': getRandomArea(100,1000000),
                'password': getRandomArea(100,1000000),
            }
            LoginMgr.getInstance().reqRegister(msg);
            cc.audioEngine.stop(this.model.backgroudMusicID);
        }else{
            FrameMgr.getInstance().showTips('请勾选同意下方的服务条款、隐私政策，即可进入游戏哦',null,35,cc.color(220,24,63), cc.p(0,0), "Arial", 1000);
        }   
    } 
    btn_phone_login_cb(node,event)
    {
        if(this.ui.toggle_tiaokuan.getComponent(cc.Toggle).isChecked == true){
            // this.start_sub_module(G_MODULE.UserLogin);
            if(!cc.sys.isNative){
                var json = {"openid":"oMeCa0VwuvOxKotgroWiSldj1OLcw",
                "nickname":";",
                "sex":1,
                "language":"zh_CN",
                "city":"Xiamen",
                "province":"Fujian",
                "country":"CN",
                "headimgurl":"http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLRLdXHaicsXMNRX4sjktuu4libiahmJku1HUiaeAcvO7Gv3IurWXO7wic9pKXu8bT1jV5RUaAyGszKWcA/132",
                "privilege":[],
                "unionid":"od5wi0ugoxn4FfwuWXWE76mBz-Ec"}
                let msg = {
                    'nickname':json.nickname,
                    'headurl':json.headimgurl,     
                    'sex':json.sex,     
                    'username':json.unionid,   
                    'plat':2,       //微信登录
                    'phoneType':'4.4.2_MI NOTE LTE_Xiaomi',
                }
                G_FRAME.globalEmitter.emit('weChat_empowerment_success', msg);
            }else{
                //console.log("weChatLogin");
                
                G_PLATFORM.weChatLogin();
                PointMgr.getInstance().wxLoginPoint();
            }
            cc.audioEngine.stop(this.model.backgroudMusicID);
        }else{
            FrameMgr.getInstance().showTips('请勾选同意下方的服务条款、隐私政策，即可进入游戏哦',null,35,cc.color(220,24,63), cc.p(0,0), "Arial", 1000);
        }   
    }
    btn_tiaokuan_cb(){
        //console.log("btn_tiaokuang_cb"); 
        this.start_sub_module(G_MODULE.Web_xieyi,function (prefabComp,prefabNode) {
            prefabComp.showxieyi(0)
        }, "Prefab_Web_xieyiCtrl");
    }
    btn_zhengce_cb(){
        //console.log("btn_zhengce_cb");
        this.start_sub_module(G_MODULE.Web_xieyi,function(prefabComp,prefabNode){
            prefabComp.showxieyi(1)
        },"Prefab_Web_xieyiCtrl"); 
    }
    btn_kefu_cb(){
        //console.log("btn_kefu_cb");
        this.start_sub_module(G_MODULE.CustomService);
    }
    //end
}
