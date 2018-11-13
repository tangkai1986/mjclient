import ServerMgr from "../../AppStart/AppMgrs/ServerMgr";
import GameCateCfg from "../CfgMgrs/GameCateCfg"; 
import VersionMgr from "../../AppStart/AppMgrs/VersionMgr";
import SubGameDownLoader from "./SubGameDownLoader";
 
export default class SubGameMgr{ 
    //单例处理 
 
    private static _instance:SubGameMgr;
    public static getInstance ():SubGameMgr{
        if(!this._instance){
            this._instance = new SubGameMgr();
        }
        return this._instance;
    }
    private downloaders={};//管理下载的对象
    private remoteGamesPackInfo=null;//远程版本信息 
    remoteSubMd5dic={};//远程md5列表
    localSubMd5Dic={};//本地md5列表
    localGamesPackInfo=null;//本地版本信息
    private getGamesPackInfoCb=null;//检测版本的回调
    _storagePath=null;//热更新地址 
    gamespackFileName='gamespack.json';//版本文件
    submd5dicfFileName='submd5dic.json';//md5文件列表 
    subgamesdir='subgames';//子游戏版本目录
    rootDownLoadUrl='';//下载跟路径     
    private processCb=null;  
    subgameStateDic={};//版本改变的字典
    private downLoadSubGameCb=null;//下载子游戏  
    completeDic={};//已加载的内容
    downloadQue=[];
    //构造函数 
    constructor(){ 
    }   
    //获取下载器
    getDownLoaders(){
        return this.downloaders;
    }
    //任务正在运行
    taskIsRunning(){
        for(let gamecode in this.downloaders)
        {
            let downloader=this.downloaders[gamecode];
            if(downloader.getState()==SUBGAMEDOWNLOAD_STATE.downloading)
            {
                return true;
            }
        }
        return false;
    }
    //加入到下载队列
    putInQue(gamecode)
    {
        this.downloadQue.push(gamecode);
    }
    //初始化目录
    initDirs(){ 
        this._storagePath=VersionMgr.getInstance().getStoragePath(); 
        this.rootDownLoadUrl=ServerMgr.getInstance().getHotupdateVersionUrl();  
        //检测本地的子游戏版本文件
        this.readLoaclGamesPackInfo(); 
    }
    //更新游戏id
    updateGameId(gamecode){
        if(this.subgameStateDic[gamecode]==0)
        {
            return;
        }
        if(!this.downloaders[gamecode])
        {
            this.downloaders[gamecode]=new SubGameDownLoader(gamecode,this);
        }
    }
    //检测热更新目录下的文件是否比当前安装包版本低
    readLoaclGamesPackInfo(){
        //读取本地版本号 
        //完整版本号
        let localstr=jsb.fileUtils.getStringFromFile(this.gamespackFileName); 
        let versioninfoexist=localstr&&localstr.length>0; 
        //判断版本信息是否存在 
        if(versioninfoexist)
        {
            //本地版本信息 
            this.localGamesPackInfo=JSON.parse(localstr); 
        } 
    }
    //游戏是否已经更新完毕
    gameIsUpdated(gamecode){
        //如果不走热更新机制,则直接返回已下载
        if(!ServerMgr.getInstance().isEnableHotUpdate()){
            return true;
        } 
        return this.subgameStateDic[gamecode]==0;//0表示已安装或不存在更新
    }
    //获得子游戏下载状态
    getSubGameState(gamecode){ 
        if(ServerMgr.getInstance().isEnableHotUpdate())
        {
            return  this.subgameStateDic[gamecode];  
        }
        return 0;
    }
    //设置状态
    setState(gamecode,state)
    {     
        if(this.downLoadSubGameCb)
        {
            this.downLoadSubGameCb(gamecode,state);
        }
    }
    //获取远程版本
    getRemoteGamesPackInfo(getGamesPackInfoCb)
    {      
        this.initDirs();
        this.getGamesPackInfoCb=getGamesPackInfoCb;
        //如果存在版本信息就去热更新
        if(this.localGamesPackInfo){
            //开始下载远程版本信息
            this.reqRemoteGamesPackInfo();
        }
        else
        {
            this.getGamesPackInfoCb(0);
        }
    } 
    //完成游戏下载
    completeGameDownLoad(gamecode)
    { 
        delete this.downloaders[gamecode];
        this.updateGamePackInfo(gamecode);
        this.resetNewFileList();
        //查看下载队列是否还有资源需要下载,如果没有资源需要下载就直接返回,
        //如果有资源下载就去取队列第一个下载任务,开始下载并且从下载队列中移除掉这个任务
        if(this.downloadQue.length<=0)
        {
            return;
        }
        //要下载的游戏的code
        let nextGameCode=this.downloadQue[0];
        //取得下载器  
        let downloader=this.downloaders[nextGameCode];
        //开始下载
        downloader.startDownLoad();
        //移除任务
        this.downloadQue.remove(0); 
    }
    //重置新的文件列表
    resetNewFileList()
    {
        //遍历所有下载队列，移除掉这些游戏中下载文件列表中已经被其他子游戏下载任务
        //中完成的下载文件并刷新列表
        for(let gamecode in this.downloaders)
        {
            this.downloaders[gamecode].resetNewFileList();
        }
    }
    //获取远程的版本信息
    reqRemoteGamesPackInfo(){  
        let reqGamesPackInfoCb=function(str)
        {
            if(!str)
            { 
                this.getGamesPackInfoCb(-1);
                return;
            } 
            this.remoteGamesPackInfo=JSON.parse(str);  
            //和本地进行对比 
            for(let gamecode in this.remoteGamesPackInfo)
            { 
                if(!this.localGamesPackInfo[gamecode])
                {
                    //表示未预装
                    this.subgameStateDic[gamecode]=2;
                }
                else
                {
                    //表示无需更新
                    if(this.remoteGamesPackInfo[gamecode]==this.localGamesPackInfo[gamecode])
                    { 
                        this.subgameStateDic[gamecode]=0; 
                    }
                    else
                    {
                        this.subgameStateDic[gamecode]=1;//表示有版本更新
                    }
                }
            }
            //读取本地所有md5dic
            for(let gamecode in this.remoteGamesPackInfo)
            {  
                let localstr=jsb.fileUtils.getStringFromFile(`${this.subgamesdir}/${gamecode}/${this.submd5dicfFileName}`); 
                if(localstr&&localstr.length>0)
                {
                    this.localSubMd5Dic[gamecode]=JSON.parse(localstr);  
                } 
                else
                {
                    this.localSubMd5Dic[gamecode]={};
                }
                if(this.subgameStateDic[gamecode]==0)
                {
                    //就表示没有更新的，就把已经存在的资源加入到已下载的列表中
                    let submd5dic=this.localSubMd5Dic[gamecode];
                    for(let filepath in submd5dic)
                    {
                        this.completeDic[filepath]=submd5dic[filepath];
                    }
                }
            }            
            this.getGamesPackInfoCb(0);
        }

        let xhr = cc.loader.getXMLHttpRequest();    
		xhr.onreadystatechange = () => {  
			cc.log('xhr.readyState='+xhr.readyState+'  xhr.status='+xhr.status);  
			if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {  
                let respone = xhr.responseText;  
                let data = JSON.parse(respone) 
                //console.log("获取到了内容=",this.gamespackFileName,respone)
                reqGamesPackInfoCb.bind(this)(respone);
            }   
		};     
		xhr.timeout = 5000; 
        let url=`${this.rootDownLoadUrl}/${this.gamespackFileName}` 
		xhr.onerror = (error)=> {
            //console.log(`httpRequest${url}出错啦`) 
            reqGamesPackInfoCb.bind(this)(null);
        } 
        xhr.ontimeout = () => {
            //console.log(`httpRequest${url}超时啦`) 
            reqGamesPackInfoCb.bind(this)(null);
        }; 
		xhr.open("GET", url,true); 
		xhr.send();  
    }     
 
    retryFiles(){ 
        
    } 
    //更新版本号
    updateGamePackInfo(gamecode){
        this.subgameStateDic[gamecode]=0;
        this.localGamesPackInfo[gamecode]=this.remoteGamesPackInfo[gamecode];//将远程的子游戏md5版本更新到本地
        jsb.fileUtils.writeStringToFile(JSON.stringify(this.localGamesPackInfo),`${this._storagePath}/${this.gamespackFileName}`);
    } 
    updateProcess(gamecode,speed,alreadydownloadsize,totalfilesize) 
    {
        if(this.processCb)
        {
            this.processCb(gamecode,speed,alreadydownloadsize,totalfilesize);
        } 
    }
    registerCb(downLoadSubGameCb,processCb)
    {
        this.downLoadSubGameCb=downLoadSubGameCb; 
        this.processCb=processCb;  
    }  
    unRegisterCb()
    {
        this.downLoadSubGameCb=null; 
        this.processCb=null;  
    }  
}
