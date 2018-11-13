
import android from "./android";
import ios from "./ios";

export default class platform {
	private static _platform : platform;
	public WX_SHARE_TYPE:any
    public static getInstance () : platform {
        if (! this._platform) {
            this._platform = new platform();
			this._platform.init();
        }
		return this._platform;
    }
	private init () {
		window.G_PLATFORM={};
		if (cc.sys.os == cc.sys.OS_ANDROID) {
			window.G_PLATFORM = android.getInstance()
		}
		if (cc.sys.os == cc.sys.OS_IOS) {
			window.G_PLATFORM = ios.getInstance()
		}
		if (!cc.sys.isNative) return;
        G_PLATFORM.WX_SHARE_TYPE = {
            WXSceneSession:0,		//分享到聊天界面
            WXSceneTimeline:1,		//分享到朋友圈
            WXSceneFavorite:2		//分享到微信收藏
        }
	}
}