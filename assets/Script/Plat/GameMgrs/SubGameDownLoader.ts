import ServerMgr from "../../AppStart/AppMgrs/ServerMgr";
import GameCateCfg from "../CfgMgrs/GameCateCfg"; 
import VersionMgr from "../../AppStart/AppMgrs/VersionMgr"; 
 
//子游戏管理
enum SUBGAMEDOWNLOAD_STATE{
    none=0, 
    que,//在排队中
    ready,//就绪 
    downloading,//下载中
    complete,//完成
    downfailed,//下载失败   
}
window['SUBGAMEDOWNLOAD_STATE']=SUBGAMEDOWNLOAD_STATE  

//子游戏管理
enum SUBGAMEPROCESS_STATE{
    none=0, 
    sizeCaled,
    loading, 
}
window['SUBGAMEPROCESS_STATE']=SUBGAMEPROCESS_STATE  
let MAX_TASK_COUNT=20;
export default class SubGameDownLoader{   
    private remoteSubMd5dic=null;//远程md5列表
    private localSubMd5Dic=null;//本地md5列表 
    private _storagePath=null;//热更新地址  
    private submd5dicfFileName=null;//md5文件列表 
    private subgamesdir=null;//子游戏版本目录
    private rootDownLoadUrl='';//下载跟路径
    private newFileDic={};//需要下载的文件字典
    private alreadydownloadsize=0;//已下载完成的所有文件大小
    private totalfilesize=0;//总共需要下载的文件大小 
    private state:SUBGAMEDOWNLOAD_STATE=SUBGAMEDOWNLOAD_STATE.none;//下载状态  
    private completeDic=null;//已经完成的文件字典
    private downloaderDic={};//下载器字典 
    private gamecode=null;//当前正在下载的gamecode; 
    private process_state:SUBGAMEPROCESS_STATE=SUBGAMEPROCESS_STATE.none;//下载或更新流程的状态
    private subgamemgr=null;//子游戏管理器
    private subgameStateDic=null;//子游戏状态字典(0表示没改变1表示有更新，2表示需要下载)
    private speed=null;//下载速度
    private failedtasks=[];//失败的队列
    private runningtasks=[];//运行中的队列
    private timedic={};//时间字典
    private timer=null;//定时器 
    private startDownLoadTime=0;
    //构造函数 
    constructor(gamecode,subgamemgr){
        this.subgamemgr=subgamemgr;
        this.remoteSubMd5dic=this.subgamemgr.remoteSubMd5dic;
        this.completeDic=this.subgamemgr.completeDic;
        this.subgameStateDic=this.subgamemgr.subgameStateDic;
        this.localSubMd5Dic=this.subgamemgr.localSubMd5Dic;
        this.submd5dicfFileName=this.subgamemgr.submd5dicfFileName;
        this.subgamesdir=this.subgamemgr.subgamesdir;
        this._storagePath=this.subgamemgr._storagePath;
        this.rootDownLoadUrl=this.subgamemgr.rootDownLoadUrl;
        this.gamecode=gamecode;
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
    //获取下载状态
    getState(){
        return this.state;
    }
    //获取下载速度
    getSpeed(){
        return this.speed;
    }
    //获取进程状态
    getProcessState(){
        return this.process_state;
    }
    //设置装填
    setState(state)
    {    
        this.state=state;
        this.subgamemgr.setState(this.gamecode,state);
    } 
    //清除某个下载器
    removeTask(filepath){ 
        this.runningtasks.removeByValue(filepath); 
        delete this.downloaderDic[filepath]; 
        //移除后就要刷新任务
        this.refreshTasks(); 
    } 
    retry()
    {
        this.subgamemgr.resetNewFileList();
        this.startDownLoad();
    }
    //获取远程的子游戏md5dic
    downloadSubMd5dic(){ 
        let zipfilename=`${this.submd5dicfFileName}.json`;
        let filename=this.submd5dicfFileName;
        let reqRemoteMd5DicCb=function(data)
        {  
            //解压
            let new_zip = new JSZip(data);  
            let jsonstr = new_zip.file(filename).asText();  
            this.remoteSubMd5dic[this.gamecode]=JSON.parse(jsonstr);  
            this.genDiffMd5FileList();//生成差异列表
            if(this.totalfilesize>0)
            {
                //检测到有新增文件,则提示用户去下载
                this.setState(SUBGAMEDOWNLOAD_STATE.ready); 
            }
            else
            { 
                this.subgamemgr.completeGameDownLoad(this.gamecode);
                this.setState(SUBGAMEDOWNLOAD_STATE.none); 
            }
        }
        let xhr = cc.loader.getXMLHttpRequest();  
        xhr.responseType = "arraybuffer";     
		xhr.onreadystatechange = () => {   
			if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {   
                let arraybuffer = xhr.response;  
                reqRemoteMd5DicCb.bind(this)(arraybuffer);
            }   
		};     
		xhr.timeout = 20000; 
        let url=`${this.rootDownLoadUrl}/${this.subgamesdir}/${this.gamecode}/${zipfilename}` 
        
		xhr.onerror = (error)=> { 
            this.setState(SUBGAMEDOWNLOAD_STATE.downfailed);
        } 
        xhr.ontimeout = () => { 
            this.setState(SUBGAMEDOWNLOAD_STATE.downfailed);
        }; 
		xhr.open("GET", url,true); 
		xhr.send();           
    }
    //已下载文件大小
    getAlreadLoadSize(){
        return this.alreadydownloadsize;
    }

    //比较md5dic，还要过滤掉子游戏已下载的公共资源
    resetNewFileList(){ 
        this.newFileDic={};
        let isNewFile=false;
        this.totalfilesize=0; 
        this.alreadydownloadsize=0; 
        //读取本地所有md5dic
        for(let filepath in this.remoteSubMd5dic[this.gamecode])
        {
            if(this.completeDic[filepath])
            {
                continue;//过滤已下载过的资源
            }
            let remoteitem=this.remoteSubMd5dic[this.gamecode][filepath];
            let localitem=null;
            if(this.localSubMd5Dic[this.gamecode])
            {
                localitem=this.localSubMd5Dic[this.gamecode][filepath];
            } 
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
        //表示都下载完了
        if(this.totalfilesize<=0)
        {
            //console.log("xxxxxxxxxxxxxxxxxxxx下载个数小于零")
        }
    }    

    //比较md5dic，还要过滤掉子游戏已下载的公共资源
    genDiffMd5FileList(){
        //检测新增文件
        this.newFileDic={};
        let isNewFile=false;
        //新增文件大小
        this.totalfilesize=0;
        //重置已下载文件大小 
        this.alreadydownloadsize=0; 
        //读取本地所有md5dic
        for(let gamecode in this.remoteSubMd5dic)
        {
            //判断子游戏状态,0表示无需更新，1表示需要下载子游戏2表示子游戏有更新
            if(this.subgameStateDic[gamecode]!=0)
            {
                continue;
            }
            //只有版本是最新的版本才可以当做已下载的资源对比
            let dic=this.remoteSubMd5dic[gamecode];
            for(let filepath in dic)
            {
                this.completeDic[filepath]=dic[filepath];//表示更新完成的
            }         
        }
        for(let filepath in this.remoteSubMd5dic[this.gamecode])
        {
            if(this.completeDic[filepath])
            { 
                continue;//过滤已下载过的资源
            }
            let remoteitem=this.remoteSubMd5dic[this.gamecode][filepath];
            let localitem=null;
            if(this.localSubMd5Dic[this.gamecode])
            {
                localitem=this.localSubMd5Dic[this.gamecode][filepath];
            } 
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
        this.process_state=SUBGAMEPROCESS_STATE.sizeCaled;
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
                this.setState(SUBGAMEDOWNLOAD_STATE.downfailed);
            }
            else
            {  
                //如果没有新任务也没有下载中的任务也没有失败的任务则说明下载完成了
                //说明下载完了  
                let elapseTime=((new Date()).getTime()-this.startDownLoadTime)/1000; 
                this.subgamemgr.completeGameDownLoad(this.gamecode);
                //并且设置为下载完成状态 
                this.setState(SUBGAMEDOWNLOAD_STATE.complete);
            }
        } 
    }   
    //清除timer
    clearTimer(){
        if(this.timer!=null){
			clearInterval(this.timer);
			this.timer=null;
		}
    }
    //获取总大小
    getTotalSize(){
        return this.totalfilesize;
    } 
    //下载单个文件
    downloadNewFile(item)
    {  
        //console.log("下载新的downloadNewFile")
        //下载回调
        let completeCb=function(filename,data,oname,rootpath)
        { 
            //解压到本地
            if(!item.compressed)//如果原先不是zip包，说明说是统一的解压流程包就解压
            {   
                let new_zip = new JSZip(data); 
                //console.log("oname=",oname) 
                let buffer = new_zip.file(oname).asUint8Array(); 
                jsb.fileUtils.writeDataToFile(buffer,`${rootpath}/${oname}`) 
                this.speed=1024; 
                this.subgamemgr.updateProcess(this.gamecode,this.speed,this.alreadydownloadsize+item.size,this.totalfilesize);  
            }    
            else
            { 
                jsb.fileUtils.writeDataToFile(data,`${rootpath}/${oname}`) 
            }
            //刷新本地字典 
            this.localSubMd5Dic[this.gamecode][item.filepath]=item;  
            //写入到本地文件中
            jsb.fileUtils.writeStringToFile(JSON.stringify(this.localSubMd5Dic[this.gamecode]),`${this._storagePath}/${this.subgamesdir}/${this.gamecode}/${this.submd5dicfFileName}`);
            //记录到已下载记录中 
            this.completeDic[item.filepath]=item; 
            //移除这个任务
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

        /////////////////////////////////////尝试http方案////////////////////////////////////

         
        let xhr = cc.loader.getXMLHttpRequest(); 
        xhr.responseType = "arraybuffer";   
        xhr.onreadystatechange =   ()=> {     
            //console.log("xhr.readyState=",xhr.readyState,xhr.status)
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {  
                let arraybuffer = xhr.response;    
                completeCb.bind(this)(filename,arraybuffer,oname,rootPath);
            }   
        };    
        //xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");   
        // note: In Internet Explorer, the timeout property may be set only after calling the open()  
        // method and before calling the send() method.  
        xhr.timeout = 20000; 
        xhr.onerror = (error)=> { 
            //console.log("onerror发生了错误了")
            this.failedtasks.push(item.filepath);
            //移除这个任务
            this.removeTask(item.filepath);
        } 
        xhr.ontimeout = () => { 
            //console.log("ontimeout超时了")
            this.failedtasks.push(item.filepath);
            //移除这个任务
            this.removeTask(item.filepath);
        };  
         
        xhr.open("GET", url,true); 
        xhr.send(); 

        this.downloaderDic[item.filepath]=xhr; 
        ///////////////////////////////////////////////////////////////////////////////////
    }  
    //开始下载
    startDownLoad(){
        //任务正在执行
        if(this.subgamemgr.taskIsRunning())
        {
            this.setState(SUBGAMEDOWNLOAD_STATE.que);
            this.subgamemgr.putInQue(this.gamecode);
            return;
        }
        //记录起始下载时间
        this.startDownLoadTime=(new Date()).getTime();
        //清空定时器
        this.clearTimer();
        //启动定时器
        this.timer=setInterval(this.run.bind(this));
        this.process_state=SUBGAMEPROCESS_STATE.loading;
        //创建子游戏submd5dic目录
        let submd5dir=`${this.subgamesdir}/${this.gamecode}`;
        //创建路径
        let dirarr=submd5dir.split('/'); 
        let rootPath=this._storagePath;
        let oname=dirarr[dirarr.length-1]
        for(let index=0;index<dirarr.length;++index)
        {
            let subdir=dirarr[index];
            rootPath=`${rootPath}/${subdir}`; 
            jsb.fileUtils.createDirectory(rootPath); 
        }            
        //设置状态为正在下载
        this.setState(SUBGAMEDOWNLOAD_STATE.downloading);
        //执行任务
        this.executeTasks();
    }
}
