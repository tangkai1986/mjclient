//fzmj属性配置,包含算分，以及各种事件开关
export default class FzmjProp {
    private customcfg=null;
    private defaultcfg={
        v_difen:0,//底分
        v_huapai:1,//花牌
        v_huagang:6,//花杠
        v_jinpai:1,//金牌
        v_ptangang:3,//普通暗杠
        v_ptminggang:2,//普通明杠
        v_zhuangdifen:1,//庄家连庄分
        t_chihu:1,//吃胡
        t_zimo:2,//自摸
        v_tianhu:30,//天胡分数
        v_qiangjin:30,//抢金
        v_wuhuawugang:30,//无花无杠
        v_yizhanghua:15,//一张花
        v_sanjindao:40,//三金倒
        v_jinque:60,//金雀
        v_jinlong:120,//金龙
        v_hunyise:120,//混一色
        v_qingyise:240,//清一色
        v_roundcount:8,//局数选项；8=8局；16=16局
        v_seatcount:4,//人数选项：2=二人麻将；3=三人麻将；4=四人麻将
        v_paytype:2,//房费：0=房主支付；1=AA支付。
        v_fangfu:2,//放胡计算选项：2=胡牌吃三家；1=放胡单赔；0=放胡赔双倍。
        v_fangfei:99,//通过另一配置表获得（与人数、局数、支付方式有关系）
        b_qinghunyise:1,//玩法选项清混一色（默认选中）
        b_daihuapai:1,//玩法选项带花牌（默认选中）
        b_jinlong:1,//玩法选项金龙（默认选中）
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
    //获取花杠如果有用户自定义的花杠,就用用户自定义的花杠
    get_v_huagang(){
        if(this.customcfg['v_huagang']!=null)
        {
          return this.customcfg['v_huagang'];
        }
        return this.defaultcfg['v_huagang'];
    }
    //获取金牌如果有用户自定义的金牌,就用用户自定义的金牌
    get_v_jinpai(){
        if(this.customcfg['v_jinpai']!=null)
        {
          return this.customcfg['v_jinpai'];
        }
        return this.defaultcfg['v_jinpai'];
    }
    //获取普通暗杠如果有用户自定义的普通暗杠,就用用户自定义的普通暗杠
    get_v_ptangang(){
        if(this.customcfg['v_ptangang']!=null)
        {
          return this.customcfg['v_ptangang'];
        }
        return this.defaultcfg['v_ptangang'];
    }
    //获取普通明杠如果有用户自定义的普通明杠,就用用户自定义的普通明杠
    get_v_ptminggang(){
        if(this.customcfg['v_ptminggang']!=null)
        {
          return this.customcfg['v_ptminggang'];
        }
        return this.defaultcfg['v_ptminggang'];
    }
    //获取庄家连庄分如果有用户自定义的庄家连庄分,就用用户自定义的庄家连庄分
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
    //获取天胡分数如果有用户自定义的天胡分数,就用用户自定义的天胡分数
    get_v_tianhu(){
        if(this.customcfg['v_tianhu']!=null)
        {
          return this.customcfg['v_tianhu'];
        }
        return this.defaultcfg['v_tianhu'];
    }
    //获取抢金如果有用户自定义的抢金,就用用户自定义的抢金
    get_v_qiangjin(){
        if(this.customcfg['v_qiangjin']!=null)
        {
          return this.customcfg['v_qiangjin'];
        }
        return this.defaultcfg['v_qiangjin'];
    }
    //获取无花无杠如果有用户自定义的无花无杠,就用用户自定义的无花无杠
    get_v_wuhuawugang(){
        if(this.customcfg['v_wuhuawugang']!=null)
        {
          return this.customcfg['v_wuhuawugang'];
        }
        return this.defaultcfg['v_wuhuawugang'];
    }
    //获取一张花如果有用户自定义的一张花,就用用户自定义的一张花
    get_v_yizhanghua(){
        if(this.customcfg['v_yizhanghua']!=null)
        {
          return this.customcfg['v_yizhanghua'];
        }
        return this.defaultcfg['v_yizhanghua'];
    }
    //获取三金倒如果有用户自定义的三金倒,就用用户自定义的三金倒
    get_v_sanjindao(){
        if(this.customcfg['v_sanjindao']!=null)
        {
          return this.customcfg['v_sanjindao'];
        }
        return this.defaultcfg['v_sanjindao'];
    }
    //获取金雀如果有用户自定义的金雀,就用用户自定义的金雀
    get_v_jinque(){
        if(this.customcfg['v_jinque']!=null)
        {
          return this.customcfg['v_jinque'];
        }
        return this.defaultcfg['v_jinque'];
    }
    //获取金龙如果有用户自定义的金龙,就用用户自定义的金龙
    get_v_jinlong(){
        if(this.customcfg['v_jinlong']!=null)
        {
          return this.customcfg['v_jinlong'];
        }
        return this.defaultcfg['v_jinlong'];
    }
    //获取混一色如果有用户自定义的混一色,就用用户自定义的混一色
    get_v_hunyise(){
        if(this.customcfg['v_hunyise']!=null)
        {
          return this.customcfg['v_hunyise'];
        }
        return this.defaultcfg['v_hunyise'];
    }
    //获取清一色如果有用户自定义的清一色,就用用户自定义的清一色
    get_v_qingyise(){
        if(this.customcfg['v_qingyise']!=null)
        {
          return this.customcfg['v_qingyise'];
        }
        return this.defaultcfg['v_qingyise'];
    }
    //获取局数选项；8=8局；16=16局如果有用户自定义的局数选项；8=8局；16=16局,就用用户自定义的局数选项；8=8局；16=16局
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
    //获取房费：0=房主支付；1=AA支付。如果有用户自定义的房费：0=房主支付；1=AA支付。,就用用户自定义的房费：0=房主支付；1=AA支付。
    get_v_paytype(){
        if(this.customcfg['v_paytype']!=null)
        {
          return this.customcfg['v_paytype'];
        }
        return this.defaultcfg['v_paytype'];
    }
    //获取放胡计算选项：2=胡牌吃三家；1=放胡单赔；0=放胡赔双倍。如果有用户自定义的放胡计算选项：2=胡牌吃三家；1=放胡单赔；0=放胡赔双倍。,就用用户自定义的放胡计算选项：2=胡牌吃三家；1=放胡单赔；0=放胡赔双倍。
    get_v_fangfu(){
        if(this.customcfg['v_fangfu']!=null)
        {
          return this.customcfg['v_fangfu'];
        }
        return this.defaultcfg['v_fangfu'];
    }
    //获取通过另一配置表获得（与人数、局数、支付方式有关系）如果有用户自定义的通过另一配置表获得（与人数、局数、支付方式有关系）,就用用户自定义的通过另一配置表获得（与人数、局数、支付方式有关系）
    get_v_fangfei(){
        if(this.customcfg['v_fangfei']!=null)
        {
          return this.customcfg['v_fangfei'];
        }
        return this.defaultcfg['v_fangfei'];
    }
    //获取玩法选项清混一色（默认选中）如果有用户自定义的玩法选项清混一色（默认选中）,就用用户自定义的玩法选项清混一色（默认选中）
    get_b_qinghunyise(){
        if(this.customcfg['b_qinghunyise']!=null)
        {
          return this.customcfg['b_qinghunyise'];
        }
        return this.defaultcfg['b_qinghunyise'];
    }
    //获取玩法选项带花牌（默认选中）如果有用户自定义的玩法选项带花牌（默认选中）,就用用户自定义的玩法选项带花牌（默认选中）
    get_b_daihuapai(){
        if(this.customcfg['b_daihuapai']!=null)
        {
          return this.customcfg['b_daihuapai'];
        }
        return this.defaultcfg['b_daihuapai'];
    }
    //获取玩法选项金龙（默认选中）如果有用户自定义的玩法选项金龙（默认选中）,就用用户自定义的玩法选项金龙（默认选中）
    get_b_jinlong(){
        if(this.customcfg['b_jinlong']!=null)
        {
          return this.customcfg['b_jinlong'];
        }
        return this.defaultcfg['b_jinlong'];
    }
}
