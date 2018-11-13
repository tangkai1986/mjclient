//tbnn属性配置,包含算分，以及各种事件开关
export default class TbnnProp {
    private customcfg=null;
    private defaultcfg={
        t_niu_0:1,//五牛倍数
        t_niu_1:1,//牛1倍数
        t_niu_2:1,//牛2倍数
        t_niu_3:1,//牛3倍数
        t_niu_4:1,//牛4倍数
        t_niu_5:1,//牛5倍数
        t_niu_6:1,//牛6倍数
        t_niu_7:2,//牛7倍数
        t_niu_8:2,//牛8倍数
        t_niu_9:3,//牛9倍数
        t_niu_10:4,//牛牛倍数
        t_niu_12:5,//顺子牛倍数
        t_niu_13:5,//同花牛倍数
        t_niu_14:6,//葫芦牛倍数
        t_niu_15:6,//炸弹牛倍数
        t_niu_17:5,//五花牛倍数
        t_niu_18:8,//五小牛倍数
        v_cuopaiLimit:1,//是否禁用搓牌
        v_fangfei:1,//房费
        v_huluNiuLimit:1,//是否有葫芦牛
        v_midEnterLimit:1,//是否中途禁入
        v_minChip:1,//底分
        v_paytype:1,//支付方式
        v_roundcount:1,//局数
        v_seatcount:1,//人数
        v_shunziNiuLimit:1,//是否有顺子牛
        v_fullstart:4,//满几人开房
        v_startModel:1,//开桌方式
        v_tonghuaNiuLimit:1,//是否有同花牛
        v_wanglaiLimit:1,//是否王癞模式
        v_wuhuaNiuLimit:1,//是否有五花牛
        v_wuxiaoNiuLimit:1,//是否有五小牛
        v_zhadanNiuLimit:1,//是否有炸弹牛
    };
    constructor(customcfg){
        this.customcfg=customcfg;
    }
    //获取五牛倍数如果有用户自定义的五牛倍数,就用用户自定义的五牛倍数
    get_t_niu_0(){
        if(this.customcfg['t_niu_0']!=null)
        {
          return this.customcfg['t_niu_0'];
        }
        return this.defaultcfg['t_niu_0'];
    }
    //获取牛1倍数如果有用户自定义的牛1倍数,就用用户自定义的牛1倍数
    get_t_niu_1(){
        if(this.customcfg['t_niu_1']!=null)
        {
          return this.customcfg['t_niu_1'];
        }
        return this.defaultcfg['t_niu_1'];
    }
    //获取牛2倍数如果有用户自定义的牛2倍数,就用用户自定义的牛2倍数
    get_t_niu_2(){
        if(this.customcfg['t_niu_2']!=null)
        {
          return this.customcfg['t_niu_2'];
        }
        return this.defaultcfg['t_niu_2'];
    }
    //获取牛3倍数如果有用户自定义的牛3倍数,就用用户自定义的牛3倍数
    get_t_niu_3(){
        if(this.customcfg['t_niu_3']!=null)
        {
          return this.customcfg['t_niu_3'];
        }
        return this.defaultcfg['t_niu_3'];
    }
    //获取牛4倍数如果有用户自定义的牛4倍数,就用用户自定义的牛4倍数
    get_t_niu_4(){
        if(this.customcfg['t_niu_4']!=null)
        {
          return this.customcfg['t_niu_4'];
        }
        return this.defaultcfg['t_niu_4'];
    }
    //获取牛5倍数如果有用户自定义的牛5倍数,就用用户自定义的牛5倍数
    get_t_niu_5(){
        if(this.customcfg['t_niu_5']!=null)
        {
          return this.customcfg['t_niu_5'];
        }
        return this.defaultcfg['t_niu_5'];
    }
    //获取牛6倍数如果有用户自定义的牛6倍数,就用用户自定义的牛6倍数
    get_t_niu_6(){
        if(this.customcfg['t_niu_6']!=null)
        {
          return this.customcfg['t_niu_6'];
        }
        return this.defaultcfg['t_niu_6'];
    }
    //获取牛7倍数如果有用户自定义的牛7倍数,就用用户自定义的牛7倍数
    get_t_niu_7(){
        if(this.customcfg['t_niu_7']!=null)
        {
          return this.customcfg['t_niu_7'];
        }
        return this.defaultcfg['t_niu_7'];
    }
    //获取牛8倍数如果有用户自定义的牛8倍数,就用用户自定义的牛8倍数
    get_t_niu_8(){
        if(this.customcfg['t_niu_8']!=null)
        {
          return this.customcfg['t_niu_8'];
        }
        return this.defaultcfg['t_niu_8'];
    }
    //获取牛9倍数如果有用户自定义的牛9倍数,就用用户自定义的牛9倍数
    get_t_niu_9(){
        if(this.customcfg['t_niu_9']!=null)
        {
          return this.customcfg['t_niu_9'];
        }
        return this.defaultcfg['t_niu_9'];
    }
    //获取牛牛倍数如果有用户自定义的牛牛倍数,就用用户自定义的牛牛倍数
    get_t_niu_10(){
        if(this.customcfg['t_niu_10']!=null)
        {
          return this.customcfg['t_niu_10'];
        }
        return this.defaultcfg['t_niu_10'];
    }
    //获取顺子牛倍数如果有用户自定义的顺子牛倍数,就用用户自定义的顺子牛倍数
    get_t_niu_12(){
        if(this.customcfg['t_niu_12']!=null)
        {
          return this.customcfg['t_niu_12'];
        }
        return this.defaultcfg['t_niu_12'];
    }
    //获取同花牛倍数如果有用户自定义的同花牛倍数,就用用户自定义的同花牛倍数
    get_t_niu_13(){
        if(this.customcfg['t_niu_13']!=null)
        {
          return this.customcfg['t_niu_13'];
        }
        return this.defaultcfg['t_niu_13'];
    }
    //获取葫芦牛倍数如果有用户自定义的葫芦牛倍数,就用用户自定义的葫芦牛倍数
    get_t_niu_14(){
        if(this.customcfg['t_niu_14']!=null)
        {
          return this.customcfg['t_niu_14'];
        }
        return this.defaultcfg['t_niu_14'];
    }
    //获取炸弹牛倍数如果有用户自定义的炸弹牛倍数,就用用户自定义的炸弹牛倍数
    get_t_niu_15(){
        if(this.customcfg['t_niu_15']!=null)
        {
          return this.customcfg['t_niu_15'];
        }
        return this.defaultcfg['t_niu_15'];
    }
    //获取五花牛倍数如果有用户自定义的五花牛倍数,就用用户自定义的五花牛倍数
    get_t_niu_17(){
        if(this.customcfg['t_niu_17']!=null)
        {
          return this.customcfg['t_niu_17'];
        }
        return this.defaultcfg['t_niu_17'];
    }
    //获取五小牛倍数如果有用户自定义的五小牛倍数,就用用户自定义的五小牛倍数
    get_t_niu_18(){
        if(this.customcfg['t_niu_18']!=null)
        {
          return this.customcfg['t_niu_18'];
        }
        return this.defaultcfg['t_niu_18'];
    }
    //获取是否禁用搓牌如果有用户自定义的是否禁用搓牌,就用用户自定义的是否禁用搓牌
    get_v_cuopaiLimit(){
        if(this.customcfg['v_cuopaiLimit']!=null)
        {
          return this.customcfg['v_cuopaiLimit'];
        }
        return this.defaultcfg['v_cuopaiLimit'];
    }
    //获取房费如果有用户自定义的房费,就用用户自定义的房费
    get_v_fangfei(){
        if(this.customcfg['v_fangfei']!=null)
        {
          return this.customcfg['v_fangfei'];
        }
        return this.defaultcfg['v_fangfei'];
    }
    //获取是否有葫芦牛如果有用户自定义的是否有葫芦牛,就用用户自定义的是否有葫芦牛
    get_v_huluNiuLimit(){
        if(this.customcfg['v_huluNiuLimit']!=null)
        {
          return this.customcfg['v_huluNiuLimit'];
        }
        return this.defaultcfg['v_huluNiuLimit'];
    }
    //获取是否中途禁入如果有用户自定义的是否中途禁入,就用用户自定义的是否中途禁入
    get_v_midEnterLimit(){
        if(this.customcfg['v_midEnterLimit']!=null)
        {
          return this.customcfg['v_midEnterLimit'];
        }
        return this.defaultcfg['v_midEnterLimit'];
    }
    //获取底分如果有用户自定义的底分,就用用户自定义的底分
    get_v_minChip(){
        if(this.customcfg['v_minChip']!=null)
        {
          return this.customcfg['v_minChip'];
        }
        return this.defaultcfg['v_minChip'];
    }
    //获取支付方式如果有用户自定义的支付方式,就用用户自定义的支付方式
    get_v_paytype(){
        if(this.customcfg['v_paytype']!=null)
        {
          return this.customcfg['v_paytype'];
        }
        return this.defaultcfg['v_paytype'];
    }
    //获取局数如果有用户自定义的局数,就用用户自定义的局数
    get_v_roundcount(){
        if(this.customcfg['v_roundcount']!=null)
        {
          return this.customcfg['v_roundcount'];
        }
        return this.defaultcfg['v_roundcount'];
    }
    //获取人数如果有用户自定义的人数,就用用户自定义的人数
    get_v_seatcount(){
        if(this.customcfg['v_seatcount']!=null)
        {
          return this.customcfg['v_seatcount'];
        }
        return this.defaultcfg['v_seatcount'];
    }
    //获取是否有顺子牛如果有用户自定义的是否有顺子牛,就用用户自定义的是否有顺子牛
    get_v_shunziNiuLimit(){
        if(this.customcfg['v_shunziNiuLimit']!=null)
        {
          return this.customcfg['v_shunziNiuLimit'];
        }
        return this.defaultcfg['v_shunziNiuLimit'];
    }
    //获取满几人开房如果有用户自定义的满几人开房,就用用户自定义的满几人开房
    get_v_fullstart(){
        if(this.customcfg['v_fullstart']!=null)
        {
          return this.customcfg['v_fullstart'];
        }
        return this.defaultcfg['v_fullstart'];
    }
    //获取开桌方式如果有用户自定义的开桌方式,就用用户自定义的开桌方式
    get_v_startModel(){
        if(this.customcfg['v_startModel']!=null)
        {
          return this.customcfg['v_startModel'];
        }
        return this.defaultcfg['v_startModel'];
    }
    //获取是否有同花牛如果有用户自定义的是否有同花牛,就用用户自定义的是否有同花牛
    get_v_tonghuaNiuLimit(){
        if(this.customcfg['v_tonghuaNiuLimit']!=null)
        {
          return this.customcfg['v_tonghuaNiuLimit'];
        }
        return this.defaultcfg['v_tonghuaNiuLimit'];
    }
    //获取是否王癞模式如果有用户自定义的是否王癞模式,就用用户自定义的是否王癞模式
    get_v_wanglaiLimit(){
        if(this.customcfg['v_wanglaiLimit']!=null)
        {
          return this.customcfg['v_wanglaiLimit'];
        }
        return this.defaultcfg['v_wanglaiLimit'];
    }
    //获取是否有五花牛如果有用户自定义的是否有五花牛,就用用户自定义的是否有五花牛
    get_v_wuhuaNiuLimit(){
        if(this.customcfg['v_wuhuaNiuLimit']!=null)
        {
          return this.customcfg['v_wuhuaNiuLimit'];
        }
        return this.defaultcfg['v_wuhuaNiuLimit'];
    }
    //获取是否有五小牛如果有用户自定义的是否有五小牛,就用用户自定义的是否有五小牛
    get_v_wuxiaoNiuLimit(){
        if(this.customcfg['v_wuxiaoNiuLimit']!=null)
        {
          return this.customcfg['v_wuxiaoNiuLimit'];
        }
        return this.defaultcfg['v_wuxiaoNiuLimit'];
    }
    //获取是否有炸弹牛如果有用户自定义的是否有炸弹牛,就用用户自定义的是否有炸弹牛
    get_v_zhadanNiuLimit(){
        if(this.customcfg['v_zhadanNiuLimit']!=null)
        {
          return this.customcfg['v_zhadanNiuLimit'];
        }
        return this.defaultcfg['v_zhadanNiuLimit'];
    }
}
