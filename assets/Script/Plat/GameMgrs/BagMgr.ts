import BaseMgr from "../Libs/BaseMgr";
 
export default class BagMgr extends BaseMgr{
    routes:{} = null; 
    itemID:any=null;
    itemType:any=null;
    constructor (){
        super(); 
        this.routes={
            
        }

    }
    setItemPrice(index){
        this.itemID = index;
    }
    setItemType(type){
        this.itemType = type;
    }
    getItemPrice(){
        return this.itemID;
    }
    getItemType(){
        return this.itemType;
    }

    //单例处理
    private static _instance:BagMgr;
    public static getInstance ():BagMgr{
        if(!this._instance){
            this._instance = new BagMgr();
        }
        return this._instance;
    }
}