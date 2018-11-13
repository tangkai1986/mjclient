//
const maxOpLength=100; 
export default class LogMgr{ 
    //单例处理
    private static _instance:LogMgr;
    
    pushLog(str)
    {
        let arr=window['__errorOp'];
        arr.push(str)
        if(arr.length>maxOpLength)
        {
            arr.remove(0);//移除第一个内容
        }
    }
    //加入操作记录
    addOpreation(op)
    {
        this.pushLog(op)
    }
    showModule(sceneName)
    {
        this.pushLog(`跳转${sceneName}`)
    }
    addRecevie(route)
    {
        this.pushLog(`收到${route}`)
    }
    showSubModule(prefabName)
    {
        this.pushLog(`弹出${prefabName}`)
    }
    public static getInstance ():LogMgr{
        if(!this._instance){
            this._instance = new LogMgr();
        }
        return this._instance;
    }
}