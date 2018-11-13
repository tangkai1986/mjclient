export default class MahjongLoder
{
	private static _instance = null;  
	private prefabMap={};  
	private nodeMap={}
	constructor()
	{ 
	}  
	loadRes(cb){
		//麻将预制体 
		let handcard_0='HandMaJiang3D_0';
		let handcard_1='HandMaJiang3D_1';
		let handcard_2='HandMaJiang3D_2';
		let handcard_3='HandMaJiang3D_3'; 
		let handcard13_0='HandMaJiang3D_13_0';
		let handcard13_1='HandMaJiang3D_13_1';
		let handcard13_2='HandMaJiang3D_13_2';
		let handcard13_3='HandMaJiang3D_13_3'; 
 
		let prefamahjongbarr=['MahjongRoom','MahjongClock3D','MahjongDice','GroupMaJiang3D_0','GroupMaJiang3D_1','GroupMaJiang3D_2','GroupMaJiang3D_3',
		handcard_3,handcard_2,handcard_1,handcard13_0,handcard13_1,handcard13_2,handcard13_3,
		'PoolMaJiang3D_2','PoolMaJiang3D_1','PoolMaJiang3D_3','PoolMaJiang3D_0',
		'Hua_0','Hua_1','Hua_2','Hua_3','MahjongRoomRule','VideoPlay',
		'MahjongMyStateTip','Mahjong_jin',handcard_0,'MahjongEvent','op_anim0','op_anim1','op_anim2','op_anim3',
		'Node_effects','MahjongOtherStateTip_1','MahjongOtherStateTip_2','MahjongOtherStateTip_3']		
		let index=0;
		for(let i=0;i<prefamahjongbarr.length;++i)
		{   
			let prefabName=prefamahjongbarr[i] 
			let fullpath=`Mahjong/Prefabs/${prefabName}`
			cc.loader.loadRes(fullpath, (err, prefab:cc.Prefab)=> {  
				this.prefabMap[prefabName]=prefab;  
				this.nodeMap[prefabName]=cc.instantiate(prefab); 
				index++;
				if(index>=prefamahjongbarr.length)
				{
					this.loadTexture(cb)
				}
			});
		}  
	}	
	loadTexture(cb)
	{ 
		cc.loader.loadResDir(`Mahjong/Textures`, (err, assets)=> {
			cb();
		});
	}  
	getPrefab(name)
	{
		let prefab=this.prefabMap[name];  
		return prefab
	}  
	getNode(name)
	{
		let node =this.nodeMap[name]
		this.nodeMap[name]=null
		return node;
	}
    public static getInstance() : MahjongLoder{
        if (MahjongLoder._instance == null){
            MahjongLoder._instance = new MahjongLoder();
        }
        return MahjongLoder._instance;
	} 	
} 
