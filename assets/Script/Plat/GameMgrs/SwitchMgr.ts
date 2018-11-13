//switch属性配置,包含算分，以及各种事件开关
import BaseMgr from "../Libs/BaseMgr";
import SwitchSettingCfg from "../CfgMgrs/SwitchSettingCfg";
export default class SwitchMgr extends BaseMgr{
    private customcfg=null;
    private defaultcfg={
        switch_shop:1,//商城开关,1为开启,2为关闭
        switch_visitors_login:1,//游客登录开关,1为开启,2为关闭
        switch_wechat_login:1,//微信登录开关,1为开启,2为关闭
        switch_wechat_agreement:1,//微信协议开关，1为开启，2为关闭
        switch_bing_account:1,//绑定帐号开关,1为开启,2为关闭
        switch_exchange_code:1,//兑换码开关,1为开启,2为关闭
        switch_customer_service:1,//客服功能开关,1为开启,2为关闭
        switch_luck_draw:1,//抽奖开关,1为开启,2为关闭
        switch_hall_sharing:1,//大厅分享开关,1为开启,2为关闭
        switch_game_sharing:1,//牌局内分享开关,1为开启,2为关闭
        switch_settlement_sharing:1,//结算分享开关,1为开启,2为关闭
        switch_performance_sharing:1,//战绩分享开关,1为开启,2为关闭
        switch_play_method:1,//玩法开关，1为开启，2为关闭
        switch_notice:1,//公告开关,1为开启,2为关闭
        switch_horse_race_lamp:1,//跑马灯开关,1为开启,2为关闭
        switch_apple_pay_outside:1,//苹果充值之外的充值方式开关,1为开启,2为关闭
        switch_add_club:1,//创建茶馆功能开关,1为开启,2为关闭
        switch_add_club_expense:1,//茶馆自费创建开关,1为开启,2为关闭
        switch_del_club:1,//解散茶馆功能开关,1为开启,2为关闭
        switch_out_card_acceleration:1,//游戏环节出牌加速开关,1为开启,2为关闭
        switch_touch_card_acceleration:1,//游戏环节摸牌加速开关,1为开启,2为关闭
        switch_compare_card_acceleration:1,//游戏环节比牌加速开关,1为开启,2为关闭
        switch_real_time_speech:1,//游戏实时语音开关,1为开启,2为关闭
    };
    constructor(){
        super();
        this.routes={
            'http.reqGameSwitch':this.http_reqGameSwitch,
        }
        this.customcfg={};
    }
    http_reqGameSwitch(msg){
        //先读取本地配置去覆盖服务器的开关配置
        let localSwitchSetting=SwitchSettingCfg.getInstance().getSetting();
                  
        if(localSwitchSetting)
        {
            for(let key in localSwitchSetting)
            {
                msg.cfg[key]=localSwitchSetting[key];              
            }
        }
        this.customcfg=msg.cfg; 
    }
    reqGameSwitch(){
        this.send_msg('http.reqGameSwitch',{gid:8});
    }
    //获取商城开关,1为开启,2为关闭如果有用户自定义的商城开关,1为开启,2为关闭,就用用户自定义的商城开关,1为开启,2为关闭
    get_switch_shop(){
        if(this.customcfg['switch_shop']!=null)
        {
          return this.customcfg['switch_shop'];
        }
        return this.defaultcfg['switch_shop'];
    }
    //获取游客登录开关,1为开启,2为关闭如果有用户自定义的游客登录开关,1为开启,2为关闭,就用用户自定义的游客登录开关,1为开启,2为关闭
    get_switch_visitors_login(){
        if(this.customcfg['switch_visitors_login']!=null)
        {
          return this.customcfg['switch_visitors_login'];
        }
        return this.defaultcfg['switch_visitors_login'];
    }
    //获取微信登录开关,1为开启,2为关闭如果有用户自定义的微信登录开关,1为开启,2为关闭,就用用户自定义的微信登录开关,1为开启,2为关闭
    get_switch_wechat_login(){
        if(this.customcfg['switch_wechat_login']!=null)
        {
          return this.customcfg['switch_wechat_login'];
        }
        return this.defaultcfg['switch_wechat_login'];
    }
    //获取微信协议开关,1为开启,2为关闭如果有用户自定义的协议开关,1为开启,2为关闭,就用用户自定义的协议开关,1为开启,2为关闭
    get_switch_wechat_agreement(){
        if(this.customcfg['switch_wechat_agreement']!=null)
        {
          return this.customcfg['switch_wechat_agreement'];
        }
        return this.defaultcfg['switch_wechat_agreement'];
    }    
    //获取绑定帐号开关,1为开启,2为关闭如果有用户自定义的绑定帐号开关,1为开启,2为关闭,就用用户自定义的绑定帐号开关,1为开启,2为关闭
    get_switch_bing_account(){
        if(this.customcfg['switch_bing_account']!=null)
        {
          return this.customcfg['switch_bing_account'];
        }
        return this.defaultcfg['switch_bing_account'];
    }
    //获取兑换码开关,1为开启,2为关闭如果有用户自定义的兑换码开关,1为开启,2为关闭,就用用户自定义的兑换码开关,1为开启,2为关闭
    get_switch_exchange_code(){
        if(this.customcfg['switch_exchange_code']!=null)
        {
          return this.customcfg['switch_exchange_code'];
        }
        return this.defaultcfg['switch_exchange_code'];
    }
    //获取客服功能开关,1为开启,2为关闭如果有用户自定义的客服功能开关,1为开启,2为关闭,就用用户自定义的客服功能开关,1为开启,2为关闭
    get_switch_customer_service(){
        if(this.customcfg['switch_customer_service']!=null)
        {
          return this.customcfg['switch_customer_service'];
        }
        return this.defaultcfg['switch_customer_service'];
    }
    //获取抽奖开关,1为开启,2为关闭如果有用户自定义的抽奖开关,1为开启,2为关闭,就用用户自定义的抽奖开关,1为开启,2为关闭
    get_switch_luck_draw(){
        if(this.customcfg['switch_luck_draw']!=null)
        {
          return this.customcfg['switch_luck_draw'];
        }
        return this.defaultcfg['switch_luck_draw'];
    }
    //获取大厅分享开关,1为开启,2为关闭如果有用户自定义的大厅分享开关,1为开启,2为关闭,就用用户自定义的大厅分享开关,1为开启,2为关闭
    get_switch_hall_sharing(){
        if(this.customcfg['switch_hall_sharing']!=null)
        {
          return this.customcfg['switch_hall_sharing'];
        }
        return this.defaultcfg['switch_hall_sharing'];
    }
    //获取牌局内分享开关,1为开启,2为关闭如果有用户自定义的牌局内分享开关,1为开启,2为关闭,就用用户自定义的牌局内分享开关,1为开启,2为关闭
    get_switch_game_sharing(){
        if(this.customcfg['switch_game_sharing']!=null)
        {
          return this.customcfg['switch_game_sharing'];
        }
        return this.defaultcfg['switch_game_sharing'];
    }
    //获取结算分享开关,1为开启,2为关闭如果有用户自定义的结算分享开关,1为开启,2为关闭,就用用户自定义的结算分享开关,1为开启,2为关闭
    get_switch_settlement_sharing(){
        if(this.customcfg['switch_settlement_sharing']!=null)
        {
          return this.customcfg['switch_settlement_sharing'];
        }
        return this.defaultcfg['switch_settlement_sharing'];
    }
    //获取战绩分享开关,1为开启,2为关闭如果有用户自定义的战绩分享开关,1为开启,2为关闭,就用用户自定义的战绩分享开关,1为开启,2为关闭
    get_switch_performance_sharing(){
        if(this.customcfg['switch_performance_sharing']!=null)
        {
          return this.customcfg['switch_performance_sharing'];
        }
        return this.defaultcfg['switch_performance_sharing'];
    }
    //获取玩法开关,1为开启,2为关闭如果有用户自定义的协议开关,1为开启,2为关闭,就用用户自定义的协议开关,1为开启,2为关闭
    get_switch_play_method(){
        if(this.customcfg['switch_play_method']!=null)
        {
          return this.customcfg['switch_play_method'];
        }
        return this.defaultcfg['switch_play_method'];
    }
    //获取公告开关,1为开启,2为关闭如果有用户自定义的公告开关,1为开启,2为关闭,就用用户自定义的公告开关,1为开启,2为关闭
    get_switch_notice(){
        if(this.customcfg['switch_notice']!=null)
        {
          return this.customcfg['switch_notice'];
        }
        return this.defaultcfg['switch_notice'];
    }
    //获取跑马灯开关,1为开启,2为关闭如果有用户自定义的跑马灯开关,1为开启,2为关闭,就用用户自定义的跑马灯开关,1为开启,2为关闭
    get_switch_horse_race_lamp(){
        if(this.customcfg['switch_horse_race_lamp']!=null)
        {
          return this.customcfg['switch_horse_race_lamp'];
        }
        return this.defaultcfg['switch_horse_race_lamp'];
    }
    //获取苹果充值之外的充值方式开关,1为开启,2为关闭如果有用户自定义的苹果充值之外的充值方式开关,1为开启,2为关闭,就用用户自定义的苹果充值之外的充值方式开关,1为开启,2为关闭
    get_switch_apple_pay_outside(){
        if(this.customcfg['switch_apple_pay_outside']!=null)
        {
          return this.customcfg['switch_apple_pay_outside'];
        }
        return this.defaultcfg['switch_apple_pay_outside'];
    }
    //获取创建茶馆功能开关,1为开启,2为关闭如果有用户自定义的创建茶馆功能开关,1为开启,2为关闭,就用用户自定义的创建茶馆功能开关,1为开启,2为关闭
    get_switch_add_club(){
        if(this.customcfg['switch_add_club']!=null)
        {
          return this.customcfg['switch_add_club'];
        }
        return this.defaultcfg['switch_add_club'];
    }
    //获取茶馆自费创建开关,1为开启,2为关闭如果有用户自定义的茶馆自费创建开关,1为开启,2为关闭,就用用户自定义的茶馆自费创建开关,1为开启,2为关闭
    get_switch_add_club_expense(){
        if(this.customcfg['switch_add_club_expense']!=null)
        {
          return this.customcfg['switch_add_club_expense'];
        }
        return this.defaultcfg['switch_add_club_expense'];
    }
    //获取解散茶馆功能开关,1为开启,2为关闭如果有用户自定义的解散茶馆功能开关,1为开启,2为关闭,就用用户自定义的解散茶馆功能开关,1为开启,2为关闭
    get_switch_del_club(){
        if(this.customcfg['switch_del_club']!=null)
        {
          return this.customcfg['switch_del_club'];
        }
        return this.defaultcfg['switch_del_club'];
    }
    //获取游戏环节出牌加速开关,1为开启,2为关闭如果有用户自定义的游戏环节出牌加速开关,1为开启,2为关闭,就用用户自定义的游戏环节出牌加速开关,1为开启,2为关闭
    get_switch_out_card_acceleration(){
        if(this.customcfg['switch_out_card_acceleration']!=null)
        {
          return this.customcfg['switch_out_card_acceleration'];
        }
        return this.defaultcfg['switch_out_card_acceleration'];
    }
    //获取游戏环节摸牌加速开关,1为开启,2为关闭如果有用户自定义的游戏环节摸牌加速开关,1为开启,2为关闭,就用用户自定义的游戏环节摸牌加速开关,1为开启,2为关闭
    get_switch_touch_card_acceleration(){
        if(this.customcfg['switch_touch_card_acceleration']!=null)
        {
          return this.customcfg['switch_touch_card_acceleration'];
        }
        return this.defaultcfg['switch_touch_card_acceleration'];
    }
    //获取游戏环节比牌加速开关,1为开启,2为关闭如果有用户自定义的游戏环节比牌加速开关,1为开启,2为关闭,就用用户自定义的游戏环节比牌加速开关,1为开启,2为关闭
    get_switch_compare_card_acceleration(){
        if(this.customcfg['switch_compare_card_acceleration']!=null)
        {
          return this.customcfg['switch_compare_card_acceleration'];
        }
        return this.defaultcfg['switch_compare_card_acceleration'];
    }
     //获取游戏实时语音开关,1为开启,2为关闭如果有用户自定义的游戏实时语音开关,1为开启,2为关闭,就用用户自定义的游戏实时语音开关,1为开启,2为关闭
     get_switch_real_time_speech(){
        if(this.customcfg['switch_real_time_speech']!=null)
        {
          return this.customcfg['switch_real_time_speech'];
        }
        return this.defaultcfg['switch_real_time_speech'];
    }
    private static _instance:SwitchMgr
    public static getInstance ():SwitchMgr{
        if(!this._instance)
          this._instance = new SwitchMgr();
        return this._instance;
    }
}
