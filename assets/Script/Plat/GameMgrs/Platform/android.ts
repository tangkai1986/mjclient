import FrameMgr from "../FrameMgr";
import LoginMgr from "../LoginMgr";
import ShareMgr from "../ShareMgr";
import ServerMgr from "../../../AppStart/AppMgrs/ServerMgr";
import AppInfoMgr from "../../../AppStart/AppMgrs/AppInfoMgr";
import VersionMgr from "../../../AppStart/AppMgrs/VersionMgr";

import GpsSdk from "../../../Plat/SdkMgrs/GpsSdk";
import UserMgr from "../UserMgr";
import GEventDef from "../GEventDef";
import LocalStorage from "../../Libs/LocalStorage";
export default class platform_android {
    private static _platform_android : platform_android;
    public static getInstance () : platform_android {
        if (! this._platform_android) {
            this._platform_android = new platform_android()
        }
		return this._platform_android
    }
    // JAVA 类名
    private javaClassName = "org/cocos2dx/javascript/AppActivity";
    private javaWeChatClassName = null;
    // 全局事件标识
    private G_NETWORK_CHANGE = "networkChange";
    private G_BATTERY_CHANGE = "batteryChange";
    private G_LOCATION_RESULT= "locationResult";
    private G_WECHAT_EMPOWERMENT_SUCCESS = "weChat_empowerment_success";
    constructor(){ 
        let rootPath=AppInfoMgr.getInstance().getAppActivityPath();
        this.javaWeChatClassName=`${rootPath}/wxapi/WXEntryActivity`;

        var picDir = jsb.fileUtils.getWritablePath() +'img/';
        if (!jsb.fileUtils.isDirectoryExist(picDir)) {
            jsb.fileUtils.createDirectory(picDir);
        }

        var rawPicPath = cc.url.raw('resources/Share/img_share.jpg');
        var picData = jsb.fileUtils.getDataFromFile(rawPicPath);
        let check = jsb.fileUtils.getWritablePath() +'img/img_share.jpg' ;
        jsb.fileUtils.writeDataToFile(picData, check);
    }
    // JS 层主动请求

    // 预留java调用测试接口
    callJavaTest () {
        let methodName = "test";
        let methodSignature = "()V";
        jsb.reflection.callStaticMethod(this.javaWeChatClassName, methodName, methodSignature);
    }
    // 微信登陆
    weChatLogin () {
        let methodName = "weChatLogin";
        let methodSignature = "()V";
        jsb.reflection.callStaticMethod(this.javaWeChatClassName, methodName, methodSignature);
    }
    /**
     * 微信分享图片
     * @param type  0：好友   1：朋友圈   2: 微信收藏
     */
    wxShareImage (type) {
        let methodName = "shareImage";
        let methodSignature = "(Ljava/lang/String;I)V";
        this.screenshot((path)=>{
            jsb.reflection.callStaticMethod(this.javaWeChatClassName, methodName, methodSignature, path, type);
        });
    }
    /**
     * 分享图片
     * @param type  0：好友   1：朋友圈   2: 微信收藏
     */
    wxShareSpecificImage (type,path) {
        let methodName = "shareImage";
        let methodSignature = "(Ljava/lang/String;I)V";
        var picDir = jsb.fileUtils.getWritablePath() +'img/';
        let check = jsb.fileUtils.getWritablePath() +'img/img_share.jpg' ;
        if (!jsb.fileUtils.isDirectoryExist(picDir)) {
            jsb.fileUtils.createDirectory(picDir);
            var rawPicPath = cc.url.raw('resources/Share/img_share.jpg');
            var picData = jsb.fileUtils.getDataFromFile(rawPicPath);
            jsb.fileUtils.writeDataToFile(picData, check);
        }

        jsb.reflection.callStaticMethod(this.javaWeChatClassName, methodName, methodSignature, check, type);
    }
    /**
     * 微信分享内容
     * @param type      0：好友   1：朋友圈   2: 微信收藏
     * @param title     标题
     * @param content   内容
     * @param url       url
     */
    wxShareContent (type, title, content, url) {
        let methodName = "shareContent";
        let methodSignature = "(ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(this.javaWeChatClassName, methodName, methodSignature, type, title, content, url);
    }
    wxShareRoom (type, title, content, password) {
        let url = ServerMgr.getInstance().getInviteFriendJoinUrl(UserMgr.getInstance().getUid(),password);
        this.wxShareContent(type, title, content, url);
    }
    wxShareClub (type, title, content, club_id) {
        let url = ServerMgr.getInstance().getClubInviteFriendJoinUrl(UserMgr.getInstance().getUid(), club_id);
        this.wxShareContent(type, title, content, url);
    }
    // 获取当前网络数据
    getCurNetWorkData () {
        let methodName = "getCurNetWorkData";
        let methodSignature = "()Ljava/lang/String;";
        let o = jsb.reflection.callStaticMethod(this.javaClassName, methodName, methodSignature);
        cc.log("getCurNetWorkData ------> ", o);
        let data = JSON.parse(o);
        if (data != null){
            data.level = Math.min(5, Math.max(1, Number(data.level)));
        }
        G_FRAME.globalEmitter.emit(this.G_NETWORK_CHANGE, data);
	}
	// 获取当前电池百分比
    getBatteryPercent () {
        let methodName = "getBatteryPercent";
        let methodSignature = "()I";
        let o = jsb.reflection.callStaticMethod(this.javaClassName, methodName, methodSignature);
        cc.log("getBatteryPercent ------> ", o);
		G_FRAME.globalEmitter.emit(this.G_BATTERY_CHANGE, o)
	}
    // 复制内容到剪切板
    copyToClipboard (text) {
        let methodName = "copyToClipboard";
        let methodSignature = "(Ljava/lang/String;)Z";
        let o = jsb.reflection.callStaticMethod(this.javaClassName, methodName, methodSignature, text);
        if (o) this.showGreenTip("已复制到剪切板");
    }
    // android 手机振动
    moblieVibrator () {
        let methodName = "moblieVibrator";
        let methodSignature = "()V";
        jsb.reflection.callStaticMethod(this.javaClassName, methodName, methodSignature);
    }
    //获取剪贴版数据
    gainToClipboard(){
        let methodName = "getClipboardText";
        let methodSignature = "()Ljava/lang/String;";
        return jsb.reflection.callStaticMethod(this.javaClassName, methodName, methodSignature);
    }
    // 获取手机类型
    getPhoneType () {
        let methodName = "getPhoneType";
        let methodSignature = "()Ljava/lang/String;";
        return jsb.reflection.callStaticMethod(this.javaClassName, methodName, methodSignature);
    }
    // 设置麦克风开启关闭
    setMicrophoneMute (flag) {
        let methodName = "setMicrophoneMute";
        let methodSignature = "(Z)V";
        jsb.reflection.callStaticMethod(this.javaClassName, methodName, methodSignature, flag)
    }
    // 获取麦克风状态
    getMicrophoneMute(){
        let methodName = "getMicrophoneMute";
        let methodSignature = "()Z";
        return jsb.reflection.callStaticMethod(this.javaClassName, methodName, methodSignature);
    }
    // 设置扬声器开启关闭
    setSpeakerphoneOn (flag) {
        let methodName = "setSpeakerphoneOn";
        let methodSignature = "(Z)V";
        jsb.reflection.callStaticMethod(this.javaClassName, methodName, methodSignature, flag)
    }
    // 获取扬声器状态
    getSpeakerphoneOn(){
        let methodName = "getSpeakerphoneOn";
        let methodSignature = "()Z";
        return jsb.reflection.callStaticMethod(this.javaClassName, methodName, methodSignature);
    }
    /**
     * 开始定位
     * @param type      0：只定位一次   1：持续定位
     */
    startLocation (type) {
        let methodName = "startLocation";
        let methodSignature = "(I)V";
        jsb.reflection.callStaticMethod(this.javaClassName, methodName, methodSignature, type)
    }
    // 关闭定位
    stopLocation () {
        let methodName = "stopLocation";
        let methodSignature = "()V";
        jsb.reflection.callStaticMethod(this.javaClassName, methodName, methodSignature)
    }
    // JAVA 层主动推送
    // java 错误事件
    global_error (msg) {
        this.showRedTip(msg);
    }
    global_info (msg) {
        this.showGreenTip(msg);
    }
    // 定位结果
    locationResult (msg) {
        //console.log("定位结果回调", msg,JSON.stringify(msg));
        if (parseInt(msg.code)) {
            GpsSdk.getInstance().sendGpsInfo() 
        } 
        G_FRAME.globalEmitter.emit(this.G_LOCATION_RESULT,msg)
    }
    // 微信分享回调
    onWeChatShare () {
        // java 层已处理分享相关提示信息
        // js 这里只负责处理分享成功
        console.log("onWeChatShare success")
        ShareMgr.getInstance().shareSuccess();
    }
    onWeChatloginSuccess (userInfo) {
        cc.log('java to js -> onWeChatloginSuccess: ', userInfo);
        let jsonObj = JSON.parse(userInfo);
        let msg = {
            'nickname':jsonObj.nickname,
            'headurl':jsonObj.headimgurl,
            'sex':jsonObj.sex,
            'username':jsonObj.unionid,
            'plat':2,
            'phoneType':G_PLATFORM.getPhoneType(),
        };
        //缓存头像
        // if(cc.sys.isNative) {
        //     console.log("downloadAndSaveHeadImg")
        //     let picDir = VersionMgr.getInstance().getStoragePath()+'/res/raw-assets/resources/headImgMap/';
        //     downloadAndSaveHeadImg(jsonObj.headimgurl,picDir, LocalStorage.getInstance());
        // }
        G_FRAME.globalEmitter.emit(this.G_WECHAT_EMPOWERMENT_SUCCESS, msg);
    }
    onNetworkChange (args) {
        cc.log("监听到网络变化", args);
        let data = JSON.parse(args);
        if (data != null){
            data.level = Math.min(5, Math.max(1, Number(data.level)));
        }
        G_FRAME.globalEmitter.emit(this.G_NETWORK_CHANGE, data);
    }
    onBatteryChange (args) {
        cc.log("监听到电量变化", args);
        G_FRAME.globalEmitter.emit(this.G_BATTERY_CHANGE, args)
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
    showRedTip (content) {
        FrameMgr.getInstance().showTips(content, null, 35, cc.color(220,24,63), cc.p(0,0), "Arial", 1500);
    };
    showGreenTip (content) {
        FrameMgr.getInstance().showTips(content, null, 35, cc.color(0,255,50), cc.p(0,0), "Arial", 1500);
    }
    //===========语音相关, 从Android回调过来     
    //进入房间语音，进入之后才可以正常调用语音接口
    onJoinVoiceRoom (){
        G_FRAME.globalEmitter.emit(GEventDef.voice_JoinRoomOk, null)
    }
    //离开房间语音的回调
    onDroppedVoiceRoom(args){
        cc.log("onDroppedVoiceRoom", args);
        G_FRAME.globalEmitter.emit(GEventDef.voice_DroppedRoomOk, args)
    }
    //退出声音房间的回调   
    onQuitVoiceRoom(){
        G_FRAME.globalEmitter.emit(GEventDef.voice_QuitRoomOk, null)
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
