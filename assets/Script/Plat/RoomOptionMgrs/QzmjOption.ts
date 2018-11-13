let getCfg=function(roomCfg)
{ 
    let simpleCfg=[
        '游金:明游',
        '倍数:游金四倍',
    ];
    let fullCfg=[
        {title:'游金:明游',des:['当拥有游金牌型时,可直接选择游金,然后按顺序进行','最后一轮摸牌,摸到花算水']},
        {title:'倍数:游金四倍',des:['游金4倍,双游8倍，三游12倍']},
    ];
    
    let cfg={
        simpleCfg:simpleCfg,
        fullCfg:fullCfg,
    };
    return cfg
}
 