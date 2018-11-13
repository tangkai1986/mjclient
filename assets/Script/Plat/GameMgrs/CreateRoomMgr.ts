import BaseMgr from "../Libs/BaseMgr";
import LoginMgr from "./LoginMgr";
import UserMgr from "./UserMgr";
import GameCateCfg from "../CfgMgrs/GameCateCfg";
import RoomRuleCfg from "../CfgMgrs/RoomRuleCfg";
import LocalStorage from "../Libs/LocalStorage";


export default class CreateRoomMgr extends BaseMgr{
    private gameId = null;
    private clubId : number = null;
    private paysource : number = null;  
    //常用规则界面传值用
    private commonRule : any = {};
    private commonRuleName : string = null;
    private newName : string = null;
    private ruleItemIndex : number = null;
    private editItemIndex :number = null;       //点击编辑按钮的index
    private ruleItems : any = [];
    private bCommomRule : any = null;
    private DefaultRuleName : any = null;
    //本地存储的数据
    private games:any = null
    private roomRuleInfoGroups:any = {}
    private roomRuleInfo:any = {}
    private commonRuleGroups:any = {}
    private commonRules:any = {}
    routes:{} = null;
    uid:any = null;
    //单例处理
    constructor(){
        super();
        this.gameId = 1
        this.games = GameCateCfg.getInstance().getGames();
        this.clubId = 0
        this.paysource = 1
        this.bCommomRule = false;
        this.uid = LoginMgr.getInstance().getUid()
        this.initRoomRuleInfo()
        this.initCommonRuleInfo()
    }
    initRoomRuleInfo(){
        for(let i = 0; i<this.games.length; i++){
            // let itemKey = this.games[i].code + 'RoomRuleInfoGroups'
            // //console.log('itemKey', itemKey)
            // let data = JSON.parse(cc.sys.localStorage.getItem(itemKey))
            let data = LocalStorage.getInstance().getRoomRuleInfoGroups(this.games[i].code);
            let index = this.games[i].id
            this.roomRuleInfoGroups[index] = data?data:{};
            this.roomRuleInfo[index] = this.roomRuleInfoGroups[index][this.uid.toString()]
            if (!this.roomRuleInfo[index]){
                this.roomRuleInfo[index] = RoomRuleCfg.getInstance().getRoomRuleById(index)
            }
        }
    }

    initCommonRuleInfo(){
        for(let i = 0; i<this.games.length; i++){
            // let itemKey = this.games[i].code + 'CommonRuleGroups'
            // let data = JSON.parse(cc.sys.localStorage.getItem(itemKey))
            let data = LocalStorage.getInstance().getCommonRuleGroups(this.games[i].code);
            let index = this.games[i].id
            this.commonRuleGroups[index] = data?data:{};
            this.commonRules[index] = this.commonRuleGroups[index][this.uid.toString()]
            if(!this.commonRules[index]){
                let ruleData = {}
                ruleData.ruleInfo = {}
                this.commonRules[index] = []
                let roomRuleInfo = RoomRuleCfg.getInstance().getRoomRuleById(index)
                for(let key in roomRuleInfo){
                    ruleData.ruleInfo[key] = roomRuleInfo[key]
                }
                ruleData.ruleName = '常用规则'
                this.commonRules[index].push(ruleData)
                this.commonRuleGroups[index][this.uid.toString()] = this.commonRules[index]
            }
        }
    }

    private static _instance:CreateRoomMgr;
    public static getInstance ():CreateRoomMgr{
        if(!this._instance){
            this._instance = new CreateRoomMgr();
        }
        return this._instance;
    }

    setDefaultRuleName(string){
        this.DefaultRuleName = string;
    }
    getDefaultRuleName(){
        return this.DefaultRuleName;
    }
    setEditItemIndex(index){
        this.editItemIndex = index;
    }
    getEditItemIndex(){
        return this.editItemIndex;
    }
    setbCommomRule(bool){
        this.bCommomRule = bool;
    }
    getbCommomRule(){
        return this.bCommomRule;
    }
    setProperty (value, PropertyName, childProName?, lowerProName?) {
        if (isNaN(value)) return //console.log("value 不能为空")
        if (!PropertyName) return //console.log("PropertyName 不能为空")
        if (lowerProName) {
            this[PropertyName][childProName][lowerProName] = value
        } else{
            if (childProName){
                this[PropertyName][childProName] = value
            } else {
                this[PropertyName] = value
            }
        }
    }

    setCommonRulePerItem(data){
        this.commonRule = data;
    }

    setCommonRuleName(data){
        this.commonRuleName = data;
    }

    setQzmjRoomRuleInfo(data){
        this.qzmjRoomRuleInfo = data;
    }
    setNewName(data){
        this.newName = data;
    }

    setRuleItemIndex(data){
        this.ruleItemIndex = data;
    }
    setRuleItems(data){
        this.ruleItems = data;
    }

    getRuleItemIndex(){
        return this.ruleItemIndex;
    }

    getRuleItems(){
        return this.ruleItems;
    }

    getNewName(){
        return this.newName;
    }

    getCommonRuleName(){
        return this.commonRuleName;
    }

    getCommonRulePerItem(){
        return this.commonRule;
    }

    getCommonRule(gameId){
        return this.commonRules[gameId];
    }

    getClubId(){
        return this.clubId;
    }

    getClubPaysource(){
        return this.paysource;
    }

    getGameId(){
        return this.gameId;
    }

    getCommonRuleGroups(gameId){
        return this.commonRuleGroups[gameId];
    }

    getInfoGroups(gameID){
        return this.roomRuleInfoGroups[gameID];
    }

    getRoomRuleInfo(gameID){
        return this.roomRuleInfo[gameID];
    }
    addCommonRuleData(data,gameid){
        this.commonRules[gameid].push(data)
        G_FRAME.globalEmitter.emit('createCommonRuleData')       //发送全局事件通知默认规则界面刷新item信息
    }
    RefreshRoomUi(id){
        switch(id){
            case 1: 
            G_FRAME.globalEmitter.emit('RefreshQZMJRoomUi')             //发送全局事件通知创建泉州麻将房间刷新界面
            break;
            case 18:
            G_FRAME.globalEmitter.emit('RefreshZYQZRoomUi') 
            break;
            case 20:
            G_FRAME.globalEmitter.emit('RefreshTBNNRoomUi') 
            break;
        }
       
    }
    RefreshDefaultRuleLabel(){
        G_FRAME.globalEmitter.emit('RefreshDefaultRuleLabel')   
    }
    closeDefaultRulePanel(){
        G_FRAME.globalEmitter.emit('closeDefaultRulePanel')
    }
}
