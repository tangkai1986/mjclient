// 麻将中视图位置逻辑位置转换
export default class viewLogicSeatConvertMgr
{  
    myseatid=null;
    viewSeatCount=4;
    viewlogicMap={};
    logicViewMap={};
    constructor (){
  
    }
    clear(){
        delete viewLogicSeatConvertMgr._instance;
        viewLogicSeatConvertMgr._instance=null; 
    }
    updateSeatCount(viewSeatCount)
    { 
        this.viewSeatCount=viewSeatCount;
    }
    setMySeatId(seatId,seatcount)
    {
        this.myseatid=seatId; 
         
        let viewseatarr=[];  
        if(seatcount<=this.viewSeatCount/4)
        {
            for(let index=0;index<this.viewSeatCount;++index)
            { 
                if(index%4==0)
                {
                    viewseatarr.push(index); 
                } 
            }
        }
        else if(seatcount<=this.viewSeatCount/2)
        {
            for(let index=0;index<this.viewSeatCount;++index)
            { 
                if(index%2==0)
                {
                    viewseatarr.push(index); 
                } 
            }
        } 
        else{
            for(let index=0;index<this.viewSeatCount;++index)
            {  
                viewseatarr.push(index);  
            }
        }
        for(let viewSeatId=0;viewSeatId<this.viewSeatCount;++viewSeatId)
        {
            //逢空位进1 
            let offset=null;
            for(let i = 0;i<viewseatarr.length;++i)
            {
                if(viewseatarr[i]==viewSeatId)
                {
                    offset=i; 
                }
            }  
            if(offset==null)
                continue;
            let logicSeatId=(offset+this.myseatid)%viewseatarr.length; 
            if(logicSeatId>=seatcount)
            {
                continue;
            }
            this.viewlogicMap[logicSeatId]=viewSeatId;
            this.logicViewMap[viewSeatId]=logicSeatId;
        }
    }
    getViewSeatCount(){
        return this.viewSeatCount;
    }
    getViewSeatId(logicSeatId)
    {
        // body  
        //console.log("获取视图座位=",this.viewlogicMap,logicSeatId)
        return this.viewlogicMap[logicSeatId]
    }
    getLogicSeatId(viewSeatId)
    {     
        return this.logicViewMap[viewSeatId]
    }
    //单例处理
    private static _instance:viewLogicSeatConvertMgr;
    public static getInstance ():viewLogicSeatConvertMgr{
        if(!this._instance){
            this._instance = new viewLogicSeatConvertMgr();
        }
        return this._instance;
    }
}