import LogMgr from "./LogMgr";
import FrameMgr from "./FrameMgr";
import NetMgr from "../NetCenter/NetMgr";

//控制器基类 
let G_MODULE=
{
    Login:'Login',  
	LoadingPlat:'LoadingPlat',  
	Plaza:'Plaza',
	CustomService:'SubLayer/Plat/customservice/Prefab_customservice',
	Web_xieyi:'SubLayer/Plat/useragreement/Web_xieyi',
    UserLogin:'SubLayer/Plat/UserLogin/Prefab_UserLogin',
    UserRegister:'SubLayer/Plat/UserLogin/Prefab_UserRegister',
	MsgBox:'SubLayer/Plat/MsgBox/MsgBox', 
	HintBox:'SubLayer/Plat/MsgBox/Hints',
	LoadingGame:'SubLayer/Plat/LoadingGame/LoadingGame',
	PlazaSetting:'SubLayer/Plat/PlazaSetting/Prefab_settingCtrl',
    LuckDraw:'SubLayer/Plat/LuckDraw/Prefab_luckDraw',
    LuckDrawTipPanel:'SubLayer/Plat/LuckDraw/Prefab_luckDrawTipCtrl',
	AgencyBind:'SubLayer/Plat/PlazaSetting/Prefab_AgencyBind',
	AccountBind:'SubLayer/Plat/PlazaSetting/Prefab_AccountBind', 
	Mail:'SubLayer/Plat/Mail/Prefab_Mail', 
	Shared:'SubLayer/Plat/Shared/Prefab_sharedCtrl',
	ShareTip:'SubLayer/Plat/Shared/Prefab_shareTip',
	Shop:'SubLayer/Plat/Shop/Prefab_shopCtrl',
	RechargeRecord :'SubLayer/Plat/Shop/Prefab_rechargeRecord',
	Bag:'SubLayer/Plat/Shop/Prefab_bagCtrl',
	ShopDetail:'SubLayer/Plat/Shop/Prefab_shopDetailCtrl',
	Payment:'SubLayer/Plat/Payment/Prefab_payment',
    joinRoom:'SubLayer/Plat/CreateRoom/Prefab_JoinRoom',
    createRoom:'SubLayer/Plat/CreateRoom/Prefab_CreateRoomPanel', 
    PlayerDetail:'SubLayer/Plat/PlayerDetail/Prefab_playerDetailCtrl',
    ReliefMoney:'SubLayer/Plat/MsgBox/Prefab_reliefMoneyCtrl',
    HarvestFrame:'SubLayer/Plat/MsgBox/Prefab_harvestCtrl',
    SignIn:'SubLayer/Plat/SignIn/Prefab_SignIn',
	GoldMode:'SubLayer/Plat/GoldMode/Prefab_GoldModeCtrl',  
	shimingRenZheng:'SubLayer/Plat/PlayerDetail/Prefab_shimingRenZheng',
	changeName:'SubLayer/Plat/PlayerDetail/Prefab_changeName',
	tipFrame:'SubLayer/Plat/tips/Tips',  
	Rank:'SubLayer/Plat/Rank/Prefab_RankCtrl',
	RoleDetail:'SubLayer/Plat/Rank/Prefab_roleDetailCtrl',
	RuleDescription:'SubLayer/Plat/RuleDescription/Prefab_RuleCtrl',
	More:'SubLayer/Plat/More/More',
	MoreGame:'SubLayer/Plat/CreateRoom/Prefab_MoreGameSuggestion',
	MoreRuleSuggestion:'SubLayer/Plat/CreateRoom/Prefab_RoomRuleMoreSuggestion',
	DefaultRule:'SubLayer/Plat/CreateRoom/Prefab_DefaultRule',
	ClubCreate:'SubLayer/Plat/Club/Club_Create',
	ClubLobby:'SubLayer/Plat/Club/Club_Lobby',
	ClubSeek:'SubLayer/Plat/Club/Club_SeekList',
	ClubMember:'SubLayer/Plat/Club/Club_MemberList',
	ClubRecord:'SubLayer/Plat/Club/Club_RecordList',
	ClubRecordC:'SubLayer/Plat/Club/Club_RecordContent',
	ClubChangeName:'SubLayer/Plat/Club/Club_ChangeName',
	ClubChangeIcon:'SubLayer/Plat/Club/Club_ChangeIcon',
	ClubRecharge:"SubLayer/Plat/Club/Club_Recharge",
	MatchVideo:'MatchVideo',
	Tranning:'SubLayer/Plat/Tranning/Prefab_tranning',
	ClubApplication:'SubLayer/Plat/Club/Club_applicationList', 
	ApplyDisbandRoom:'SubLayer/Plat/GameRoomCommon/RoomApplyDissolution',
	bingPhone:'SubLayer/Plat/PlayerDetail/Prefab_bingPhone',  
	DefaultRuleItemRename:'SubLayer/Plat/CreateRoom/Prefab_RenameCommonRule',
    RoomChat : 'SubLayer/Plat/GameRoomCommon/RoomChat',
	RoomSetting:'SubLayer/Plat/GameRoomCommon/RoomSetting',
	RoomUserInfo:'SubLayer/Plat/GameRoomCommon/RoomUserInfo',
    RoomPreventionCheating:'SubLayer/Plat/GameRoomCommon/RoomPreventionCheating', 
	CreateDefaultRule:'SubLayer/Plat/CreateRoom/Prefab_CreateCommonRule',
	RoomContent:"SubLayer/Plat/CreateRoom/Prefab_RoomContent",
	RoomRule:"SubLayer/Plat/GameRoomCommon/RoomRule",
	GameRule:"SubLayer/Plat/GameRoomCommon/RoomOption",
	GameRoomRule:"SubLayer/Plat/CreateRoom/Prefab_RoomRule",
	bindAgent:"SubLayer/Plat/bindAgent/Prefab_bindAgent",
	bindConfirm:"SubLayer/Plat/bindAgent/Prefab_bindconfirm",
	Announcement:"SubLayer/Plat/Announcement/Prefab_AnnouncementPanel",
	RecordList:"SubLayer/Plat/GameRecord/Prefab_RecordList",
	Task:"SubLayer/Plat/Task/Prefab_TaskPanel",
	VideoEnter:"SubLayer/Plat/GameRecord/Prefab_VideoEnter", 
	goinvite:'SubLayer/Plat/Task/Prefab_goinvitetips',
	Zixun:"SubLayer/Plat/GameRoomCommon/Prefab_Zixun",
	GameVideo: 'SubLayer/Plat/GameVideo/GameVideo',
    FaPaiGm:'Mahjong/Prefabs/MahjongFaPaiGm',//修改发牌顺序gm
    SwitchCardWithWallGm:'Mahjong/Prefabs/MahjongSwitchCardWithWallGm',//与未发的牌换牌gm
	SwitchCardWithPlayerGm:'Mahjong/Prefabs/MahjongSwitchCardWithPlayerGm',//与其他玩家换牌gm
	MatchPanel:'SubLayer/Plat/MatchGame/Match_CompetitionPanel',
	MatchDaJiangPanel:'SubLayer/Plat/MatchGame/Match_dajiang_Panel',
	redPacket_prefab:'SubLayer/Plat/MatchGame/Match_enlist',
	Common_voiceTip:"SubLayer/Plat/GameRoomCommon/Common_voiceTip",//语音开关按钮触发的提示
    DownLoadGame:'SubLayer/Plat/CreateRoom/Prefab_downloadgamepanel',//下载游戏
	
} 
window['G_MODULE']=G_MODULE;


export default class ModuleMgr{ 
	modulestack=['Login'];
	gameModules=null;
	registerGame(modules)
	{
		this.gameModules=modules;
		for(var key in modules)
		{
			G_MODULE[key]=modules[key];
		}
	}
	//启动模块(全屏)
 
	start_module(sceneName,b_turnback=false)
	{
		if(!b_turnback)
		this.modulestack.push(sceneName);
		let startTime=(new Date()).getTime();
		var cb=function()
		{
			LogMgr.getInstance().showModule(sceneName)
			//在场景最上面价格菊花层
			cc.loader.loadRes('SubLayer/Plat/MsgBox/MsgBoxLoadingAni', (err, prefab:cc.Prefab)=> { 
				if(err){
					cc.error(err) 
				}else{
					//console.log("添加了")
					let prefabNode = cc.instantiate(prefab);
					prefabNode.parent = cc.director.getScene();
					
					//console.log("加载完场景=",sceneName,"耗时=",(new Date()).getTime()-startTime) 
				} 
			}); 
		}
		cc.director.loadScene(sceneName,cb.bind(this));
	}   
	turnback_module()
	{
		let lastmodule=this.modulestack[this.modulestack.length-2]; 
		this.start_module(lastmodule,true); 
		this.modulestack.remove(this.modulestack.length-1); 
	}
	start_sub_module(prefabName:string, cb,scriptName=null)
	{ 
		//console.log("haaaa=",prefabName)
        if(!prefabName){
            cc.error('start_sub_module name== ',prefabName)
            return
        } 
		cc.loader.loadRes(prefabName, (err, prefab:cc.Prefab)=> { 
			if(err){
				cc.error(err) 
			}else{
				let prefabNode = cc.instantiate(prefab);
                prefabNode.parent = cc.director.getScene();
				let prefabComp = null;
                //居中显示
                let winSize = cc.director.getVisibleSize();
                prefabNode.position=cc.p(winSize.width/2,winSize.height/2);
                if(scriptName)
				{
					prefabComp=prefabNode.getComponent(scriptName); 
				}
                cb(prefabComp,prefabNode);
                LogMgr.getInstance().showSubModule(prefabName) 
			} 
		}); 
	}       
    private static _instance:ModuleMgr;
  
    public static getInstance ():ModuleMgr{
        if(!this._instance){
            this._instance = new ModuleMgr();
        }
        return this._instance;
    }
}
