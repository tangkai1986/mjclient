(function() {
	window['__errorUserInfo']={};//错误日志的用户信息
	window['__errorOp']=[];//错误日志的操作信息
	var jsbugout = {};
	window.jsbugout = jsbugout;
	jsbugout.jsbugoutListenning = function()
	{
		if (cc.sys.isNative) {
			let __handler
			if (window['__errorHandler']) {
			  __handler = window['__errorHandler']
			}
			window['__errorHandler'] = function (file,line,msg, error) {
			  console.log('游戏报错,原生系统')
			  jsbugout.handleError(file,line,msg, error)
			  if (__handler) {
				__handler(file,line,msg, error)
			  }
			}
		}
		if(cc.sys.isBrowser)
		{
			
			let __handler
			if (window['onerror']) {
			  __handler = window['onerror']
			}
			window['onerror'] = function (msg,url,line,col,error) {
				//没有URL不上报！上报也不知道错误
				if (msg != "Script error." && !url){
					return true;
				}
				//采用异步的方式
				//我遇到过在window.onunload进行ajax的堵塞上报
				//由于客户端强制关闭webview导致这次堵塞上报有Network Error
				//我猜测这里window.onerror的执行流在关闭前是必然执行的
				//而离开文章之后的上报对于业务来说是可丢失的
				//所以我把这里的执行流放到异步事件去执行
				//脚本的异常数降低了10倍
				setTimeout(function(){
					var data = {};
					//不一定所有浏览器都支持col参数
					col = col || (window.event && window.event.errorCharacter) || 0;
			 
					data.url = url;
					data.line = line;
					data.col = col;
					if (!!error && !!error.stack){
						//如果浏览器有堆栈信息
						//直接使用
						data.msg = error.stack.toString();
					}else if (!!arguments.callee){
						//尝试通过callee拿堆栈信息
						var ext = [];
						var f = arguments.callee.caller, c = 3;
						//这里只拿三层堆栈信息
						while (f && (--c>0)) {
						   ext.push(f.toString());
						   if (f  === f.caller) {
								break;//如果有环
						   }
						   f = f.caller;
						}
						ext = ext.join(",");
						data.msg = error.stack.toString();
					}
					//把data上报到后台！
					jsbugout.handleError(file,line,msg, error)
					if (__handler) {
					__handler(file,line,msg, error)
					}
				},0);
			}
		}
	}
	jsbugout.handleError = function(file,line,msg, error)
	{
		//上报给服务器 
		let xhr = cc.loader.getXMLHttpRequest();   
		xhr.onreadystatechange = function () {  
		};    
		//报告地址
		var url=window['__errorReportUrl'] || "http://120.78.95.186:10001"
		//url="http://192.168.30.28:10001"
		xhr.open("POST",url,true); 
		xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
		var ops=window['__errorOp'];
		var opstr="";
		for(var i = 0;i<ops.length;++i)
		{
			opstr+=ops[i]
			if(i<ops.length-1)
			{
				opstr+='>>'
			}
		}
		var data={
			ops:opstr,
			userinfo:window['__errorUserInfo'],
			stack:{
				file:file,
				msg,msg,
				line:line,
				error:error,
			}
		}
		xhr.send(JSON.stringify(data)); 
	}
	jsbugout.jsbugoutListenning();
	module.exports = jsbugout;
})();