import LogMgr from "../GameMgrs/LogMgr";
import ServerMgr from "../../AppStart/AppMgrs/ServerMgr";
import AppInfoMgr from "../../AppStart/AppMgrs/AppInfoMgr";

/**
 * create by JustinLin 2018.2.2 9:52
 */ 
export default class WxSdkMgr {
    private static _wxCtor : WxSdkMgr;
    public static getInstance () : WxSdkMgr {
        if (! this._wxCtor) {
            this._wxCtor = new WxSdkMgr();
        } return this._wxCtor;
    }

    private _loginCb : Function;
    private _shareCb : Function;
    private wxCalssName = null;
    //分享成功回调
    constructor(){
        let rootPath=AppInfoMgr.getInstance().getAppActivityPath();
        this.wxCalssName=`${rootPath}/wxapi/WXEntryActivity`
    }
    shareSuccess () : void {
        if (this._shareCb) this._shareCb();
    }
    //openid, nickname. sex, language,city,province,country,headimgurl,privilege,unionid
}
window.G_JAVA_OUTPUT = WxSdkMgr.getInstance();