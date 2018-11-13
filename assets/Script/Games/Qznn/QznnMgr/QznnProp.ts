//qznn属性配置,包含算分，以及各种事件开关
export default class QznnProp {
    private customcfg=null;
    private defaultcfg={
        v_difen:1,//底分
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
    };
    constructor(customcfg){
        this.customcfg=customcfg;
    }
    //获取底分如果有用户自定义的底分,就用用户自定义的底分
    get_v_difen(){
        if(this.customcfg['v_difen']!=null)
        {
          return this.customcfg['v_difen'];
        }
        return this.defaultcfg['v_difen'];
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
}
