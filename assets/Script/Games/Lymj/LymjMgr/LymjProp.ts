//lymj属性配置,包含算分，以及各种事件开关
export default class LymjProp {
    private customcfg=null;
    private defaultcfg={
        v_difen:1,//底分
        v_huagang:1,//4个花1花杠再加1花就花杠加1
        v_angang:2,//暗杠
        v_minggang:1,//明杠
        t_zhuangfanbei:2,//庄家2倍
        t_zimo:2,//自摸
        t_qiangganghu:2,//抢杠胡
        t_sanjindao:4,//三金倒
        t_sijindao:4,//四金倒
        t_wujindao:4,//五金倒
        t_liujindao:4,//六金倒
        t_youjin:4,//游金
        t_shuangyou:8,//双游
        t_sanyou:16,//三游
        t_tianhu:4,//天胡
        t_gaibaoqiangjin:8,//盖宝抢金
        t_shisanyao:8,//十三幺
        v_roundcount:8,//局数选项；8=8局；16=16局；
        v_seatcount:4,//人数选项：2=二人麻将；3=三人麻将；4=四人麻将
        v_paytype:1,//房费：0=房主支付；1=AA支付；2=赢家支付。
        v_youjintype:0,//游金倍数：5=游金5倍；4=游金4倍。
        b_jinxianzhi:2,//有金限制下拉选项：2=单金至少自摸，双金至少游金；3=有金至少游金；4=双金至少游金;5=金牌不限制自摸。
        b_quanzimo:0,//是否开启全自摸模式：0=不开启全自摸；1=全自摸模式。
        v_fangfei:99,//通过另一配置表获得（与人数、局数、支付方式有关系）
        v_genzhuang:1,//跟庄
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
    //获取4个花1花杠再加1花就花杠加1如果有用户自定义的4个花1花杠再加1花就花杠加1,就用用户自定义的4个花1花杠再加1花就花杠加1
    get_v_huagang(){
        if(this.customcfg['v_huagang']!=null)
        {
          return this.customcfg['v_huagang'];
        }
        return this.defaultcfg['v_huagang'];
    }
    //获取暗杠如果有用户自定义的暗杠,就用用户自定义的暗杠
    get_v_angang(){
        if(this.customcfg['v_angang']!=null)
        {
          return this.customcfg['v_angang'];
        }
        return this.defaultcfg['v_angang'];
    }
    //获取明杠如果有用户自定义的明杠,就用用户自定义的明杠
    get_v_minggang(){
        if(this.customcfg['v_minggang']!=null)
        {
          return this.customcfg['v_minggang'];
        }
        return this.defaultcfg['v_minggang'];
    }
    //获取庄家2倍如果有用户自定义的庄家2倍,就用用户自定义的庄家2倍
    get_t_zhuangfanbei(){
        if(this.customcfg['t_zhuangfanbei']!=null)
        {
          return this.customcfg['t_zhuangfanbei'];
        }
        return this.defaultcfg['t_zhuangfanbei'];
    }
    //获取自摸如果有用户自定义的自摸,就用用户自定义的自摸
    get_t_zimo(){
        if(this.customcfg['t_zimo']!=null)
        {
          return this.customcfg['t_zimo'];
        }
        return this.defaultcfg['t_zimo'];
    }
    //获取抢杠胡如果有用户自定义的抢杠胡,就用用户自定义的抢杠胡
    get_t_qiangganghu(){
        if(this.customcfg['t_qiangganghu']!=null)
        {
          return this.customcfg['t_qiangganghu'];
        }
        return this.defaultcfg['t_qiangganghu'];
    }
    //获取三金倒如果有用户自定义的三金倒,就用用户自定义的三金倒
    get_t_sanjindao(){
        if(this.customcfg['t_sanjindao']!=null)
        {
          return this.customcfg['t_sanjindao'];
        }
        return this.defaultcfg['t_sanjindao'];
    }
    //获取四金倒如果有用户自定义的四金倒,就用用户自定义的四金倒
    get_t_sijindao(){
        if(this.customcfg['t_sijindao']!=null)
        {
          return this.customcfg['t_sijindao'];
        }
        return this.defaultcfg['t_sijindao'];
    }
    //获取五金倒如果有用户自定义的五金倒,就用用户自定义的五金倒
    get_t_wujindao(){
        if(this.customcfg['t_wujindao']!=null)
        {
          return this.customcfg['t_wujindao'];
        }
        return this.defaultcfg['t_wujindao'];
    }
    //获取六金倒如果有用户自定义的六金倒,就用用户自定义的六金倒
    get_t_liujindao(){
        if(this.customcfg['t_liujindao']!=null)
        {
          return this.customcfg['t_liujindao'];
        }
        return this.defaultcfg['t_liujindao'];
    }
    //获取游金如果有用户自定义的游金,就用用户自定义的游金
    get_t_youjin(){
        if(this.customcfg['t_youjin']!=null)
        {
          return this.customcfg['t_youjin'];
        }
        return this.defaultcfg['t_youjin'];
    }
    //获取双游如果有用户自定义的双游,就用用户自定义的双游
    get_t_shuangyou(){
        if(this.customcfg['t_shuangyou']!=null)
        {
          return this.customcfg['t_shuangyou'];
        }
        return this.defaultcfg['t_shuangyou'];
    }
    //获取三游如果有用户自定义的三游,就用用户自定义的三游
    get_t_sanyou(){
        if(this.customcfg['t_sanyou']!=null)
        {
          return this.customcfg['t_sanyou'];
        }
        return this.defaultcfg['t_sanyou'];
    }
    //获取天胡如果有用户自定义的天胡,就用用户自定义的天胡
    get_t_tianhu(){
        if(this.customcfg['t_tianhu']!=null)
        {
          return this.customcfg['t_tianhu'];
        }
        return this.defaultcfg['t_tianhu'];
    }
    //获取盖宝抢金如果有用户自定义的盖宝抢金,就用用户自定义的盖宝抢金
    get_t_gaibaoqiangjin(){
        if(this.customcfg['t_gaibaoqiangjin']!=null)
        {
          return this.customcfg['t_gaibaoqiangjin'];
        }
        return this.defaultcfg['t_gaibaoqiangjin'];
    }
    //获取十三幺如果有用户自定义的十三幺,就用用户自定义的十三幺
    get_t_shisanyao(){
        if(this.customcfg['t_shisanyao']!=null)
        {
          return this.customcfg['t_shisanyao'];
        }
        return this.defaultcfg['t_shisanyao'];
    }
    //获取局数选项；8=8局；16=16局；如果有用户自定义的局数选项；8=8局；16=16局；,就用用户自定义的局数选项；8=8局；16=16局；
    get_v_roundcount(){
        if(this.customcfg['v_roundcount']!=null)
        {
          return this.customcfg['v_roundcount'];
        }
        return this.defaultcfg['v_roundcount'];
    }
    //获取人数选项：2=二人麻将；3=三人麻将；4=四人麻将如果有用户自定义的人数选项：2=二人麻将；3=三人麻将；4=四人麻将,就用用户自定义的人数选项：2=二人麻将；3=三人麻将；4=四人麻将
    get_v_seatcount(){
        if(this.customcfg['v_seatcount']!=null)
        {
          return this.customcfg['v_seatcount'];
        }
        return this.defaultcfg['v_seatcount'];
    }
    //获取房费：0=房主支付；1=AA支付；2=赢家支付。如果有用户自定义的房费：0=房主支付；1=AA支付；2=赢家支付。,就用用户自定义的房费：0=房主支付；1=AA支付；2=赢家支付。
    get_v_paytype(){
        if(this.customcfg['v_paytype']!=null)
        {
          return this.customcfg['v_paytype'];
        }
        return this.defaultcfg['v_paytype'];
    }
    //获取游金倍数：5=游金5倍；4=游金4倍。如果有用户自定义的游金倍数：5=游金5倍；4=游金4倍。,就用用户自定义的游金倍数：5=游金5倍；4=游金4倍。
    get_v_youjintype(){
        if(this.customcfg['v_youjintype']!=null)
        {
          return this.customcfg['v_youjintype'];
        }
        return this.defaultcfg['v_youjintype'];
    }
    //获取有金限制下拉选项：2=单金至少自摸，双金至少游金；3=有金至少游金；4=双金至少游金;5=金牌不限制自摸。如果有用户自定义的有金限制下拉选项：2=单金至少自摸，双金至少游金；3=有金至少游金；4=双金至少游金;5=金牌不限制自摸。,就用用户自定义的有金限制下拉选项：2=单金至少自摸，双金至少游金；3=有金至少游金；4=双金至少游金;5=金牌不限制自摸。
    get_b_jinxianzhi(){
        if(this.customcfg['b_jinxianzhi']!=null)
        {
          return this.customcfg['b_jinxianzhi'];
        }
        return this.defaultcfg['b_jinxianzhi'];
    }
    //获取是否开启全自摸模式：0=不开启全自摸；1=全自摸模式。如果有用户自定义的是否开启全自摸模式：0=不开启全自摸；1=全自摸模式。,就用用户自定义的是否开启全自摸模式：0=不开启全自摸；1=全自摸模式。
    get_b_quanzimo(){
        if(this.customcfg['b_quanzimo']!=null)
        {
          return this.customcfg['b_quanzimo'];
        }
        return this.defaultcfg['b_quanzimo'];
    }
    //获取通过另一配置表获得（与人数、局数、支付方式有关系）如果有用户自定义的通过另一配置表获得（与人数、局数、支付方式有关系）,就用用户自定义的通过另一配置表获得（与人数、局数、支付方式有关系）
    get_v_fangfei(){
        if(this.customcfg['v_fangfei']!=null)
        {
          return this.customcfg['v_fangfei'];
        }
        return this.defaultcfg['v_fangfei'];
    }
    //获取跟庄如果有用户自定义的跟庄,就用用户自定义的跟庄
    get_v_genzhuang(){
        if(this.customcfg['v_genzhuang']!=null)
        {
          return this.customcfg['v_genzhuang'];
        }
        return this.defaultcfg['v_genzhuang'];
    }
}
