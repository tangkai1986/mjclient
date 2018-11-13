//qzmj属性配置,包含算分，以及各种事件开关
export default class QgmjProp {
    private customcfg=null;
    private defaultcfg={
        v_difen:5,//底分
        v_huapai:1,//花牌
        v_jinpai:1,//金牌
        v_ziangang:4,//字暗杠
        v_ptangang:3,//普通暗杠
        v_ziminggang:3,//字明杠
        v_ptminggang:2,//普通明杠
        v_zianke:2,//字暗刻
        v_ptanke:1,//普通暗刻
        v_zimingke:1,//字明刻
        v_ptmingke:0,//普通明刻
        v_zhuangdifen:2,//庄家底分
        t_chihu:1,//吃胡
        t_zimo:2,//自摸
        t_qiangganghu:2,//抢杠胡
        t_sanjindao:3,//三金倒
        t_bazhanghua:3,//八张花
        t_youjin:3,//游金
        t_shuangyou:6,//双游
        t_sanyou:9,//三游
        v_roundcount:8,//局数选项；8=8局；16=16局；一课=一课模式
        v_seatcount:4,//人数选项：2=二人麻将；3=三人麻将；4=四人麻将
        v_paytype:1,//房费：0=房主支付；1=AA支付；2=赢家支付。
        v_youjintype:0,//游金倍数：3=游金3倍；4=游金4倍。
        b_hupai:0,//胡牌计算选项：0=胡牌吃三家；1=放胡单赔。
        v_youjinjiangli:25,//游金奖励输入框，默认输入25
        v_shasanjiangli:50,//杀三奖励输入框，默认输入50
        b_jinxianzhi:1,//有金限制下拉选项：0=单金可平胡，双金可平胡；1=单金可平胡，双金至少自摸；2=单金至少自摸，双金至少游金；3=单金至少游金。
        b_yike:0,//是否开启一课模式：0=不开启一课；1=一课模式。
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
    //获取花牌如果有用户自定义的花牌,就用用户自定义的花牌
    get_v_huapai(){
        if(this.customcfg['v_huapai']!=null)
        {
          return this.customcfg['v_huapai'];
        }
        return this.defaultcfg['v_huapai'];
    }
    //获取金牌如果有用户自定义的金牌,就用用户自定义的金牌
    get_v_jinpai(){
        if(this.customcfg['v_jinpai']!=null)
        {
          return this.customcfg['v_jinpai'];
        }
        return this.defaultcfg['v_jinpai'];
    }
    //获取字暗杠如果有用户自定义的字暗杠,就用用户自定义的字暗杠
    get_v_ziangang(){
        if(this.customcfg['v_ziangang']!=null)
        {
          return this.customcfg['v_ziangang'];
        }
        return this.defaultcfg['v_ziangang'];
    }
    //获取普通暗杠如果有用户自定义的普通暗杠,就用用户自定义的普通暗杠
    get_v_ptangang(){
        if(this.customcfg['v_ptangang']!=null)
        {
          return this.customcfg['v_ptangang'];
        }
        return this.defaultcfg['v_ptangang'];
    }
    //获取字明杠如果有用户自定义的字明杠,就用用户自定义的字明杠
    get_v_ziminggang(){
        if(this.customcfg['v_ziminggang']!=null)
        {
          return this.customcfg['v_ziminggang'];
        }
        return this.defaultcfg['v_ziminggang'];
    }
    //获取普通明杠如果有用户自定义的普通明杠,就用用户自定义的普通明杠
    get_v_ptminggang(){
        if(this.customcfg['v_ptminggang']!=null)
        {
          return this.customcfg['v_ptminggang'];
        }
        return this.defaultcfg['v_ptminggang'];
    }
    //获取字暗刻如果有用户自定义的字暗刻,就用用户自定义的字暗刻
    get_v_zianke(){
        if(this.customcfg['v_zianke']!=null)
        {
          return this.customcfg['v_zianke'];
        }
        return this.defaultcfg['v_zianke'];
    }
    //获取普通暗刻如果有用户自定义的普通暗刻,就用用户自定义的普通暗刻
    get_v_ptanke(){
        if(this.customcfg['v_ptanke']!=null)
        {
          return this.customcfg['v_ptanke'];
        }
        return this.defaultcfg['v_ptanke'];
    }
    //获取字明刻如果有用户自定义的字明刻,就用用户自定义的字明刻
    get_v_zimingke(){
        if(this.customcfg['v_zimingke']!=null)
        {
          return this.customcfg['v_zimingke'];
        }
        return this.defaultcfg['v_zimingke'];
    }
    //获取普通明刻如果有用户自定义的普通明刻,就用用户自定义的普通明刻
    get_v_ptmingke(){
        if(this.customcfg['v_ptmingke']!=null)
        {
          return this.customcfg['v_ptmingke'];
        }
        return this.defaultcfg['v_ptmingke'];
    }
    //获取庄家底分如果有用户自定义的庄家底分,就用用户自定义的庄家底分
    get_v_zhuangdifen(){
        if(this.customcfg['v_zhuangdifen']!=null)
        {
          return this.customcfg['v_zhuangdifen'];
        }
        return this.defaultcfg['v_zhuangdifen'];
    }
    //获取吃胡如果有用户自定义的吃胡,就用用户自定义的吃胡
    get_t_chihu(){
        if(this.customcfg['t_chihu']!=null)
        {
          return this.customcfg['t_chihu'];
        }
        return this.defaultcfg['t_chihu'];
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
    //获取八张花如果有用户自定义的八张花,就用用户自定义的八张花
    get_t_bazhanghua(){
        if(this.customcfg['t_bazhanghua']!=null)
        {
          return this.customcfg['t_bazhanghua'];
        }
        return this.defaultcfg['t_bazhanghua'];
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
    //获取局数选项；8=8局；16=16局；一课=一课模式如果有用户自定义的局数选项；8=8局；16=16局；一课=一课模式,就用用户自定义的局数选项；8=8局；16=16局；一课=一课模式
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
    //获取游金倍数：3=游金3倍；4=游金4倍。如果有用户自定义的游金倍数：3=游金3倍；4=游金4倍。,就用用户自定义的游金倍数：3=游金3倍；4=游金4倍。
    get_v_youjintype(){
        if(this.customcfg['v_youjintype']!=null)
        {
          return this.customcfg['v_youjintype'];
        }
        return this.defaultcfg['v_youjintype'];
    }
    //获取胡牌计算选项：0=胡牌吃三家；1=放胡单赔。如果有用户自定义的胡牌计算选项：0=胡牌吃三家；1=放胡单赔。,就用用户自定义的胡牌计算选项：0=胡牌吃三家；1=放胡单赔。
    get_b_hupai(){
        if(this.customcfg['b_hupai']!=null)
        {
          return this.customcfg['b_hupai'];
        }
        return this.defaultcfg['b_hupai'];
    }
    //获取游金奖励输入框，默认输入25如果有用户自定义的游金奖励输入框，默认输入25,就用用户自定义的游金奖励输入框，默认输入25
    get_v_youjinjiangli(){
        if(this.customcfg['v_youjinjiangli']!=null)
        {
          return this.customcfg['v_youjinjiangli'];
        }
        return this.defaultcfg['v_youjinjiangli'];
    }
    //获取杀三奖励输入框，默认输入50如果有用户自定义的杀三奖励输入框，默认输入50,就用用户自定义的杀三奖励输入框，默认输入50
    get_v_shasanjiangli(){
        if(this.customcfg['v_shasanjiangli']!=null)
        {
          return this.customcfg['v_shasanjiangli'];
        }
        return this.defaultcfg['v_shasanjiangli'];
    }
    //获取有金限制下拉选项：0=单金可平胡，双金可平胡；1=单金可平胡，双金至少自摸；2=单金至少自摸，双金至少游金；3=单金至少游金。如果有用户自定义的有金限制下拉选项：0=单金可平胡，双金可平胡；1=单金可平胡，双金至少自摸；2=单金至少自摸，双金至少游金；3=单金至少游金。,就用用户自定义的有金限制下拉选项：0=单金可平胡，双金可平胡；1=单金可平胡，双金至少自摸；2=单金至少自摸，双金至少游金；3=单金至少游金。
    get_b_jinxianzhi(){
        if(this.customcfg['b_jinxianzhi']!=null)
        {
          return this.customcfg['b_jinxianzhi'];
        }
        return this.defaultcfg['b_jinxianzhi'];
    }
    //获取是否开启一课模式：0=不开启一课；1=一课模式。如果有用户自定义的是否开启一课模式：0=不开启一课；1=一课模式。,就用用户自定义的是否开启一课模式：0=不开启一课；1=一课模式。
    get_b_yike(){
        if(this.customcfg['b_yike']!=null)
        {
          return this.customcfg['b_yike'];
        }
        return this.defaultcfg['b_yike'];
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
