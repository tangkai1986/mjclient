/**
	由于 link 模板不适合 ios 出包
	所以改模板下的 android 工程已合并到 binary 模板
	请用 binary 模板打包

	windows 平台一键打包 APK 脚本
	提供给各位开发人员打 debug 测试包
	默认不包括热更新
	如需要热更测试请把 99、100行的 // 去掉
	
	打包环境:
		nodejs:
			version: v8.9.4
		ndk:
			version: android-ndk-r10e
			path: D:\android-ndk-r10e
		sdk:
			path: D:\Android-SDK
		ant:
			version: apache-ant-1.10.1
			path: D:\apache-ant-1.10.1
		gradle:
			version: gradle-4.5.1
			path: D:\gradle-4.5.1
		CocosCreator:
			version: 1.9
			path: D:\CocosCreator
		maindev:
			path: E:\p2\maindev-client-debug
	
	安装 nodejs 依赖库 shelljs:
		npm install shelljs -g

	检查以下文件里配置的路径是否符合本地项目实际路径
		build/jsb-link/frameworks/runtime-src/proj.android-studio/app/build.gradle
		build/jsb-link/frameworks/runtime-src/proj.android-studio/app/local.properties
		build/jsb-link/frameworks/runtime-src/proj.android-studio/app/project.properties
		build/jsb-link/frameworks/runtime-src/proj.android-studio/build-cfg.json
		build/jsb-link/frameworks/runtime-src/proj.android-studio/gradle.properties
		build/jsb-link/frameworks/runtime-src/proj.android-studio/local.properties
		build/jsb-link/frameworks/runtime-src/proj.android-studio/settings.gradle
		build/jsb-link/frameworks/runtime-src/proj.android/ant.properties
	
	运行 node build-for-win.js 语句执行一键打包脚本
	APK 将生成在当前目录
 */

require('shelljs/global')

let
    cccInstallRoute="C:\\CocosCreator\\CocosCreator.exe",
    template="binary",
    ASWP=`../build/jsb-${template}/frameworks/runtime-src/proj.android-studio/`,
    delShellArr = [
        `rm -rf ../build/jsb-${template}/'js backups (useful for debugging)'`,
        `rm -rf ../build/jsb-${template}/res`,
        `rm -rf ../build/jsb-${template}/src`,
        `rm -rf ../build/newversion`,
        `rm ../build/jsb-${template}/main.js`,
        `rm ../build/jsb-${template}/project.json`,
        `rm ../build/jsb-${template}/md5dic.json`,
        `rm ../build/jsb-${template}/version.json`
    ],
    debug="true",
    inlineSpriteFrames="true",
    packageName="com.bamingmajiangshijie.wmwb",
    encryptJs="true",
    xxteaKey="0fb239d5-a288-4f",
    zipCompressJs="true",
    useDebugKeystore="false",
    keystorePath=`${ASWP}wmdzwp.keystore`,
    keystorePassword="wmdzwp",
    keystoreAlias="wmdzwp",
    keystoreAliasPassword="wmdzwp",
    apiLevel="android-19",
    appABIs="['armeabi-v7a','x86']",
    androidStudio="true"

for (let i=0; i<delShellArr.length; i++) {
    exec(delShellArr[i]);
}

exec(`cp ${ASWP}/local.properties ./`)
exec([
    `${cccInstallRoute} --path ../ --build \"`,
    "platform=android;",
    `debug=${debug};`,
    `inlineSpriteFrames=${inlineSpriteFrames};`,
    `packageName=${packageName};`,
    `template=${template};`,
    `useDebugKeystore=${useDebugKeystore};`,
    `keystorePath=${keystorePath};`,
    `keystorePassword=${keystorePassword};`,
    `keystoreAlias=${keystoreAlias};`,
    `keystoreAliasPassword=${keystoreAliasPassword};`,
    `apiLevel=${apiLevel};`,
    `appABIs=${appABIs};`,
    `androidStudio=${androidStudio};`,
    `encryptJs=${encryptJs};`,
    `zipCompressJs=${zipCompressJs}\"`
].join(""))
exec(`cp ./local.properties ${ASWP}`)
exec("node createmanifest.js")
exec(`cp ../main.js ../build/jsb-${template}/`)
//exec(`cd ${ASWP} && gradle assemblerelease`)
//exec(`cp ${ASWP}app/build/outputs/apk/release/dzwp-release.apk ./`)
