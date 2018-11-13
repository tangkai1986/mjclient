import ServerMgr from "./ServerMgr";

 
//版本管理即热更新管理
 
enum ASSETDOWNLOAD_STATE{
    none=0,
    checking,//检测中
    newfullversion,//重新下载新版
    downloading,//下载中
    complete,//完成
    downfailed,//下载失败
    neterr,//网络错误
    loadingproduct,//加载远程配置
    loadproducterr,//加载远程配置错误
    loadremotemd5,//加载远程版本列表
    needdownloadnewverison,//需要下载新版本
}
window['ASSETDOWNLOAD_STATE']=ASSETDOWNLOAD_STATE  
let MAX_TASK_COUNT=8;
export default class VersionMgr{ 
    //单例处理 
 
    private static _instance:VersionMgr;
    public static getInstance ():VersionMgr{
        if(!this._instance){
            this._instance = new VersionMgr();
        }
        return this._instance;
    }
    private remoteVersionInfo=null;//远程版本信息 
    private remoteMd5dic=null;//远程md5列表
    private localMd5dic=null;//本地md5列表
    private localVersionInfo=null;//本地版本信息
    private checkVersionCb=null;//检测版本的回调
    private _storagePath=null;//热更新地址 
    private versionFileName='version.json';//版本文件
    private md5dicfFileName='md5dic.json';//md5文件列表  
    private rootDownLoadUrl='';//下载跟路径
    private newFileDic=null;//新的文件列表 
    private downloadprocess=0;
    private alreadydownloadsize=0;
    private totalfilesize=0; 
    private state:ASSETDOWNLOAD_STATE;
    private processCb=null;
    private timer_delay=null; 
    private completeDic={};
    private downloaderDic={};//下载器字典 
    private curfilealreadysize=0; 
    private failedtasks=[];//失败的队列
    private runningtasks=[];//运行中的队列
    private timedic={};//时间字典
    private timer=null;//定时器
    private startDownLoadTime=0; 
    //构造函数
    
    constructor(){ 
    }
    //获取存储位置
    getStoragePath(){
        return this._storagePath;
    } 
    //初始化一些路径
    initDirs(){ 
        this.rootDownLoadUrl=ServerMgr.getInstance().getHotupdateVersionUrl(); 
        ////console.log("读取内容=")
        let str = cc.sys.localStorage.getItem('hotupdateinfo'); 
        if (str&&str.length>0) {
            //如果缓存中已存在这些路径则去缓存中获取
			let info=JSON.parse(str);
			this._storagePath=info._storagePath; 
            ////console.log("检查过期内容")
            
            this.checkHotUpdateIsExpire();//检查热更新过期并移除 
            ////console.log("新建热更新路径=1",this._storagePath)
            ////console.log("新建热更新路径=2",jsb.fileUtils.getSearchPaths()) 
        }
        else
        {
            //如果缓存中没这些路径,则生成他
            let tag=ServerMgr.getInstance().getProductTag(); 
            let rootPath = jsb.fileUtils.getWritablePath();  
            //构成存储路径
            this._storagePath=`${rootPath}dzwphotupdate_${tag}`;   
            jsb.fileUtils.createDirectory(this._storagePath) 
            let searchPaths = jsb.fileUtils.getSearchPaths();
            ////console.log("新建热更新路径=1",jsb.fileUtils.getSearchPaths()) 
            searchPaths.unshift(this._storagePath);  
            let hotupdateinfo={
                searchPaths:searchPaths,//搜索路径
                _storagePath:this._storagePath,//热更新下载路径 
                backfromhotupdate:false//是否从热更新中回来
            } 
            ////console.log("新建热更新路径=2",this._storagePath)
            cc.sys.localStorage.setItem('hotupdateinfo', JSON.stringify(hotupdateinfo)); 
            jsb.fileUtils.setSearchPaths(searchPaths); 
        }
    }
    //检查超时记录
    run(){
        //获取当前的事件
        let curTime=(new Date()).getTime();
        //延迟的队列
        let delayTask=[];
        //检测运行中任务的延时情况
        for(let i = 0;i<this.runningtasks.length;++i)
        {
            let filepath=this.runningtasks[i];
            let time=this.timedic[filepath] 
            //如果下载单个文件耗时超过这个时间,就添加到延迟队列中
            if(curTime-time>20000)
            { 
                delayTask.push(filepath)
            }
        }
        //将延迟的任务移除
        for(let i = 0;i<delayTask.length;++i)
        { 
            let filepath=delayTask[0]; 
            this.runningtasks.removeByValue(filepath)
        } 
        //如果有任务延迟,就去生成新的任务代替延迟任务
        if(delayTask.length>0)
        {
            //继续执行任务
            this.executeTasks();
        }
    }    
    //清除某个下载器
    removeTask(filepath){ 
        this.runningtasks.removeByValue(filepath); 
        delete this.downloaderDic[filepath]; 
        //移除后就要刷新任务
        this.refreshTasks(); 
    }   
    //刷新任务
    refreshTasks(){  
        //重新计算已下载文件的总大小
        this.alreadydownloadsize=0;
        for(let filepath in this.completeDic)
        {
            let item=this.newFileDic[filepath];
            if(!item)
            {
                continue;
            }
            this.alreadydownloadsize+=item.size;
        } 
        //执行任务
        this.executeTasks();      
    }      
    setAsBackFromHotupdate(){
        ////console.log("下载完了设置从重启中回来标志")
        let str = cc.sys.localStorage.getItem('hotupdateinfo'); 
        if (str) {
            //如果缓存中已存在这些路径则去缓存中获取
			let info=JSON.parse(str); 
            info.backfromhotupdate=true;
            cc.sys.localStorage.setItem('hotupdateinfo', JSON.stringify(info));
        }        
    } 
    resetBackFromHotupdate(){
        let str = cc.sys.localStorage.getItem('hotupdateinfo'); 
        if (str) {
            //如果缓存中已存在这些路径则去缓存中获取
			let info=JSON.parse(str); 
            info.backfromhotupdate=false;
            cc.sys.localStorage.setItem('hotupdateinfo', JSON.stringify(info));
        }        
    }
    isBackFromHotupdate(){
        let isBackFromHotUpdate=false;
        let str = cc.sys.localStorage.getItem('hotupdateinfo'); 
        if (str) {
            //如果缓存中已存在这些路径则去缓存中获取
			let info=JSON.parse(str); 
            isBackFromHotUpdate=info.backfromhotupdate; 
        } 
        return isBackFromHotUpdate;
    }
    //检测热更新目录下的文件是否比当前安装包版本低
    readLoaclVersionInfo(){
        //读取本地版本号 
        //完整版本号
        let localstr=jsb.fileUtils.getStringFromFile(this.versionFileName); 
        let versioninfoexist=localstr&&localstr.length>0; 
        //判断版本信息是否存在 
        if(versioninfoexist)
        {
            //本地版本信息 
            this.localVersionInfo=JSON.parse(localstr); 
            if(!window['__errorUserInfo'])
            {
                window['__errorUserInfo']={};
            }
            window['__errorUserInfo']['version']=this.localVersionInfo;
        } 
    }
    setState(state)
    {   
        this.clearTimer();
        this.state=state;
        this.checkVersionCb(state);
    }
    //检测版本   
    checkVersion(checkVersionCb,processCb)
    {   
        //记录热更新结果后的回调
        this.checkVersionCb=checkVersionCb; 
        this.processCb=processCb; 
        //检测本地的热更新目录文件
        this.readLoaclVersionInfo(); 
        //如果存在版本信息就去热更新
        if(this.localVersionInfo){
            //开始下载远程版本信息
            this.reqRemoteVersionInfo();
        }
        else
        {
            //没有版本信息就结束不热更
            this.setState(ASSETDOWNLOAD_STATE.none);
        }
    }
    getVersionInfo()
    {
        return this.localVersionInfo;
    }
  
    //检查热更新文件是否过期，并且移除
    checkHotUpdateIsExpire()
    {    
        ////console.log("哈哈哈=",window.g_localrootpath)
        if(window.g_localrootpath==null || window.g_localrootpath=='undefined')
        {
            return;
        }
        //如果缓存中已存在这些路径则去缓存中获取 
        ////console.log("获取代码=",window.g_localrootpath)  
        ////console.log("本地的version文件=",`${window.g_localrootpath}${this.versionFileName}`)
        let localversionstr=jsb.fileUtils.getStringFromFile(`${window.g_localrootpath}${this.versionFileName}`);
        let hotupdateversionpath=`${this._storagePath}/${this.versionFileName}`
        ////console.log("热更新版本路径=",hotupdateversionpath)
        let hotupdatemd5path=`${this._storagePath}/${this.md5dicfFileName}`
        ////console.log("热更新md5路径=",hotupdatemd5path)
        let hotupdateversionstr=jsb.fileUtils.getStringFromFile(hotupdateversionpath);
        ////console.log("热更新目录版本号=",hotupdateversionstr)
        let hotversionexist=hotupdateversionstr&&hotupdateversionstr.length>0; 
        ////console.log("hotversionexist=",hotversionexist)
        //如果热更新版本存在就去判断热更新问题
        if(hotversionexist){
            let localversion=JSON.parse(localversionstr);
            let hotupdateversion=JSON.parse(hotupdateversionstr);
            //如果本地版本比热更新版本还高的话，有可能是覆盖安装,需要移除热更新目录下所有内容
            ////console.log("本地版本信息=",localversion.versioncode,"远程版本信息=",hotupdateversion.versioncode)
            if(localversion.versioncode>hotupdateversion.versioncode){
                this.clearHotUpdate();//清空热更新下面的信息
            }
        } 
    }
    clearHotUpdate(){ 
        this.setAsBackFromHotupdate();
        let path=`${this._storagePath}/`
        let ret=jsb.fileUtils.removeDirectory(path);
        cc.sys.localStorage.clear();
        //重启
        cc.audioEngine.stopAll();
        cc.game.restart(); 
    }
    //获取远程的版本信息
    reqRemoteVersionInfo(){  
        let reqCbVersionInfo=function(str)
        {
            if(!str)
            {
                ////console.log("下载version失败")
                this.setState(ASSETDOWNLOAD_STATE.neterr);
                return;
            } 
            this.remoteVersionInfo=JSON.parse(str); 
            //比较版本号
            if(this.remoteVersionInfo.build>this.localVersionInfo.build)
            {
                this.setState(ASSETDOWNLOAD_STATE.needdownloadnewverison); 
            }
            else{
                if(this.remoteVersionInfo.versioncode>this.localVersionInfo.versioncode)
                {
                    //有热更新版本,就去下载md5列表文件
                    this.readLocalMd5dic();
                    this.setState(ASSETDOWNLOAD_STATE.loadremotemd5); 
                    this.downloadMd5dic();
                }
                else
                {
                    //没有热更新产生 
                    this.setState(ASSETDOWNLOAD_STATE.none); 
                }
            }

        }

        let xhr = cc.loader.getXMLHttpRequest();    
		xhr.onreadystatechange = () => {  
			//cc.log('xhr.readyState='+xhr.readyState+'  xhr.status='+xhr.status);  
			if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {  
                let respone = xhr.responseText;  
                let data = JSON.parse(respone)
                this.clearTimer();
                ////console.log("获取到了内容=",this.versionFileName,respone)
                reqCbVersionInfo.bind(this)(respone);
            }   
		};     
		xhr.timeout = 20000; 
        let url=`${this.rootDownLoadUrl}/${this.versionFileName}` 
		xhr.onerror = (error)=> {
            ////console.log(`httpRequest${url}出错啦`)
            this.clearTimer();
            reqCbVersionInfo.bind(this)(null);
        } 
        xhr.ontimeout = () => {
            ////console.log(`httpRequest${url}超时啦`)
            this.clearTimer();
            reqCbVersionInfo.bind(this)(null);
        }; 
		xhr.open("GET", url,true); 
		xhr.send();  
    } 
    //读取热更新路径下的md5dic
    readLocalMd5dic(){ 
        let localstr=jsb.fileUtils.getStringFromFile(this.md5dicfFileName);  
        this.localMd5dic=JSON.parse(localstr); 
    }
    //获取远程的mainfest.json
    downloadMd5dic(){ 
        let zipfilename=`${this.md5dicfFileName}.json`;
        let filename=this.md5dicfFileName;
        let reqRemoteMd5DicCb=function(data)
        {
            if(!data)
            {
                ////console.log("下载md5dic失败")
                this.setState(ASSETDOWNLOAD_STATE.neterr);
                return;
            } 
            //解压
            let new_zip = new JSZip(data); 
            ////console.log("oname=",filename) 
            let jsonstr = new_zip.file(filename).asText(); 
            ////console.log('jsonstr=',jsonstr)
            this.remoteMd5dic=JSON.parse(jsonstr);  
            this.genDiffMd5FileList();//生成差异列表
            if(this.totalfilesize>0)
            {
                this.setState(ASSETDOWNLOAD_STATE.downloading);
                this.processCb(0,this.totalfilesize);
                this.startDownLoad();//下载新的文件 
            }
            else
            {
                this.setState(ASSETDOWNLOAD_STATE.none); 
            }
        }
        let xhr = cc.loader.getXMLHttpRequest();  
        xhr.responseType = "arraybuffer";     
		xhr.onreadystatechange = () => {  
			//cc.log('xhr.readyState='+xhr.readyState+'  xhr.status='+xhr.status);  
			if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {   
                let arraybuffer = xhr.response;   
                this.clearTimer();
                ////console.log("获取到了内容=",zipfilename,arraybuffer)
                reqRemoteMd5DicCb.bind(this)(arraybuffer);
            }   
		};     
		xhr.timeout = 20000; 
        let url=`${this.rootDownLoadUrl}/${zipfilename}` 
		xhr.onerror = (error)=> {
            ////console.log(`httpRequest${url}出错啦`)
            this.clearTimer();
            reqRemoteMd5DicCb.bind(this)(null);
        } 
        xhr.ontimeout = () => {
            ////console.log(`httpRequest${url}超时啦`)
            this.clearTimer();
            reqRemoteMd5DicCb.bind(this)(null);
        }; 
		xhr.open("GET", url,true); 
		xhr.send();           
    }
    //比较md5dic
    genDiffMd5FileList(){
        this.newFileDic={};
        let isNewFile=false;
        this.totalfilesize=0;
        this.downloadprocess=0;
        this.alreadydownloadsize=0;
        for(let filepath in this.remoteMd5dic)
        {
            let remoteitem=this.remoteMd5dic[filepath];
            let localitem=this.localMd5dic[filepath];
            isNewFile=false;
            if(localitem)
            {
                isNewFile=localitem.md5!=remoteitem.md5;
            }
            else
            {
                isNewFile=true;
            }
            if(isNewFile)
            {
                remoteitem.filepath=filepath;
                this.totalfilesize+=remoteitem.size; 
                this.newFileDic[filepath]=remoteitem;
            }
        }  
    } 

    //生成任务
    genTasks(){
        let newTasks=[];
        //从任务字典中提取中 
        for(let filepath in this.newFileDic)
        {
            //新的任务不包括已完成的文件，失败的文件，正在下载中的文件
            if(this.completeDic[filepath]||
                this.failedtasks.contain(filepath)||
                this.runningtasks.contain(filepath))
            {
                continue;
            } 
            //如果当前运行中任务队列大小未达到最大值，就新增任务
            if(this.runningtasks.length<MAX_TASK_COUNT)
            {  
                //记录下下载的起始时间
                this.timedic[filepath]=(new Date()).getTime();
                this.runningtasks.push(filepath);
                //记录当前新增的任务
                newTasks.push(filepath);
            }
        }
        return newTasks;
    }
    //执行任务
    executeTasks(){
        let newTasks=this.genTasks(); 
        //如果有需要下载的任务，就去下载文件
        if(newTasks.length>0)
        {
            for(let i = 0;i<newTasks.length;++i)
            {
                let filepath=newTasks[i]
                let item=this.newFileDic[filepath]; 
                this.downloadNewFile(item); 
            }
        }
        //如果没有正在运行中的任务
        else if(this.runningtasks.length<=0)
        {
            this.clearTimer();
            //如果有失败的任务存在则直接提示失败，让玩家重试
            if(this.failedtasks.length>0)
            {
                this.failedtasks=[];
                this.setState(ASSETDOWNLOAD_STATE.downfailed);
            }
            else
            {  
                //如果没有新任务也没有下载中的任务也没有失败的任务则说明下载完成了
                //说明下载完了  
                //说明下载完了 
                this.updateVersion(); 
                //完成更新，重启他妈的游戏
                this.complete(); 
            }
        } 
    }       
 
    retryVersion(){
        this.reqRemoteVersionInfo();
    }
    retryFiles(){ 
        this.startDownLoad();
    }
    //开始下载
    startDownLoad(){ 
        //记录起始下载时间
        this.startDownLoadTime=(new Date()).getTime();
        //清空定时器
        this.clearTimer();
        //启动定时器
        this.timer=setInterval(this.run.bind(this));  
        //执行任务
        this.executeTasks();
    }    
    complete(){
        this.clearTimer();
        this.setAsBackFromHotupdate();
        cc.audioEngine.stopAll();
        cc.game.restart();
    }
    //更新版本号
    updateVersion(){
        jsb.fileUtils.writeStringToFile(JSON.stringify(this.remoteVersionInfo),`${this._storagePath}/${this.versionFileName}`);
    }
   //清除timer
   clearTimer(){
        if(this.timer!=null){
            clearInterval(this.timer);
            this.timer=null;
        }
    }
  
    //下载单个文件
    downloadNewFile(item)
    {  
        let completeCb=function(filename,data,oname,rootpath)
        {  
            //解压到本地
            if(!item.compressed)//如果原先不是zip包，说明说是统一的解压流程包就解压
            {   
                let new_zip = new JSZip(data); 
                ////console.log("version mgr oname=",oname) 
                let buffer = new_zip.file(oname).asUint8Array(); 
                jsb.fileUtils.writeDataToFile(buffer,`${rootpath}/${oname}`) 
                this.processCb(1024,this.alreadydownloadsize+item.size,this.totalfilesize);  
            }    
            else
            { 
                jsb.fileUtils.writeDataToFile(data,`${rootpath}/${oname}`) 
            }
            
            //判断是否已经下载过了
            let alreadyDownLoad=this.completeDic[item.filepath]; 
            //刷新本地字典 
            this.localMd5dic[item.filepath]=item;  
            jsb.fileUtils.writeStringToFile(JSON.stringify(this.localMd5dic),`${this._storagePath}/${this.md5dicfFileName}`);
    
            //记录到已下载记录中
            this.completeDic[item.filepath]=item; 
            this.removeTask(item.filepath); 
        }

        let filepath=item.filepath;
        let storagefilename=`${this._storagePath}/${filepath}` 
        //创建路径
        let dirarr=filepath.split('/'); 
        let rootPath=this._storagePath;
        let oname=dirarr[dirarr.length-1]
        for(let index=0;index<dirarr.length-1;++index)
        {
            let subdir=dirarr[index];
            rootPath=`${rootPath}/${subdir}`; 
            jsb.fileUtils.createDirectory(rootPath); 
        } 
        //创建下载器
        let filename=item.filepath;
        //添加.json后缀,因为.zip文件受到服务器下载
        if(!item.compressed)
        {
            filename=`${filename}.json`
            storagefilename=`${storagefilename}.json`
        }

        //url地址 
        let url=`${this.rootDownLoadUrl}/${filename}`  

        ////////////////////////////////////////////
        let xhr = cc.loader.getXMLHttpRequest(); 
        xhr.responseType = "arraybuffer";   
        xhr.onreadystatechange =   ()=> {     
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {  
                let arraybuffer = xhr.response;    
                completeCb.bind(this)(filename,arraybuffer,oname,rootPath);
            }   
        };    
  
        xhr.timeout = 10000; 
        xhr.onerror = (error)=> { 
            this.failedtasks.push(item.filepath);
            //移除这个任务
            this.removeTask(item.filepath);
        } 
        xhr.ontimeout = () => {
            
            this.failedtasks.push(item.filepath);
            //移除这个任务
            this.removeTask(item.filepath);
        };  
         
        xhr.open("GET", url,true); 
        xhr.send(); 
        //////////////////////////////////////////////// 


        this.downloaderDic[item.filepath]=xhr; 
        

    } 
    
}
