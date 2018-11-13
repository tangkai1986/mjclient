import { MahjongGeneral } from "./MahjongGeneral";

  

//Process操作音频文件 
let cardpngs={
    //万
    17:'1',
    18:'2',
    19:'3',
    20:'4',
    21:'5',
    22:'6',
    23:'7',
    24:'8',
    25:'9',
    
    //条
    33:'21',
    34:'22',
    35:'23',
    36:'24',
    37:'25',
    38:'26',
    39:'27',
    40:'28',
    41:'29', 

    //筒
    49:'11',
    50:'12',
    51:'13',
    52:'14',
    53:'15',
    54:'16',
    55:'17',
    56:'18',
    57:'19', 



    //其他
    65:'31',  
    67:'32',  
    69:'33',  
    71:'34',    
    73:'35',   
    75:'36',  
    77:'37',

    81:'38',  
    83:'39',  
    85:'41', 
    87:'42',


    89:'43', 
    91:'44', 
    93:'45', 
    95:'46',  	 
}
 
let huanames={
    65:'东',  
    67:'南',  
    69:'西',  
    71:'北',    
    73:'中',   
    75:'发',  
    77:'白',

    81:'梅',  
    83:'兰',  
    85:'竹', 
    87:'菊',


    89:'春', 
    91:'夏', 
    93:'秋', 
    95:'东',  	
}
let huaIcons={
    89:0,
    91:1,
    93:2,
    95:3,
    81:4,  
    83:5,  
    85:6, 
    87:7,
    65:8,  
    67:9,  
    69:10,  
    71:11,    
    73:12,   
    75:13,  
    77:14,
} 
export default class MahjongResMgr{
    static cardpngs=cardpngs;
    static huanames=huanames; 
    static huaIcons=huaIcons;  
    jin=null;   
    jin2=null;  
   
    private static _instance:MahjongResMgr;

    private tableAtlas:cc.SpriteAtlas =null;
    constructor()
    {
        this.jin=null;  
    }  
   
    clear()
    {
   
    } 
    public static getInstance ():MahjongResMgr{
        if(!this._instance){
            this._instance = new MahjongResMgr();
        }
        return this._instance;
    } 
 
    setJin(jin,jin2)
    {

        ////console.log("两个金11=",jin,jin2)
        this.jin=jin;
        this.jin2=jin2;
        ////console.log("两个金=",this.jin,this.jin2)
    } 
    getHuaIconTexture(value)
    {
        let index = MahjongResMgr.huaIcons[value];
        let frame = this.tableAtlas.getSpriteFrame(`BuhuaStatus_${index}`);
        return frame;
    }
    setTableAtlas(tableAtlas)
    {
        this.tableAtlas=tableAtlas;
    }
    // 通过路径加载png卡牌
    // getCardTextureByValue(value)
    // {
    //     if (value== MahjongGeneral.emMJ.emMJ_Joker )
    //     {
    //         value=this.jin;
    //     }
    //     else if(value== MahjongGeneral.emMJ.emMJ_Joker2 )
    //     { 
    //         value=this.jin2;
    //     }
    //     ////console.log("value=",this.jin,this.jin2,value)
    //     let cardName= MahjongResMgr.cardpngs[value]; 
    //     let texture = cc.loader.getRes(cc.url.raw(`GameCommon/Mahjong/Textures/MaJiang3d/${cardName}.png`))
    //     return new cc.SpriteFrame(texture);
    // } 
    //通过精灵帧加载plist卡牌
    getCardSpriteFrame(value)
    {
        if (value== MahjongGeneral.emMJ.emMJ_Joker )
        {
            value=this.jin;
        }
        else if(value== MahjongGeneral.emMJ.emMJ_Joker2 )
        { 
            value=this.jin2;
        }
        ////console.log("value=",this.jin,this.jin2,value)
        let cardName= MahjongResMgr.cardpngs[value];
        let frame = this.tableAtlas.getSpriteFrame(cardName);
        return frame;
    } 
    getSpriteFrame(plistKey)
    {
        let frame = this.tableAtlas.getSpriteFrame(plistKey);
        return frame;
    } 
  
}

