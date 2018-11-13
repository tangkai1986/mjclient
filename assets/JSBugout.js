var sendDic={};
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
				let scene=cc.director.getScene();
				let juhuaNode=scene.getChildByTag(20180325)
			    //去除菊花
				if(juhuaNode)
				{   
					let ctrl=juhuaNode.getComponent('MsgBoxLoadingAni');
					ctrl.forceStop(); 
				} 
				if(window['g_netMgr'])
				{
					window['g_netMgr'].restartTimer();
				}
			  jsbugout.handleError(file,line,msg, error)
			  if (__handler) {
				__handler(file,line,msg, error)
			  }
			}
		}
	}
	
	jsbugout.handleError = function(file,line,msg, error)
	{
		//需要具体错误端
		if(null==msg||undefined==msg)
		{
			return;
		}
		//发送过的类型就不再重复发送
		if(sendDic[msg])
		{
			return;
		}
		sendDic[msg]=true;
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
	  error=error.replace(/\t/g,'&&')
	  error=error.replace(/\n/g,'&&')
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