 

//
 
export default class ServerMgr{ 
    //单例处理 

    settingPath='Configs/AppStart/localsetting';
    localsetting=null;
    callback=null;
    servercfg=null;
    b_enableHotUpdate=false;
    private timer_delay=null; 
    private static _instance:ServerMgr;
    public static getInstance ():ServerMgr{
        if(!this._instance){
            this._instance = new ServerMgr();
        }
        return this._instance;
    }  
    constructor(){
        this.b_enableHotUpdate = cc.sys.isNative&&cc.sys.isMobile; 
    }
    loadLoacalSetting(callback)
    {
        this.callback=callback;
		this.loadRes(this.settingPath,this.loadSettingCb);
    }
    //清除timer
    clearTimer(){
        if(this.timer_delay!=null){
			clearTimeout(this.timer_delay);
			this.timer_delay=null;
		}
    }
    //下载超时
    timeout(){
        this.clearTimer();
        this.callback(-1);
    }
    //防止超时
    newTimer(){
		if(this.timer_delay==null){  
			this.timer_delay=setTimeout(this.timeout.bind(this),10000)
		}
    }    
    loadRes(name,cb)
    {
        cc.loader.loadRes(name, function (err, data) {
            if(err)
            {
                //console.log(`cc.loader.loadRes err=,${JSON.stringify(err)},${name}`)
            }
            else
            {
                cb.bind(this)(name,data)
            }
        }.bind(this));
    } 
    getHotupdateVersionUrl(){  
        return `${this.servercfg.hotUrl}`;  
    }
    getProductTag()
    {
        return  this.localsetting.producttag;
    }
    getSubGameCfg(gamecode)
    {
        return this.servercfg.subgamesvrsettings[gamecode];
    }
    loadSettingCb(name,data)
    {
        this.newTimer();
        this.localsetting=data; 
        let xhr = cc.loader.getXMLHttpRequest(); 
        ////console.log("下载配置=",xhr)   
		xhr.onreadystatechange = function () {  
			cc.log('xhr.readyState='+xhr.readyState+'  xhr.status='+xhr.status);  
			if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {  
                let respone = xhr.responseText;  
                this.servercfg = JSON.parse(respone)
                this.clearTimer();
                this.callback(0);
            }   
		}.bind(this);   
		//xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");   
		// note: In Internet Explorer, the timeout property may be set only after calling the open()  
		// method and before calling the send() method.  
		xhr.timeout = 5000; 
		xhr.onerror = (error)=> {
            ////console.log("loadSettingCb 出错啦")
            this.clearTimer();
            this.callback(-1);
        } 
        xhr.ontimeout = () => {
            ////console.log("loadSettingCb 超时啦")
            this.clearTimer();
            this.callback(-1);
        };
        let URLProducttag = data.producttag;
        if(!cc.sys.isNative && window && window.location && window.location.href) {
            URLProducttag = this.analysisURLParameter(window.location.href).args.producttag;
            ////console.log("哈哈哈=",URLProducttag,data.producttag)
        }
        window['__errorReportUrl']=`${data.cfgurl}:10001`;//错误报告地址
        if(!window['__errorUserInfo'])
        {
            window['__errorUserInfo']={};
        }
        window['__errorUserInfo']['tag']=data.producttag;
		let wholeurl=`${data.cfgurl}/products/${URLProducttag || data.producttag}.json`
		////console.log("wholeurl=",wholeurl)
		xhr.open("GET", wholeurl,true); 
		xhr.send(); 
    }
    // 解析URL是否带调试参数
    analysisURLParameter(URL) {
        let arr = URL.split("?")
        let obj = {
            url: null,
            args: {}
        };
        obj.url = arr[0];
        // 拆分后如果长度小于2说明URL是不带参数的
        if (arr.length < 2) return obj;
        let mapArr = arr[1].split("&");
        for (let i=0; i<mapArr.length; i++) {
            let parameter = mapArr[i].split("=");
            obj.args[parameter[0]] = parameter[1];
        }
        ////console.log("解析URL", obj)
        return obj
    }
    isEnableHotUpdate(){
        return this.b_enableHotUpdate;
    }
    getServerCfg(){
        return this.servercfg;
    }
    getGameRuleUrl(name,ruletype){  
        return `http://gme.fj116.com/gamerule/${name}/${ruletype}.html`
    } 
    gettiaokuanUrl(){
        return `http://gme.fj116.com/service.html`
    }
    getzhengceUrl(){
        return `http://gme.fj116.com/privacy.html`
    }
    getDownLoadPage(){
        return this.servercfg.downLoadPage;
    }
    getInviteFriendJoinUrl(uid,password){ 
        return `http://d.fj116.com/index.html?uid=${uid}&action=joingame&password=${password}`
    }
    getClubInviteFriendJoinUrl(uid,clubid){ 
        return `http://d.fj116.com/index.html?uid=${uid}&action=clubjoingame&clubid=${clubid}`
    }
    //获取录像的url
    getGameVideoUrl(gamecode,recordcode)
    {
        let platSvrHost=this.servercfg.platSvrHost;
        let platSvrPort=this.servercfg.platSvrPort;
        let originhost=null;
        if(platSvrHost.indexOf('.com')>=0)
        {
            originhost=platSvrHost
        }
        else
        {
            originhost=platSvrHost=`http://${platSvrHost}:${platSvrPort}` 
        }
        let host=encodeURI(originhost)
        let url=`${this.servercfg.resUrl}/gamevideo?host=${host}&gamecode=${gamecode}&recordcode=${recordcode}`  
        ////console.log("video url=",url)
        return url;
    }

}
