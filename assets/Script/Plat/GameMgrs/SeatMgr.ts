 
 
export default class SeatMgr
{  
    myseatid=null;
    roominfo=null;
    viewSeatCount=null;
    viewlogicMap={};
    logicViewMap={};
    constructor (){
  
    }
    setRoomInfo(roominfo){ 
        this.roominfo=roominfo;
        switch(roominfo.gamecate)
        {
            case 1://表示麻将
                this.viewSeatCount=4
            break;
            case 2://表示扑克
                this.viewSeatCount=roominfo.seatcount;
            break;
        }
    }
    clear(){
        
        delete SeatMgr._instance;
        SeatMgr._instance=null; 
    }
    updateSeatCount(viewSeatCount)
    { 
        this.viewSeatCount=viewSeatCount;
    }
    setMySeatId(seatId)
    {
        //console.log("seatmgr设置了自己的额位置=",seatId,this.viewSeatCount)
        this.myseatid=seatId; 
         
        let viewseatarr=[];  
        if(this.roominfo.seatcount<=this.viewSeatCount/4)
        {
            for(let index=0;index<this.viewSeatCount;++index)
            { 
                if(index%4==0)
                {
                    viewseatarr.push(index); 
                } 
            }
        }
        else if(this.roominfo.seatcount<=this.viewSeatCount/2)
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
            if(logicSeatId>=this.roominfo.seatcount)
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
        return this.viewlogicMap[logicSeatId]
    }
    getLogicSeatId(viewSeatId)
    {      
        return this.logicViewMap[viewSeatId]
    }
    //单例处理
    private static _instance:SeatMgr;
    public static getInstance ():SeatMgr{
        if(!this._instance){
            this._instance = new SeatMgr();
        }
        return this._instance;
    }
}