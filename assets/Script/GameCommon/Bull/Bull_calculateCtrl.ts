/*
author: YOYO
日期:2018-02-06 11:44:11
牛牛计算牌型UI
*/
import BaseModel from "../../Plat/Libs/BaseModel";
import BaseView from "../../Plat/Libs/BaseView";
import BaseCtrl from "../../Plat/Libs/BaseCtrl";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Bull_calculateCtrl;
//模型，数据处理
class Model extends BaseModel{
	constructor()
	{
		super();

	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        lbl_num4:null,
	};
    node=null;
    private list_lbls:Array<cc.Label> = null
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
        this.ui.lbl_num4 = ctrl.lbl_num4;
        ctrl.lbl_num1.string = '';
        ctrl.lbl_num2.string = '';
        ctrl.lbl_num3.string = '';
        ctrl.lbl_num4.string = '';
        this.list_lbls = [
            ctrl.lbl_num1,
            ctrl.lbl_num2,
            ctrl.lbl_num3
        ]
    }
    
    //增加多个数值
    addValue(valueList:Array<number>){
        let len = this.list_lbls.length,
            i,
            curLbl,
            value;
        for(i = 0; i < len; i ++){
            curLbl = this.list_lbls[i];
            if(!curLbl.string && valueList.length > 0){
                curLbl.string = this.parseValue(valueList.splice(0, 1)[0]);
            }
        }
        this.showResult();
    }
    //减少多个数值
    delValue(delValueList:Array<number>){
        let len = this.list_lbls.length,
            i,
            j,
            curLbl;
        for(i = 0; i < len; i ++){
            curLbl = this.list_lbls[i];
            if(curLbl.string){
                for(j = 0; j < delValueList.length; j ++){
                    if(this.parseValue(delValueList[j]) == curLbl.string){
                        curLbl.string = '';
                        delValueList.splice(j, 1);
                        break;
                    }
                }
            }
        }
        this.showResult();
    }
    //清理数值
    clearValue(){
        let len = this.list_lbls.length,
            i,
            curLbl;
        for(i = 0; i < len; i ++){
            curLbl = this.list_lbls[i];
            curLbl.string = '';
        }
        this.ui.lbl_num4.string = '';
    }

    //=======================
    //显示结果
    private showResult(){
        let len = this.list_lbls.length,
            i,
            curLbl,
            resultValue = 0;
        for(i = 0; i < len; i ++){
            curLbl = this.list_lbls[i];
            if(curLbl.string){
                resultValue += parseInt(curLbl.string);
            }else{
                this.ui.lbl_num4.string = '';
                return;
            }
        }
        this.ui.lbl_num4.string = resultValue;
    }
    private parseValue(value){
        let result;
        switch(value){
            case "a":
                result = 10;
                break;
            case "b":
                result = 10;
                break;
            case "c":
                result = 10;
                break;
            case "d":
                result = 10;
                break;
            default:
                result = value;
                break;
        }
        return result
    }
}
//c, 控制
@ccclass
export default class Bull_calculateCtrl extends BaseCtrl {
    model:Model = null
    view:View = null
	//这边去声明ui组件
    @property(cc.Label)
    lbl_num1:cc.Label = null
    @property(cc.Label)
    lbl_num2:cc.Label = null
    @property(cc.Label)
    lbl_num3:cc.Label = null
    @property(cc.Label)
    lbl_num4:cc.Label = null
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model,View);
	}

	//定义网络事件
	defineNetEvents()
	{
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
    //end
    
    addValues(valueList:Array<number>){
        this.view.addValue(valueList);
    }
    delValues(valueList:Array<number>){
        this.view.delValue(valueList);
    }
}