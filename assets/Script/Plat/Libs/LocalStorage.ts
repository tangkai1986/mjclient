/**
 * 存储和读取用户本地缓存数据
 */
export default class LocalStorage {
    constructor () {
        
    }

    //========================

    //创建房间界面设置信息
    setCreateRoomInfoCfg (data){
        this.setItem('createRoomInfo', data)
    }
    getCreateRoomInfoCfg (){
        return this.getItem("createRoomInfo");
    }
    //大厅设置界面设置信息
    setControlInfoCfg (data){
        this.setItem('controlInfo', data)
    }
    getControlInfoCfg (){
        return this.getItem("controlInfo");
    }
    //---麦克风语音状态
    setVoicestateCfg (data){
        this.setItem('voicestate', data)
    }
    getVoicestateCfg (){
        return this.getItem("voicestate");
    }
    //---牛牛房间背景设置信息
    setBullRoomBGCfg (data){
        this.setItem('BullRoomBGCfg', data)
    }
    getBullRoomBGCfg (){
        return this.getItem("BullRoomBGCfg");
    }
    //---牛牛卡牌背景设置信息
    setBullCardBGCfg (data){
        this.setItem('BullCardBGCfg', data)
    }
    getBullCardBGCfg (){
        return this.getItem("BullCardBGCfg");
    }
    //---大菠萝房间背景设置信息
    setSssRoomBGCfg (data){
        this.setItem('SssRoomBGCfg', data)
    }
    getSssRoomBGCfg (){
        return this.getItem("SssRoomBGCfg");
    }
    //---大菠萝卡牌背景设置信息
    setSssCardBGCfg (data){
        this.setItem('SssCardBGCfg', data)
    }
    getSssCardBGCfg (){
        return this.getItem("SssCardBGCfg");
    }
    //---
    setCommonRuleGroups(gameCode, data){
        this.setItem(gameCode+"CommonRuleGroups", data)
    }
    getCommonRuleGroups(gameCode){
        return this.getItem(gameCode+"CommonRuleGroups");
    }
    //--- 微信登陆本地缓存
    setWeChatToken(data){
        this.setItem('WeChatToken', data);
    }
    getWeChatToken(){
        return this.getItem('WeChatToken');
    }
    removeWeChatToken(){
        cc.sys.localStorage.removeItem('WeChatToken');
    }
    //----上次开房的选项记录存入本地
    setRoomRuleInfoGroups(gameCode, data){
        this.setItem(gameCode+"RoomRuleInfoGroups", data)
    }
    getRoomRuleInfoGroups(gameCode){
        return this.getItem(gameCode+"RoomRuleInfoGroups");
    } 
    //-----茶馆列表
    setClubList(data){
        this.setItem('clublist', data);
    }
    getClubList(){
        return this.getItem('clublist');
    }

    setSssControlCustom(data){
        this.setItem('SssControlCustom', data)
    }

    getSssControlCustom(){
        return this.getItem('SssControlCustom')
    }
 
    private getItem (key){
        let data = cc.sys.localStorage.getItem(key);
        if(data) return JSON.parse(data);
        return null;
    }
    private setItem (key, data){
        return cc.sys.localStorage.setItem(key, JSON.stringify(data));
    }
    private clearAll (){
        cc.sys.localStorage.clear();
    }

    //==========================

    /**
     * 设置缓存数据
     * @param key    数据唯一ID
     * @param value  需要缓存数据
     */
    setData (key, value) {
        let data = JSON.stringify(value);
        console.log("存入数据",key, data);
        cc.sys.localStorage.setItem(key, data);
    }

    /**
     * 获取缓存数据
     * @param key   数据唯一ID
     * @returns obj
     */
    getData (key) {
        let data = cc.sys.localStorage.getItem(key);
        console.log("获取数据", data);
        return JSON.parse(data);
    }

    /**
     * 删除缓存值
     * @param key   数据唯一ID
     */
    removeDataByKey (key) {
        cc.sys.localStorage.removeItem(key);
    }

    //单例处理
    private static _instance:LocalStorage;
    public static getInstance ():LocalStorage{
        if(!this._instance){
            this._instance = new LocalStorage();
        }
        return this._instance;
    }
}