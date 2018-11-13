import BaseCfg from "../Libs/BaseCfg";

export default class GoodsCfg extends BaseCfg{
  
    //单例处理
	private goodsPath=null; 
	private shopItemData = null;
	private gold = new Array();
	private exchange = new Array();
	private money = new Array();
	private calls =new Array();
	constructor(){
		super();
		this.goodsPath=this.getFullPath('goods');
	}
	
    private static _instance:GoodsCfg; 
    public static getInstance ():GoodsCfg{
        if(!this._instance){
            this._instance = new GoodsCfg();
        }
        return this._instance;
	} 
	loadCb(name,data){   
		this.loaded=true;
		this.shopItemData = data;
		this.setShop(this.shopItemData);
	}
	load()
	{ 
     	//先去判断有几个游戏要加载 
		this.loadRes(this.goodsPath,this.loadCb);
	}
	getCoinCfg()
	{
		 
	}
	getFangKaCfg()
	{
		 
	}
	getGoldCfg()
	{
		 return this.gold;
	}
	setShop(data){
		for(let i=0; i<data.length;i++){
			let cate = data[i].cate;
			let soldable = data[i].soldable;
			if(cate ==1 && soldable == 1){
				this.gold.push(data[i]);
			}else if(cate ==2 && soldable == 1){
				this.exchange.push(data[i]);
			}else if(cate == 3 && soldable == 1){
				this.money.push(data[i]);
			}else if(cate == 4 && soldable == 1){
				this.calls.push(data[i]);
			}
		}
	}
}

