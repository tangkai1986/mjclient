 

//

export default class AppInfoMgr{ 
    //单例处理 
 
    private static _instance:AppInfoMgr;
    private appid='com.bamingmajiangshijie.wmwb';
    private appname='八闽麻将世界';
    public static getInstance ():AppInfoMgr{
        if(!this._instance){
            this._instance = new AppInfoMgr();
        }
        return this._instance;
    }   
    getAppActivityPath(){
        let path=this.appid.replace(/\./g, '/');
        return path;
    }
    getAppId(){
        return this.appid;
    }
    getAppName(){
        return this.appname;
    }
}
