import RichIconCfg from "../CfgMgrs/RichIconCfg";


export default class RichTextMgr{ 
    //单例处理

    private static _instance:RichTextMgr;
    private ICON_LIST:any = RichIconCfg.getInstance().getRichCfg();
    
    public static getInstance ():RichTextMgr{
        if(!this._instance){
            this._instance = new RichTextMgr();
        }
        return this._instance;
    }
    //图片名转换为字符
    public richTextPicToName(strData){
        let count = this.ICON_LIST.length;
        for (var i = 0; i<count; i++){
            let data = this.ICON_LIST[i];
            if (strData == data.pic){
                return data.text;
            }
        }
        return ""
    }
    //文字解析
    public richTextColor(strData, color:string="#ffffff"){
        if (strData == ""){
            return ""
        }
        var strContent = "";
        strContent = "<color="+color+">"+strData+"</color>"
        return strContent
    }
    //图片解析
    public richTextImg(strData, color:string="#ffffff"){
        if (strData == ""){
            return ""
        }
        let strContent = "",
            strGap = "",
            bolIcon = false,
            count = this.ICON_LIST.length;
        for (var i = 0; i<count; i++){
            let data = this.ICON_LIST[i];
            if (strData == data.text){
                strGap = data.pic;
                bolIcon = true;
                break
            }
        }
        if (bolIcon){
            strContent = "<img src='"+strGap+"' />"
        }else{
            strContent = "<color="+color+">"+strData+"</color>"
        }
        return strContent
    }
    //文字图片解析
    public richTextBlend(strData, color:string="#ffffff"){
        let strContent = "",
            strGap = "",
            strIcon = "",
            bolIcon = false;
        for (var i = 0; i <strData.length ; i++){
            let str = strData.charAt(i);
            if (bolIcon){
                if (str == "]") {
                    bolIcon = false;
                    strIcon = strIcon + str
                    strContent = strContent + this.richTextImg(strIcon, color)
                    strIcon = ""
                }else if (str == "["){
                    strContent = strContent + this.richTextColor(strIcon,color);
                    strIcon = str;
                }else{
                    strIcon = strIcon + str
                }
            }else{
                if (str == "[") {
                    bolIcon = true;
                    strIcon = str;
                    strContent = strContent + this.richTextColor(strGap,color);
                    strGap = "";
                }else{
                    strGap = strGap + str;
                }
            }
        }
        if (strGap != "" || strIcon != ""){
            strContent = strContent + this.richTextColor(strIcon,color);
            strContent = strContent + this.richTextColor(strGap,color);
        }
        return strContent
    }

}