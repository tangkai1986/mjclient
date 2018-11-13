import UserMgr from "../GameMgrs/UserMgr";

/**
 * create by JACKY 2018.3.12
 */ 
export default class GpsSdkMgr {
    private static _GpsCtor : GpsSdkMgr;
    public GpsInfo = "";
    public static getInstance () : GpsSdkMgr {
        if (! this._GpsCtor) {
            this._GpsCtor = new GpsSdkMgr();
        } return this._GpsCtor;
    }

    /**
     * 获取高德地址
     */
    getAddress () : string {
        if (cc.sys.isNative) {
            if (!this.GpsInfo) return "";
            //console.log("获取高德地址",this.GpsInfo[0],this.GpsInfo[1]);
            return this.GpsInfo[0]+this.GpsInfo[1];
        }
        
        return "";
    }

    sendGpsInfo(){
        if(!cc.sys.isBrowser){
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                let StringInfo = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getAddress", "()Ljava/lang/String;");
                //console.log(StringInfo)
                if(!StringInfo){
                    //console.log("sendGpsInfo error")
                    return;
                }
                this.GpsInfo = StringInfo.split('/');
                let msg = {
                    'city':this.GpsInfo[0],
                    'sub_city':this.GpsInfo[1],
                    'long':this.GpsInfo[2],
                    'lat':this.GpsInfo[3],
                }
                UserMgr.getInstance().sendGpsInfo(msg);
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                let StringInfo = jsb.reflection.callStaticMethod("AppController", "getAddress");
                //console.log("sendGpsInfo", StringInfo)
                if(!StringInfo){
                    //console.log("sendGpsInfo error")
                    return;
                }
                this.GpsInfo = StringInfo.split('/');
                let msg = {
                    'city':this.GpsInfo[0],
                    'sub_city':this.GpsInfo[1],
                    //临时修改维度
                    'long':this.GpsInfo[3],
                    'lat':this.GpsInfo[2],
                }
                UserMgr.getInstance().sendGpsInfo(msg);
            }
        }
    }
}