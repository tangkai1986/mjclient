 
export function g_deepClone(data){
    let str=JSON.stringify(data);
    let obj=JSON.parse(str)
    return obj;
} 
var cacheImgIndex = 0;
var downloadAndSaveHeadImg= function(url,picDir,LocalStorage){
            console.log("downloadAndSaveHeadImg1",picDir)
    let xhr = cc.loader.getXMLHttpRequest(); 
    xhr.timeout = 10000; //毫秒单位
    xhr.ontimeout = function()
    {
        xhr.abort(); //重置 
        //重新请求
        xhr.open("GET", url, true);
        xhr.send();
    }.bind(this);
    xhr.responseType = 'arraybuffer';
    xhr.onreadystatechange = function () 
    {
        if (xhr.readyState === 4 ) {
            if(xhr.status === 200||xhr.status === 304){
                
                if (!jsb.fileUtils.isDirectoryExist(picDir)) {
                    jsb.fileUtils.createDirectory(picDir);
                }
                //保证不会因为cacheImgIndex丢失导致图片存储错乱
                let cacheImgIndexSave = LocalStorage.getData("cacheImgIndex");
                if(cacheImgIndexSave) {
                    cacheImgIndex=cacheImgIndexSave;
                }
                cacheImgIndex++;
                if( jsb.fileUtils.writeDataToFile(new Uint8Array(xhr.response), picDir+`headImg${cacheImgIndex}.jpg`))
                {
                    LocalStorage.setData(url,picDir+`headImg${cacheImgIndex}.jpg`));
                    LocalStorage.setData("cacheImgIndex",cacheImgIndex));
                }
                else
                {
                    console.log('Remote write file failed.');
                }
            }
        }
    }.bind(this);
    xhr.open("GET", url, true);
    xhr.send();
}
window.downloadAndSaveHeadImg = downloadAndSaveHeadImg;
var converHeadSize= function(url)
{
    if (!url) {
        return null;
    }
    let arr=url.split('/')
    let newurl='';
    for(let i=0;i<arr.length-1;++i)
    {
        newurl+=arr[i]
        newurl+='/'
    }
    newurl+=46;
    return newurl;
}
window.converHeadSize = converHeadSize;
 
Array.prototype.removeByValue=function(value){
	var idx = this.findIdx(value);
	if (idx != -1) {
		this.splice(idx,1);
	}
}
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
      if (this[i] === obj) {
        return true;
      }
    }
    return false;
}
Array.prototype.findIdx=function(value){
    for(var j = 0;j <this.length;j++){ 
        if (this[j] == value) {
            return j;
        }
    }
    return -1;
}
Array.prototype.remove=function(index){
 
    if(this.length<=0)
    {
        return;
    }
    for(let j = index;j <this.length-1;j++){ 
        this[j]=this[j+1]; 
    } 
    this.length = this.length-1;
}
Array.prototype.erase=function(from,to){
    if(!to)
        to=from+1
    let count=to-from
    for(let j = from;j <to;j++){ 
        this.remove(from) 
    }  
    return this;
}
Array.prototype.front=function(from,to){
    return this[0]
}
Array.prototype.back=function(from,to){
    return this[this.length-1]
}
Array.prototype.insert = function (index, item) {  

  this.splice(index, 0, item);   
};  
 
Array.prototype.empty=function(){
    return this.length==0;
}

Array.prototype.size=function(){
    return this.length;
}

Array.prototype.begin=function(){
    return 0;
}
Array.prototype.end=function(){
    return this.length;
}
Array.prototype.contain=function(value)
{ 
    for(let j = 0;j <this.length;j++){ 
        if(this[j]==value)
        {
            return true;
        }
    } 
    return false;
}
 