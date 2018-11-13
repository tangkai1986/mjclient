

import FrameMgr from "../FrameMgr";
import LoginMgr from "../LoginMgr";
import ShareMgr from "../ShareMgr";
import ServerMgr from "../../../AppStart/AppMgrs/ServerMgr";
import GpsSdk from "../../../Plat/SdkMgrs/GpsSdk";
import UserMgr from "../UserMgr";
import GEventDef from "../GEventDef";

export default class platform_ios {
    private static _platform_ios : platform_ios;
    public static getInstance () : platform_ios {
        if (! this._platform_ios) {
            this._platform_ios = new platform_ios();
        }
		return this._platform_ios;
	}
    // ios 类名
	private iosClassName = "AppController"
    // 全局事件标识
    private G_NETWORK_CHANGE = "networkChange"
    private G_BATTERY_CHANGE = "batteryChange"
    //回调函数名称 
    private NETWORK_CALL_NAME = "G_PLATFORM.onNetworkChange"
    private BATTERY_CALL_NAME = "G_PLATFORM.onBatteryChange"
    private G_LOCATION_RESULT= "locationResult";
    private G_WECHAT_EMPOWERMENT_SUCCESS = "weChat_empowerment_success";

    constructor(){ 
        let picDir = jsb.fileUtils.getWritablePath() +'img/';
        if (!jsb.fileUtils.isDirectoryExist(picDir)) {
            jsb.fileUtils.createDirectory(picDir);
        }

        let rawPicPath = cc.url.raw('resources/Share/img_share.jpg');
        let picData = jsb.fileUtils.getDataFromFile(rawPicPath);
        let check = jsb.fileUtils.getWritablePath() +'img/img_share.jpg' ;
        jsb.fileUtils.writeDataToFile(picData, check);
    }
    // JS 层主动请求
    getCurNetWorkData () {
        let methodName = "listenNetWorkingStatus:";
        jsb.reflection.callStaticMethod(this.iosClassName,methodName, this.NETWORK_CALL_NAME);
		//console.log("getCurNetWorkData ------> ");
		//G_FRAME.globalEmitter.emit(this.G_NETWORK_CHANGE, JSON.parse(o))
	}
    getBatteryPercent () {
        let methodName = "callStaticMethod:";
        let o = jsb.reflection.callStaticMethod(this.iosClassName, methodName, this.BATTERY_CALL_NAME);
        //console.log("getBatteryPercent ------> ", o);
		G_FRAME.globalEmitter.emit(this.G_BATTERY_CHANGE, Number(o)*100);
	}
	onNetworkChange (args) {
        //console.log("监听到 IOS 网络变化", args);
        let data = JSON.parse(args);
        if (data != null){
            data.level = Math.min(5, Math.max(1, Number(data.level)));
        }
        G_FRAME.globalEmitter.emit(this.G_NETWORK_CHANGE, data);
	}
	onBatteryChange (args) {
        //console.log("监听到 IOS 电量变化", args);
        G_FRAME.globalEmitter.emit(this.G_BATTERY_CHANGE, Number(args)*100);
    }    
    //微信--------------------------------------------
    // 微信登陆
    weChatLogin () {
        let methodName = "weChatLogin";
        jsb.reflection.callStaticMethod(this.iosClassName, methodName);
    }
    /**
     * 微信分享图片
     * @param type  0：好友   1：朋友圈
     */
    wxShareImage (type) {
        let methodName = "shareImage:path:";
        this.screenshot((path)=>{
            jsb.reflection.callStaticMethod(this.iosClassName, methodName, type, path);
        });
    }
    /**
     * 分享图片
     * @param type  0：好友   1：朋友圈   2: 微信收藏
     */
    wxShareSpecificImage (type,path) {
        let methodName = "shareImage:path:";
        let picDir = jsb.fileUtils.getWritablePath() +'img/';
        let check = jsb.fileUtils.getWritablePath() +'img/img_share.jpg' ;
        if (!jsb.fileUtils.isDirectoryExist(picDir)) {
            jsb.fileUtils.createDirectory(picDir);
            let rawPicPath = cc.url.raw(path);
            let picData = jsb.fileUtils.getDataFromFile(rawPicPath);
            jsb.fileUtils.writeDataToFile(picData, check);
        }
        jsb.reflection.callStaticMethod(this.iosClassName, methodName, type, check);
    }
    /**
     * 微信分享内容
     * @param type      0：好友  1：朋友圈
     * @param title     标题
     * @param content   内容
     * @param url       url
     */
    wxShareContent (type, title, content, url) : void {
        let methodName = "shareContent:title:content:url:";
        jsb.reflection.callStaticMethod(this.iosClassName, methodName, type, title, content, url);
    }
    wxShareRoom (type, title, content, password) {
        let url = ServerMgr.getInstance().getInviteFriendJoinUrl(UserMgr.getInstance().getUid(),password);
        this.wxShareContent(type, title, content, url);
    }
    wxShareClub (type, title, content, club_id) {
        let url = ServerMgr.getInstance().getClubInviteFriendJoinUrl(UserMgr.getInstance().getUid(), club_id);
        this.wxShareContent(type, title, content, url);
    }
    // 微信分享回调
    onWeChatShare () {
        // java 层已处理分享相关提示信息
        // js 这里只负责处理分享成功
        ShareMgr.getInstance().shareSuccess();
    }
    onWeChatloginSuccess (userInfo) {
        cc.log('ios to js -> onWeChatloginSuccess: ', userInfo);
        let jsonObj = JSON.parse(userInfo);
        let msg = {
            'nickname':jsonObj.nickname,
            'headurl':jsonObj.headimgurl,
            'sex':(typeof jsonObj.sex=="string")?Number(jsonObj.sex):jsonObj.sex,
            'username':jsonObj.unionid,
            'plat':2,
        };
        G_FRAME.globalEmitter.emit(this.G_WECHAT_EMPOWERMENT_SUCCESS, msg);
    };
    // 复制内容到剪切板
    copyToClipboard (text) {
        let methodName = "copyToClipboard:";
        let o = jsb.reflection.callStaticMethod(this.iosClassName, methodName, ""+text);
        if (o) this.showGreenTip("已复制到剪切板");
    }
    // android 手机振动
    moblieVibrator () {
        let methodName = "moblieVibrator";
        jsb.reflection.callStaticMethod(this.iosClassName, methodName);
    }
    //获取剪贴版数据
    gainToClipboard(){
        let methodName = "gainToClipboard";
        let o = jsb.reflection.callStaticMethod(this.iosClassName, methodName);
        return o;
    }
    /**
     * 开始定位
     * @param type      0：只定位一次   1：持续定位
     */
    startLocation (type) {
        let methodName = "startLocation";
        jsb.reflection.callStaticMethod(this.iosClassName, methodName);
    }
    // 关闭定位
    stopLocation () {
    }
    global_info (msg) {
        this.showGreenTip(msg);
    }
    // 定位结果
    locationResult (msg) {
        //console.log("定位结果回调", msg)
        if (parseInt(msg.code)) {
            GpsSdk.getInstance().sendGpsInfo() 
        } 
        G_FRAME.globalEmitter.emit(this.G_LOCATION_RESULT,msg)
    }
     // 截屏函数
    screenshot (func) {
        if (!cc.sys.isNative) return;
        let dirpath = jsb.fileUtils.getWritablePath() + 'screenshot/';
        if (!jsb.fileUtils.isDirectoryExist(dirpath)) {
            jsb.fileUtils.createDirectory(dirpath);
        }
        let name = 'screenshot-' + (new Date()).valueOf() + '.png';
        let filepath = dirpath + name;
        let size = cc.director.getVisibleSize();
        let rt = cc.RenderTexture.create(size.width, size.height, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
        cc.director.getScene()._sgNode.addChild(rt);
        rt.setVisible(false);
        rt.begin();
        cc.director.getScene()._sgNode.visit();
        rt.end();
        rt.saveToFile('screenshot/' + name, cc.ImageFormat.PNG, true, function() {
            cc.log('save succ');
            rt.removeFromParent();
            if (func) {
                func(filepath);
            }
        });
    };
    showTip (content) {
        FrameMgr.getInstance().showTips(content, null, 35, cc.color(220,24,63), cc.p(0,0), "Arial", 1500);
    }
    showGreenTip (content) {
        FrameMgr.getInstance().showTips(content, null, 35, cc.color(0,255,50), cc.p(0,0), "Arial", 1500);
    }
    // 设置麦克风开启关闭
    setMicrophoneMute (flag) {
        let methodName = "setMicrophoneMute:";
        jsb.reflection.callStaticMethod(this.iosClassName, methodName, flag)
    }
    // 获取麦克风状态
    getMicrophoneMute(){
        let methodName = "getMicrophoneMute";
        return jsb.reflection.callStaticMethod(this.iosClassName, methodName);
    }
    // 设置扬声器开启关闭
    setSpeakerphoneOn (flag) {
        let methodName = "setSpeakerphoneOn:";
        jsb.reflection.callStaticMethod(this.iosClassName, methodName, flag)
    }
    // 获取扬声器状态
    getSpeakerphoneOn(){
        let methodName = "getSpeakerphoneOn";
        return jsb.reflection.callStaticMethod(this.iosClassName, methodName);
    }
    //退出声音房间的回调
    onQuitVoiceRoom(){
        G_FRAME.globalEmitter.emit(GEventDef.voice_QuitRoomOk, null)
    }
    //进入房间语音，进入之后才可以正常调用语音接口
    onJoinVoiceRoom (){
        G_FRAME.globalEmitter.emit(GEventDef.voice_JoinRoomOk, null)
    }
    //离开房间语音的回调
    onDroppedVoiceRoom(args){
        cc.log("onDroppedVoiceRoom", args);
        G_FRAME.globalEmitter.emit(GEventDef.voice_DroppedRoomOk, args)
    }
    //申请许可成功
    onApplyMessageKeySuccess(){
        //console.log("onApplyMessageKeySuccess");
        G_FRAME.globalEmitter.emit(GEventDef.voice_ApplyMessageKeySuccessOk, null)
    }
    //上传录音文件成功回调
    onUploadFileComplete(args){
        //console.log("onUploadFileComplete",args);
        G_FRAME.globalEmitter.emit(GEventDef.voice_UploadFileCompleteOk, args)
    }
    //播放语音回调
    onPlayRecordedFile(){
        //console.log("onPlayRecordedFile");
        G_FRAME.globalEmitter.emit(GEventDef.voice_PlayRecordedFileOk, null)
    }
    //播放完成回调
    onPlayRecordedFileComplete(){
        //console.log("onPlayRecordedFileComplete");
        G_FRAME.globalEmitter.emit(GEventDef.voice_PlayRecordedFileCompleteOk, null)
    }
}
